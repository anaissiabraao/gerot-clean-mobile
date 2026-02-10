# Tabela `azportoex.motorista_agente`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `motorista_agente`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `110`
- **Create time**: `2025-09-07T17:40:12`
- **Update time**: `None`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 3 | `rg` | `varchar(12)` | YES | `` | `` | `` | `` |
| 4 | `cpf` | `varchar(18)` | YES | `` | `` | `` | `` |
| 5 | `telefone_c` | `varchar(18)` | YES | `` | `` | `` | `` |
| 6 | `nextel` | `varchar(18)` | YES | `` | `` | `` | `` |
| 7 | `habilitacao` | `varchar(20)` | YES | `` | `` | `` | `` |
| 8 | `h_validade` | `date` | YES | `` | `` | `` | `` |
| 9 | `h_categoria` | `varchar(2)` | YES | `` | `` | `` | `` |
| 10 | `seguro_status` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `seguro_validade` | `date` | YES | `` | `` | `` | `` |
| 12 | `seguro_autorizacao` | `varchar(35)` | YES | `` | `` | `` | `` |
| 13 | `seguro_data` | `date` | YES | `` | `` | `` | `` |
| 14 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 15 | `tipo` | `int` | YES | `1` | `` | `` | `` |
| 16 | `doc_cnh` | `varchar(200)` | YES | `` | `` | `` | `` |
| 17 | `base` | `int` | YES | `` | `` | `` | `` |
| 18 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 19 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 20 | `cod_seguranca_cnh` | `varchar(22)` | YES | `` | `` | `` | `` |
| 21 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 22 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 23 | `uf` | `varchar(11)` | YES | `` | `` | `` | `` |
| 24 | `pais` | `smallint` | YES | `` | `` | `` | `` |
| 25 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 26 | `primeiro_nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 27 | `mopp` | `tinyint` | YES | `` | `` | `` | `` |
| 28 | `mopp_validade` | `date` | YES | `` | `` | `` | `` |
| 29 | `pis` | `varchar(15)` | YES | `` | `` | `` | `` |
| 30 | `municipio_nasc` | `varchar(50)` | YES | `` | `` | `` | `` |
| 31 | `data_nascimento` | `date` | YES | `` | `` | `` | `` |
| 32 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 33 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 34 | `numero` | `int` | YES | `` | `` | `` | `` |
| 35 | `bairro` | `varchar(80)` | YES | `` | `` | `` | `` |
| 36 | `proprietario` | `varchar(60)` | YES | `` | `` | `` | `` |
| 37 | `uf_cnh` | `char(2)` | YES | `` | `` | `` | `` |
| 38 | `operador` | `int` | YES | `` | `` | `` | `` |
| 39 | `ajudante` | `int` | YES | `0` | `` | `` | `` |
| 40 | `permitir_manifestos` | `tinyint` | YES | `0` | `` | `` | `` |
| 41 | `solicitacao_gr` | `date` | YES | `` | `` | `` | `` |
| 42 | `inicio_contrato` | `date` | YES | `` | `` | `` | `` |
| 43 | `aditivo_contratual` | `date` | YES | `` | `` | `` | `` |
| 44 | `rescisao_contrato` | `date` | YES | `` | `` | `` | `` |
| 45 | `nome_mae` | `varchar(100)` | YES | `` | `` | `` | `` |
| 46 | `nome_pai` | `varchar(100)` | YES | `` | `` | `` | `` |
| 47 | `rg_orgao_exp` | `varchar(15)` | YES | `` | `` | `` | `` |
| 48 | `h_emissao` | `date` | YES | `` | `` | `` | `` |
| 49 | `data_emissao_cnh` | `date` | YES | `` | `` | `` | `` |
| 50 | `cnh_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 51 | `primeira_cnh` | `date` | YES | `` | `` | `` | `` |
| 52 | `rg_emissao` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_usuario`
- **Datas/tempos prováveis**: `h_validade`, `seguro_validade`, `seguro_data`, `mopp_validade`, `data_nascimento`, `solicitacao_gr`, `inicio_contrato`, `aditivo_contratual`, `rescisao_contrato`, `h_emissao`, `data_emissao_cnh`, `primeira_cnh`, `rg_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `motorista`, `agente`
