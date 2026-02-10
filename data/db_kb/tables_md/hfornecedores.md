# Tabela `azportoex.hfornecedores`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `hfornecedores`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `63948`
- **Create time**: `2025-09-07T17:39:07`
- **Update time**: `2025-12-17T16:08:19`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_f` → `fornecedores.id_local` (constraint=`fk_fornecedor_hist`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_fornecedor_hist` type=`BTREE` non_unique=`True` cols=[`id_f`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_f` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 4 | `fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 5 | `razao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `ramo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `endereco` | `varchar(60)` | YES | `` | `` | `` | `` |
| 8 | `bairro` | `varchar(60)` | YES | `` | `` | `` | `` |
| 9 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 10 | `cidade` | `int` | YES | `` | `` | `` | `` |
| 11 | `contato` | `varchar(55)` | YES | `` | `` | `` | `` |
| 12 | `telefone` | `varchar(14)` | YES | `` | `` | `` | `` |
| 13 | `fax` | `varchar(13)` | YES | `(00)0000.0000` | `` | `` | `` |
| 14 | `celular` | `varchar(20)` | YES | `` | `` | `` | `` |
| 15 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 16 | `site` | `varchar(255)` | YES | `` | `` | `` | `` |
| 17 | `insc_estadual` | `varchar(15)` | YES | `` | `` | `` | `` |
| 18 | `insc_municipal` | `varchar(15)` | YES | `` | `` | `` | `` |
| 19 | `cliente` | `int` | YES | `0` | `` | `` | `` |
| 20 | `fornecedor` | `int` | YES | `0` | `` | `` | `` |
| 21 | `local` | `int` | YES | `0` | `` | `` | `` |
| 22 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 23 | `id_tabela` | `int` | YES | `1` | `` | `` | `` |
| 24 | `insc_isento` | `int unsigned` | YES | `0` | `` | `` | `` |
| 25 | `suframa` | `varchar(45)` | YES | `` | `` | `` | `` |
| 26 | `tipo_cadastro` | `int` | YES | `1` | `` | `` | `` |
| 27 | `vendedor` | `int` | YES | `0` | `` | `` | `` |
| 28 | `limite_credito` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 29 | `dias_vecto` | `int` | YES | `` | `` | `` | `` |
| 30 | `numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 31 | `valor_max_fatura` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 32 | `seguradora` | `int` | YES | `` | `` | `` | `` |
| 33 | `transp_seguro` | `int` | YES | `` | `` | `` | `` |
| 34 | `seg_proprio` | `tinyint` | YES | `` | `` | `` | `` |
| 35 | `senha` | `varchar(45)` | YES | `123456` | `` | `` | `` |
| 36 | `data` | `datetime` | YES | `` | `` | `` | `` |
| 37 | `operador` | `int` | YES | `` | `` | `` | `` |
| 38 | `prefixo` | `varchar(8)` | YES | `` | `` | `` | `` |
| 39 | `conta_tam` | `varchar(30)` | YES | `` | `` | `` | `` |
| 40 | `bandeira_cia` | `int` | YES | `` | `` | `` | `` |
| 41 | `calcula_trt_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 42 | `antt` | `varchar(30)` | YES | `` | `` | `` | `` |
| 43 | `tipo_imposto` | `tinyint` | YES | `` | `` | `` | `` |
| 44 | `usuario` | `varchar(45)` | YES | `` | `` | `` | `` |
| 45 | `FatComprovante` | `int` | YES | `` | `` | `` | `` |
| 46 | `faturaAgente` | `tinyint` | YES | `` | `` | `` | `` |
| 47 | `sigla` | `varchar(45)` | YES | `` | `` | `` | `` |
| 48 | `visualizar_frete` | `int` | YES | `` | `` | `` | `` |
| 49 | `alteracusto` | `tinyint` | YES | `` | `` | `` | `` |
| 50 | `customaximo` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 51 | `imprimir_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 52 | `imprimir_dacte` | `tinyint` | YES | `` | `` | `` | `` |
| 53 | `ocorrencia_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 54 | `ocorrencia_coleta` | `tinyint` | YES | `` | `` | `` | `` |
| 55 | `ver_relatorios` | `tinyint` | YES | `` | `` | `` | `` |
| 56 | `ver_despachos` | `tinyint` | YES | `` | `` | `` | `` |
| 57 | `incluir_despachos` | `tinyint` | YES | `` | `` | `` | `` |
| 58 | `anexo_fatura_agente` | `tinyint` | YES | `` | `` | `` | `` |
| 59 | `analise_manifesto` | `tinyint` | YES | `` | `` | `` | `` |
| 60 | `envia_comprovante` | `tinyint` | YES | `` | `` | `` | `` |
| 61 | `baixa_por_nf` | `tinyint` | YES | `` | `` | `` | `` |
| 62 | `aceiteFatura` | `tinyint` | YES | `` | `` | `` | `` |
| 63 | `agente_incluir_documento` | `tinyint` | YES | `` | `` | `` | `` |
| 64 | `xml_cte` | `tinyint` | YES | `` | `` | `` | `` |
| 65 | `banco` | `int` | YES | `` | `` | `` | `` |
| 66 | `conta_corrente` | `varchar(45)` | YES | `` | `` | `` | `` |
| 67 | `agencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 68 | `consumidor_final` | `tinyint` | YES | `` | `` | `` | `` |
| 69 | `tipoPeso` | `tinyint` | NO | `0` | `` | `` | `` |
| 70 | `edi_ocorrencia` | `smallint` | YES | `` | `` | `` | `` |
| 71 | `edi_conemb` | `smallint` | YES | `` | `` | `` | `` |
| 72 | `edi_cob` | `smallint` | YES | `` | `` | `` | `` |
| 73 | `edi_notifis` | `smallint` | YES | `` | `` | `` | `` |
| 74 | `edi_prefat` | `smallint` | YES | `` | `` | `` | `` |
| 75 | `semColRealizada` | `tinyint` | YES | `1` | `` | `` | `` |
| 76 | `etiqueta_padrao` | `int` | YES | `` | `` | `` | `` |
| 77 | `remove_comprovante` | `tinyint` | YES | `0` | `` | `` | `` |
| 78 | `remove_ocorrencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 79 | `controlador` | `int` | YES | `` | `` | `` | `` |
| 80 | `tipoEtiquetaPeso` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_f`, `id_tabela`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:08:19`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `hfornecedores`
