# Tabela `azportoex.ciot_favorecido`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_favorecido`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:37:07`
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
- `id_favorecido`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_favorecido`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_favorecido` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_ciot` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_administradora` | `int` | NO | `` | `` | `` | `` |
| 4 | `id_manifesto` | `int` | NO | `` | `` | `` | `` |
| 5 | `tipo` | `tinyint` | NO | `1` | `` | `` | `` |
| 6 | `id_terceiro` | `int` | NO | `` | `` | `` | `` |
| 7 | `id_motorista` | `int` | NO | `` | `` | `` | `` |
| 8 | `motorista` | `tinyint` | NO | `0` | `` | `` | `` |
| 9 | `nome` | `varchar(40)` | YES | `` | `` | `` | `` |
| 10 | `documento1_tipo` | `int` | YES | `` | `` | `` | `` |
| 11 | `documento1_numero` | `varchar(30)` | YES | `` | `` | `` | `` |
| 12 | `documento2_tipo` | `tinyint` | YES | `` | `` | `` | `` |
| 13 | `documento2_numero` | `varchar(20)` | YES | `` | `` | `` | `` |
| 14 | `documento2_uf` | `varchar(2)` | YES | `` | `` | `` | `` |
| 15 | `documento2_emissor_id` | `int` | YES | `` | `` | `` | `` |
| 16 | `documento2_emissor_descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 17 | `documento2_emissor_sigla` | `varchar(10)` | YES | `` | `` | `` | `` |
| 18 | `documento2_data` | `date` | YES | `` | `` | `` | `` |
| 19 | `documento3_tipo` | `tinyint` | YES | `` | `` | `` | `` |
| 20 | `documento3_numero` | `varchar(20)` | YES | `` | `` | `` | `` |
| 21 | `nascimento` | `date` | YES | `` | `` | `` | `` |
| 22 | `nacionalidade_id` | `int` | YES | `` | `` | `` | `` |
| 23 | `nacionalidade_descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 24 | `naturalidade_id` | `int` | YES | `` | `` | `` | `` |
| 25 | `naturalidade_descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 26 | `sexo` | `char(1)` | YES | `` | `` | `` | `` |
| 27 | `endereco_logradouro` | `varchar(40)` | YES | `` | `` | `` | `` |
| 28 | `endereco_numero` | `int` | YES | `` | `` | `` | `` |
| 29 | `endereco_complemento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 30 | `endereco_bairro` | `varchar(30)` | YES | `` | `` | `` | `` |
| 31 | `endereco_cidade_id` | `int` | YES | `` | `` | `` | `` |
| 32 | `endereco_cidade_descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 33 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 34 | `propriedade_tipo_id` | `int` | YES | `` | `` | `` | `` |
| 35 | `propriedade_tipo_descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 36 | `propriedade_residedesde` | `varchar(7)` | YES | `` | `` | `` | `` |
| 37 | `telefone_ddd` | `varchar(3)` | YES | `` | `` | `` | `` |
| 38 | `telefone_numero` | `varchar(8)` | YES | `` | `` | `` | `` |
| 39 | `celular_ddd` | `varchar(3)` | YES | `` | `` | `` | `` |
| 40 | `celular_numero` | `varchar(8)` | YES | `` | `` | `` | `` |
| 41 | `celular_operadora_id` | `int` | YES | `` | `` | `` | `` |
| 42 | `email` | `varchar(40)` | YES | `` | `` | `` | `` |
| 43 | `meiopagamento` | `tinyint` | YES | `` | `` | `` | `` |
| 44 | `cartao` | `varchar(16)` | YES | `` | `` | `` | `` |
| 45 | `id_local` | `int` | YES | `` | `` | `` | `` |
| 46 | `celular_operadora_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 47 | `id_conta_bancaria` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_favorecido`, `id_ciot`, `id_administradora`, `id_manifesto`, `id_terceiro`, `id_motorista`, `documento2_emissor_id`, `nacionalidade_id`, `naturalidade_id`, `endereco_cidade_id`, `propriedade_tipo_id`, `celular_operadora_id`, `id_local`, `id_conta_bancaria`
- **Datas/tempos prováveis**: `documento2_data`, `nascimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `favorecido`
