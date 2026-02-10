# Tabela `azportoex.fr_manutencao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_manutencao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:04`
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
| 2 | `id_modelo_manutencao` | `int` | NO | `` | `` | `` | `id de fr_modelo_manutencao` |
| 3 | `id_veiculo` | `int` | NO | `` | `` | `` | `id do veiculo` |
| 4 | `km_veiculo` | `int` | NO | `` | `` | `` | `km do veiculo quando a manutenção é gerada` |
| 5 | `dt_criada` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `data em que a preventiva é associada ao veiculo ou que é criada apos confirmação de preventiva anterior` |
| 6 | `dt_programada` | `date` | YES | `` | `` | `` | `data programada para manutenção` |
| 7 | `dt_executada` | `date` | YES | `` | `` | `` | `data de execucao manutenção` |
| 8 | `ordem_manutencao` | `int` | YES | `` | `` | `` | `id da ordem de manutencao gerada` |
| 9 | `operador` | `int` | NO | `` | `` | `` | `` |
| 10 | `status` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_modelo_manutencao`, `id_veiculo`
- **Datas/tempos prováveis**: `dt_criada`, `dt_programada`, `dt_executada`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `manutencao`
