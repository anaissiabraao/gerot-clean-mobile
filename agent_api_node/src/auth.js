export function verifyAgentApiKey(request) {
  const serverKey = (process.env.AGENT_API_KEY || '').trim()
  if (!serverKey) {
    return true
  }
  const apiKey = (request.headers['x-api-key'] || '').toString()
  return apiKey && apiKey === serverKey
}
