# Tabela `azportoex.minuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `218380`
- **Create time**: `2025-09-20T18:57:28`
- **Update time**: `2025-12-17T16:50:27`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_minuta`

## Chaves estrangeiras (evidência estrutural)
- `coleta_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `despacho_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `despacho_fatura_retira` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura_retira`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `entrega_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_entrega_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `seguro_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_seguro_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `alteracoes_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_alteracoes_minuta_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_protocolos.id_minuta` → `minuta.id_minuta` (constraint=`averbacao_protocolos_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cte_anulacao.id_minuta` → `minuta.id_minuta` (constraint=`cte_anulacao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cte_simplificado.minuta_base` → `minuta.id_minuta` (constraint=`cte_simplificado_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cte_simplificado.minuta_gerada` → `minuta.id_minuta` (constraint=`cte_simplificado_minuta_id_minuta_fk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cte_substituicao.id_minuta` → `minuta.id_minuta` (constraint=`cte_substituicao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `frete_hist.frete` → `minuta.id_minuta` (constraint=`fk_frete_hist_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `gnre_guias.id_minuta` → `minuta.id_minuta` (constraint=`id_fk_gnre_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta_campos_extras.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_campos_extras`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_id_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_custos_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minutas_lote.minuta` → `minuta.id_minuta` (constraint=`id_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `palavra_chave_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_palavra_chave_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `performance_app_minuta.id_minuta` → `minuta.id_minuta` (constraint=`fk_performance_app_minuta_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_minuta`]
- `fk_minuta_coleta_fatura` type=`BTREE` non_unique=`True` cols=[`coleta_fatura`]
- `fk_minuta_despacho_fatura` type=`BTREE` non_unique=`True` cols=[`despacho_fatura`]
- `fk_minuta_despacho_fatura_retira` type=`BTREE` non_unique=`True` cols=[`despacho_fatura_retira`]
- `fk_minuta_entrega_fatura` type=`BTREE` non_unique=`True` cols=[`entrega_fatura`]
- `fk_minuta_seguro_fatura` type=`BTREE` non_unique=`True` cols=[`seguro_fatura`]
- `idx_autorizacao` type=`BTREE` non_unique=`True` cols=[`autorizacao`]
- `idx_awb` type=`BTREE` non_unique=`True` cols=[`armador_cte_id`]
- `idx_coleta_info` type=`BTREE` non_unique=`True` cols=[`coleta_resp`, `coleta_resp_id`]
- `idx_coleta_numero` type=`BTREE` non_unique=`True` cols=[`coleta_numero`]
- `idx_cotacao` type=`BTREE` non_unique=`True` cols=[`cotacao`]
- `idx_cte_aut_data` type=`BTREE` non_unique=`True` cols=[`cte_aut_data`]
- `idx_cte_chave` type=`BTREE` non_unique=`True` cols=[`cte_chave`]
- `idx_cte_numero` type=`BTREE` non_unique=`True` cols=[`cte_numero`]
- `idx_entrega_info` type=`BTREE` non_unique=`True` cols=[`entrega_resp`, `entrega_resp_id`]
- `idx_house` type=`BTREE` non_unique=`True` cols=[`house`]
- `idx_id_cliente` type=`BTREE` non_unique=`True` cols=[`id_cliente`]
- `idx_id_manifesto` type=`BTREE` non_unique=`True` cols=[`id_manifesto`]
- `idx_minuta_chave` type=`BTREE` non_unique=`True` cols=[`chave`]
- `idx_minuta_comp` type=`BTREE` non_unique=`True` cols=[`minuta_comp`]
- `idx_minuta_data` type=`BTREE` non_unique=`True` cols=[`data`]
- `idx_minuta_fatura_id` type=`BTREE` non_unique=`True` cols=[`fatura_id`]
- `idx_minuta_id_destino` type=`BTREE` non_unique=`True` cols=[`id_destino`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_minuta` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo_emissao` | `tinyint` | YES | `1` | `` | `` | `` |
| 3 | `id_cliente` | `int` | NO | `0` | `` | `MUL` | `` |
| 4 | `referencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 5 | `awb` | `int` | YES | `` | `` | `` | `` |
| 6 | `tabela` | `int` | YES | `` | `` | `` | `` |
| 7 | `servico` | `int` | NO | `` | `` | `` | `` |
| 8 | `cotacao` | `int` | YES | `` | `` | `MUL` | `` |
| 9 | `modal` | `int` | YES | `` | `` | `` | `` |
| 10 | `forma_transp` | `int` | NO | `2` | `` | `` | `` |
| 11 | `id_origem` | `int` | YES | `` | `` | `` | `` |
| 12 | `id_destino` | `int` | NO | `` | `` | `MUL` | `` |
| 13 | `id_expedidor` | `int` | YES | `` | `` | `` | `` |
| 14 | `id_entrega` | `int` | YES | `` | `` | `` | `` |
| 15 | `id_transportadora` | `int` | YES | `` | `` | `` | `` |
| 16 | `transp_minuta` | `varchar(40)` | YES | `` | `` | `` | `` |
| 17 | `transp_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 18 | `id_seguro` | `int` | YES | `` | `` | `` | `` |
| 19 | `seg_valor` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 20 | `seguro_resp` | `int` | NO | `0` | `` | `` | `` |
| 21 | `ctrc_cliente` | `varchar(45)` | YES | `` | `` | `` | `` |
| 22 | `ctrc_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 23 | `id_armador` | `int` | YES | `` | `` | `` | `` |
| 24 | `armador_minuta` | `varchar(40)` | YES | `` | `` | `` | `` |
| 25 | `armador_custo` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 26 | `transf_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 27 | `transf_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 28 | `ctrc` | `int` | YES | `` | `` | `` | `` |
| 29 | `ctrc_serie` | `varchar(3)` | YES | `` | `` | `` | `` |
| 30 | `fatura_id` | `int` | YES | `` | `` | `MUL` | `` |
| 31 | `fatura_status` | `int` | NO | `0` | `` | `` | `` |
| 32 | `fat_seq` | `int` | YES | `0` | `` | `` | `` |
| 33 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 34 | `status` | `int` | NO | `1` | `` | `` | `` |
| 35 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 36 | `data` | `date` | NO | `` | `` | `MUL` | `` |
| 37 | `data_saida` | `date` | YES | `` | `` | `` | `` |
| 38 | `data_prev_saida` | `date` | YES | `` | `` | `` | `` |
| 39 | `prev_entrega` | `date` | YES | `` | `` | `` | `` |
| 40 | `vol_ambiente` | `varchar(10)` | YES | `` | `` | `` | `` |
| 41 | `vol_refrigerada` | `varchar(10)` | YES | `` | `` | `` | `` |
| 42 | `vol_congelada` | `varchar(10)` | YES | `` | `` | `` | `` |
| 43 | `vol_nao` | `varchar(10)` | YES | `` | `` | `` | `` |
| 44 | `vol_combo` | `varchar(10)` | YES | `` | `` | `` | `` |
| 45 | `vol_gelo_seco` | `smallint` | YES | `` | `` | `` | `` |
| 46 | `operador` | `int` | NO | `` | `` | `` | `` |
| 47 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 48 | `data_entrega` | `date` | YES | `` | `` | `` | `` |
| 49 | `hora_entrega` | `time` | YES | `` | `` | `` | `` |
| 50 | `entrega_nome` | `varchar(40)` | YES | `` | `` | `` | `` |
| 51 | `entrega_grau` | `varchar(20)` | YES | `` | `` | `` | `` |
| 52 | `entrega_rg` | `varchar(20)` | YES | `` | `` | `` | `` |
| 53 | `coleta_data` | `date` | YES | `` | `` | `` | `` |
| 54 | `coleta_hora` | `varchar(10)` | YES | `` | `` | `` | `` |
| 55 | `chave` | `varchar(35)` | YES | `` | `` | `MUL` | `` |
| 56 | `total_nf` | `int` | YES | `0` | `` | `` | `` |
| 57 | `total_nf_valor` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 58 | `valor_unitario` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 59 | `total_volumes` | `int` | YES | `0` | `` | `` | `` |
| 60 | `total_peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 61 | `total_cubo` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 62 | `cubagem_aereo` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 63 | `cubagem_rodoviario` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 64 | `frete_minimo` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 65 | `frete_pedagio` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 66 | `frete_gris` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 67 | `frete_coleta` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 68 | `frete_outros` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 69 | `frete_peso` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 70 | `frete_nf` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 71 | `frete_adv` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 72 | `frete_tas` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 73 | `frete_tde` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 74 | `frete_cat` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 75 | `frete_trt` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 76 | `frete_redespacho` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 77 | `frete_nacional` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 78 | `frete_tad` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 79 | `frete_despacho` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 80 | `frete_taxa_imposto` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 81 | `frete_taxa_fcp` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 82 | `frete_imposto` | `decimal(12,3)` | YES | `` | `` | `` | `` |
| 83 | `frete_icms_difal` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 84 | `frete_icms_st` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 85 | `reducao_bc` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 86 | `tipo_icms` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 87 | `frete_saldo` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 88 | `frete_total` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 89 | `vtprest` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 90 | `frete_desconto` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 91 | `id_manifesto` | `int` | NO | `0` | `` | `MUL` | `` |
| 92 | `comprovante` | `varchar(255)` | YES | `0.00` | `` | `` | `` |
| 93 | `edi_lote` | `int` | YES | `` | `` | `` | `` |
| 94 | `edi_oco_recebido` | `int` | YES | `` | `` | `` | `` |
| 95 | `edi_notfis_enviado` | `int` | YES | `0` | `` | `` | `` |
| 96 | `id_motorista` | `int unsigned` | YES | `` | `` | `` | `` |
| 97 | `id_terceiro` | `int unsigned` | YES | `` | `` | `` | `` |
| 98 | `cte_numero` | `int` | NO | `0` | `` | `MUL` | `` |
| 99 | `cte_unidade` | `int` | NO | `5` | `` | `` | `` |
| 100 | `cte_serie` | `varchar(5)` | YES | `` | `` | `` | `` |
| 101 | `cte_cfop` | `int` | YES | `` | `` | `` | `` |
| 102 | `cte_chave` | `varchar(255)` | YES | `` | `` | `MUL` | `` |
| 103 | `cte_dv_chave` | `varchar(10)` | YES | `` | `` | `` | `` |
| 104 | `cte_servico` | `int` | YES | `` | `` | `` | `` |
| 105 | `cte_codigo` | `int` | YES | `` | `` | `` | `` |
| 106 | `cte_data` | `date` | YES | `` | `` | `` | `` |
| 107 | `cte_hora` | `time` | YES | `` | `` | `` | `` |
| 108 | `cte_operador` | `int` | YES | `` | `` | `` | `` |
| 109 | `cte_status` | `int` | NO | `0` | `` | `` | `` |
| 110 | `cte_obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 111 | `cte_protocolo` | `varchar(25)` | YES | `` | `` | `` | `` |
| 112 | `cte_ambiente` | `int` | YES | `` | `` | `` | `` |
| 113 | `cte_tipo_cte` | `int` | NO | `0` | `` | `` | `` |
| 114 | `cte_recibo` | `varchar(55)` | YES | `` | `` | `` | `` |
| 115 | `cte_aut_data` | `date` | YES | `` | `` | `MUL` | `` |
| 116 | `cte_aut_hora` | `time` | YES | `` | `` | `` | `` |
| 117 | `cte_digVal` | `varchar(255)` | YES | `` | `` | `` | `` |
| 118 | `cte_arquivo_cte` | `varchar(255)` | YES | `` | `` | `` | `` |
| 119 | `cte_arquivo_cte_proc` | `varchar(255)` | YES | `` | `` | `` | `` |
| 120 | `cte_canc_prot` | `varchar(55)` | YES | `` | `` | `` | `` |
| 121 | `cte_canc_data` | `date` | YES | `` | `` | `` | `` |
| 122 | `cte_canc_hora` | `time` | YES | `` | `` | `` | `` |
| 123 | `cte_canc_motivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 124 | `cte_imposto_tipo` | `int` | NO | `3` | `` | `` | `` |
| 125 | `seguro_rcfdc` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 126 | `seguro_rctrc` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 127 | `seguro_rctac` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 128 | `armador_cte` | `varchar(45)` | YES | `` | `` | `` | `` |
| 129 | `armador_cte_serie` | `varchar(45)` | YES | `` | `` | `` | `` |
| 130 | `armador_cte_id` | `int` | YES | `` | `` | `MUL` | `` |
| 131 | `coleta_resp` | `int` | YES | `` | `` | `MUL` | `` |
| 132 | `coleta_resp_id` | `int` | YES | `` | `` | `` | `` |
| 133 | `coleta_resp_servico` | `int` | YES | `0` | `` | `` | `` |
| 134 | `coleta_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 135 | `coleta_minuta` | `varchar(25)` | YES | `` | `` | `` | `` |
| 136 | `entrega_resp` | `int` | YES | `` | `` | `MUL` | `` |
| 137 | `entrega_resp_id` | `int` | YES | `` | `` | `` | `` |
| 138 | `entrega_resp_servico` | `int` | YES | `0` | `` | `` | `` |
| 139 | `entrega_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 140 | `entrega_minuta` | `varchar(25)` | YES | `` | `` | `` | `` |
| 141 | `tabela_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 142 | `tabela_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 143 | `centro_custo` | `int unsigned` | YES | `` | `` | `` | `` |
| 144 | `prev_entrega_hora` | `time` | YES | `` | `` | `` | `` |
| 145 | `coleta_numero` | `int unsigned` | YES | `` | `` | `MUL` | `` |
| 146 | `pre_embarque` | `int` | YES | `` | `` | `` | `` |
| 147 | `minuta_comp` | `int` | YES | `` | `` | `MUL` | `` |
| 148 | `fatura_time` | `int unsigned` | YES | `` | `` | `` | `` |
| 149 | `coleta_veiculo` | `int unsigned` | YES | `` | `` | `` | `` |
| 150 | `entrega_veiculo` | `int unsigned` | YES | `` | `` | `` | `` |
| 151 | `entrega_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 152 | `seguro_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 153 | `coleta_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 154 | `armador_fatura` | `int` | YES | `0` | `` | `` | `` |
| 155 | `emailsAcom` | `varchar(45)` | YES | `` | `` | `` | `` |
| 156 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 157 | `autorizacao` | `varchar(255)` | YES | `` | `` | `MUL` | `` |
| 158 | `tipo_pagamento` | `tinyint` | YES | `2` | `` | `` | `` |
| 159 | `house` | `varchar(20)` | YES | `` | `` | `MUL` | `` |
| 160 | `evt_cte` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 161 | `evt_cte_cc` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 162 | `cte_ref` | `varchar(45)` | YES | `` | `` | `` | `` |
| 163 | `comissao` | `int` | YES | `0` | `` | `` | `` |
| 164 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 165 | `id_entrega_endereco` | `int` | YES | `` | `` | `` | `` |
| 166 | `valorKGFaixa` | `decimal(7,3)` | YES | `` | `` | `` | `` |
| 167 | `data_hora` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 168 | `perecivel` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 169 | `entrega_taxa_emergencia` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 170 | `coleta_taxa_emergencia` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 171 | `transf_conexao` | `int` | YES | `` | `` | `` | `` |
| 172 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 173 | `cortesia` | `varchar(255)` | YES | `` | `` | `` | `` |
| 174 | `contatoOri` | `varchar(45)` | YES | `` | `` | `` | `` |
| 175 | `contatoDes` | `varchar(45)` | YES | `` | `` | `` | `` |
| 176 | `alterado_por` | `int` | YES | `0` | `` | `` | `` |
| 177 | `incentivo_suframa` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 178 | `difal` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 179 | `despacho_resp` | `tinyint` | YES | `` | `` | `` | `` |
| 180 | `despacho_resp_id` | `int` | YES | `` | `` | `` | `` |
| 181 | `despacho_resp_servico` | `int` | YES | `0` | `` | `` | `` |
| 182 | `despacho_custo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 183 | `despacho_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 184 | `id_expedidor_endereco` | `int` | YES | `` | `` | `` | `` |
| 185 | `id_nfse` | `int` | YES | `` | `` | `` | `` |
| 186 | `entrega_agendada` | `tinyint` | YES | `0` | `` | `` | `` |
| 187 | `agenda_data` | `date` | YES | `` | `` | `` | `` |
| 188 | `agenda_hora_inicio` | `time` | YES | `` | `` | `` | `` |
| 189 | `agenda_hora_fim` | `time` | YES | `` | `` | `` | `` |
| 190 | `faixa_kg` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 191 | `prev_saida_hora` | `time` | YES | `` | `` | `` | `` |
| 192 | `entrega_custo_novo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 193 | `coleta_custo_novo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 194 | `despacho_custo_novo` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 195 | `despacho_minuta` | `varchar(25)` | YES | `` | `` | `` | `` |
| 196 | `impostos` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 197 | `tabela_taxa_emergencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 198 | `averbacao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 199 | `frete_manual` | `tinyint` | YES | `` | `` | `` | `` |
| 200 | `km_rodado` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 201 | `coleta_motorista` | `int` | YES | `` | `` | `` | `` |
| 202 | `entrega_motorista` | `int` | YES | `` | `` | `` | `` |
| 203 | `despacho_motorista` | `int` | YES | `` | `` | `` | `` |
| 204 | `minuta_anterior` | `int` | YES | `` | `` | `` | `` |
| 205 | `dias_entrega` | `int` | YES | `` | `` | `` | `` |
| 206 | `ineficiencia` | `smallint` | YES | `` | `` | `` | `` |
| 207 | `prazo_congelado` | `tinyint` | YES | `0` | `` | `` | `` |
| 208 | `frete_acrescimo` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 209 | `ordem_servico` | `varchar(255)` | YES | `` | `` | `` | `` |
| 210 | `valor_total_notas` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 211 | `valor_total_produto` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 212 | `tipo_valor_nota` | `tinyint` | YES | `0` | `` | `` | `` |
| 213 | `origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 214 | `destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 215 | `id_campanha` | `int` | YES | `` | `` | `` | `` |
| 216 | `cod_trecho` | `int` | YES | `` | `` | `` | `` |
| 217 | `perecivel_data` | `date` | YES | `` | `` | `` | `` |
| 218 | `perecivel_hora` | `time` | YES | `` | `` | `` | `` |
| 219 | `metragem_cubica` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 220 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 221 | `total_taxado` | `decimal(10,4)` | YES | `0.0000` | `` | `` | `` |
| 222 | `re_kmcapital` | `smallint` | YES | `` | `` | `` | `` |
| 223 | `des_kmcapital` | `smallint` | YES | `` | `` | `` | `` |
| 224 | `negocia_manual` | `tinyint` | YES | `0` | `` | `` | `` |
| 225 | `despacho_resp_retira` | `tinyint` | YES | `` | `` | `` | `` |
| 226 | `despacho_resp_id_retira` | `int` | YES | `` | `` | `` | `` |
| 227 | `despacho_resp_servico_retira` | `int` | YES | `` | `` | `` | `` |
| 228 | `despacho_custo_retira` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 229 | `despacho_motorista_retira` | `int` | YES | `` | `` | `` | `` |
| 230 | `despacho_fatura_retira` | `int` | YES | `` | `` | `MUL` | `` |
| 231 | `despacho_minuta_retira` | `varchar(25)` | YES | `` | `` | `` | `` |
| 232 | `rota` | `int` | YES | `` | `` | `` | `` |
| 233 | `gerenciamentoAWB` | `varchar(11)` | YES | `` | `` | `` | `` |
| 234 | `insc_estadual` | `varchar(15)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_minuta`, `id_cliente`, `id_origem`, `id_destino`, `id_expedidor`, `id_entrega`, `id_transportadora`, `id_seguro`, `id_armador`, `fatura_id`, `id_manifesto`, `id_motorista`, `id_terceiro`, `armador_cte_id`, `coleta_resp_id`, `entrega_resp_id`, `id_entrega_endereco`, `despacho_resp_id`, `id_expedidor_endereco`, `id_nfse`, `id_campanha`
- **Datas/tempos prováveis**: `tipo_emissao`, `data_incluido`, `data`, `data_saida`, `data_prev_saida`, `prev_entrega`, `data_entrega`, `hora_entrega`, `coleta_data`, `coleta_hora`, `cte_data`, `cte_hora`, `cte_aut_data`, `cte_aut_hora`, `cte_canc_data`, `cte_canc_hora`, `prev_entrega_hora`, `data_hora`, `agenda_data`, `agenda_hora_inicio`, `agenda_hora_fim`, `prev_saida_hora`, `perecivel_data`, `perecivel_hora`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:27`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`
