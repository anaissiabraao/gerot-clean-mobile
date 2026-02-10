# Tabela `azportoex.tabela_historico`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_historico`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `40`
- **Create time**: `2025-09-07T17:41:24`
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

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 3 | `tabela` | `int` | YES | `` | `` | `` | `` |
| 4 | `campo` | `varchar(20)` | YES | `` | `` | `` | `` |
| 5 | `valor` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 6 | `tipo_valor` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `tipo_ajuste` | `tinyint` | YES | `` | `` | `` | `` |
| 8 | `origem_regiao` | `int` | YES | `` | `` | `` | `` |
| 9 | `origem_zona` | `int` | YES | `` | `` | `` | `` |
| 10 | `origem_estado` | `int` | YES | `` | `` | `` | `` |
| 11 | `origem_cidade` | `int` | YES | `` | `` | `` | `` |
| 12 | `cidades_origem` | `tinyint` | YES | `` | `` | `` | `` |
| 13 | `destino_regiao` | `int` | YES | `` | `` | `` | `` |
| 14 | `destino_zona` | `int` | YES | `` | `` | `` | `` |
| 15 | `destino_estado` | `int` | YES | `` | `` | `` | `` |
| 16 | `destino_cidade` | `int` | YES | `` | `` | `` | `` |
| 17 | `cidades_destino` | `int` | YES | `` | `` | `` | `` |
| 18 | `inicio` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 19 | `fim` | `datetime` | YES | `` | `` | `` | `` |
| 20 | `servico` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_usuario`
- **Datas/tempos prováveis**: `inicio`, `fim`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `auditoria_logs`, `tabela`, `historico`
