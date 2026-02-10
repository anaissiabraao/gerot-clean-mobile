# Tabela `azportoex.campanha`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `campanha`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:02`
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
- `id_campanha`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_campanha`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_campanha` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | YES | `` | `` | `` | `` |
| 3 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 4 | `valor` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 5 | `valor_utilizado` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `limite` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `faturamento` | `int` | YES | `` | `` | `` | `` |
| 8 | `rateio` | `int` | YES | `` | `` | `` | `` |
| 9 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 10 | `data_inicial` | `date` | YES | `` | `` | `` | `` |
| 11 | `data_final` | `date` | YES | `` | `` | `` | `` |
| 12 | `usuario` | `int` | YES | `` | `` | `` | `` |
| 13 | `observacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 14 | `status` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_campanha`
- **Datas/tempos prováveis**: `data_inicial`, `data_final`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `campanha`
