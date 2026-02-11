import { httpGet } from '../../../services/httpClient'
import api from '../../../api/endpoints'

function toPayload(data) {
  if (typeof data === 'string') {
    return { message: data }
  }

  return data
}

export async function getBackendHealth() {
  const data = await httpGet(api.health)
  const payload = toPayload(data)

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    payload,
  }
}
