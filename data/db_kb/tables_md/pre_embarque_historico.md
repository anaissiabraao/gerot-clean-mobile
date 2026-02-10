# Tabela `azportoex.pre_embarque_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_embarque_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:31`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `data` | `date` | NO | `` | `` | `` | `` |
| 3 | `hora` | `time` | NO | `` | `` | `` | `` |
| 4 | `status` | `smallint` | NO | `` | `` | `` | `` |
| 5 | `operador` | `int` | YES | `` | `` | `` | `` |
| 6 | `obs` | `varchar(255)` | NO | `` | `` | `` | `` |
| 7 | `edi` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 9 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 10 | `ocorrencia` | `smallint` | YES | `` | `` | `` | `` |
| 11 | `pre_embarque` | `int` | NO | `` | `` | `` | `` |
| 12 | `unidade` | `varchar(5)` | NO | `` | `` | `` | `` |
| 13 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 14 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `pre`, `embarque`, `historico`
