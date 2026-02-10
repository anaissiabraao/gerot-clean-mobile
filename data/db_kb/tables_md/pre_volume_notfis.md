# Tabela `azportoex.pre_volume_notfis`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_volume_notfis`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:33`
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
- `id_pre_nota` → `pre_nota_notfis.id` (constraint=`fk_pre_volume_notfis`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_pre_volume_notfis` type=`BTREE` non_unique=`True` cols=[`id_pre_nota`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `etiqueta` | `varchar(20)` | YES | `` | `` | `` | `` |
| 3 | `id_pre_nota` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `usuario_conferencia` | `int` | YES | `` | `` | `` | `` |
| 6 | `dados` | `text` | YES | `` | `` | `` | `` |
| 7 | `data_conferencia` | `timestamp` | YES | `` | `` | `` | `` |
| 8 | `id_rota` | `int` | YES | `` | `` | `` | `` |
| 9 | `consolidador` | `int` | YES | `` | `` | `` | `` |
| 10 | `bipado` | `int` | YES | `` | `` | `` | `` |
| 11 | `id_operador` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_pre_nota`, `id_rota`, `id_operador`
- **Datas/tempos prováveis**: `data_conferencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pre`, `volume`, `notfis`
