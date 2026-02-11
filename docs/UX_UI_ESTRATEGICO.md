# Documento UX/UI Estratégico — GeRot Data Analytics SaaS

**Objetivo:** Guiar a remodelação visual e de experiência para uma plataforma moderna, premium e orientada a dados.

---

## 1. Direção de Design (referências)

- **Power BI / Tableau:** Foco em dados; grid de widgets; filtros em destaque; hierarquia clara (título → KPIs → gráficos → tabelas).
- **Stripe Dashboard:** Sidebar escura; topbar limpa; cards com borda sutil; tipografia forte; poucas cores, alto contraste.
- **Notion / Linear:** Espaço em branco; ícones consistentes; microinterações; feedback imediato.
- **Vercel Analytics:** Gráficos limpos; números grandes; dark mode nativo; sensação de “produto técnico premium”.

---

## 2. Princípios de UX

- **Menos é mais:** Uma ação principal por tela; secundárias em overflow ou drawer.
- **Contexto sempre visível:** Sidebar + breadcrumb ou título de página; usuário e tema na topbar.
- **Feedback imediato:** Skeleton ao carregar; toast em sucesso/erro; botões com estado loading.
- **Consistência:** Mesmos padrões de card, botão, input e tabela em todo o app.
- **Acessibilidade:** Contraste adequado; labels em formulários; aria onde necessário; foco visível em teclado.

---

## 3. Sistema Visual Proposto

### 3.1 Cores (já existentes em `input.css` — manter e documentar)
- **Primary:** Laranja (brand PORTOEX).
- **Secondary / Accent:** Azul navy.
- **Background / Card:** Neutros claros (light) ou escuros (dark).
- **Semânticas:** Success (verde), Destructive (vermelho), Warning (amarelo), Muted para texto secundário.

### 3.2 Tipografia
- **Fonte:** DM Sans (já em uso). Títulos: peso 600–700; corpo: 400; labels: 500.
- **Escala:** Título de página (2xl–3xl); título de seção (lg–xl); card title (base–lg); corpo (sm–base); caption (xs).

### 3.3 Espaçamento
- **Seções:** `space-section` (ex.: 2rem).
- **Cards:** padding interno consistente (ex.: 1.5rem).
- **Grid:** gap 1rem–1.5rem entre cards.

### 3.4 Componentes visuais
- **Cards:** Borda sutil, radius 0.75rem, sombra soft; hover com sombra um pouco maior.
- **Botões:** Primário (preenchido), secundário (outline), ghost (transparente); tamanhos sm/base/lg.
- **Inputs:** Borda, radius; estado focus com ring primary; erro com borda destructive.
- **Badges:** Pequenos, para status e categorias; cores semânticas ou muted.

---

## 4. Jornada do Usuário (resumida)

1. **Login** → Tela única, clara; erro inline; link “primeiro acesso” se aplicável.
2. **Primeiro acesso** → Definir senha (e opcionalmente email); mensagem de boas-vindas.
3. **Home** → Resumo opcional (KPIs) + atalhos para Dashboards, Indicadores, Chat, Agenda.
4. **Dashboards** → Lista/grid de cards; clique abre modal ou página com embed; filtro por categoria se houver muitas.
5. **Indicadores** → Filtros no topo (período, base); Leitura Executiva em destaque; depois KPIs em grid; tabelas abaixo se necessário.
6. **Chat** → Lista de conversas (sidebar ou drawer) + área de mensagens + input; upload de arquivo; indicador de “digitando” ou “processando”.
7. **Agenda CD** → Lista ou calendário + formulário de agendamento; conflitos em destaque.
8. **Biblioteca** → Catálogo em cards; execução com status (pending/success/error) e toast.
9. **Perfil** → Abas ou steps: dados pessoais, avatar, senha.
10. **Admin** → Submenu na sidebar; cada tela com tabela filtrada e ações em modal/drawer.

---

## 5. Redução de Poluição Visual

- Remover ou recolher barra de status/ticker do dashboard atual; substituir por um único indicador de “última atualização” se necessário.
- Evitar 3 abas densas na mesma página; preferir rotas separadas (Dashboards, Indicadores, Chat) com navegação lateral.
- Não repetir o mesmo dado em vários formatos; escolher o mais adequado (número, gráfico ou tabela).
- Ações rápidas (Agendar sala, Perfil, Suporte) em um único bloco compacto ou no menu do usuário na topbar.

---

## 6. Microinterações e Feedback

- **Hover em cards:** Leve elevação (sombra) e cursor pointer.
- **Botões:** Estado loading (spinner ou disabled) durante submit.
- **Toasts:** Aparição suave (slide-in); auto-dismiss em 3–5s; botão de fechar.
- **Skeleton:** Mesma estrutura do conteúdo final (card, lista); animação shimmer.
- **Empty state:** Ícone + título + descrição + CTA quando não houver dados.

---

## 7. Responsividade Mobile

- Sidebar vira drawer (hamburger); conteúdo em largura total.
- Tabelas: scroll horizontal ou layout em cards em telas pequenas.
- Filtros: em linha no desktop; em drawer ou colapsável no mobile.
- KPIs: 2 colunas no mobile; 4–6 no desktop.
- Inputs e botões: altura mínima 44px para toque.

---

## 8. Dark/Light Mode

- Toggle na topbar (ícone sol/lua); persistir preferência em localStorage.
- Aplicar classe `.dark` no root; variáveis já definidas em `input.css` para dark.
- Evitar imagens ou cores hardcoded que quebrem no dark; usar variáveis CSS.

---

*Este documento complementa a DOCUMENTACAO_TECNICA_REFATORACAO.md e deve ser usado em conjunto para a refatoração no Lovable.*
