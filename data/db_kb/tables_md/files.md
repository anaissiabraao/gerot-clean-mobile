# Tabela `azportoex.files`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `files`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `26792`
- **Create time**: `2025-09-07T17:37:56`
- **Update time**: `2025-12-17T16:08:15`
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
- `idx_files` type=`BTREE` non_unique=`True` cols=[`reference_id`, `reference_type`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `reference_id` | `int` | NO | `` | `` | `MUL` | `Referenced entity ID` |
| 3 | `reference_type` | `tinyint` | NO | `` | `` | `` | `Referenced entity type` |
| 4 | `uri` | `varchar(255)` | NO | `` | `` | `` | `Referenced entity URL/URI` |
| 5 | `provider` | `tinyint` | YES | `` | `` | `` | `File provider` |
| 6 | `user_id` | `int` | YES | `` | `` | `` | `User who inserted the file` |
| 7 | `filesize` | `mediumint unsigned` | YES | `` | `` | `` | `Size, in bytes, of the
	file` |
| 8 | `created_at` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 9 | `file_name` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `reference_id`, `user_id`
- **Datas/tempos prováveis**: `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:08:15`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `files`
