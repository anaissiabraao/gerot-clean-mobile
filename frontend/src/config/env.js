const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  healthEndpoint: import.meta.env.VITE_HEALTH_ENDPOINT ?? '/api/health',
  requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS ?? 10000),
}

export default env
