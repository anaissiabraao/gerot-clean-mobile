# Tabela `azportoex.ips`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ips`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `6050`
- **Create time**: `2025-09-07T17:39:20`
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
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `ip` | `varchar(36)` | NO | `` | `` | `` | `` |
| 3 | `version` | `varchar(6)` | YES | `` | `` | `` | `` |
| 4 | `city` | `varchar(100)` | YES | `` | `` | `` | `` |
| 5 | `regionName` | `varchar(100)` | YES | `` | `` | `` | `` |
| 6 | `regionCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 7 | `countryIso` | `varchar(6)` | YES | `` | `` | `` | `` |
| 8 | `countryCodeIso3` | `varchar(6)` | YES | `` | `` | `` | `` |
| 9 | `countryName` | `varchar(100)` | YES | `` | `` | `` | `` |
| 10 | `countryCapital` | `varchar(100)` | YES | `` | `` | `` | `` |
| 11 | `countryTld` | `varchar(100)` | YES | `` | `` | `` | `` |
| 12 | `continentCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 13 | `isInEu` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 14 | `postalCode` | `varchar(36)` | YES | `` | `` | `` | `` |
| 15 | `latitude` | `decimal(11,8)` | YES | `` | `` | `` | `` |
| 16 | `longitude` | `decimal(11,8)` | YES | `` | `` | `` | `` |
| 17 | `latLong` | `point` | YES | `` | `` | `` | `` |
| 18 | `timezoneCode` | `varchar(100)` | YES | `` | `` | `` | `` |
| 19 | `timezoneUtcOffset` | `varchar(6)` | YES | `` | `` | `` | `` |
| 20 | `countryCallingCode` | `varchar(6)` | YES | `` | `` | `` | `` |
| 21 | `currencyCode` | `varchar(6)` | YES | `` | `` | `` | `` |
| 22 | `currencyName` | `varchar(36)` | YES | `` | `` | `` | `` |
| 23 | `countryLanguages` | `longtext` | YES | `` | `` | `` | `` |
| 24 | `countryArea` | `float` | YES | `` | `` | `` | `` |
| 25 | `countryPopulation` | `float` | YES | `` | `` | `` | `` |
| 26 | `asn` | `varchar(100)` | YES | `` | `` | `` | `` |
| 27 | `org` | `varchar(100)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ips`
