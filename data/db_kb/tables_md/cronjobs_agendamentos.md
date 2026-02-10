# Tabela `azportoex.cronjobs_agendamentos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cronjobs_agendamentos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `26`
- **Create time**: `2025-09-07T17:37:30`
- **Update time**: `2025-12-17T16:46:22`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_agendamento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_agendamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_agendamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `intervalo` | `varchar(50)` | YES | `` | `` | `` | `` |
| 3 | `comando` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `empresa` | `int` | NO | `` | `` | `` | `` |
| 5 | `unidade` | `int` | NO | `0` | `` | `` | `` |
| 6 | `configuracao` | `mediumtext` | NO | `` | `` | `` | `` |
| 7 | `tipo_envio` | `int` | YES | `0` | `` | `` | `` |
| 8 | `last_run` | `datetime` | YES | `` | `` | `` | `` |
| 9 | `tipo_empresa` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `condicao_minuta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 11 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 12 | `operador` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_agendamento`
- **Datas/tempos prováveis**: `last_run`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:46:22`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cronjobs`, `agendamentos`
