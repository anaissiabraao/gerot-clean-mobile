# Tabela `azportoex.averbacao_protocolos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `averbacao_protocolos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `221109`
- **Create time**: `2025-09-07T17:36:58`
- **Update time**: `2025-12-17T16:08:31`
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
- `id_config` → `averbacao_configuracao.id` (constraint=`averbacao_protocolos_fk_averb_config`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_minuta` → `minuta.id_minuta` (constraint=`averbacao_protocolos_fk_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto` → `MDFe.id_mdfe` (constraint=`fk_averbacao_protocolos_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `averbacao_protocolos_fk_averb_config` type=`BTREE` non_unique=`True` cols=[`id_config`]
- `averbacao_protocolos_fk_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]
- `fk_averbacao_protocolos_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]
- `idx_situacao` type=`BTREE` non_unique=`True` cols=[`status`, `tentativas`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_config` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `id_minuta` | `int` | YES | `` | `` | `MUL` | `Minuta` |
| 4 | `data` | `datetime` | YES | `` | `` | `` | `Data de averbacao` |
| 5 | `status` | `tinyint` | YES | `0` | `` | `MUL` | `Status: 0 nao averbado, 1 averbado` |
| 6 | `tipo` | `tinyint` | YES | `0` | `` | `` | `1-autorizado, 2-cancelado` |
| 7 | `tipo_documento` | `tinyint` | YES | `0` | `` | `` | `1-CTe, 2-minuta` |
| 8 | `modal` | `int` | YES | `` | `` | `` | `` |
| 9 | `protocolo` | `varchar(50)` | YES | `` | `` | `` | `Protocolo da seguradora` |
| 10 | `averbacao` | `varchar(50)` | YES | `` | `` | `` | `averbacao da seguradora` |
| 11 | `modo` | `tinyint` | YES | `1` | `` | `` | `1-Automatico, 2-manual` |
| 12 | `tentativas` | `tinyint` | YES | `0` | `` | `` | `` |
| 13 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 14 | `manifesto` | `int` | YES | `` | `` | `MUL` | `` |
| 15 | `id_coleta` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_config`, `id_minuta`, `id_coleta`
- **Datas/tempos prováveis**: `data`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:08:31`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `averbacao`, `protocolos`
