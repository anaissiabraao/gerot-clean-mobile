import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'

import { createPool, withTx } from './db.js'
import { verifyAgentApiKey } from './auth.js'
import { clampInt, jsonResponse, parseJsonFromBuffer } from './utils.js'

const app = Fastify({
  logger: true,
  bodyLimit: Number.parseInt(process.env.BODY_LIMIT_BYTES || `${20 * 1024 * 1024}`, 10),
})

const upstreamFlaskUrl = (process.env.UPSTREAM_FLASK_URL || '').trim().replace(/\/+$/, '')

app.all('/api/*', async (req, reply) => {
  if (req.url.startsWith('/api/agent/')) {
    return reply.callNotFound()
  }

  if (!upstreamFlaskUrl) {
    return jsonResponse(reply, 500, { error: 'UPSTREAM_FLASK_URL não configurada' })
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

await app.register(cors, {
  origin: true,
})

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
