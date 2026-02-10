# Tabela `azportoex.fr_pneu`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_pneu`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:05`
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
- `patrimonio` type=`BTREE` non_unique=`False` cols=[`patrimonio`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `modelo` | `int` | NO | `` | `` | `` | `` |
| 3 | `patrimonio` | `varchar(50)` | YES | `` | `` | `UNI` | `` |
| 4 | `limite_recall` | `tinyint` | YES | `` | `` | `` | `` |
| 5 | `recauchutado` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `pneu_anterior` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `criado_em` | `date` | NO | `` | `` | `` | `` |
| 8 | `data_recauchutado` | `date` | YES | `` | `` | `` | `` |
| 9 | `data_compra` | `date` | YES | `` | `` | `` | `` |
| 10 | `valor` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 11 | `situacao` | `tinyint` | YES | `` | `` | `` | `` |
| 12 | `km` | `int` | YES | `` | `` | `` | `` |
| 13 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `sulco` | `tinyint` | YES | `` | `` | `` | `` |
| 15 | `pressao_maxima` | `tinyint` | YES | `` | `` | `` | `` |
| 16 | `km_restante` | `int` | YES | `` | `` | `` | `` |
| 17 | `id_veiculo` | `int` | YES | `` | `` | `` | `` |
| 18 | `dt_last_movimentacao` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_veiculo`
- **Datas/tempos prováveis**: `criado_em`, `data_recauchutado`, `data_compra`, `dt_last_movimentacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pneu`
