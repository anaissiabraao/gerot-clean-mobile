# Tabela `azportoex.pre_nota_notfis`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_nota_notfis`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:33`
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
- `id_pre_minuta` → `pre_minuta_notfis.id` (constraint=`fk_pre_nota_notfis`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `pre_volume_notfis.id_pre_nota` → `pre_nota_notfis.id` (constraint=`fk_pre_volume_notfis`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_pre_nota_notfis` type=`BTREE` non_unique=`True` cols=[`id_pre_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_pre_minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `chave` | `varchar(44)` | YES | `` | `` | `` | `` |
| 4 | `numero` | `varchar(9)` | YES | `` | `` | `` | `` |
| 5 | `volumes` | `smallint` | YES | `0` | `` | `` | `` |
| 6 | `peso` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `cubado` | `decimal(10,3)` | YES | `0.000` | `` | `` | `` |
| 8 | `data_emissao` | `date` | YES | `` | `` | `` | `` |
| 9 | `dados` | `text` | YES | `` | `` | `` | `` |
| 10 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `id_minuta` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_pre_minuta`, `id_minuta`
- **Datas/tempos prováveis**: `data_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `pre`, `nota`, `notfis`
