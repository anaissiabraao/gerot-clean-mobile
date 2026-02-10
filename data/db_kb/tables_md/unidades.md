# Tabela `azportoex.unidades`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `unidades`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-10-20T12:32:20`
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
- `id_unidade`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `averbacao_config_unidades.id_unidade` → `unidades.id_unidade` (constraint=`fk_id_unidade`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `emissao_automatica.id_unidade` → `unidades.id_unidade` (constraint=`emissao_automatica_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `unidade_parametros.unidade` → `unidades.id_unidade` (constraint=`fk_unidade_parametros_unidade`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_unidade`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_unidade` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_local` | `int` | NO | `0` | `` | `` | `` |
| 3 | `fantasia` | `varchar(60)` | NO | `` | `` | `` | `` |
| 4 | `razao` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `cnpj` | `varchar(14)` | NO | `` | `` | `` | `` |
| 6 | `insc_estadual` | `varchar(14)` | NO | `` | `` | `` | `` |
| 7 | `insc_municipal` | `varchar(15)` | YES | `` | `` | `` | `` |
| 8 | `endereco` | `varchar(80)` | NO | `` | `` | `` | `` |
| 9 | `complemento` | `varchar(60)` | YES | `` | `` | `` | `` |
| 10 | `numero` | `varchar(15)` | NO | `` | `` | `` | `` |
| 11 | `bairro` | `varchar(60)` | NO | `` | `` | `` | `` |
| 12 | `cep` | `varchar(9)` | NO | `` | `` | `` | `` |
| 13 | `cidade` | `varchar(11)` | NO | `` | `` | `` | `` |
| 14 | `telefone` | `varchar(30)` | NO | `(00)0000.0000` | `` | `` | `` |
| 15 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 16 | `nextel` | `varchar(30)` | YES | `` | `` | `` | `` |
| 17 | `base_iss` | `decimal(3,2)` | NO | `5.00` | `` | `` | `` |
| 18 | `base_icms` | `decimal(4,2)` | NO | `12.00` | `` | `` | `` |
| 19 | `comissao` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 20 | `ctrc_numero` | `int` | YES | `` | `` | `` | `` |
| 21 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 22 | `status` | `int` | NO | `1` | `` | `` | `` |
| 23 | `data` | `date` | NO | `` | `` | `` | `` |
| 24 | `sigla` | `varchar(21)` | NO | `` | `` | `` | `` |
| 25 | `sigla_uf` | `varchar(3)` | NO | `` | `` | `` | `` |
| 26 | `rntrc` | `varchar(15)` | NO | `` | `` | `` | `` |
| 27 | `tipo_imposto` | `varchar(5)` | NO | `` | `` | `` | `` |
| 28 | `fatura_sequencia` | `int unsigned` | YES | `` | `` | `` | `` |
| 29 | `hora_fuso` | `varchar(45)` | NO | `` | `` | `` | `` |
| 30 | `imgTopoEmail` | `varchar(200)` | YES | `` | `` | `` | `` |
| 31 | `imgBaixoEmail` | `varchar(200)` | YES | `` | `` | `` | `` |
| 32 | `fonte` | `varchar(45)` | YES | `` | `` | `` | `` |
| 33 | `lei` | `varchar(45)` | YES | `` | `` | `` | `` |
| 34 | `aliquota` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 35 | `par_serie` | `int unsigned` | NO | `0` | `` | `` | `` |
| 36 | `par_entrega` | `int unsigned` | NO | `0` | `` | `` | `` |
| 37 | `par_servico` | `int unsigned` | NO | `0` | `` | `` | `` |
| 38 | `par_trecho` | `int unsigned` | NO | `0` | `` | `` | `` |
| 39 | `par_centro` | `int unsigned` | NO | `0` | `` | `` | `` |
| 40 | `par_agente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 41 | `par_coleta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 42 | `par_printMinuta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 43 | `par_printValorMinuta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 44 | `par_nfdupla` | `tinyint` | YES | `0` | `` | `` | `` |
| 45 | `EtiqModelo` | `int unsigned` | NO | `2` | `` | `` | `` |
| 46 | `EtiqColeta` | `int` | NO | `2` | `` | `` | `` |
| 47 | `EtiqDespacho` | `int` | NO | `2` | `` | `` | `` |
| 48 | `EtiqModeloFatura` | `int` | YES | `1` | `` | `` | `` |
| 49 | `obsMinuta` | `varchar(255)` | YES | `` | `` | `` | `` |
| 50 | `obsColeta` | `varchar(255)` | YES | `` | `` | `` | `` |
| 51 | `EtiqTamanho` | `varchar(15)` | NO | `100,70` | `` | `` | `` |
| 52 | `obsAuto` | `mediumtext` | YES | `` | `` | `` | `` |
| 53 | `valorFreteManifesto` | `int unsigned` | NO | `0` | `` | `` | `` |
| 54 | `par_ManifestoMotorista` | `int` | NO | `0` | `` | `` | `` |
| 55 | `par_ManifestoAgente` | `int` | NO | `0` | `` | `` | `` |
| 56 | `site` | `varchar(55)` | YES | `` | `` | `` | `` |
| 57 | `emailAcom` | `tinyint` | YES | `` | `` | `` | `` |
| 58 | `frete` | `tinyint` | NO | `0` | `` | `` | `` |
| 59 | `peso` | `tinyint` | NO | `0` | `` | `` | `` |
| 60 | `volumes` | `tinyint` | NO | `0` | `` | `` | `` |
| 61 | `coleta` | `tinyint` | NO | `0` | `` | `` | `` |
| 62 | `c_destinatario` | `tinyint` | NO | `0` | `` | `` | `` |
| 63 | `c_emailAcom` | `tinyint` | NO | `0` | `` | `` | `` |
| 64 | `c_solicitante` | `tinyint` | NO | `0` | `` | `` | `` |
| 65 | `c_telefone` | `tinyint` | NO | `0` | `` | `` | `` |
| 66 | `c_servico` | `tinyint` | NO | `0` | `` | `` | `` |
| 67 | `c_respColeta` | `tinyint` | NO | `0` | `` | `` | `` |
| 68 | `c_peso` | `tinyint` | NO | `0` | `` | `` | `` |
| 69 | `c_volumes` | `tinyint` | NO | `0` | `` | `` | `` |
| 70 | `preLista` | `tinyint` | YES | `` | `` | `` | `` |
| 71 | `statusAwb` | `tinyint` | NO | `0` | `` | `` | `` |
| 72 | `telefone_cob` | `varchar(30)` | YES | `` | `` | `` | `` |
| 73 | `guiche_embarque` | `int` | YES | `0` | `` | `` | `` |
| 74 | `guiche_retira` | `int` | YES | `0` | `` | `` | `` |
| 75 | `cal_comissao` | `tinyint` | YES | `0` | `` | `` | `` |
| 76 | `emitecte` | `smallint` | YES | `0` | `` | `` | `` |
| 77 | `par_Financeiro` | `tinyint(1)` | NO | `1` | `` | `` | `` |
| 78 | `icms_comissao` | `decimal(5,2)` | NO | `0.00` | `` | `` | `` |
| 79 | `obsCotacao` | `mediumtext` | YES | `` | `` | `` | `` |
| 80 | `obrigaRateio` | `tinyint` | YES | `0` | `` | `` | `` |
| 81 | `cotm` | `varchar(20)` | YES | `` | `` | `` | `` |
| 82 | `par_notasManifesto` | `int unsigned` | YES | `` | `` | `` | `` |
| 83 | `pracaPagamento` | `smallint` | NO | `0` | `` | `` | `` |
| 84 | `iss_retido` | `int` | YES | `` | `` | `` | `` |
| 85 | `pre_impressao` | `tinyint` | YES | `0` | `` | `` | `` |
| 86 | `km_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 87 | `emite_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 88 | `maximo_segurado` | `tinyint` | YES | `0` | `` | `` | `` |
| 89 | `finaliza_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 90 | `finaliza_manifesto_minuta_status` | `tinyint` | YES | `1` | `` | `` | `` |
| 91 | `altera_remetente_coleta` | `int` | YES | `0` | `` | `` | `` |
| 92 | `tabela_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 93 | `solicitante_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 94 | `emissor_cte` | `tinyint` | YES | `1` | `` | `` | `` |
| 95 | `saida_data_retroativa` | `tinyint` | YES | `0` | `` | `` | `` |
| 96 | `coleta_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 97 | `valida_checklist` | `tinyint` | YES | `0` | `` | `` | `` |
| 98 | `cte_awb` | `tinyint` | YES | `0` | `` | `` | `` |
| 99 | `modelo_titulo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 100 | `modelo_texto` | `varchar(60)` | YES | `` | `` | `` | `` |
| 101 | `rateio_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 102 | `cubagem_impressa` | `tinyint` | YES | `0` | `` | `` | `Tipo de cubagem que sairá na impressão da minuta: 0 -> cubagem do serviço; 1: cubagem padrão rodo, 2: cubagem padrão aereo` |
| 103 | `cte_duas_vias` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 104 | `seguradora_preferencial` | `int` | YES | `0` | `` | `` | `` |
| 105 | `cte_tipo_minuta` | `tinyint` | YES | `0` | `` | `` | `Define se o tipo de minuta sra infromado no CTe` |
| 106 | `pre_alerta_app` | `tinyint` | YES | `0` | `` | `` | `` |
| 107 | `recebe_obs_ocorrencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 108 | `dias_entrega` | `int` | YES | `0` | `` | `` | `` |
| 109 | `valida_capacidade_veiculo` | `tinyint` | YES | `0` | `` | `` | `` |
| 110 | `embarque_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 111 | `composicao_frete_email` | `int` | YES | `1` | `` | `` | `` |
| 112 | `cte_copia` | `tinyint` | YES | `0` | `` | `` | `` |
| 113 | `previsao_padrao` | `tinyint` | YES | `0` | `` | `` | `` |
| 114 | `codigo_fiscal` | `tinyint` | YES | `0` | `` | `` | `` |
| 115 | `obs_email_cobranca` | `mediumtext` | YES | `` | `` | `` | `` |
| 116 | `cliente_natureza` | `tinyint` | YES | `0` | `` | `` | `` |
| 117 | `coleta_pdf_agente` | `tinyint` | YES | `1` | `` | `` | `` |
| 118 | `coleta_pdf_cliente` | `tinyint` | YES | `1` | `` | `` | `` |
| 119 | `envia_email_motorista` | `tinyint` | YES | `0` | `` | `` | `` |
| 120 | `envia_email_terceiro` | `tinyint` | YES | `0` | `` | `` | `` |
| 121 | `memo_coleta_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 122 | `bloqueia_veiculo_licenciamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 123 | `bloqueia_motorista_cnh` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 124 | `bloqueia_veiculo_vigencia` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 125 | `arredonda_peso_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 126 | `manter_cotacao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 127 | `email_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 128 | `minuta_lote_sem_pod` | `tinyint` | NO | `0` | `` | `` | `` |
| 129 | `minuta_lote` | `tinyint` | NO | `0` | `` | `` | `` |
| 130 | `altera_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 131 | `altera_praca` | `tinyint` | NO | `1` | `` | `` | `` |
| 132 | `go_isento` | `tinyint` | YES | `1` | `` | `` | `` |
| 133 | `minimo_fatura` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 134 | `tipo_emissao_edi` | `tinyint` | YES | `1` | `` | `` | `` |
| 135 | `forma_pagamento` | `int` | NO | `0` | `` | `` | `` |
| 136 | `tipo_pagamento` | `int` | NO | `1` | `` | `` | `` |
| 137 | `oco_retroativa` | `smallint` | YES | `1` | `` | `` | `` |
| 138 | `bloqueio_emissao_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 139 | `duplicidade_mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 140 | `codigo_contabil` | `varchar(45)` | YES | `` | `` | `` | `` |
| 141 | `unidade_administrativa` | `varchar(45)` | YES | `` | `` | `` | `` |
| 142 | `operador` | `int` | YES | `` | `` | `` | `` |
| 143 | `emite_cte_issqn` | `tinyint` | YES | `1` | `` | `` | `` |
| 144 | `ocorrencia_futuro` | `tinyint` | YES | `1` | `` | `` | `` |
| 145 | `minuta_copia` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 146 | `cal_comissao_coleta` | `int` | YES | `0` | `` | `` | `` |
| 147 | `comissao_coleta` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 148 | `valida_awb` | `tinyint` | YES | `0` | `` | `` | `` |
| 149 | `cte_data` | `smallint` | NO | `0` | `` | `` | `` |
| 150 | `emite_minuta_coleta_app` | `tinyint` | YES | `0` | `` | `` | `` |
| 151 | `tipo_imp_dim_min` | `tinyint` | YES | `1` | `` | `` | `` |
| 152 | `tipo_imp_dim_cot` | `tinyint` | YES | `1` | `` | `` | `` |
| 153 | `tipo_imp_dim_col` | `tinyint` | YES | `1` | `` | `` | `` |
| 154 | `tipo` | `tinyint` | YES | `0` | `` | `` | `0->NORMAL, 1->PA` |
| 155 | `validade_cotacao` | `smallint` | YES | `3` | `` | `` | `` |
| 156 | `obriga_cubagem` | `tinyint` | YES | `0` | `` | `` | `` |
| 157 | `lat` | `varchar(16)` | NO | `0` | `` | `` | `` |
| 158 | `lng` | `varchar(16)` | NO | `0` | `` | `` | `` |
| 159 | `valida_estado_remetente_cotacao` | `int` | YES | `0` | `` | `` | `` |
| 160 | `validar_limite_dep` | `tinyint` | YES | `` | `` | `` | `` |
| 161 | `validar_limite_nat` | `tinyint` | YES | `` | `` | `` | `` |
| 162 | `bloqueio_minuta_nao_averbada` | `tinyint` | YES | `0` | `` | `` | `` |
| 163 | `emite_averbada` | `tinyint` | YES | `0` | `` | `` | `` |
| 164 | `calcular_frete_salvar` | `tinyint` | YES | `0` | `` | `` | `` |
| 165 | `bloqueia_awb` | `int` | YES | `` | `` | `` | `` |
| 166 | `EtiqOrdemImpressao` | `tinyint` | YES | `1` | `` | `` | `` |
| 167 | `altera_vencimento_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 168 | `altera_previsao_lancamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 169 | `altera_observacao_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 170 | `liquida_lancamento_apos_fechamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 171 | `parcela_lancamento_apos_fechamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 172 | `data_saida_emissao` | `tinyint` | YES | `0` | `` | `` | `` |
| 173 | `idioma_imp_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 174 | `enviar_nfse` | `tinyint` | YES | `0` | `` | `` | `` |
| 175 | `seleciona_nf_emissao` | `tinyint` | YES | `1` | `` | `` | `` |
| 176 | `excedente_peso_add` | `tinyint` | YES | `1` | `` | `` | `` |
| 177 | `validar_cnpj_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 178 | `obrigatorio_rota_manifesto` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 179 | `servico_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 180 | `bloqueia_minutas_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 181 | `cubagem_total` | `tinyint` | YES | `0` | `` | `` | `` |
| 182 | `par_calc_agente_origem` | `tinyint` | YES | `0` | `` | `` | `` |
| 183 | `responsavel_tabela_venda` | `tinyint` | YES | `0` | `` | `` | `` |
| 184 | `obriga_chave_cte_subcontratado` | `tinyint` | YES | `0` | `` | `` | `` |
| 185 | `barra_dfe_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 186 | `horario_corte` | `time` | YES | `` | `` | `` | `` |
| 187 | `utilizar_horario_corte` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 188 | `calcular_manifesto_ao_finalizar` | `tinyint` | YES | `0` | `` | `` | `` |
| 189 | `bloqueia_minuta_com_frete_zerado` | `tinyint` | YES | `0` | `` | `` | `` |
| 190 | `lista_126` | `tinyint` | YES | `1` | `` | `` | `` |
| 191 | `hora_saida_emissao` | `tinyint` | YES | `0` | `` | `` | `` |
| 192 | `exibir_todas_notas_impressao` | `tinyint` | YES | `0` | `` | `` | `` |
| 193 | `html_email_entrega` | `mediumtext` | YES | `` | `` | `` | `` |
| 194 | `salva_lancamento_previsao_bloq` | `tinyint` | YES | `0` | `` | `` | `` |
| 195 | `guia_antecipada_simples` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 196 | `hora_entrega_padrao` | `time` | YES | `18:00:00` | `` | `` | `` |
| 197 | `hora_saida_padrao` | `time` | YES | `00:00:00` | `` | `` | `` |
| 198 | `difal_tomador_isento` | `tinyint` | YES | `1` | `` | `` | `` |
| 199 | `validar_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 200 | `bloqueio_checklist_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 201 | `valida_gerenciadora` | `tinyint` | YES | `0` | `` | `` | `` |
| 202 | `gerenciadora_veiculo` | `tinyint` | YES | `0` | `` | `` | `` |
| 203 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 204 | `emails_acom` | `tinyint` | YES | `0` | `` | `` | `` |
| 205 | `confirmacao_sonora` | `tinyint` | YES | `0` | `` | `` | `` |
| 206 | `entrega_imp` | `tinyint` | YES | `5` | `` | `` | `` |
| 207 | `cte_obs_resp_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 208 | `cte_obs_forma_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 209 | `prazo_horas` | `tinyint` | YES | `0` | `` | `` | `` |
| 210 | `conta_lancamento` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 211 | `exibir_tipo_cliente` | `tinyint` | YES | `0` | `` | `` | `` |
| 212 | `bloqueio_min_nao_averbada` | `tinyint` | YES | `0` | `` | `` | `` |
| 213 | `manter_trecho_calculado` | `tinyint` | YES | `0` | `` | `` | `` |
| 214 | `permissao_data` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 215 | `prazo_transferencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 216 | `dt_emissao_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 217 | `par_printNotas` | `tinyint` | YES | `0` | `` | `` | `` |
| 218 | `obriga_campos_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 219 | `block_alter` | `tinyint` | YES | `0` | `` | `` | `` |
| 220 | `finaliza_manifesto_coleta_status` | `tinyint` | NO | `0` | `` | `` | `` |
| 221 | `manifestar_vinculado_multimodal` | `tinyint` | YES | `0` | `` | `` | `` |
| 222 | `calcular_cotacao_salvar` | `tinyint` | YES | `0` | `` | `` | `` |
| 223 | `obriga_motorista` | `tinyint` | YES | `0` | `` | `` | `` |
| 224 | `obriga_veiculo` | `tinyint` | YES | `0` | `` | `` | `` |
| 225 | `statusLancamento_gnre` | `tinyint` | YES | `1` | `` | `` | `` |
| 226 | `id_contas_bancaria` | `int` | YES | `` | `` | `` | `` |
| 227 | `memo_cotacao_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 228 | `obriga_orig_dest` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 229 | `fatura_multimodal` | `tinyint` | YES | `1` | `` | `` | `` |
| 230 | `pa_loga_sistema` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 231 | `estorna_lancamento_previsao_bloq` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 232 | `cte_checklist` | `tinyint` | YES | `0` | `` | `` | `` |
| 233 | `obriga_servico_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 234 | `data_saida_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 235 | `unidade_faturamento` | `int` | YES | `0` | `` | `` | `` |
| 236 | `mg_isento` | `tinyint` | YES | `` | `` | `` | `` |
| 237 | `frete_peso_soma_peso_add` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 238 | `resp_tecnico_xml` | `tinyint` | YES | `0` | `` | `` | `` |
| 239 | `listagem_entrega` | `tinyint` | YES | `1` | `` | `` | `` |
| 240 | `resp_entrega_imp_col` | `tinyint` | YES | `0` | `` | `` | `` |
| 241 | `prev_entrega_imp_col` | `tinyint` | YES | `0` | `` | `` | `` |
| 242 | `mt_isento` | `tinyint` | YES | `` | `` | `` | `` |
| 243 | `obrigatorio_custo_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 244 | `obs_email_cobranca_vencida` | `text` | YES | `` | `` | `` | `` |
| 245 | `semi_reboque_obrig` | `tinyint` | YES | `0` | `` | `` | `` |
| 246 | `custos_manifesto_prop` | `tinyint` | YES | `0` | `` | `` | `` |
| 247 | `custos_manifesto_agen` | `tinyint` | YES | `0` | `` | `` | `` |
| 248 | `custos_manifesto_terc` | `tinyint` | YES | `0` | `` | `` | `` |
| 249 | `todas_notas_imp_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 250 | `permite_cotacao_minutas` | `int` | NO | `0` | `` | `` | `` |
| 251 | `emite_manifesto_agente` | `tinyint` | NO | `0` | `` | `` | `` |
| 252 | `emite_manifesto_terceiro` | `tinyint` | NO | `0` | `` | `` | `` |
| 253 | `emite_manifesto_transf` | `tinyint` | NO | `0` | `` | `` | `` |
| 254 | `exibe_uf_mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 255 | `obsDespacho` | `text` | YES | `` | `` | `` | `` |
| 256 | `manifestar_pendentes_finalizacao` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 257 | `obsInclusaoCotacao` | `text` | YES | `` | `` | `` | `` |
| 258 | `destaca_pis_cofins` | `tinyint` | NO | `0` | `` | `` | `` |
| 259 | `bloqueio_checklist_rastreador` | `tinyint` | NO | `0` | `` | `` | `` |
| 260 | `bloqueia_minuta_rota_diferente` | `tinyint` | YES | `0` | `` | `` | `` |
| 261 | `calc_icms_uf_dif` | `int` | YES | `1` | `` | `` | `` |
| 262 | `rateio_manifesto_transf` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 263 | `rateio_manifesto_agente` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 264 | `rateio_manifesto_terceiro` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 265 | `manutencao_prev_veic` | `tinyint` | YES | `0` | `` | `` | `` |
| 266 | `cte_num_minuta` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 267 | `valida_valor_emissao_carta_viagem` | `tinyint` | YES | `0` | `` | `` | `` |
| 268 | `dacte_pre_alerta` | `int` | YES | `1` | `` | `` | `` |
| 269 | `mostra_frete_agente` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 270 | `mostra_frete_proprio` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 271 | `mostra_frete_transf` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 272 | `mostra_frete_terceiro` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 273 | `qr_code_baixa_facil` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 274 | `prev_entrega_cte` | `tinyint` | NO | `1` | `` | `` | `` |
| 275 | `cte_modelo_detalhado` | `tinyint` | NO | `0` | `` | `` | `` |
| 276 | `exibe_saida_mdfe` | `tinyint` | NO | `0` | `` | `` | `` |
| 277 | `exibe_chegada_mdfe` | `tinyint` | NO | `0` | `` | `` | `` |
| 278 | `EtiqEstoque` | `int` | NO | `1` | `` | `` | `` |
| 279 | `pr_isento` | `tinyint` | YES | `` | `` | `` | `` |
| 280 | `obs_referencia_assinatura` | `varchar(300)` | YES | `` | `` | `` | `` |
| 281 | `coleta_imp` | `tinyint` | YES | `` | `` | `` | `` |
| 282 | `base_icms_st` | `enum('1','2')` | NO | `1` | `` | `` | `1 - Valor da prestação, 2 - Valor a receber` |
| 283 | `vincula_cotacao` | `tinyint` | NO | `0` | `` | `` | `` |
| 284 | `alerta_nao_averbado` | `tinyint` | YES | `0` | `` | `` | `` |
| 285 | `valida_uf_origem` | `tinyint` | YES | `0` | `` | `` | `` |
| 286 | `obriga_mot_veiculo_manif` | `tinyint` | YES | `0` | `` | `` | `` |
| 287 | `modelo_carta_viagem` | `int` | YES | `0` | `` | `` | `` |
| 288 | `nao_destaca_icms_antecipado` | `tinyint` | YES | `0` | `` | `` | `` |
| 289 | `isencao_redespacho` | `tinyint` | YES | `0` | `` | `` | `` |
| 290 | `informa_lacre_impresao_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 291 | `lacre_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 292 | `rateio_manifesto_viagem` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 293 | `arredonda_issqn` | `tinyint` | YES | `0` | `` | `` | `` |
| 294 | `validar_origDest_mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 295 | `isencao_icms_inter_rs` | `tinyint` | NO | `0` | `` | `` | `` |
| 296 | `data_coleta_impressao_cotacao` | `tinyint` | YES | `1` | `` | `` | `` |
| 297 | `modelo_comprovante_entrega` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_unidade`, `id_local`, `id_contas_bancaria`
- **Datas/tempos prováveis**: `data`, `hora_fuso`, `saida_data_retroativa`, `tipo_emissao_edi`, `bloqueio_emissao_nf`, `cte_data`, `data_saida_emissao`, `seleciona_nf_emissao`, `horario_corte`, `utilizar_horario_corte`, `hora_saida_emissao`, `hora_entrega_padrao`, `hora_saida_padrao`, `updated_at`, `prazo_horas`, `permissao_data`, `dt_emissao_minuta`, `data_saida_coleta`, `valida_valor_emissao_carta_viagem`, `data_coleta_impressao_cotacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `unidades`
