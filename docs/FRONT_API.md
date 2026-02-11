# API do Backend GeRot (para o Front React/Vite)

O backend Flask em `app_production.py` expõe as rotas abaixo. O front (Vite/React na raiz) deve usar **`env.apiBaseUrl`** (ou proxy `/api`) para chamar essas URLs.

## Variáveis do front

- **`VITE_BACKEND_URL`** ou **`VITE_API_BASE_URL`**: URL base do backend (ex.: `https://web-production-xxx.up.railway.app`).
- Em dev, o `vite.config.js` faz proxy de **`/api`** para o backend; em produção, use a URL pública do backend.

## Endpoints principais

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/agent/health` | Health check do backend |
| GET | `/api/agent/rag/status` | Status do RAG (requer login) |
| GET | `/api/relatorio/layout` | Layout do relatório (requer login) |
| POST | `/api/relatorio/layout` | Salvar layout do relatório |
| GET | `/api/room-bookings` | Listar agendamentos de salas |
| POST | `/api/room-bookings` | Criar agendamento |
| GET | `/api/room-bookings/:id` | Obter agendamento |
| PUT | `/api/room-bookings/:id` | Atualizar agendamento |
| DELETE | `/api/room-bookings/:id` | Remover agendamento |
| GET | `/api/environments` | Listar ambientes (CD) |
| POST | `/api/environments` | Criar ambiente |
| GET | `/api/environments/:id` | Obter ambiente |
| PUT | `/api/environments/:id` | Atualizar ambiente |
| DELETE | `/api/environments/:id` | Remover ambiente |
| GET | `/api/agent/library/catalog` | Catálogo da biblioteca de automações |
| POST | `/api/agent/library/run` | Executar automação |
| GET | `/api/agent/library/run/:run_id` | Status/resultado da execução |
| GET | `/api/agent/dashboard-gen` | Listar solicitações de dashboard |
| POST | `/api/agent/dashboard-gen` | Criar solicitação de dashboard |
| GET | `/api/agent/dashboard-gen/:id` | Obter solicitação |
| DELETE | `/api/agent/dashboard-gen/:id` | Excluir solicitação |
| GET | `/api/agent/chat/history` | Histórico de conversas (chat IA) |
| GET | `/api/agent/chat/:id/messages` | Mensagens de uma conversa |
| POST | `/api/agent/chat/message` | Enviar mensagem no chat |
| GET | `/api/agent/knowledge` | Listar base de conhecimento |
| POST | `/api/agent/knowledge` | Adicionar item |
| DELETE | `/api/agent/knowledge/:id` | Remover item |
| GET | `/api/indicadores-executivos` | Indicadores executivos |
| GET | `/api/relatorio-entregas` | Relatório de entregas |
| POST | `/api/agent/relatorio-resultados/request` | Solicitar relatório de resultados |
| GET | `/api/agent/relatorio-resultados/status/:id` | Status do relatório |

## Autenticação

A maioria das rotas exige **sessão ativa** (cookie de sessão do Flask). O login é feito na aplicação legada: **`/login`** (backend). Para o front React consumir APIs com sessão:

1. O usuário faz login no backend (ex.: redirecionamento para `VITE_BACKEND_URL/login`).
2. Depois do login, o front pode chamar as APIs no mesmo domínio (proxy) ou com `credentials: 'include'` se o backend estiver em outro domínio e com CORS configurado para credenciais.

## Uso no código (React)

```js
import { httpGet, httpPost } from '@/services/httpClient'
import api from '@/api/endpoints'

// GET
const health = await httpGet(api.health)
const rooms = await httpGet(api.roomBookings)

// POST (com body)
const result = await httpPost(api.chatMessage, { body: JSON.stringify({ conversation_id: 1, role: 'user', content: 'Olá' }) })
```

Os caminhos centralizados estão em **`src/api/endpoints.js`**.
