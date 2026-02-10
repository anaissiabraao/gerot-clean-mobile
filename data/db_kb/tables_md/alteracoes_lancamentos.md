# Tabela `azportoex.alteracoes_lancamentos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `alteracoes_lancamentos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `209020`
- **Create time**: `2025-09-07T17:36:06`
- **Update time**: `2025-12-17T16:41:15`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_alteracao`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_alteracao`]
- `idx_data_alterado_lancamento` type=`BTREE` non_unique=`True` cols=[`data_alterado`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_alteracao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lancamento` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_centro` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_conta` | `int` | NO | `` | `` | `` | `` |
| 5 | `forma` | `int` | NO | `` | `` | `` | `` |
| 6 | `id_fornecedor` | `int` | NO | `` | `` | `` | `` |
| 7 | `id_unidade` | `int` | NO | `1` | `` | `` | `` |
| 8 | `descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 9 | `documento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 10 | `data_vecto` | `date` | NO | `` | `` | `` | `` |
| 11 | `valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 12 | `status` | `int` | NO | `0` | `` | `` | `` |
| 13 | `pago_data` | `date` | YES | `` | `` | `` | `` |
| 14 | `pago_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `cheque` | `int` | YES | `` | `` | `` | `` |
| 16 | `lancamento` | `tinyint` | YES | `1` | `` | `` | `` |
| 17 | `dt_cancelado` | `date` | YES | `` | `` | `` | `` |
| 18 | `fatura` | `int` | YES | `0` | `` | `` | `` |
| 19 | `data` | `date` | NO | `` | `` | `` | `` |
| 20 | `data_baixa` | `date` | YES | `` | `` | `` | `` |
| 21 | `competencia` | `date` | YES | `` | `` | `` | `` |
| 22 | `num_cheque` | `varchar(15)` | YES | `` | `` | `` | `` |
| 23 | `juros` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 24 | `multa` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 25 | `protesto` | `smallint` | YES | `0` | `` | `` | `` |
| 26 | `operador` | `int` | NO | `` | `` | `` | `` |
| 27 | `data_alterado` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 28 | `operador_alterado` | `int` | YES | `0` | `` | `` | `` |
| 29 | `data_enviado_cnab` | `datetime` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_alteracao`, `id_lancamento`, `id_centro`, `id_conta`, `id_fornecedor`, `id_unidade`
- **Datas/tempos prováveis**: `data_vecto`, `pago_data`, `dt_cancelado`, `data`, `data_baixa`, `competencia`, `data_alterado`, `data_enviado_cnab`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:41:15`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `alteracoes`, `lancamentos`
