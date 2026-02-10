# Tabela `azportoex.oco_envio2`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `oco_envio2`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `174`
- **Create time**: `2025-09-07T17:40:26`
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
- `id_oco`

## Chaves estrangeiras (evidência estrutural)
- `cliente` → `fornecedores.id_local` (constraint=`fk_oco_envio_cliente`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_oco`]
- `fk_oco_envio_cliente` type=`BTREE` non_unique=`True` cols=[`cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_oco` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `ocorrencia` | `int` | NO | `` | `` | `` | `` |
| 4 | `forma` | `int` | NO | `` | `` | `` | `` |
| 5 | `email` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `descricao_cliente` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `codigo_cliente` | `varchar(10)` | YES | `` | `` | `` | `` |
| 8 | `tipo_cadastro` | `tinyint` | YES | `1` | `` | `` | `` |
| 9 | `envia_edi` | `tinyint` | YES | `1` | `` | `` | `` |
| 10 | `envia_email` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `envia_email_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 12 | `envia_email_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `envia_email_awb` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `envia_edi_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 15 | `envia_edi_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 16 | `envia_edi_awb` | `tinyint` | YES | `1` | `` | `` | `` |
| 17 | `descricao_cliente_coleta` | `varchar(60)` | YES | `` | `` | `` | `` |
| 18 | `codigo_cliente_coleta` | `varchar(10)` | YES | `` | `` | `` | `` |
| 19 | `descricao_cliente_manifesto` | `varchar(60)` | YES | `` | `` | `` | `` |
| 20 | `codigo_cliente_manifesto` | `varchar(10)` | YES | `` | `` | `` | `` |
| 21 | `descricao_cliente_awb` | `varchar(60)` | YES | `` | `` | `` | `` |
| 22 | `codigo_cliente_awb` | `varchar(10)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_oco`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `oco`, `envio2`
