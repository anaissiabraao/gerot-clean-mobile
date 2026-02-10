# Tabela `azportoex.volumes`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `volumes`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2805684`
- **Create time**: `2025-10-30T16:49:17`
- **Update time**: `2025-12-17T16:50:02`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_volume`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `historico_volume.id_volume` → `volumes.id_volume` (constraint=`fk_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `itens_consolidados.id_volume` → `volumes.id_volume` (constraint=`fk_id_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `volume_historico.id_volume` → `volumes.id_volume` (constraint=`fk_volume_historico_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_volume`]
- `idx_awb` type=`BTREE` non_unique=`True` cols=[`id_awb`]
- `idx_barra` type=`BTREE` non_unique=`True` cols=[`barra`]
- `idx_coleta` type=`BTREE` non_unique=`True` cols=[`id_coleta`]
- `idx_cotacao` type=`BTREE` non_unique=`True` cols=[`id_cotacao`]
- `idx_etiqueta_only` type=`BTREE` non_unique=`True` cols=[`etiqueta`]
- `idx_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]
- `idx_nf` type=`BTREE` non_unique=`True` cols=[`id_nf`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_volume` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `parcial` | `int` | NO | `` | `` | `` | `` |
| 4 | `total` | `int` | YES | `` | `` | `` | `` |
| 5 | `peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 6 | `status` | `int` | NO | `0` | `` | `` | `` |
| 7 | `lote` | `varchar(15)` | YES | `` | `` | `` | `` |
| 8 | `comprimento` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 9 | `largura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 10 | `altura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 11 | `cubagem` | `decimal(8,3)` | YES | `` | `` | `` | `` |
| 12 | `barra` | `varchar(40)` | YES | `` | `` | `MUL` | `` |
| 13 | `id_coleta` | `int` | YES | `` | `` | `MUL` | `` |
| 14 | `id_cotacao` | `int` | YES | `` | `` | `MUL` | `` |
| 15 | `etiqueta` | `varchar(100)` | YES | `` | `` | `MUL` | `` |
| 16 | `id_nf` | `int` | YES | `` | `` | `MUL` | `` |
| 17 | `chave` | `varchar(100)` | YES | `` | `` | `` | `` |
| 18 | `pacote` | `int` | YES | `` | `` | `` | `` |
| 19 | `id_awb` | `int` | YES | `` | `` | `MUL` | `` |
| 20 | `bipada` | `varchar(1)` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_volume`, `id_minuta`, `id_coleta`, `id_cotacao`, `id_nf`, `id_awb`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:02`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `volumes`
