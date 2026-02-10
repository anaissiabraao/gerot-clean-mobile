# Tabela `azportoex.sistem_log_acesso`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `sistem_log_acesso`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `204308`
- **Create time**: `2025-10-09T15:14:07`
- **Update time**: `2025-12-17T16:50:30`
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
- `idx_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]
- `idx_data` type=`BTREE` non_unique=`True` cols=[`data`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario` | `int` | NO | `` | `` | `` | `` |
| 3 | `data` | `date` | NO | `` | `` | `MUL` | `` |
| 4 | `hora` | `time` | NO | `` | `` | `` | `` |
| 5 | `ip` | `varchar(20)` | NO | `` | `` | `` | `` |
| 6 | `tipo` | `int` | NO | `` | `` | `` | `` |
| 7 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 8 | `version` | `varchar(6)` | YES | `` | `` | `` | `` |
| 9 | `city` | `varchar(100)` | YES | `` | `` | `` | `` |
| 10 | `regionName` | `varchar(100)` | YES | `` | `` | `` | `` |
| 11 | `regionCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 12 | `countryIso` | `varchar(6)` | YES | `` | `` | `` | `` |
| 13 | `countryCodeIso3` | `varchar(6)` | YES | `` | `` | `` | `` |
| 14 | `countryName` | `varchar(100)` | YES | `` | `` | `` | `` |
| 15 | `countryCapital` | `varchar(100)` | YES | `` | `` | `` | `` |
| 16 | `countryTld` | `varchar(100)` | YES | `` | `` | `` | `` |
| 17 | `continentCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 18 | `isInEu` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 19 | `postalCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 20 | `latitude` | `decimal(11,8)` | YES | `` | `` | `` | `` |
| 21 | `longitude` | `decimal(11,8)` | YES | `` | `` | `` | `` |
| 22 | `latLong` | `point` | YES | `` | `` | `` | `` |
| 23 | `timezoneCode` | `varchar(100)` | YES | `` | `` | `` | `` |
| 24 | `timezoneUtcOffset` | `varchar(6)` | YES | `` | `` | `` | `` |
| 25 | `countryCallingCode` | `varchar(6)` | YES | `` | `` | `` | `` |
| 26 | `currencyCode` | `varchar(6)` | YES | `` | `` | `` | `` |
| 27 | `currencyName` | `varchar(36)` | YES | `` | `` | `` | `` |
| 28 | `countryLanguages` | `longtext` | YES | `` | `` | `` | `` |
| 29 | `countryArea` | `float` | YES | `` | `` | `` | `` |
| 30 | `countryPopulation` | `float` | YES | `` | `` | `` | `` |
| 31 | `asn` | `varchar(100)` | YES | `` | `` | `` | `` |
| 32 | `org` | `varchar(100)` | YES | `` | `` | `` | `` |
| 33 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:30`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `sistem`, `log`, `acesso`
