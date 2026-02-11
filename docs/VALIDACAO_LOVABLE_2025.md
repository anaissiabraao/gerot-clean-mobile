# Validação dos incrementos Lovable + correção de deploy

**Data:** 11/02/2025  
**Objetivo:** Validar o merge do Lovable e corrigir a falha de build no Railway.

---

## 1. Causa do deploy falho

O build no Railway (Nixpacks) falhava com:

```
Rollup failed to resolve import "react-router-dom" from "/app/src/main.jsx".
```

**Motivo:** O Lovable adicionou uso de **`react-router-dom`** e **`lucide-react`** no código, mas essas dependências **não foram incluídas no `package.json`**. No deploy, `npm ci` instala só o que está no `package.json`, então o Vite/Rollup não encontra os módulos e o build quebra.

---

## 2. Correções aplicadas

### 2.1 Dependências em `package.json`

Foram adicionadas:

- **`react-router-dom`** (^7.4.1) — usado em `main.jsx`, `App.jsx`, `Sidebar.jsx`, `Topbar.jsx`, `Home.jsx`
- **`lucide-react`** (^0.468.0) — usado em páginas e componentes de UI (ícones)

Com isso, `npm install` / `npm ci` + `npm run build` passam a funcionar no Railway.

### 2.2 Alinhamento com o backend — Indicadores

Na página **Indicadores**, o filtro “Base de Dados” foi alinhado ao contrato do backend:

- **Antes:** parâmetro `base` com valores `producao` / `homologacao`
- **Agora:** parâmetro **`database`** com valores **`azportoex`** (MATRIZ) e **`portoexsp`** (FILIAL), conforme `app_production.py` (`/api/indicadores-executivos`).

Assim, a chamada à API passa a bater com o que o backend espera.

---

## 3. Validação dos incrementos do Lovable

### 3.1 Estrutura e regras técnicas

- **Layout:** Sidebar + Topbar + MainLayout implementados; uso de `react-router-dom` (Routes, Route, Navigate, NavLink, useLocation).
- **Chamadas ao backend:** Páginas usam **`httpClient`** (`httpGet`, `httpPost`) e **`api`** (endpoints) corretamente — não há URLs hardcoded.
- **Rotas:** Home, Dashboards, Indicadores, Chat, Agenda, Biblioteca, Perfil; fallback `*` → Navigate para `/`.
- **Componentes UI:** Button, Card, Badge, Input, Select, Modal, KpiCard, EmptyState, FilterBar, Skeleton (SkeletonCard, SkeletonKpi) — presentes e utilizados.
- **Tema:** Hook `useTheme` e suporte a dark/light (Topbar).

### 3.2 Páginas e APIs

| Página        | API usada                         | Observação                                      |
|---------------|-----------------------------------|-------------------------------------------------|
| Dashboards    | `api.environments`                | Backend retorna ambientes CD; dashboards PBI podem vir de outra API no futuro. |
| Indicadores   | `api.indicadoresExecutivos`       | Filtros alinhados: `database`, `data_inicio`, `data_fim`. |
| Chat          | `api.chatHistory`, `api.chatMessages`, `api.chatMessage` | Uso correto dos endpoints.              |
| Agenda        | `api.roomBookings`, `api.roomBooking(id)` | CRUD de agendamentos.                   |
| Biblioteca    | `api.libraryCatalog`, `api.libraryRun`     | Catálogo e execução.                    |

### 3.3 Normalização da resposta de Indicadores

O backend devolve `panel_data` (objeto com chaves como `faturamento_mensal_d0`, `performance_entrega_on_time_percent`, etc.) e `leitura_executiva` (string). Foi adicionada normalização na página Indicadores: se `data.indicadores` ou `data.kpis` não forem arrays, o código converte `data.panel_data` em array de `{ label, value }` (ignorando chaves aninhadas como `status` e `referencias`) para preencher os KpiCards.

### 3.4 Pontos de atenção (não bloqueantes)

1. **EmptyState:** Usa `InboxIcon` do `lucide-react`; na versão instalada o export existe; em upgrades futuros, se der erro, trocar para `Inbox`.
2. **Admin:** Rotas de admin (ex.: `/admin/*`) não foram incluídas neste incremento; podem ser adicionadas depois conforme documentação.

---

## 4. Build local

Comandos executados:

```bash
npm install
npm run build
```

**Resultado:** Build concluído com sucesso (1617 módulos transformados; `dist/` gerado).

---

## 5. Recomendações para o Lovable

- Sempre que for usado um pacote npm (ex.: `react-router-dom`, `lucide-react`), **incluí-lo em `package.json`** na mesma alteração em que o import for adicionado.
- Manter chamadas ao backend apenas via `src/services/httpClient.js` e `src/api/endpoints.js`.
- Para novas telas que consumam APIs existentes, conferir o contrato (nomes de parâmetros e formato da resposta) em `docs/FRONT_API.md` e em `app_production.py`.

---

*Com as dependências corrigidas no `package.json`, o deploy no Railway (Nixpacks + `bun run build` / `npm run build`) deve passar.*
