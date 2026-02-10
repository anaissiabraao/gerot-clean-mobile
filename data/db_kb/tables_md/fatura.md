# Tabela `azportoex.fatura`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fatura`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `53728`
- **Create time**: `2025-09-09T20:37:51`
- **Update time**: `2025-12-17T16:41:15`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `financeiro`
- **Evidência**: `inferido_por_nome:/(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_fatura`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `coleta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fatura_cambio.fatura_id` → `fatura.id_fatura` (constraint=`fatura_cambio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fatura_historico.fatura` → `fatura.id_fatura` (constraint=`fk_fatura_historico_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.fatura` → `fatura.id_fatura` (constraint=`fk_manifesto_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.despacho_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.despacho_fatura_retira` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura_retira`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.entrega_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_entrega_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.seguro_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_seguro_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_fatura`]
- `idx_cliente` type=`BTREE` non_unique=`True` cols=[`cliente`]
- `idx_fatura_ciot` type=`BTREE` non_unique=`True` cols=[`ciot`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_fatura` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `emissao` | `date` | NO | `` | `` | `` | `` |
| 4 | `vencimento` | `date` | NO | `` | `` | `` | `` |
| 5 | `valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 6 | `forma` | `int` | NO | `` | `` | `` | `` |
| 7 | `conta` | `int` | NO | `` | `` | `` | `` |
| 8 | `emissor` | `varchar(55)` | NO | `` | `` | `` | `` |
| 9 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 10 | `status` | `int` | NO | `0` | `` | `` | `` |
| 11 | `dt_pagamento` | `date` | YES | `` | `` | `` | `` |
| 12 | `valor_pago` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `obs` | `text` | YES | `` | `` | `` | `` |
| 14 | `chave` | `varchar(255)` | NO | `000000` | `` | `` | `` |
| 15 | `numero` | `varchar(45)` | NO | `` | `` | `` | `` |
| 16 | `descricao` | `mediumtext` | YES | `` | `` | `` | `` |
| 17 | `desconto` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 18 | `serie` | `int` | YES | `0` | `` | `` | `` |
| 19 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 20 | `hora_incluido` | `varchar(8)` | NO | `` | `` | `` | `` |
| 21 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 22 | `cobranca` | `int unsigned` | NO | `0` | `` | `` | `` |
| 23 | `competencia` | `date` | NO | `` | `` | `` | `` |
| 24 | `acrescimo` | `float` | YES | `0` | `` | `` | `` |
| 25 | `nota_numero` | `varchar(20)` | YES | `` | `` | `` | `` |
| 26 | `nota_serie` | `int` | YES | `` | `` | `` | `` |
| 27 | `protocolo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 28 | `nota_status` | `int` | NO | `0` | `` | `` | `` |
| 29 | `valor_comissao` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 30 | `prefat` | `varchar(20)` | YES | `` | `` | `` | `` |
| 31 | `cnpj` | `varchar(15)` | YES | `` | `` | `` | `` |
| 32 | `boleto` | `varchar(60)` | YES | `` | `` | `` | `` |
| 33 | `terceiro` | `int` | YES | `` | `` | `` | `` |
| 34 | `importacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 35 | `tipo` | `tinyint` | YES | `0` | `` | `` | `` |
| 36 | `email_enviado` | `datetime` | YES | `` | `` | `` | `` |
| 37 | `colComprovante` | `tinyint` | YES | `` | `` | `` | `` |
| 38 | `ciot` | `int` | YES | `` | `` | `MUL` | `` |
| 39 | `data_abono` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_fatura`
- **Datas/tempos prováveis**: `emissao`, `vencimento`, `dt_pagamento`, `data_incluido`, `hora_incluido`, `competencia`, `email_enviado`, `data_abono`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:41:15`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `fatura`
