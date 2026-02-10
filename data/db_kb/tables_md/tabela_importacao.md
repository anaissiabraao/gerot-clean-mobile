# Tabela `azportoex.tabela_importacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_importacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_general_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:24`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `integracoes`
- **Evidência**: `inferido_por_nome:/(sync|integr|import|export|api|webhook|queue)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `uuid`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`uuid`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `uuid` | `varchar(40)` | NO | `` | `` | `PRI` | `` |
| 2 | `transportadora` | `int` | NO | `` | `` | `` | `` |
| 3 | `usuario` | `int` | NO | `` | `` | `` | `` |
| 4 | `tabela` | `int` | YES | `` | `` | `` | `` |
| 5 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `progresso` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `data_inclusao` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 8 | `dados` | `json` | YES | `` | `` | `` | `` |
| 9 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: (nenhum padrão _id/id_ detectado)
- **Datas/tempos prováveis**: `data_inclusao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `tabela`, `importacao`
