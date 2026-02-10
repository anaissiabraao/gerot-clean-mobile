# DB → Knowledge Base (RAG) — pipeline incremental

Objetivo: extrair **estrutura** do banco (700+ tabelas) com profundidade e gerar conhecimento **reutilizável** para RAG.

## Pré-requisitos

- Acesso ao MySQL (rede/ZeroTier/etc.)
- Variáveis de ambiente:
  - `MYSQL_AZ_HOST` (default `10.147.17.88`)
  - `MYSQL_AZ_PORT` (default `3306`)
  - `MYSQL_AZ_USER`
  - `MYSQL_AZ_PASSWORD`
  - `MYSQL_AZ_DB` (default `azportoex`)

## FASE 1 — Mapeamento Global

1) Extrair schema estrutural (somente `information_schema`):

```powershell
python scripts/db_kb/mysql_introspect.py --out data/db_kb/azportoex_schema.json
```

2) Gerar visão geral + domínios + tabelas centrais:

```powershell
python scripts/db_kb/build_phase1_overview.py `
  --schema data/db_kb/azportoex_schema.json `
  --out-md data/db_kb/phase1_visao_geral.md `
  --out-items data/db_kb/phase1_knowledge_items.json
```

Saídas:
- `data/db_kb/phase1_visao_geral.md`
- `data/db_kb/phase1_knowledge_items.json` (pronto para ingestão no RAG)

## Notas importantes (qualidade)

- A classificação por domínio na FASE 1 é **inferida por nome** e vem marcada como inferência.
- Relacionamentos por FK são **apenas os explícitos** (constraints). Se o banco não tiver FKs declaradas, a centralidade ficará limitada; isso será complementado por inferências controladas na FASE 2/3.


