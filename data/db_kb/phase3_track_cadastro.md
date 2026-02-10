# FASE 3 — Trilha: cadastro (azportoex)

## Escopo
- Gerado em (UTC): **2025-12-17T16:50:41.035715+00:00**
- Seeds: `fornecedores`
- Hops (FK explícita, fraco): **43 tabelas no recorte**
- Arestas (FK explícita no recorte): **47**
- Arestas (INFERIDO controlado no recorte): **0**

## Tabelas do recorte (com domínio INFERIDO por nome)
- `aero` (domínio INFERIDO: `nao_classificado`)
- `agendamento_coleta_dias` (domínio INFERIDO: `nao_classificado`)
- `ajudantes_manifesto` (domínio INFERIDO: `operacao_logistica`)
- `alteracoes_cliente_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `alteracoes_tipo_oco` (domínio INFERIDO: `nao_classificado`)
- `ciot_manifesto` (domínio INFERIDO: `operacao_logistica`)
- `cliente_trecho` (domínio INFERIDO: `cadastros_base`)
- `cliente_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `cliente_vinculado_fornecedor_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `coleta` (domínio INFERIDO: `nao_classificado`)
- `coleta_historico` (domínio INFERIDO: `auditoria_logs`)
- `cotacao` (domínio INFERIDO: `nao_classificado`)
- `cotacao_hist` (domínio INFERIDO: `auditoria_logs`)
- `cte_serie_servico` (domínio INFERIDO: `fiscal_documentos`)
- `custo_diverso_coleta` (domínio INFERIDO: `nao_classificado`)
- `edi_seq` (domínio INFERIDO: `nao_classificado`)
- `empresa_ie` (domínio INFERIDO: `cadastros_base`)
- `equipamento` (domínio INFERIDO: `nao_classificado`)
- `fatura` (domínio INFERIDO: `financeiro`)
- `forma_pagamento` (domínio INFERIDO: `financeiro`)
- `fornecedor_bases_atendidas` (domínio INFERIDO: `cadastros_base`)
- `fornecedor_dominio` (domínio INFERIDO: `cadastros_base`)
- `fornecedor_pagamento` (domínio INFERIDO: `cadastros_base`)
- `fornecedores` (domínio INFERIDO: `cadastros_base`)
- `hfornecedores` (domínio INFERIDO: `cadastros_base`)
- `historico_volume` (domínio INFERIDO: `auditoria_logs`)
- `informacoes_adicionais` (domínio INFERIDO: `fiscal_documentos`)
- `lote_cotacao` (domínio INFERIDO: `nao_classificado`)
- `manifest_charge` (domínio INFERIDO: `nao_classificado`)
- `manifesto` (domínio INFERIDO: `operacao_logistica`)
- `manifesto_historico` (domínio INFERIDO: `operacao_logistica`)
- `mdfe_hist` (domínio INFERIDO: `fiscal_documentos`)
- `oco_envio` (domínio INFERIDO: `nao_classificado`)
- `oco_envio2` (domínio INFERIDO: `nao_classificado`)
- `ocorrencia_brd` (domínio INFERIDO: `nao_classificado`)
- `permissoes_usuario_fornecedor` (domínio INFERIDO: `seguranca_autenticacao`)
- `picking` (domínio INFERIDO: `nao_classificado`)
- `rateio_manual` (domínio INFERIDO: `nao_classificado`)
- `regras_importacoes_nfe` (domínio INFERIDO: `fiscal_documentos`)
- `restricoes_fornecedores` (domínio INFERIDO: `cadastros_base`)
- `status_fornecedor_usuario` (domínio INFERIDO: `seguranca_autenticacao`)
- `tipo_oco` (domínio INFERIDO: `nao_classificado`)
- `usuarios` (domínio INFERIDO: `seguranca_autenticacao`)

## Hubs (somente FK explícita dentro do recorte)
| Tabela | Grau | in | out |
|---|---:|---:|---:|
| `fornecedores` | 21 | 21 | 0 |
| `manifesto` | 10 | 8 | 2 |
| `tipo_oco` | 5 | 5 | 0 |
| `cotacao` | 3 | 2 | 1 |
| `coleta` | 3 | 2 | 1 |
| `manifesto_historico` | 3 | 0 | 3 |
| `custo_diverso_coleta` | 3 | 0 | 3 |
| `usuarios` | 2 | 2 | 0 |
| `fatura` | 2 | 2 | 0 |
| `equipamento` | 2 | 2 | 0 |
| `cliente_usuario` | 2 | 1 | 1 |
| `regras_importacoes_nfe` | 2 | 0 | 2 |
| `oco_envio` | 2 | 0 | 2 |
| `fornecedor_bases_atendidas` | 2 | 0 | 2 |
| `coleta_historico` | 2 | 0 | 2 |
| `alteracoes_tipo_oco` | 2 | 0 | 2 |
| `alteracoes_cliente_usuario` | 2 | 0 | 2 |
| `forma_pagamento` | 1 | 1 | 0 |
| `aero` | 1 | 1 | 0 |
| `status_fornecedor_usuario` | 1 | 0 | 1 |
| `restricoes_fornecedores` | 1 | 0 | 1 |
| `rateio_manual` | 1 | 0 | 1 |
| `picking` | 1 | 0 | 1 |
| `permissoes_usuario_fornecedor` | 1 | 0 | 1 |
| `ocorrencia_brd` | 1 | 0 | 1 |

## Relacionamentos (FK explícita) — evidência estrutural
- `agendamento_coleta_dias.id_cliente` → `fornecedores.id_local` (constraint=`agendamento_coleta_dias_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ajudantes_manifesto.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_ajudante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_cliente_usuario.operador` → `usuarios.id_usuario` (constraint=`alteracoes_cliente_usuario_operador_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_cliente_usuario.usuario_cliente` → `cliente_usuario.id_usuario` (constraint=`alteracoes_cliente_usuario_usuario_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_tipo_oco.id_ocorrencia` → `tipo_oco.id_oco` (constraint=`alteracoes_tipo_oco_id_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `alteracoes_tipo_oco.operador` → `usuarios.id_usuario` (constraint=`alteracoes_tipo_oco_operador_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_manifesto.manifesto_numero` → `manifesto.id_manifesto` (constraint=`fk_ciot_manifesto_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_trecho.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_trecho_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_usuario.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_usuario_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cliente_vinculado_fornecedor_usuario.id_usuario` → `fornecedores.id_local` (constraint=`cliente_vinculado_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `coleta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_coleta_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `coleta_historico.coleta` → `coleta.id_coleta` (constraint=`fk_coleta_historico_coleta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `coleta_historico.status` → `tipo_oco.id_oco` (constraint=`fk_coleta_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cotacao.id_cliente` → `fornecedores.id_local` (constraint=`fk_id_cliente_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `cotacao_hist.cotacao` → `cotacao.id_cotacao` (constraint=`fk_cotacao_hist_cotacao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `cte_serie_servico.servico` → `equipamento.id_equipamento` (constraint=`fk_cte_serie_servico_equipamento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `custo_diverso_coleta.coleta` → `coleta.id_coleta` (constraint=`custo_diverso_coleta_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `custo_diverso_coleta.id_fornecedor` → `fornecedores.id_local` (constraint=`custo_diverso_coleta_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `custo_diverso_coleta.forma_pagamento` → `forma_pagamento.id_forma_pagamento` (constraint=`custo_diverso_coleta_ibfk_3`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `edi_seq.cliente` → `fornecedores.id_local` (constraint=`edi_seq_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `empresa_ie.id_empresa` → `fornecedores.id_local` (constraint=`empresa_ie_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fornecedor_bases_atendidas.id_fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_bases_atendidas_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fornecedor_bases_atendidas.id_base` → `aero.id_aero` (constraint=`fornecedor_bases_atendidas_ibfk_2`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `fornecedor_dominio.empresa` → `fornecedores.id_local` (constraint=`fornecedor_dominio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `fornecedor_pagamento.fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_pagamento_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `hfornecedores.id_f` → `fornecedores.id_local` (constraint=`fk_fornecedor_hist`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `historico_volume.manifesto` → `manifesto.id_manifesto` (constraint=`fk_historico_volume_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `informacoes_adicionais.cliente` → `fornecedores.id_local` (constraint=`fk_informacoes_adicionais_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `lote_cotacao.id_cotacao` → `cotacao.id_cotacao` (constraint=`fk_cotacao`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifest_charge.manifestId` → `manifesto.id_manifesto` (constraint=`manifest_charge_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.fatura` → `fatura.id_fatura` (constraint=`fk_manifesto_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto_historico.fornecedor` → `fornecedores.id_local` (constraint=`fk_manifesto_historico_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_historico_man`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.status` → `tipo_oco.id_oco` (constraint=`fk_manifesto_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `mdfe_hist.status` → `tipo_oco.id_oco` (constraint=`fk_mdfe_hist_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.cliente` → `fornecedores.id_local` (constraint=`fk_cliente_oco_envio_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.ocorrencia` → `tipo_oco.id_oco` (constraint=`fk_ocorrencia_oco_envio_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio2.cliente` → `fornecedores.id_local` (constraint=`fk_oco_envio_cliente`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ocorrencia_brd.cliente` → `fornecedores.id_local` (constraint=`clientes_brd_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `permissoes_usuario_fornecedor.id_fornecedor` → `fornecedores.id_local` (constraint=`permissoes_usuario_fornecedor_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `picking.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_picking_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `rateio_manual.manifestId` → `manifesto.id_manifesto` (constraint=`fk_manifesto_rateio`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `regras_importacoes_nfe.id_servico` → `equipamento.id_equipamento` (constraint=`regras_importacoes_nfe_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `regras_importacoes_nfe.id_cliente` → `fornecedores.id_local` (constraint=`regras_importacoes_nfe_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `restricoes_fornecedores.fornecedor` → `fornecedores.id_local` (constraint=`fk_restricoes_fornecedores_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `status_fornecedor_usuario.id_fornecedor` → `fornecedores.id_local` (constraint=`status_fornecedor_usuario_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Links INFERIDOS (controlados) — NÃO é evidência
> Critério: match único de nome de coluna `_id/id_*/*_id` com PK simples (1 coluna) de outra tabela.
- (nenhum link inferido dentro do recorte)

## Sinais de ciclo de vida (INFERIDO, por presença de colunas de data)
> Aqui NÃO inferimos regras de negócio, só listamos prováveis colunas de tempo para guiar investigação.
- `aero`: `updated_at`
- `agendamento_coleta_dias`: `updated_at`, `emissao_automatica`
- `alteracoes_cliente_usuario`: `data`
- `alteracoes_tipo_oco`: `data`
- `ciot_manifesto`: `manifesto_emissao`, `manifesto_prev_saida`
- `cliente_trecho`: `vigencia`
- `cliente_usuario`: `data`, `validade`, `visualiza_pre_emissao`
- `coleta`: `data_incluido`, `data`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `coletado_data`, `coletado_hora`, `entrega_data`, `entrega_hora`, `hora`, `data_limite`, `updated_at`
- `coleta_historico`: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`
- `cotacao`: `data_incluido`, `data`, `data_prazo`, `prev_entrega`, `coleta_data`, `coleta_hora`, `coleta_hora_de`, `prev_entrega_hora`, `prev_entrega_data`, `validade`, `hora_incluido`, `data_saida`
- `cotacao_hist`: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`
- `custo_diverso_coleta`: `data_incluido`
- `equipamento`: `data`
- `fatura`: `emissao`, `vencimento`, `dt_pagamento`, `data_incluido`, `hora_incluido`, `competencia`, `email_enviado`, `data_abono`
- `forma_pagamento`: `data`
- `fornecedores`: `data_incluido`, `dt_fundacao`, `data_atualizado`, `data_cancelado`, `serasaData`, `serasavalidade`, `hora_bloqueio`, `dataDDR`, `data_vigencia`, `data_vigencia_2`, `emissao_bloqueada`, `updated_at`
- `hfornecedores`: `data`
- `historico_volume`: `data`, `hora`
- `manifesto`: `prev_saida_data`, `prev_saida_hora`, `prev_chegada_data`, `prev_chegada_hora`, `saida_efetiva_data`, `saida_efetiva_hora`, `data_emissao`, `hora_emissao`, `chegada_efetiva_data`, `chegada_efetiva_hora`, `data_conferencia`, `hora_conferencia`
- `manifesto_historico`: `data`, `hora`, `created_at`
- `mdfe_hist`: `data`, `hora`, `created_at`
- `picking`: `iniciado`, `finalizado`
- `tipo_oco`: `hora_futura`, `updated_at`
- `usuarios`: `data_nascimento`, `limite_emissao_cte`, `data`, `vigencia`, `alerta_emissao`, `data_atualizacao_cadastro`, `lucro_minimo_emissao_cte`, `altera_data_manifesto`, `alt_expira_senha`, `data_codigo_recuperar_senha`, `valor_maximo_emissao_cte`

## Próximos refinamentos sugeridos (INFERIDO)
- Confirmar quais tabelas representam **entidades de negócio** vs **eventos/histórico**.
- Validar colunas de status/cancelamento/finalização em tabelas hub.
- Adicionar inferências controladas por: `*_codigo`, `*_numero`, e match por índices únicos (mais forte que nome).

## Aviso (seeds ausentes)
- As seguintes seeds não foram encontradas no schema e foram ignoradas no recorte:
  - `clientes`
