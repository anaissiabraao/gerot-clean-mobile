# Tabela `azportoex.lancamentos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `lancamentos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `102149`
- **Create time**: `2025-09-07T17:39:25`
- **Update time**: `2025-12-17T16:47:33`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_lancamento`

## Chaves estrangeiras (evidência estrutural)
- `relacionados` → `lancamentos.id_lancamento` (constraint=`fk_lancamento1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `relacionadosNovo` → `lancamentos.id_lancamento` (constraint=`fk_lancamento2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `lancamento_historico.lancamento` → `lancamentos.id_lancamento` (constraint=`fk_lancamento_historico_lanc`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `lancamentos.relacionados` → `lancamentos.id_lancamento` (constraint=`fk_lancamento1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `lancamentos.relacionadosNovo` → `lancamentos.id_lancamento` (constraint=`fk_lancamento2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `nf_contra_lancamento.id_lancamento` → `lancamentos.id_lancamento` (constraint=`fk_nf_contra_lancamento`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_lancamento`]
- `fk_lancamento1` type=`BTREE` non_unique=`True` cols=[`relacionados`]
- `fk_lancamento2` type=`BTREE` non_unique=`True` cols=[`relacionadosNovo`]
- `idx_data_incluido` type=`BTREE` non_unique=`True` cols=[`data_incluido`]
- `idx_lancamento_ciot` type=`BTREE` non_unique=`True` cols=[`ciot`]
- `idx_lancamento_fatura` type=`BTREE` non_unique=`True` cols=[`fatura`]
- `idx_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]
- `ind_busca_lancamento` type=`BTREE` non_unique=`True` cols=[`id_fornecedor`, `data_vecto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_lancamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `parcela` | `int` | YES | `1` | `` | `` | `` |
| 3 | `nparcelas` | `varchar(10)` | YES | `1` | `` | `` | `` |
| 4 | `id_centro` | `int` | YES | `` | `` | `` | `` |
| 5 | `id_conta` | `int` | NO | `` | `` | `` | `` |
| 6 | `forma` | `int` | NO | `` | `` | `` | `` |
| 7 | `id_fornecedor` | `int` | NO | `` | `` | `MUL` | `` |
| 8 | `id_unidade` | `int` | NO | `1` | `` | `` | `` |
| 9 | `descricao` | `varchar(150)` | YES | `` | `` | `` | `` |
| 10 | `documento` | `varchar(25)` | YES | `` | `` | `` | `` |
| 11 | `data_vecto` | `date` | NO | `` | `` | `` | `` |
| 12 | `vencimento_original` | `date` | YES | `` | `` | `` | `` |
| 13 | `valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 14 | `tipo` | `int` | NO | `1` | `` | `` | `` |
| 15 | `status` | `int` | NO | `0` | `` | `` | `` |
| 16 | `pago_data` | `date` | YES | `` | `` | `` | `` |
| 17 | `pago_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 18 | `cheque` | `int` | YES | `` | `` | `` | `` |
| 19 | `lancamento` | `tinyint` | YES | `1` | `` | `` | `` |
| 20 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 21 | `operador` | `int` | NO | `` | `` | `` | `` |
| 22 | `dt_cancelado` | `date` | YES | `` | `` | `` | `` |
| 23 | `operador_cancelado` | `int` | YES | `` | `` | `` | `` |
| 24 | `data_incluido` | `date` | NO | `` | `` | `MUL` | `` |
| 25 | `fatura` | `int` | YES | `0` | `` | `MUL` | `` |
| 26 | `nota_servico` | `int` | YES | `0` | `` | `` | `` |
| 27 | `data` | `datetime` | YES | `` | `` | `` | `` |
| 28 | `altera_data` | `date` | YES | `` | `` | `` | `` |
| 29 | `altera_operador` | `int` | YES | `` | `` | `` | `` |
| 30 | `pago_operador` | `int` | YES | `` | `` | `` | `` |
| 31 | `data_baixa` | `date` | YES | `` | `` | `` | `` |
| 32 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 33 | `competencia` | `date` | YES | `` | `` | `` | `` |
| 34 | `num_cheque` | `varchar(15)` | YES | `` | `` | `` | `` |
| 35 | `nosso_numero` | `varchar(17)` | YES | `` | `` | `` | `` |
| 36 | `juros` | `decimal(8,3)` | YES | `0.000` | `` | `` | `` |
| 37 | `multa` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 38 | `protesto` | `smallint` | YES | `0` | `` | `` | `` |
| 39 | `data_credito` | `date` | YES | `` | `` | `` | `` |
| 40 | `minuta` | `int` | YES | `0` | `` | `` | `` |
| 41 | `manifesto` | `int` | YES | `0` | `` | `MUL` | `` |
| 42 | `enviado` | `tinyint` | YES | `0` | `` | `` | `` |
| 43 | `data_enviado_cnab` | `datetime` | YES | `` | `` | `` | `` |
| 44 | `arquivo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 45 | `nota_servido` | `int` | YES | `0` | `` | `` | `` |
| 46 | `valor_original` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 47 | `codigo_barra` | `varchar(55)` | YES | `` | `` | `` | `` |
| 48 | `pago_hora` | `time` | YES | `00:00:00` | `` | `` | `` |
| 49 | `relacionados` | `int` | YES | `` | `` | `MUL` | `` |
| 50 | `relacionadosNovo` | `int` | YES | `` | `` | `MUL` | `` |
| 51 | `parcelaNova` | `int` | YES | `` | `` | `` | `` |
| 52 | `nParcelasNova` | `int` | YES | `` | `` | `` | `` |
| 53 | `juros_pago` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 54 | `cobranca` | `varchar(5)` | YES | `` | `` | `` | `` |
| 55 | `compoe_dre` | `tinyint` | YES | `1` | `` | `` | `` |
| 56 | `operador_baixa` | `int` | YES | `` | `` | `` | `` |
| 57 | `aceito` | `int` | YES | `` | `` | `` | `` |
| 58 | `data_aceito` | `datetime` | YES | `` | `` | `` | `` |
| 59 | `forma_contato` | `varchar(50)` | YES | `` | `` | `` | `` |
| 60 | `nome_contato` | `varchar(60)` | YES | `` | `` | `` | `` |
| 61 | `tarifa` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 62 | `acerto_carta` | `int` | YES | `0` | `` | `` | `` |
| 63 | `forma_contra` | `smallint` | YES | `0` | `` | `` | `` |
| 64 | `id_conta_contra` | `int` | YES | `0` | `` | `` | `` |
| 65 | `id_antecipado` | `int` | YES | `0` | `` | `` | `` |
| 66 | `data_abono` | `date` | YES | `` | `` | `` | `` |
| 67 | `transf` | `int` | YES | `0` | `` | `` | `` |
| 68 | `fatura_rec` | `varchar(10)` | YES | `` | `` | `` | `` |
| 69 | `desconto` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 70 | `importacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 71 | `operador_consc` | `int` | YES | `` | `` | `` | `` |
| 72 | `data_consc` | `datetime` | YES | `` | `` | `` | `` |
| 73 | `consciliacao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 74 | `data_protesto` | `date` | YES | `` | `` | `` | `` |
| 75 | `compoe_fluxo_caixa` | `tinyint` | YES | `1` | `` | `` | `` |
| 76 | `acrescimo` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 77 | `protocolo_ofx` | `varchar(15)` | YES | `` | `` | `` | `` |
| 78 | `ciot_parcela` | `int` | YES | `` | `` | `` | `` |
| 79 | `ciot` | `int` | YES | `` | `` | `MUL` | `` |
| 80 | `saldo` | `int` | YES | `0` | `` | `` | `` |
| 81 | `boleto_codigo_vinculo` | `bigint` | YES | `` | `` | `` | `` |
| 82 | `data_autorizacao` | `datetime` | YES | `` | `` | `` | `` |
| 83 | `operador_autorizacao` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_lancamento`, `id_centro`, `id_conta`, `id_fornecedor`, `id_unidade`, `id_conta_contra`, `id_antecipado`
- **Datas/tempos prováveis**: `data_vecto`, `vencimento_original`, `pago_data`, `dt_cancelado`, `data_incluido`, `data`, `altera_data`, `data_baixa`, `competencia`, `data_credito`, `data_enviado_cnab`, `pago_hora`, `data_aceito`, `data_abono`, `data_consc`, `data_protesto`, `data_autorizacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:47:33`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `lancamentos`
