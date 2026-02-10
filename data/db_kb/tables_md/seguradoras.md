# Tabela `azportoex.seguradoras`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `seguradoras`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3`
- **Create time**: `2025-09-07T17:41:05`
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
- `id_seguro`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_seguro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_seguro` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `seguradora` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `razao` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `apolice` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `apolice_valor` | `decimal(20,2)` | NO | `` | `` | `` | `` |
| 6 | `cnpj` | `char(14)` | NO | `` | `` | `` | `` |
| 7 | `contato` | `varchar(40)` | NO | `` | `` | `` | `` |
| 8 | `telefone` | `varchar(33)` | NO | `` | `` | `` | `` |
| 9 | `celular` | `varchar(15)` | NO | `` | `` | `` | `` |
| 10 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 11 | `vencimento` | `date` | NO | `` | `` | `` | `` |
| 12 | `status` | `int` | NO | `` | `` | `` | `` |
| 13 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 14 | `apolice_rcfdc` | `varchar(55)` | NO | `` | `` | `` | `` |
| 15 | `rcfdc_valor` | `decimal(20,2)` | NO | `0.00` | `` | `` | `` |
| 16 | `rctrc_valor` | `decimal(20,2)` | NO | `0.00` | `` | `` | `` |
| 17 | `apolice_rctrc` | `varchar(55)` | NO | `` | `` | `` | `` |
| 18 | `rcfdc_iof` | `decimal(10,3)` | YES | `0.000` | `` | `` | `` |
| 19 | `rctrc_iof` | `decimal(10,3)` | YES | `0.000` | `` | `` | `` |
| 20 | `cliente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 21 | `senha` | `varchar(45)` | YES | `` | `` | `` | `` |
| 22 | `usuario` | `varchar(45)` | YES | `` | `` | `` | `` |
| 23 | `codigo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 24 | `apolice_rctac` | `varchar(45)` | NO | `` | `` | `` | `` |
| 25 | `rctac_valor` | `decimal(20,2)` | NO | `0.00` | `` | `` | `` |
| 26 | `rctac_iof` | `decimal(10,3)` | NO | `0.000` | `` | `` | `` |
| 27 | `averba` | `int unsigned` | NO | `1` | `` | `` | `` |
| 28 | `seguro_cliente` | `int` | YES | `` | `` | `` | `` |
| 29 | `email_averbacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 30 | `averba_valor` | `tinyint` | YES | `0` | `` | `` | `` |
| 31 | `averba_automatico` | `tinyint` | YES | `0` | `` | `` | `` |
| 32 | `apolice_rodo` | `tinyint` | YES | `` | `` | `` | `` |
| 33 | `apolice_aereo` | `tinyint` | YES | `` | `` | `` | `` |
| 34 | `apolice_multimodal` | `tinyint` | YES | `` | `` | `` | `` |
| 35 | `tipo` | `smallint` | YES | `1` | `` | `` | `` |
| 36 | `apolice_rcotmc` | `varchar(45)` | YES | `` | `` | `` | `` |
| 37 | `alterado_por` | `int` | YES | `` | `` | `` | `` |
| 38 | `fornecedor` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_seguro`
- **Datas/tempos prováveis**: `vencimento`, `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `seguradoras`
