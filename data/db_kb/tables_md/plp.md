# Tabela `azportoex.plp`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `plp`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:31`
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
- `id_plp`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_plp`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_plp` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `plp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 4 | `correio` | `int` | NO | `` | `` | `` | `` |
| 5 | `created_at` | `timestamp` | NO | `0000-00-00 00:00:00` | `` | `` | `` |
| 6 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 7 | `created_by` | `int` | NO | `` | `` | `` | `` |
| 8 | `updated_by` | `int` | NO | `` | `` | `` | `` |
| 9 | `status` | `int` | NO | `1` | `` | `` | `` |
| 10 | `arquivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `despacho` | `int` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_plp`
- **Datas/tempos prováveis**: `created_at`, `updated_at`, `created_by`, `updated_by`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `plp`
