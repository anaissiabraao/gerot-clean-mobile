# Tabela `azportoex.averbacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `averbacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `198924`
- **Create time**: `2025-09-07T17:36:54`
- **Update time**: `2025-12-17T14:50:04`
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
- `fk_manifesto_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]
- `idx_id_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int unsigned` | NO | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `hora` | `varchar(11)` | NO | `` | `` | `` | `` |
| 5 | `status` | `int unsigned` | NO | `` | `` | `` | `` |
| 6 | `protocolo` | `varchar(50)` | YES | `` | `` | `` | `` |
| 7 | `motivo` | `varchar(80)` | YES | `` | `` | `` | `` |
| 8 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 9 | `manifesto` | `int` | YES | `` | `` | `MUL` | `` |
| 10 | `id_coleta` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_minuta`, `id_coleta`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:50:04`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `averbacao`
