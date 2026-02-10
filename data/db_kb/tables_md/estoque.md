# Tabela `azportoex.estoque`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `estoque`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1740`
- **Create time**: `2025-09-07T17:37:50`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `estoque`
- **Evidência**: `inferido_por_nome:/(estoque|almox|deposito|armaz|invent|mov_estoq)/`

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
- `idx_estoque_ultimaEntrada` type=`BTREE` non_unique=`True` cols=[`ultimaEntrada`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_produto` | `int unsigned` | YES | `0` | `` | `` | `` |
| 2 | `quantidade` | `decimal(12,2) unsigned` | YES | `0.00` | `` | `` | `` |
| 3 | `ultimaEntrada` | `date` | YES | `0000-00-00` | `` | `MUL` | `` |
| 4 | `ultimaSaida` | `date` | YES | `0000-00-00` | `` | `` | `` |
| 5 | `cliente` | `int` | YES | `` | `` | `` | `` |
| 6 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 7 | `valor` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 8 | `produto` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `data` | `date` | NO | `` | `` | `` | `` |
| 10 | `documento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `serie` | `varchar(15)` | YES | `` | `` | `` | `` |
| 12 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 13 | `hora_incluido` | `varchar(9)` | YES | `` | `` | `` | `` |
| 14 | `operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 15 | `rua` | `varchar(3)` | YES | `` | `` | `` | `` |
| 16 | `andar` | `varchar(3)` | YES | `` | `` | `` | `` |
| 17 | `CFOP` | `smallint` | YES | `0` | `` | `` | `` |
| 18 | `valorVenda` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 19 | `peso` | `decimal(12,2)` | NO | `0.01` | `` | `` | `` |
| 20 | `lote` | `varchar(30)` | YES | `` | `` | `` | `` |
| 21 | `validade` | `date` | YES | `` | `` | `` | `` |
| 22 | `volumes` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_produto`, `id`
- **Datas/tempos prováveis**: `ultimaEntrada`, `ultimaSaida`, `data`, `data_incluido`, `hora_incluido`, `validade`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `estoque`
