# Tabela `azportoex.custo_diverso_coleta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `custo_diverso_coleta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `14`
- **Create time**: `2025-09-07T17:37:34`
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
- `coleta` → `coleta.id_coleta` (constraint=`custo_diverso_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `id_fornecedor` → `fornecedores.id_local` (constraint=`custo_diverso_coleta_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `forma_pagamento` → `forma_pagamento.id_forma_pagamento` (constraint=`custo_diverso_coleta_ibfk_3`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `coleta` type=`BTREE` non_unique=`True` cols=[`coleta`]
- `forma_pagamento` type=`BTREE` non_unique=`True` cols=[`forma_pagamento`]
- `id_fornecedor` type=`BTREE` non_unique=`True` cols=[`id_fornecedor`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `coleta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 4 | `id_fornecedor` | `int` | NO | `` | `` | `MUL` | `` |
| 5 | `descricao` | `varchar(55)` | YES | `` | `` | `` | `` |
| 6 | `forma_pagamento` | `int` | NO | `` | `` | `MUL` | `` |
| 7 | `doc` | `int` | YES | `` | `` | `` | `` |
| 8 | `faturado` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `valor_custo` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 10 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 11 | `lancamento` | `int` | YES | `` | `` | `` | `` |
| 12 | `status` | `int` | NO | `0` | `` | `` | `` |
| 13 | `operador` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fornecedor`
- **Datas/tempos prováveis**: `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `custo`, `diverso`, `coleta`
