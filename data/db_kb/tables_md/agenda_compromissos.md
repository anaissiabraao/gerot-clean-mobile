# Tabela `azportoex.agenda_compromissos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `agenda_compromissos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `5`
- **Create time**: `2025-09-07T17:36:01`
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
- `id_compromisso`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_compromisso`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_compromisso` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario` | `int unsigned` | NO | `` | `` | `` | `` |
| 3 | `titulo` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `prioridade` | `int unsigned` | NO | `` | `` | `` | `` |
| 5 | `data_inicio` | `date` | NO | `` | `` | `` | `` |
| 6 | `hora_inicio` | `varchar(45)` | NO | `` | `` | `` | `` |
| 7 | `data_fim` | `date` | YES | `` | `` | `` | `` |
| 8 | `hora_fim` | `time` | YES | `` | `` | `` | `` |
| 9 | `texto` | `mediumtext` | NO | `` | `` | `` | `` |
| 10 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 11 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 12 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 13 | `nome` | `varchar(255)` | NO | `` | `` | `` | `` |
| 14 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 15 | `comercial` | `varchar(14)` | NO | `` | `` | `` | `` |
| 16 | `residencial` | `varchar(14)` | NO | `` | `` | `` | `` |
| 17 | `nextel` | `varchar(15)` | NO | `` | `` | `` | `` |
| 18 | `celular` | `varchar(14)` | NO | `` | `` | `` | `` |
| 19 | `msn` | `varchar(255)` | NO | `` | `` | `` | `` |
| 20 | `skype` | `varchar(55)` | NO | `` | `` | `` | `` |
| 21 | `empresa` | `varchar(120)` | NO | `` | `` | `` | `` |
| 22 | `diaseg` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `diater` | `tinyint` | YES | `0` | `` | `` | `` |
| 24 | `diaqua` | `tinyint` | YES | `0` | `` | `` | `` |
| 25 | `diaqui` | `tinyint` | YES | `0` | `` | `` | `` |
| 26 | `diasex` | `tinyint` | YES | `0` | `` | `` | `` |
| 27 | `diasab` | `tinyint` | YES | `0` | `` | `` | `` |
| 28 | `diadom` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_compromisso`
- **Datas/tempos prováveis**: `data_inicio`, `hora_inicio`, `data_fim`, `hora_fim`, `data_incluido`, `hora_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `agenda`, `compromissos`
