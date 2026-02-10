# Tabela `azportoex.returnmessage_iirtn`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `returnmessage_iirtn`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:02`
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
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `IIRTN_ID` | `int` | NO | `` | `` | `` | `` |
| 2 | `IIRTN_AccountNumber` | `int` | NO | `` | `` | `` | `` |
| 3 | `IIRTN_MctAddres` | `int` | NO | `` | `` | `` | `` |
| 4 | `IIRTN_MsgPriority` | `tinyint` | YES | `` | `` | `` | `` |
| 5 | `IIRTN_VehicleIgnition` | `tinyint` | YES | `` | `` | `` | `` |
| 6 | `IIRTN_MacroNumber` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `IIRTN_MacroVersion` | `tinyint` | YES | `` | `` | `` | `` |
| 8 | `IIRTN_BinaryDatatype` | `tinyint` | YES | `` | `` | `` | `` |
| 9 | `IIRTN_Latitude` | `decimal(8,6)` | YES | `` | `` | `` | `` |
| 10 | `IIRTN_Longitude` | `decimal(8,6)` | YES | `` | `` | `` | `` |
| 11 | `IIRTN_PositionTime` | `datetime` | YES | `` | `` | `` | `` |
| 12 | `IIRTN_MessageTime` | `datetime` | YES | `` | `` | `` | `` |
| 13 | `IIRTN_Landmark` | `varchar(255)` | YES | `` | `` | `` | `` |
| 14 | `IIRTN_Text` | `varchar(4000)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `IIRTN_ID`
- **Datas/tempos prováveis**: `IIRTN_BinaryDatatype`, `IIRTN_PositionTime`, `IIRTN_MessageTime`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `returnmessage`, `iirtn`
