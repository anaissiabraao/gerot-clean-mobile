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

## Estrutura inicial

- `src/config`: configuracoes de ambiente.
- `src/services`: infraestrutura compartilhada (HTTP client).
- `src/modules`: modulos por dominio (ex.: `health`).
- `src/App.jsx`: casca principal da aplicacao.
