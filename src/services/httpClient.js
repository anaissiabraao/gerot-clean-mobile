import env from '../config/env'

function normalizeUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${env.apiBaseUrl}${normalizedPath}`
}

function getAbortSignal(timeoutMs) {
  if (!timeoutMs || timeoutMs <= 0) {
    return undefined
  }

  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeoutMs)
  return controller.signal
}

const fetchOpts = (method, init = {}, body = null) => ({
  method,
  ...init,
  credentials: 'include', // envia cookie de sessão (cross-origin)
  headers: {
    Accept: 'application/json',
    ...(body !== null ? { 'Content-Type': 'application/json' } : {}),
    ...init.headers,
  },
  ...(body !== null ? { body } : {}),
  signal: init.signal ?? getAbortSignal(env.requestTimeoutMs),
})

export async function httpGet(path, init = {}) {
  const response = await fetch(normalizeUrl(path), {
    ...fetchOpts('GET', init),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export async function httpPost(path, init = {}) {
  const response = await fetch(normalizeUrl(path), {
    ...fetchOpts('POST', init, init.body ?? null),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function httpPut(path, init = {}) {
  const response = await fetch(normalizeUrl(path), {
    ...fetchOpts('PUT', init, init.body ?? null),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function httpDelete(path, init = {}) {
  const response = await fetch(normalizeUrl(path), {
    ...fetchOpts('DELETE', init),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}
