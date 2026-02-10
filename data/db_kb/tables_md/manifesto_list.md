# Tabela `azportoex.manifesto_list`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `manifesto_list`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `413127`
- **Create time**: `2025-11-12T15:01:37`
- **Update time**: `2025-12-17T16:35:46`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `idx_manifesto_list_id_manifesto` type=`BTREE` non_unique=`True` cols=[`id_manifesto`]
- `idx_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`, `tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_manifesto` | `int unsigned` | NO | `` | `` | `MUL` | `` |
| 3 | `minuta` | `int unsigned` | NO | `` | `` | `MUL` | `` |
| 4 | `tipo` | `int unsigned` | NO | `1` | `` | `` | `1=MINUTA, 2=COELTA` |
| 5 | `custo` | `float` | NO | `0` | `` | `` | `` |
| 6 | `ordem` | `smallint` | YES | `` | `` | `` | `` |
| 7 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 8 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 9 | `dist_entre_rota` | `int` | YES | `` | `` | `` | `` |
| 10 | `tempo_entre_rota` | `int` | YES | `` | `` | `` | `` |
| 11 | `ordem_manifesto` | `int` | YES | `` | `` | `` | `` |
| 12 | `km_final` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_manifesto`, `id_usuario`
- **Datas/tempos prováveis**: `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:35:46`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `manifesto`, `list`
