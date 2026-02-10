# Tabela `azportoex.tabela_trecho_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_trecho_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `58506`
- **Create time**: `2025-09-07T17:41:26`
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
- `idx_tabela_trecho_historico` type=`BTREE` non_unique=`True` cols=[`trecho`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `trecho` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `campo` | `varchar(20)` | NO | `` | `` | `` | `` |
| 4 | `descricao` | `varchar(30)` | NO | `` | `` | `` | `` |
| 5 | `data` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 6 | `valor_antigo` | `varchar(30)` | YES | `` | `` | `` | `` |
| 7 | `valor_novo` | `varchar(30)` | YES | `` | `` | `` | `` |
| 8 | `operador` | `int` | NO | `` | `` | `` | `` |
| 9 | `alterar_status` | `tinyint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `tabela`, `trecho`, `historico`
