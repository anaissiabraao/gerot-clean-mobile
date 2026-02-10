# Tabela `azportoex.monitoramento_risco`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `monitoramento_risco`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:11`
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
| 2 | `gerenciadora` | `int` | NO | `` | `` | `` | `` |
| 3 | `manifesto` | `int` | YES | `` | `` | `` | `` |
| 4 | `numero` | `int` | YES | `` | `` | `` | `` |
| 5 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 6 | `data_emissao` | `date` | YES | `` | `` | `` | `` |
| 7 | `hora_emissao` | `time` | YES | `` | `` | `` | `` |
| 8 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 9 | `emissora` | `int` | YES | `` | `` | `` | `` |
| 10 | `escolta` | `tinyint` | YES | `` | `` | `` | `` |
| 11 | `lat_origem` | `varchar(14)` | YES | `` | `` | `` | `` |
| 12 | `lng_origem` | `varchar(14)` | YES | `` | `` | `` | `` |
| 13 | `lat_destino` | `varchar(14)` | YES | `` | `` | `` | `` |
| 14 | `lng_destino` | `varchar(14)` | YES | `` | `` | `` | `` |
| 15 | `id_rota` | `int` | YES | `` | `` | `` | `` |
| 16 | `pgr` | `int` | YES | `` | `` | `` | `` |
| 17 | `id_transportadora` | `varchar(15)` | YES | `` | `` | `` | `` |
| 18 | `prioridade` | `smallint` | YES | `` | `` | `` | `` |
| 19 | `carga_mercadoria` | `smallint` | YES | `` | `` | `` | `` |
| 20 | `viagem_rota` | `int` | YES | `` | `` | `` | `` |
| 21 | `codigo` | `int` | YES | `` | `` | `` | `` |
| 22 | `tipo_transporte` | `tinyint` | YES | `2` | `` | `` | `` |
| 23 | `origem` | `varchar(100)` | YES | `` | `` | `` | `` |
| 24 | `destino` | `varchar(100)` | YES | `` | `` | `` | `` |
| 25 | `cidade_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 26 | `cidade_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 27 | `hora_saida` | `varchar(5)` | YES | `` | `` | `` | `` |
| 28 | `hora_chegada` | `varchar(5)` | YES | `` | `` | `` | `` |
| 29 | `recibo` | `int` | YES | `` | `` | `` | `` |
| 30 | `doc_aux1` | `varchar(45)` | YES | `` | `` | `` | `` |
| 31 | `doc_aux2` | `varchar(45)` | YES | `` | `` | `` | `` |
| 32 | `doc_aux3` | `varchar(10)` | YES | `` | `` | `` | `` |
| 33 | `cte_destino` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_rota`, `id_transportadora`
- **Datas/tempos prováveis**: `data_emissao`, `hora_emissao`, `hora_saida`, `hora_chegada`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `monitoramento`, `risco`
