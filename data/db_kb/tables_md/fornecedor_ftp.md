# Tabela `azportoex.fornecedor_ftp`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fornecedor_ftp`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:37:57`
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
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_fornecedor` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `host` | `varchar(70)` | NO | `` | `` | `` | `` |
| 4 | `user` | `varchar(45)` | NO | `` | `` | `` | `` |
| 5 | `senha` | `varchar(45)` | NO | `` | `` | `` | `` |
| 6 | `pasta` | `varchar(100)` | NO | `` | `` | `` | `` |
| 7 | `status` | `tinyint` | NO | `1` | `` | `` | `` |
| 8 | `porta` | `int` | YES | `21` | `` | `` | `` |
| 9 | `conexao` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `tls` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `notfis` | `varchar(255)` | YES | `` | `` | `` | `` |
| 12 | `conemb` | `varchar(255)` | YES | `` | `` | `` | `` |
| 13 | `ocorren` | `varchar(255)` | YES | `` | `` | `` | `` |
| 14 | `doccob` | `varchar(255)` | YES | `` | `` | `` | `` |
| 15 | `xmlcte` | `varchar(255)` | YES | `` | `` | `` | `` |
| 16 | `dacte` | `varchar(255)` | YES | `` | `` | `` | `` |
| 17 | `reversao` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `ign_passivo` | `tinyint` | NO | `1` | `` | `` | `` |
| 19 | `sis_operacional` | `enum('windows','unix')` | YES | `` | `` | `` | `` |
| 20 | `xmlnfe` | `varchar(255)` | YES | `` | `` | `` | `` |
| 21 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 22 | `conexoes_invalidas` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `xml_nfse` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fornecedor`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `fornecedor`, `ftp`
