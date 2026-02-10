# Tabela `azportoex.cotacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cotacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `81650`
- **Create time**: `2025-09-07T17:37:20`
- **Update time**: `2025-12-17T16:47:56`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_cotacao`

## Chaves estrangeiras (evidência estrutural)
- `id_cliente` → `fornecedores.id_local` (constraint=`fk_id_cliente_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `cotacao_hist.cotacao` → `cotacao.id_cotacao` (constraint=`fk_cotacao_hist_cotacao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `lote_cotacao.id_cotacao` → `cotacao.id_cotacao` (constraint=`fk_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_cotacao`]
- `fk_id_cliente_cotacao` type=`BTREE` non_unique=`True` cols=[`id_cliente`]
- `id_tabela_destino` type=`BTREE` non_unique=`True` cols=[`tabela_destino`]
- `id_tabela_origem` type=`BTREE` non_unique=`True` cols=[`tabela_origem`]
- `idx_cotacao_emissao` type=`BTREE` non_unique=`True` cols=[`data_incluido`]
- `idx_operador` type=`BTREE` non_unique=`True` cols=[`operador`]
- `idx_servico` type=`BTREE` non_unique=`True` cols=[`servico`]
- `idx_transf_destino` type=`BTREE` non_unique=`True` cols=[`transf_destino`]
- `idx_transf_origem` type=`BTREE` non_unique=`True` cols=[`transf_origem`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_cotacao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | NO | `0` | `` | `MUL` | `` |
| 3 | `referencia` | `varchar(25)` | YES | `` | `` | `` | `` |
| 4 | `tabela` | `int` | NO | `` | `` | `` | `` |
| 5 | `servico` | `int` | NO | `` | `` | `MUL` | `` |
| 6 | `id_origem` | `varchar(11)` | NO | `` | `` | `` | `` |
| 7 | `id_destino` | `varchar(11)` | NO | `` | `` | `` | `` |
| 8 | `id_seguro` | `int` | NO | `` | `` | `` | `` |
| 9 | `seguro_resp` | `int` | NO | `0` | `` | `` | `` |
| 10 | `transf_origem` | `varchar(11)` | NO | `` | `` | `MUL` | `` |
| 11 | `transf_destino` | `varchar(11)` | NO | `` | `` | `MUL` | `` |
| 12 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 13 | `status` | `int` | NO | `1` | `` | `` | `` |
| 14 | `data_incluido` | `date` | NO | `` | `` | `MUL` | `` |
| 15 | `data` | `date` | NO | `` | `` | `` | `` |
| 16 | `data_prazo` | `date` | NO | `` | `` | `` | `` |
| 17 | `prev_entrega` | `date` | NO | `` | `` | `` | `` |
| 18 | `operador` | `int` | NO | `` | `` | `MUL` | `` |
| 19 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 20 | `coleta_data` | `date` | NO | `` | `` | `` | `` |
| 21 | `coleta_hora` | `varchar(10)` | NO | `` | `` | `` | `` |
| 22 | `coleta_hora_de` | `varchar(10)` | YES | `` | `` | `` | `` |
| 23 | `total_nf` | `int` | NO | `` | `` | `` | `` |
| 24 | `total_nf_valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 25 | `total_volumes` | `varchar(15)` | NO | `` | `` | `` | `` |
| 26 | `total_peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 27 | `total_cubo` | `decimal(12,3)` | NO | `` | `` | `` | `` |
| 28 | `frete_minimo` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 29 | `frete_pedagio` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 30 | `frete_gris` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 31 | `frete_coleta` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 32 | `frete_outros` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 33 | `frete_peso` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 34 | `frete_nf` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 35 | `frete_adv` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 36 | `frete_tas` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 37 | `frete_tde` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 38 | `frete_cat` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 39 | `frete_trt` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 40 | `frete_redespacho` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 41 | `frete_nacional` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 42 | `frete_tad` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 43 | `frete_despacho` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 44 | `frete_taxa_imposto` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 45 | `frete_taxa_fcp` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 46 | `frete_imposto` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 47 | `reducao_bc` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 48 | `frete_icms_difal` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 49 | `frete_saldo` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 50 | `frete_total` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 51 | `tabela_origem` | `varchar(11)` | YES | `` | `` | `MUL` | `` |
| 52 | `tabela_destino` | `varchar(11)` | YES | `` | `` | `MUL` | `` |
| 53 | `centro_custo` | `int unsigned` | NO | `` | `` | `` | `` |
| 54 | `prev_entrega_hora` | `varchar(5)` | NO | `` | `` | `` | `` |
| 55 | `solicitante` | `varchar(45)` | NO | `` | `` | `` | `` |
| 56 | `solicitante_email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 57 | `cliente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 58 | `nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 59 | `telefone` | `varchar(45)` | YES | `` | `` | `` | `` |
| 60 | `origemCidade` | `varchar(11)` | NO | `0` | `` | `` | `` |
| 61 | `destinoCidade` | `varchar(11)` | NO | `0` | `` | `` | `` |
| 62 | `totalPeso` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 63 | `totalCubo` | `decimal(12,3)` | NO | `0.000` | `` | `` | `` |
| 64 | `totalTaxado` | `decimal(12,3)` | YES | `` | `` | `` | `` |
| 65 | `cubagem_aereo` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 66 | `cubagem_rodoviario` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 67 | `TotalNotas` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 68 | `notas_fiscais` | `varchar(45)` | YES | `` | `` | `` | `` |
| 69 | `mercadoria` | `int unsigned` | NO | `0` | `` | `` | `` |
| 70 | `prev_entrega_data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 71 | `coleta_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 72 | `coleta_resp_id` | `int unsigned` | NO | `0` | `` | `` | `` |
| 73 | `coleta_custo` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 74 | `entrega_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 75 | `entrega_resp_id` | `int unsigned` | NO | `0` | `` | `` | `` |
| 76 | `entrega_custo` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 77 | `transf_resp` | `int` | YES | `` | `` | `` | `` |
| 78 | `transf_custo` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 79 | `custo_diverso` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 80 | `frete_entrega` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 81 | `frete_advalorem` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 82 | `frete_desconto` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 83 | `frete_margem` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 84 | `validade` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 85 | `ordemCompra` | `varchar(250)` | YES | `` | `` | `` | `` |
| 86 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 87 | `hora_incluido` | `time` | NO | `00:00:00` | `` | `` | `` |
| 88 | `emailAcom` | `varchar(255)` | YES | `` | `` | `` | `` |
| 89 | `totalVolumes` | `int unsigned` | NO | `0` | `` | `` | `` |
| 90 | `calculoImposto` | `int` | YES | `` | `` | `` | `` |
| 91 | `percentAdvalorem` | `decimal(12,3)` | YES | `` | `` | `` | `` |
| 92 | `cte_imposto_tipo` | `int` | NO | `0` | `` | `` | `` |
| 93 | `cte_cfop` | `int` | NO | `0` | `` | `` | `` |
| 94 | `tipo_pagamento` | `int` | YES | `` | `` | `` | `` |
| 95 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 96 | `desconto_limite` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 97 | `motivo` | `varchar(100)` | YES | `` | `` | `` | `` |
| 98 | `percentual_desc` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 99 | `frete_aliquota_original` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 100 | `tipo_icms` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 101 | `id_empresa` | `int` | YES | `0` | `` | `` | `` |
| 102 | `alterado_por` | `int` | YES | `0` | `` | `` | `` |
| 103 | `coleta_veiculo` | `int unsigned` | NO | `` | `` | `` | `` |
| 104 | `entrega_veiculo` | `int unsigned` | NO | `` | `` | `` | `` |
| 105 | `transf_servico` | `int unsigned` | NO | `` | `` | `` | `` |
| 106 | `id` | `int unsigned` | YES | `` | `` | `` | `` |
| 107 | `comissao` | `int` | YES | `0` | `` | `` | `` |
| 108 | `awb` | `int` | NO | `` | `` | `` | `` |
| 109 | `cotacao` | `int` | NO | `` | `` | `` | `` |
| 110 | `modal` | `int` | NO | `` | `` | `` | `` |
| 111 | `forma_transp` | `int` | NO | `` | `` | `` | `` |
| 112 | `id_expedidor` | `int` | NO | `` | `` | `` | `` |
| 113 | `id_entrega` | `int` | NO | `` | `` | `` | `` |
| 114 | `id_transportadora` | `int` | NO | `` | `` | `` | `` |
| 115 | `transp_minuta` | `varchar(40)` | NO | `` | `` | `` | `` |
| 116 | `transp_custo` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 117 | `ctrc_cliente` | `varchar(40)` | NO | `` | `` | `` | `` |
| 118 | `ctrc_valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 119 | `id_armador` | `int` | NO | `` | `` | `` | `` |
| 120 | `armador_minuta` | `varchar(40)` | NO | `` | `` | `` | `` |
| 121 | `armador_custo` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 122 | `ctrc` | `int` | NO | `` | `` | `` | `` |
| 123 | `ctrc_serie` | `varchar(3)` | NO | `` | `` | `` | `` |
| 124 | `fatura_id` | `int` | NO | `` | `` | `` | `` |
| 125 | `fatura_status` | `int` | NO | `` | `` | `` | `` |
| 126 | `fat_seq` | `int` | NO | `` | `` | `` | `` |
| 127 | `data_saida` | `date` | NO | `` | `` | `` | `` |
| 128 | `data_prev_saida` | `date` | NO | `` | `` | `` | `` |
| 129 | `vol_ambiente` | `varchar(10)` | NO | `` | `` | `` | `` |
| 130 | `vol_refrigerada` | `varchar(10)` | NO | `` | `` | `` | `` |
| 131 | `vol_congelada` | `varchar(10)` | NO | `` | `` | `` | `` |
| 132 | `vol_nao` | `varchar(10)` | NO | `` | `` | `` | `` |
| 133 | `vol_combo` | `varchar(10)` | NO | `` | `` | `` | `` |
| 134 | `data_entrega` | `date` | NO | `` | `` | `` | `` |
| 135 | `hora_entrega` | `time` | NO | `` | `` | `` | `` |
| 136 | `entrega_nome` | `varchar(40)` | NO | `` | `` | `` | `` |
| 137 | `entrega_grau` | `varchar(20)` | NO | `` | `` | `` | `` |
| 138 | `entrega_rg` | `varchar(20)` | NO | `` | `` | `` | `` |
| 139 | `chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 140 | `edi_lote` | `int` | NO | `` | `` | `` | `` |
| 141 | `edi_oco_recebido` | `int` | NO | `` | `` | `` | `` |
| 142 | `edi_oco_enviado` | `int` | NO | `` | `` | `` | `` |
| 143 | `id_motorista` | `int unsigned` | NO | `` | `` | `` | `` |
| 144 | `id_terceiro` | `int unsigned` | NO | `` | `` | `` | `` |
| 145 | `motivo_coleta` | `varchar(100)` | YES | `` | `` | `` | `` |
| 146 | `motivo_entrega` | `varchar(100)` | YES | `` | `` | `` | `` |
| 147 | `taxa_emergencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 148 | `tx_emergencia_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 149 | `tx_emergencia_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 150 | `entrega_agendada` | `tinyint` | YES | `0` | `` | `` | `` |
| 151 | `calcula_custo_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 152 | `diversos_adicional_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 153 | `data_aprovada` | `date` | YES | `` | `` | `` | `` |
| 154 | `manter_valor` | `tinyint` | YES | `0` | `` | `` | `` |
| 155 | `dias_entrega` | `int` | YES | `` | `` | `` | `` |
| 156 | `frete_acrescimo` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 157 | `acrescimo_limite` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 158 | `percentual_acrescimo` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 159 | `tipo_emissao` | `tinyint` | YES | `` | `` | `` | `` |
| 160 | `ordem_servico` | `varchar(255)` | YES | `` | `` | `` | `` |
| 161 | `origem_cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 162 | `destino_cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 163 | `entrega_resp_servico` | `int` | YES | `` | `` | `` | `` |
| 164 | `coleta_resp_servico` | `int` | YES | `` | `` | `` | `` |
| 165 | `difal` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 166 | `re_kmcapital` | `smallint` | YES | `` | `` | `` | `` |
| 167 | `des_kmcapital` | `smallint` | YES | `` | `` | `` | `` |
| 168 | `metragem_cubica` | `decimal(15,4)` | YES | `0.0000` | `` | `` | `` |
| 169 | `tipo_base_desconto` | `tinyint` | YES | `` | `` | `` | `` |
| 170 | `aprova_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 171 | `receita` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 172 | `alterar_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 173 | `agenda_data` | `date` | YES | `` | `` | `` | `` |
| 174 | `agenda_hora_inicio` | `time` | YES | `` | `` | `` | `` |
| 175 | `agenda_hora_fim` | `time` | YES | `` | `` | `` | `` |
| 176 | `perecivel` | `tinyint` | YES | `` | `` | `` | `` |
| 177 | `seg_valor` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 178 | `despacho_veiculo` | `int unsigned` | YES | `` | `` | `` | `` |
| 179 | `despacho_resp_servico` | `int` | YES | `` | `` | `` | `` |
| 180 | `despacho_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 181 | `despacho_resp_id` | `int unsigned` | YES | `` | `` | `` | `` |
| 182 | `despacho_custo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 183 | `motivo_despacho` | `varchar(100)` | YES | `` | `` | `` | `` |
| 184 | `conta_bancaria` | `int` | YES | `` | `` | `` | `` |
| 185 | `data_limite_aprovacao` | `date` | YES | `` | `` | `` | `` |
| 186 | `hora_limite_aprovacao` | `time` | YES | `` | `` | `` | `` |
| 187 | `cod_trecho` | `int` | YES | `` | `` | `` | `` |
| 188 | `ret_despacho_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 189 | `ret_despacho_resp_id` | `int unsigned` | YES | `` | `` | `` | `` |
| 190 | `ret_despacho_custo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 191 | `motivo_despacho_retira` | `varchar(100)` | YES | `` | `` | `` | `` |
| 192 | `id_endereco_expedidor` | `int` | YES | `` | `` | `` | `` |
| 193 | `id_endereco_entrega` | `int` | YES | `` | `` | `` | `` |
| 194 | `taxa_tde` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 195 | `insc_estadual` | `varchar(15)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_cotacao`, `id_cliente`, `id_origem`, `id_destino`, `id_seguro`, `coleta_resp_id`, `entrega_resp_id`, `id_empresa`, `id`, `id_expedidor`, `id_entrega`, `id_transportadora`, `id_armador`, `fatura_id`, `id_motorista`, `id_terceiro`, `despacho_resp_id`, `ret_despacho_resp_id`, `id_endereco_expedidor`, `id_endereco_entrega`
- **Datas/tempos prováveis**: `data_incluido`, `data`, `data_prazo`, `prev_entrega`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `prev_entrega_hora`, `prev_entrega_data`, `validade`, `hora_incluido`, `data_saida`, `data_prev_saida`, `data_entrega`, `hora_entrega`, `data_aprovada`, `tipo_emissao`, `agenda_data`, `agenda_hora_inicio`, `agenda_hora_fim`, `data_limite_aprovacao`, `hora_limite_aprovacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:47:56`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cotacao`
