# Tabela `azportoex.historico_volume`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `historico_volume`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `33099`
- **Create time**: `2025-09-07T17:39:18`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `manifesto` → `manifesto.id_manifesto` (constraint=`fk_historico_volume_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_volume` → `volumes.id_volume` (constraint=`fk_volume`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_historico_volume_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]
- `fk_volume` type=`BTREE` non_unique=`True` cols=[`id_volume`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_volume` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `base` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `operador` | `smallint` | NO | `` | `` | `` | `` |
| 5 | `tipo` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 6 | `data` | `datetime` | NO | `` | `` | `` | `` |
| 7 | `manifesto` | `int` | YES | `` | `` | `MUL` | `` |
| 8 | `barra` | `varchar(30)` | YES | `` | `` | `` | `` |
| 9 | `hora` | `time` | YES | `` | `` | `` | `` |
| 10 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 11 | `status` | `tinyint(1)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_volume`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `historico`, `volume`
