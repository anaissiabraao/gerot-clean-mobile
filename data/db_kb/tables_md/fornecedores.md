# Tabela `azportoex.fornecedores`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fornecedores`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `58230`
- **Create time**: `2025-12-16T14:01:28`
- **Update time**: `2025-12-17T16:40:32`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_local`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `agendamento_coleta_dias.id_cliente` → `fornecedores.id_local` (constraint=`agendamento_coleta_dias_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_trecho.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_trecho_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_usuario.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_usuario_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_vinculado_fornecedor_usuario.id_usuario` → `fornecedores.id_local` (constraint=`cliente_vinculado_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cotacao.id_cliente` → `fornecedores.id_local` (constraint=`fk_id_cliente_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `custo_diverso_coleta.id_fornecedor` → `fornecedores.id_local` (constraint=`custo_diverso_coleta_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `edi_seq.cliente` → `fornecedores.id_local` (constraint=`edi_seq_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `empresa_ie.id_empresa` → `fornecedores.id_local` (constraint=`empresa_ie_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fornecedor_bases_atendidas.id_fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_bases_atendidas_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fornecedor_dominio.empresa` → `fornecedores.id_local` (constraint=`fornecedor_dominio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fornecedor_pagamento.fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_pagamento_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `hfornecedores.id_f` → `fornecedores.id_local` (constraint=`fk_fornecedor_hist`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `informacoes_adicionais.cliente` → `fornecedores.id_local` (constraint=`fk_informacoes_adicionais_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.fornecedor` → `fornecedores.id_local` (constraint=`fk_manifesto_historico_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.cliente` → `fornecedores.id_local` (constraint=`fk_cliente_oco_envio_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio2.cliente` → `fornecedores.id_local` (constraint=`fk_oco_envio_cliente`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ocorrencia_brd.cliente` → `fornecedores.id_local` (constraint=`clientes_brd_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `permissoes_usuario_fornecedor.id_fornecedor` → `fornecedores.id_local` (constraint=`permissoes_usuario_fornecedor_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `regras_importacoes_nfe.id_cliente` → `fornecedores.id_local` (constraint=`regras_importacoes_nfe_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `restricoes_fornecedores.fornecedor` → `fornecedores.id_local` (constraint=`fk_restricoes_fornecedores_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `status_fornecedor_usuario.id_fornecedor` → `fornecedores.id_local` (constraint=`status_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_local`]
- `idx_bandeira_cia` type=`BTREE` non_unique=`True` cols=[`bandeira_cia`]
- `idx_controlador_fornecedores` type=`BTREE` non_unique=`True` cols=[`controlador`]
- `idx_fornecedores` type=`BTREE` non_unique=`True` cols=[`razao`]
- `idx_fornecedores_cnpj` type=`BTREE` non_unique=`True` cols=[`cnpj`]
- `idx_fornecedores_fantasia` type=`BTREE` non_unique=`True` cols=[`fantasia`]
- `idx_fornecedores_tipo_cadastro` type=`BTREE` non_unique=`True` cols=[`tipo_cadastro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_local` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `conta` | `varchar(15)` | YES | `` | `` | `` | `` |
| 3 | `cnpj_tipo` | `int` | NO | `1` | `` | `` | `` |
| 4 | `cnpj` | `varchar(15)` | YES | `` | `` | `MUL` | `` |
| 5 | `fantasia` | `varchar(60)` | NO | `` | `` | `MUL` | `` |
| 6 | `razao` | `varchar(60)` | NO | `` | `` | `MUL` | `` |
| 7 | `ramo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 8 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 9 | `bairro` | `varchar(60)` | NO | `` | `` | `` | `` |
| 10 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 11 | `cidade` | `varchar(50)` | YES | `` | `` | `` | `` |
| 12 | `ref_cidade` | `varchar(15)` | YES | `` | `` | `` | `` |
| 13 | `cob_endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 14 | `cob_bairro` | `varchar(60)` | YES | `` | `` | `` | `` |
| 15 | `cob_cep` | `varchar(11)` | YES | `` | `` | `` | `` |
| 16 | `cob_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 17 | `cob_pais` | `int` | YES | `` | `` | `` | `` |
| 18 | `contato` | `varchar(60)` | YES | `` | `` | `` | `` |
| 19 | `telefone` | `varchar(14)` | YES | `` | `` | `` | `` |
| 20 | `fax` | `varchar(13)` | YES | `(00)0000.0000` | `` | `` | `` |
| 21 | `celular` | `varchar(20)` | YES | `` | `` | `` | `` |
| 22 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 23 | `site` | `varchar(255)` | YES | `` | `` | `` | `` |
| 24 | `insc_estadual` | `varchar(20)` | YES | `` | `` | `` | `` |
| 25 | `insc_municipal` | `varchar(15)` | YES | `` | `` | `` | `` |
| 26 | `zona` | `int` | YES | `0` | `` | `` | `` |
| 27 | `cliente` | `int` | YES | `0` | `` | `` | `` |
| 28 | `cliente_tipo` | `smallint` | NO | `1` | `` | `` | `` |
| 29 | `tipo_pagamento` | `tinyint` | YES | `` | `` | `` | `` |
| 30 | `recebe_comissao` | `smallint` | NO | `1` | `` | `` | `` |
| 31 | `fornecedor` | `int` | YES | `0` | `` | `` | `` |
| 32 | `local` | `int` | YES | `0` | `` | `` | `` |
| 33 | `status` | `int` | NO | `1` | `` | `` | `` |
| 34 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 35 | `operador` | `int` | NO | `` | `` | `` | `` |
| 36 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 37 | `unidade_faturamento` | `int` | YES | `0` | `` | `` | `` |
| 38 | `unidade_cotacao` | `int` | YES | `0` | `` | `` | `` |
| 39 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 40 | `envia_oco` | `int` | YES | `0` | `` | `` | `` |
| 41 | `oco_mail` | `varchar(255)` | YES | `` | `` | `` | `` |
| 42 | `id_tabela` | `int` | YES | `0` | `` | `` | `` |
| 43 | `tabela_compra_1` | `int` | YES | `` | `` | `` | `` |
| 44 | `insc_isento` | `int unsigned` | YES | `0` | `` | `` | `` |
| 45 | `suframa` | `varchar(45)` | YES | `` | `` | `` | `` |
| 46 | `pais` | `int unsigned` | NO | `1058` | `` | `` | `` |
| 47 | `logo` | `varchar(255)` | YES | `sem_logo.jpg` | `` | `` | `` |
| 48 | `tipo_cadastro` | `tinyint` | YES | `1` | `` | `MUL` | `` |
| 49 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 50 | `email_cte` | `int unsigned` | YES | `` | `` | `` | `` |
| 51 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 52 | `dividir_aviso_opr` | `tinyint` | NO | `0` | `` | `` | `` |
| 53 | `obs_comercial` | `mediumtext` | YES | `` | `` | `` | `` |
| 54 | `obs_coleta` | `mediumtext` | YES | `` | `` | `` | `` |
| 55 | `obs_financeiro` | `mediumtext` | YES | `` | `` | `` | `` |
| 56 | `obs_minuta` | `mediumtext` | YES | `` | `` | `` | `` |
| 57 | `obs_coleta_re` | `tinyint` | NO | `0` | `` | `` | `` |
| 58 | `obs_coleta_dest` | `tinyint` | NO | `0` | `` | `` | `` |
| 59 | `obs_coleta_toma` | `tinyint` | NO | `0` | `` | `` | `` |
| 60 | `obs_minuta_re` | `tinyint` | NO | `0` | `` | `` | `` |
| 61 | `obs_minuta_dest` | `tinyint` | NO | `0` | `` | `` | `` |
| 62 | `obs_minuta_toma` | `tinyint` | NO | `0` | `` | `` | `` |
| 63 | `vendedor` | `int` | YES | `0` | `` | `` | `` |
| 64 | `vendedor_comissao` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 65 | `limite_credito` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 66 | `fecha_fatura` | `int` | YES | `` | `` | `` | `` |
| 67 | `dias_vecto` | `int` | YES | `` | `` | `` | `` |
| 68 | `recebe_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 69 | `sigla` | `varchar(45)` | YES | `` | `` | `` | `` |
| 70 | `aero` | `int unsigned` | NO | `0` | `` | `` | `` |
| 71 | `dt_fundacao` | `date` | YES | `` | `` | `` | `` |
| 72 | `edi_notifis` | `varchar(45)` | YES | `` | `` | `` | `` |
| 73 | `edi_ocorrencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 74 | `edi_cob` | `varchar(45)` | YES | `` | `` | `` | `` |
| 75 | `edi_conemb` | `varchar(45)` | YES | `` | `` | `` | `` |
| 76 | `edi_email` | `varchar(45)` | YES | `` | `` | `` | `` |
| 77 | `usuario` | `varchar(45)` | YES | `` | `` | `` | `` |
| 78 | `resp_1_nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 79 | `resp_1_cpf` | `varchar(45)` | YES | `` | `` | `` | `` |
| 80 | `resp_1_rg` | `varchar(45)` | YES | `` | `` | `` | `` |
| 81 | `resp_1_celular` | `varchar(45)` | YES | `` | `` | `` | `` |
| 82 | `resp_1_nextel` | `varchar(45)` | YES | `` | `` | `` | `` |
| 83 | `resp_2_nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 84 | `resp_2_cpf` | `varchar(45)` | YES | `` | `` | `` | `` |
| 85 | `resp_2_rg` | `varchar(45)` | YES | `` | `` | `` | `` |
| 86 | `resp_2_celular` | `varchar(45)` | YES | `` | `` | `` | `` |
| 87 | `resp_2_nextel` | `varchar(45)` | YES | `` | `` | `` | `` |
| 88 | `gerais_1` | `varchar(45)` | YES | `` | `` | `` | `` |
| 89 | `gerais_2` | `varchar(45)` | YES | `` | `` | `` | `` |
| 90 | `outras_1` | `varchar(45)` | YES | `` | `` | `` | `` |
| 91 | `outras_2` | `varchar(45)` | YES | `` | `` | `` | `` |
| 92 | `outras_3` | `varchar(45)` | YES | `` | `` | `` | `` |
| 93 | `numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 94 | `valor_max_fatura` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 95 | `cte_fatura` | `int` | YES | `` | `` | `` | `` |
| 96 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 97 | `protestar` | `varchar(2)` | YES | `N` | `` | `` | `` |
| 98 | `proced_cob` | `varchar(2)` | YES | `` | `` | `` | `` |
| 99 | `dias` | `int` | YES | `` | `` | `` | `` |
| 100 | `fat_automatico` | `varchar(2)` | YES | `S` | `` | `` | `` |
| 101 | `seguradora` | `int` | YES | `` | `` | `` | `` |
| 102 | `transp_seguro` | `int` | YES | `` | `` | `` | `` |
| 103 | `seg_proprio` | `int` | YES | `` | `` | `` | `` |
| 104 | `senha` | `varchar(45)` | YES | `` | `` | `` | `` |
| 105 | `data_atualizado` | `date` | YES | `` | `` | `` | `` |
| 106 | `operador_atualizado` | `int` | YES | `` | `` | `` | `` |
| 107 | `fat_dia_inicial` | `int unsigned` | YES | `0` | `` | `` | `` |
| 108 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 109 | `bandeira_cia` | `int unsigned` | NO | `0` | `` | `MUL` | `` |
| 110 | `custo_ob` | `int unsigned` | NO | `0` | `` | `` | `` |
| 111 | `data_cancelado` | `date` | YES | `` | `` | `` | `` |
| 112 | `operador_cancelado` | `int unsigned` | YES | `` | `` | `` | `` |
| 113 | `senha_tam` | `varchar(255)` | YES | `` | `` | `` | `` |
| 114 | `user_tam` | `varchar(255)` | YES | `` | `` | `` | `` |
| 115 | `conta_tam` | `varchar(30)` | YES | `` | `` | `` | `` |
| 116 | `tad` | `int unsigned` | NO | `0` | `` | `` | `` |
| 117 | `distancia` | `int` | YES | `` | `` | `` | `` |
| 118 | `capital` | `int unsigned` | NO | `0` | `` | `` | `` |
| 119 | `historicoAwb` | `int unsigned` | NO | `0` | `` | `` | `` |
| 120 | `FatComprovante` | `int unsigned` | NO | `1` | `` | `` | `` |
| 121 | `FatEntregue` | `int unsigned` | NO | `1` | `` | `` | `` |
| 122 | `EnviaOco` | `int unsigned` | NO | `1` | `` | `` | `` |
| 123 | `emiteMinuta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 124 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 125 | `zonaFranca` | `int unsigned` | NO | `0` | `` | `` | `` |
| 126 | `retIss` | `int unsigned` | NO | `0` | `` | `` | `` |
| 127 | `orgFederal` | `int unsigned` | NO | `0` | `` | `` | `` |
| 128 | `serasaData` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 129 | `serasavalidade` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 130 | `cobNfse` | `int unsigned` | NO | `0` | `` | `` | `` |
| 131 | `cobCte` | `int unsigned` | NO | `0` | `` | `` | `` |
| 132 | `cobMinuta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 133 | `agente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 134 | `transportador` | `int unsigned` | NO | `0` | `` | `` | `` |
| 135 | `centroCusto` | `int unsigned` | NO | `0` | `` | `` | `` |
| 136 | `codigofiscal` | `int` | NO | `0` | `` | `` | `` |
| 137 | `restricaoSerasa` | `int unsigned` | NO | `0` | `` | `` | `` |
| 138 | `seguro_percentual` | `int` | YES | `100` | `` | `` | `` |
| 139 | `cidade_s` | `varchar(60)` | YES | `` | `` | `` | `` |
| 140 | `cidade_cob_s` | `varchar(60)` | YES | `` | `` | `` | `` |
| 141 | `vendedor_s` | `varchar(60)` | YES | `` | `` | `` | `` |
| 142 | `controlador` | `int` | YES | `` | `` | `MUL` | `` |
| 143 | `remetente` | `int` | NO | `0` | `` | `` | `` |
| 144 | `destinatario` | `int` | NO | `0` | `` | `` | `` |
| 145 | `tipo_faturamento` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 146 | `valor_gr` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 147 | `forma_fat` | `tinyint` | YES | `0` | `` | `` | `` |
| 148 | `nextel` | `varchar(15)` | YES | `` | `` | `` | `` |
| 149 | `dias_bloqueio` | `int` | YES | `0` | `` | `` | `` |
| 150 | `hora_bloqueio` | `time` | YES | `23:59:59` | `` | `` | `` |
| 151 | `faturas_bloqueio` | `tinyint` | YES | `1` | `` | `` | `` |
| 152 | `dataDDR` | `date` | YES | `` | `` | `` | `` |
| 153 | `nf_fatura` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 154 | `servico_padrao` | `int` | YES | `` | `` | `` | `` |
| 155 | `base_coleta` | `int` | YES | `` | `` | `` | `` |
| 156 | `tabela_promocional` | `int` | YES | `` | `` | `` | `` |
| 157 | `data_vigencia` | `date` | YES | `` | `` | `` | `` |
| 158 | `banco` | `int` | YES | `` | `` | `` | `` |
| 159 | `agencia` | `varchar(10)` | YES | `` | `` | `` | `` |
| 160 | `conta_corrente` | `varchar(10)` | YES | `` | `` | `` | `` |
| 161 | `fatura_comprovante` | `tinyint` | YES | `1` | `` | `` | `` |
| 162 | `desconto_tabela` | `decimal(7,2)` | NO | `0.00` | `` | `` | `` |
| 163 | `aplicacao_desconto` | `tinyint` | YES | `` | `` | `` | `` |
| 164 | `centro_obg` | `smallint` | NO | `0` | `` | `` | `` |
| 165 | `emiteCte` | `tinyint` | YES | `0` | `` | `` | `` |
| 166 | `envia_ddr` | `char(1)` | YES | `0` | `` | `` | `` |
| 167 | `baseCTE` | `smallint` | YES | `0` | `` | `` | `` |
| 168 | `grisPadrao` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 169 | `grisMinimo` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 170 | `grisFixo` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 171 | `consumo` | `int` | YES | `0` | `` | `` | `` |
| 172 | `prefixo_ocoren` | `varchar(25)` | YES | `` | `` | `` | `` |
| 173 | `prefixo_conemb` | `varchar(25)` | YES | `` | `` | `` | `` |
| 174 | `prefixo_doccob` | `varchar(25)` | YES | `` | `` | `` | `` |
| 175 | `val_frete` | `tinyint` | YES | `1` | `` | `` | `` |
| 176 | `centroCustoRecebimento` | `int` | YES | `` | `` | `` | `` |
| 177 | `alertaBoleto` | `tinyint` | YES | `1` | `` | `` | `` |
| 178 | `faturaAgente` | `tinyint` | YES | `1` | `` | `` | `` |
| 179 | `antt` | `varchar(20)` | YES | `` | `` | `` | `` |
| 180 | `suframa_perc` | `decimal(6,2)` | YES | `` | `` | `` | `` |
| 181 | `edi_prefat` | `tinyint` | YES | `` | `` | `` | `` |
| 182 | `alterado_por` | `int` | YES | `0` | `` | `` | `` |
| 183 | `tipo_imposto` | `tinyint` | YES | `` | `` | `` | `` |
| 184 | `token` | `varchar(30)` | YES | `` | `` | `` | `` |
| 185 | `antecipacao_titulo` | `int` | YES | `` | `` | `` | `` |
| 186 | `validaNf` | `tinyint` | YES | `1` | `` | `` | `` |
| 187 | `perecivel` | `varchar(45)` | YES | `` | `` | `` | `` |
| 188 | `cdcliente` | `varchar(15)` | YES | `` | `` | `` | `` |
| 189 | `obs_es` | `varchar(255)` | YES | `` | `` | `` | `` |
| 190 | `dificil_acesso` | `tinyint` | YES | `` | `` | `` | `` |
| 191 | `centro_custo` | `int` | YES | `0` | `` | `` | `` |
| 192 | `app` | `tinyint` | YES | `0` | `` | `` | `` |
| 193 | `cupom_desconto` | `varchar(100)` | YES | `` | `` | `` | `` |
| 194 | `fornecedorescol` | `varchar(45)` | YES | `` | `` | `` | `` |
| 195 | `tipoPeso` | `smallint` | NO | `0` | `` | `` | `` |
| 196 | `visualizar_frete` | `int` | YES | `1` | `` | `` | `` |
| 197 | `tabela_promocional_2` | `int` | YES | `0` | `` | `` | `` |
| 198 | `data_vigencia_2` | `date` | YES | `` | `` | `` | `` |
| 199 | `emissao_bloqueada` | `tinyint` | YES | `0` | `` | `` | `` |
| 200 | `anexo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 201 | `arredondamento_peso` | `tinyint` | YES | `0` | `` | `` | `` |
| 202 | `consumidor_final` | `tinyint` | YES | `0` | `` | `` | `` |
| 203 | `agendamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 204 | `alteracusto` | `tinyint` | YES | `0` | `` | `` | `` |
| 205 | `customaximo` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 206 | `cod_seguradora` | `int` | YES | `0` | `` | `` | `` |
| 207 | `fat_comprovante_cliente` | `tinyint` | YES | `0` | `` | `` | `` |
| 208 | `agrupa_nfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 209 | `inclui_obs` | `tinyint` | YES | `0` | `` | `` | `` |
| 210 | `tipo_cliente` | `smallint` | YES | `0` | `` | `` | `` |
| 211 | `seguradora_p` | `int` | YES | `0` | `` | `` | `` |
| 212 | `reducao_bc` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 213 | `destaca_icms` | `tinyint` | YES | `1` | `` | `` | `` |
| 214 | `desconta_icms` | `tinyint` | YES | `0` | `` | `` | `` |
| 215 | `peso_padrao` | `decimal(8,3)` | YES | `0.000` | `` | `` | `` |
| 216 | `rateio_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 217 | `rateio_tipo` | `tinyint` | YES | `0` | `` | `` | `` |
| 218 | `prefixo` | `varchar(8)` | YES | `` | `` | `` | `` |
| 219 | `cubagem_etiqueta` | `tinyint` | YES | `1` | `` | `` | `` |
| 220 | `obs_cte` | `varchar(1000)` | YES | `` | `` | `` | `` |
| 221 | `abc_tipo` | `char(1)` | YES | `c` | `` | `` | `` |
| 222 | `abc_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 223 | `prazo_interacao` | `int` | YES | `` | `` | `` | `` |
| 224 | `bloquear_limite_credito` | `tinyint` | YES | `1` | `` | `` | `` |
| 225 | `fob_dirigido` | `tinyint` | YES | `0` | `` | `` | `` |
| 226 | `composicao_frete_email` | `int` | YES | `2` | `` | `` | `` |
| 227 | `int_mostra_prazo_entrega` | `tinyint` | YES | `1` | `` | `` | `` |
| 228 | `base_resp_coleta` | `tinyint` | YES | `` | `` | `` | `` |
| 229 | `imprimir_minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 230 | `imprimir_dacte` | `tinyint` | YES | `1` | `` | `` | `` |
| 231 | `ocorrencia_minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 232 | `ocorrencia_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 233 | `ver_relatorios` | `tinyint` | YES | `1` | `` | `` | `` |
| 234 | `ver_despachos` | `tinyint` | YES | `1` | `` | `` | `` |
| 235 | `incluir_despachos` | `tinyint` | YES | `1` | `` | `` | `` |
| 236 | `recinto_alfandegado` | `tinyint` | YES | `0` | `` | `` | `` |
| 237 | `valor_nf_tipo` | `tinyint` | YES | `0` | `` | `` | `` |
| 238 | `codigo_contabil` | `varchar(45)` | YES | `` | `` | `` | `` |
| 239 | `recebe_brd` | `tinyint` | YES | `0` | `` | `` | `` |
| 240 | `controle_qualidade` | `tinyint` | YES | `0` | `` | `` | `` |
| 241 | `anexo_fatura_agente` | `tinyint` | YES | `0` | `` | `` | `` |
| 242 | `obs_acesso_cliente` | `mediumtext` | YES | `` | `` | `` | `` |
| 243 | `obriga_cubagem` | `tinyint` | YES | `0` | `` | `` | `` |
| 244 | `lat` | `varchar(16)` | NO | `0` | `` | `` | `` |
| 245 | `lng` | `varchar(16)` | NO | `0` | `` | `` | `` |
| 246 | `prefixo_doccob_fatura` | `tinyint` | NO | `1` | `` | `` | `` |
| 247 | `dias_fat_fixo` | `varchar(92)` | YES | `` | `` | `` | `` |
| 248 | `opcao_faturamento` | `tinyint` | YES | `` | `` | `` | `` |
| 249 | `volume_padrao` | `int` | YES | `0` | `` | `` | `` |
| 250 | `edi_nome_destinatario` | `varchar(60)` | YES | `` | `` | `` | `` |
| 251 | `analise_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 252 | `envia_comprovante` | `tinyint` | YES | `0` | `` | `` | `` |
| 253 | `pedidonf_autfrete` | `tinyint` | YES | `0` | `` | `` | `` |
| 254 | `baixa_por_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 255 | `autxml` | `tinyint` | YES | `0` | `` | `` | `` |
| 256 | `tempo_coleta` | `int` | YES | `` | `` | `` | `` |
| 257 | `tomador_fixo_nfe` | `tinyint` | YES | `0` | `` | `` | `0 - Automático, 1 - remetente, 2 - destinatario, 3 - emitente NFe` |
| 258 | `calcula_trt_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 259 | `contrato` | `varchar(45)` | YES | `` | `` | `` | `` |
| 260 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 261 | `conf_entrega_app` | `tinyint` | YES | `0` | `` | `` | `` |
| 262 | `aceiteFatura` | `tinyint(1)` | YES | `0` | `` | `` | `PERMISSAO AGENTE PARA DAR ACEITE EM FATURAS` |
| 263 | `xml_cte` | `tinyint` | YES | `1` | `` | `` | `` |
| 264 | `doc_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 265 | `agente_incluir_documento` | `tinyint` | YES | `0` | `` | `` | `` |
| 266 | `cob_numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 267 | `obs_cte_dest` | `varchar(255)` | YES | `` | `` | `` | `` |
| 268 | `calcula_tde_minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 269 | `calcula_advalorem_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 270 | `colComprovante` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 271 | `remove_itens` | `tinyint unsigned` | YES | `1` | `` | `` | `` |
| 272 | `faixa_tde` | `tinyint` | YES | `` | `` | `` | `` |
| 273 | `bloqueia_km` | `tinyint` | YES | `0` | `` | `` | `` |
| 274 | `imprime_etiquetas` | `tinyint` | YES | `` | `` | `` | `` |
| 275 | `realiza_pre_picking` | `tinyint` | YES | `` | `` | `` | `` |
| 276 | `moeda_referencia` | `int` | YES | `1` | `` | `` | `` |
| 277 | `tipo_cambio` | `int` | YES | `1` | `` | `` | `` |
| 278 | `cambio_fixo` | `decimal(10,4)` | YES | `` | `` | `` | `` |
| 279 | `fornecedor_vale_pedagio` | `int` | YES | `` | `` | `` | `` |
| 280 | `layout_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 281 | `manutencao_perecivel` | `tinyint` | YES | `0` | `` | `` | `` |
| 282 | `lead` | `int` | YES | `` | `` | `` | `` |
| 283 | `emite_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 284 | `visualizar_imprimir_nf` | `tinyint` | YES | `1` | `` | `` | `` |
| 285 | `cadastra_motorista` | `tinyint` | YES | `1` | `` | `` | `` |
| 286 | `cadastra_ajudante` | `tinyint` | YES | `1` | `` | `` | `` |
| 287 | `cadastra_veiculo` | `tinyint` | YES | `1` | `` | `` | `` |
| 288 | `altera_custo_manifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 289 | `agente_cubagem_coleta` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 290 | `tomador_globalizado` | `tinyint` | YES | `1` | `` | `` | `` |
| 291 | `servico_padrao_coleta` | `int` | YES | `` | `` | `` | `` |
| 292 | `seleciona_servico_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 293 | `cte_obs_prazo_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 294 | `mostra_icms_cte` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 295 | `semColRealizada` | `tinyint` | YES | `1` | `` | `` | `` |
| 296 | `bloquea_emissao_cte_fob` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 297 | `mostra_difal_cte` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 298 | `data_inativado` | `datetime` | YES | `` | `` | `` | `` |
| 299 | `valida_data_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 300 | `define_data_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 301 | `valida_pedido_nf` | `tinyint` | YES | `0` | `` | `` | `` |
| 302 | `obriga_senha_recebedor_entrega` | `tinyint` | YES | `2` | `` | `` | `` |
| 303 | `etiqueta_padrao` | `int` | YES | `` | `` | `` | `` |
| 304 | `remove_ocorrencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 305 | `remove_comprovante` | `tinyint` | YES | `0` | `` | `` | `` |
| 306 | `desconsiderar_volumes` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 307 | `controlador_agente` | `int` | YES | `` | `` | `` | `` |
| 308 | `controle` | `int` | YES | `` | `` | `` | `` |
| 309 | `servicos_seguro` | `json` | YES | `` | `` | `` | `` |
| 310 | `servico_padrao_manifesto` | `int` | NO | `0` | `` | `` | `` |
| 311 | `faturaAutomatica` | `int` | YES | `0` | `` | `` | `` |
| 312 | `tipoEtiquetaPeso` | `tinyint` | YES | `1` | `` | `` | `` |
| 313 | `restricao_trecho_destino` | `tinyint` | YES | `0` | `` | `` | `` |
| 314 | `adv_seguro_proprio` | `tinyint` | NO | `0` | `` | `` | `` |
| 315 | `embarca_mercadoria_alheia` | `tinyint` | YES | `0` | `` | `` | `` |
| 316 | `tipo_dias` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 317 | `tolerancia_embarcador` | `decimal(8,2)` | NO | `0.00` | `` | `` | `` |
| 318 | `versao_cte` | `tinyint` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_local`, `id_tabela`, `id_cliente`
- **Datas/tempos prováveis**: `data_incluido`, `dt_fundacao`, `data_atualizado`, `data_cancelado`, `serasaData`, `serasavalidade`, `hora_bloqueio`, `dataDDR`, `data_vigencia`, `data_vigencia_2`, `emissao_bloqueada`, `updated_at`, `bloquea_emissao_cte_fob`, `data_inativado`, `valida_data_nf`, `define_data_nf`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:40:32`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `fornecedores`
