# Instruções para o Lovable — Remodelação Completa do Frontend GeRot

Use este texto como prompt/base ao enviar o projeto ao Lovable para refatoração da interface.

---

## Contexto do Projeto

O **GeRot** é uma plataforma Data Analytics SaaS da PORTOEX. O backend é **Flask (Python) + PostgreSQL**; a UI principal hoje é feita com **templates Jinja2 (Tailwind)** servidos pelo mesmo backend. Existe um **SPA React (Vite)** na raiz do repositório que está mínimo: apenas redireciona para o login do backend e mostra um card de status do backend. O objetivo é **transformar esse SPA React na interface principal**, moderna e alinhada a dashboards de análise de dados (Power BI, Tableau, Stripe, Vercel Analytics).

---

## Regras Técnicas Obrigatórias

1. **Chamadas ao backend:** Usar **sempre** os módulos existentes:
   - `src/config/env.js` — base URL e configurações (VITE_BACKEND_URL, etc.).
   - `src/api/endpoints.js` — caminhos das APIs (ex.: `api.indicadoresExecutivos`, `api.chatHistory`).
   - `src/services/httpClient.js` — `httpGet`, `httpPost`, `httpPut`, `httpDelete` (não usar `fetch` direto com URLs hardcoded).

2. **Autenticação:** O login é feito no backend (página `/login`). Após o login, o backend usa **sessão por cookie**. Para o React consumir as APIs em outro domínio, todas as requisições devem enviar **`credentials: 'include'`** (ou equivalente no httpClient). Não hardcodar URL do backend; usar `env.apiBaseUrl` ou `env.backendUrl`.

3. **Documentação de APIs:** Consultar **`docs/FRONT_API.md`** para lista de endpoints, métodos e descrição. Novos endpoints devem ser adicionados em `src/api/endpoints.js` e, se possível, documentados em `docs/FRONT_API.md`.

---

## Referências de Design

- **Power BI / Tableau:** Layout modular; grid de widgets; filtros em destaque; hierarquia clara (título → KPIs → gráficos → tabelas).
- **Stripe Dashboard:** Sidebar fixa; topbar limpa; cards com borda sutil; tipografia forte; poucas cores.
- **Notion / Linear:** Espaço em branco; ícones consistentes; microinterações.
- **Vercel Analytics:** Gráficos limpos; números grandes; dark mode; sensação de produto técnico premium.

---

## Escopo da Refatoração (entregas desejadas)

### Fase 1 — Layout e Navegação
1. **Layout único:** Sidebar fixa (esquerda) + Topbar (topo).
2. **Sidebar:** Logo GeRot; links: Início, Dashboards, Indicadores, Chat IA, Agenda CD, Biblioteca; bloco “Administração” (Admin Dashboard, Usuários, Assets, etc.) apenas para usuário admin; rodapé: Perfil, Tema (dark/light), Sair.
3. **Topbar:** Título da página ou breadcrumb; à direita: usuário (nome ou avatar) e toggle dark/light.
4. **Rotas:** `/` (Home), `/dashboards`, `/indicadores`, `/chat`, `/agenda`, `/biblioteca`, `/perfil`; `/admin/*` para admin. Login pode continuar redirecionando para o backend (`env.backendUrl + '/login'`) ou ser replicado no React (se preferir, manter redirect para backend na primeira entrega).

### Fase 2 — Páginas Principais
1. **Home:** Resumo opcional (ex.: 4 KPI cards) + atalhos para Dashboards, Indicadores, Chat, Agenda (cards clicáveis).
2. **Dashboards:** Grid de cards (título, descrição, tipo [Power BI / Interno]); ao clicar, abrir modal ou página com iframe do Power BI ou link para recurso interno. Dados podem vir de API (quando existir) ou mock inicial.
3. **Indicadores:** Filtros no topo (Data Início, Data Fim, Base de Dados); chamar `GET /api/indicadores-executivos` com query params; exibir “Leitura Executiva” e grid de KPI cards; usar componentes reutilizáveis (KpiCard).
4. **Chat IA:** Lista de conversas (`GET /api/agent/chat/history`); ao selecionar conversa, carregar mensagens (`GET /api/agent/chat/:id/messages`); área de input para enviar mensagem (`POST /api/agent/chat/message`); opção de upload de arquivo (usar endpoint existente se documentado). Layout: coluna esquerda com lista de conversas; área direita com mensagens + input.
5. **Agenda CD:** Listar agendamentos (`GET /api/room-bookings`); formulário para criar/editar (`POST /api/room-bookings`, `PUT /api/room-bookings/:id`); exibir em tabela ou cards com ações editar/excluir.
6. **Biblioteca:** Listar catálogo (`GET /api/agent/library/catalog`); cards por automação; ação “Executar” com feedback (toast de sucesso/erro e status quando houver endpoint de status).
7. **Perfil:** Formulário com nome, username, email, avatar (upload se houver endpoint); seção “Alterar senha”; salvar via APIs do backend (consultar docs).

### Fase 3 — Componentes e Design System
1. **Componentes UI base:** Button (variants: primary, outline, ghost, danger; sizes: sm, md, lg), Card, Input, Select, Label, Modal, Drawer, Toast (ou notificação), Skeleton, Badge, Empty State.
2. **Componentes de dashboard:** KpiCard (valor, rótulo, tendência opcional), ChartCard (título + área para gráfico, ex.: Chart.js ou Recharts), TableCard (título + tabela com cabeçalho e linhas), FilterBar (datas, selects; onChange/onReset).
3. **Design tokens:** Manter ou estender as variáveis em `src/index.css` (ou `static/src/input.css`) para cores, radius, sombras; usar Tailwind com essas variáveis. Garantir suporte a `.dark` para dark mode.

### Fase 4 — UX e Polish
1. **Loading:** Skeleton em listas e grids; spinner em botões de submit.
2. **Feedback:** Toast em sucesso/erro (salvar, enviar mensagem, executar automação).
3. **Empty states:** Quando não houver dados, exibir ícone + título + descrição + CTA se aplicável.
4. **Responsividade:** Sidebar vira drawer no mobile; tabelas com scroll horizontal ou layout em cards; filtros em drawer ou colapsável no mobile.
5. **Dark/Light:** Toggle na topbar; persistir em localStorage; aplicar classe `dark` no root.

---

## Estrutura de Pastas Sugerida (React)

```
src/
├── app/                 # Layout (Sidebar + Topbar), Router, rotas
├── components/
│   ├── ui/              # Button, Card, Input, Modal, Skeleton, Toast, Badge, ...
│   └── dashboard/       # KpiCard, ChartCard, TableCard, FilterBar
├── features/            # Por domínio (opcional)
│   ├── dashboard/
│   ├── indicadores/
│   ├── chat/
│   ├── agenda/
│   ├── biblioteca/
│   └── admin/
├── hooks/               # useAuth, useIndicadores, useChat, ...
├── services/            # httpClient (já existe)
├── api/                  # endpoints (já existe)
├── config/               # env (já existe)
├── styles/               # index.css, tokens
└── assets/
```

---

## Documentos de Apoio no Repositório

- **`docs/DOCUMENTACAO_TECNICA_REFATORACAO.md`** — Análise completa do projeto, arquitetura, fluxos, mapeamento de telas, proposta de remodelação e melhorias.
- **`docs/UX_UI_ESTRATEGICO.md`** — Direção de design, princípios de UX, sistema visual, jornada do usuário.
- **`docs/FRONT_API.md`** — Lista de endpoints do backend.
- **`docs/LOVABLE.md`** — Estrutura do front e como fazer chamadas corretas ao backend.
- **`docs/RAILWAY_FRONT.md`** — Deploy do front no Railway (variáveis e config).

---

## Checklist Rápido para o Lovable

- [ ] Layout Sidebar + Topbar implementado.
- [ ] Rotas: Home, Dashboards, Indicadores, Chat, Agenda, Biblioteca, Perfil; Admin para admin.
- [ ] Chamadas API apenas via `httpClient` + `endpoints`; `credentials: 'include'` se cross-origin.
- [ ] Página Indicadores consumindo `/api/indicadores-executivos` e exibindo KPI cards + Leitura Executiva.
- [ ] Página Chat com histórico, mensagens e envio; upload de arquivo se disponível.
- [ ] Componentes: KpiCard, ChartCard, Button, Card, Input, Modal, Skeleton, Toast.
- [ ] Dark/Light toggle na topbar com persistência.
- [ ] Skeleton loading e Empty states onde fizer sentido.
- [ ] Responsividade: drawer no mobile; tabelas e filtros adaptados.

---

*Use este arquivo junto com DOCUMENTACAO_TECNICA_REFATORACAO.md e UX_UI_ESTRATEGICO.md para orientar toda a remodelação no Lovable.*
