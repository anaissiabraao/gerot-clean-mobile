# Tabela `azportoex.agendamento_coleta_dias`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `agendamento_coleta_dias`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:36:01`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_agendamento`

## Chaves estrangeiras (evidência estrutural)
- `id_cliente` → `fornecedores.id_local` (constraint=`agendamento_coleta_dias_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_agendamento`]
- `fk_agendamento_coleta_dias_cliente` type=`BTREE` non_unique=`True` cols=[`id_cliente`]
- `idx_agendamento_coleta_dias` type=`BTREE` non_unique=`True` cols=[`dia_semana`, `tipo_dia_coleta`, `tipo_frequencia`, `coleta_dia_util`, `select_dia_fixo`, `semana_alternada`, `tipo_atendimento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_agendamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 4 | `dia_semana` | `int` | YES | `` | `` | `MUL` | `` |
| 5 | `tipo_dia_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 6 | `tipo_frequencia` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `coleta_dia_util` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `select_dia_fixo` | `tinyint` | YES | `` | `` | `` | `` |
| 9 | `semana_alternada` | `tinyint` | YES | `` | `` | `` | `` |
| 10 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 11 | `tipo_atendimento` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `rota` | `int` | YES | `` | `` | `` | `` |
| 13 | `rota_sequencia` | `smallint` | YES | `` | `` | `` | `` |
| 14 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 15 | `id_rateio` | `int` | YES | `` | `` | `` | `` |
| 16 | `operador` | `int` | YES | `` | `` | `` | `` |
| 17 | `semana_ano` | `varchar(15)` | YES | `` | `` | `` | `` |
| 18 | `emissao_automatica` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_agendamento`, `id_cliente`, `id_rateio`
- **Datas/tempos prováveis**: `updated_at`, `emissao_automatica`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `agendamento`, `coleta`, `dias`
