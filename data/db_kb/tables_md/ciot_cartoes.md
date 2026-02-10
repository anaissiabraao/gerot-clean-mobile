# Tabela `azportoex.ciot_cartoes`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_cartoes`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `7`
- **Create time**: `2025-09-07T17:37:07`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_terceiro` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_motorista` | `int` | YES | `` | `` | `` | `` |
| 5 | `tipo_cadastro` | `int` | YES | `` | `` | `` | `` |
| 6 | `numero_cartao` | `varchar(255)` | YES | `0` | `` | `` | `` |
| 7 | `data_validade` | `date` | YES | `` | `` | `` | `` |
| 8 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 9 | `subtrair_tarifa` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 10 | `forma_pagamento` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `id_conta_terceiro` | `int` | YES | `` | `` | `` | `` |
| 12 | `tag_pedagio` | `varchar(255)` | YES | `` | `` | `` | `` |
| 13 | `sincronizado` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 14 | `metodo_pagamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_administradora`, `id_terceiro`, `id_motorista`, `id_conta_terceiro`
- **Datas/tempos prováveis**: `data_validade`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `cartoes`
