function normalizeBaseUrl(rawUrl) {
  if (!rawUrl) {
    return ''
  }

  let value = String(rawUrl).trim().replace(/\/+$/, '')
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && value.startsWith('http://')) {
    value = value.replace('http://', 'https://')
  }
  return value
}

const backendUrl = normalizeBaseUrl(import.meta.env.VITE_BACKEND_URL ?? '')
const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? backendUrl)

const env = {
  backendUrl,
  apiBaseUrl,
  healthEndpoint: import.meta.env.VITE_HEALTH_ENDPOINT ?? '/api/agent/health',
  requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS ?? 10000),
  redirectToBackendLogin: String(import.meta.env.VITE_REDIRECT_TO_BACKEND_LOGIN ?? 'false').toLowerCase() === 'true',
  forceLogin: String(import.meta.env.VITE_FORCE_LOGIN ?? 'false').toLowerCase() === 'true',
}

export default env
