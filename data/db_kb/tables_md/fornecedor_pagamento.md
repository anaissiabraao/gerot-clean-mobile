# Tabela `azportoex.fornecedor_pagamento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fornecedor_pagamento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `13200`
- **Create time**: `2025-09-07T17:37:58`
- **Update time**: `2025-12-17T14:37:36`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_pagamento_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fornecedor` type=`BTREE` non_unique=`True` cols=[`fornecedor`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `seg` | `tinyint` | YES | `1` | `` | `` | `` |
| 3 | `ter` | `tinyint` | YES | `1` | `` | `` | `` |
| 4 | `qua` | `tinyint` | YES | `1` | `` | `` | `` |
| 5 | `qui` | `tinyint` | YES | `1` | `` | `` | `` |
| 6 | `sex` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `sab` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `dom` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `fornecedor` | `int` | NO | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:37:36`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `fornecedor`, `pagamento`
