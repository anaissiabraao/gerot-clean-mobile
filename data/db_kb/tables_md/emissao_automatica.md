# Tabela `azportoex.emissao_automatica`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `emissao_automatica`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:37:39`
- **Update time**: `2025-12-17T16:45:21`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_unidade` → `unidades.id_unidade` (constraint=`emissao_automatica_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `emissao_automatica_fk` type=`BTREE` non_unique=`True` cols=[`id_unidade`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_unidade` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `id_nsu_nfe` | `bigint` | YES | `0` | `` | `` | `` |
| 4 | `id_importa_nfe` | `bigint` | YES | `0` | `` | `` | `` |
| 5 | `id_nsu_cte` | `bigint` | YES | `0` | `` | `` | `` |
| 6 | `id_importa_cte` | `bigint` | YES | `0` | `` | `` | `` |
| 7 | `id_nsu_awb` | `bigint` | YES | `0` | `` | `` | `` |
| 8 | `id_importa_awb` | `bigint` | YES | `0` | `` | `` | `` |
| 9 | `nsu_nfe` | `bigint` | YES | `0` | `` | `` | `` |
| 10 | `nsu_cte` | `bigint` | YES | `0` | `` | `` | `` |
| 11 | `nsu_awb` | `bigint` | YES | `0` | `` | `` | `` |
| 12 | `atualizacao_nfe` | `datetime` | YES | `` | `` | `` | `` |
| 13 | `atualizacao_cte` | `datetime` | YES | `` | `` | `` | `` |
| 14 | `atualizacao_awb` | `datetime` | YES | `` | `` | `` | `` |
| 15 | `nsu_awb_tomador` | `bigint` | YES | `0` | `` | `` | `` |
| 16 | `nsu_cancela_awb_tomador` | `bigint` | YES | `` | `` | `` | `` |
| 17 | `awb_cancelamento_id` | `int unsigned` | YES | `0` | `` | `` | `` |
| 18 | `dfe_autorizacao_id` | `bigint` | YES | `0` | `` | `` | `` |
| 19 | `nsu_nfe_tomador` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_unidade`, `id_nsu_nfe`, `id_importa_nfe`, `id_nsu_cte`, `id_importa_cte`, `id_nsu_awb`, `id_importa_awb`, `awb_cancelamento_id`, `dfe_autorizacao_id`
- **Datas/tempos prováveis**: `atualizacao_nfe`, `atualizacao_cte`, `atualizacao_awb`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:45:21`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `emissao`, `automatica`
