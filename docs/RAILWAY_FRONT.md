# Front no Railway – Variáveis e settings para updates do Lovable

Configurações do **serviço de front** no Railway para que os updates do Lovable subam e rodem corretamente.

---

## Por que o “front” estava rodando o backend (Gunicorn / DATABASE_URL)?

Quando o serviço **front** usa **Root Directory = `/`** (raiz), o Railway usa o **`railway.json` da raiz**, que é o do **backend** (Dockerfile + Gunicorn + `app_production:app`). Aí o “front” vira na verdade o Flask e dá erro de `DATABASE_URL`. Para o front rodar Vite/React a partir da raiz, o serviço front precisa usar **outro** arquivo de config.

---

## 1. Config do front na raiz (obrigatório quando Root = `/`)

Foi criado na raiz o arquivo **`railway.front.json`**, com build **Nixpacks** e start **`npm run start`** (Vite preview).

No Railway, no serviço **front**:

1. **Settings** → **Config-as-code** → **Railway Config File**.
2. Em **Add File Path** (ou “Config file path”), defina: **`railway.front.json`**.
3. Salve. Assim o serviço front passa a usar esse config em vez do `railway.json` (backend).

Resumo:

| Setting | Valor |
|--------|--------|
| **Root Directory** | `/` (raiz) – para receber os updates do Lovable |
| **Railway Config File** (Config-as-code) | **`railway.front.json`** |
| Build | Nixpacks (lê do `railway.front.json`) |
| Start | `npm run start` (lê do `railway.front.json`) |

Sem o **Railway Config File** apontando para `railway.front.json`, o front continua usando o `railway.json` da raiz (backend) e o deploy roda Gunicorn/Flask.

---

## 2. Demais settings do serviço (Railway Dashboard)

| Setting | Valor recomendado | Observação |
|--------|--------------------|------------|
| **Build Command** | *(deixar em branco / default)* | Nixpacks usa `npm install` + `npm run build`. |
| **Node version** | `18` ou superior | Opcional: `NODE_VERSION=18` nas variáveis. |

**Porta:** o Railway expõe a porta (ex.: 8080). O script `start` usa `PORT` com fallback para 5173; não é preciso configurar porta manualmente.

---

## 3. Variáveis de ambiente (obrigatórias no build)

O Vite **embute** as variáveis `VITE_*` no build no momento do `npm run build`. Por isso elas **têm que estar definidas no Railway** no serviço do front **antes** do build.

Configure no serviço do front no Railway (Variables):

| Variável | Obrigatória | Exemplo (produção) | Descrição |
|----------|-------------|--------------------|-----------|
| **`VITE_BACKEND_URL`** | ✅ Sim | `https://seu-backend.up.railway.app` | URL do backend (Flask). O front chama as APIs e pode redirecionar para login/dashboard aqui. |
| **`VITE_API_BASE_URL`** | ❌ Opcional | *(vazio ou igual ao backend)* | Se vazia, o app usa `VITE_BACKEND_URL`. Só defina se a base das APIs for diferente. |
| **`VITE_HEALTH_ENDPOINT`** | ❌ Opcional | `/api/agent/health` | Endpoint de health (valor padrão já é esse). |
| **`VITE_REQUEST_TIMEOUT_MS`** | ❌ Opcional | `10000` | Timeout em ms das chamadas HTTP (padrão 10000). |
| **`VITE_REDIRECT_TO_BACKEND_LOGIN`** | ❌ Opcional | `true` ou `false` | Se `true`, redireciona `/` para o login do backend. Em produção costuma ser `true`. |

**Importante:** não é preciso definir `PORT`; o Railway injeta automaticamente. O script `start` já usa `PORT` com fallback para 5173.

---

## 4. Exemplo mínimo (produção)

No painel do serviço **front** no Railway, em **Variables**:

```env
VITE_BACKEND_URL=https://gerot-dashboard-production-xxxx.up.railway.app
VITE_REDIRECT_TO_BACKEND_LOGIN=true
```

Substitua a URL pela URL real do seu serviço **backend** no Railway.

---

## 5. Checklist para cada update do Lovable

1. **Variáveis** – Manter `VITE_BACKEND_URL` (e opcionais) configuradas no serviço front do Railway.
2. **Root Directory** – Se o Lovable edita a **raiz**, o deploy do front deve usar a raiz (Root = `.`) ou uma pasta que fique em sync com a raiz (ex.: `frontend/`).
3. **Build** – Após push do Lovable, o Railway faz um novo build; as variáveis já definidas serão usadas no `vite build`.
4. **CORS / mesmo domínio** – Se o front e o backend estiverem em domínios diferentes, o backend já deve permitir a origem do front (ex.: URL do front no Railway). Se servirem pelo mesmo app (proxy), não precisa mudar CORS.

Com isso, os updates do Lovable sobem no GitHub, o Railway faz o build e o deploy do front usando as variáveis corretas e o front fica conectado ao backend.
