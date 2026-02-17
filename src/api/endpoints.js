/**
 * Caminhos das APIs do backend GeRot (app_production.py).
 * Use com services/httpClient: httpGet(api.health), httpPost(api.chatMessage, { body: ... })
 * Ver docs/FRONT_API.md para descrição dos endpoints.
 */
const api = {
  // Health
  health: '/api/agent/health',

  // Sessão (SPA: checar auth e redirecionar ao login do backend)
  session: '/api/me',
  sessionUpdate: '/api/me',
  changePassword: '/api/me/password',
  teamDashboard: '/api/team-dashboard',

  // RAG
  ragStatus: '/api/agent/rag/status',

  // Relatório
  relatorioLayout: '/api/relatorio/layout',

  // Room bookings
  roomBookings: '/api/room-bookings',
  roomBooking: (id) => `/api/room-bookings/${id}`,

  // Environments (CD)
  environments: '/api/environments',
  environment: (id) => `/api/environments/${id}`,
  environmentResources: (id) => `/api/environments/${id}/resources`,
  environmentUpload: (id) => `/api/environments/${id}/upload`,

  // Agent library
  libraryCatalog: '/api/agent/library/catalog',
  libraryRun: '/api/agent/library/run',
  libraryRunById: (runId) => `/api/agent/library/run/${runId}`,

  // Dashboard gen
  dashboardGen: '/api/agent/dashboard-gen',
  dashboardGenById: (id) => `/api/agent/dashboard-gen/${id}`,

  // Chat
  chatHistory: '/api/agent/chat/history',
  chatMessages: (conversationId) => `/api/agent/chat/${conversationId}/messages`,
  chatMessage: '/api/agent/chat/message',
  chatDelete: (conversationId) => `/api/agent/chat/${conversationId}`,

  // Knowledge
  knowledge: '/api/agent/knowledge',
  knowledgeById: (id) => `/api/agent/knowledge/${id}`,

  // Relatórios / indicadores
  indicadoresExecutivos: '/api/indicadores-executivos',
  relatorioEntregas: '/api/relatorio-entregas',
  relatorioResultadosRequest: '/api/agent/relatorio-resultados/request',
  relatorioResultadosStatus: (requestId) => `/api/agent/relatorio-resultados/status/${requestId}`,
}

export default api
