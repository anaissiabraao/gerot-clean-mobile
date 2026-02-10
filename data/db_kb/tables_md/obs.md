# Tabela `azportoex.obs`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `obs`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `59035`
- **Create time**: `2025-09-07T17:40:24`
- **Update time**: `2025-12-17T14:55:26`
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
- `idx_obs_numero` type=`BTREE` non_unique=`True` cols=[`numero`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `numero` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 4 | `tipo` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `usuario` | `int` | NO | `` | `` | `` | `` |
| 6 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 7 | `data` | `date` | YES | `` | `` | `` | `` |
| 8 | `usuario_remove` | `int` | YES | `` | `` | `` | `` |
| 9 | `data_remove` | `date` | YES | `` | `` | `` | `` |
| 10 | `coleta` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `data_remove`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:55:26`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `obs`
