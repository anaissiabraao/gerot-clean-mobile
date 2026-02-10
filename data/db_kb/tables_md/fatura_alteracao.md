# Tabela `azportoex.fatura_alteracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fatura_alteracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:52`
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
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_fatura` | `int` | NO | `` | `` | `` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `` | `` |
| 3 | `emissao` | `date` | NO | `` | `` | `` | `` |
| 4 | `vencimento` | `date` | NO | `` | `` | `` | `` |
| 5 | `valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 6 | `forma` | `int` | NO | `` | `` | `` | `` |
| 7 | `conta` | `int` | NO | `` | `` | `` | `` |
| 8 | `emissor` | `varchar(55)` | NO | `` | `` | `` | `` |
| 9 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 10 | `status` | `int` | NO | `0` | `` | `` | `` |
| 11 | `dt_pagamento` | `date` | NO | `` | `` | `` | `` |
| 12 | `valor_pago` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 13 | `obs` | `varchar(60)` | NO | `` | `` | `` | `` |
| 14 | `chave` | `varchar(255)` | NO | `000000` | `` | `` | `` |
| 15 | `numero` | `varchar(45)` | NO | `` | `` | `` | `` |
| 16 | `descricao` | `mediumtext` | NO | `` | `` | `` | `` |
| 17 | `desconto` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 18 | `serie` | `int unsigned` | NO | `0` | `` | `` | `` |
| 19 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 20 | `hora_incluido` | `varchar(8)` | NO | `` | `` | `` | `` |
| 21 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 22 | `cobranca` | `int unsigned` | NO | `0` | `` | `` | `` |
| 23 | `competencia` | `date` | NO | `` | `` | `` | `` |
| 24 | `acrescimo` | `float` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_fatura`
- **Datas/tempos prováveis**: `emissao`, `vencimento`, `dt_pagamento`, `data_incluido`, `hora_incluido`, `competencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `fatura`, `alteracao`
