# Tabela `azportoex.notas_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notas_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `168312`
- **Create time**: `2025-10-11T06:46:50`
- **Update time**: `2025-12-17T16:45:21`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_log`

## Chaves estrangeiras (evidência estrutural)
- `nota` → `notas.id_nota` (constraint=`fk_notas_hist_notas`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_log`]
- `fk_notas_hist_notas` type=`BTREE` non_unique=`True` cols=[`nota`]
- `idx_notas_hist_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_log` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nota` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `hora` | `time` | YES | `` | `` | `` | `` |
| 5 | `status` | `smallint` | NO | `` | `` | `` | `` |
| 6 | `operador` | `int` | YES | `` | `` | `` | `` |
| 7 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 8 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `edi` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 11 | `hora_incluido` | `time` | NO | `` | `` | `` | `` |
| 12 | `ocorrencia` | `smallint` | YES | `` | `` | `` | `` |
| 13 | `coleta` | `int` | YES | `0` | `` | `` | `` |
| 14 | `unidade` | `smallint` | YES | `` | `` | `` | `` |
| 15 | `voo` | `varchar(7)` | YES | `` | `` | `` | `` |
| 16 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 17 | `entrega_nome` | `varchar(40)` | YES | `` | `` | `` | `` |
| 18 | `entrega_grau` | `varchar(20)` | YES | `` | `` | `` | `` |
| 19 | `entrega_rg` | `varchar(20)` | YES | `` | `` | `` | `` |
| 20 | `sigla` | `varchar(15)` | YES | `` | `` | `` | `` |
| 21 | `volumes` | `smallint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`
- **Datas/tempos prováveis**: `data`, `hora`, `data_incluido`, `hora_incluido`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:45:21`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `notas`, `hist`
