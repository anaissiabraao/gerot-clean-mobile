# Tabela `azportoex.status_sistema`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `status_sistema`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-10-02T19:11:57`
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
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `data_alterado` | `datetime` | NO | `` | `` | `` | `` |
| 3 | `ultimo_usuario` | `int` | NO | `` | `` | `` | `` |
| 4 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `ciot` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `cfop` | `smallint` | YES | `949` | `` | `` | `` |
| 7 | `data_troca` | `date` | YES | `` | `` | `` | `` |
| 8 | `icms` | `int` | NO | `0` | `` | `` | `` |
| 9 | `tabela_vinculada` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `aut_doisFatores` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `aut_token_validade` | `int` | NO | `10` | `` | `` | `` |
| 12 | `simbolo_monetario` | `int` | YES | `0` | `` | `` | `` |
| 13 | `cidades_atendidas` | `tinyint` | YES | `0` | `` | `` | `` |
| 14 | `considera_tabela_frete_cliente` | `tinyint` | YES | `1` | `` | `` | `` |
| 15 | `exibir_tarifa` | `int` | YES | `0` | `` | `` | `` |
| 16 | `bloq_despacho_consolidacao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 17 | `auto_email` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 18 | `fatura_multimodal` | `tinyint` | YES | `1` | `` | `` | `` |
| 19 | `bloq_servico` | `tinyint` | YES | `0` | `` | `` | `` |
| 20 | `aprova_cotacao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 21 | `tipoPeso` | `tinyint` | YES | `0` | `` | `` | `` |
| 22 | `arredondamento_peso` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `fat_automatico` | `tinyint` | YES | `0` | `` | `` | `` |
| 24 | `dias_bloqueio` | `tinyint` | YES | `0` | `` | `` | `` |
| 25 | `tipo_faturamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 26 | `faturas_bloqueio` | `tinyint` | YES | `0` | `` | `` | `` |
| 27 | `cred_limite` | `tinyint` | YES | `0` | `` | `` | `` |
| 28 | `cred_fechamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 29 | `opcao_faturamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 30 | `cred_dias_vecto` | `tinyint` | YES | `0` | `` | `` | `` |
| 31 | `dias_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 32 | `valor_max_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 33 | `select_forma_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 34 | `cte_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 35 | `conta` | `tinyint` | YES | `0` | `` | `` | `` |
| 36 | `nf_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 37 | `protestar` | `tinyint` | YES | `0` | `` | `` | `` |
| 38 | `tipo_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 39 | `cod_pais` | `int` | YES | `1058` | `` | `` | `` |
| 40 | `atendimento` | `tinyint` | YES | `0` | `` | `` | `` |
| 41 | `calcula_seg_mult` | `tinyint` | YES | `1` | `` | `` | `` |
| 42 | `fatura_retroativa` | `tinyint` | YES | `0` | `` | `` | `` |
| 43 | `cst_padrao` | `tinyint(1)` | YES | `7` | `` | `` | `` |
| 44 | `exibe_consolidador` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 45 | `ocorrencias_somente_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 46 | `inserir_motivo` | `tinyint` | YES | `0` | `` | `` | `` |
| 47 | `libera_contra` | `tinyint` | YES | `0` | `` | `` | `` |
| 48 | `mostra_valor_frete` | `tinyint` | YES | `1` | `` | `` | `` |
| 49 | `coleta_solicitante` | `tinyint` | NO | `1` | `` | `` | `` |
| 50 | `coleta_peso` | `tinyint` | NO | `0` | `` | `` | `` |
| 51 | `coleta_volumes` | `tinyint` | NO | `0` | `` | `` | `` |
| 52 | `coleta_valor_transp` | `tinyint` | NO | `0` | `` | `` | `` |
| 53 | `coleta_autorizacao` | `tinyint` | NO | `0` | `` | `` | `` |
| 54 | `coleta_ordem_servico` | `tinyint` | NO | `0` | `` | `` | `` |
| 55 | `calcula_icms_mult` | `tinyint` | YES | `0` | `` | `` | `` |
| 56 | `modo_oco` | `tinyint` | NO | `0` | `` | `` | `` |
| 57 | `lancamento_descricao` | `tinyint` | YES | `` | `` | `` | `` |
| 58 | `lancamento_anexo` | `tinyint` | YES | `` | `` | `` | `` |
| 59 | `lancamento_memo` | `tinyint` | YES | `` | `` | `` | `` |
| 60 | `lancamento_conta_banco` | `tinyint` | YES | `` | `` | `` | `` |
| 61 | `lancamento_linha` | `tinyint` | YES | `` | `` | `` | `` |
| 62 | `lancamento_multa` | `tinyint` | YES | `` | `` | `` | `` |
| 63 | `lancamento_juros` | `tinyint` | YES | `` | `` | `` | `` |
| 64 | `lancamento_dias_protesto` | `tinyint` | YES | `` | `` | `` | `` |
| 65 | `lancamento_cheque` | `tinyint` | YES | `` | `` | `` | `` |
| 66 | `lancamento_documento` | `tinyint` | YES | `` | `` | `` | `` |
| 67 | `bloquear_conferencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 68 | `coleta_automatica` | `bit(1)` | YES | `b'0'` | `` | `` | `` |
| 69 | `unidade` | `tinyint` | YES | `0` | `` | `` | `` |
| 70 | `base_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 71 | `fatura_pag_a_vista` | `tinyint` | YES | `1` | `` | `` | `` |
| 72 | `mostrar_frete_site` | `tinyint` | YES | `0` | `` | `` | `` |
| 73 | `mostrar_etiqueta_config` | `tinyint` | YES | `0` | `` | `` | `` |
| 74 | `cliente` | `tinyint` | YES | `1` | `` | `` | `` |
| 75 | `local` | `tinyint` | YES | `0` | `` | `` | `` |
| 76 | `fornecedor` | `tinyint` | YES | `0` | `` | `` | `` |
| 77 | `apresenta_chave_mdfe` | `tinyint` | YES | `1` | `` | `` | `` |
| 78 | `servicos_vinculados` | `tinyint` | YES | `0` | `` | `` | `` |
| 79 | `bloq_coleta_seguradora` | `tinyint` | NO | `0` | `` | `` | `` |
| 80 | `gerenciamentoAWB` | `varchar(10)` | YES | `` | `` | `` | `` |
| 81 | `valida_km_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 82 | `valida_tipo_cadastro` | `tinyint` | NO | `0` | `` | `` | `` |
| 83 | `status_financeiro` | `tinyint` | YES | `1` | `` | `` | `` |
| 84 | `ev_comp_entrega_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 85 | `oco_envio` | `varchar(25)` | YES | `0;0;0;0` | `` | `` | `` |
| 86 | `email_despacho` | `int` | YES | `0` | `` | `` | `` |
| 87 | `emissao_mdfe` | `tinyint` | YES | `1` | `` | `` | `` |
| 88 | `motivo_cancelamento_minuta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 89 | `motivo_cancelamento_coleta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 90 | `motivo_cancelamento_cotacao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 91 | `motivo_cancelamento_manifesto` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 92 | `motivo_cancelamento_cte` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 93 | `minuta_resp_coleta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 94 | `minuta_resp_entrega` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 95 | `minuta_resp_despacho_embarque` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 96 | `minuta_resp_despacho_retira` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 97 | `minuta_cia_transf` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 98 | `minuta_custo_transf` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 99 | `minuta_custo_coleta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 100 | `minuta_custo_entrega` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 101 | `minuta_custo_embarque` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 102 | `minuta_custo_retira` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 103 | `nao_finaliza_coleta` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 104 | `exige_liberacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 105 | `contato_geral` | `tinyint` | YES | `0` | `` | `` | `` |
| 106 | `numero_manifesto_ciot` | `tinyint` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data_alterado`, `data_troca`, `emissao_mdfe`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `status`, `sistema`
