# Tabela `azportoex.frete_diferencial`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `frete_diferencial`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `274880`
- **Create time**: `2025-09-07T17:38:07`
- **Update time**: `2025-12-17T16:50:01`
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
- `idx_id_tipo_frete_diferencial` type=`BTREE` non_unique=`True` cols=[`id_tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `frete_coleta` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 3 | `frete_entrega` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 4 | `frete_nf` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 5 | `frete_nacional` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 6 | `frete_pedagio` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 7 | `frete_tad` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 8 | `frete_advalorem` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 9 | `frete_gris` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 10 | `frete_peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 11 | `frete_redespacho` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 12 | `frete_despacho` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 13 | `id_tipo` | `int` | YES | `` | `` | `MUL` | `` |
| 14 | `tipo` | `tinyint` | YES | `` | `` | `` | `1 para minuta e 2 para cotacao` |
| 15 | `frete_cat` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 16 | `frete_outros` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tipo`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:01`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `frete`, `diferencial`
