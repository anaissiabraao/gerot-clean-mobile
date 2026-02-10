# Tabela `azportoex.coleta_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `coleta_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `314299`
- **Create time**: `2025-09-07T17:37:14`
- **Update time**: `2025-12-17T16:50:27`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_log`

## Chaves estrangeiras (evidência estrutural)
- `coleta` → `coleta.id_coleta` (constraint=`fk_coleta_historico_coleta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `status` → `tipo_oco.id_oco` (constraint=`fk_coleta_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_log`]
- `fk_coleta_historico_coleta` type=`BTREE` non_unique=`True` cols=[`coleta`]
- `fk_coleta_historico_tipo_oco` type=`BTREE` non_unique=`True` cols=[`status`]
- `idx_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_log` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `data` | `date` | NO | `` | `` | `` | `` |
| 3 | `hora` | `time` | NO | `` | `` | `` | `` |
| 4 | `status` | `smallint` | NO | `` | `` | `MUL` | `` |
| 5 | `operador` | `int` | YES | `` | `` | `` | `` |
| 6 | `obs` | `varchar(255)` | NO | `` | `` | `` | `` |
| 7 | `edi` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 9 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 10 | `ocorrencia` | `smallint` | YES | `` | `` | `` | `` |
| 11 | `coleta` | `int` | NO | `` | `` | `MUL` | `` |
| 12 | `unidade` | `varchar(5)` | NO | `` | `` | `` | `` |
| 13 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 14 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:27`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `coleta`, `historico`
