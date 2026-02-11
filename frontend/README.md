# GeRot Frontend (Vite + React)

Frontend modular em Vite + React para integrar com Lovable e backend poliglota.

## Executar localmente

1. Copie `.env.example` para `.env` e ajuste as variaveis.
2. Instale dependencias:
   - `npm install`
3. Inicie o frontend:
   - `npm run dev`

Por padrao, o app abre na porta `5173`.

## Integracao com backend

- O `vite.config.js` tem proxy de `/api` para `VITE_BACKEND_URL` (padrao `http://localhost:5000`).
- Em producao, `VITE_BACKEND_URL` tambem eh usado como fallback para chamadas HTTP quando `VITE_API_BASE_URL` estiver vazio.
- O modulo de status usa `VITE_HEALTH_ENDPOINT` (padrao `/api/agent/health`) para validar conectividade.
- Para consumir backend sem proxy, configure `VITE_API_BASE_URL`.
- Para redirecionar automaticamente da raiz do front para o login legado, use `VITE_REDIRECT_TO_BACKEND_LOGIN=true`.

## Deploy no Railway (Vite/React, sem Caddy)

Para o Lovable poder fazer updates, o front **precisa** ser servido como app Vite/React (build + `vite preview`), nao como estatico via Caddy.

1. No Railway, no servico do **front**:
   - **Root Directory**: `frontend` (raiz do app = pasta deste projeto).
   - **Build**: Nixpacks detecta Node; roda `npm install` e `npm run build`.
   - **Start**: `npm run start` (usa `vite preview` para servir `dist/` na porta `PORT`).
2. Se o servico foi criado com Caddy/template estatico, altere para **Node** (ou use o `frontend/railway.json` deste repo).
3. Variaveis de ambiente: `VITE_BACKEND_URL`, `VITE_REDIRECT_TO_BACKEND_LOGIN`, etc. (veja `.env.example`).

Assim o deploy fica 100% Vite/React e compativel com o Lovable.

## Estrutura inicial

- `src/config`: configuracoes de ambiente.
- `src/services`: infraestrutura compartilhada (HTTP client).
- `src/modules`: modulos por dominio (ex.: `health`).
- `src/App.jsx`: casca principal da aplicacao.
