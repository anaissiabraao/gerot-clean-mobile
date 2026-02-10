# Tabela `azportoex.system_events`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `system_events`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:11`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_entity` → `system_entitities.id` (constraint=`fk_system_events_entitities`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `system_user_event.id_event` → `system_events.id` (constraint=`fk_system_event_user`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `event` type=`BTREE` non_unique=`False` cols=[`event`, `id_entity`]
- `fk_system_events_entitities` type=`BTREE` non_unique=`True` cols=[`id_entity`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `name` | `varchar(30)` | NO | `` | `` | `` | `Nome de identificação do evento` |
| 3 | `description` | `varchar(1000)` | NO | `` | `` | `` | `Descricao do evento. Detalhar finalidade e aplicacao` |
| 4 | `event` | `enum('insert','update','delete')` | NO | `` | `` | `MUL` | `` |
| 5 | `id_entity` | `smallint` | NO | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_entity`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `system`, `events`
