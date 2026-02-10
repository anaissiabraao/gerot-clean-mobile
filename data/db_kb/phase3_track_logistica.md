# FASE 3 — Trilha: logistica (azportoex)

## Escopo
- Gerado em (UTC): **2025-12-17T16:50:41.035715+00:00**
- Seeds: `manifesto`, `minuta`, `coleta`
- Hops (FK explícita, fraco): **72 tabelas no recorte**
- Arestas (FK explícita no recorte): **82**
- Arestas (INFERIDO controlado no recorte): **5**

## Tabelas do recorte (com domínio INFERIDO por nome)
- `MDFe` (domínio INFERIDO: `fiscal_documentos`)
- `agendamento_coleta_dias` (domínio INFERIDO: `nao_classificado`)
- `ajudantes_manifesto` (domínio INFERIDO: `operacao_logistica`)
- `alteracoes_minuta` (domínio INFERIDO: `nao_classificado`)
- `alteracoes_tipo_oco` (domínio INFERIDO: `nao_classificado`)
- `anexos` (domínio INFERIDO: `nao_classificado`)
- `averbacao_config_modais` (domínio INFERIDO: `fiscal_documentos`)
- `averbacao_config_seguradoras` (domínio INFERIDO: `fiscal_documentos`)
- `averbacao_config_tipo_documento` (domínio INFERIDO: `fiscal_documentos`)
- `averbacao_config_unidades` (domínio INFERIDO: `fiscal_documentos`)
- `averbacao_configuracao` (domínio INFERIDO: `fiscal_documentos`)
- `averbacao_forma_pagamento` (domínio INFERIDO: `financeiro`)
- `averbacao_modal_adicional` (domínio INFERIDO: `nao_classificado`)
- `averbacao_protocolos` (domínio INFERIDO: `nao_classificado`)
- `averbacao_tipo_manifesto` (domínio INFERIDO: `operacao_logistica`)
- `averbacao_tipo_minuta` (domínio INFERIDO: `nao_classificado`)
- `ciot` (domínio INFERIDO: `nao_classificado`)
- `ciot_manifesto` (domínio INFERIDO: `operacao_logistica`)
- `ciot_parcelas` (domínio INFERIDO: `nao_classificado`)
- `ciot_vale_pedagio` (domínio INFERIDO: `nao_classificado`)
- `cliente_trecho` (domínio INFERIDO: `cadastros_base`)
- `cliente_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `cliente_vinculado_fornecedor_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `coleta` (domínio INFERIDO: `nao_classificado`)
- `coleta_historico` (domínio INFERIDO: `auditoria_logs`)
- `cotacao` (domínio INFERIDO: `nao_classificado`)
- `cte_anulacao` (domínio INFERIDO: `fiscal_documentos`)
- `cte_simplificado` (domínio INFERIDO: `fiscal_documentos`)
- `cte_substituicao` (domínio INFERIDO: `fiscal_documentos`)
- `custo_diverso_coleta` (domínio INFERIDO: `nao_classificado`)
- `dce` (domínio INFERIDO: `nao_classificado`)
- `edi_seq` (domínio INFERIDO: `nao_classificado`)
- `empresa_ie` (domínio INFERIDO: `cadastros_base`)
- `fatura` (domínio INFERIDO: `financeiro`)
- `fatura_cambio` (domínio INFERIDO: `financeiro`)
- `fatura_historico` (domínio INFERIDO: `financeiro`)
- `forma_pagamento` (domínio INFERIDO: `financeiro`)
- `fornecedor_bases_atendidas` (domínio INFERIDO: `cadastros_base`)
- `fornecedor_dominio` (domínio INFERIDO: `cadastros_base`)
- `fornecedor_pagamento` (domínio INFERIDO: `cadastros_base`)
- `fornecedores` (domínio INFERIDO: `cadastros_base`)
- `frete_hist` (domínio INFERIDO: `operacao_logistica`)
- `gnre_guias` (domínio INFERIDO: `nao_classificado`)
- `hfornecedores` (domínio INFERIDO: `cadastros_base`)
- `historico_volume` (domínio INFERIDO: `auditoria_logs`)
- `informacoes_adicionais` (domínio INFERIDO: `fiscal_documentos`)
- `itens_consolidados` (domínio INFERIDO: `nao_classificado`)
- `lote_comprovante` (domínio INFERIDO: `nao_classificado`)
- `manifest_charge` (domínio INFERIDO: `nao_classificado`)
- `manifesto` (domínio INFERIDO: `operacao_logistica`)
- `manifesto_historico` (domínio INFERIDO: `operacao_logistica`)
- `mdfe_hist` (domínio INFERIDO: `fiscal_documentos`)
- `minuta` (domínio INFERIDO: `nao_classificado`)
- `minuta_campos_extras` (domínio INFERIDO: `nao_classificado`)
- `minuta_custos` (domínio INFERIDO: `nao_classificado`)
- `minutas_lote` (domínio INFERIDO: `nao_classificado`)
- `moedas` (domínio INFERIDO: `nao_classificado`)
- `notas_fiscais` (domínio INFERIDO: `fiscal_documentos`)
- `oco_envio` (domínio INFERIDO: `nao_classificado`)
- `oco_envio2` (domínio INFERIDO: `nao_classificado`)
- `ocorrencia_brd` (domínio INFERIDO: `nao_classificado`)
- `palavra_chave_minuta` (domínio INFERIDO: `nao_classificado`)
- `performance_app_minuta` (domínio INFERIDO: `nao_classificado`)
- `permissoes_usuario_fornecedor` (domínio INFERIDO: `seguranca_autenticacao`)
- `picking` (domínio INFERIDO: `nao_classificado`)
- `rateio_manual` (domínio INFERIDO: `nao_classificado`)
- `regras_importacoes_nfe` (domínio INFERIDO: `fiscal_documentos`)
- `restricoes_fornecedores` (domínio INFERIDO: `cadastros_base`)
- `status_fornecedor_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `tipo_oco` (domínio INFERIDO: `nao_classificado`)
- `volume_historico` (domínio INFERIDO: `auditoria_logs`)
- `volumes` (domínio INFERIDO: `nao_classificado`)

## Hubs (somente FK explícita dentro do recorte)
| Tabela | Grau | in | out |
|---|---:|---:|---:|
| `fornecedores` | 21 | 21 | 0 |
| `minuta` | 19 | 14 | 5 |
| `manifesto` | 10 | 8 | 2 |
| `fatura` | 9 | 9 | 0 |
| `averbacao_configuracao` | 9 | 9 | 0 |
| `tipo_oco` | 5 | 5 | 0 |
| `volumes` | 3 | 3 | 0 |
| `notas_fiscais` | 3 | 3 | 0 |
| `ciot` | 3 | 3 | 0 |
| `coleta` | 3 | 2 | 1 |
| `minutas_lote` | 3 | 0 | 3 |
| `manifesto_historico` | 3 | 0 | 3 |
| `custo_diverso_coleta` | 3 | 0 | 3 |
| `averbacao_protocolos` | 3 | 0 | 3 |
| `lote_comprovante` | 2 | 2 | 0 |
| `oco_envio` | 2 | 0 | 2 |
| `minuta_custos` | 2 | 0 | 2 |
| `historico_volume` | 2 | 0 | 2 |
| `frete_hist` | 2 | 0 | 2 |
| `fatura_cambio` | 2 | 0 | 2 |
| `cte_simplificado` | 2 | 0 | 2 |
| `coleta_historico` | 2 | 0 | 2 |
| `ciot_manifesto` | 2 | 0 | 2 |
| `moedas` | 1 | 1 | 0 |
| `forma_pagamento` | 1 | 1 | 0 |

## Relacionamentos (FK explícita) — evidência estrutural
- `agendamento_coleta_dias.id_cliente` → `fornecedores.id_local` (constraint=`agendamento_coleta_dias_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ajudantes_manifesto.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_ajudante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_alteracoes_minuta_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_tipo_oco.id_ocorrencia` → `tipo_oco.id_oco` (constraint=`alteracoes_tipo_oco_id_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `anexos.id_nota` → `notas_fiscais.id_nf` (constraint=`fk_anexos_id_nota`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_modais.id_configuracao` → `averbacao_configuracao.id` (constraint=`averbacao_config_modais_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_seguradoras.id_configuracao` → `averbacao_configuracao.id` (constraint=`averbacao_config_seguradoras_fk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_tipo_documento.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_config_tipo_documento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_unidades.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_config_unidades`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_forma_pagamento.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_forma_pagamento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_modal_adicional.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_modal_adicional_configuracao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_protocolos.id_config` → `averbacao_configuracao.id` (constraint=`averbacao_protocolos_fk_averb_config`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_protocolos.id_minuta` → `minuta.id_minuta` (constraint=`averbacao_protocolos_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_protocolos.manifesto` → `MDFe.id_mdfe` (constraint=`fk_averbacao_protocolos_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_tipo_manifesto.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_tipo_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_tipo_minuta.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_tipo_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_manifesto.id_ciot` → `ciot.id` (constraint=`fk_ciot_id_ciot`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_manifesto.manifesto_numero` → `manifesto.id_manifesto` (constraint=`fk_ciot_manifesto_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_parcelas.id_ciot` → `ciot.id` (constraint=`fk_ciot_parcelas_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `ciot_vale_pedagio.id_ciot` → `ciot.id` (constraint=`fk_ciot_vale_pedagio_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cliente_trecho.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_trecho_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_usuario.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_usuario_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_vinculado_fornecedor_usuario.id_usuario` → `fornecedores.id_local` (constraint=`cliente_vinculado_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `coleta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `coleta_historico.coleta` → `coleta.id_coleta` (constraint=`fk_coleta_historico_coleta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `coleta_historico.status` → `tipo_oco.id_oco` (constraint=`fk_coleta_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cotacao.id_cliente` → `fornecedores.id_local` (constraint=`fk_id_cliente_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cte_anulacao.id_minuta` → `minuta.id_minuta` (constraint=`cte_anulacao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cte_simplificado.minuta_base` → `minuta.id_minuta` (constraint=`cte_simplificado_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cte_simplificado.minuta_gerada` → `minuta.id_minuta` (constraint=`cte_simplificado_minuta_id_minuta_fk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cte_substituicao.id_minuta` → `minuta.id_minuta` (constraint=`cte_substituicao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `custo_diverso_coleta.coleta` → `coleta.id_coleta` (constraint=`custo_diverso_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `custo_diverso_coleta.id_fornecedor` → `fornecedores.id_local` (constraint=`custo_diverso_coleta_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `custo_diverso_coleta.forma_pagamento` → `forma_pagamento.id_forma_pagamento` (constraint=`custo_diverso_coleta_ibfk_3`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `dce.id_nf` → `notas_fiscais.id_nf` (constraint=`fk_notas_fiscais`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `edi_seq.cliente` → `fornecedores.id_local` (constraint=`edi_seq_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `empresa_ie.id_empresa` → `fornecedores.id_local` (constraint=`empresa_ie_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fatura_cambio.fatura_id` → `fatura.id_fatura` (constraint=`fatura_cambio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fatura_cambio.moeda_id` → `moedas.id_moeda` (constraint=`fatura_cambio_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fatura_historico.fatura` → `fatura.id_fatura` (constraint=`fk_fatura_historico_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fornecedor_bases_atendidas.id_fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_bases_atendidas_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fornecedor_dominio.empresa` → `fornecedores.id_local` (constraint=`fornecedor_dominio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fornecedor_pagamento.fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_pagamento_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `frete_hist.frete` → `minuta.id_minuta` (constraint=`fk_frete_hist_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `frete_hist.id_nf` → `notas_fiscais.id_nf` (constraint=`fk_frete_hist_nf`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `gnre_guias.id_minuta` → `minuta.id_minuta` (constraint=`id_fk_gnre_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `hfornecedores.id_f` → `fornecedores.id_local` (constraint=`fk_fornecedor_hist`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `historico_volume.manifesto` → `manifesto.id_manifesto` (constraint=`fk_historico_volume_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `historico_volume.id_volume` → `volumes.id_volume` (constraint=`fk_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `informacoes_adicionais.cliente` → `fornecedores.id_local` (constraint=`fk_informacoes_adicionais_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `itens_consolidados.id_volume` → `volumes.id_volume` (constraint=`fk_id_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifest_charge.manifestId` → `manifesto.id_manifesto` (constraint=`manifest_charge_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.fatura` → `fatura.id_fatura` (constraint=`fk_manifesto_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto_historico.fornecedor` → `fornecedores.id_local` (constraint=`fk_manifesto_historico_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_historico_man`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.status` → `tipo_oco.id_oco` (constraint=`fk_manifesto_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `mdfe_hist.status` → `tipo_oco.id_oco` (constraint=`fk_mdfe_hist_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.despacho_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.despacho_fatura_retira` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura_retira`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.entrega_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_entrega_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta.seguro_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_seguro_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `minuta_campos_extras.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_campos_extras`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_id_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_custos_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minutas_lote.id_lote` → `lote_comprovante.id` (constraint=`fk_id_lote`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minutas_lote.id_lote` → `lote_comprovante.id` (constraint=`id_fk_comprovante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minutas_lote.minuta` → `minuta.id_minuta` (constraint=`id_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.cliente` → `fornecedores.id_local` (constraint=`fk_cliente_oco_envio_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.ocorrencia` → `tipo_oco.id_oco` (constraint=`fk_ocorrencia_oco_envio_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio2.cliente` → `fornecedores.id_local` (constraint=`fk_oco_envio_cliente`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ocorrencia_brd.cliente` → `fornecedores.id_local` (constraint=`clientes_brd_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `palavra_chave_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_palavra_chave_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `performance_app_minuta.id_minuta` → `minuta.id_minuta` (constraint=`fk_performance_app_minuta_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `permissoes_usuario_fornecedor.id_fornecedor` → `fornecedores.id_local` (constraint=`permissoes_usuario_fornecedor_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `picking.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_picking_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `rateio_manual.manifestId` → `manifesto.id_manifesto` (constraint=`fk_manifesto_rateio`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `regras_importacoes_nfe.id_cliente` → `fornecedores.id_local` (constraint=`regras_importacoes_nfe_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `restricoes_fornecedores.fornecedor` → `fornecedores.id_local` (constraint=`fk_restricoes_fornecedores_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `status_fornecedor_usuario.id_fornecedor` → `fornecedores.id_local` (constraint=`status_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `volume_historico.id_volume` → `volumes.id_volume` (constraint=`fk_volume_historico_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Links INFERIDOS (controlados) — NÃO é evidência
> Critério: match único de nome de coluna `_id/id_*/*_id` com PK simples (1 coluna) de outra tabela.
- `anexos.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos.id_fatura` ⇒ `fatura.id_fatura` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_protocolos.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `mdfe_hist.id_mdfe` ⇒ `MDFe.id_mdfe` (INFERIDO: column_name_matches_unique_pk_name)
- `volumes.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)

## Sinais de ciclo de vida (INFERIDO, por presença de colunas de data)
> Aqui NÃO inferimos regras de negócio, só listamos prováveis colunas de tempo para guiar investigação.
- `MDFe`: `data_emissao`, `hora_emissao`, `data_cancelamento`, `hora_cancelamento`, `data_encerramento`, `hora_encerramento`, `operador_emissao`
- `agendamento_coleta_dias`: `updated_at`, `emissao_automatica`
- `alteracoes_minuta`: `data`
- `alteracoes_tipo_oco`: `data`
- `anexos`: `data`, `hora`, `created_at`
- `averbacao_protocolos`: `data`, `created_at`
- `ciot`: `data_declaracao`, `data_inicio`, `data_final`, `data_finalizado_ciot`
- `ciot_manifesto`: `manifesto_emissao`, `manifesto_prev_saida`
- `ciot_parcelas`: `parcela_data`, `parcela_data_pagamento`
- `ciot_vale_pedagio`: `data_declaracao`
- `cliente_trecho`: `vigencia`
- `cliente_usuario`: `data`, `validade`, `visualiza_pre_emissao`
- `coleta`: `data_incluido`, `data`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `coletado_data`, `coletado_hora`, `entrega_data`, `entrega_hora`, `hora`, `data_limite`, `updated_at`
- `coleta_historico`: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`
- `cotacao`: `data_incluido`, `data`, `data_prazo`, `prev_entrega`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `prev_entrega_hora`, `prev_entrega_data`, `validade`, `hora_incluido`, `data_saida`
- `cte_anulacao`: `data_emissao`, `data_autorizacao`
- `cte_substituicao`: `data`
- `custo_diverso_coleta`: `data_incluido`
- `dce`: `data_autorizacao`, `data_cancelamento`, `created_at`
- `fatura`: `emissao`, `vencimento`, `dt_pagamento`, `data_incluido`, `hora_incluido`, `competencia`, `email_enviado`, `data_abono`
- `fatura_cambio`: `data`
- `fatura_historico`: `data`, `hora`
- `forma_pagamento`: `data`
- `fornecedores`: `data_incluido`, `dt_fundacao`, `data_atualizado`, `data_cancelado`, `serasaData`, `serasavalidade`, `hora_bloqueio`, `dataDDR`, `data_vigencia`, `data_vigencia_2`, `emissao_bloqueada`, `updated_at`
- `frete_hist`: `data`, `hora`, `data_incluido`, `hora_incluido`, `data_entrega`, `created_at`
- `gnre_guias`: `vencimento`, `pagamento`, `geracao`
- `hfornecedores`: `data`
- `historico_volume`: `data`, `hora`
- `itens_consolidados`: `created_at`, `inserted_at`, `deleted_at`
- `lote_comprovante`: `data`, `hora`, `tipo_data`, `data_inicial`, `data_final`
- `manifesto`: `prev_saida_data`, `prev_saida_hora`, `prev_chegada_data`, `prev_chegada_hora`, `saida_efetiva_data`, `saida_efetiva_hora`, `data_emissao`, `hora_emissao`, `chegada_efetiva_data`, `chegada_efetiva_hora`, `data_conferencia`, `hora_conferencia`
- `manifesto_historico`: `data`, `hora`, `created_at`
- `mdfe_hist`: `data`, `hora`, `created_at`
- `minuta`: `tipo_emissao`, `data_incluido`, `data`, `data_saida`, `data_prev_saida`, `prev_entrega`, `data_entrega`, `hora_entrega`, `coleta_data`, `coleta_hora`, `cte_data`, `cte_hora`
- `notas_fiscais`: `data`, `data_entrega`, `hora_entrega`
- `performance_app_minuta`: `data_salvo`
- `picking`: `iniciado`, `finalizado`
- `tipo_oco`: `hora_futura`, `updated_at`
- `volume_historico`: `data`, `hora`, `created_at`

## Próximos refinamentos sugeridos (INFERIDO)
- Confirmar quais tabelas representam **entidades de negócio** vs **eventos/histórico**.
- Validar colunas de status/cancelamento/finalização em tabelas hub.
- Adicionar inferências controladas por: `*_codigo`, `*_numero`, e match por índices únicos (mais forte que nome).
