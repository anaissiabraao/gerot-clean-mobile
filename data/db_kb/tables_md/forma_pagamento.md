# Tabela `azportoex.forma_pagamento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `forma_pagamento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `9`
- **Create time**: `2025-09-07T17:37:57`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `financeiro`
- **Evidência**: `inferido_por_nome:/(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_forma_pagamento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `custo_diverso_coleta.forma_pagamento` → `forma_pagamento.id_forma_pagamento` (constraint=`custo_diverso_coleta_ibfk_3`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_forma_pagamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_forma_pagamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `status` | `int` | NO | `1` | `` | `` | `` |
| 5 | `minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 6 | `altera` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `sistema` | `int unsigned` | NO | `` | `` | `` | `` |
| 8 | `cheque` | `smallint` | YES | `0` | `` | `` | `` |
| 9 | `sigla` | `varchar(3)` | YES | `` | `` | `` | `` |
| 10 | `tipo_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `id_operacao` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_forma_pagamento`, `id_operacao`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `forma`, `pagamento`
