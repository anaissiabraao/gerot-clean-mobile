# Tabela `azportoex.ciot_parcelas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_parcelas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:37:08`
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
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_ciot` → `ciot.id` (constraint=`fk_ciot_parcelas_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_ciot_parcelas_ciot` type=`BTREE` non_unique=`True` cols=[`id_ciot`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lancamento` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_ciot` | `int` | YES | `` | `` | `MUL` | `` |
| 4 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 5 | `parcela_efetivacao_tipo` | `int` | YES | `` | `` | `` | `` |
| 6 | `parcela_valor` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 7 | `parcela_subtipo` | `int` | YES | `` | `` | `` | `` |
| 8 | `parcela_base` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `parcela_status` | `int` | YES | `` | `` | `` | `` |
| 10 | `parcela_data` | `date` | YES | `` | `` | `` | `` |
| 11 | `parcela_favorecido_tipo` | `int` | YES | `` | `` | `` | `` |
| 12 | `parcela_cliente_numero` | `int` | YES | `` | `` | `` | `` |
| 13 | `parcela_data_pagamento` | `timestamp` | YES | `` | `` | `` | `` |
| 14 | `parcela_descricao` | `varchar(245)` | YES | `` | `` | `` | `` |
| 15 | `id_manifesto` | `int` | YES | `` | `` | `` | `` |
| 16 | `parcela_subtipo_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 17 | `parcela_status_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 18 | `parcela_sincronizada` | `tinyint` | YES | `0` | `` | `` | `` |
| 19 | `situacao` | `tinyint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_lancamento`, `id_ciot`, `id_administradora`, `id_manifesto`
- **Datas/tempos prováveis**: `parcela_data`, `parcela_data_pagamento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `parcelas`
