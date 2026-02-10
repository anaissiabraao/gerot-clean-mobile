# Tabela `azportoex.minuta_motoboy_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_motoboy_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:07`
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
- `id_log`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_log`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_log` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `frete` | `int` | YES | `` | `` | `` | `` |
| 3 | `status` | `int` | YES | `` | `` | `` | `` |
| 4 | `operador` | `int` | YES | `` | `` | `` | `` |
| 5 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 6 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `data_hora` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`
- **Datas/tempos prováveis**: `data_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `minuta`, `motoboy`, `hist`
