# Tabela `azportoex.terceiros`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `terceiros`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3268`
- **Create time**: `2025-09-07T17:41:28`
- **Update time**: `2025-12-17T16:08:19`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_terceiro`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_terceiro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_terceiro` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 3 | `nome` | `varchar(50)` | YES | `` | `` | `` | `` |
| 4 | `motorista` | `varchar(255)` | YES | `` | `` | `` | `` |
| 5 | `cpf` | `varchar(15)` | YES | `` | `` | `` | `` |
| 6 | `rg` | `varchar(25)` | YES | `` | `` | `` | `` |
| 7 | `habilitacao` | `int` | YES | `` | `` | `` | `` |
| 8 | `validade` | `date` | YES | `` | `` | `` | `` |
| 9 | `categoria` | `varchar(2)` | YES | `` | `` | `` | `` |
| 10 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 11 | `bairro` | `varchar(80)` | YES | `` | `` | `` | `` |
| 12 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 13 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 14 | `telefone` | `varchar(13)` | YES | `` | `` | `` | `` |
| 15 | `celular` | `varchar(13)` | YES | `` | `` | `` | `` |
| 16 | `nextel` | `varchar(18)` | YES | `` | `` | `` | `` |
| 17 | `ve_placa` | `varchar(9)` | YES | `` | `` | `` | `` |
| 18 | `ve_renavam` | `varchar(12)` | YES | `` | `` | `` | `` |
| 19 | `ve_marca` | `varchar(55)` | YES | `` | `` | `` | `` |
| 20 | `ve_modelo` | `varchar(55)` | YES | `` | `` | `` | `` |
| 21 | `ve_ano` | `int` | YES | `` | `` | `` | `` |
| 22 | `ve_cor` | `varchar(25)` | YES | `` | `` | `` | `` |
| 23 | `ve_chassi` | `varchar(20)` | YES | `` | `` | `` | `` |
| 24 | `ve_seguro` | `int` | YES | `` | `` | `` | `` |
| 25 | `ve_rastreador` | `varchar(25)` | YES | `` | `` | `` | `` |
| 26 | `ve_capacidade` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 27 | `ve_cidade` | `int` | YES | `` | `` | `` | `` |
| 28 | `aco_placa` | `varchar(9)` | YES | `` | `` | `` | `` |
| 29 | `aco_chassi` | `varchar(20)` | YES | `` | `` | `` | `` |
| 30 | `aco_marca` | `varchar(60)` | YES | `` | `` | `` | `` |
| 31 | `aco_modelo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 32 | `aco_capacidade` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 33 | `aco_cubagem` | `decimal(4,2)` | YES | `` | `` | `` | `` |
| 34 | `aco_tipo` | `int` | YES | `` | `` | `` | `` |
| 35 | `aco_cidade` | `int` | YES | `` | `` | `` | `` |
| 36 | `status` | `int` | YES | `1` | `` | `` | `` |
| 37 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 38 | `operador` | `int` | YES | `` | `` | `` | `` |
| 39 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 40 | `custo_entrega` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 41 | `entrega_primeira` | `int` | YES | `0` | `` | `` | `` |
| 42 | `custo_entrega_dif` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 43 | `custo_km` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 44 | `custo_frete` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 45 | `custo_diaria` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 46 | `tipo_ve` | `int` | YES | `` | `` | `` | `` |
| 47 | `tara` | `int` | YES | `0` | `` | `` | `` |
| 48 | `rntrc` | `varchar(10)` | YES | `` | `` | `` | `` |
| 49 | `tprod` | `varchar(2)` | YES | `` | `` | `` | `` |
| 50 | `tpcar` | `varchar(2)` | YES | `` | `` | `` | `` |
| 51 | `uf` | `varchar(2)` | YES | `` | `` | `` | `` |
| 52 | `capM3` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 53 | `seguro_status` | `int` | YES | `` | `` | `` | `` |
| 54 | `seguro_validade` | `date` | YES | `` | `` | `` | `` |
| 55 | `seguro_autorizacao` | `varchar(35)` | YES | `` | `` | `` | `` |
| 56 | `seguro_data` | `date` | YES | `` | `` | `` | `` |
| 57 | `pis` | `varchar(15)` | YES | `` | `` | `` | `` |
| 58 | `consumo` | `int` | YES | `0` | `` | `` | `` |
| 59 | `mopp` | `tinyint` | YES | `0` | `` | `` | `` |
| 60 | `mopp_validade` | `date` | YES | `` | `` | `` | `` |
| 61 | `ve_ipva` | `date` | YES | `` | `` | `` | `` |
| 62 | `tp_prop` | `tinyint` | YES | `1` | `` | `` | `` |
| 63 | `ve_placa_uf` | `varchar(2)` | YES | `` | `` | `` | `` |
| 64 | `ve_rntrc` | `varchar(15)` | YES | `` | `` | `` | `` |
| 65 | `documento` | `varchar(14)` | YES | `` | `` | `` | `` |
| 66 | `dono` | `varchar(60)` | YES | `` | `` | `` | `` |
| 67 | `insc_est` | `varchar(14)` | YES | `` | `` | `` | `` |
| 68 | `uf_dono` | `varchar(2)` | YES | `` | `` | `` | `` |
| 69 | `tipo_dono` | `int` | YES | `` | `` | `` | `` |
| 70 | `tipo_documento` | `varchar(4)` | YES | `` | `` | `` | `` |
| 71 | `renavam` | `varchar(45)` | YES | `` | `` | `` | `` |
| 72 | `venc_licenciamento` | `date` | YES | `` | `` | `` | `` |
| 73 | `validate_checklist` | `date` | YES | `` | `` | `` | `` |
| 74 | `tipo_rastreador` | `tinyint` | YES | `0` | `` | `` | `` |
| 75 | `obs_operacional` | `mediumtext` | YES | `` | `` | `` | `` |
| 76 | `dependentes` | `smallint` | YES | `0` | `` | `` | `` |
| 77 | `id_local` | `int` | YES | `0` | `` | `` | `` |
| 78 | `fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 79 | `cnpj` | `varchar(15)` | YES | `` | `` | `` | `` |
| 80 | `razao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 81 | `ramo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 82 | `numero` | `int` | YES | `` | `` | `` | `` |
| 83 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 84 | `pais` | `int` | YES | `` | `` | `` | `` |
| 85 | `contato` | `varchar(55)` | YES | `` | `` | `` | `` |
| 86 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 87 | `fax` | `varchar(13)` | YES | `(00)0000.0000` | `` | `` | `` |
| 88 | `site` | `varchar(255)` | YES | `` | `` | `` | `` |
| 89 | `id_tabela` | `int` | YES | `1` | `` | `` | `` |
| 90 | `adicional_km` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 91 | `isento_impostos_ciot` | `tinyint` | YES | `0` | `` | `` | `` |
| 92 | `rg_expedidor` | `tinyint` | YES | `` | `` | `` | `` |
| 93 | `rg_uf` | `char(2)` | YES | `` | `` | `` | `` |
| 94 | `rg_data` | `date` | YES | `` | `` | `` | `` |
| 95 | `sexo` | `char(1)` | YES | `` | `` | `` | `` |
| 96 | `propriedade_tipo` | `tinyint` | YES | `` | `` | `` | `` |
| 97 | `propriedade_tempo` | `varchar(10)` | YES | `` | `` | `` | `` |
| 98 | `operadora_telefone` | `tinyint` | YES | `` | `` | `` | `` |
| 99 | `data_nascimento` | `date` | YES | `` | `` | `` | `` |
| 100 | `municipio_nasc` | `varchar(50)` | YES | `` | `` | `` | `` |
| 101 | `validade_antt` | `date` | YES | `` | `` | `` | `` |
| 102 | `numero_dependentes` | `tinyint` | YES | `0` | `` | `` | `` |
| 103 | `data_inativado` | `datetime` | YES | `` | `` | `` | `` |
| 104 | `controlador` | `int` | YES | `` | `` | `` | `` |
| 105 | `servico_padrao_manifesto` | `int` | NO | `0` | `` | `` | `` |
| 106 | `faturaAutomatica` | `int` | YES | `0` | `` | `` | `` |
| 107 | `carga_fixa_hora` | `int` | NO | `0` | `` | `` | `` |
| 108 | `carga_fixa_minuto` | `int` | NO | `0` | `` | `` | `` |
| 109 | `valor_fixo` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 110 | `hora_excedente` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_terceiro`, `id_local`, `id_tabela`
- **Datas/tempos prováveis**: `validade`, `data_incluido`, `seguro_validade`, `seguro_data`, `mopp_validade`, `ve_ipva`, `venc_licenciamento`, `validate_checklist`, `rg_data`, `data_nascimento`, `validade_antt`, `data_inativado`, `carga_fixa_hora`, `hora_excedente`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:08:19`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `terceiros`
