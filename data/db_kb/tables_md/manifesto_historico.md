# Tabela `azportoex.manifesto_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `manifesto_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `292755`
- **Create time**: `2025-10-11T06:46:54`
- **Update time**: `2025-12-17T16:50:27`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `fornecedor` → `fornecedores.id_local` (constraint=`fk_manifesto_historico_fornecedores`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_historico_man`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `status` → `tipo_oco.id_oco` (constraint=`fk_manifesto_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_manifesto_historico_fornecedores` type=`BTREE` non_unique=`True` cols=[`fornecedor`]
- `fk_manifesto_historico_tipo_oco` type=`BTREE` non_unique=`True` cols=[`status`]
- `idx_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]
- `manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `manifesto` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `status` | `smallint` | NO | `` | `` | `MUL` | `` |
| 4 | `descricao` | `mediumtext` | YES | `` | `` | `` | `` |
| 5 | `data` | `date` | NO | `` | `` | `` | `` |
| 6 | `hora` | `time` | NO | `` | `` | `` | `` |
| 7 | `operador` | `int` | NO | `` | `` | `` | `` |
| 8 | `fornecedor` | `int` | YES | `` | `` | `MUL` | `` |
| 9 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 10 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 11 | `edi` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `unidade` | `smallint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:27`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `manifesto`, `historico`
