# Tabela `azportoex.mdfe_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `mdfe_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `50549`
- **Create time**: `2025-09-07T17:39:38`
- **Update time**: `2025-12-17T15:43:55`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_log`

## Chaves estrangeiras (evidência estrutural)
- `status` → `tipo_oco.id_oco` (constraint=`fk_mdfe_hist_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_log`]
- `fk_mdfe_hist_mdfe` type=`BTREE` non_unique=`True` cols=[`id_mdfe`]
- `fk_mdfe_hist_tipo_oco` type=`BTREE` non_unique=`True` cols=[`status`]
- `idx_mdfe_hist_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_log` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_mdfe` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `hora` | `time` | NO | `` | `` | `` | `` |
| 5 | `status` | `smallint` | NO | `` | `` | `MUL` | `` |
| 6 | `operador` | `int` | YES | `` | `` | `` | `` |
| 7 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`, `id_mdfe`
- **Datas/tempos prováveis**: `data`, `hora`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T15:43:55`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `mdfe`, `hist`
