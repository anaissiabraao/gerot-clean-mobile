# Tabela `azportoex.dash_tela_item`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `dash_tela_item`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `31`
- **Create time**: `2025-09-07T17:37:35`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_tela` → `dash_tela.id` (constraint=`dash_tela_item_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_tipo_grafico` → `dash_tipo_grafico.id` (constraint=`dash_tela_item_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `dash_item_config.id_tela_item` → `dash_tela_item.id` (constraint=`dash_item_config_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_dti_dt` type=`BTREE` non_unique=`True` cols=[`id_tela`]
- `fk_dti_dtg` type=`BTREE` non_unique=`True` cols=[`id_tipo_grafico`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tela` | `smallint` | NO | `` | `` | `MUL` | `` |
| 3 | `id_tipo_grafico` | `smallint` | NO | `` | `` | `MUL` | `` |
| 4 | `posicao_x` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `posicao_y` | `tinyint` | NO | `` | `` | `` | `` |
| 6 | `largura` | `tinyint` | NO | `` | `` | `` | `` |
| 7 | `altura` | `tinyint` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tela`, `id_tipo_grafico`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `dash`, `tela`, `item`
