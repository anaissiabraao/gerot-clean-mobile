# Tabela `azportoex.comprovante_ftp`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `comprovante_ftp`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:18`
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
| 2 | `id_cliente` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `nome` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `agrupa` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 5 | `host` | `varchar(45)` | NO | `` | `` | `` | `` |
| 6 | `user` | `varchar(45)` | NO | `` | `` | `` | `` |
| 7 | `senha` | `varchar(45)` | NO | `` | `` | `` | `` |
| 8 | `pasta` | `varchar(100)` | NO | `` | `` | `` | `` |
| 9 | `status` | `tinyint` | NO | `1` | `` | `` | `` |
| 10 | `porta` | `int` | YES | `21` | `` | `` | `` |
| 11 | `conexao` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `reversao` | `tinyint` | YES | `0` | `` | `` | `` |
| 13 | `id_integracao` | `smallint unsigned` | NO | `` | `` | `` | `` |
| 14 | `separador` | `tinyint` | YES | `1` | `` | `` | `` |
| 15 | `prefixo` | `varchar(10)` | YES | `` | `` | `` | `` |
| 16 | `ign_passivo` | `tinyint` | NO | `1` | `` | `` | `` |
| 17 | `sis_operacional` | `enum('windows','unix')` | YES | `` | `` | `` | `` |
| 18 | `tls` | `tinyint` | NO | `0` | `` | `` | `` |
| 19 | `formato_arquivo` | `int` | YES | `0` | `` | `` | `` |
| 20 | `chave` | `varchar(250)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_cliente`, `id_integracao`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `comprovante`, `ftp`
