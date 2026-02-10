# Tabela `azportoex.ciot_manifesto`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_manifesto`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:37:08`
- **Update time**: `None`
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
- `id_ciot` → `ciot.id` (constraint=`fk_ciot_id_ciot`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_numero` → `manifesto.id_manifesto` (constraint=`fk_ciot_manifesto_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_ciot_id_ciot` type=`BTREE` non_unique=`True` cols=[`id_ciot`]
- `fk_ciot_manifesto_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto_numero`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_ciot` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 4 | `manifesto_numero` | `int` | YES | `` | `` | `MUL` | `` |
| 5 | `manifesto_id_base` | `int` | YES | `` | `` | `` | `` |
| 6 | `manifesto_base` | `varchar(45)` | YES | `` | `` | `` | `` |
| 7 | `manifesto_emissao` | `date` | YES | `` | `` | `` | `` |
| 8 | `manifesto_prev_saida` | `date` | YES | `` | `` | `` | `` |
| 9 | `manifesto_valor` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 10 | `manifesto_pedagio` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 11 | `manifesto_adicionais` | `decimal(16,2)` | YES | `` | `` | `` | `` |
| 12 | `id_viagem` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ciot`, `id_administradora`, `id_viagem`
- **Datas/tempos prováveis**: `manifesto_emissao`, `manifesto_prev_saida`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `ciot`, `manifesto`
