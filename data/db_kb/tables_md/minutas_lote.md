# Tabela `azportoex.minutas_lote`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minutas_lote`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `15374`
- **Create time**: `2025-09-07T17:40:10`
- **Update time**: `2025-12-12T18:08:29`
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
- `id_lote` → `lote_comprovante.id` (constraint=`fk_id_lote`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_lote` → `lote_comprovante.id` (constraint=`id_fk_comprovante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta` → `minuta.id_minuta` (constraint=`id_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_id_lote` type=`BTREE` non_unique=`True` cols=[`id_lote`]
- `id_fk_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lote` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `confirma` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_lote`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-12T18:08:29`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minutas`, `lote`
