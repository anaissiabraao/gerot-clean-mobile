# Tabela `azportoex.coleta_km`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `coleta_km`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `4670`
- **Create time**: `2025-09-07T17:37:17`
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
| 2 | `km` | `int` | YES | `` | `` | `` | `` |
| 3 | `coleta_id` | `int` | YES | `` | `` | `` | `` |
| 4 | `motorista_id` | `int` | YES | `` | `` | `` | `` |
| 5 | `veiculo_id` | `int` | YES | `` | `` | `` | `` |
| 6 | `latitude` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `longitude` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `criado_em` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `coleta_id`, `motorista_id`, `veiculo_id`
- **Datas/tempos prováveis**: `criado_em`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `coleta`
