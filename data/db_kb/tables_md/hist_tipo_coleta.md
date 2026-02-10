# Tabela `azportoex.hist_tipo_coleta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `hist_tipo_coleta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:11`
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
- `id_tipo_coleta` → `tipo_coleta.id_tipoColeta` (constraint=`hist_tipo_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `operador` → `usuarios.id_usuario` (constraint=`hist_tipo_coleta_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `fields_tipo_coleta.id_historico` → `hist_tipo_coleta.id` (constraint=`fields_tipo_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `id_tipo_coleta` type=`BTREE` non_unique=`True` cols=[`id_tipo_coleta`]
- `operador` type=`BTREE` non_unique=`True` cols=[`operador`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tipo_coleta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `operador` | `int` | YES | `` | `` | `MUL` | `` |
| 4 | `data` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tipo_coleta`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `hist`, `tipo`, `coleta`
