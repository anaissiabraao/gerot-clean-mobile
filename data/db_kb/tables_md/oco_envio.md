# Tabela `azportoex.oco_envio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `oco_envio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `47879`
- **Create time**: `2025-09-07T17:40:25`
- **Update time**: `2025-12-16T19:19:13`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_oco`

## Chaves estrangeiras (evidência estrutural)
- `cliente` → `fornecedores.id_local` (constraint=`fk_cliente_oco_envio_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ocorrencia` → `tipo_oco.id_oco` (constraint=`fk_ocorrencia_oco_envio_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_oco`]
- `fk_cliente_oco_envio_fornecedores` type=`BTREE` non_unique=`True` cols=[`cliente`]
- `fk_ocorrencia_oco_envio_tipo_oco` type=`BTREE` non_unique=`True` cols=[`ocorrencia`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_oco` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `ocorrencia` | `smallint` | NO | `` | `` | `MUL` | `` |
| 4 | `forma` | `tinyint` | YES | `0` | `` | `` | `` |
| 5 | `email` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `tipo_cadastro` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `descricao_cliente` | `varchar(60)` | YES | `` | `` | `` | `` |
| 8 | `descricao_cliente_nf` | `varchar(60)` | YES | `` | `` | `` | `` |
| 9 | `descricao_cliente_coleta` | `varchar(60)` | YES | `` | `` | `` | `` |
| 10 | `descricao_cliente_manifesto` | `varchar(60)` | YES | `` | `` | `` | `` |
| 11 | `descricao_cliente_awb` | `varchar(60)` | YES | `` | `` | `` | `` |
| 12 | `codigo_cliente` | `varchar(15)` | YES | `` | `` | `` | `` |
| 13 | `codigo_cliente_nf` | `varchar(10)` | YES | `` | `` | `` | `` |
| 14 | `codigo_cliente_coleta` | `varchar(15)` | YES | `` | `` | `` | `` |
| 15 | `codigo_cliente_manifesto` | `varchar(15)` | YES | `` | `` | `` | `` |
| 16 | `codigo_cliente_awb` | `varchar(15)` | YES | `` | `` | `` | `` |
| 17 | `visualiza_site` | `tinyint` | YES | `15` | `` | `` | `` |
| 18 | `envia_edi` | `tinyint` | YES | `1` | `` | `` | `` |
| 19 | `envia_edi_nf` | `tinyint` | YES | `1` | `` | `` | `` |
| 20 | `envia_edi_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 21 | `envia_edi_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 22 | `envia_edi_awb` | `tinyint` | YES | `1` | `` | `` | `` |
| 23 | `envia_email` | `tinyint` | YES | `1` | `` | `` | `` |
| 24 | `envia_email_nf` | `tinyint` | YES | `1` | `` | `` | `` |
| 25 | `envia_email_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 26 | `envia_email_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 27 | `envia_email_awb` | `tinyint` | YES | `1` | `` | `` | `` |
| 28 | `envia_sms_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 29 | `envia_whats_minuta` | `tinyint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_oco`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T19:19:13`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `oco`, `envio`
