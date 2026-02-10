# Tabela `azportoex.ciot_nota`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_nota`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:37:08`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

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
| 2 | `id_ciot` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 5 | `nota_numero` | `varchar(25)` | YES | `` | `` | `` | `` |
| 6 | `nota_peso` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 7 | `nota_serie` | `varchar(10)` | YES | `` | `` | `` | `` |
| 8 | `nota_tipo` | `int` | YES | `` | `` | `` | `` |
| 9 | `nota_volume` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 10 | `cl_id` | `int` | YES | `` | `` | `` | `` |
| 11 | `cl_cnpj` | `varchar(25)` | YES | `` | `` | `` | `` |
| 12 | `cl_razao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 13 | `cl_bairro` | `varchar(255)` | YES | `` | `` | `` | `` |
| 14 | `cl_endereco` | `varchar(255)` | YES | `` | `` | `` | `` |
| 15 | `cl_numero` | `int` | YES | `` | `` | `` | `` |
| 16 | `cl_cidade` | `int` | YES | `` | `` | `` | `` |
| 17 | `cl_cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 18 | `re_id` | `int` | YES | `` | `` | `` | `` |
| 19 | `re_cnpj` | `varchar(25)` | YES | `` | `` | `` | `` |
| 20 | `re_razao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 21 | `re_bairro` | `varchar(255)` | YES | `` | `` | `` | `` |
| 22 | `re_endereco` | `varchar(255)` | YES | `` | `` | `` | `` |
| 23 | `re_numero` | `int` | YES | `` | `` | `` | `` |
| 24 | `re_cidade` | `int` | YES | `` | `` | `` | `` |
| 25 | `re_cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 26 | `de_id` | `int` | YES | `` | `` | `` | `` |
| 27 | `de_cnpj` | `varchar(25)` | YES | `` | `` | `` | `` |
| 28 | `de_razao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 29 | `de_bairro` | `varchar(255)` | YES | `` | `` | `` | `` |
| 30 | `de_endereco` | `varchar(255)` | YES | `` | `` | `` | `` |
| 31 | `de_numero` | `int` | YES | `` | `` | `` | `` |
| 32 | `de_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 33 | `de_cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 34 | `data` | `date` | NO | `` | `` | `` | `` |
| 35 | `status` | `int` | YES | `1` | `` | `` | `` |
| 36 | `nota_valor` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 37 | `id_manifesto` | `int` | YES | `` | `` | `` | `` |
| 38 | `re_documento_id` | `int` | YES | `` | `` | `` | `` |
| 39 | `re_documento_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 40 | `re_complemento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 41 | `re_cidade_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 42 | `de_documento_id` | `int` | YES | `` | `` | `` | `` |
| 43 | `de_documento_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 44 | `de_complemento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 45 | `de_cidade_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 46 | `cl_documento_id` | `int` | YES | `` | `` | `` | `` |
| 47 | `cl_documento_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 48 | `cl_complemento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 49 | `cl_cidade_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 50 | `nota_id` | `varchar(45)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ciot`, `id_administradora`, `id_usuario`, `cl_id`, `re_id`, `de_id`, `id_manifesto`, `re_documento_id`, `de_documento_id`, `cl_documento_id`, `nota_id`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `ciot`, `nota`
