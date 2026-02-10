# Tabela `azportoex.funcionario`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `funcionario`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `100`
- **Create time**: `2025-09-07T17:39:05`
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
- `id_funcionario`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_funcionario`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_funcionario` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `base` | `int` | NO | `` | `` | `` | `` |
| 3 | `nome` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `endereco` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `bairro` | `varchar(60)` | NO | `` | `` | `` | `` |
| 6 | `cidade` | `int` | NO | `` | `` | `` | `` |
| 7 | `telefone_c` | `varchar(18)` | YES | `` | `` | `` | `` |
| 8 | `telefone_f` | `varchar(18)` | YES | `` | `` | `` | `` |
| 9 | `nome_pai` | `varchar(100)` | YES | `` | `` | `` | `` |
| 10 | `nome_mae` | `varchar(100)` | YES | `` | `` | `` | `` |
| 11 | `rg` | `varchar(12)` | YES | `` | `` | `` | `` |
| 12 | `cpf` | `varchar(18)` | NO | `` | `` | `` | `` |
| 13 | `habilitacao` | `varchar(20)` | YES | `` | `` | `` | `` |
| 14 | `h_categoria` | `varchar(2)` | YES | `` | `` | `` | `` |
| 15 | `h_validade` | `date` | YES | `` | `` | `` | `` |
| 16 | `esposa` | `varchar(120)` | YES | `` | `` | `` | `` |
| 17 | `nascimento` | `date` | NO | `` | `` | `` | `` |
| 18 | `nextel` | `varchar(18)` | YES | `` | `` | `` | `` |
| 19 | `matricula` | `varchar(10)` | YES | `` | `` | `` | `` |
| 20 | `funcao` | `varchar(40)` | NO | `` | `` | `` | `` |
| 21 | `salario` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 22 | `alimentacao` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 23 | `vale_transp` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 24 | `inss` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 25 | `banco` | `varchar(60)` | NO | `` | `` | `` | `` |
| 26 | `agencia` | `varchar(10)` | NO | `` | `` | `` | `` |
| 27 | `conta` | `varchar(20)` | NO | `` | `` | `` | `` |
| 28 | `pis` | `varchar(14)` | YES | `` | `` | `` | `` |
| 29 | `data` | `date` | NO | `` | `` | `` | `` |
| 30 | `status` | `int` | NO | `1` | `` | `` | `` |
| 31 | `admissao` | `date` | NO | `` | `` | `` | `` |
| 32 | `convenio` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 33 | `memo` | `text` | YES | `` | `` | `` | `` |
| 34 | `login` | `varchar(45)` | YES | `` | `` | `` | `` |
| 35 | `seguro_status` | `int` | NO | `0` | `` | `` | `` |
| 36 | `seguro_validade` | `date` | NO | `` | `` | `` | `` |
| 37 | `seguro_autorizacao` | `varchar(35)` | YES | `` | `` | `` | `` |
| 38 | `seguro_data` | `date` | NO | `` | `` | `` | `` |
| 39 | `tipo` | `int` | NO | `1` | `` | `` | `` |
| 40 | `telefone_mae` | `varchar(18)` | YES | `` | `` | `` | `` |
| 41 | `telefone_pai` | `varchar(18)` | YES | `` | `` | `` | `` |
| 42 | `telefone_esposa` | `varchar(18)` | YES | `` | `` | `` | `` |
| 43 | `irmao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 44 | `telefone_irmao` | `varchar(18)` | YES | `` | `` | `` | `` |
| 45 | `nome_vizinho` | `varchar(60)` | YES | `` | `` | `` | `` |
| 46 | `telefone_vizinho` | `varchar(18)` | YES | `` | `` | `` | `` |
| 47 | `serasaData` | `date` | YES | `` | `` | `` | `` |
| 48 | `serasavalidade` | `date` | YES | `` | `` | `` | `` |
| 49 | `restricaoSerasa` | `int` | NO | `0` | `` | `` | `` |
| 50 | `id_tabela` | `int` | YES | `0` | `` | `` | `` |
| 51 | `custo_entrega` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 52 | `entrega_primeira` | `int` | YES | `0` | `` | `` | `` |
| 53 | `custo_entrega_dif` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 54 | `custo_km` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 55 | `custo_frete` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 56 | `custo_diaria` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 57 | `ti_numero` | `varchar(14)` | YES | `` | `` | `` | `` |
| 58 | `ti_data` | `date` | YES | `` | `` | `` | `` |
| 59 | `ti_zona` | `smallint` | YES | `0` | `` | `` | `` |
| 60 | `ti_secao` | `smallint` | YES | `0` | `` | `` | `` |
| 61 | `ctps_data` | `date` | YES | `` | `` | `` | `` |
| 62 | `ctps_serie` | `smallint` | YES | `` | `` | `` | `` |
| 63 | `ctps_orgao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 64 | `estado_civil` | `varchar(60)` | YES | `` | `` | `` | `` |
| 65 | `numero` | `varchar(10)` | YES | `` | `` | `` | `` |
| 66 | `cep` | `varchar(9)` | YES | `` | `` | `` | `` |
| 67 | `mopp_validade` | `date` | YES | `` | `` | `` | `` |
| 68 | `mopp` | `tinyint` | YES | `0` | `` | `` | `` |
| 69 | `nextel_numero` | `varchar(15)` | YES | `` | `` | `` | `` |
| 70 | `complemento` | `varchar(60)` | YES | `` | `` | `` | `` |
| 71 | `ctps` | `varchar(15)` | YES | `` | `` | `` | `` |
| 72 | `rg_emissao` | `date` | YES | `` | `` | `` | `` |
| 73 | `doc_cnh` | `varchar(200)` | YES | `` | `` | `` | `` |
| 74 | `id_fornecedor` | `int` | YES | `` | `` | `` | `` |
| 75 | `tipo_conta` | `smallint` | YES | `` | `` | `` | `` |
| 76 | `matricula_ticketlog` | `varchar(45)` | YES | `` | `` | `` | `` |
| 77 | `cod_seguranca_cnh` | `varchar(22)` | YES | `` | `` | `` | `` |
| 78 | `cargo` | `int` | YES | `` | `` | `` | `` |
| 79 | `municipio_nasc` | `varchar(50)` | YES | `` | `` | `` | `` |
| 80 | `demissao` | `date` | YES | `` | `` | `` | `` |
| 81 | `escolaridade` | `varchar(45)` | YES | `` | `` | `` | `` |
| 82 | `uf_cnh` | `char(2)` | YES | `` | `` | `` | `` |
| 83 | `operador` | `int` | YES | `` | `` | `` | `` |
| 84 | `tipo_pix` | `int` | YES | `` | `` | `` | `` |
| 85 | `pix` | `varchar(40)` | YES | `` | `` | `` | `` |
| 86 | `permitir_manifestos` | `tinyint` | YES | `0` | `` | `` | `` |
| 87 | `email` | `varchar(60)` | YES | `` | `` | `` | `` |
| 88 | `h_emissao` | `date` | YES | `` | `` | `` | `` |
| 89 | `rg_orgao_exp` | `varchar(15)` | YES | `` | `` | `` | `` |
| 90 | `primeira_cnh` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_funcionario`, `id_tabela`, `id_fornecedor`
- **Datas/tempos prováveis**: `h_validade`, `nascimento`, `data`, `admissao`, `seguro_validade`, `seguro_data`, `serasaData`, `serasavalidade`, `ti_data`, `ctps_data`, `mopp_validade`, `rg_emissao`, `demissao`, `h_emissao`, `primeira_cnh`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `funcionario`
