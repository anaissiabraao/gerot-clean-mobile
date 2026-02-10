# Tabela `azportoex.historico_forma_pagamento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `historico_forma_pagamento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:13`
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
- `id_historico`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_historico`]
- `id_historico` type=`BTREE` non_unique=`False` cols=[`id_historico`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_historico` | `bigint unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 3 | `descricao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 4 | `data` | `date` | YES | `` | `` | `` | `` |
| 5 | `status` | `int` | YES | `` | `` | `` | `` |
| 6 | `minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `altera` | `tinyint` | YES | `` | `` | `` | `` |
| 8 | `sistema` | `int unsigned` | YES | `` | `` | `` | `` |
| 9 | `cheque` | `smallint` | YES | `` | `` | `` | `` |
| 10 | `sigla` | `varchar(3)` | YES | `` | `` | `` | `` |
| 11 | `tipo_pagamento` | `tinyint` | YES | `` | `` | `` | `` |
| 12 | `id_operacao` | `int` | YES | `` | `` | `` | `` |
| 13 | `usuario` | `varchar(255)` | YES | `` | `` | `` | `` |
| 14 | `data_alteracao` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 15 | `alteracoes` | `text` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_historico`, `id_forma_pagamento`, `id_operacao`
- **Datas/tempos prováveis**: `data`, `data_alteracao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `historico`, `forma`, `pagamento`
