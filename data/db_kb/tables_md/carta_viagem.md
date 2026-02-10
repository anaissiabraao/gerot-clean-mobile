# Tabela `azportoex.carta_viagem`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `carta_viagem`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:04`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

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
| 2 | `manifesto` | `int` | NO | `` | `` | `` | `` |
| 3 | `data` | `date` | YES | `` | `` | `` | `` |
| 4 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 5 | `operador` | `int` | YES | `` | `` | `` | `` |
| 6 | `obs` | `varchar(3000)` | YES | `` | `` | `` | `` |
| 7 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 8 | `status` | `int` | NO | `1` | `` | `` | `` |
| 9 | `valor` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 10 | `operador_encerrado` | `int` | YES | `` | `` | `` | `` |
| 11 | `data_encerrado` | `date` | YES | `` | `` | `` | `` |
| 12 | `id_fornecedor` | `int` | YES | `0` | `` | `` | `` |
| 13 | `tipo` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 14 | `ciot` | `varchar(45)` | YES | `` | `` | `` | `` |
| 15 | `negativo` | `varchar(45)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fornecedor`
- **Datas/tempos prováveis**: `data`, `data_incluido`, `data_encerrado`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `carta`, `viagem`
