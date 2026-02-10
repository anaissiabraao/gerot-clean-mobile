# Tabela `azportoex.minuta_despesas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_despesas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `229990`
- **Create time**: `2025-09-07T17:40:03`
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
- `idx_minuta_despesas_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `fornecedor` | `int` | NO | `` | `` | `` | `` |
| 5 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 6 | `forma` | `int` | YES | `` | `` | `` | `` |
| 7 | `documento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 8 | `valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 9 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 10 | `operador` | `int` | NO | `` | `` | `` | `` |
| 11 | `lancamento` | `int` | YES | `` | `` | `` | `` |
| 12 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 13 | `status` | `int` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`, `despesas`
