# Tabela `azportoex.cte_substituicao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cte_substituicao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `265`
- **Create time**: `2025-10-08T19:29:26`
- **Update time**: `2025-12-17T13:10:34`
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
- `id_minuta` → `minuta.id_minuta` (constraint=`cte_substituicao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `cte_substituicao_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]
- `idx_cte_chave` type=`BTREE` non_unique=`True` cols=[`cte_chave`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `numero` | `int` | NO | `0` | `` | `` | `` |
| 5 | `serie` | `varchar(3)` | NO | `` | `` | `` | `` |
| 6 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 7 | `valor` | `decimal(22,2)` | NO | `` | `` | `` | `` |
| 8 | `chave` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `cnpj` | `varchar(15)` | YES | `` | `` | `` | `` |
| 10 | `cte_chave` | `varchar(45)` | NO | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_minuta`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T13:10:34`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `cte`, `substituicao`
