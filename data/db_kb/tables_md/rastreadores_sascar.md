# Tabela `azportoex.rastreadores_sascar`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rastreadores_sascar`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1978399`
- **Create time**: `2025-09-07T17:40:36`
- **Update time**: `2025-12-17T16:34:33`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `idpacote`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`idpacote`]
- `idx_veiculo_posicao` type=`BTREE` non_unique=`True` cols=[`idveiculo`, `dataposicao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `idpacote` | `bigint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `idveiculo` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `latitude` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `longitude` | `varchar(45)` | NO | `` | `` | `` | `` |
| 5 | `codigomacro` | `int` | YES | `0` | `` | `` | `` |
| 6 | `nomemensagem` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `rua` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `cidade` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `uf` | `varchar(2)` | YES | `` | `` | `` | `` |
| 10 | `velocidade` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `horimetro` | `int` | YES | `0` | `` | `` | `` |
| 12 | `odometro` | `int` | YES | `0` | `` | `` | `` |
| 13 | `datapacote` | `timestamp` | YES | `0000-00-00 00:00:00` | `` | `` | `` |
| 14 | `dataposicao` | `timestamp` | YES | `0000-00-00 00:00:00` | `` | `` | `` |
| 15 | `rpm` | `int` | YES | `0` | `` | `` | `` |
| 16 | `bloqueio` | `tinyint` | YES | `0` | `` | `` | `` |
| 17 | `direcao` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `ignicao` | `tinyint` | YES | `0` | `` | `` | `` |
| 19 | `pontoreferencia` | `varchar(255)` | YES | `` | `` | `` | `` |
| 20 | `tipo` | `tinyint` | NO | `8` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: (nenhum padrão _id/id_ detectado)
- **Datas/tempos prováveis**: `datapacote`, `dataposicao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:34:33`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `rastreadores`, `sascar`
