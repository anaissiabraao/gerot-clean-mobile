# Tabela `azportoex.fr_pneu_modelos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_pneu_modelos`
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

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `tinyint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `modelo` | `varchar(100)` | NO | `` | `` | `` | `` |
| 3 | `marca` | `int` | NO | `` | `` | `` | `` |
| 4 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 5 | `sulco` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `aro` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `tala` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `pressao_maxima` | `int` | YES | `0` | `` | `` | `` |
| 9 | `formula_desgaste` | `varchar(255)` | YES | `` | `` | `` | `` |
| 10 | `formula_recauchutado` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `id_medida_pneu` | `int` | YES | `` | `` | `` | `` |
| 12 | `vida_util_novo` | `int` | YES | `` | `` | `` | `` |
| 13 | `vida_util_recapado` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_medida_pneu`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pneu`, `modelos`
