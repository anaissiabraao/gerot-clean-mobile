# Tabela `azportoex.ciot_transacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_transacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `4`
- **Create time**: `2025-09-07T17:37:09`
- **Update time**: `None`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_ciot` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 5 | `transacao_id` | `int` | YES | `` | `` | `` | `` |
| 6 | `transacao_valor` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `transacao_tipo` | `int` | YES | `` | `` | `` | `` |
| 8 | `transacao_quantidade` | `int` | YES | `` | `` | `` | `` |
| 9 | `data` | `date` | NO | `` | `` | `` | `` |
| 10 | `status` | `int` | YES | `1` | `` | `` | `` |
| 11 | `id_manifesto` | `int` | YES | `` | `` | `` | `` |
| 12 | `transacao_descricao` | `varchar(245)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ciot`, `id_administradora`, `id_usuario`, `transacao_id`, `id_manifesto`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `transacao`
