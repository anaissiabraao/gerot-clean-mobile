# Tabela `azportoex.manifesto`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `manifesto`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `78583`
- **Create time**: `2025-10-11T06:51:08`
- **Update time**: `2025-12-17T16:50:27`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_manifesto`

## Chaves estrangeiras (evidência estrutural)
- `fatura` → `fatura.id_fatura` (constraint=`fk_manifesto_fatura`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- `ajudantes_manifesto.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_ajudante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_manifesto.manifesto_numero` → `manifesto.id_manifesto` (constraint=`fk_ciot_manifesto_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `historico_volume.manifesto` → `manifesto.id_manifesto` (constraint=`fk_historico_volume_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifest_charge.manifestId` → `manifesto.id_manifesto` (constraint=`manifest_charge_ibfk_1`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto.viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `manifesto_historico.manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_historico_man`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `picking.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_picking_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `rateio_manual.manifestId` → `manifesto.id_manifesto` (constraint=`fk_manifesto_rateio`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_manifesto`]
- `fk_manifesto_fatura` type=`BTREE` non_unique=`True` cols=[`fatura`]
- `fk_manifesto_viagem` type=`BTREE` non_unique=`True` cols=[`viagem`]
- `idx_data_emissao` type=`BTREE` non_unique=`True` cols=[`data_emissao`]
- `idx_motorista` type=`BTREE` non_unique=`True` cols=[`motorista`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_manifesto` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo` | `int` | NO | `` | `` | `` | `` |
| 3 | `lacre_direita` | `varchar(15)` | YES | `` | `` | `` | `` |
| 4 | `lacre_traseira` | `varchar(15)` | YES | `` | `` | `` | `` |
| 5 | `lacre_esquerda` | `varchar(15)` | YES | `` | `` | `` | `` |
| 6 | `lacre_outro` | `varchar(15)` | YES | `` | `` | `` | `` |
| 7 | `cheque` | `varchar(45)` | YES | `` | `` | `` | `` |
| 8 | `id_agente` | `int` | YES | `` | `` | `` | `` |
| 9 | `id_transf` | `int` | YES | `` | `` | `` | `` |
| 10 | `minuta_transf` | `varchar(30)` | YES | `` | `` | `` | `` |
| 11 | `custo_transf` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 12 | `peso_transf` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 13 | `prev_saida_data` | `date` | YES | `` | `` | `` | `` |
| 14 | `prev_saida_hora` | `time` | YES | `` | `` | `` | `` |
| 15 | `prev_chegada_data` | `date` | YES | `` | `` | `` | `` |
| 16 | `prev_chegada_hora` | `time` | YES | `` | `` | `` | `` |
| 17 | `modal` | `int` | YES | `` | `` | `` | `` |
| 18 | `saida_efetiva_data` | `date` | YES | `` | `` | `` | `` |
| 19 | `saida_efetiva_hora` | `time` | YES | `` | `` | `` | `` |
| 20 | `data_emissao` | `date` | YES | `` | `` | `MUL` | `` |
| 21 | `hora_emissao` | `time` | YES | `` | `` | `` | `` |
| 22 | `motorista` | `int` | YES | `` | `` | `MUL` | `` |
| 23 | `gerenciadora` | `int` | YES | `0` | `` | `` | `` |
| 24 | `operador` | `int` | YES | `` | `` | `` | `` |
| 25 | `base` | `smallint` | YES | `` | `` | `` | `` |
| 26 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 27 | `barra` | `int` | YES | `0` | `` | `` | `` |
| 28 | `arquivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 29 | `veiculo` | `int unsigned` | YES | `` | `` | `` | `` |
| 30 | `obs` | `varchar(400)` | YES | `` | `` | `` | `` |
| 31 | `chegada_efetiva_data` | `date` | YES | `` | `` | `` | `` |
| 32 | `chegada_efetiva_hora` | `time` | YES | `` | `` | `` | `` |
| 33 | `valor_aprovado` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 34 | `data_conferencia` | `date` | YES | `` | `` | `` | `` |
| 35 | `hora_conferencia` | `time` | YES | `` | `` | `` | `` |
| 36 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 37 | `volumes_transf` | `int unsigned` | YES | `` | `` | `` | `` |
| 38 | `transf_origem` | `varchar(45)` | YES | `` | `` | `` | `` |
| 39 | `transf_destino` | `varchar(45)` | YES | `` | `` | `` | `` |
| 40 | `chave_awb` | `varchar(46)` | YES | `` | `` | `` | `` |
| 41 | `custo_motorista` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 42 | `custo_motorista_extra` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 43 | `adiantamento` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 44 | `pedagio` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 45 | `picking` | `smallint` | YES | `0` | `` | `` | `` |
| 46 | `km_inicial` | `int` | YES | `` | `` | `` | `` |
| 47 | `km_final` | `int` | YES | `` | `` | `` | `` |
| 48 | `km_rodado` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 49 | `mdfe_num` | `int` | YES | `0` | `` | `` | `` |
| 50 | `ciot` | `varchar(12)` | YES | `` | `` | `` | `` |
| 51 | `chaveMDFE` | `varchar(45)` | YES | `` | `` | `` | `` |
| 52 | `protMDFE` | `varchar(16)` | YES | `` | `` | `` | `` |
| 53 | `dataMDFE` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 54 | `mdf_status` | `smallint` | YES | `0` | `` | `` | `` |
| 55 | `horaMDFE` | `varchar(8)` | YES | `` | `` | `` | `` |
| 56 | `destino` | `varchar(7)` | YES | `0` | `` | `` | `` |
| 57 | `statusMDFE` | `smallint` | YES | `0` | `` | `` | `` |
| 58 | `tipo_ve` | `int unsigned` | NO | `0` | `` | `` | `` |
| 59 | `tara` | `int` | YES | `0` | `` | `` | `` |
| 60 | `ajudante` | `int unsigned` | YES | `` | `` | `` | `` |
| 61 | `segundo_ajudante` | `int` | YES | `` | `` | `` | `` |
| 62 | `partidaVoo` | `varchar(8)` | YES | `` | `` | `` | `` |
| 63 | `partidaCusto` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 64 | `voltaCia` | `int unsigned` | YES | `0` | `` | `` | `` |
| 65 | `voltaTicket` | `varchar(15)` | YES | `` | `` | `` | `` |
| 66 | `voltaCusto` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 67 | `voltaVoo` | `varchar(8)` | YES | `` | `` | `` | `` |
| 68 | `fretaPrefixo` | `varchar(12)` | YES | `` | `` | `` | `` |
| 69 | `tpAmb` | `tinyint` | YES | `0` | `` | `` | `` |
| 70 | `origem_mdfe` | `int` | YES | `0` | `` | `` | `` |
| 71 | `destino_mdfe` | `int` | YES | `0` | `` | `` | `` |
| 72 | `data_conferencia_saida` | `date` | YES | `` | `` | `` | `` |
| 73 | `hora_conferencia_saida` | `time` | YES | `` | `` | `` | `` |
| 74 | `doca` | `int` | YES | `` | `` | `` | `` |
| 75 | `liberacaoSeguradora` | `varchar(45)` | YES | `` | `` | `` | `` |
| 76 | `tipoMotorista` | `tinyint` | YES | `1` | `` | `` | `` |
| 77 | `servico` | `int` | YES | `0` | `` | `` | `` |
| 78 | `fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 79 | `tipoManifesto` | `tinyint` | YES | `1` | `` | `` | `` |
| 80 | `lib_seguro` | `varchar(20)` | YES | `` | `` | `` | `` |
| 81 | `data_conferencia_saita` | `date` | YES | `` | `` | `` | `` |
| 82 | `transf_conexao` | `int` | YES | `0` | `` | `` | `` |
| 83 | `veiculo_terceiro` | `int` | YES | `` | `` | `` | `` |
| 84 | `ajudante_terceiro` | `int` | YES | `0` | `` | `` | `` |
| 85 | `ajudante_agente` | `int` | YES | `0` | `` | `` | `` |
| 86 | `motorista_agente` | `int` | YES | `0` | `` | `` | `` |
| 87 | `veiculo_agente` | `int` | YES | `` | `` | `` | `` |
| 88 | `conferente_doca` | `int` | YES | `0` | `` | `` | `` |
| 89 | `conferente_inicio` | `time` | YES | `` | `` | `` | `` |
| 90 | `conferente_fim` | `time` | YES | `` | `` | `` | `` |
| 91 | `data_finalizado` | `date` | YES | `` | `` | `` | `` |
| 92 | `rateio` | `tinyint` | YES | `1` | `` | `` | `` |
| 93 | `ordem_impressao` | `tinyint` | YES | `0` | `` | `` | `` |
| 94 | `rota` | `int` | YES | `` | `` | `` | `` |
| 95 | `total_nf_valor` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 96 | `reboque` | `int` | YES | `` | `` | `` | `` |
| 97 | `avaliacao_manifesto` | `tinyint` | YES | `` | `` | `` | `` |
| 98 | `liberar_rastreamento` | `tinyint` | YES | `` | `` | `` | `` |
| 99 | `tipo_rateio` | `tinyint` | YES | `0` | `` | `` | `` |
| 100 | `valor_total_km` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 101 | `codigo` | `int` | YES | `` | `` | `` | `Codigo de referencia em sistema de integração` |
| 102 | `valor_minimo_km` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 103 | `valor_diaria` | `int` | YES | `0` | `` | `` | `` |
| 104 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 105 | `adm_ciot` | `int` | YES | `` | `` | `` | `` |
| 106 | `humor_motorista` | `tinyint` | YES | `` | `` | `` | `` |
| 107 | `reboque_agente` | `int` | YES | `` | `` | `` | `` |
| 108 | `categoria_veiculo` | `int` | YES | `` | `` | `` | `` |
| 109 | `viagem` | `int` | YES | `` | `` | `MUL` | `` |
| 110 | `local_descarga_id` | `int` | YES | `` | `` | `` | `` |
| 111 | `libera_fatura` | `tinyint` | YES | `` | `` | `` | `` |
| 112 | `valor_fiscal` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_manifesto`, `id_agente`, `id_transf`, `local_descarga_id`
- **Datas/tempos prováveis**: `prev_saida_data`, `prev_saida_hora`, `prev_chegada_data`, `prev_chegada_hora`, `saida_efetiva_data`, `saida_efetiva_hora`, `data_emissao`, `hora_emissao`, `chegada_efetiva_data`, `chegada_efetiva_hora`, `data_conferencia`, `hora_conferencia`, `dataMDFE`, `horaMDFE`, `data_conferencia_saida`, `hora_conferencia_saida`, `data_conferencia_saita`, `conferente_inicio`, `conferente_fim`, `data_finalizado`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:27`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `manifesto`
