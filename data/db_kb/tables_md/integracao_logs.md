# Tabela `azportoex.integracao_logs`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `integracao_logs`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:19`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

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
- `idx_documento` type=`BTREE` non_unique=`True` cols=[`documento`]
- `idx_integracao_logs_data` type=`BTREE` non_unique=`True` cols=[`data`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_configuracao` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_tipo` | `int` | NO | `` | `` | `` | `` |
| 4 | `documento` | `int` | YES | `` | `` | `MUL` | `` |
| 5 | `evento` | `mediumtext` | NO | `` | `` | `` | `` |
| 6 | `data` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |
| 7 | `operador` | `int` | NO | `` | `` | `` | `` |
| 8 | `status` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 9 | `monitoramento` | `varchar(255)` | YES | `` | `` | `` | `` |
| 10 | `pre_monitoramento` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_configuracao`, `id_tipo`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `integracao`, `logs`
