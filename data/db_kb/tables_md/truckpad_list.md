# Tabela `azportoex.truckpad_list`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `truckpad_list`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:31`
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
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `truckpad_id` | `int` | YES | `` | `` | `` | `` |
| 3 | `documento` | `int` | NO | `` | `` | `` | `` |
| 4 | `tipo_documento` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `motorista` | `int` | YES | `` | `` | `` | `` |
| 6 | `id_local` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_origem` | `int` | YES | `` | `` | `` | `` |
| 8 | `id_destino` | `int` | YES | `` | `` | `` | `` |
| 9 | `veiculo` | `int` | YES | `` | `` | `` | `` |
| 10 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 11 | `custo` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `created_at` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 13 | `updated_at` | `datetime` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `truckpad_id`, `id_local`, `id_origem`, `id_destino`
- **Datas/tempos prováveis**: `created_at`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `truckpad`, `list`
