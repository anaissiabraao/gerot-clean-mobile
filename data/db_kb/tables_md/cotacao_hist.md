# Tabela `azportoex.cotacao_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cotacao_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `240436`
- **Create time**: `2025-10-11T06:51:01`
- **Update time**: `2025-12-17T16:47:56`
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
- `cotacao` → `cotacao.id_cotacao` (constraint=`fk_cotacao_hist_cotacao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_cotacao_hist_cotacao` type=`BTREE` non_unique=`True` cols=[`cotacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cotacao` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 4 | `obs` | `varchar(255)` | NO | `` | `` | `` | `` |
| 5 | `data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 6 | `hora` | `time` | YES | `` | `` | `` | `` |
| 7 | `operador` | `int unsigned` | NO | `0` | `` | `` | `` |
| 8 | `data_incluido` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 9 | `hora_incluido` | `varchar(15)` | NO | `` | `` | `` | `` |
| 10 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:47:56`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `cotacao`, `hist`
