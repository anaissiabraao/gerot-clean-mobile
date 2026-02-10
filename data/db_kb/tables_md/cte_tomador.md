# Tabela `azportoex.cte_tomador`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cte_tomador`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:34`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

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
| 2 | `chave` | `varchar(44)` | NO | `` | `` | `` | `` |
| 3 | `data_emissao` | `timestamp` | NO | `` | `` | `` | `` |
| 4 | `data_autorizacao` | `timestamp` | NO | `` | `` | `` | `` |
| 5 | `id_emitente` | `int` | NO | `` | `` | `` | `` |
| 6 | `id_remetente` | `int` | NO | `` | `` | `` | `` |
| 7 | `id_destinatario` | `int` | NO | `` | `` | `` | `` |
| 8 | `id_tomador` | `int` | NO | `` | `` | `` | `` |
| 9 | `numero` | `int` | NO | `` | `` | `` | `` |
| 10 | `serie` | `smallint` | NO | `` | `` | `` | `` |
| 11 | `cfop` | `smallint` | NO | `` | `` | `` | `` |
| 12 | `tpserv` | `tinyint` | NO | `` | `` | `` | `` |
| 13 | `valor_cte` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 14 | `aliquota` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 15 | `imposto` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 16 | `status_cte` | `tinyint` | YES | `1` | `` | `` | `` |
| 17 | `tpcte` | `tinyint` | NO | `` | `` | `` | `` |
| 18 | `base_icms` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 19 | `uf_destino` | `varchar(2)` | YES | `` | `` | `` | `` |
| 20 | `uf_origem` | `varchar(2)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_emitente`, `id_remetente`, `id_destinatario`, `id_tomador`
- **Datas/tempos prováveis**: `data_emissao`, `data_autorizacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `cte`, `tomador`
