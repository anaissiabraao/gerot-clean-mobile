# Tabela `azportoex.tabela_faixas_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_faixas_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `799374`
- **Create time**: `2025-09-07T17:41:17`
- **Update time**: `2025-12-16T13:33:12`
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
- `id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_tabela_faixas_historico_trecho`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_tabela_faixas_historico_trecho` type=`BTREE` non_unique=`True` cols=[`id_trecho`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_trecho` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `inicio` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 4 | `fim` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 5 | `minimo` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 6 | `franquia` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 7 | `excedente` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 8 | `tipo` | `tinyint` | NO | `` | `` | `` | `` |
| 9 | `indice` | `smallint` | YES | `1` | `` | `` | `` |
| 10 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 11 | `deleted_at` | `timestamp` | YES | `` | `` | `` | `` |
| 12 | `inserted_at` | `timestamp` | YES | `` | `` | `` | `` |
| 13 | `operador` | `int` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_trecho`
- **Datas/tempos prováveis**: `created_at`, `deleted_at`, `inserted_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T13:33:12`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `tabela`, `faixas`, `historico`
