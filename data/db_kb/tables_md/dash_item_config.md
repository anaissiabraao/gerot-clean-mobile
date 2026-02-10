# Tabela `azportoex.dash_item_config`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `dash_item_config`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `126`
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
- `id_tela_item` → `dash_tela_item.id` (constraint=`dash_item_config_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_atributo` → `dash_tipo_grafico_atributos.id` (constraint=`dash_item_config_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_dic_dtga` type=`BTREE` non_unique=`True` cols=[`id_atributo`]
- `fk_dic_dti` type=`BTREE` non_unique=`True` cols=[`id_tela_item`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tela_item` | `smallint` | NO | `` | `` | `MUL` | `` |
| 3 | `id_atributo` | `smallint` | NO | `` | `` | `MUL` | `` |
| 4 | `valor` | `varchar(15)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tela_item`, `id_atributo`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `dash`, `item`, `config`
