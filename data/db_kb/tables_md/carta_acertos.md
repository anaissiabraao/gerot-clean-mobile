# Tabela `azportoex.carta_acertos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `carta_acertos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:04`
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
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `carta` | `int` | YES | `` | `` | `` | `` |
| 3 | `data` | `date` | YES | `` | `` | `` | `` |
| 4 | `empresa` | `int` | YES | `` | `` | `` | `` |
| 5 | `documento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 6 | `valor` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 7 | `forma` | `int` | YES | `` | `` | `` | `` |
| 8 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `operador` | `int` | YES | `` | `` | `` | `` |
| 10 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 11 | `status` | `int` | NO | `1` | `` | `` | `` |
| 12 | `centro` | `smallint` | NO | `0` | `` | `` | `` |
| 13 | `tipo` | `smallint` | NO | `0` | `` | `` | `` |
| 14 | `lancamento_convenio` | `varchar(15)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `carta`, `acertos`
