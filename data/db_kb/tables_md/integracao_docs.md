# Tabela `azportoex.integracao_docs`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `integracao_docs`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_general_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:19`
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
| 2 | `tipo_doc` | `int` | YES | `0` | `` | `` | `` |
| 3 | `id_doc` | `int` | YES | `0` | `` | `` | `` |
| 4 | `id_anexo` | `int` | YES | `` | `` | `` | `` |
| 5 | `data` | `date` | YES | `` | `` | `` | `` |
| 6 | `hora` | `time` | YES | `` | `` | `` | `` |
| 7 | `id_tipo_integracao` | `int` | YES | `0` | `` | `` | `` |
| 8 | `url` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `id_agendamento` | `int` | YES | `0` | `` | `` | `` |
| 10 | `id_comando` | `int` | YES | `0` | `` | `` | `` |
| 11 | `status` | `int` | YES | `0` | `` | `` | `` |
| 12 | `tentativa_envio` | `int` | YES | `0` | `` | `` | `` |
| 13 | `data_ultima_tentativa` | `datetime` | YES | `` | `` | `` | `` |
| 14 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_doc`, `id_anexo`, `id_tipo_integracao`, `id_agendamento`, `id_comando`
- **Datas/tempos prováveis**: `data`, `hora`, `data_ultima_tentativa`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `integracao`, `docs`
