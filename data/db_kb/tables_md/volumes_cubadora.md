# Tabela `azportoex.volumes_cubadora`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `volumes_cubadora`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:42:11`
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
- `id_volume`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_volume`]
- `uc_vol_cub` type=`BTREE` non_unique=`False` cols=[`peso`, `largura`, `altura`, `comprimento`, `barra`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_volume` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `peso` | `decimal(10,2)` | YES | `` | `` | `MUL` | `` |
| 3 | `largura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 4 | `altura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 5 | `comprimento` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 6 | `barra` | `varchar(40)` | YES | `` | `` | `` | `` |
| 7 | `pedido` | `varchar(13)` | YES | `` | `` | `` | `` |
| 8 | `created_at` | `timestamp` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_volume`
- **Datas/tempos prováveis**: `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `volumes`, `cubadora`
