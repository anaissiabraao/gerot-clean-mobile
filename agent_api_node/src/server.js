import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import formbody from '@fastify/formbody'
import secureSession from '@fastify/secure-session'
import bcrypt from 'bcryptjs'

import { createPool, withTx } from './db.js'
import { verifyAgentApiKey } from './auth.js'
import { clampInt, jsonResponse, parseJsonFromBuffer } from './utils.js'

const app = Fastify({
  logger: true,
  bodyLimit: Number.parseInt(process.env.BODY_LIMIT_BYTES || `${20 * 1024 * 1024}`, 10),
  trustProxy: String(process.env.TRUST_PROXY || (process.env.NODE_ENV === 'production' ? 'true' : 'false')).toLowerCase() === 'true',
})

const upstreamFlaskUrl = (process.env.UPSTREAM_FLASK_URL || '').trim().replace(/\/+$/, '')

await app.register(cors, {
  origin: true,
  credentials: true,
})

await app.register(cookie)

await app.register(formbody)

const sessionSecret = (process.env.SESSION_SECRET || '').toString()
if (!sessionSecret) {
  app.log.warn('SESSION_SECRET não configurada; login por sessão ficará indisponível')
} else {
  const secretBuf = Buffer.from(sessionSecret, 'utf-8')
  const sameSite = (process.env.COOKIE_SAMESITE || 'none').toString().toLowerCase()
  await app.register(secureSession, {
    cookieName: 'gerot_session',
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none' ? sameSite : 'none',
      secure: String(process.env.COOKIE_SECURE || 'true').toLowerCase() === 'true',
    },
    key: secretBuf.length >= 32 ? secretBuf.subarray(0, 32) : Buffer.concat([secretBuf, Buffer.alloc(32 - secretBuf.length)]),
  })
}

app.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer', bodyLimit: Number.parseInt(process.env.BODY_LIMIT_BYTES || `${20 * 1024 * 1024}`, 10) },
  (req, body, done) => {
    const parsed = parseJsonFromBuffer(body, req.headers['content-encoding'])
    if (parsed === null) {
      done(new Error('Invalid JSON'))
      return
    }
    done(null, parsed)
  },
)

const pool = createPool()

const frontendUrl = (process.env.FRONTEND_URL || process.env.FRONTEND_APP_URL || '').trim().replace(/\/+$/, '')
const frontendOrigin = (() => {
  try {
    return frontendUrl ? new URL(frontendUrl).origin : ''
  } catch {
    return ''
  }
})()
const seedAdminKey = (process.env.SEED_ADMIN_KEY || '').toString().trim()

app.get('/login', async (req, reply) => {
  const next = (req.query?.next || '').toString()
  const frontendLogin = frontendUrl ? `${frontendUrl}/login` : ''
  const nextIsFrontendLogin = frontendLogin && next.startsWith(frontendLogin)

  let safeNext = ''
  if (next && !nextIsFrontendLogin) {
    try {
      const parsed = new URL(next, frontendOrigin || undefined)
      if (!frontendOrigin || parsed.origin === frontendOrigin) {
        safeNext = parsed.pathname + parsed.search
      }
    } catch {
      // ignore invalid URL; drop next
    }
  }

  if (frontendUrl) {
    const target = `${frontendUrl}/login${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ''}`
    return reply.code(302).header('location', target).send()
  }

  reply.header('content-type', 'text/html; charset=utf-8')
  return reply.send(
    `<!doctype html>
    <html lang="pt-BR">
      <head><meta charset="utf-8"><title>Login</title></head>
      <body>
        <h1>Login</h1>
        <p>Envie credenciais via POST /login (form-urlencoded) ou configure FRONTEND_URL para redirecionar ao SPA.</p>
        ${next ? `<p>Próximo: ${next}</p>` : ''}
      </body>
    </html>`
  )
})

app.post('/login', async (req, reply) => {
  const body = req.body || {}
  const usernameRaw = (body.username || body.email || '').toString().trim()
  const password = (body.password || '').toString()

  if (!usernameRaw || !password) {
    return jsonResponse(reply, 400, { error: 'username e password são obrigatórios' })
  }

  const username = usernameRaw.toLowerCase()

  try {
    const row = await withTx(pool, async (client) => {
      const res = await client.query(
        `
        SELECT id, username, email, role, is_admin, permissions, password
        FROM users_new
        WHERE LOWER(username) = $1 OR LOWER(email) = $1
        LIMIT 1
        `,
        [username],
      )
      return res.rows?.[0] || null
    })

    if (!row) {
      return jsonResponse(reply, 401, { error: 'Credenciais inválidas' })
    }

    const rawHash = Buffer.isBuffer(row.password) ? row.password.toString() : row.password
    const storedHash = rawHash ? rawHash.toString() : ''

    if (!storedHash || !storedHash.startsWith('$2')) {
      return jsonResponse(reply, 401, { error: 'Credenciais inválidas' })
    }

    try {
      const ok = await bcrypt.compare(password, storedHash)
      if (!ok) {
        return jsonResponse(reply, 401, { error: 'Credenciais inválidas' })
      }
    } catch (err) {
      req.log.error({ err }, '[AUTH] Hash inválido/bcrypt erro')
      return jsonResponse(reply, 401, { error: 'Credenciais inválidas' })
    }

    if (req.session && typeof req.session.set === 'function') {
      req.session.set('user', {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        is_admin: row.is_admin,
        permissions: row.permissions || {},
      })
    }

    return jsonResponse(reply, 200, {
      success: true,
      user: {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        is_admin: row.is_admin,
        permissions: row.permissions || {},
      },
    })
  } catch (err) {
    req.log.error({ err }, '[AUTH] Falha no login')
    return jsonResponse(reply, 500, { error: 'Erro ao autenticar' })
  }
})

app.post('/logout', async (req, reply) => {
  try {
    if (req.session && typeof req.session.delete === 'function') {
      req.session.delete()
    }
  } catch (err) {
    req.log.error({ err }, '[AUTH] Falha ao limpar sessão')
  }
  return jsonResponse(reply, 200, { success: true })
})

// Admin seeder (protected by SEED_ADMIN_KEY header x-seed-key)
app.post('/admin/seed-admin', async (req, reply) => {
  if (!seedAdminKey) {
    return jsonResponse(reply, 404, { error: 'Indisponível' })
  }
  const key = (req.headers['x-seed-key'] || '').toString().trim()
  if (!key || key !== seedAdminKey) {
    return jsonResponse(reply, 401, { error: 'Chave inválida' })
  }

  const body = req.body || {}
  const username = (body.username || 'admin').toString().trim().toLowerCase() || 'admin'
  const email = (body.email || 'admin@gerot').toString().trim() || 'admin@gerot'
  const password = (body.password || '').toString()

  if (!password) {
    return jsonResponse(reply, 400, { error: 'password obrigatório' })
  }

  try {
    const hash = await bcrypt.hash(password, 12)
    await withTx(pool, async (client) => {
      await client.query(
        `
        INSERT INTO users_new (username, email, password, role, is_admin, permissions, is_active, first_login)
        VALUES ($1, $2, convert_to($3, 'utf8'), 'admin', true, '{}'::jsonb, true, false)
        ON CONFLICT (username)
        DO UPDATE SET
          password = excluded.password,
          role = 'admin',
          is_admin = true,
          permissions = '{}'::jsonb,
          is_active = true,
          first_login = false
        `,
        [username, email, hash],
      )
    })

    return jsonResponse(reply, 200, { success: true, username })
  } catch (err) {
    req.log.error({ err }, '[AUTH] Falha ao semear admin')
    return jsonResponse(reply, 500, { error: 'Erro ao semear admin' })
  }
})

function getSessionUser(req) {
  return (req.session && typeof req.session.get === 'function' ? req.session.get('user') : null) || null
}

function isGlobalAdmin(user) {
  return Boolean(user?.is_admin)
}

function requireLogin(req, reply) {
  const user = getSessionUser(req)
  if (!user) {
    jsonResponse(reply, 401, { error: 'Login obrigatório' })
    return null
  }
  return user
}

const ADMIN_ROLE_NAMES = new Set(['admin', 'superadmin', 'controladoria'])

function isAdminUser(user) {
  if (!user) return false
  const role = (user?.role || '').toString().toLowerCase()
  return Boolean(user.is_admin) || ADMIN_ROLE_NAMES.has(role)
}

function requireAdmin(req, reply) {
  const user = requireLogin(req, reply)
  if (!user) return null
  if (!isAdminUser(user)) {
    jsonResponse(reply, 403, { error: 'Acesso negado' })
    return null
  }
  return user
}

async function ensureAgentSettingsKeyUnique(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(
        `
        CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_settings_key
        ON agent_settings(setting_key)
        `,
      )
    })
    app.log.info('[DB] agent_settings(setting_key) unique index OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir unique index em agent_settings(setting_key)')
  }
}

await ensureAgentSettingsKeyUnique(pool)

async function ensureRoomBookingsTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(
        `
        CREATE TABLE IF NOT EXISTS room_bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          room VARCHAR(50) NOT NULL,
          title VARCHAR(200) NOT NULL,
          date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          is_active BOOLEAN NOT NULL DEFAULT TRUE
        )
        `,
      )
      await client.query('CREATE INDEX IF NOT EXISTS idx_room_bookings_user_date ON room_bookings(user_id, date)')
    })
    app.log.info('[DB] room_bookings table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela room_bookings')
  }
}

await ensureRoomBookingsTable(pool)

const CHART_PERMISSION_KEYS = [
  'volumeMensal',
  'operacoesPorStatus',
  'performanceMotoristas',
  'tendenciaAcumulada',
  'resultadoPorServico',
  'composicaoAgentes',
  'heatmapAgentes',
]

async function ensureUsersGovernanceColumns(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        ALTER TABLE users_new
        ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
      `)
      await client.query(`
        ALTER TABLE users_new
        ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE
      `)
      await client.query(`
        ALTER TABLE users_new
        ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb
      `)
    })
    app.log.info('[DB] Governança de usuários (role/is_admin/permissions) OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir colunas de governança em users_new')
  }
}

async function ensureDashboardPermissionsTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS dashboard_permissions (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT REFERENCES users_new(id) ON DELETE CASCADE,
          chart_key VARCHAR(100) NOT NULL,
          allowed BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, chart_key)
        )
      `)
      await client.query('CREATE INDEX IF NOT EXISTS idx_dashboard_permissions_user ON dashboard_permissions(user_id)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_dashboard_permissions_chart ON dashboard_permissions(chart_key)')
    })
    app.log.info('[DB] dashboard_permissions table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela dashboard_permissions')
  }
}

await ensureUsersGovernanceColumns(pool)
await ensureDashboardPermissionsTable(pool)

// ===== Ocorrências (PortoEx) =====
const OCORRENCIA_CATEGORIAS = {
  cliente: ['Mudança de endereço', 'Pendência financeira', 'Horário incorreto', 'CNPJ errado', 'Carga não pronta'],
  comercial: [],
  atendimento: [],
  operacao: ['Programação incorreta', 'Saída atrasada', 'Veículo errado'],
  armazem: ['NF não liberada', 'Mercadoria não pronta', 'Pedido suspenso'],
  financeiro: [],
  planejamento: [],
  motorista: [],
  externo: [],
}

const OCORRENCIA_STATUS = ['Aberto', 'Tratado', 'Recorrente', 'Encerrado']
const OCORRENCIA_IMPACTO_OP = ['Baixo', 'Médio', 'Alto', 'Crítico']
const OCORRENCIA_REPROGRAMADO = ['Sim', 'Não']

async function ensureOcorrenciasTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ocorrencias_portoex (
          id BIGSERIAL PRIMARY KEY,
          data DATE NOT NULL,
          filial VARCHAR(50) NOT NULL,
          tipo VARCHAR(80) NOT NULL,
          placa VARCHAR(20),
          motorista VARCHAR(120),
          cliente VARCHAR(160),
          nf_md_oc VARCHAR(120),
          cidade_origem VARCHAR(120),
          cidade_destino VARCHAR(120),
          categoria VARCHAR(40) NOT NULL,
          subcategoria VARCHAR(120) NOT NULL,
          responsavel VARCHAR(120) NOT NULL,
          descricao VARCHAR(200),
          horario_previsto TIMESTAMP,
          horario_ocorrido TIMESTAMP,
          tempo_atraso_min INTEGER,
          impacto_financeiro NUMERIC(14,2),
          impacto_operacional VARCHAR(20),
          reprogramado VARCHAR(5),
          data_reprogramacao DATE,
          causa_raiz VARCHAR(240),
          plano_acao VARCHAR(240),
          status VARCHAR(20) NOT NULL,
          impacto_score INTEGER,
          frequencia INTEGER,
          created_by BIGINT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      await client.query('CREATE INDEX IF NOT EXISTS idx_ocorrencias_data ON ocorrencias_portoex(data)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_ocorrencias_categoria ON ocorrencias_portoex(categoria, subcategoria)')
    })
    app.log.info('[DB] ocorrencias_portoex table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela ocorrencias_portoex')
  }
}

await ensureOcorrenciasTable(pool)

async function ensureRolesTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(60) NOT NULL UNIQUE,
          permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      await client.query('CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name)')
    })
    app.log.info('[DB] roles table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela roles')
  }
}

async function ensureAssetAssignmentsTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS asset_assignments (
          id BIGSERIAL PRIMARY KEY,
          asset_id BIGINT NOT NULL,
          user_id BIGINT,
          group_name VARCHAR(60),
          role_id INTEGER REFERENCES roles(id),
          config JSONB NOT NULL DEFAULT '{}'::jsonb,
          legacy_view BOOLEAN NOT NULL DEFAULT FALSE,
          visivel BOOLEAN NOT NULL DEFAULT TRUE,
          ordem INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      await client.query('CREATE INDEX IF NOT EXISTS idx_asset_assignments_asset ON asset_assignments(asset_id)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_asset_assignments_user ON asset_assignments(user_id)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_asset_assignments_group ON asset_assignments(group_name)')
    })
    app.log.info('[DB] asset_assignments table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela asset_assignments')
  }
}

await ensureRolesTable(pool)
await ensureAssetAssignmentsTable(pool)

async function ensureDashboardConfigChangesTable(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS dashboard_config_changes (
          id BIGSERIAL PRIMARY KEY,
          assignment_id BIGINT REFERENCES asset_assignments(id) ON DELETE SET NULL,
          user_id BIGINT REFERENCES users_new(id) ON DELETE SET NULL,
          change_payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      await client.query('CREATE INDEX IF NOT EXISTS idx_dashboard_config_changes_assignment ON dashboard_config_changes(assignment_id)')
    })
    app.log.info('[DB] dashboard_config_changes table OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir tabela dashboard_config_changes')
  }
}

async function ensureRelatorioMaterializedView(pool) {
  try {
    await withTx(pool, async (client) => {
      await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS mv_relatorio_periodo AS
        SELECT
          date_trunc('month', data)::date AS periodo,
          COUNT(*) AS entregas,
          COALESCE(SUM(impacto_financeiro), 0) AS custo,
          COUNT(*) FILTER (WHERE (reprogramado ILIKE 'sim')) AS reprogramacoes
        FROM ocorrencias_portoex
        GROUP BY 1
      `)
      await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_relatorio_periodo_periodo ON mv_relatorio_periodo(periodo)')
    })
    app.log.info('[DB] mv_relatorio_periodo materialized view OK')
  } catch (err) {
    app.log.error({ err }, '[DB] Falha ao garantir materialized view mv_relatorio_periodo')
  }
}

await ensureDashboardConfigChangesTable(pool)
await ensureRelatorioMaterializedView(pool)

const relatorioCache = new Map()

function buildRelatorioCacheKey(filters) {
  const db = (filters?.database || 'azportoex').toString().trim()
  const start = (filters?.data_inicio || '').toString().trim()
  const end = (filters?.data_fim || '').toString().trim()
  return `${db}:${start}:${end}`
}

function getRelatorioCache(key) {
  const entry = relatorioCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    relatorioCache.delete(key)
    return null
  }
  return entry.payload
}

function setRelatorioCache(key, payload, ttlSeconds = 600) {
  relatorioCache.set(key, { payload, expires: Date.now() + ttlSeconds * 1000 })
}

app.addHook('onRequest', async (req, reply) => {
  if (req.url.startsWith('/api/agent/')) {
    const isHealth = req.url === '/api/agent/health' || req.url.startsWith('/api/agent/health?')
    const isLibrary = req.url.startsWith('/api/agent/library/')
    if (!verifyAgentApiKey(req)) {
      if (isHealth) {
        return
      }
      if (isLibrary) {
        const u = getSessionUser(req)
        const isAdmin = isGlobalAdmin(u)
        if (isAdmin) {
          return
        }
      }
      return jsonResponse(reply, 401, { error: 'API Key inválida' })
    }
  }
})

// ===== Ocorrências API =====
function normalizeOcorrenciaInput(body, sessionUser) {
  const required = ['data', 'filial', 'tipo', 'categoria', 'subcategoria', 'responsavel', 'status']
  const errors = []
  const out = {}

  const str = (v) => (v === undefined || v === null ? '' : String(v).trim())

  for (const key of required) {
    if (!str(body?.[key])) errors.push(`${key} é obrigatório`)
  }

  const descricao = str(body?.descricao)
  if (descricao && descricao.length > 200) errors.push('descricao deve ter até 200 caracteres')

  const categoria = str(body?.categoria).toLowerCase()
  const subcategoria = str(body?.subcategoria)
  const status = str(body?.status)
  const impactoOperacional = str(body?.impacto_operacional)
  const reprogramado = str(body?.reprogramado)

  if (categoria && !Object.keys(OCORRENCIA_CATEGORIAS).includes(categoria)) {
    errors.push('categoria inválida')
  }
  if (categoria && OCORRENCIA_CATEGORIAS[categoria]?.length) {
    const allowedSubs = OCORRENCIA_CATEGORIAS[categoria].map((s) => s.toLowerCase())
    if (!allowedSubs.includes(subcategoria.toLowerCase())) {
      errors.push('subcategoria inválida para categoria')
    }
  }
  if (status && !OCORRENCIA_STATUS.includes(status)) errors.push('status inválido')
  if (impactoOperacional && !OCORRENCIA_IMPACTO_OP.includes(impactoOperacional)) errors.push('impacto_operacional inválido')
  if (reprogramado && !OCORRENCIA_REPROGRAMADO.includes(reprogramado)) errors.push('reprogramado inválido')

  if (errors.length) {
    const e = new Error(errors.join('; '))
    e.statusCode = 400
    throw e
  }

  const parseDate = (v) => {
    const s = str(v)
    if (!s) return null
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
  }

  const parseTs = (v) => {
    const s = str(v)
    if (!s) return null
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }

  const horarioPrevisto = parseTs(body?.horario_previsto)
  const horarioOcorrido = parseTs(body?.horario_ocorrido)
  let tempoAtrasoMin = null
  if (horarioPrevisto && horarioOcorrido) {
    const diff = (new Date(horarioOcorrido).getTime() - new Date(horarioPrevisto).getTime()) / 60000
    tempoAtrasoMin = Math.round(diff)
  }

  const impactoOperacionalScoreMap = { Sem: 1, Baixo: 1, 'Atraso leve': 2, Reprogramação: 3, 'Custo extra': 4, 'Perda cliente/imagem': 5, Baixo: 1, Médio: 2, Alto: 3, Crítico: 4 }
  const freq = Number.parseInt(body?.frequencia ?? 0, 10)
  const impactoScore = (impactoOperacionalScoreMap[impactoOperacional] || 0) * (Number.isFinite(freq) ? freq : 0)

  out.data = parseDate(body?.data)
  out.filial = str(body?.filial)
  out.tipo = str(body?.tipo)
  out.placa = str(body?.placa) || null
  out.motorista = str(body?.motorista) || null
  out.cliente = str(body?.cliente) || null
  out.nf_md_oc = str(body?.nf_md_oc) || null
  out.cidade_origem = str(body?.cidade_origem) || null
  out.cidade_destino = str(body?.cidade_destino) || null
  out.categoria = categoria
  out.subcategoria = subcategoria
  out.responsavel = str(body?.responsavel)
  out.descricao = descricao || null
  out.horario_previsto = horarioPrevisto
  out.horario_ocorrido = horarioOcorrido
  out.tempo_atraso_min = Number.isFinite(tempoAtrasoMin) ? tempoAtrasoMin : null
  out.impacto_financeiro = body?.impacto_financeiro !== undefined && body?.impacto_financeiro !== null ? Number(body?.impacto_financeiro) : null
  out.impacto_operacional = impactoOperacional || null
  out.reprogramado = reprogramado || null
  out.data_reprogramacao = parseDate(body?.data_reprogramacao)
  out.causa_raiz = str(body?.causa_raiz) || null
  out.plano_acao = str(body?.plano_acao) || null
  out.status = status
  out.impacto_score = Number.isFinite(impactoScore) ? impactoScore : null
  out.frequencia = Number.isFinite(freq) ? freq : null
  out.created_by = sessionUser?.id ?? null
  return out
}

async function insertOcorrencia(pool, payload) {
  const cols = Object.keys(payload)
  const placeholders = cols.map((_, idx) => `$${idx + 1}`)
  const values = cols.map((k) => payload[k])
  const res = await withTx(pool, async (client) => {
    const q = await client.query(
      `INSERT INTO ocorrencias_portoex (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
      values,
    )
    return q.rows?.[0] ?? null
  })
  return res
}

async function listOcorrencias(pool, filters) {
  const clauses = []
  const values = []
  const push = (sql, v) => {
    values.push(v)
    clauses.push(sql.replace('$x', `$${values.length}`))
  }

  if (filters.data_inicio) push('data >= $x', filters.data_inicio)
  if (filters.data_fim) push('data <= $x', filters.data_fim)
  if (filters.filial) push('filial = $x', filters.filial)
  if (filters.categoria) push('categoria = $x', filters.categoria)
  if (filters.subcategoria) push('subcategoria = $x', filters.subcategoria)
  if (filters.status) push('status = $x', filters.status)

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const q = await withTx(pool, async (client) => {
    const res = await client.query(
      `SELECT * FROM ocorrencias_portoex ${where} ORDER BY data DESC, created_at DESC LIMIT 500`,
      values,
    )
    return res.rows || []
  })
  return q
}

async function buildOcorrenciasDashboard(pool, filters) {
  const clauses = []
  const values = []
  const push = (sql, v) => {
    values.push(v)
    clauses.push(sql.replace('$x', `$${values.length}`))
  }
  if (filters.data_inicio) push('data >= $x', filters.data_inicio)
  if (filters.data_fim) push('data <= $x', filters.data_fim)
  if (filters.filial) push('filial = $x', filters.filial)
  if (filters.categoria) push('categoria = $x', filters.categoria)
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''

  const rows = await withTx(pool, async (client) => {
    const res = await client.query(`SELECT * FROM ocorrencias_portoex ${where}`, values)
    return res.rows || []
  })

  const totalPorDia = {}
  const porCategoria = {}
  let internas = 0
  let externas = 0
  let custoTotal = 0
  const porCliente = {}
  const porCausa = {}
  const custoPorTipo = {}
  const porVeiculo = {}
  const porFilial = {}
  let reprogramados = 0

  for (const r of rows) {
    const dataKey = r.data?.toISOString?.().slice(0, 10) || r.data
    if (dataKey) totalPorDia[dataKey] = (totalPorDia[dataKey] || 0) + 1
    const cat = r.categoria || 'N/D'
    porCategoria[cat] = (porCategoria[cat] || 0) + 1
    const resp = (r.responsavel || '').toLowerCase()
    if (resp.includes('interno') || resp.includes('operacao') || resp.includes('motorista')) internas += 1
    else externas += 1
    const impactoFin = Number(r.impacto_financeiro || 0) || 0
    custoTotal += impactoFin
    const cli = r.cliente || 'N/D'
    porCliente[cli] = (porCliente[cli] || 0) + 1
    const causa = r.causa_raiz || r.subcategoria || 'N/D'
    porCausa[causa] = (porCausa[causa] || 0) + 1
    const tipo = r.tipo || 'N/D'
    custoPorTipo[tipo] = (custoPorTipo[tipo] || 0) + impactoFin
    const veic = r.placa || 'N/D'
    porVeiculo[veic] = (porVeiculo[veic] || 0) + impactoFin
    const fil = r.filial || 'N/D'
    porFilial[fil] = (porFilial[fil] || 0) + 1
    if ((r.reprogramado || '').toLowerCase() === 'sim') reprogramados += 1
  }

  const total = rows.length
  const toPairsSorted = (obj, byValueDesc = true) =>
    Object.entries(obj)
      .map(([k, v]) => [k, Number(v) || 0])
      .sort((a, b) => (byValueDesc ? b[1] - a[1] : a[1] - b[1]))

  const topClientes = toPairsSorted(porCliente).slice(0, 5)
  const topCausas = toPairsSorted(porCausa).slice(0, 5)
  const reprogramacaoRate = total ? Number(((reprogramados / total) * 100).toFixed(1)) : 0

  const impactoFreqScores = rows
    .map((r) => Number(r.impacto_score || 0))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => b - a)

  return {
    indicators: {
      total_ocorrencias: total,
      custo_total_mensal: Number(custoTotal.toFixed(2)),
      reprogramacao_percent: reprogramacaoRate,
      responsabilidade_interna_percent: total ? Number(((internas / total) * 100).toFixed(1)) : 0,
      responsabilidade_externa_percent: total ? Number(((externas / total) * 100).toFixed(1)) : 0,
      matriz_top_scores: impactoFreqScores.slice(0, 5),
      total_por_dia: totalPorDia,
      por_categoria: porCategoria,
      top_clientes: topClientes,
      top_causas: topCausas,
      custo_por_tipo: custoPorTipo,
      impacto_por_veiculo: porVeiculo,
      por_filial: porFilial,
    },
    cards: [
      { key: 'total_ocorrencias', label: 'Total de ocorrências', format: 'number' },
      { key: 'custo_total_mensal', label: 'Custo total (R$)', format: 'currency' },
      { key: 'reprogramacao_percent', label: 'Taxa de reprogramação', format: 'percent' },
      { key: 'responsabilidade_interna_percent', label: 'Responsabilidade interna', format: 'percent' },
    ],
    widgets: [
      { type: 'bar', key: 'por_categoria', title: 'Ocorrências por categoria' },
      { type: 'bar', key: 'top_clientes', title: 'Top 5 clientes', columns: [{ key: 0, label: 'Cliente' }, { key: 1, label: 'Qtd' }] },
      { type: 'bar', key: 'top_causas', title: 'Top 5 causas', columns: [{ key: 0, label: 'Causa' }, { key: 1, label: 'Qtd' }] },
    ],
    panel_key: 'operacional',
    panel_data: { status: {}, ...filters },
    leitura_executiva: 'Ocorrências PortoEx',
  }
}

app.get('/api/ocorrencias', async (req, reply) => {
  const sessionUser = requireLogin(req, reply)
  if (!sessionUser) return

  const filters = {
    data_inicio: (req.query?.data_inicio || '').toString().trim() || null,
    data_fim: (req.query?.data_fim || '').toString().trim() || null,
    filial: (req.query?.filial || '').toString().trim() || null,
    categoria: (req.query?.categoria || '').toString().trim() || null,
    subcategoria: (req.query?.subcategoria || '').toString().trim() || null,
    status: (req.query?.status || '').toString().trim() || null,
  }

  return null
})

function normalizeRelatorioFilters(raw) {
  const today = new Date()
  const defaultEnd = today.toISOString().slice(0, 10)
  const defaultStart = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    .toISOString()
    .slice(0, 10)
  const start = raw?.data_inicio || defaultStart
  const end = raw?.data_fim || defaultEnd
  return {
    database: raw?.database || 'azportoex',
    data_inicio: start,
    data_fim: end,
  }
}

async function buildRelatorioResultados(filters) {
  const startDate = filters.data_inicio
  const endDate = filters.data_fim

  const rows = await withTx(pool, async (client) => {
    const q = await client.query(
      `
      SELECT *
      FROM ocorrencias_portoex
      WHERE ($1::date IS NULL OR data >= $1::date)
        AND ($2::date IS NULL OR data <= $2::date)
      ORDER BY data ASC
      `,
      [startDate, endDate],
    )
    return q.rows
  })

  const total = rows.length
  const custos = rows.map((r) => Number(r.impacto_financeiro || 0))
  const somaCustos = custos.reduce((acc, value) => acc + value, 0)

  const reprogramados = rows.filter((r) => (r.reprogramado || '').toString().toLowerCase() === 'sim').length
  const noPrazo = rows.filter((r) => (r.status || '').toString().toLowerCase().includes('no prazo')).length
  const internos = rows.filter((r) => (r.responsavel || '').toString().toLowerCase().includes('interno')).length

  const clienteCounts = {}
  const agenteCounts = {}
  const monthly = {}

  for (const row of rows) {
    const cliente = (row.cliente || 'N/D').toString()
    clienteCounts[cliente] = (clienteCounts[cliente] || 0) + 1
    const agente = (row.responsavel || 'desconhecido').toString()
    agenteCounts[agente] = (agenteCounts[agente] || 0) + 1

    const monthKey = row.data?.toISOString?.().slice(0, 7) || row.data || 'N/D'
    if (!monthly[monthKey]) {
      monthly[monthKey] = { total: 0, custo: 0, reprogramacoes: 0 }
    }
    monthly[monthKey].total += 1
    monthly[monthKey].custo += Number(row.impacto_financeiro || 0)
    if ((row.reprogramado || '').toString().toLowerCase() === 'sim') {
      monthly[monthKey].reprogramacoes += 1
    }
  }

  const sortedClientes = Object.entries(clienteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cliente, count]) => ({ name: cliente, value: count }))
  const sortedAgentes = Object.entries(agenteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([agente, count]) => ({ name: agente, value: count }))

  const monthlyComparisons = Object.entries(monthly)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([month, data]) => ({
      month,
      total: data.total,
      custo: Number(data.custo.toFixed(2)),
      reprogramacao_percent: data.total ? Number(((data.reprogramacoes / data.total) * 100).toFixed(1)) : 0,
    }))

  const kpis = {
    total_entregas: total,
    custo_total: Number(somaCustos.toFixed(2)),
    reprogramacao_percent: total ? Number(((reprogramados / total) * 100).toFixed(1)) : 0,
    entregas_no_prazo_percent: total ? Number(((noPrazo / total) * 100).toFixed(1)) : 0,
    entregas_internas_percent: total ? Number(((internos / total) * 100).toFixed(1)) : 0,
  }

  const dre = [
    { name: 'Faturamento', value: Number(somaCustos.toFixed(2)) },
    { name: 'Custo Operacional', value: Number((somaCustos * 0.65).toFixed(2)) },
    { name: 'EBITDA', value: Number((somaCustos * 0.35).toFixed(2)) },
    { name: 'Margem Bruta', value: Number(total ? ((somaCustos * 0.35) / somaCustos) * 100 : 0).toFixed(2) },
  ]

  const rankings = {
    clientes: sortedClientes,
    agentes: sortedAgentes,
  }

  const indicadoresOperacionais = {
    entregas_no_prazo_percent: kpis.entregas_no_prazo_percent,
    reprogramacao_percent: kpis.reprogramacao_percent,
    entregas_internas_percent: kpis.entregas_internas_percent,
    total_entregas: kpis.total_entregas,
  }

  const gauges = [
    { title: 'Reprogramações', value: kpis.reprogramacao_percent, min: 0, max: 100, status: kpis.reprogramacao_percent > 30 ? 'red' : 'green' },
    { title: 'Entregas no prazo', value: kpis.entregas_no_prazo_percent, min: 0, max: 100, status: kpis.entregas_no_prazo_percent < 70 ? 'red' : 'green' },
    { title: 'Entregas internas', value: kpis.entregas_internas_percent, min: 0, max: 100, status: 'default' },
  ]

  return {
    filters,
    kpis,
    dre,
    rankings,
    indicadores_operacionais: indicadoresOperacionais,
    gauges,
    comparativos_mensais: monthlyComparisons,
  }
}

const disableProxy = String(process.env.DISABLE_PROXY || 'false').toLowerCase() === 'true'
if (upstreamFlaskUrl && !disableProxy) {
  app.all('/api/*', async (req, reply) => {
    if (req.url.startsWith('/api/agent/')) {
      return reply.callNotFound()
    }

    const upstreamUrl = `${upstreamFlaskUrl}${req.url}`

    const headers = { ...req.headers }
    delete headers.host
    delete headers.connection
    delete headers['content-length']

    let body
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body === undefined || req.body === null) {
        body = undefined
      } else if (Buffer.isBuffer(req.body) || typeof req.body === 'string') {
        body = req.body
      } else {
        body = JSON.stringify(req.body)
        if (!headers['content-type']) {
          headers['content-type'] = 'application/json'
        }
      }
    }

    try {
      const resp = await fetch(upstreamUrl, {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
      })

      reply.code(resp.status)

      resp.headers.forEach((value, key) => {
        const k = key.toLowerCase()
        if (k === 'transfer-encoding' || k === 'connection') return
        reply.header(key, value)
      })

      const arrBuf = await resp.arrayBuffer()
      return reply.send(Buffer.from(arrBuf))
    } catch (err) {
      req.log.error({ err }, '[GATEWAY] Falha ao proxyar para upstream Flask')
      return jsonResponse(reply, 502, { error: err?.message || String(err) })
    }
  })
}

app.post('/api/agent/sync/knowledge', async (req, reply) => {
  const body = req.body || {}
  const items = body.items || []
  if (!Array.isArray(items) || items.length === 0) {
    return jsonResponse(reply, 400, { error: 'Nenhum item fornecido' })
  }

  try {
    const count = await withTx(pool, async (client) => {
      let updated = 0
      for (const item of items) {
        const question = item?.question
        const answer = item?.answer
        const category = item?.category || 'Brudam Sync'
        if (!question || !answer) continue

        const existing = await client.query(
          'SELECT id FROM agent_knowledge_base WHERE question = $1 AND category = $2',
          [question, category],
        )

        if (existing.rows.length > 0) {
          await client.query(
            'UPDATE agent_knowledge_base SET answer = $1, updated_at = NOW() WHERE id = $2',
            [answer, existing.rows[0].id],
          )
        } else {
          await client.query(
            'INSERT INTO agent_knowledge_base (question, answer, category, created_by) VALUES ($1, $2, $3, 0)',
            [question, answer, category],
          )
        }
        updated += 1
      }
      return updated
    })

    return jsonResponse(reply, 200, { success: true, count })
  } catch (err) {
    req.log.error({ err }, '[AGENT-SYNC] Erro ao sincronizar conhecimento')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.get('/api/agent/rpas/pending', async (req, reply) => {
  try {
    const rpas = await withTx(pool, async (client) => {
      const q = await client.query(
        `
        SELECT r.id, r.name, r.description, r.parameters, r.priority,
               t.name as type_name
        FROM agent_rpas r
        LEFT JOIN agent_rpa_types t ON r.rpa_type_id = t.id
        WHERE r.status = 'pending'
          AND (t.name ILIKE '%Extração%' OR r.parameters::text ILIKE '%brudam%' OR r.parameters::text ILIKE '%query%')
        ORDER BY
          CASE r.priority
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
          END,
          r.created_at ASC
        LIMIT 10
        `,
      )

      const rows = q.rows
      for (const row of rows) {
        await client.query(
          `
          UPDATE agent_rpas
          SET status = 'running', executed_at = NOW()
          WHERE id = $1 AND status = 'pending'
          `,
          [row.id],
        )
      }

      return rows
    })

    return jsonResponse(reply, 200, { rpas })
  } catch (err) {
    req.log.error({ err }, '[AGENT-API] Erro ao buscar RPAs pendentes')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.get('/api/relatorio-entregas/status/:requestId', async (req, reply) => {
  const sessionUser = requireLogin(req, reply)
  if (!sessionUser) return

  const requestId = Number.parseInt(req.params.requestId, 10)
  if (!Number.isFinite(requestId)) {
    return jsonResponse(reply, 400, { error: 'request_id inválido' })
  }

  try {
    const out = await withTx(pool, async (client) => {

      await client.query(
        `
        UPDATE agent_rpas
        SET status = $1,
            completed_at = NOW(),
            result = $2,
            error_message = $3,
            updated_at = NOW()
        WHERE id = $4
        `,
        [finalStatus, payload, body.error || null, rpaId],
      )

      const logs = Array.isArray(body.logs) ? body.logs : []
      await client.query(
        `
        INSERT INTO agent_logs (action_type, entity_type, entity_id, user_id, details)
        VALUES ('execute_remote', 'rpa', $1, $2, $3)
        `,
        [rpaId, rpa.created_by, { logs, success, source: 'agent_local' }],
      )
    })

    return jsonResponse(reply, 200, { success: true })
  } catch (err) {
    const status = err?.statusCode || 500
    if (status >= 500) {
      req.log.error({ err }, '[AGENT-API] Erro ao salvar resultado de RPA')
    }
    return jsonResponse(reply, status, { error: err?.message || String(err) })
  }
})

app.get('/api/agent/dashboards/pending', async (req, reply) => {
  const agentId = (req.headers['x-agent-id'] || req.headers['x-agent-id'.toLowerCase()] || 'agent_local').toString().trim() || 'agent_local'
  const limit = clampInt(req.query?.limit, 1, 25, 5)

  try {
    const dashboards = await withTx(pool, async (client) => {
      await client.query('ALTER TABLE agent_dashboard_requests ADD COLUMN IF NOT EXISTS leased_by TEXT;')
      await client.query('ALTER TABLE agent_dashboard_requests ADD COLUMN IF NOT EXISTS leased_until TIMESTAMPTZ;')
      await client.query('CREATE INDEX IF NOT EXISTS idx_agent_dashboard_requests_lease ON agent_dashboard_requests(leased_until);')

      const q = await client.query(
        `
        WITH to_claim AS (
          SELECT id
          FROM agent_dashboard_requests
          WHERE status = 'pending'
            AND (leased_until IS NULL OR leased_until < NOW())
            AND filters IS NOT NULL
            AND (
                  filters::text ILIKE '%"query"%'
               OR filters::text ILIKE '%"procedure"%'
               OR filters::text ILIKE '%"runner"%'
            )
          ORDER BY created_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT $1
        )
        UPDATE agent_dashboard_requests d
        SET status = 'processing',
            leased_by = $2,
            leased_until = NOW() + INTERVAL '20 minutes',
            updated_at = NOW()
        FROM to_claim c
        WHERE d.id = c.id
        RETURNING d.id, d.title, d.description, d.category, d.chart_types, d.filters, d.created_by
        `,
        [limit, agentId],
      )

      return q.rows
    })

    return jsonResponse(reply, 200, { dashboards })
  } catch (err) {
    req.log.error({ err }, '[AGENT-API] Erro ao buscar dashboards pendentes')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.post('/api/agent/dashboard/:dashId/progress', async (req, reply) => {
  const dashId = Number.parseInt(req.params.dashId, 10)
  const body = req.body || {}
  let logsAppend = body.logs_append || []
  let progress = body.progress || {}

  if (!Number.isFinite(dashId)) {
    return jsonResponse(reply, 400, { error: 'dash_id inválido' })
  }

  if (!Array.isArray(logsAppend)) {
    logsAppend = [String(logsAppend)]
  }
  logsAppend = logsAppend.filter((x) => x != null).map((x) => String(x))
  if (typeof progress !== 'object' || progress == null || Array.isArray(progress)) {
    progress = {}
  }

  try {
    await withTx(pool, async (client) => {
      const res = await client.query(
        'SELECT id, result_data FROM agent_dashboard_requests WHERE id = $1',
        [dashId],
      )
      if (res.rows.length === 0) {
        const e = new Error('Dashboard não encontrado')
        e.statusCode = 404
        throw e
      }

      const rd = res.rows[0].result_data && typeof res.rows[0].result_data === 'object' ? res.rows[0].result_data : {}
      const existingLogs = Array.isArray(rd._logs) ? rd._logs : []
      const combinedLogs = existingLogs.concat(logsAppend).slice(-3000)
      rd._logs = combinedLogs
      if (Object.keys(progress).length > 0) {
        rd._progress = progress
      }

      await client.query(
        `
        UPDATE agent_dashboard_requests
        SET status = 'processing',
            result_data = $1,
            updated_at = NOW()
        WHERE id = $2
        `,
        [rd, dashId],
      )
    })

    return jsonResponse(reply, 200, { success: true })
  } catch (err) {
    const status = err?.statusCode || 500
    if (status >= 500) {
      req.log.error({ err }, '[AGENT-API] Erro ao salvar progresso dashboard')
    }
    return jsonResponse(reply, status, { error: err?.message || String(err) })
  }
})

app.post('/api/agent/dashboard/:dashId/result', async (req, reply) => {
  const dashId = Number.parseInt(req.params.dashId, 10)
  if (!Number.isFinite(dashId)) {
    return jsonResponse(reply, 400, { error: 'dash_id inválido' })
  }

  const data = req.body
  if (!data || typeof data !== 'object') {
    return jsonResponse(reply, 400, { error: 'Dados inválidos' })
  }

  try {
    await withTx(pool, async (client) => {
      const dashRes = await client.query(
        'SELECT id, created_by, result_data FROM agent_dashboard_requests WHERE id = $1',
        [dashId],
      )
      if (dashRes.rows.length === 0) {
        const e = new Error('Dashboard não encontrado')
        e.statusCode = 404
        throw e
      }

      const dash = dashRes.rows[0]
      const success = data.success !== undefined ? Boolean(data.success) : true

      const chunkInfo = data._chunk_info && typeof data._chunk_info === 'object' ? data._chunk_info : null
      const isChunk = Boolean(chunkInfo && Object.keys(chunkInfo).length > 0)

      let finalStatus = 'completed'
      let payloadData = null

      if (isChunk) {
        const chunkIndex = Number.parseInt(chunkInfo.chunk_index || '0', 10)
        const totalChunks = Number.parseInt(chunkInfo.total_chunks || '1', 10)
        const totalRecords = Number.parseInt(chunkInfo.total_records || '0', 10)

        const existingResult = dash.result_data && typeof dash.result_data === 'object' ? dash.result_data : {}
        const combined = Array.isArray(existingResult.data) ? existingResult.data.slice() : []
        const chunksReceived = Array.isArray(existingResult._chunks_received) ? existingResult._chunks_received.slice() : []

        if (chunksReceived.includes(chunkIndex)) {
          payloadData = existingResult
          finalStatus = 'processing'
        } else {
          const chunkData = Array.isArray(data.data) ? data.data : []
          combined.push(...chunkData)
          chunksReceived.push(chunkIndex)
          chunksReceived.sort((a, b) => a - b)

          const allChunksReceived = chunksReceived.length >= totalChunks
          payloadData = {
            data: combined,
            row_count: totalRecords,
            source: 'agent_local',
            _chunks_received: chunksReceived,
            _total_chunks: totalChunks,
            _is_complete: allChunksReceived,
          }

          finalStatus = allChunksReceived ? (success ? 'completed' : 'failed') : 'processing'
        }
      } else {
        const raw = data.data
        if (Array.isArray(raw)) {
          payloadData = {
            data: raw,
            row_count: data.row_count || raw.length,
            source: 'agent_local',
          }
        } else if (raw && typeof raw === 'object') {
          payloadData = {
            payload: raw,
            row_count: data.row_count || 0,
            source: 'agent_local',
          }
        } else {
          payloadData = {
            data: [],
            row_count: data.row_count || 0,
            source: 'agent_local',
          }
        }

        finalStatus = success ? 'completed' : 'failed'
      }

      await client.query(
        `
        UPDATE agent_dashboard_requests
        SET status = $1,
            result_data = $2,
            error_message = $3,
            completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
            updated_at = NOW()
        WHERE id = $4
        `,
        [finalStatus, payloadData, data.error || null, dashId],
      )

      const logs = Array.isArray(data.logs) ? data.logs : []
      await client.query(
        `
        INSERT INTO agent_logs (action_type, entity_type, entity_id, user_id, details)
        VALUES ('execute_remote', 'dashboard', $1, $2, $3)
        `,
        [dashId, dash.created_by, { logs, success, source: 'agent_local' }],
      )
    })

    return jsonResponse(reply, 200, { success: true })
  } catch (err) {
    const status = err?.statusCode || 500
    if (status >= 500) {
      req.log.error({ err }, '[AGENT-API] Erro ao salvar resultado dashboard')
    }
    return jsonResponse(reply, status, { error: err?.message || String(err) })
  }
})

const port = Number.parseInt(process.env.PORT || '8081', 10)
const host = process.env.HOST || '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
