# Tabela `azportoex.dash_tipo_grafico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `dash_tipo_grafico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `36`
- **Create time**: `2025-09-07T17:37:36`
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
- `id`

## Chaves estrangeiras (evidência estrutural)
- `modulo` → `dash_modulos.id` (constraint=`dash_tipo_grafico_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `dash_tela_item.id_tipo_grafico` → `dash_tipo_grafico.id` (constraint=`dash_tela_item_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `dash_tipo_grafico_atributos.id_tipo` → `dash_tipo_grafico.id` (constraint=`dash_tipo_grafico_atributos_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_dtg_dm` type=`BTREE` non_unique=`True` cols=[`modulo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(40)` | NO | `` | `` | `` | `Nome do tipo de grafico.` |
| 3 | `tipo` | `enum('pie','bar','col','line','area','stacked','carousel','map','label','gauge')` | YES | `` | `` | `` | `` |
| 4 | `status` | `smallint` | YES | `1` | `` | `` | `` |
| 5 | `pago` | `smallint` | YES | `0` | `` | `` | `` |
| 6 | `venda` | `smallint` | YES | `0` | `` | `` | `` |
| 7 | `modulo` | `smallint` | YES | `` | `` | `MUL` | `` |
| 8 | `descricao` | `varchar(100)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `dash`, `tipo`, `grafico`
