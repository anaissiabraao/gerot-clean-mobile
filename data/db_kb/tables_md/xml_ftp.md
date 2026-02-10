# Tabela `azportoex.xml_ftp`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `xml_ftp`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:42:12`
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
| 2 | `host` | `varchar(100)` | NO | `` | `` | `` | `` |
| 3 | `user` | `varchar(60)` | NO | `` | `` | `` | `` |
| 4 | `senha` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `pasta` | `varchar(100)` | NO | `` | `` | `` | `` |
| 6 | `porta` | `int` | YES | `21` | `` | `` | `` |
| 7 | `conexao` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `id_integracao` | `smallint` | NO | `` | `` | `` | `` |
| 9 | `tls` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `ign_passivo` | `tinyint` | NO | `1` | `` | `` | `` |
| 11 | `sis_operacional` | `enum('windows','unix')` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_integracao`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `xml`, `ftp`
