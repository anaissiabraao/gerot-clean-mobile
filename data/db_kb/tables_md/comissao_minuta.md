# Tabela `azportoex.comissao_minuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `comissao_minuta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `79412`
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
- `idx_fatura` type=`BTREE` non_unique=`True` cols=[`fatura`]
- `idx_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 4 | `vendedor` | `int` | NO | `` | `` | `` | `` |
| 5 | `base` | `int` | YES | `` | `` | `` | `` |
| 6 | `comissao` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `formula` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `formula_base` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `percentual` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `vinculo` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `comissao`, `minuta`
