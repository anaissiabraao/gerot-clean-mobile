import env from '../../../config/env'
import { httpGet } from '../../../services/httpClient'

function toPayload(data) {
  if (typeof data === 'string') {
    return { message: data }
  }

  return data
}

export async function getBackendHealth() {
  const data = await httpGet(env.healthEndpoint)
  const payload = toPayload(data)

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    payload,
  }
}
