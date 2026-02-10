# Tabela `azportoex.boletos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `boletos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:02`
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
- `id_boleto`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_boleto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_boleto` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lancamento` | `int` | NO | `` | `` | `` | `` |
| 3 | `conta` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `unidade_emissor` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `data_emissao` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 6 | `data_confirmado` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 7 | `data_vencimento` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 8 | `data_pago` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 9 | `nosso_numero` | `varchar(20)` | YES | `` | `` | `` | `` |
| 10 | `pre_impresso` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `desconto_antecipacao` | `float` | YES | `0` | `` | `` | `` |
| 12 | `dias_protesto` | `tinyint` | YES | `7` | `` | `` | `` |
| 13 | `percentual_multa` | `float` | YES | `0` | `` | `` | `` |
| 14 | `percentual_juros` | `float` | YES | `0` | `` | `` | `` |
| 15 | `desconto` | `float` | YES | `0` | `` | `` | `` |
| 16 | `abatimento` | `float` | YES | `0` | `` | `` | `` |
| 17 | `valor` | `float` | YES | `0` | `` | `` | `` |
| 18 | `especie` | `varchar(5)` | NO | `` | `` | `` | `` |
| 19 | `aceite` | `tinyint` | YES | `0` | `` | `` | `` |
| 20 | `numero` | `int` | NO | `0` | `` | `` | `` |
| 21 | `cnpj_pagador` | `varchar(14)` | YES | `` | `` | `` | `` |
| 22 | `nome_pagador` | `varchar(40)` | YES | `` | `` | `` | `` |
| 23 | `endereco_pagador` | `varchar(40)` | YES | `` | `` | `` | `` |
| 24 | `cep_pagador` | `varchar(8)` | YES | `` | `` | `` | `` |
| 25 | `cidade_pagador` | `varchar(40)` | YES | `` | `` | `` | `` |
| 26 | `uf_pagador` | `varchar(2)` | YES | `` | `` | `` | `` |
| 27 | `id_pagador` | `int` | YES | `0` | `` | `` | `` |
| 28 | `codigo_pagador` | `varchar(10)` | YES | `` | `` | `` | `` |
| 29 | `cnpj_avalista` | `varchar(14)` | YES | `` | `` | `` | `` |
| 30 | `nome_avalista` | `varchar(14)` | YES | `` | `` | `` | `` |
| 31 | `instrucao` | `tinyint` | YES | `0` | `` | `` | `` |
| 32 | `registro` | `tinyint` | YES | `0` | `` | `` | `` |
| 33 | `bairro_pagador` | `varchar(20)` | YES | `` | `` | `` | `` |
| 34 | `endereco_avalista` | `varchar(40)` | YES | `` | `` | `` | `` |
| 35 | `cep_avalista` | `varchar(8)` | YES | `` | `` | `` | `` |
| 36 | `cidade_avalista` | `varchar(40)` | YES | `` | `` | `` | `` |
| 37 | `uf_avalista` | `varchar(2)` | YES | `` | `` | `` | `` |
| 38 | `bairro_avalista` | `varchar(20)` | YES | `` | `` | `` | `` |
| 39 | `date_confirmado` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 40 | `date_vencimento` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 41 | `date_pago` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 42 | `avalista_cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 43 | `avalista_nome` | `varchar(40)` | YES | `` | `` | `` | `` |
| 44 | `data_vecto` | `date` | YES | `` | `` | `` | `` |
| 45 | `descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 46 | `cliente` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_boleto`, `id_lancamento`, `id_pagador`
- **Datas/tempos prováveis**: `data_emissao`, `data_confirmado`, `data_vencimento`, `data_pago`, `date_confirmado`, `date_vencimento`, `date_pago`, `data_vecto`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `boletos`
