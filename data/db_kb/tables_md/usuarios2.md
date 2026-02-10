# Tabela `azportoex.usuarios2`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `usuarios2`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `111`
- **Create time**: `2025-09-07T17:41:33`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `seguranca_autenticacao`
- **Evidência**: `inferido_por_nome:/(user|usuario|usuarios|perfil|role|permiss|auth|login|token|sess)/`

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
| 1 | `id_usuario` | `int` | NO | `0` | `` | `` | `` |
| 2 | `logim` | `varchar(45)` | NO | `` | `` | `` | `` |
| 3 | `senha` | `varchar(65)` | NO | `8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92` | `` | `` | `` |
| 4 | `primeiro_nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 5 | `nome_completo` | `varchar(255)` | NO | `` | `` | `` | `` |
| 6 | `data_nascimento` | `date` | NO | `` | `` | `` | `` |
| 7 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `cadastro` | `int` | NO | `1` | `` | `` | `` |
| 9 | `comercial` | `int` | NO | `0` | `` | `` | `` |
| 10 | `gerencia` | `int` | NO | `0` | `` | `` | `` |
| 11 | `financeiro` | `int` | NO | `0` | `` | `` | `` |
| 12 | `operacional` | `int` | NO | `0` | `` | `` | `` |
| 13 | `ctrc` | `tinyint` | YES | `0` | `` | `` | `` |
| 14 | `limite_emissao_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 15 | `sistema` | `int` | NO | `0` | `` | `` | `` |
| 16 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 17 | `status` | `int` | NO | `1` | `` | `` | `` |
| 18 | `usuario_sistema` | `smallint` | NO | `0` | `` | `` | `` |
| 19 | `data` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 20 | `tempo` | `varchar(5)` | YES | `` | `` | `` | `` |
| 21 | `fiscal` | `int unsigned` | NO | `2` | `` | `` | `` |
| 22 | `pre_alerta` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `notificacao` | `int unsigned` | NO | `1` | `` | `` | `` |
| 24 | `sac` | `int unsigned` | NO | `2` | `` | `` | `` |
| 25 | `wms` | `int unsigned` | NO | `2` | `` | `` | `` |
| 26 | `sessao` | `varchar(40)` | YES | `` | `` | `` | `` |
| 27 | `acesso_ip` | `varchar(20)` | YES | `` | `` | `` | `` |
| 28 | `awb` | `tinyint` | YES | `0` | `` | `` | `` |
| 29 | `salvaMinuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 30 | `aprova_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 31 | `liquidar_pagamentos` | `int` | YES | `0` | `` | `` | `` |
| 32 | `cancelar_pagamento` | `int` | YES | `0` | `` | `` | `` |
| 33 | `abonar_pagamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 34 | `resultado_op` | `int` | YES | `1` | `` | `` | `` |
| 35 | `grupo` | `smallint` | YES | `0` | `` | `` | `` |
| 36 | `lancamentos_index` | `tinyint` | YES | `0` | `` | `` | `` |
| 37 | `autoriza_ressarcimento` | `int` | YES | `0` | `` | `` | `` |
| 38 | `aprova_manifesto` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 39 | `liberar_picking` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 40 | `recuperacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 41 | `assinatura` | `varchar(60)` | YES | `` | `` | `` | `` |
| 42 | `remove_restricao` | `char(1)` | YES | `1` | `` | `` | `` |
| 43 | `desconto_cotacao` | `tinyint` | YES | `1` | `` | `` | `` |
| 44 | `remover_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 45 | `vigencia` | `date` | YES | `` | `` | `` | `` |
| 46 | `altera_vendedor` | `tinyint` | YES | `0` | `` | `` | `` |
| 47 | `comissao_vendedor` | `tinyint` | YES | `1` | `` | `` | `` |
| 48 | `verificaAgenda` | `tinyint` | YES | `0` | `` | `` | `` |
| 49 | `tipo` | `tinyint` | YES | `0` | `` | `` | `` |
| 50 | `id_movel` | `int` | YES | `0` | `` | `` | `` |
| 51 | `assinatura_email` | `varchar(100)` | YES | `` | `` | `` | `` |
| 52 | `alerta_operacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 53 | `recebe_relacionamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 54 | `alerta_emissao` | `tinyint` | YES | `0` | `` | `` | `` |
| 55 | `salva_despacho` | `tinyint` | YES | `0` | `` | `` | `` |
| 56 | `movel_exclui_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 57 | `limite_desconto` | `json` | YES | `` | `` | `` | `` |
| 58 | `valornf` | `tinyint` | YES | `0` | `` | `` | `` |
| 59 | `lancamento_desconto` | `int` | YES | `1` | `` | `` | `` |
| 60 | `lancamento_multa` | `int` | YES | `1` | `` | `` | `` |
| 61 | `status_tabela` | `tinyint` | YES | `0` | `` | `` | `` |
| 62 | `alerta_app` | `tinyint` | YES | `0` | `` | `` | `` |
| 63 | `impressao_tabela` | `tinyint` | YES | `` | `` | `` | `` |
| 64 | `mostrar_todos_cc` | `int` | YES | `1` | `` | `` | `` |
| 65 | `compoe_dre` | `tinyint` | YES | `0` | `` | `` | `` |
| 66 | `libera_autorizacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 67 | `cotar_pedido_compra` | `tinyint` | YES | `0` | `` | `` | `` |
| 68 | `autorizar_pedido_compra` | `tinyint` | YES | `0` | `` | `` | `` |
| 69 | `recebe_relatorio_agendamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 70 | `altera_lan` | `tinyint` | YES | `0` | `` | `` | `` |
| 71 | `ocorrencias` | `tinyint` | YES | `0` | `` | `` | `` |
| 72 | `altera_forma_pagamento_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 73 | `altera_dados_recebedor` | `tinyint` | YES | `0` | `` | `` | `` |
| 74 | `negocia_frete` | `tinyint` | YES | `0` | `` | `` | `` |
| 75 | `ver_restricao` | `tinyint` | YES | `0` | `` | `` | `` |
| 76 | `salva_coleta` | `tinyint` | YES | `2` | `` | `` | `` |
| 77 | `salva_cotacao` | `tinyint` | YES | `2` | `` | `` | `` |
| 78 | `alerta_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 79 | `libera_limite` | `tinyint` | YES | `0` | `` | `` | `` |
| 80 | `altera_memo` | `int` | YES | `0` | `` | `` | `` |
| 81 | `recebe_crm` | `tinyint` | YES | `0` | `` | `` | `` |
| 82 | `ordem_minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 83 | `ordem_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 84 | `smart` | `tinyint` | YES | `0` | `` | `` | `` |
| 85 | `preview_coleta` | `tinyint(1)` | YES | `2` | `` | `` | `` |
| 86 | `altera_valor_receber` | `tinyint` | YES | `0` | `` | `` | `` |
| 87 | `altera_valor_pagar` | `tinyint` | YES | `0` | `` | `` | `` |
| 88 | `suporte` | `tinyint` | YES | `1` | `` | `` | `` |
| 89 | `altera_previsao` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 90 | `remove_minuta_manifesto` | `int` | YES | `0` | `` | `` | `` |
| 91 | `limite_acrescimo` | `json` | YES | `` | `` | `` | `` |
| 92 | `acrescimo_cotacao` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 93 | `operador` | `int` | YES | `` | `` | `` | `` |
| 94 | `gerar_carta_correcao` | `int` | YES | `0` | `` | `` | `` |
| 95 | `gerar_cte_complementar` | `int` | YES | `0` | `` | `` | `` |
| 96 | `gerar_cte_sub` | `int` | YES | `0` | `` | `` | `` |
| 97 | `gerar_cte_anula` | `int` | YES | `0` | `` | `` | `` |
| 98 | `relatorio_averbacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 99 | `alerta_pos_embarque` | `tinyint` | YES | `0` | `` | `` | `` |
| 100 | `protestar_pagamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 101 | `regiao_sac` | `tinyint` | YES | `0` | `` | `` | `` |
| 102 | `fcm` | `varchar(255)` | YES | `` | `` | `` | `` |
| 103 | `recebe_email_sac` | `tinyint` | YES | `0` | `` | `` | `` |
| 104 | `ordem_despacho` | `tinyint` | YES | `1` | `` | `` | `` |
| 105 | `preview_despacho` | `tinyint` | YES | `2` | `` | `` | `` |
| 106 | `avalia_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 107 | `acompanha_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 108 | `alerta_perecivel` | `tinyint` | YES | `0` | `` | `` | `` |
| 109 | `remove_anexo_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 110 | `remove_anexo_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 111 | `ordem_coleta_responsavel` | `tinyint` | YES | `1` | `` | `` | `` |
| 112 | `recebe_email_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 113 | `gps_obrigatorio` | `tinyint` | YES | `0` | `` | `` | `` |
| 114 | `pode_extornar` | `tinyint` | YES | `0` | `` | `` | `` |
| 115 | `valida_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 116 | `visualiza_entregas_app` | `int` | YES | `1` | `` | `` | `` |
| 117 | `visualiza_coletas_app` | `int` | YES | `1` | `` | `` | `` |
| 118 | `altera_pagamento_coleta` | `int` | YES | `1` | `` | `` | `` |
| 119 | `negocia_frete_manifesto` | `int` | YES | `1` | `` | `` | `` |
| 120 | `acompanha_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 121 | `vecto_doc` | `int` | YES | `0` | `` | `` | `` |
| 122 | `alterar_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 123 | `tentativas_bonificacao` | `int` | YES | `` | `` | `` | `` |
| 124 | `tipo_desconto_bonificacao` | `int` | YES | `` | `` | `` | `` |
| 125 | `desconto_bonificacao` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 126 | `recebe_por_bonificacao` | `int` | YES | `` | `` | `` | `` |
| 127 | `tipo_valor_bonificacao` | `int` | YES | `` | `` | `` | `` |
| 128 | `valor_bonificacao` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 129 | `recebe_bonificacao` | `int` | YES | `` | `` | `` | `` |
| 130 | `ve_custo_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 131 | `ve_custo_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 132 | `ve_custo_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 133 | `ve_custo_despacho` | `tinyint` | YES | `0` | `` | `` | `` |
| 134 | `ve_custo_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 135 | `visualiza_tabelas` | `tinyint` | YES | `0` | `` | `` | `` |
| 136 | `estorna_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 137 | `alt_prev_entrega` | `tinyint` | YES | `1` | `` | `` | `` |
| 138 | `pesquisa_cnpj_cotacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 139 | `pesquisa_cnpj_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 140 | `pesquisa_cnpj_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 141 | `manter_valor_transportado` | `tinyint` | YES | `1` | `` | `` | `` |
| 142 | `id_mercado_pago` | `varchar(100)` | YES | `` | `` | `` | `` |
| 143 | `celular` | `varchar(15)` | YES | `` | `` | `` | `` |
| 144 | `data_atualizacao_cadastro` | `datetime` | YES | `` | `` | `` | `` |
| 145 | `pergunta_secreta` | `varchar(500)` | YES | `` | `` | `` | `` |
| 146 | `receber_memo_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 147 | `lucro_minimo_emissao_cte` | `decimal(6,2)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_usuario`, `id_movel`, `id_mercado_pago`
- **Datas/tempos prováveis**: `data_nascimento`, `limite_emissao_cte`, `data`, `vigencia`, `alerta_emissao`, `data_atualizacao_cadastro`, `lucro_minimo_emissao_cte`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `usuarios2`
