# Tabela `azportoex.dash_tipo_grafico_atributos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `dash_tipo_grafico_atributos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `143`
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
- `id_tipo` → `dash_tipo_grafico.id` (constraint=`dash_tipo_grafico_atributos_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `dash_item_config.id_atributo` → `dash_tipo_grafico_atributos.id` (constraint=`dash_item_config_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_dtga_dtg` type=`BTREE` non_unique=`True` cols=[`id_tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tipo` | `smallint` | NO | `` | `` | `MUL` | `ID da tabela dash_tipo_grafico` |
| 3 | `atributo` | `varchar(40)` | NO | `` | `` | `` | `Nome do atributo. Ex: columns, slices, bars` |
| 4 | `minimo` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 5 | `maximo` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 6 | `valor` | `text` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tipo`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `dash`, `tipo`, `grafico`, `atributos`
