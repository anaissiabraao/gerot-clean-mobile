# Tabela `azportoex.volume_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `volume_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:38`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_volume` → `volumes.id_volume` (constraint=`fk_volume_historico_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_volume_historico_volume` type=`BTREE` non_unique=`True` cols=[`id_volume`]
- `idx_data` type=`BTREE` non_unique=`True` cols=[`created_at`]
- `idx_edi` type=`BTREE` non_unique=`True` cols=[`edi`]
- `idx_status` type=`BTREE` non_unique=`True` cols=[`status`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_volume` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `status` | `smallint` | YES | `` | `` | `MUL` | `` |
| 4 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 5 | `data` | `date` | YES | `` | `` | `` | `` |
| 6 | `hora` | `time` | YES | `` | `` | `` | `` |
| 7 | `unidade` | `smallint` | YES | `` | `` | `` | `` |
| 8 | `operador` | `int` | YES | `` | `` | `` | `` |
| 9 | `created_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 10 | `edi` | `tinyint` | YES | `0` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_volume`
- **Datas/tempos prováveis**: `data`, `hora`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `volume`, `historico`
