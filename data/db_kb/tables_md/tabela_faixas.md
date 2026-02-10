# Tabela `azportoex.tabela_faixas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_faixas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `835166`
- **Create time**: `2025-09-07T17:41:11`
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
- `idx_tabela_faixas_trecho` type=`BTREE` non_unique=`True` cols=[`id_trecho`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tabela` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_trecho` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `inicio` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 5 | `fim` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 6 | `minimo` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 7 | `franquia` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 8 | `excedente` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 9 | `tipo` | `tinyint` | NO | `` | `` | `` | `` |
| 10 | `indice` | `smallint` | YES | `1` | `` | `` | `` |
| 11 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 12 | `deleted_at` | `timestamp` | YES | `` | `` | `` | `` |
| 13 | `operador` | `int` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tabela`, `id_trecho`
- **Datas/tempos prováveis**: `created_at`, `deleted_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tabela`, `faixas`
