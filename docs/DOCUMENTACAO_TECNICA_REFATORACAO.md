# Documentação Técnica e Estratégica — GeRot Data Analytics SaaS

**Versão:** 1.0  
**Data:** 11/02/2025  
**Objetivo:** Base para refatoração completa do frontend no Lovable e alinhamento da plataforma a padrões modernos de Data Analytics SaaS.

---

# PARTE I — ANÁLISE COMPLETA DO PROJETO (FASE 1)

## 1. Estrutura de Pastas

```
gerot-clean-mobile/
├── app_production.py          # Backend Flask monolítico (~8.4k linhas)
├── package.json, vite.config.js   # Frontend Vite/React (raiz)
├── src/                        # SPA React (raiz) — mínimo, redireciona para backend
│   ├── App.jsx, main.jsx
│   ├── config/env.js
│   ├── api/endpoints.js
│   ├── services/httpClient.js
│   └── modules/health/         # Único módulo: BackendStatusCard
├── frontend/                  # Cópia/espelho do SPA (usado em Railway com Root=frontend)
├── templates/                 # Jinja2 — UI principal servida pelo Flask
│   ├── base_tailwind.html
│   ├── team_dashboard_tailwind.html, admin_*_tailwind.html, agent_*_tailwind.html
│   └── partials/header_tailwind.html, relatorio_block.html
├── static/                     # CSS/JS/imagens do backend
│   ├── css/tailwind.css, animations.css
│   ├── js/app.js, relatorio.js
│   └── src/input.css          # Fonte Tailwind (tokens)
├── db/                         # SQL de migrações (agent_*, setup)
├── utils/                      # database.py (SQLite routine_manager), indicadores_executivos, library_reports, planner_client
├── rag_service/                # Serviço RAG (Python) separado
├── docs/                       # Documentação (este arquivo, FRONT_API, LOVABLE, RAILWAY_FRONT)
└── data/, scripts/, tools/, automate/, agent_local/, docling-main/  # Dados, scripts, automações
```

**Problemas de organização:**
- Duplicação de frontend: `src/` na raiz e `frontend/src/` com conteúdo quase idêntico.
- Backend monolítico: toda lógica em `app_production.py` (rotas, negócio, DB, RAG proxy).
- Templates Jinja2 são a UI real; o SPA React na raiz é apenas um shell (redireciona para login e mostra BackendStatusCard).
- `utils/database.py` é SQLite para outro domínio (routine_manager); o app principal usa PostgreSQL via pool em `app_production.py`.

---

## 2. Backend — Rotas, Controllers, Services, Models

### 2.1 Stack
- **Framework:** Flask (CORS, Compress, Flask-RESTful Api)
- **Banco:** PostgreSQL (psycopg2, pool 1–60 conexões, RealDictCursor)
- **Auth:** Sessão Flask (cookie), bcrypt para senhas, `login_required` / `admin_required`
- **Integrações:** RAG (HTTP), Microsoft Planner (sync dashboards), Brudam (MySQL para indicadores/entregas), Power BI (embed URLs)

### 2.2 Grupos de Rotas (resumo)

| Grupo | Exemplos | Autenticação |
|-------|----------|--------------|
| Público | `/`, `/login`, `/signin` | — |
| Autenticado | `/dashboard`, `/profile`, `/team/dashboard`, `/dashboards`, `/cd/booking`, `/agent`, `/agent/library` | login_required |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/assets`, `/admin/dashboards/add`, `/admin/planner/sync`, `/admin/live-users` | admin_required |
| API JSON | `/api/agent/health`, `/api/agent/rag/*`, `/api/indicadores-executivos`, `/api/relatorio-entregas`, `/api/agent/chat/*`, `/api/agent/knowledge`, `/api/room-bookings`, `/api/environments`, `/api/agent/library/*`, `/api/agent/dashboard-gen/*`, `/api/relatorio/layout` | Sessão (maioria) |
| SPA | `/app`, `/app/<path>` | login_required (entrega index.html ou redireciona) |

### 2.3 Controllers / Services
- Não há camada Controller/Service formal: lógica de negócio e acesso a dados estão dentro das funções de rota em `app_production.py`.
- Funções auxiliares no mesmo arquivo: `get_db`, `get_user_by_id`, `authenticate_user`, `fetch_assets`, `fetch_assets_for_user`, `fetch_relatorio_meta_settings`, `ensure_schema`, `seed_asset_library`, `call_rag_service`, etc.
- Módulos externos: `utils.indicadores_executivos` (cálculos), `utils.library_reports` (relatórios/PDF), `utils.planner_client` (Planner), `automate.automation_catalog`.

### 2.4 Pontos fracos estruturais (backend)
- Monolito em um único arquivo: difícil manutenção e testes.
- Ausência de camada de serviços e repositórios: queries SQL e regras espalhadas nas rotas.
- Mistura de responsabilidades: mesmo arquivo faz roteamento, validação, SQL, chamadas HTTP (RAG), serialização JSON.
- Sem API versionada (ex.: `/api/v1/`) e documentação OpenAPI/Swagger.

---

## 3. Banco de Dados — Tabelas e Relacionamentos

### 3.1 Modelo lógico (PostgreSQL — app principal)

- **users_new** — Usuários (id, username, password, nome_completo, cargo_original, departamento, role, email, nome_usuario, is_active, first_login, avatar_url, last_seen_at, current_page, created_at, updated_at, last_login).
- **dashboards** — Dashboards Power BI (id, slug, title, description, category, embed_url, display_order, is_active, created_at, updated_at).
- **user_dashboards** — N:M usuário ↔ dashboard (user_id, dashboard_id, created_by, created_at).
- **planner_sync_logs** — Logs de sync com Microsoft Planner.
- **assets** — Ativos (nome, tipo [PBI, interno, grafico, rpa], categoria, descricao, status, ordem_padrao, embed_url, resource_url, config JSONB).
- **asset_assignments** — Atribuição de ativos a usuário ou grupo (asset_id, user_id | group_name, ordem, visivel, config JSONB).
- **asset_logs** — Logs de ações em ativos.
- **relatorio_meta_settings** — Meta valor e percentual (singleton id=1).
- **relatorio_layouts** — Layout por usuário (user_id PK, layout JSONB).
- **agent_rpa_types**, **agent_rpas** — Tipos e execuções RPA.
- **agent_data_sources**, **agent_settings** — Fontes de dados e configurações.
- **agent_dashboard_templates** — Templates de dashboard (query_config, layout_config, charts_config, filters_config, theme_config).
- **agent_dashboard_requests** — Solicitações de geração de dashboard (status, result_url, result_data).
- **agent_logs** — Logs do agente.
- **agent_conversations** — Conversas do chat IA.
- **agent_messages** — Mensagens (conversation_id, role, content, metadata).
- **agent_knowledge_base** — Base de conhecimento (question, answer, category, tags, embedding vector — pgvector).
- **room_bookings** — Agendamentos de salas (room, title, date, start_time, end_time, participants, subject, user_id).
- **environments** — Ambientes CD (code, name, description, icon, floor, display_order).
- **environment_resources** — Recursos por ambiente (environment_id, resource_type, file_url, is_primary).

Queries principais: listagem de assets por usuário/departamento (`fetch_assets_for_user`), dashboards por usuário (fallback legado), indicadores executivos (dados Brudam + cálculos em `utils.indicadores_executivos`), chat/knowledge, room_bookings, environments.

### 3.2 Observações
- Schema criado/atualizado em `ensure_schema()` e `ensure_agent_tables()` no arranque; migrações manuais em `db/*.sql`.
- Brudam: banco MySQL externo (azportoex, portoexsp) para operações/entregas; usado em `/api/indicadores-executivos` e relatórios.

---

## 4. Fluxo de Autenticação

1. **GET /login** — Exibe formulário (username ou email + senha).
2. **POST /login** — `authenticate_user(identifier, password)` (consulta `users_new`, bcrypt.checkpw). Se `first_login` → redireciona para first_login (definir nova senha e opcionalmente email). Senão → preenche `session` (user_id, username, role, email, nome_completo, departamento) e redireciona para `index()`.
3. **index()** — Se logado: admin → `admin_dashboard`, senão → `team_dashboard`. Se não logado → `login`.
4. **logout** — `session.clear()`, redirect login.
5. **Sessão:** cookie de sessão Flask, `PERMANENT_SESSION_LIFETIME = 7 dias`. `@login_required` verifica `user_id` em session; `@admin_required` verifica `role == 'admin'`.
6. **APIs:** Maioria exige sessão ativa; front React deve enviar cookies (`credentials: 'include'`) quando backend e front estão em domínios diferentes (CORS com credenciais).

---

## 5. Controle de Permissões

- **Roles:** `admin` e usuário comum (sem enum explícito de outros roles no código).
- **Admin:** acesso a `/admin/*`, preview de dashboard por usuário/grupo (`?preview_user_id=`, `?preview_group=`), gestão de usuários, assets, dashboards, Planner sync, ambientes, etc.
- **Usuário:** dashboard conforme atribuições (`asset_assignments` por user_id ou group_name/departamento), CD booking, Biblioteca (agent), perfil.
- Atribuição de assets: `fetch_assets_for_user(user_id, department)` combina assignments por usuário e por grupo (departamento).

---

## 6. APIs Externas Integradas

- **RAG:** POST `{RAG_API_URL}/v1/agent/qa` ou `/v1/qa`, POST `/v1/ingest-file`. Headers `x-api-key`. Timeout configurável.
- **Microsoft Planner:** sync de tarefas/planos para popular dashboards (PlannerClient).
- **Brudam (MySQL):** leitura de coletas/entregas para indicadores executivos e relatórios.
- **Power BI:** apenas embed de iframes (URLs em `dashboards.embed_url` e `assets.embed_url`).

---

## 7. Componentização do Frontend

- **UI real:** Templates Jinja2 (Tailwind). Um “componente” é um bloco ou include (ex.: `partials/header_tailwind.html`, `partials/relatorio_block.html`). Não há componentes React reutilizáveis para as telas principais; o SPA na raiz tem só o módulo `health` (BackendStatusCard).
- **Estado global:** Nenhum no React (SPA mínimo). No servidor: sessão Flask e dados injetados nos templates (ex.: `assets`, `regular_assets`, `internal_assets`, `relatorio_meta`).
- **Interatividade:** JavaScript inline e em `static/js/app.js`, `static/relatorio.js` (tabs, chat, indicadores, gráficos Chart.js, chamadas fetch para APIs). Estado de UI (abas, modais) em DOM e variáveis globais.

---

## 8. Forma como os Dados São Retornados e Exibidos

- **Páginas HTML:** Dados passados por `render_template(..., assets=..., regular_assets=..., internal_assets=..., relatorio_meta=...)`. Gráficos: dados em `data-*` ou config Chart.js injetada; tabelas e cards montados no Jinja2.
- **APIs JSON:** Ex.: `/api/indicadores-executivos` → `{ success, panel_key, panel_data, leitura_executiva, indicadores_completos, periodo, database, total_operacoes }`. `/api/agent/chat/history` → lista de conversas; `/api/agent/chat/:id/messages` → mensagens. Frontend atual (templates) consome essas APIs via fetch em JS; o SPA React quase não consome (apenas health).
- **Problemas:** Inconsistência de formato entre endpoints (alguns com `success`, outros só payload); sem padrão único de paginação; erros às vezes JSON `{ error: "..." }`, às vezes HTML de erro Flask.

---

## 9. Performance

- **Backend:** Pool de conexões PostgreSQL; compressão Gzip; cache headers (no-cache para API/HTML, long cache para estáticos). Arquivo único muito grande pode causar cold start e dificultar otimizações por rota.
- **Frontend (templates):** Muitos scripts e estilos carregados por página (Chart.js, marked, Tailwind, Font Awesome, relatorio.js). Iframes Power BI por card podem pesar. Sem lazy loading sistemático de componentes ou dados.
- **Indicadores:** Uma query pesada ao Brudam por request; sem cache explícito.
- **RAG:** Timeout 60s; requests longos podem ser cortados por proxy (ex.: Railway).

---

## 10. Responsividade Atual

- Tailwind com breakpoints (sm, md, lg). Header com hamburger no mobile e drawer de navegação. Grid de cards responsivo (sm:grid-cols-2, xl:grid-cols-3). Tabs horizontais com scroll. Formulários e tabelas podem ficar apertados em telas pequenas; não há design “mobile-first” consistente em todas as telas.

---

## 11. Problemas Visuais e Estruturais (resumo)

- **Estrutura:** Dois frontends (Jinja2 vs React) sem definição clara de qual é o “produto”; SPA subutilizado.
- **Hierarquia:** Muitas informações na mesma página (dashboard com tabs Dashboards + Indicadores + Chat); barra de status + ticker + grid de cards + painéis internos + ações rápidas.
- **Componentes reutilizáveis:** Quase inexistentes no React; no Jinja2, blocos e includes são reutilizados mas não padronizados como design system.
- **Design system:** Tokens em `static/src/input.css` (cores, sombras, radius) e classes Tailwind; não há documentação de componentes (botões, cards, inputs) nem uso consistente de variáveis em todas as telas.
- **Feedback de carregamento:** Alguns spinners e “Carregando...”; sem skeleton loading padronizado.
- **Microinterações:** Poucas; transições básicas em CSS.
- **Dark/Light:** Variáveis `.dark` existem em `input.css`, mas não há toggle persistido na UI.
- **Acessibilidade:** Uso de ícones Font Awesome; nem todos os botões têm aria-label; contraste não verificado sistematicamente.
- **Inconsistências:** Mistura de estilos (badge, btn, card-base) em vários templates; nomes de classes às vezes genéricos.

---

# PARTE II — DOCUMENTAÇÃO FUNCIONAL (FASE 2)

## 1. Visão Geral do Sistema

### 1.1 Objetivo da plataforma
Centralizar gestão de rotinas, dashboards (Power BI e internos), indicadores executivos, relatórios (entregas, resultados), agendamento de salas (CD), base de conhecimento e chat com IA (RAG), automações (RPA, biblioteca de relatórios) e administração de usuários e ativos para a operação PORTOEX (GeRot).

### 1.2 Público-alvo
- **Usuários operacionais:** Acesso a dashboards atribuídos, indicadores, chat IA, agenda CD.
- **Administradores:** Gestão de usuários, assets, dashboards Power BI, metas de relatório, sync Planner, ambientes CD, laboratório de modelos.

### 1.3 Principais funcionalidades
- Login e primeiro acesso (troca de senha).
- Dashboard da equipe: abas **Dashboards** (cards PBI + painéis internos com Relatório de Resultados), **Indicadores Executivos** (filtros + leitura executiva + KPIs por perfil), **Chat IA** (histórico, mensagens, upload de arquivo para conhecimento).
- Agenda CD: reserva de salas, listagem e edição de agendamentos.
- Biblioteca (Agent): catálogo de automações, execução, dashboard-gen, RPA.
- Admin: usuários, permissões, dashboards (incl. add), assets e atribuições, metas do relatório, sync Planner, ambientes, assets estáticos.
- Perfil: edição de nome, username, email, avatar; troca de senha.
- Relatórios: layout salvo por usuário; relatório de entregas; relatório de resultados (request/status assíncrono).
- RAG: status, teste, ingestão de arquivo (proxy pelo backend).

---

## 2. Arquitetura Técnica

- **Backend:** Flask (Python 3), PostgreSQL (pool), sessão cookie, CORS, Gzip. Estrutura monolítica em `app_production.py`; utils e rag_service separados.
- **Frontend (atual):** Templates Jinja2 + Tailwind (CSS compilado em `static/css/tailwind.css`), JS em `static/js` e inline. SPA Vite/React na raiz: mínimo (redirect login + BackendStatusCard).
- **Banco:** PostgreSQL (schema acima); Brudam MySQL para indicadores/entregas.
- **Integrações:** RAG (HTTP), Planner (OAuth/config), Brudam (MySQL), Power BI (embed).

---

## 3. Fluxo de Dados

- **Entrada:** Login (form → session). Dados de negócio: Brudam (coletas/entregas), Planner (sync), uploads (avatar, arquivos RAG), formulários (room_bookings, environments, chat message, knowledge).
- **Processamento:** Cálculos em `utils.indicadores_executivos`; geração de PDF/HTML em `utils.library_reports`; RAG via `call_rag_service()`; persistência em PostgreSQL (e Brudam quando aplicável).
- **Saída para UI:** (1) HTML renderizado com variáveis Jinja2. (2) APIs JSON para indicadores, chat, knowledge, room_bookings, etc. O JS nos templates faz fetch a essas APIs e atualiza o DOM (ou Chart.js).
- **Renderização:** Servidor gera HTML completo para cada página; gráficos e listas dinâmicas são preenchidos por JS após carregar a página e chamar APIs.

---

## 4. Mapeamento de Telas (objetivo, dados, ações, problemas, melhorias)

| Tela | Objetivo | Dados exibidos | Ações | Problemas atuais | Oportunidades |
|------|----------|----------------|-------|------------------|---------------|
| **Login** | Autenticar | Form username/email + senha | POST login, link primeiro acesso | Layout simples; sem “lembrar-me” ou recuperação de senha na UI | Tela moderna, mensagens de erro claras, suporte a SSO futuro |
| **Team Dashboard** | Visão única de dashboards, indicadores e chat | Tabs: cards (PBI + internos), indicadores (filtros + KPIs + leitura), chat (mensagens) | Abrir dashboard, atualizar indicadores, enviar mensagem, upload arquivo | Poluição visual; muitas abas; ticker/status bar pouco útil; sem skeleton | Separar em páginas ou sidebar; filtros globais; cards KPI reutilizáveis; skeleton |
| **Admin Dashboard** | Central admin | Resumo, usuários ativos, metas, etc. | Navegar para usuários, assets, dashboards, metas | Muitos links; sem overview claro | Cards de métricas; navegação por seções claras |
| **Admin Users** | CRUD usuários | Lista usuários | Add, editar, excluir, permissões | Tabela densa; sem busca/filtro avançado | Tabela com busca, paginação, filtros |
| **Admin Assets** | Ativos e atribuições | Lista assets; assignments | Add asset, atribuir a usuário/grupo | Fluxo de atribuição confuso | Wizard de atribuição; preview por perfil |
| **CD Booking** | Agendar salas | Lista agendamentos; formulário | Criar, editar, excluir agendamento | UI básica | Calendário visual; conflitos em destaque |
| **CD Facilities** | Planta CD | Ambientes e recursos 3D | Navegar ambientes | Depende de recursos 3D | Manter integração; loading states |
| **Agent / Biblioteca** | Automações e execução | Catálogo, runs | Executar, ver resultado/relatório | Muitas opções na mesma tela | Cards por categoria; status de run em tempo real |
| **Profile** | Dados do usuário | Nome, username, email, avatar | Editar, trocar senha, upload avatar | Formulário longo | Abas ou steps; preview avatar |
| **Agent Lab** (admin) | Modelos e publicação | Modelos | Criar, publicar | Nicho; pouca documentação na UI | Guia inline; estados claros |

---

# PARTE III — REMODELAÇÃO COMPLETA DO FRONTEND (FASE 3)

## 1. Nova Estrutura Visual (referências: Power BI, Tableau, Stripe, Notion, Linear, Vercel Analytics)

### 1.1 Princípios
- **Layout modular:** Sidebar fixa + área de conteúdo; topbar com contexto (breadcrumb, usuário, notificações).
- **Grid organizado:** 12 colunas; cards de KPI, gráficos e tabelas em células previsíveis.
- **Hierarquia forte:** Um título principal por página; seções com títulos curtos; uso consistente de tamanhos de fonte e peso.
- **Dark/Light mode:** Toggle na topbar; persistência em localStorage; variáveis CSS já existentes (`.dark`).
- **Filtros globais:** Barra de filtros (período, base, categoria) aplicável a mais de uma tela; estado compartilhado (query params ou contexto).

### 1.2 Organização da dashboard
- **Sidebar:** Logo; navegação principal (Início, Dashboards, Indicadores, Chat IA, Agenda CD, Biblioteca); bloco Admin (se admin); rodapé com perfil e tema.
- **Área principal:** Conteúdo da rota. Na “Home” ou “Dashboards”: primeiro linha de KPIs (4–6 cards), depois grid de gráficos/dashboards (2–3 colunas). Indicadores em página dedicada com filtros no topo e blocos (Leitura Executiva, KPIs, tabelas).
- **Priorização visual:** Números principais em destaque (tamanho, cor); secundários em muted; ações primárias em botão primary.

### 1.3 Distribuição de gráficos
- Gráficos em **cards** com título e subtítulo; opção de fullscreen ou export.
- Tabelas em cards com header fixo, scroll no body, paginação ou virtualização quando necessário.
- Evitar mais de 2–3 gráficos pesados na mesma viewport; usar lazy load ou abas por seção.

---

## 2. Novo Sistema de Componentes (design system)

Definir e documentar:

| Componente | Uso | Props principais |
|------------|-----|-------------------|
| **KPI Card** | Número principal + rótulo + variação/trend | value, label, trend, period, size |
| **Chart Card** | Gráfico com título e opções | title, subtitle, chartType, data, options, onExport |
| **Table Card** | Tabela com cabeçalho e linhas | columns, rows, loading, pagination, sortable |
| **Filter Bar** | Filtros horizontais (datas, select) | filters[], values, onChange, onReset |
| **Modal** | Detalhamento ou confirmação | open, onClose, title, children, size |
| **Drawer** | Painel lateral (filtros, detalhe) | open, onClose, side, width, title |
| **Dropdown** | Ações ou seleção | trigger, items[], align, onSelect |
| **Notification / Toast** | Feedback de ação | message, type, duration, action |
| **Skeleton** | Loading de bloco/card/lista | variant (card, list, chart), lines |
| **Empty State** | Sem dados | icon, title, description, action |
| **Button** | Primário, secundário, ghost, danger | variant, size, icon, loading, disabled |
| **Input, Select, DatePicker** | Formulários | label, error, hint, disabled |

Implementação sugerida: React na raiz (ou migração gradual); componentes em `src/components/ui/` e `src/components/dashboard/`; tokens de design em CSS/ Tailwind (já parcialmente em `input.css`).

---

## 3. Nova Experiência do Usuário

- **Jornada:** Login → Home (resumo + atalhos) ou Dashboards (lista + KPIs). Navegação lateral sempre visível; cada área com uma URL clara (/dashboards, /indicadores, /chat, /agenda, /biblioteca).
- **Fluxo ideal:** Menos cliques para o dado desejado; filtros uma vez reutilizados; feedback imediato (toast, skeleton, depois dados).
- **Redução de poluição:** Remover ou recolher ticker/status bar; uma aba principal por contexto (ou páginas separadas em vez de 3 abas na mesma página).
- **Agrupamento inteligente:** Dashboards PBI em uma seção; painéis internos em outra; indicadores em página própria com painel por perfil (CEO, Diretoria, Operacional) já sugerido pelo backend.

---

# PARTE IV — MELHORIAS ESTRATÉGICAS (FASE 4)

## 1. Performance
- **Lazy loading:** Rotas e componentes pesados (Chart.js, tabelas grandes) sob demanda.
- **Paginação:** Listas (usuários, assets, agendamentos) com cursor ou offset + limit; APIs padronizadas (ex.: `?page=1&limit=20`).
- **Queries:** Índices já existentes; considerar cache (Redis) para indicadores executivos e relatórios pesados; reduzir N+1 onde houver.
- **Frontend:** Code-split por rota; prefetch de dados na navegação; skeleton em vez de spinner genérico.

## 2. Separação de responsabilidades (backend)
- Extrair rotas para blueprints (auth, admin, agent, api).
- Camada de serviços (AuthService, AssetService, ReportService) e repositórios (UserRepository, AssetRepository) para facilitar testes e reuso.
- Manter `app_production.py` como orquestrador fino; regras de negócio e SQL nos módulos.

## 3. Organização do frontend (pastas)
Estrutura sugerida para o SPA (quando passar a ser a UI principal):

```
src/
├── app/                 # Rotas, layout (sidebar + topbar)
├── components/
│   ├── ui/              # Button, Card, Modal, Skeleton, Input, ...
│   └── dashboard/       # KpiCard, ChartCard, TableCard, FilterBar
├── features/            # Por domínio (auth, dashboard, indicadores, chat, admin, cd)
│   ├── auth/
│   ├── dashboard/
│   ├── indicadores/
│   ├── chat/
│   ├── admin/
│   └── cd/
├── hooks/               # useAuth, useIndicadores, useChat, ...
├── services/            # httpClient, endpoints (já existem)
├── api/                 # endpoints.js
├── config/              # env.js
├── styles/              # index.css, tokens, theme
└── assets/
```

## 4. Padronização de estilos
- Design system em um único lugar: tokens (cores, espaçamento, radius, sombras) em CSS variables ou Tailwind theme; componentes UI consumindo esses tokens.
- Evitar estilos inline e classes ad hoc; usar variantes (e.g. `variant="primary"`) nos componentes.

---

# PARTE V — ENTREGA E INSTRUÇÕES PARA O LOVABLE (FASE 5)

## 1. Documentos gerados
- **Este arquivo:** Documentação técnica e estratégica completa (análise, arquitetura, fluxos, telas, proposta de remodelação, melhorias).
- **docs/FRONT_API.md:** Lista de endpoints (já existe).
- **docs/LOVABLE.md:** Estrutura do front e uso de httpClient/endpoints (já existe).
- **docs/RAILWAY_FRONT.md:** Deploy do front no Railway (já existe).

## 2. Mapa de telas redesenhado (resumo)
- **Público:** Login (e primeiro acesso).
- **App (autenticado):** Layout com Sidebar + Topbar.
  - **Início / Home:** Resumo (KPIs opcionais) + atalhos para Dashboards, Indicadores, Chat, Agenda.
  - **Dashboards:** Filtro opcional; grid de cards (PBI + internos); clique abre modal ou página de detalhe.
  - **Indicadores:** Filtros (período, base); Leitura Executiva; grid de KPI cards; tabelas se houver.
  - **Chat IA:** Lista de conversas (drawer ou coluna) + área de mensagens + input; upload de arquivo.
  - **Agenda CD:** Calendário ou lista + formulário de agendamento.
  - **Biblioteca:** Catálogo em cards; execução com feedback (toast + status).
  - **Perfil:** Abas ou steps (dados, senha, avatar).
- **Admin:** Submenu na sidebar; telas Admin Dashboard, Usuários, Assets, Dashboards, Metas, Ambientes, etc., com tabelas filtradas e formulários em modal/drawer quando fizer sentido.

## 3. Estrutura ideal de frontend (para Lovable)
- Manter **src/config/env.js**, **src/api/endpoints.js**, **src/services/httpClient.js** e usar em todas as chamadas ao backend.
- Adicionar **credentials: 'include'** nas chamadas fetch quando o front rodar em domínio diferente do backend (para enviar cookie de sessão).
- Criar **src/app/** com layout (Sidebar + Topbar) e rotas (React Router ou similar).
- Criar **src/components/ui/** com os componentes base (Button, Card, Input, Modal, Skeleton, Toast).
- Criar **src/components/dashboard/** com KpiCard, ChartCard, TableCard, FilterBar.
- Por feature: **src/features/dashboard**, **indicadores**, **chat**, **admin**, etc., cada um com components, hooks e páginas.

## 4. Lista clara de melhorias (checklist Lovable)
1. Implementar layout único: Sidebar fixa + Topbar (contexto + usuário + tema dark/light).
2. Separar Dashboards, Indicadores e Chat em rotas/páginas (ou manter abas mas com menos poluição visual).
3. Introduzir KPI Cards reutilizáveis na página de Indicadores e na Home.
4. Usar Chart Card e Table Card para gráficos e tabelas; lazy load de Chart.js.
5. Filtros globais (período, base) reutilizáveis e persistidos (query params ou estado).
6. Skeleton loading em listas e cards; Empty State quando não houver dados.
7. Toasts para sucesso/erro de ações (salvar, enviar mensagem, executar automação).
8. Modal para detalhe de dashboard (Power BI embed); Drawer opcional para filtros avançados.
9. Tabelas com busca, ordenação e paginação (Admin Users, Assets, Room Bookings).
10. Design system: documentar e usar apenas componentes e tokens definidos; dark/light toggle funcional.
11. Responsividade: testar em mobile; drawer de navegação já existe no header atual, manter comportamento.
12. Chamadas API: sempre via httpClient + endpoints; credentials: 'include' se cross-origin.

## 5. Instruções prontas para enviar ao Lovable
- **Contexto:** “O GeRot é uma plataforma Data Analytics SaaS (Flask + PostgreSQL no backend). O frontend atual é uma mistura de templates Jinja2 (Tailwind) e um SPA React mínimo na raiz. Queremos que o SPA React na raiz se torne a interface principal, moderna e alinhada a dashboards como Power BI, Stripe e Vercel Analytics.”
- **Referências de design:** Power BI, Tableau, Stripe Dashboard, Notion Analytics, Linear.app, Vercel Analytics (layout modular, sidebar fixa, topbar, cards de KPI, filtros, dark/light).
- **Regras técnicas:** Usar apenas `src/config/env.js`, `src/api/endpoints.js` e `src/services/httpClient.js` para chamadas ao backend; não hardcodar URLs. Incluir `credentials: 'include'` nas requisições fetch para manter sessão. Consultar `docs/FRONT_API.md` para endpoints.
- **Escopo da primeira entrega:** (1) Layout com Sidebar + Topbar e navegação para Home, Dashboards, Indicadores, Chat, Agenda CD, Biblioteca, Perfil; (2) Página Dashboards com grid de cards (dados virão das APIs ou, em fase inicial, mock); (3) Página Indicadores com filtros e KPI Cards (consumir `/api/indicadores-executivos`); (4) Página Chat com histórico e envio de mensagem (`/api/agent/chat/*`); (5) Componentes reutilizáveis: KpiCard, ChartCard, Button, Card, Input, Skeleton, Toast; (6) Dark/Light mode com toggle na topbar.
- **Documentação base:** Seguir este documento (`docs/DOCUMENTACAO_TECNICA_REFATORACAO.md`) e `docs/LOVABLE.md` para estrutura de pastas e integração com o backend.

---

*Fim do documento. Este arquivo serve como base oficial para a refatoração da interface e para instruções ao Lovable.*
