# GeRot Agent API (Node/Fastify)

Serviço Node.js separado para atender o **agent_local** (Brudam) mantendo o mesmo contrato HTTP já usado no backend Flask.

## Endpoints suportados

- `POST /api/agent/sync/knowledge`
- `GET /api/agent/rpas/pending`
- `POST /api/agent/rpa/:id/result`
- `GET /api/agent/dashboards/pending?limit=N`
- `POST /api/agent/dashboard/:id/progress`
- `POST /api/agent/dashboard/:id/result` (suporta `Content-Encoding: gzip` e chunks `_chunk_info`)

## Variáveis de ambiente

Veja `.env.example`.

## Rodar local

1. Instalar deps:

```bash
npm install
```

2. Criar `.env`:

```bash
cp .env.example .env
```

3. Subir:

```bash
npm run dev
```

## Apontar o agent_local

No PC do agente, ajuste no `.env` do `agent_local`:

- `GEROT_API_URL=http://<host-do-agent-api>:8080`
- `AGENT_API_KEY=<mesma-chave>` (se você configurou `AGENT_API_KEY` no servidor)

Observação: o header usado é `X-API-Key`.
