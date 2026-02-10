# Deploy Railway: Backend + Frontend + PostgreSQL

## 1) Criar serviços no mesmo projeto Railway

1. **PostgreSQL**
   - Adicione o plugin PostgreSQL no projeto.
   - Guarde as credenciais/variáveis geradas (principalmente `DATABASE_URL`).
2. **Backend Node/Express**
   - Use a raiz do repositório.
   - Build via `railway.json` usando `Dockerfile.node`
   - Start: `npm run start:railway`
3. **Frontend estático**
   - Use `Root Directory = frontend`.
   - Build: `npm install && npm run build`
   - Start: `npm start`

## 2) Variáveis de ambiente (backend)

Obrigatórias:

- `DATABASE_URL` (injetada pelo PostgreSQL do Railway)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://<frontend>.up.railway.app`

Se necessário, use múltiplos domínios em `CORS_ORIGIN` separados por vírgula.

## 3) Migração do schema Prisma

O `start:railway` já executa:

1. `prisma migrate deploy` (se houver migrations)
2. fallback `prisma db push` (ambiente sem pasta `migrations`)
3. sobe a API

Para carga inicial opcional:

- execute `npm run seed` manualmente no serviço backend (Railway Shell).

## 4) Checklist pós-deploy

1. `GET https://<backend>.up.railway.app/health` retorna `status: ok`.
2. `GET https://<backend>.up.railway.app/ready` retorna `ready: true`.
3. Frontend em `https://<frontend>.up.railway.app` consegue login.
4. CRUD principal responde sem erro 5xx.

## 5) Artefatos legados (manter por segurança)

Os componentes Python/Flask/RAG do repositório permanecem para compatibilidade operacional, mas não fazem parte deste deploy Node + frontend estático:

- `app_production.py`
- `rag_service/`
- `Dockerfile.rag`
- `railway-rag.json`

Para evitar conflito no Railway:

- serviço backend Node deve usar `railway.json` + `Dockerfile.node`
- serviço Python/RAG (se existir) deve usar configuração separada (`railway-rag.json`/`Dockerfile.rag`)
