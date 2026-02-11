# Front GeRot (Vite/React na raiz)

Interface em Vite/React na **raiz** do repositório, integrada ao backend Flask e preparada para edição pelo Lovable.

## Estrutura

- **`src/config/env.js`** – Variáveis `VITE_*` (backendUrl, apiBaseUrl, etc.).
- **`src/api/endpoints.js`** – Caminhos das APIs do backend (usar em vez de strings soltas).
- **`src/services/httpClient.js`** – `httpGet`, `httpPost`, `httpPut`, `httpDelete` (base para chamadas ao backend).
- **`src/modules/<feature>/`** – Um módulo por feature (api, components, hooks).

## Chamadas ao backend

1. Importar client e endpoints:  
   `import { httpGet, httpPost } from './services/httpClient'` e `import api from './api/endpoints'`
2. Usar caminhos centralizados:  
   `await httpGet(api.health)`, `await httpPost(api.chatMessage, { body: JSON.stringify({ ... }) })`
3. Não hardcodar URLs ou paths nos componentes; manter em `config/env.js` e `api/endpoints.js`.

## Documentação

- **`docs/FRONT_API.md`** – Lista dos endpoints do backend.
- **`docs/LOVABLE.md`** – Guia para o Lovable (estrutura, onde editar, como chamar APIs).

## Comandos

- `npm run dev` – Servidor de desenvolvimento (proxy `/api` para o backend).
- `npm run build` – Build de produção.
- `npm run build:dev` – Build em modo development.
- `npm run start` – Servir build (ex.: em produção no Railway).

## Sincronização com `frontend/`

O app Vite está na **raiz** (para o Lovable). A pasta **`frontend/`** pode ser mantida em sync com a raiz para deploy (Railway com Root Directory = `frontend`) ou pode ser removida e o deploy passar a usar a raiz.
