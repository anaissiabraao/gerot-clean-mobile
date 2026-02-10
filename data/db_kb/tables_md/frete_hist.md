# Tabela `azportoex.frete_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `frete_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `5183214`
- **Create time**: `2025-10-11T06:47:28`
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
- `id_log`

## Chaves estrangeiras (evidência estrutural)
- `frete` → `minuta.id_minuta` (constraint=`fk_frete_hist_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_nf` → `notas_fiscais.id_nf` (constraint=`fk_frete_hist_nf`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_log`]
- `fk_frete_hist_minuta` type=`BTREE` non_unique=`True` cols=[`frete`]
- `fk_frete_hist_nf` type=`BTREE` non_unique=`True` cols=[`id_nf`]
- `fk_frete_hist_tipo_oco` type=`BTREE` non_unique=`True` cols=[`status`]
- `idx_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_log` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `frete` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `hora` | `time` | YES | `` | `` | `` | `` |
| 5 | `status` | `smallint` | NO | `` | `` | `MUL` | `` |
| 6 | `operador` | `int` | YES | `` | `` | `` | `` |
| 7 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `edi` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 10 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 11 | `ocorrencia` | `smallint` | YES | `` | `` | `` | `` |
| 12 | `coleta` | `int` | YES | `` | `` | `` | `` |
| 13 | `unidade` | `smallint` | YES | `` | `` | `` | `` |
| 14 | `agente` | `int` | YES | `` | `` | `` | `` |
| 15 | `data_entrega` | `timestamp` | YES | `` | `` | `` | `` |
| 16 | `entrega_nome` | `varchar(40)` | YES | `` | `` | `` | `` |
| 17 | `entrega_grau` | `varchar(20)` | YES | `` | `` | `` | `` |
| 18 | `entrega_rg` | `varchar(20)` | YES | `` | `` | `` | `` |
| 19 | `placa` | `varchar(8)` | YES | `` | `` | `` | `` |
| 20 | `ineficiencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 21 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 22 | `id_nf` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`, `id_nf`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `data_entrega`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:27`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `frete`, `hist`
