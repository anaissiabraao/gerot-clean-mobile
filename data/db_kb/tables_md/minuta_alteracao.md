# Tabela `azportoex.minuta_alteracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_alteracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `20878`
- **Create time**: `2025-09-07T17:40:00`
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
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_minuta` | `int unsigned` | YES | `` | `` | `` | `` |
| 2 | `id_cliente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `referencia` | `varchar(20)` | NO | `` | `` | `` | `` |
| 4 | `awb` | `int` | NO | `` | `` | `` | `` |
| 5 | `tabela` | `int` | NO | `0` | `` | `` | `` |
| 6 | `servico` | `int` | NO | `` | `` | `` | `` |
| 7 | `cotacao` | `int` | NO | `` | `` | `` | `` |
| 8 | `modal` | `int` | NO | `0` | `` | `` | `` |
| 9 | `forma_transp` | `int` | NO | `2` | `` | `` | `` |
| 10 | `id_origem` | `int` | NO | `` | `` | `` | `` |
| 11 | `id_destino` | `int` | NO | `` | `` | `` | `` |
| 12 | `id_expedidor` | `int` | NO | `0` | `` | `` | `` |
| 13 | `id_entrega` | `int` | NO | `0` | `` | `` | `` |
| 14 | `id_transportadora` | `int` | NO | `` | `` | `` | `` |
| 15 | `transp_minuta` | `varchar(40)` | NO | `` | `` | `` | `` |
| 16 | `transp_custo` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 17 | `id_seguro` | `int` | NO | `` | `` | `` | `` |
| 18 | `seguro_resp` | `int` | NO | `0` | `` | `` | `` |
| 19 | `ctrc_cliente` | `varchar(40)` | NO | `` | `` | `` | `` |
| 20 | `ctrc_valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 21 | `id_armador` | `int` | NO | `` | `` | `` | `` |
| 22 | `armador_minuta` | `varchar(40)` | NO | `` | `` | `` | `` |
| 23 | `armador_custo` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 24 | `transf_origem` | `int` | NO | `0` | `` | `` | `` |
| 25 | `transf_destino` | `int` | NO | `` | `` | `` | `` |
| 26 | `ctrc` | `int` | NO | `` | `` | `` | `` |
| 27 | `ctrc_serie` | `varchar(3)` | NO | `` | `` | `` | `` |
| 28 | `fatura_id` | `int` | NO | `` | `` | `` | `` |
| 29 | `fatura_status` | `int` | NO | `0` | `` | `` | `` |
| 30 | `fat_seq` | `int` | NO | `` | `` | `` | `` |
| 31 | `obs` | `varchar(255)` | NO | `` | `` | `` | `` |
| 32 | `status` | `int` | NO | `1` | `` | `` | `` |
| 33 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 34 | `data` | `date` | NO | `` | `` | `` | `` |
| 35 | `data_saida` | `date` | NO | `` | `` | `` | `` |
| 36 | `data_prev_saida` | `date` | NO | `` | `` | `` | `` |
| 37 | `prev_entrega` | `date` | NO | `` | `` | `` | `` |
| 38 | `vol_ambiente` | `varchar(10)` | NO | `` | `` | `` | `` |
| 39 | `vol_refrigerada` | `varchar(10)` | NO | `` | `` | `` | `` |
| 40 | `vol_congelada` | `varchar(10)` | NO | `` | `` | `` | `` |
| 41 | `vol_nao` | `varchar(10)` | NO | `` | `` | `` | `` |
| 42 | `vol_combo` | `varchar(10)` | NO | `` | `` | `` | `` |
| 43 | `operador` | `int` | NO | `` | `` | `` | `` |
| 44 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 45 | `data_entrega` | `date` | NO | `` | `` | `` | `` |
| 46 | `hora_entrega` | `time` | NO | `` | `` | `` | `` |
| 47 | `entrega_nome` | `varchar(40)` | NO | `` | `` | `` | `` |
| 48 | `entrega_grau` | `varchar(20)` | NO | `` | `` | `` | `` |
| 49 | `entrega_rg` | `varchar(20)` | NO | `` | `` | `` | `` |
| 50 | `coleta_data` | `date` | NO | `` | `` | `` | `` |
| 51 | `coleta_hora` | `varchar(10)` | NO | `` | `` | `` | `` |
| 52 | `chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 53 | `total_nf` | `int` | NO | `` | `` | `` | `` |
| 54 | `total_nf_valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 55 | `total_volumes` | `varchar(15)` | NO | `` | `` | `` | `` |
| 56 | `total_peso` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 57 | `total_cubo` | `decimal(12,3)` | NO | `` | `` | `` | `` |
| 58 | `frete_minimo` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 59 | `frete_pedagio` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 60 | `frete_gris` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 61 | `frete_coleta` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 62 | `frete_outros` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 63 | `frete_peso` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 64 | `frete_nf` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 65 | `frete_adv` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 66 | `frete_redespacho` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 67 | `frete_nacional` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 68 | `frete_tad` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 69 | `frete_despacho` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 70 | `frete_taxa_imposto` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 71 | `frete_imposto` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 72 | `frete_icms_difal` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 73 | `frete_saldo` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 74 | `frete_total` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 75 | `id_manifesto` | `int` | NO | `0` | `` | `` | `` |
| 76 | `comprovante` | `varchar(255)` | NO | `` | `` | `` | `` |
| 77 | `edi_lote` | `int` | NO | `` | `` | `` | `` |
| 78 | `edi_oco_recebido` | `int` | NO | `` | `` | `` | `` |
| 79 | `edi_oco_enviado` | `int` | NO | `` | `` | `` | `` |
| 80 | `id_motorista` | `int unsigned` | NO | `` | `` | `` | `` |
| 81 | `id_terceiro` | `int unsigned` | NO | `0` | `` | `` | `` |
| 82 | `cte_numero` | `int` | NO | `0` | `` | `` | `` |
| 83 | `cte_serie` | `varchar(5)` | NO | `` | `` | `` | `` |
| 84 | `cte_cfop` | `int` | NO | `` | `` | `` | `` |
| 85 | `cte_chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 86 | `cte_dv_chave` | `varchar(10)` | NO | `` | `` | `` | `` |
| 87 | `cte_servico` | `int` | NO | `` | `` | `` | `` |
| 88 | `cte_codigo` | `int` | NO | `` | `` | `` | `` |
| 89 | `cte_data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 90 | `cte_hora` | `time` | NO | `` | `` | `` | `` |
| 91 | `cte_operador` | `int` | NO | `` | `` | `` | `` |
| 92 | `cte_status` | `int` | NO | `0` | `` | `` | `` |
| 93 | `cte_obs` | `mediumtext` | NO | `` | `` | `` | `` |
| 94 | `cte_protocolo` | `varchar(25)` | NO | `` | `` | `` | `` |
| 95 | `cte_ambiente` | `int` | NO | `` | `` | `` | `` |
| 96 | `cte_tipo_cte` | `int` | NO | `0` | `` | `` | `` |
| 97 | `cte_recibo` | `varchar(55)` | NO | `` | `` | `` | `` |
| 98 | `cte_aut_data` | `date` | NO | `` | `` | `` | `` |
| 99 | `cte_aut_hora` | `time` | NO | `` | `` | `` | `` |
| 100 | `cte_digVal` | `varchar(255)` | NO | `` | `` | `` | `` |
| 101 | `cte_arquivo_cte` | `varchar(255)` | NO | `` | `` | `` | `` |
| 102 | `cte_arquivo_cte_proc` | `varchar(255)` | NO | `` | `` | `` | `` |
| 103 | `cte_canc_prot` | `varchar(55)` | NO | `` | `` | `` | `` |
| 104 | `cte_canc_data` | `date` | NO | `` | `` | `` | `` |
| 105 | `cte_canc_hora` | `time` | NO | `00:00:00` | `` | `` | `` |
| 106 | `cte_imposto_tipo` | `int` | NO | `3` | `` | `` | `` |
| 107 | `custo_1` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 108 | `custo_2` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 109 | `custo_3` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 110 | `armador_cte` | `varchar(45)` | NO | `` | `` | `` | `` |
| 111 | `armador_cte_serie` | `varchar(45)` | NO | `` | `` | `` | `` |
| 112 | `armador_cte_id` | `int unsigned` | NO | `0` | `` | `` | `` |
| 113 | `coleta_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 114 | `coleta_resp_id` | `int unsigned` | YES | `` | `` | `` | `` |
| 115 | `coleta_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 116 | `coleta_minuta` | `varchar(25)` | YES | `` | `` | `` | `` |
| 117 | `entrega_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 118 | `entrega_resp_id` | `int unsigned` | YES | `` | `` | `` | `` |
| 119 | `entrega_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 120 | `entrega_minuta` | `varchar(25)` | YES | `` | `` | `` | `` |
| 121 | `tabela_origem` | `int unsigned` | NO | `0` | `` | `` | `` |
| 122 | `tabela_destino` | `int unsigned` | NO | `` | `` | `` | `` |
| 123 | `centro_custo` | `int unsigned` | NO | `` | `` | `` | `` |
| 124 | `prev_entrega_hora` | `varchar(5)` | NO | `` | `` | `` | `` |
| 125 | `coleta_numero` | `int unsigned` | NO | `` | `` | `` | `` |
| 126 | `minuta_comp` | `int unsigned` | NO | `` | `` | `` | `` |
| 127 | `fatura_time` | `int unsigned` | NO | `` | `` | `` | `` |
| 128 | `coleta_veiculo` | `int unsigned` | NO | `` | `` | `` | `` |
| 129 | `entrega_veiculo` | `int unsigned` | NO | `0` | `` | `` | `` |
| 130 | `entrega_fatura` | `int unsigned` | NO | `` | `` | `` | `` |
| 131 | `coleta_fatura` | `int unsigned` | NO | `` | `` | `` | `` |
| 132 | `armador_fatura` | `int unsigned` | NO | `0` | `` | `` | `` |
| 133 | `emailsAcom` | `varchar(45)` | NO | `` | `` | `` | `` |
| 134 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 135 | `autorizacao` | `varchar(10)` | NO | `` | `` | `` | `` |
| 136 | `evt_cte` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 137 | `evt_cte_cc` | `tinyint unsigned` | NO | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_minuta`, `id_cliente`, `id_origem`, `id_destino`, `id_expedidor`, `id_entrega`, `id_transportadora`, `id_seguro`, `id_armador`, `fatura_id`, `id_manifesto`, `id_motorista`, `id_terceiro`, `armador_cte_id`, `coleta_resp_id`, `entrega_resp_id`
- **Datas/tempos prováveis**: `data_incluido`, `data`, `data_saida`, `data_prev_saida`, `prev_entrega`, `data_entrega`, `hora_entrega`, `coleta_data`, `coleta_hora`, `cte_data`, `cte_hora`, `cte_aut_data`, `cte_aut_hora`, `cte_canc_data`, `cte_canc_hora`, `prev_entrega_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`, `alteracao`
