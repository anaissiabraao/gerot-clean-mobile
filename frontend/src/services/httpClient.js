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
    const bodyText = await response.text()

    // Só redireciona para login quando o backend indicar que é problema de sessão.
    // Evita loop quando algum endpoint público/agent retorna 401 (ex.: API key inválida).
    if (response.status === 401 && env.backendUrl) {
      try {
        const parsed = JSON.parse(bodyText)
        if (parsed && typeof parsed === 'object' && parsed.login_url) {
          const backendOrigin = new URL(env.backendUrl).origin
          if (typeof window !== 'undefined' && window.location.origin !== backendOrigin) {
            const next = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
            window.location.replace(`${env.backendUrl}/login?next=${next}`)
          }
        }
      } catch {
        // ignore
      }
    }

    throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}
