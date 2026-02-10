# Fluxos e Ciclo de Vida dos Dados — Visão Global (azportoex)

## Escopo e evidência
- Gerado em (UTC): **2025-12-17T16:50:41.035715+00:00**
- Tabelas no schema: **728**
- Arestas (FK explícita): **146**
- Arestas (INFERIDO controlado): **188**

Camadas:
- **Evidência estrutural**: apenas constraints FK explícitas (information_schema).
- **INFERIDO (controlado)**: correspondência única `*_id/id_*` → PK simples (1 coluna).

## Componentes (conectividade por FK explícita)
> Componentes fracos (ignora direção). Se o banco não declarar FKs, a conectividade fica subestimada.

| # | Tamanho | Domínios dominantes (INFERIDO por nome) | Amostra de tabelas |
|---:|---:|---|---|
| 1 | 97 | nao_classificado=45, fiscal_documentos=16, seguranca_autenticacao=9, cadastros_base=8, operacao_logistica=6 | `MDFe`, `aero`, `agendamento_coleta_dias`, `ajudantes_manifesto`, `alteracoes_cliente_usuario`, `alteracoes_minuta`, `alteracoes_tipo_oco`, `anexos`, `api_group`, `api_profile`, `api_user`, `autorizacoes_ressarcimento` |
| 2 | 7 | nao_classificado=5, cadastros_base=2 | `dash_item_config`, `dash_modulos`, `dash_process`, `dash_tela`, `dash_tela_item`, `dash_tipo_grafico`, `dash_tipo_grafico_atributos` |
| 3 | 6 | integracoes=3, operacao_logistica=2, fiscal_documentos=1 | `integracao_codigo`, `integracao_configuracao`, `integracao_rota`, `integracao_tipo`, `integracao_tipo_codigo`, `rotas` |
| 4 | 6 | nao_classificado=3, auditoria_logs=2, seguranca_autenticacao=1 | `event_shipping`, `system_entitities`, `system_entity_observable`, `system_entity_vars`, `system_events`, `system_user_event` |
| 5 | 4 | nao_classificado=3, auditoria_logs=1 | `tabela_especifica`, `tabela_faixas_historico`, `tabela_trecho`, `trecho_cnpj` |
| 6 | 4 | fiscal_documentos=2, nao_classificado=1, auditoria_logs=1 | `lancamento_historico`, `lancamentos`, `nf_contra`, `nf_contra_lancamento` |
| 7 | 3 | nao_classificado=2, cadastros_base=1 | `reclamacao`, `reclamacao_remessa`, `relacionamento_cliente` |
| 8 | 3 | nao_classificado=2, fiscal_documentos=1 | `pre_minuta_notfis`, `pre_nota_notfis`, `pre_volume_notfis` |
| 9 | 2 | operacao_logistica=2 | `tabela_frete_importacao`, `tabela_frete_importacao_logs` |
| 10 | 2 | operacao_logistica=1, nao_classificado=1 | `tabela_formulas`, `tabela_frete` |
| 11 | 2 | cadastros_base=2 | `produtos`, `produtos_nota` |
| 12 | 2 | fiscal_documentos=2 | `notas`, `notas_hist` |
| 13 | 2 | nao_classificado=2 | `indice_inss`, `indice_inss_vigencia` |
| 14 | 2 | fiscal_documentos=2 | `emails_configuracao`, `emails_configuracao_tipo` |
| 15 | 2 | nao_classificado=2 | `departamento_rateio`, `departamentos` |
| 16 | 2 | nao_classificado=2 | `codigo_verificacao`, `tipo_modelo` |
| 17 | 1 | nao_classificado=1 | `zonas` |
| 18 | 1 | nao_classificado=1 | `xml_ftp` |
| 19 | 1 | nao_classificado=1 | `whatsAcom` |
| 20 | 1 | nao_classificado=1 | `vouchers_roteirizar` |

## Tabelas hub (centralidade por FK explícita)
| Tabela | Grau | in | out | Domínio (INFERIDO) |
|---|---:|---:|---:|---|
| `fornecedores` | 21 | 21 | 0 | `cadastros_base` |
| `minuta` | 13 | 12 | 1 | `nao_classificado` |
| `manifesto` | 10 | 8 | 2 | `operacao_logistica` |
| `usuarios` | 9 | 9 | 0 | `seguranca_autenticacao` |
| `averbacao_configuracao` | 9 | 9 | 0 | `fiscal_documentos` |
| `tipo_oco` | 5 | 5 | 0 | `nao_classificado` |
| `fatura` | 5 | 5 | 0 | `financeiro` |
| `lancamentos` | 4 | 3 | 1 | `nao_classificado` |
| `volumes` | 3 | 3 | 0 | `nao_classificado` |
| `unidades` | 3 | 3 | 0 | `nao_classificado` |
| `tabela_trecho` | 3 | 3 | 0 | `nao_classificado` |
| `system_entitities` | 3 | 3 | 0 | `nao_classificado` |
| `notas_fiscais` | 3 | 3 | 0 | `fiscal_documentos` |
| `ciot` | 3 | 3 | 0 | `nao_classificado` |
| `integracao_configuracao` | 3 | 2 | 1 | `fiscal_documentos` |
| `dash_tipo_grafico` | 3 | 2 | 1 | `nao_classificado` |
| `cotacao` | 3 | 2 | 1 | `nao_classificado` |
| `coleta` | 3 | 2 | 1 | `nao_classificado` |
| `hist_tipo_coleta` | 3 | 1 | 2 | `auditoria_logs` |
| `dash_tela_item` | 3 | 1 | 2 | `cadastros_base` |
| `manifesto_historico` | 3 | 0 | 3 | `operacao_logistica` |
| `itens_consolidados` | 3 | 0 | 3 | `nao_classificado` |
| `custo_diverso_coleta` | 3 | 0 | 3 | `nao_classificado` |
| `averbacao_protocolos` | 3 | 0 | 3 | `nao_classificado` |
| `reclamacao` | 2 | 2 | 0 | `nao_classificado` |
| `moedas` | 2 | 2 | 0 | `nao_classificado` |
| `equipamento` | 2 | 2 | 0 | `nao_classificado` |
| `dash_modulos` | 2 | 2 | 0 | `nao_classificado` |
| `system_user_event` | 2 | 1 | 1 | `seguranca_autenticacao` |
| `system_events` | 2 | 1 | 1 | `auditoria_logs` |
| `pre_nota_notfis` | 2 | 1 | 1 | `fiscal_documentos` |
| `dash_tipo_grafico_atributos` | 2 | 1 | 1 | `nao_classificado` |
| `cliente_usuario` | 2 | 1 | 1 | `seguranca_autenticacao` |
| `api_group` | 2 | 1 | 1 | `integracoes` |
| `system_access_time_controll` | 2 | 0 | 2 | `nao_classificado` |
| `regras_importacoes_nfe` | 2 | 0 | 2 | `fiscal_documentos` |
| `oco_envio` | 2 | 0 | 2 | `nao_classificado` |
| `nf_contra_lancamento` | 2 | 0 | 2 | `fiscal_documentos` |
| `minutas_lote` | 2 | 0 | 2 | `nao_classificado` |
| `integracao_rota` | 2 | 0 | 2 | `operacao_logistica` |

## Cadeias de dependência (amostras) — FK explícita
> Cadeias obtidas por BFS a partir de hubs; são amostras, não fluxo completo de negócio.

- `minuta` → `fatura`
- `manifesto` → `fatura`

## INFERÊNCIAS controladas (links sugeridos)
> Abaixo são links **sugeridos**. Eles NÃO são evidência; servem para guiar investigação/validação.

### Resumo
- Total de links inferidos: **188**
- Critério: match único de nome de coluna `_id/id_` com PK simples de outra tabela.
- Ambiguidades são descartadas (não inferimos quando há múltiplas tabelas candidatas).

### Exemplos (primeiros 60)
- `ViewEquipamento.id_equipamento` ⇒ `equipamento.id_equipamento` (INFERIDO: column_name_matches_unique_pk_name)
- `abastecimentos.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `agendamento_coleta_dias.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `agendamento_coleta_hora.id_dia` ⇒ `feriados.id_dia` (INFERIDO: column_name_matches_unique_pk_name)
- `alteracao_responsavel_minuta.id_alteracao` ⇒ `alteracoes_lancamentos.id_alteracao` (INFERIDO: column_name_matches_unique_pk_name)
- `alteracoes_lancamentos.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos.id_fatura` ⇒ `fatura.id_fatura` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos.id_reclamacao` ⇒ `reclamacao.id_reclamacao` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos_comprovante_lote.id_lote` ⇒ `gnre_lotes.id_lote` (INFERIDO: column_name_matches_unique_pk_name)
- `anexos_ordem.id_ordem` ⇒ `ordem_abastecimento.id_ordem` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_config_alteracao.id_config` ⇒ `correios_config.id_config` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_config_modais.id_modal` ⇒ `modais.id_modal` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_modal_adicional.id_modal` ⇒ `modais.id_modal` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_protocolos.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `averbacao_protocolos.id_config` ⇒ `correios_config.id_config` (INFERIDO: column_name_matches_unique_pk_name)
- `boletos.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `brd_tabela_exporta.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `brd_tabela_exporta.id_tabela` ⇒ `tabela_frete.id_tabela` (INFERIDO: column_name_matches_unique_pk_name)
- `campanha_historico.id_campanha` ⇒ `campanha.id_campanha` (INFERIDO: column_name_matches_unique_pk_name)
- `campanha_list.id_campanha` ⇒ `campanha.id_campanha` (INFERIDO: column_name_matches_unique_pk_name)
- `cc_departamento.id_departamento` ⇒ `departamentos.id_departamento` (INFERIDO: column_name_matches_unique_pk_name)
- `centro_custo.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `centro_custo.id_trecho_cliente` ⇒ `cliente_trecho.id_trecho_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot.id_natureza` ⇒ `natureza.id_natureza` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot.id_protocolo` ⇒ `protocolo.id_protocolo` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot_cartoes.id_terceiro` ⇒ `terceiros.id_terceiro` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot_favorecido.id_terceiro` ⇒ `terceiros.id_terceiro` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot_parcelas.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `ciot_vale_pedagio.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_natureza_seg.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_natureza_seg.id_natureza` ⇒ `natureza.id_natureza` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_relacionamento.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_tabelas.id_tabela` ⇒ `tabela_frete.id_tabela` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_trecho.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `cliente_usuario.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `clientes_nfe_io.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `coleta.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `coleta_lacre.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `comissao.id_vendedor` ⇒ `vendedores.id_vendedor` (INFERIDO: column_name_matches_unique_pk_name)
- `compromisso_usuario.id_compromisso` ⇒ `agenda_compromissos.id_compromisso` (INFERIDO: column_name_matches_unique_pk_name)
- `comprovante_ftp.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `contas_bancaria.id_banco` ⇒ `bancos.id_banco` (INFERIDO: column_name_matches_unique_pk_name)
- `contas_bancaria_faixas.id_banco` ⇒ `bancos.id_banco` (INFERIDO: column_name_matches_unique_pk_name)
- `contratos.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `correios_servicos.id_config` ⇒ `correios_config.id_config` (INFERIDO: column_name_matches_unique_pk_name)
- `cotacao.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `cotacao.id_terceiro` ⇒ `terceiros.id_terceiro` (INFERIDO: column_name_matches_unique_pk_name)
- `cotacao_reprovada.id_motivo_cotacao_reprovada` ⇒ `motivo_cotacao_reprovada.id_motivo_cotacao_reprovada` (INFERIDO: column_name_matches_unique_pk_name)
- `curva_cliente.id_cliente` ⇒ `cliente_futuro.id_cliente` (INFERIDO: column_name_matches_unique_pk_name)
- `curva_cliente.id_grupo` ⇒ `tabela_grupo.id_grupo` (INFERIDO: column_name_matches_unique_pk_name)
- `departamento_rateio.id_departamento` ⇒ `departamentos.id_departamento` (INFERIDO: column_name_matches_unique_pk_name)
- `departamento_rateio.id_lancamento` ⇒ `lancamentos.id_lancamento` (INFERIDO: column_name_matches_unique_pk_name)
- `departamento_rateio_fornecedor.id_departamento` ⇒ `departamentos.id_departamento` (INFERIDO: column_name_matches_unique_pk_name)
- `destinos_coleta.id_coleta` ⇒ `coleta.id_coleta` (INFERIDO: column_name_matches_unique_pk_name)
- `dre_ordem.id_raiz` ⇒ `centro_raiz.id_raiz` (INFERIDO: column_name_matches_unique_pk_name)
- `emails_configuracao_tipo.id_config` ⇒ `correios_config.id_config` (INFERIDO: column_name_matches_unique_pk_name)
- `entrada.id_pessoa` ⇒ `pessoa.id_pessoa` (INFERIDO: column_name_matches_unique_pk_name)
- ... truncado (total=188)

## Histórico vs atual (sinal por nome) — INFERIDO
- Padrões como `hist`, `historico`, `history`, `log` sugerem tabelas históricas/auditáveis.
- Isso será refinado cruzando campos de data/versionamento e uso real nas consultas (FASE 4).
