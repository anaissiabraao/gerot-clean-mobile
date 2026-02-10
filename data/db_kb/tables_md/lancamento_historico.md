# Tabela `azportoex.lancamento_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `lancamento_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `470526`
- **Create time**: `2025-10-11T06:50:55`
- **Update time**: `2025-12-17T16:47:33`
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
- `lancamento` → `lancamentos.id_lancamento` (constraint=`fk_lancamento_historico_lanc`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_lancamento_historico_lanc` type=`BTREE` non_unique=`True` cols=[`lancamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `codigo` | `tinyint` | NO | `` | `` | `` | `` |
| 3 | `lancamento` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `descricao` | `varchar(65)` | YES | `` | `` | `` | `` |
| 5 | `data` | `date` | NO | `` | `` | `` | `` |
| 6 | `hora` | `time` | NO | `` | `` | `` | `` |
| 7 | `operador` | `int` | NO | `` | `` | `` | `` |
| 8 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 9 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 10 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 11 | `baixa` | `int` | YES | `` | `` | `` | `` |
| 12 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:47:33`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `lancamento`, `historico`
