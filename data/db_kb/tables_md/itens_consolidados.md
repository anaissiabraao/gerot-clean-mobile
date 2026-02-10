# Tabela `azportoex.itens_consolidados`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `itens_consolidados`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:20`
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
- `id_consolidador` → `consolidador.id` (constraint=`fk_id_consolidador`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `operador` → `usuarios.id_usuario` (constraint=`fk_id_usuario`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_volume` → `volumes.id_volume` (constraint=`fk_id_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_id_consolidador` type=`BTREE` non_unique=`True` cols=[`id_consolidador`]
- `fk_id_usuario` type=`BTREE` non_unique=`True` cols=[`operador`]
- `fk_id_volume` type=`BTREE` non_unique=`True` cols=[`id_volume`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_volume` | `int` | YES | `` | `` | `MUL` | `ID de volumes` |
| 3 | `id_consolidador` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `operador` | `int` | NO | `` | `` | `MUL` | `` |
| 5 | `created_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 6 | `id_manifesto` | `int` | YES | `` | `` | `` | `` |
| 7 | `inserted_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 8 | `deleted_at` | `timestamp` | YES | `` | `` | `` | `` |
| 9 | `confirmado` | `tinyint(1)` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_volume`, `id_consolidador`, `id_manifesto`
- **Datas/tempos prováveis**: `created_at`, `inserted_at`, `deleted_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `itens`, `consolidados`
