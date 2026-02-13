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

app.addHook('onRequest', async (req, reply) => {
  if (req.url.startsWith('/api/agent/')) {
    if (!verifyAgentApiKey(req)) {
      return jsonResponse(reply, 401, { error: 'API Key inválida' })
    }
  }
})

app.get('/health', async () => ({ ok: true }))

app.get('/', async (req, reply) => {
  return reply.redirect('/login')
})

app.get('/dashboard', async (req, reply) => {
  const sessionUser = requireLogin(req, reply)
  if (!sessionUser) return

  const target = (process.env.FRONTEND_DASHBOARD_URL || process.env.FRONTEND_URL || '').toString().trim()
  if (target) {
    return reply.redirect(target)
  }

  return reply.redirect('/login')
})

function getSessionUser(req) {
  if (!req.session) return null
  const u = req.session.get('user')
  if (!u || typeof u !== 'object') return null
  return u
}

function requireLogin(req, reply) {
  const u = getSessionUser(req)
  if (u) return u

  const accept = (req.headers.accept || '').toString()
  if (accept.includes('text/html')) {
    reply.redirect('/login')
    return null
  }

  jsonResponse(reply, 401, { error: 'Not authenticated', login_url: '/login' })
  return null
}

function requireAdmin(req, reply) {
  const u = requireLogin(req, reply)
  if (!u) return null
  const isAdmin = (u.role || '').toString().toLowerCase() === 'admin'
  if (isAdmin) return u
  jsonResponse(reply, 403, { error: 'Forbidden' })
  return null
}

app.get('/api/admin/users', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const q = (req.query?.q || '').toString().trim()
  const limit = clampInt(req.query?.limit, 1, 200, 50)

  try {
    const out = await withTx(pool, async (client) => {
      const res = await client.query(
        `
        SELECT id, username, role, nome_completo, departamento, is_active
        FROM users_new
        WHERE ($1 = '' OR username ILIKE '%' || $1 || '%' OR COALESCE(nome_completo, '') ILIKE '%' || $1 || '%')
        ORDER BY username ASC
        LIMIT $2
        `,
        [q, limit],
      )
      return res.rows
    })
    return jsonResponse(reply, 200, { items: out })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao listar usuários')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.get('/api/admin/assets', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const limit = clampInt(req.query?.limit, 1, 500, 200)
  const status = (req.query?.status || 'ativo').toString().trim()

  try {
    const out = await withTx(pool, async (client) => {
      const res = await client.query(
        `
        SELECT id, nome, tipo, categoria, descricao, status, ordem_padrao, resource_url, embed_url, config AS asset_config
        FROM assets
        WHERE ($1 = '' OR COALESCE(status, '') = $1)
        ORDER BY COALESCE(ordem_padrao, 0) ASC, id ASC
        LIMIT $2
        `,
        [status, limit],
      )
      return res.rows
    })
    return jsonResponse(reply, 200, { items: out })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao listar assets')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.get('/api/admin/asset-assignments', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const userId = req.query?.user_id ? Number(req.query.user_id) : null
  const groupName = (req.query?.group_name || '').toString().trim()
  const limit = clampInt(req.query?.limit, 1, 500, 200)

  try {
    const out = await withTx(pool, async (client) => {
      const res = await client.query(
        `
        SELECT
          aa.id,
          aa.asset_id,
          aa.user_id,
          aa.group_name,
          aa.ordem,
          aa.visivel,
          aa.config AS assignment_config,
          a.nome AS asset_nome,
          a.tipo AS asset_tipo,
          a.categoria AS asset_categoria
        FROM asset_assignments aa
        JOIN assets a ON a.id = aa.asset_id
        WHERE ($1::bigint IS NULL OR aa.user_id = $1)
          AND ($2 = '' OR aa.group_name = $2)
        ORDER BY COALESCE(aa.ordem, 0) ASC, aa.id ASC
        LIMIT $3
        `,
        [userId, groupName, limit],
      )
      return res.rows
    })
    return jsonResponse(reply, 200, { items: out })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao listar asset_assignments')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.post('/api/admin/asset-assignments', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const assetId = Number(req.body?.asset_id)
  const userId = req.body?.user_id !== undefined && req.body?.user_id !== null ? Number(req.body.user_id) : null
  const groupName = (req.body?.group_name || '').toString().trim()
  const ordem = req.body?.ordem !== undefined && req.body?.ordem !== null ? Number(req.body.ordem) : null
  const visivel = req.body?.visivel === undefined ? true : !!req.body.visivel
  const config = req.body?.config ?? req.body?.assignment_config ?? null

  if (!assetId || (userId === null && !groupName)) {
    return jsonResponse(reply, 400, { error: 'asset_id e (user_id ou group_name) são obrigatórios' })
  }

  try {
    const out = await withTx(pool, async (client) => {
      const res = await client.query(
        `
        INSERT INTO asset_assignments (asset_id, user_id, group_name, ordem, visivel, config)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [assetId, userId, groupName || null, ordem, visivel, config],
      )
      return res.rows[0]
    })
    return jsonResponse(reply, 201, { id: out.id })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao criar asset_assignment')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.put('/api/admin/asset-assignments/:id', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const id = Number(req.params?.id)
  if (!id) {
    return jsonResponse(reply, 400, { error: 'id inválido' })
  }

  const patch = {
    ordem: req.body?.ordem,
    visivel: req.body?.visivel,
    config: req.body?.config ?? req.body?.assignment_config,
  }

  const sets = []
  const vals = []
  let idx = 1

  if (patch.ordem !== undefined) {
    sets.push(`ordem = $${idx++}`)
    vals.push(patch.ordem === null ? null : Number(patch.ordem))
  }
  if (patch.visivel !== undefined) {
    sets.push(`visivel = $${idx++}`)
    vals.push(!!patch.visivel)
  }
  if (patch.config !== undefined) {
    sets.push(`config = $${idx++}`)
    vals.push(patch.config)
  }

  if (sets.length === 0) {
    return jsonResponse(reply, 400, { error: 'Nenhum campo para atualizar' })
  }

  try {
    await withTx(pool, async (client) => {
      await client.query(
        `
        UPDATE asset_assignments
        SET ${sets.join(', ')}
        WHERE id = $${idx}
        `,
        [...vals, id],
      )
    })
    return jsonResponse(reply, 200, { ok: true })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao atualizar asset_assignment')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.delete('/api/admin/asset-assignments/:id', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const id = Number(req.params?.id)
  if (!id) {
    return jsonResponse(reply, 400, { error: 'id inválido' })
  }

  try {
    await withTx(pool, async (client) => {
      await client.query('DELETE FROM asset_assignments WHERE id = $1', [id])
    })
    return jsonResponse(reply, 200, { ok: true })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao remover asset_assignment')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.post('/api/admin/asset-assignments/bulk', async (req, reply) => {
  const admin = requireAdmin(req, reply)
  if (!admin) return

  const assetIds = Array.isArray(req.body?.asset_ids) ? req.body.asset_ids.map((x) => Number(x)).filter(Boolean) : []
  const userIds = Array.isArray(req.body?.user_ids) ? req.body.user_ids.map((x) => Number(x)).filter(Boolean) : []
  const groupNames = Array.isArray(req.body?.group_names) ? req.body.group_names.map((x) => String(x).trim()).filter(Boolean) : []
  const visivel = req.body?.visivel === undefined ? true : !!req.body.visivel
  const config = req.body?.config ?? req.body?.assignment_config ?? null
  const ordem = req.body?.ordem !== undefined && req.body?.ordem !== null ? Number(req.body.ordem) : null

  if (assetIds.length === 0 || (userIds.length === 0 && groupNames.length === 0)) {
    return jsonResponse(reply, 400, { error: 'asset_ids e (user_ids ou group_names) são obrigatórios' })
  }

  try {
    const inserted = await withTx(pool, async (client) => {
      let total = 0

      for (const assetId of assetIds) {
        for (const userId of userIds) {
          const u = await client.query(
            `
            UPDATE asset_assignments
            SET ordem = $3, visivel = $4, config = $5
            WHERE asset_id = $1 AND user_id = $2
            `,
            [assetId, userId, ordem, visivel, config],
          )
          if ((u.rowCount || 0) === 0) {
            const i = await client.query(
              `
              INSERT INTO asset_assignments (asset_id, user_id, group_name, ordem, visivel, config)
              SELECT $1, $2, NULL, $3, $4, $5
              WHERE NOT EXISTS (
                SELECT 1 FROM asset_assignments WHERE asset_id = $1 AND user_id = $2
              )
              `,
              [assetId, userId, ordem, visivel, config],
            )
            total += i.rowCount || 0
          } else {
            total += u.rowCount || 0
          }
        }

        for (const groupName of groupNames) {
          const u = await client.query(
            `
            UPDATE asset_assignments
            SET ordem = $3, visivel = $4, config = $5
            WHERE asset_id = $1 AND group_name = $2 AND user_id IS NULL
            `,
            [assetId, groupName, ordem, visivel, config],
          )
          if ((u.rowCount || 0) === 0) {
            const i = await client.query(
              `
              INSERT INTO asset_assignments (asset_id, user_id, group_name, ordem, visivel, config)
              SELECT $1, NULL, $2, $3, $4, $5
              WHERE NOT EXISTS (
                SELECT 1 FROM asset_assignments WHERE asset_id = $1 AND group_name = $2 AND user_id IS NULL
              )
              `,
              [assetId, groupName, ordem, visivel, config],
            )
            total += i.rowCount || 0
          } else {
            total += u.rowCount || 0
          }
        }
      }

      return total
    })

    return jsonResponse(reply, 200, { ok: true, affected: inserted })
  } catch (err) {
    req.log.error({ err }, '[ADMIN] Erro ao bulk upsert asset_assignments')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.get('/login', async (req, reply) => {
  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login - GeRot</title>
    <style>
      :root {
        --bg0: #070a12;
        --bg1: #0b1220;
        --card: rgba(255,255,255,.06);
        --border: rgba(255,255,255,.14);
        --muted: rgba(255,255,255,.72);
        --text: rgba(255,255,255,.92);
        --primary: #6366f1;
        --primary2: #8b5cf6;
        --shadow: 0 20px 60px rgba(0,0,0,.55);
      }

      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        margin: 0;
        color: var(--text);
        background:
          radial-gradient(900px 500px at 20% 10%, rgba(99,102,241,.22), transparent 60%),
          radial-gradient(800px 500px at 90% 20%, rgba(139,92,246,.18), transparent 60%),
          linear-gradient(180deg, var(--bg0), var(--bg1));
      }

      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 28px 18px;
      }

      .shell {
        width: 100%;
        max-width: 440px;
      }

      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 22px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .logo {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary), var(--primary2));
        box-shadow: 0 10px 30px rgba(99,102,241,.28);
      }

      h1 {
        margin: 0;
        font-size: 22px;
        line-height: 1.2;
        letter-spacing: .2px;
      }

      .subtitle {
        margin: 4px 0 18px;
        font-size: 13px;
        color: var(--muted);
      }

      label {
        display: block;
        font-size: 12px;
        margin: 12px 0 6px;
        color: rgba(255,255,255,.82);
      }

      .field {
        width: 100%;
        padding: 11px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(3,6,14,.55);
        color: #fff;
        outline: none;
        transition: border-color .15s ease, box-shadow .15s ease, transform .05s ease;
      }

      .field:focus {
        border-color: rgba(99,102,241,.7);
        box-shadow: 0 0 0 4px rgba(99,102,241,.18);
      }

      .actions {
        margin-top: 16px;
        display: grid;
        gap: 10px;
      }

      .btn {
        width: 100%;
        padding: 11px 12px;
        border-radius: 12px;
        border: 0;
        background: linear-gradient(135deg, var(--primary), var(--primary2));
        color: #fff;
        font-weight: 700;
        letter-spacing: .2px;
        cursor: pointer;
        transition: transform .06s ease, filter .15s ease;
      }

      .btn:hover { filter: brightness(1.05); }
      .btn:active { transform: translateY(1px); }

      .foot {
        margin-top: 14px;
        text-align: center;
        font-size: 12px;
        color: rgba(255,255,255,.58);
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="shell">
        <div class="card">
          <div class="brand">
            <div class="logo" aria-hidden="true"></div>
            <div>
              <h1>GeRot</h1>
              <div class="subtitle">Acesse com seu usuário e senha</div>
            </div>
          </div>

          <form method="POST" action="/login">
            <label for="username">Usuário</label>
            <input class="field" id="username" name="username" autocomplete="username" placeholder="ex.: anaissiabraao" required />
            <label for="password">Senha</label>
            <input class="field" id="password" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required />
            <div class="actions">
              <button class="btn" type="submit">Entrar</button>
            </div>
          </form>

          <div class="foot">© ${new Date().getFullYear()} GeRot</div>
        </div>
      </div>
    </div>
  </body>
</html>`
  reply.type('text/html; charset=utf-8')
  return reply.send(html)
})

app.post('/login', async (req, reply) => {
  if (!req.session || !sessionSecret) {
    return jsonResponse(reply, 500, { error: 'SESSION_SECRET não configurada' })
  }

  const username = (req.body?.username || '').toString().trim()
  const password = (req.body?.password || '').toString()
  if (!username || !password) {
    return jsonResponse(reply, 400, { error: 'Credenciais inválidas' })
  }

  try {
    const user = await withTx(pool, async (client) => {
      const cols = await client.query(
        `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users_new'
          AND column_name IN ('password_hash', 'password', 'email', 'nome_usuario')
        `,
      )

      const hasPasswordHash = cols.rows.some((r) => r.column_name === 'password_hash')
      const passwordCol = cols.rows.find((r) => r.column_name === 'password')
      const hasEmail = cols.rows.some((r) => r.column_name === 'email')
      const hasNomeUsuario = cols.rows.some((r) => r.column_name === 'nome_usuario')

      const whereParts = [`LOWER(username) = LOWER($1)`]
      if (hasEmail) whereParts.push(`LOWER(email) = LOWER($1)`)
      if (hasNomeUsuario) whereParts.push(`LOWER(nome_usuario) = LOWER($1)`)
      const whereSql = whereParts.join(' OR ')

      if (hasPasswordHash) {
        const r = await client.query(
          `
          SELECT id, username, password_hash, role, nome_completo, departamento, is_active
          FROM users_new
          WHERE ${whereSql}
          LIMIT 1
          `,
          [username],
        )
        return r.rows[0] || null
      }

      if (!passwordCol) {
        throw new Error("Tabela users_new não possui coluna 'password_hash' nem 'password'")
      }

      const passwordExpr = passwordCol.data_type === 'bytea' ? `convert_from(password, 'UTF8')` : `password::text`

      const r = await client.query(
        `
        SELECT id,
               username,
               ${passwordExpr} AS password_hash,
               role,
               nome_completo,
               departamento,
               is_active
        FROM users_new
        WHERE ${whereSql}
        LIMIT 1
        `,
        [username],
      )
      return r.rows[0] || null
    })

    if (!user || user.is_active === false) {
      return jsonResponse(reply, 401, { error: 'Usuário ou senha inválidos' })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return jsonResponse(reply, 401, { error: 'Usuário ou senha inválidos' })
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      role: user.role || 'user',
      nome_completo: user.nome_completo || null,
      departamento: user.departamento || null,
    }

    req.session.set('user', sessionUser)
    return reply.redirect('/dashboard')
  } catch (err) {
    req.log.error({ err }, '[AUTH] Erro no login')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

app.post('/logout', async (req, reply) => {
  if (req.session) {
    req.session.delete()
  }
  return reply.redirect('/login')
})

app.get('/api/me', async (req, reply) => {
  const u = getSessionUser(req)
  if (!u) {
    return jsonResponse(reply, 401, { error: 'Not authenticated' })
  }
  return jsonResponse(reply, 200, { user: u })
})

app.get('/api/team-dashboard', async (req, reply) => {
  const sessionUser = requireLogin(req, reply)
  if (!sessionUser) return

  try {
    const out = await withTx(pool, async (client) => {
      const hasAssets = await client.query(
        `
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'assets'
        LIMIT 1
        `,
      )
      if (hasAssets.rows.length === 0) {
        return { regular_assets: [], internal_assets: [], is_admin: false }
      }

      const hasAssignments = await client.query(
        `
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'asset_assignments'
        LIMIT 1
        `,
      )

      const isAdmin = (sessionUser.role || '').toString().toLowerCase() === 'admin'
      const userId = sessionUser.id
      const dept = (sessionUser.departamento || '').toString().trim()

      let rows
      if (hasAssignments.rows.length > 0) {
        const res = await client.query(
          `
          SELECT
            a.id,
            a.nome,
            a.tipo,
            a.categoria,
            a.descricao,
            a.status,
            a.ordem_padrao,
            a.resource_url,
            a.embed_url,
            a.config AS asset_config,
            aa.config AS assignment_config,
            aa.ordem AS assignment_order
          FROM assets a
          JOIN asset_assignments aa ON aa.asset_id = a.id
          WHERE COALESCE(a.status, 'ativo') = 'ativo'
            AND COALESCE(aa.visivel, true) = true
            AND (
              aa.user_id = $1
              OR ($2 <> '' AND aa.group_name = $2)
            )
          ORDER BY COALESCE(aa.ordem, a.ordem_padrao, 0) ASC, a.id ASC
          `,
          [userId, dept],
        )
        rows = res.rows
      } else {
        const res = await client.query(
          `
          SELECT
            id,
            nome,
            tipo,
            categoria,
            descricao,
            status,
            ordem_padrao,
            resource_url,
            embed_url,
            config AS asset_config
          FROM assets
          WHERE COALESCE(status, 'ativo') = 'ativo'
          ORDER BY COALESCE(ordem_padrao, 0) ASC, id ASC
          `,
        )
        rows = res.rows
      }

      const regular = []
      const internal = []

      for (const row of rows) {
        const tipo = (row.tipo || '').toString().toLowerCase()
        if (tipo === 'pbi' || tipo === 'dashboard' || tipo === 'grafico' || tipo === 'rpa') {
          regular.push(row)
        } else {
          internal.push(row)
        }
      }

      return {
        regular_assets: regular,
        internal_assets: internal,
        is_admin: isAdmin,
      }
    })

    return jsonResponse(reply, 200, out)
  } catch (err) {
    req.log.error({ err }, '[API] Erro ao montar team-dashboard')
    return jsonResponse(reply, 500, { error: err?.message || String(err) })
  }
})

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

app.post('/api/agent/rpa/:rpaId/result', async (req, reply) => {
  const rpaId = Number.parseInt(req.params.rpaId, 10)
  const body = req.body || {}

  if (!Number.isFinite(rpaId)) {
    return jsonResponse(reply, 400, { error: 'rpa_id inválido' })
  }

  try {
    await withTx(pool, async (client) => {
      const rpaRes = await client.query('SELECT id, created_by FROM agent_rpas WHERE id = $1', [rpaId])
      if (rpaRes.rows.length === 0) {
        const e = new Error('RPA não encontrada')
        e.statusCode = 404
        throw e
      }
      const rpa = rpaRes.rows[0]

      const success = Boolean(body.success)
      const finalStatus = success ? 'completed' : 'failed'

      let resultData = body.data
      if (!Array.isArray(resultData)) {
        resultData = []
      }
      if (resultData.length > 1000) {
        resultData = resultData.slice(0, 1000)
      }

      const payload = {
        data: resultData,
        row_count: body.row_count || 0,
        source: 'agent_local',
      }

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
        let resultData = data.data
        if (resultData == null) resultData = []
        if (!Array.isArray(resultData)) resultData = []

        payloadData = {
          data: resultData,
          row_count: data.row_count || resultData.length,
          source: 'agent_local',
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
