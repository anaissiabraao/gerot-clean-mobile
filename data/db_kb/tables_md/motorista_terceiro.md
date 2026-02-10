# Tabela `azportoex.motorista_terceiro`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `motorista_terceiro`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3028`
- **Create time**: `2025-09-07T17:40:12`
- **Update time**: `2025-12-17T15:57:58`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

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
| 2 | `id_terceiro` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_local` | `int` | YES | `` | `` | `` | `` |
| 4 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 5 | `nome_completo` | `varchar(255)` | NO | `` | `` | `` | `` |
| 6 | `nome_mae` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `rg` | `varchar(12)` | YES | `` | `` | `` | `` |
| 8 | `cpf` | `varchar(18)` | NO | `` | `` | `` | `` |
| 9 | `telefone_c` | `varchar(18)` | YES | `` | `` | `` | `` |
| 10 | `nextel` | `varchar(18)` | YES | `` | `` | `` | `` |
| 11 | `habilitacao` | `varchar(20)` | YES | `` | `` | `` | `` |
| 12 | `h_emissao` | `date` | YES | `` | `` | `` | `` |
| 13 | `h_validade` | `date` | YES | `` | `` | `` | `` |
| 14 | `h_categoria` | `varchar(2)` | YES | `` | `` | `` | `` |
| 15 | `seguro_status` | `int` | YES | `0` | `` | `` | `` |
| 16 | `seguro_validade` | `date` | YES | `` | `` | `` | `` |
| 17 | `mopp` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `dono` | `varchar(60)` | YES | `` | `` | `` | `` |
| 19 | `pis` | `varchar(15)` | YES | `` | `` | `` | `` |
| 20 | `mopp_validade` | `date` | YES | `` | `` | `` | `` |
| 21 | `seguro_autorizacao` | `varchar(35)` | YES | `` | `` | `` | `` |
| 22 | `seguro_data` | `date` | YES | `` | `` | `` | `` |
| 23 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 24 | `doc_cnh` | `varchar(200)` | YES | `` | `` | `` | `` |
| 25 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 26 | `cod_seguranca_cnh` | `varchar(22)` | YES | `` | `` | `` | `` |
| 27 | `data_nascimento` | `date` | YES | `` | `` | `` | `` |
| 28 | `municipio_nasc` | `varchar(50)` | YES | `` | `` | `` | `` |
| 29 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 30 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 31 | `numero` | `int` | YES | `` | `` | `` | `` |
| 32 | `bairro` | `varchar(80)` | YES | `` | `` | `` | `` |
| 33 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 34 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 35 | `pais` | `smallint` | YES | `` | `` | `` | `` |
| 36 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 37 | `rntrc` | `varchar(45)` | YES | `` | `` | `` | `` |
| 38 | `rg_expedidor` | `tinyint` | YES | `` | `` | `` | `` |
| 39 | `rg_uf` | `char(2)` | YES | `` | `` | `` | `` |
| 40 | `rg_data` | `date` | YES | `` | `` | `` | `` |
| 41 | `sexo` | `char(1)` | YES | `` | `` | `` | `` |
| 42 | `propriedade_tipo` | `tinyint` | YES | `` | `` | `` | `` |
| 43 | `propriedade_tempo` | `varchar(10)` | YES | `` | `` | `` | `` |
| 44 | `email` | `varchar(45)` | YES | `` | `` | `` | `` |
| 45 | `operadora_telefone` | `tinyint` | YES | `` | `` | `` | `` |
| 46 | `uf_cnh` | `char(2)` | YES | `` | `` | `` | `` |
| 47 | `operador` | `int` | YES | `` | `` | `` | `` |
| 48 | `ajudante` | `int` | YES | `0` | `` | `` | `` |
| 49 | `cnh_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 50 | `primeira_cnh` | `date` | YES | `` | `` | `` | `` |
| 51 | `permitir_manifestos` | `tinyint` | YES | `0` | `` | `` | `` |
| 52 | `solicitacao_gr` | `date` | YES | `` | `` | `` | `` |
| 53 | `inicio_contrato` | `date` | YES | `` | `` | `` | `` |
| 54 | `aditivo_contratual` | `date` | YES | `` | `` | `` | `` |
| 55 | `rescisao_contrato` | `date` | YES | `` | `` | `` | `` |
| 56 | `nome_pai` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_terceiro`, `id_local`
- **Datas/tempos prováveis**: `h_emissao`, `h_validade`, `seguro_validade`, `mopp_validade`, `seguro_data`, `data_nascimento`, `rg_data`, `primeira_cnh`, `solicitacao_gr`, `inicio_contrato`, `aditivo_contratual`, `rescisao_contrato`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T15:57:58`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `motorista`, `terceiro`
