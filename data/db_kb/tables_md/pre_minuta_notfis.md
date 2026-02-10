# Tabela `azportoex.pre_minuta_notfis`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_minuta_notfis`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:32`
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
- `pre_nota_notfis.id_pre_minuta` → `pre_minuta_notfis.id` (constraint=`fk_pre_nota_notfis`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cli_cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 3 | `cli_fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 4 | `cli_nome` | `varchar(60)` | YES | `` | `` | `` | `` |
| 5 | `rem_cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 6 | `rem_fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `rem_nome` | `varchar(60)` | YES | `` | `` | `` | `` |
| 8 | `rem_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 9 | `dest_cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 10 | `dest_fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 11 | `dest_nome` | `varchar(60)` | YES | `` | `` | `` | `` |
| 12 | `dest_cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 13 | `data_emissao` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 14 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 15 | `dados` | `text` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pre`, `minuta`, `notfis`
