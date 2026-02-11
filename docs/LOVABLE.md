# Guia Lovable – Front GeRot (Vite/React)

Este documento orienta a organização do front e a conexão com o backend para o Lovable melhorar a interface sem quebrar chamadas.

## Estrutura do front (raiz do repositório)

```
raiz/
├── index.html          # Entry HTML do app (Lovable exige na raiz)
├── vite.config.js      # Config Vite + proxy /api
├── package.json        # scripts: dev, build, build:dev, start
├── src/
│   ├── main.jsx        # Bootstrap React
│   ├── App.jsx         # App principal (rotas/redirect)
│   ├── App.css
│   ├── index.css       # Estilos globais
│   ├── config/
│   │   └── env.js       # VITE_* → backendUrl, apiBaseUrl, etc.
│   ├── api/
│   │   └── endpoints.js # Caminhos das APIs (usar aqui em vez de strings soltas)
│   ├── services/
│   │   └── httpClient.js # httpGet, httpPost (base para chamadas ao backend)
│   ├── modules/        # Um módulo por feature (ex.: health, chat, dashboard)
│   │   └── <nome>/
│   │       ├── api/     # Funções que chamam backend (usam httpClient + endpoints)
│   │       ├── components/
│   │       └── hooks/
│   └── assets/
└── public/             # Arquivos estáticos (vite.svg, etc.)
```

## Onde o Lovable deve editar

- **UI e fluxo:** `src/App.jsx`, `src/**/components/**`, `src/index.css`, `src/App.css`.
- **Chamadas ao backend:** usar sempre **`src/services/httpClient.js`** (httpGet, httpPost) e **`src/api/endpoints.js`** para os caminhos. Não colocar URLs ou paths fixos nos componentes.
- **Config:** `src/config/env.js` já lê `VITE_BACKEND_URL`, `VITE_API_BASE_URL`, etc. Não hardcodar URL do backend no código.

## Como fazer chamadas corretas

1. **Importar o client e os endpoints:**
   ```js
   import { httpGet, httpPost } from '../services/httpClient'
   import api from '../api/endpoints'
   ```

2. **Usar os caminhos de `endpoints.js`:**
   ```js
   const data = await httpGet(api.health)
   const result = await httpPost(api.chatMessage, { body: JSON.stringify({ ... }) })
   ```

3. **Não usar:** `fetch('/api/...')` com path fixo em vários arquivos; centralizar em `endpoints.js` e usar `httpClient`.

## Documentação das APIs

- **`docs/FRONT_API.md`** – Lista dos endpoints do backend, métodos e breve descrição. Consultar para saber o que o front pode chamar e como (GET/POST, etc.).

## Backend e “docs do projeto”

- O **backend** é o Flask em **`app_production.py`** (rotas em **`/api/...`** e páginas em **`/login`**, **`/team/dashboard`**, etc.).
- **Templates HTML** do backend ficam em **`templates/`** (app legado).
- **Arquivos estáticos** do backend (CSS/JS/imagens) ficam em **`static/`**.
- O app **Vite/React na raiz** é o front “novo”; ele consome as **APIs** do backend e pode redirecionar para `/login` ou `/dashboard` do backend quando precisar de sessão.

Para o Lovable melhorar a interface:

1. Manter a estrutura acima (especialmente `config/env.js`, `api/endpoints.js`, `services/httpClient.js`).
2. Adicionar novas telas em **`src/modules/<feature>/components`** e chamadas em **`src/modules/<feature>/api`** usando `httpClient` + `endpoints`.
3. Atualizar **`docs/FRONT_API.md`** se surgirem novos endpoints no backend.

## Variáveis de ambiente (front)

No **.env** na raiz (ou no painel do Lovable/Railway):

- **`VITE_BACKEND_URL`** – URL do backend (ex.: `https://web-production-xxx.up.railway.app`).
- **`VITE_API_BASE_URL`** – Opcional; se vazio, usa `VITE_BACKEND_URL`.
- **`VITE_REDIRECT_TO_BACKEND_LOGIN`** – Se `true`, redireciona `/` para o login do backend.

Assim a conexão entre o Lovable (front na raiz) e o backend fica organizada e previsível.
