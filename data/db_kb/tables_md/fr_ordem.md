# Tabela `azportoex.fr_ordem`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_ordem`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3882`
- **Create time**: `2025-09-07T17:38:04`
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
| 2 | `veiculo` | `int` | YES | `` | `` | `` | `` |
| 3 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 4 | `km` | `decimal(10,0)` | YES | `` | `` | `` | `` |
| 5 | `data_entrada` | `date` | YES | `` | `` | `` | `` |
| 6 | `data_servico` | `date` | YES | `` | `` | `` | `` |
| 7 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 8 | `tipo` | `int` | YES | `` | `` | `` | `` |
| 9 | `hora_entrada` | `time` | YES | `` | `` | `` | `` |
| 10 | `data_prev` | `date` | YES | `` | `` | `` | `` |
| 11 | `hora_prev` | `time` | YES | `` | `` | `` | `` |
| 12 | `descricao` | `mediumtext` | YES | `` | `` | `` | `` |
| 13 | `usuario` | `int` | YES | `` | `` | `` | `` |
| 14 | `status` | `int` | YES | `1` | `` | `` | `` |
| 15 | `lancamento` | `int` | YES | `` | `` | `` | `` |
| 16 | `data_finalizada` | `date` | YES | `` | `` | `` | `` |
| 17 | `hora_finalizada` | `time` | YES | `` | `` | `` | `` |
| 18 | `logim_finalizada` | `int` | YES | `` | `` | `` | `` |
| 19 | `id_fatura` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fatura`
- **Datas/tempos prováveis**: `data_entrada`, `data_servico`, `hora_entrada`, `data_prev`, `hora_prev`, `data_finalizada`, `hora_finalizada`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ordem`
