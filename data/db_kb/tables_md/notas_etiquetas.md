# Tabela `azportoex.notas_etiquetas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notas_etiquetas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `14220`
- **Create time**: `2025-09-07T17:40:16`
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
- `idx_notas_etiquetas_data` type=`BTREE` non_unique=`True` cols=[`data`]
- `idx_notas_etiquetas_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nf` | `int` | YES | `` | `` | `` | `` |
| 3 | `serie` | `smallint` | YES | `` | `` | `` | `` |
| 4 | `minuta` | `int` | YES | `0` | `` | `MUL` | `` |
| 5 | `cliente` | `int` | NO | `` | `` | `` | `` |
| 6 | `barra` | `varchar(40)` | YES | `` | `` | `` | `` |
| 7 | `coleta` | `int` | YES | `` | `` | `` | `` |
| 8 | `data` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 9 | `cte` | `int` | YES | `0` | `` | `` | `` |
| 10 | `usuario` | `smallint` | YES | `` | `` | `` | `` |
| 11 | `pedido` | `varchar(10)` | YES | `` | `` | `` | `` |
| 12 | `parcial` | `smallint` | YES | `` | `` | `` | `` |
| 13 | `total` | `smallint` | YES | `` | `` | `` | `` |
| 14 | `doc_destinatario` | `varchar(20)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `notas`, `etiquetas`
