# Tabela `azportoex.processo_sac`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `processo_sac`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:34`
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
| 2 | `manifesto` | `int` | YES | `` | `` | `` | `` |
| 3 | `minuta` | `int` | YES | `` | `` | `` | `` |
| 4 | `ocorrencia` | `int` | YES | `` | `` | `` | `` |
| 5 | `data` | `date` | YES | `` | `` | `` | `` |
| 6 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `descricao` | `mediumtext` | YES | `` | `` | `` | `` |
| 8 | `criado_em` | `datetime` | YES | `` | `` | `` | `` |
| 9 | `status` | `int` | YES | `1` | `` | `` | `` |
| 10 | `data_prazo` | `date` | YES | `` | `` | `` | `` |
| 11 | `data_finalizado` | `datetime` | YES | `` | `` | `` | `` |
| 12 | `prazo_dias` | `tinyint` | YES | `` | `` | `` | `` |
| 13 | `operador` | `int` | YES | `` | `` | `` | `` |
| 14 | `unidade_resp` | `int` | YES | `` | `` | `` | `` |
| 15 | `local_ocorrencia` | `tinyint` | YES | `` | `` | `` | `` |
| 16 | `valor_processo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 17 | `detalhes_itens` | `json` | YES | `` | `` | `` | `` |
| 18 | `totais_itens` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `criado_em`, `data_prazo`, `data_finalizado`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `processo`, `sac`
