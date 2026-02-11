import { gunzipSync } from 'node:zlib'

export function jsonResponse(reply, statusCode, payload) {
  reply.code(statusCode)
  reply.header('content-type', 'application/json; charset=utf-8')
  return reply.send(payload)
}

export function parsePossiblyGzippedJson(request) {
  const encoding = (request.headers['content-encoding'] || '').toString().toLowerCase()
  const raw = request.rawBody
  if (!raw) {
    return null
  }
  try {
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw)
    const dataBuf = encoding === 'gzip' ? gunzipSync(buf) : buf
    return JSON.parse(dataBuf.toString('utf-8'))
  } catch {
    return null
  }
}

export function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(value, 10)
  if (Number.isNaN(n)) return fallback
  return Math.max(min, Math.min(max, n))
}
