# Tabela `azportoex.processo`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `processo`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `10`
- **Create time**: `2025-09-07T17:40:33`
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
- `id_processo`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_processo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_processo` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | YES | `` | `` | `` | `` |
| 3 | `tipo` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_oco` | `int` | YES | `` | `` | `` | `` |
| 5 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 6 | `operador` | `int` | YES | `` | `` | `` | `` |
| 7 | `base` | `int` | YES | `` | `` | `` | `` |
| 8 | `data_evento` | `date` | YES | `` | `` | `` | `` |
| 9 | `hora_evento` | `time` | YES | `` | `` | `` | `` |
| 10 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 11 | `hora_incluido` | `time` | YES | `` | `` | `` | `` |
| 12 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `valor` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 14 | `data_finalizado` | `timestamp` | YES | `` | `` | `` | `` |
| 15 | `protocolo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 16 | `processo_sac` | `int` | YES | `` | `` | `` | `` |
| 17 | `lancamento` | `int` | YES | `` | `` | `` | `` |
| 18 | `categoria` | `int` | YES | `` | `` | `` | `` |
| 19 | `detalhes_itens` | `json` | YES | `` | `` | `` | `` |
| 20 | `totais_itens` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_processo`, `id_minuta`, `id_oco`
- **Datas/tempos prováveis**: `data_evento`, `hora_evento`, `data_incluido`, `hora_incluido`, `data_finalizado`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `processo`
