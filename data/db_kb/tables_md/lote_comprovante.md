# Tabela `azportoex.lote_comprovante`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `lote_comprovante`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `483`
- **Create time**: `2025-09-07T17:39:30`
- **Update time**: `2025-12-12T20:38:32`
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
- `minutas_lote.id_lote` → `lote_comprovante.id` (constraint=`fk_id_lote`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minutas_lote.id_lote` → `lote_comprovante.id` (constraint=`id_fk_comprovante`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `operador` | `int` | NO | `` | `` | `` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `hora` | `varchar(8)` | YES | `` | `` | `` | `` |
| 5 | `referencia` | `varchar(50)` | YES | `` | `` | `` | `` |
| 6 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 7 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 8 | `agente` | `int` | YES | `` | `` | `` | `` |
| 9 | `quant_max` | `int` | YES | `50` | `` | `` | `` |
| 10 | `cliente` | `int` | YES | `` | `` | `` | `` |
| 11 | `tipo_data` | `int` | NO | `1` | `` | `` | `` |
| 12 | `data_inicial` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 13 | `data_final` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 14 | `minuta_comprovante` | `tinyint(1)` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `tipo_data`, `data_inicial`, `data_final`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-12T20:38:32`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `lote`, `comprovante`
