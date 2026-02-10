# Tabela `azportoex.taxa_cambio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `taxa_cambio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:27`
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
- `id_taxa`

## Chaves estrangeiras (evidência estrutural)
- `moeda_id` → `moedas.id_moeda` (constraint=`taxa_cambio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_taxa`]
- `moeda_id` type=`BTREE` non_unique=`True` cols=[`moeda_id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_taxa` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `moeda_id` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `data_inicial` | `date` | YES | `` | `` | `` | `` |
| 4 | `data_final` | `date` | YES | `` | `` | `` | `` |
| 5 | `taxa` | `decimal(10,4)` | YES | `` | `` | `` | `` |
| 6 | `status` | `int` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_taxa`, `moeda_id`
- **Datas/tempos prováveis**: `data_inicial`, `data_final`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `taxa`, `cambio`
