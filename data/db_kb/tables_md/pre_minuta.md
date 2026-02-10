# Tabela `azportoex.pre_minuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_minuta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `17868`
- **Create time**: `2025-09-07T17:40:31`
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
| 2 | `data_hora` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 3 | `malote` | `varchar(20)` | YES | `` | `` | `` | `` |
| 4 | `peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 5 | `id_minuta` | `int` | YES | `` | `` | `` | `` |
| 6 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 7 | `roteiriza_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `dados` | `mediumtext` | YES | `` | `` | `` | `` |
| 9 | `ocorrencia` | `varchar(250)` | YES | `` | `` | `` | `` |
| 10 | `base_atual` | `int` | YES | `` | `` | `` | `` |
| 11 | `base_proxima` | `int` | YES | `` | `` | `` | `` |
| 12 | `tentativas` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_minuta`, `id_usuario`
- **Datas/tempos prováveis**: `data_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pre`, `minuta`
