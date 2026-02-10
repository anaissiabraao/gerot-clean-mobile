# Tabela `azportoex.correcao_hist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `correcao_hist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3541`
- **Create time**: `2025-09-07T17:37:20`
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
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_minuta` | `int` | NO | `` | `` | `` | `` |
| 2 | `evt_cte` | `tinyint unsigned` | NO | `` | `` | `` | `` |
| 3 | `status` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `data` | `date` | NO | `` | `` | `` | `` |
| 5 | `hora` | `varchar(8)` | NO | `` | `` | `` | `` |
| 6 | `protocolo` | `varchar(16)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_minuta`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `correcao`, `hist`
