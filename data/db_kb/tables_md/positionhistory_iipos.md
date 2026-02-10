# Tabela `azportoex.positionhistory_iipos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `positionhistory_iipos`
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
| 2 | `IIPOS_ID` | `int` | NO | `` | `` | `` | `` |
| 3 | `IIPOS_AccountNumber` | `int` | NO | `` | `` | `` | `` |
| 4 | `IIPOS_MctAddress` | `int` | NO | `` | `` | `` | `` |
| 5 | `IIPOS_Latitude` | `decimal(8,6)` | YES | `` | `` | `` | `` |
| 6 | `IIPOS_Longitude` | `decimal(8,6)` | YES | `` | `` | `` | `` |
| 7 | `IIPOS_TimePosition` | `datetime` | YES | `` | `` | `` | `` |
| 8 | `IIPOS_VehicleIgnition` | `tinyint` | YES | `` | `` | `` | `` |
| 9 | `IIPOS_Landmark` | `varchar(255)` | YES | `` | `` | `` | `` |
| 10 | `IIPOS_MctName` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `IIPOS_ID`
- **Datas/tempos prováveis**: `IIPOS_TimePosition`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `positionhistory`, `iipos`
