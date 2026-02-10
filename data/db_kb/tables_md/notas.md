# Tabela `azportoex.notas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `27852`
- **Create time**: `2025-09-07T17:40:14`
- **Update time**: `2025-12-17T16:45:21`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_nota`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `notas_hist.nota` → `notas.id_nota` (constraint=`fk_notas_hist_notas`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_nota`]
- `idx_awb` type=`BTREE` non_unique=`True` cols=[`awb`]
- `idx_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]
- `idx_nfe_chave` type=`BTREE` non_unique=`True` cols=[`nfe_chave`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_nota` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `int unsigned` | NO | `` | `` | `` | `` |
| 3 | `tipo_nf` | `int unsigned` | NO | `` | `` | `` | `` |
| 4 | `data_entrada` | `date` | NO | `` | `` | `` | `` |
| 5 | `situacao` | `int` | YES | `` | `` | `` | `` |
| 6 | `ordem_compra` | `varchar(45)` | YES | `` | `` | `` | `` |
| 7 | `nfe_chave` | `varchar(55)` | YES | `` | `` | `MUL` | `` |
| 8 | `nf_numero` | `varchar(15)` | YES | `` | `` | `` | `` |
| 9 | `nf_serie` | `varchar(5)` | YES | `` | `` | `` | `` |
| 10 | `nf_data` | `date` | NO | `` | `` | `` | `` |
| 11 | `nf_operacao` | `int` | YES | `` | `` | `` | `` |
| 12 | `fornecedor` | `int unsigned` | NO | `` | `` | `` | `` |
| 13 | `obs` | `varchar(400)` | YES | `` | `` | `` | `` |
| 14 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 15 | `centro_custo` | `int` | YES | `` | `` | `` | `` |
| 16 | `nf_bc_icms` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 17 | `nf_icms` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 18 | `nf_bc_icms_st` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 19 | `nf_bc_icms_st_valor` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 20 | `nf_produtos` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 21 | `nf_frete` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 22 | `nf_seguro` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 23 | `nf_icms_aliquota` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 24 | `nf_ipi` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 25 | `nf_total` | `decimal(18,2)` | YES | `` | `` | `` | `` |
| 26 | `tipo_imposto` | `int` | YES | `` | `` | `` | `` |
| 27 | `awb` | `varchar(45)` | YES | `` | `` | `MUL` | `` |
| 28 | `origem` | `varchar(45)` | YES | `` | `` | `` | `` |
| 29 | `destino` | `varchar(45)` | YES | `` | `` | `` | `` |
| 30 | `volumes` | `decimal(12,2) unsigned` | YES | `0.00` | `` | `` | `` |
| 31 | `peso_real` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 32 | `status` | `int unsigned` | NO | `` | `` | `` | `` |
| 33 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 34 | `hora_incluido` | `varchar(45)` | YES | `` | `` | `` | `` |
| 35 | `operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 36 | `peso_cubado` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 37 | `manifesto` | `varchar(45)` | YES | `` | `` | `MUL` | `` |
| 38 | `remetente` | `int unsigned` | NO | `` | `` | `` | `` |
| 39 | `destinatario` | `int unsigned` | NO | `` | `` | `` | `` |
| 40 | `expedidor` | `int unsigned` | YES | `` | `` | `` | `` |
| 41 | `entrega` | `int unsigned` | YES | `` | `` | `` | `` |
| 42 | `sintegra` | `int` | YES | `` | `` | `` | `` |
| 43 | `cfop` | `varchar(45)` | YES | `` | `` | `` | `` |
| 44 | `altera_data` | `date` | YES | `` | `` | `` | `` |
| 45 | `altera_operador` | `int` | YES | `` | `` | `` | `` |
| 46 | `alterado_hora` | `varchar(10)` | YES | `` | `` | `` | `` |
| 47 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 48 | `partida_voo` | `varchar(7)` | YES | `` | `` | `` | `` |
| 49 | `partida_data` | `date` | YES | `` | `` | `` | `` |
| 50 | `partida_hora` | `varchar(9)` | YES | `` | `` | `` | `` |
| 51 | `confirmado_voo` | `varchar(7)` | YES | `` | `` | `` | `` |
| 52 | `confirmado_data` | `date` | YES | `` | `` | `` | `` |
| 53 | `confirmado_hora` | `varchar(9)` | YES | `` | `` | `` | `` |
| 54 | `chegada_voo` | `varchar(7)` | YES | `` | `` | `` | `` |
| 55 | `chegada_data` | `date` | YES | `` | `` | `` | `` |
| 56 | `chegada_hora` | `varchar(9)` | YES | `` | `` | `` | `` |
| 57 | `retirado_data` | `date` | YES | `` | `` | `` | `` |
| 58 | `retirado_hora` | `varchar(9)` | YES | `` | `` | `` | `` |
| 59 | `retirado_nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 60 | `tomador` | `int unsigned` | NO | `0` | `` | `` | `` |
| 61 | `servico` | `int` | YES | `` | `` | `` | `` |
| 62 | `oco_envio` | `varchar(25)` | YES | `` | `` | `` | `` |
| 63 | `seguro` | `int unsigned` | NO | `0` | `` | `` | `` |
| 64 | `seguro_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 65 | `total_hist` | `int` | YES | `0` | `` | `` | `` |
| 66 | `fatura` | `int` | NO | `0` | `` | `` | `` |
| 67 | `ambiente` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 68 | `nfe_status` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 69 | `hora_es` | `varchar(8)` | YES | `00:00:00` | `` | `` | `` |
| 70 | `pis` | `float` | YES | `` | `` | `` | `` |
| 71 | `cofins` | `float` | YES | `` | `` | `` | `` |
| 72 | `recibo` | `varchar(15)` | YES | `` | `` | `` | `` |
| 73 | `protocolo` | `varchar(15)` | YES | `` | `` | `` | `` |
| 74 | `arquivo` | `mediumtext` | YES | `` | `` | `` | `` |
| 75 | `obs_fisco` | `varchar(60)` | YES | `` | `` | `` | `` |
| 76 | `prot_canc` | `varchar(20)` | YES | `` | `` | `` | `` |
| 77 | `prot_inut` | `varchar(20)` | YES | `` | `` | `` | `` |
| 78 | `transp` | `int` | YES | `0` | `` | `` | `` |
| 79 | `esp` | `varchar(45)` | YES | `` | `` | `` | `` |
| 80 | `marca` | `varchar(45)` | YES | `` | `` | `` | `` |
| 81 | `evt_cce` | `tinyint` | YES | `0` | `` | `` | `` |
| 82 | `frete_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 83 | `despacha_resp` | `tinyint` | YES | `` | `` | `` | `` |
| 84 | `retira_resp` | `tinyint` | YES | `` | `` | `` | `` |
| 85 | `retira_resp_id` | `int` | YES | `` | `` | `` | `` |
| 86 | `retira_motorista` | `int` | YES | `` | `` | `` | `` |
| 87 | `despachado` | `tinyint` | YES | `0` | `` | `` | `` |
| 88 | `despacha_resp_id` | `int` | YES | `` | `` | `` | `` |
| 89 | `despacha_motorista` | `int` | YES | `` | `` | `` | `` |
| 90 | `pre_embarque` | `varchar(15)` | YES | `` | `` | `` | `` |
| 91 | `forn` | `int` | YES | `` | `` | `` | `` |
| 92 | `peso` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 93 | `soma_minuta` | `tinyint` | YES | `0` | `` | `` | `` |
| 94 | `rateio` | `tinyint` | YES | `1` | `` | `` | `` |
| 95 | `nf_desconto` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 96 | `tipo_embalagem` | `int` | YES | `0` | `` | `` | `` |
| 97 | `spot` | `varchar(25)` | YES | `` | `` | `` | `` |
| 98 | `peso_cte` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 99 | `frete_cte` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 100 | `natureza` | `int` | NO | `0` | `` | `` | `` |
| 101 | `perecivel` | `tinyint` | YES | `` | `` | `` | `` |
| 102 | `prazo_aereo` | `tinyint unsigned` | YES | `` | `` | `` | `` |
| 103 | `valor_transp` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 104 | `liberado` | `tinyint` | YES | `1` | `` | `` | `` |
| 105 | `coleta_domicilio` | `tinyint` | YES | `` | `` | `` | `` |
| 106 | `entrega_domicilio` | `tinyint` | YES | `` | `` | `` | `` |
| 107 | `pagamento_destino` | `tinyint` | YES | `` | `` | `` | `` |
| 108 | `volume_alterado` | `tinyint` | YES | `0` | `` | `` | `` |
| 109 | `fabricante` | `int` | YES | `` | `` | `` | `` |
| 110 | `container` | `varchar(15)` | YES | `` | `` | `` | `` |
| 111 | `mercadoria_paletizada` | `tinyint` | NO | `0` | `` | `` | `` |
| 112 | `volumes_palets` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_nota`, `retira_resp_id`, `despacha_resp_id`
- **Datas/tempos prováveis**: `data_entrada`, `nf_data`, `data_incluido`, `hora_incluido`, `altera_data`, `alterado_hora`, `partida_data`, `partida_hora`, `confirmado_data`, `confirmado_hora`, `chegada_data`, `chegada_hora`, `retirado_data`, `retirado_hora`, `hora_es`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:45:21`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `notas`
