# Tabela `azportoex.ViewHistoricoMinuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ViewHistoricoMinuta`
- **Tipo**: `VIEW`
- **Engine**: `None`
- **Collation**: `None`
- **Registros (estimativa)**: `0`
- **Create time**: `2024-02-26T05:13:46`
- **Update time**: `None`
- **Comment**: `VIEW`
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
| 1 | `id_log` | `int` | NO | `0` | `` | `` | `` |
| 2 | `obs` | `int` | NO | `0` | `` | `` | `` |
| 3 | `frete` | `int` | NO | `0` | `` | `` | `` |
| 4 | `operador` | `int` | NO | `0` | `` | `` | `` |
| 5 | `data` | `int` | NO | `0` | `` | `` | `` |
| 6 | `hora` | `int` | NO | `0` | `` | `` | `` |
| 7 | `status` | `int` | NO | `0` | `` | `` | `` |
| 8 | `descricao` | `int` | NO | `0` | `` | `` | `` |
| 9 | `sigla` | `int` | NO | `0` | `` | `` | `` |
| 10 | `id_oco` | `int` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_log`, `id_oco`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `viewhistoricominuta`
