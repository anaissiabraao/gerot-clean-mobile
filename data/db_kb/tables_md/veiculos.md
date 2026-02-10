# Tabela `azportoex.veiculos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `veiculos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `4043`
- **Create time**: `2025-09-07T17:41:36`
- **Update time**: `2025-12-17T16:08:13`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_veiculo`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_veiculo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_veiculo` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `placa` | `varchar(9)` | NO | `` | `` | `` | `` |
| 3 | `renavam` | `varchar(20)` | NO | `` | `` | `` | `` |
| 4 | `marca` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `modelo` | `varchar(60)` | NO | `` | `` | `` | `` |
| 6 | `cor` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `seguro` | `int` | YES | `` | `` | `` | `` |
| 8 | `rastreador` | `int` | YES | `` | `` | `` | `` |
| 9 | `chassi` | `varchar(60)` | YES | `` | `` | `` | `` |
| 10 | `ano` | `int` | NO | `2011` | `` | `` | `` |
| 11 | `ano_modelo` | `int` | YES | `` | `` | `` | `` |
| 12 | `capacidade` | `decimal(14,2)` | YES | `` | `` | `` | `` |
| 13 | `venc_licenciamento` | `date` | YES | `` | `` | `` | `` |
| 14 | `compra` | `date` | YES | `` | `` | `` | `` |
| 15 | `venda` | `date` | YES | `` | `` | `` | `` |
| 16 | `valor_licenciamento` | `decimal(20,2)` | YES | `` | `` | `` | `` |
| 17 | `aco_placa` | `varchar(8)` | YES | `` | `` | `` | `` |
| 18 | `aco_chassi` | `varchar(60)` | YES | `` | `` | `` | `` |
| 19 | `aco_marca` | `varchar(60)` | YES | `` | `` | `` | `` |
| 20 | `aco_modelo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 21 | `aco_capacidade` | `decimal(14,2)` | YES | `` | `` | `` | `` |
| 22 | `aco_cubagem` | `decimal(14,2)` | YES | `` | `` | `` | `` |
| 23 | `aco_tipo` | `int` | YES | `` | `` | `` | `` |
| 24 | `status` | `int` | NO | `1` | `` | `` | `` |
| 25 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 26 | `operador` | `int` | NO | `` | `` | `` | `` |
| 27 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 28 | `tipo_veiculo` | `int unsigned` | NO | `1` | `` | `` | `` |
| 29 | `integrado` | `int unsigned` | NO | `0` | `` | `` | `` |
| 30 | `tara` | `int` | YES | `0` | `` | `` | `` |
| 31 | `tprod` | `varchar(2)` | YES | `` | `` | `` | `` |
| 32 | `tpcar` | `varchar(2)` | YES | `` | `` | `` | `` |
| 33 | `capM3` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 34 | `uf` | `varchar(2)` | NO | `` | `` | `` | `` |
| 35 | `carroceria` | `varchar(2)` | NO | `02` | `` | `` | `` |
| 36 | `rodado` | `varchar(2)` | NO | `05` | `` | `` | `` |
| 37 | `tpAmb` | `tinyint` | NO | `0` | `` | `` | `` |
| 38 | `custoKm` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 39 | `vendaKm` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 40 | `gerenciadora` | `varchar(25)` | YES | `` | `` | `` | `` |
| 41 | `travas` | `int` | YES | `` | `` | `` | `` |
| 42 | `proprietario` | `int` | NO | `` | `` | `` | `` |
| 43 | `tipo_proprietario` | `int` | NO | `` | `` | `` | `` |
| 44 | `seguro_status` | `int` | NO | `0` | `` | `` | `` |
| 45 | `seguro_validade` | `date` | YES | `` | `` | `` | `` |
| 46 | `seguro_autorizacao` | `varchar(35)` | YES | `` | `` | `` | `` |
| 47 | `seguro_data` | `date` | YES | `` | `` | `` | `` |
| 48 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 49 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 50 | `mediaComb` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 51 | `vigencia` | `date` | YES | `` | `` | `` | `` |
| 52 | `id_tabela` | `int` | YES | `0` | `` | `` | `` |
| 53 | `custo_entrega` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 54 | `entrega_primeira` | `int` | YES | `0` | `` | `` | `` |
| 55 | `custo_entrega_dif` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 56 | `custo_km` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 57 | `custo_frete` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 58 | `custo_diaria` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 59 | `rntrc` | `varchar(15)` | YES | `` | `` | `` | `` |
| 60 | `empresa` | `int` | YES | `0` | `` | `` | `` |
| 61 | `validade_checklist` | `date` | YES | `` | `` | `` | `` |
| 62 | `tipo_rastreador` | `tinyint` | YES | `0` | `` | `` | `` |
| 63 | `doc_veiculo` | `varchar(200)` | YES | `` | `` | `` | `` |
| 64 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 65 | `consumo` | `decimal(5,2)` | YES | `` | `` | `` | `` |
| 66 | `eixos` | `tinyint` | YES | `2` | `` | `` | `` |
| 67 | `validade_tacografo` | `date` | YES | `` | `` | `` | `` |
| 68 | `financiamento` | `smallint` | YES | `0` | `` | `` | `` |
| 69 | `financeira` | `int` | YES | `` | `` | `` | `` |
| 70 | `medidas_rodado` | `varchar(45)` | YES | `` | `` | `` | `` |
| 71 | `ipva` | `date` | YES | `` | `` | `` | `` |
| 72 | `valor` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 73 | `base_proprietaria` | `int` | YES | `` | `` | `` | `` |
| 74 | `roteiriza` | `tinyint` | YES | `0` | `` | `` | `` |
| 75 | `data_rastreador` | `timestamp` | YES | `` | `` | `` | `` |
| 76 | `id_categoria_veiculos` | `int` | YES | `` | `` | `` | `` |
| 77 | `maximo_km` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 78 | `tipo_resp` | `tinyint` | YES | `` | `` | `` | `` |
| 79 | `id_resp` | `int` | YES | `` | `` | `` | `` |
| 80 | `auto_manifestar` | `tinyint` | YES | `0` | `` | `` | `` |
| 81 | `validade_antt` | `date` | YES | `` | `` | `` | `` |
| 82 | `capacidade_tanque` | `decimal(5,2)` | YES | `` | `` | `` | `` |
| 83 | `quilometragem` | `int` | YES | `0` | `` | `` | `` |
| 84 | `pneus` | `json` | YES | `` | `` | `` | `` |
| 85 | `socio_proprietario` | `int` | YES | `` | `` | `` | `` |
| 86 | `validade_checklist_rastreador` | `date` | YES | `` | `` | `` | `` |
| 87 | `codigo_analise_gerenciadora` | `varchar(20)` | YES | `` | `` | `` | `` |
| 88 | `proprietario_prop` | `int` | YES | `` | `` | `` | `` |
| 89 | `tipo_proprietario_prop` | `int` | NO | `` | `` | `` | `` |
| 90 | `unidade_prop` | `int` | YES | `` | `` | `` | `` |
| 91 | `largura_m3` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 92 | `altura_m3` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 93 | `comprimento_m3` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 94 | `id_veiculo_categoria` | `varchar(200)` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_veiculo`, `id_tabela`, `id_categoria_veiculos`, `id_resp`, `id_veiculo_categoria`
- **Datas/tempos prováveis**: `venc_licenciamento`, `compra`, `venda`, `data_incluido`, `seguro_validade`, `seguro_data`, `vigencia`, `validade_checklist`, `validade_tacografo`, `ipva`, `data_rastreador`, `validade_antt`, `validade_checklist_rastreador`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:08:13`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `veiculos`
