# Tabela `azportoex.indice_rcfdc`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `indice_rcfdc`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:39:19`
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
| 2 | `valor` | `decimal(12,4)` | YES | `` | `` | `` | `` |
| 3 | `data` | `date` | NO | `` | `` | `` | `` |
| 4 | `operador` | `int` | NO | `` | `` | `` | `` |
| 5 | `status` | `int` | NO | `1` | `` | `` | `` |
| 6 | `seguradora` | `int` | NO | `` | `` | `` | `` |
| 7 | `uf_origem` | `varchar(2)` | YES | `` | `` | `` | `` |
| 8 | `uf_destino` | `varchar(2)` | YES | `` | `` | `` | `` |
| 9 | `minimo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 10 | `maximo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 11 | `seguro_item_add` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_indice`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `indice`, `rcfdc`
