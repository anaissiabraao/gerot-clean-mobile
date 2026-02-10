# Tabela `azportoex.coleta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `coleta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `81106`
- **Create time**: `2025-09-20T18:57:30`
- **Update time**: `2025-12-17T16:50:03`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_coleta`

## Chaves estrangeiras (evidência estrutural)
- `coleta_fatura` → `fatura.id_fatura` (constraint=`fk_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `coleta_historico.coleta` → `coleta.id_coleta` (constraint=`fk_coleta_historico_coleta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `custo_diverso_coleta.coleta` → `coleta.id_coleta` (constraint=`custo_diverso_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_coleta`]
- `fk_agendamento_coleta` type=`BTREE` non_unique=`True` cols=[`agendamento_coleta`]
- `fk_coleta_fatura` type=`BTREE` non_unique=`True` cols=[`coleta_fatura`]
- `idx_coleta_data_incluido` type=`BTREE` non_unique=`True` cols=[`data_incluido`]
- `idx_coleta_data_status` type=`BTREE` non_unique=`True` cols=[`coleta_data`, `status`]
- `idx_cotacao` type=`BTREE` non_unique=`True` cols=[`cotacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_coleta` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | NO | `0` | `` | `` | `` |
| 3 | `centro_custo` | `varchar(20)` | YES | `` | `` | `` | `` |
| 4 | `tabela` | `int` | NO | `` | `` | `` | `` |
| 5 | `servico` | `int` | NO | `` | `` | `` | `` |
| 6 | `cotacao` | `int` | NO | `` | `` | `MUL` | `` |
| 7 | `modal` | `int` | NO | `` | `` | `` | `` |
| 8 | `forma_transp` | `int` | NO | `2` | `` | `` | `` |
| 9 | `id_origem` | `int` | NO | `` | `` | `` | `` |
| 10 | `id_destino` | `int` | NO | `` | `` | `` | `` |
| 11 | `transf_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 12 | `transf_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 13 | `cia_transf` | `int` | YES | `0` | `` | `` | `` |
| 14 | `cia_servico` | `int` | YES | `0` | `` | `` | `` |
| 15 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 16 | `status` | `int` | NO | `1` | `` | `` | `` |
| 17 | `data_incluido` | `date` | NO | `` | `` | `MUL` | `` |
| 18 | `data` | `date` | NO | `` | `` | `` | `` |
| 19 | `operador` | `int` | NO | `` | `` | `` | `` |
| 20 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 21 | `coleta_data` | `date` | NO | `` | `` | `MUL` | `` |
| 22 | `coleta_hora` | `time` | NO | `` | `` | `` | `` |
| 23 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 24 | `total_nf` | `int` | NO | `` | `` | `` | `` |
| 25 | `total_nf_valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 26 | `total_volumes` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 27 | `total_peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 28 | `total_cubo` | `decimal(12,3)` | NO | `` | `` | `` | `` |
| 29 | `total_taxado` | `decimal(12,3)` | YES | `` | `` | `` | `` |
| 30 | `cubagem_aereo` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 31 | `cubagem_rodoviario` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 32 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 33 | `memo_app` | `mediumtext` | YES | `` | `` | `` | `` |
| 34 | `notas` | `varchar(55)` | YES | `` | `` | `` | `` |
| 35 | `solicitante` | `varchar(60)` | YES | `` | `` | `` | `` |
| 36 | `telefone` | `varchar(45)` | YES | `` | `` | `` | `` |
| 37 | `tipo_frequencia` | `int unsigned` | NO | `` | `` | `` | `` |
| 38 | `frequencia_1` | `varchar(1)` | YES | `` | `` | `` | `` |
| 39 | `frequencia_2` | `varchar(1)` | YES | `` | `` | `` | `` |
| 40 | `frequencia_3` | `varchar(1)` | YES | `` | `` | `` | `` |
| 41 | `frequencia_4` | `varchar(1)` | YES | `` | `` | `` | `` |
| 42 | `frequencia_5` | `varchar(1)` | YES | `` | `` | `` | `` |
| 43 | `frequencia_6` | `varchar(1)` | YES | `` | `` | `` | `` |
| 44 | `frequencia_7` | `varchar(1)` | YES | `` | `` | `` | `` |
| 45 | `frequencia_0` | `varchar(1)` | YES | `` | `` | `` | `` |
| 46 | `frequencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 47 | `resp_frete` | `int unsigned` | NO | `1` | `` | `` | `` |
| 48 | `coleta_hora_de` | `time` | NO | `` | `` | `` | `` |
| 49 | `coleta_resp` | `int` | NO | `` | `` | `` | `` |
| 50 | `coleta_resp_id` | `int` | NO | `` | `` | `` | `` |
| 51 | `coleta_resp_servico` | `int` | YES | `0` | `` | `` | `` |
| 52 | `coleta_veiculo` | `int unsigned` | YES | `` | `` | `` | `` |
| 53 | `coleta_custo` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 54 | `coletado_data` | `date` | YES | `` | `` | `` | `` |
| 55 | `coletado_hora` | `varchar(9)` | YES | `` | `` | `` | `` |
| 56 | `coletaEmails` | `varchar(45)` | NO | `` | `` | `` | `` |
| 57 | `entrega_data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 58 | `entrega_hora` | `varchar(5)` | NO | `` | `` | `` | `` |
| 59 | `seguro_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 60 | `id_seguro` | `int unsigned` | NO | `0` | `` | `` | `` |
| 61 | `autorizacao` | `varchar(250)` | YES | `` | `` | `` | `` |
| 62 | `tipo_pagamento` | `smallint` | NO | `2` | `` | `` | `` |
| 63 | `re_contato` | `varchar(35)` | YES | `` | `` | `` | `` |
| 64 | `house` | `int` | NO | `` | `` | `` | `` |
| 65 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 66 | `entrega_resp` | `int` | YES | `` | `` | `` | `` |
| 67 | `entrega_resp_id` | `int` | YES | `` | `` | `` | `` |
| 68 | `entrega_resp_servico` | `int` | YES | `0` | `` | `` | `` |
| 69 | `entrega_veiculo` | `int` | YES | `` | `` | `` | `` |
| 70 | `entrega_custo` | `decimal(13,2)` | NO | `0.00` | `` | `` | `` |
| 71 | `agendamento_coleta` | `int` | YES | `` | `` | `MUL` | `` |
| 72 | `coleta_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 73 | `coleta_minuta` | `varchar(15)` | YES | `` | `` | `` | `` |
| 74 | `id_minuta` | `int` | NO | `` | `` | `` | `` |
| 75 | `documento` | `int` | NO | `` | `` | `` | `` |
| 76 | `motorista` | `int` | NO | `` | `` | `` | `` |
| 77 | `hora` | `time` | NO | `` | `` | `` | `` |
| 78 | `comissao` | `int` | YES | `0` | `` | `` | `` |
| 79 | `entrega_agendada` | `tinyint` | YES | `0` | `` | `` | `` |
| 80 | `coleta_custo_novo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 81 | `id_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 82 | `id_entrega` | `int` | YES | `0` | `` | `` | `` |
| 83 | `id_endereco_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 84 | `id_endereco_entrega` | `int` | YES | `0` | `` | `` | `` |
| 85 | `km_rodado` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 86 | `data_limite` | `date` | YES | `` | `` | `` | `` |
| 87 | `coleta_motorista` | `int` | YES | `` | `` | `` | `` |
| 88 | `entrega_motorista` | `int` | YES | `` | `` | `` | `` |
| 89 | `dias_entrega` | `int` | YES | `` | `` | `` | `` |
| 90 | `ordem_servico` | `varchar(255)` | YES | `` | `` | `` | `` |
| 91 | `valor_total_notas` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 92 | `valor_total_produto` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 93 | `tipo_valor_nota` | `tinyint` | YES | `0` | `` | `` | `` |
| 94 | `coleta_taxa_emergencia` | `tinyint` | YES | `` | `` | `` | `` |
| 95 | `entrega_taxa_emergencia` | `tinyint` | YES | `` | `` | `` | `` |
| 96 | `alterado_por` | `int` | YES | `` | `` | `` | `` |
| 97 | `metragem_cubica` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 98 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 99 | `data_agendada` | `date` | YES | `` | `` | `` | `` |
| 100 | `agenda_hora_inicio` | `time` | YES | `` | `` | `` | `` |
| 101 | `agenda_hora_fim` | `time` | YES | `` | `` | `` | `` |
| 102 | `perecivel` | `tinyint` | YES | `` | `` | `` | `` |
| 103 | `negocia_manual` | `tinyint` | YES | `0` | `` | `` | `` |
| 104 | `previsao_chegada_data` | `date` | YES | `` | `` | `` | `` |
| 105 | `previsao_chegada_hora` | `time` | YES | `` | `` | `` | `` |
| 106 | `agendamento` | `tinyint` | YES | `` | `` | `` | `` |
| 107 | `tipoColeta` | `int` | YES | `1` | `` | `` | `` |
| 108 | `seg_valor` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 109 | `averbacao` | `varchar(50)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_coleta`, `id_cliente`, `id_origem`, `id_destino`, `coleta_resp_id`, `id_seguro`, `entrega_resp_id`, `id_minuta`, `id_expedidor`, `id_entrega`, `id_endereco_expedidor`, `id_endereco_entrega`
- **Datas/tempos prováveis**: `data_incluido`, `data`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `coletado_data`, `coletado_hora`, `entrega_data`, `entrega_hora`, `hora`, `data_limite`, `updated_at`, `data_agendada`, `agenda_hora_inicio`, `agenda_hora_fim`, `previsao_chegada_data`, `previsao_chegada_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:03`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `coleta`
