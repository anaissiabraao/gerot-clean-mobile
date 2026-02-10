# Tabela `azportoex.seguro_indice`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `seguro_indice`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:41:05`
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
- `id_indice`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_indice`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_indice` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `uf_origem` | `varchar(2)` | YES | `` | `` | `` | `` |
| 3 | `uf_destino` | `varchar(2)` | YES | `` | `` | `` | `` |
| 4 | `taxa` | `decimal(12,4)` | YES | `` | `` | `` | `` |
| 5 | `status` | `int` | NO | `1` | `` | `` | `` |
| 6 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 7 | `operador` | `int` | NO | `` | `` | `` | `` |
| 8 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 9 | `seguradora` | `int` | NO | `` | `` | `` | `` |
| 10 | `minimo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 11 | `maximo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 12 | `seguro_item_add` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_indice`
- **Datas/tempos prováveis**: `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `seguro`, `indice`
