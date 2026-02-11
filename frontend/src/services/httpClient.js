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

export async function httpGet(path, init = {}) {
  const response = await fetch(normalizeUrl(path), {
    method: 'GET',
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
    signal: init.signal ?? getAbortSignal(env.requestTimeoutMs),
  })

  if (!response.ok) {
    if (response.status === 401 && env.backendUrl) {
      const backendOrigin = new URL(env.backendUrl).origin
      if (typeof window !== 'undefined' && window.location.origin !== backendOrigin) {
        window.location.replace(`${env.backendUrl}/login`)
      }
    }
    const bodyText = await response.text()
    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}
