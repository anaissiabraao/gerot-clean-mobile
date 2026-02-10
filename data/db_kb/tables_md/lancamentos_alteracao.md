# Tabela `azportoex.lancamentos_alteracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `lancamentos_alteracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:28`
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
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `ind_busca_lancamento` type=`BTREE` non_unique=`True` cols=[`id_fornecedor`, `data_vecto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_lancamento` | `int` | NO | `` | `` | `` | `` |
| 2 | `parcela` | `int` | NO | `1` | `` | `` | `` |
| 3 | `nParcelas` | `varchar(10)` | NO | `1` | `` | `` | `` |
| 4 | `id_centro` | `int` | YES | `` | `` | `` | `` |
| 5 | `id_conta` | `int` | NO | `` | `` | `` | `` |
| 6 | `forma` | `int` | NO | `` | `` | `` | `` |
| 7 | `id_fornecedor` | `int` | NO | `` | `` | `MUL` | `` |
| 8 | `id_unidade` | `int` | NO | `1` | `` | `` | `` |
| 9 | `descricao` | `varchar(50)` | NO | `` | `` | `` | `` |
| 10 | `documento` | `varchar(15)` | NO | `` | `` | `` | `` |
| 11 | `data_vecto` | `date` | NO | `` | `` | `` | `` |
| 12 | `valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 13 | `tipo` | `int` | NO | `1` | `` | `` | `` |
| 14 | `status` | `int` | NO | `0` | `` | `` | `` |
| 15 | `pago_data` | `date` | NO | `` | `` | `` | `` |
| 16 | `pago_valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 17 | `cheque` | `int` | NO | `` | `` | `` | `` |
| 18 | `lancamento` | `int` | NO | `1` | `` | `` | `` |
| 19 | `chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 20 | `operador` | `int` | NO | `` | `` | `` | `` |
| 21 | `dt_cancelado` | `date` | NO | `` | `` | `` | `` |
| 22 | `operador_cancelado` | `int` | NO | `` | `` | `` | `` |
| 23 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 24 | `fatura` | `int unsigned` | NO | `` | `` | `` | `` |
| 25 | `data` | `date` | NO | `` | `` | `` | `` |
| 26 | `altera_data` | `date` | NO | `` | `` | `` | `` |
| 27 | `altera_operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 28 | `pago_operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 29 | `data_baixa` | `date` | NO | `` | `` | `` | `` |
| 30 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 31 | `competencia` | `date` | YES | `` | `` | `` | `` |
| 32 | `num_cheque` | `varchar(15)` | YES | `` | `` | `` | `` |
| 33 | `juros` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 34 | `multa` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 35 | `protesto` | `int` | NO | `0` | `` | `` | `` |
| 36 | `data_credito` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_lancamento`, `id_centro`, `id_conta`, `id_fornecedor`, `id_unidade`
- **Datas/tempos prováveis**: `data_vecto`, `pago_data`, `dt_cancelado`, `data_incluido`, `data`, `altera_data`, `data_baixa`, `competencia`, `data_credito`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `lancamentos`, `alteracao`
