# Tabela `azportoex.cte_series200`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cte_series200`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3`
- **Create time**: `2025-09-07T17:37:33`
- **Update time**: `2025-12-17T14:49:36`
- **Comment**: `Tabela para gerenciamento de séries de CTe.`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `cte_serie_servico.cte_serie` → `cte_series200.id` (constraint=`fk_cte_serie_servico_cs`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `smallint unsigned` | NO | `` | `` | `` | `` |
| 3 | `numero` | `int unsigned` | NO | `` | `` | `` | `` |
| 4 | `serie` | `smallint unsigned` | NO | `` | `` | `` | `` |
| 5 | `ambiente` | `tinyint unsigned` | NO | `` | `` | `` | `` |
| 6 | `modal` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `origem` | `tinyint` | YES | `1` | `` | `` | `` |
| 8 | `created_at` | `datetime` | NO | `` | `` | `` | `` |
| 9 | `updated_at` | `datetime` | YES | `0000-00-00 00:00:00` | `` | `` | `` |
| 10 | `deleted_at` | `datetime` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `created_at`, `updated_at`, `deleted_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:49:36`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `cte`, `series200`
