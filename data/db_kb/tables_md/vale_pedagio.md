# Tabela `azportoex.vale_pedagio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `vale_pedagio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `360`
- **Create time**: `2025-10-20T13:06:20`
- **Update time**: `2025-12-17T16:48:10`
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
| 2 | `id_manifesto` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_fornecedor` | `int` | NO | `` | `` | `` | `` |
| 4 | `id_pagador` | `int` | NO | `` | `` | `` | `` |
| 5 | `numero_compra` | `varchar(200)` | NO | `` | `` | `` | `` |
| 6 | `valor` | `decimal(13,2)` | NO | `` | `` | `` | `` |
| 7 | `tipo` | `tinyint` | NO | `0` | `` | `` | `` |
| 8 | `solucao` | `int` | YES | `0` | `` | `` | `` |
| 9 | `status` | `int` | YES | `` | `` | `` | `` |
| 10 | `id_lancamento` | `int` | YES | `0` | `` | `` | `` |
| 11 | `data_emissao` | `date` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_manifesto`, `id_fornecedor`, `id_pagador`, `id_lancamento`
- **Datas/tempos prováveis**: `data_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:48:10`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `vale`, `pedagio`
