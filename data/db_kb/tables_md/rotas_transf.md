# Tabela `azportoex.rotas_transf`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rotas_transf`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:03`
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
- `id_rota_transf`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_rota_transf`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_rota_transf` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `origem` | `int` | YES | `` | `` | `` | `` |
| 3 | `destino` | `int` | YES | `` | `` | `` | `` |
| 4 | `km_total` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 5 | `custo_total` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 6 | `valor_risco` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 7 | `tempo_rota` | `time` | YES | `` | `` | `` | `` |
| 8 | `hora_chegada` | `time` | YES | `` | `` | `` | `` |
| 9 | `operador` | `int` | YES | `` | `` | `` | `` |
| 10 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 11 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 12 | `hora_incluido` | `time` | YES | `` | `` | `` | `` |
| 13 | `responsavel` | `int` | YES | `0` | `` | `` | `` |
| 14 | `status` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_rota_transf`
- **Datas/tempos prováveis**: `tempo_rota`, `hora_chegada`, `data_incluido`, `hora_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `rotas`, `transf`
