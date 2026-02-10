# Tabela `azportoex.brd_tabela_importa`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `brd_tabela_importa`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_general_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:02`
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
| 2 | `date_created` | `datetime` | NO | `` | `` | `` | `` |
| 3 | `id_usuario` | `int` | NO | `` | `` | `` | `` |
| 4 | `dominio_importa` | `varchar(100)` | NO | `` | `` | `` | `` |
| 5 | `status` | `int` | NO | `0` | `` | `` | `` |
| 6 | `id_transacao` | `bigint` | NO | `` | `` | `` | `` |
| 7 | `id_unidade` | `int` | NO | `0` | `` | `` | `` |
| 8 | `dados_importa` | `json` | YES | `` | `` | `` | `` |
| 9 | `servico_vinculado` | `json` | YES | `` | `` | `` | `` |
| 10 | `nova_tabela` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_usuario`, `id_transacao`, `id_unidade`
- **Datas/tempos prováveis**: `date_created`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `brd`, `tabela`, `importa`
