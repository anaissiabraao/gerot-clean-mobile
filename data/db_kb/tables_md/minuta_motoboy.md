# Tabela `azportoex.minuta_motoboy`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_motoboy`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:06`
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
- `id_minuta`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_minuta` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_origem` | `int` | YES | `` | `` | `` | `` |
| 4 | `id_destino` | `int` | YES | `` | `` | `` | `` |
| 5 | `id_endereco_origem` | `int` | YES | `` | `` | `` | `` |
| 6 | `id_endereco_destino` | `int` | YES | `` | `` | `` | `` |
| 7 | `servico` | `int` | YES | `` | `` | `` | `` |
| 8 | `total_volumes` | `int` | YES | `` | `` | `` | `` |
| 9 | `obs` | `varchar(250)` | YES | `` | `` | `` | `` |
| 10 | `peso_real` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 11 | `frete_total` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 12 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 13 | `manifesto` | `int` | YES | `` | `` | `` | `` |
| 14 | `operador` | `int` | YES | `` | `` | `` | `` |
| 15 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 16 | `data_hora` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 17 | `status` | `int` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_minuta`, `id_cliente`, `id_origem`, `id_destino`, `id_endereco_origem`, `id_endereco_destino`
- **Datas/tempos prováveis**: `data_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`, `motoboy`
