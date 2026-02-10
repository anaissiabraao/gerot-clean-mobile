# Tabela `azportoex.cotacao_despesas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cotacao_despesas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1443`
- **Create time**: `2025-09-07T17:37:28`
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
- `id_cotacao_despesas`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_cotacao_despesas`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_cotacao_despesas` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cotacao` | `int` | NO | `` | `` | `` | `` |
| 3 | `fornecedor` | `int` | NO | `` | `` | `` | `` |
| 4 | `descricao` | `varchar(150)` | YES | `` | `` | `` | `` |
| 5 | `documento` | `varchar(100)` | YES | `` | `` | `` | `` |
| 6 | `forma` | `int` | NO | `` | `` | `` | `` |
| 7 | `valor` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `data_sistema` | `date` | NO | `` | `` | `` | `` |
| 9 | `data_usuario` | `date` | NO | `` | `` | `` | `` |
| 10 | `operador` | `int` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_cotacao_despesas`
- **Datas/tempos prováveis**: `data_sistema`, `data_usuario`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cotacao`, `despesas`
