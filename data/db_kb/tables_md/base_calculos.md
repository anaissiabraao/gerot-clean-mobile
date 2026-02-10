# Tabela `azportoex.base_calculos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `base_calculos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
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
- `unidade`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`unidade`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `pis` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 2 | `cofins` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 3 | `i_renda` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 4 | `csll` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 5 | `alimentacao` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `v_transporte` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `inss` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `ter_inss` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `ter_inss_indice` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `ter_sest` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 11 | `ter_sest_indice` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `custo_coleta` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `custo_entrega` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 14 | `custo_imposto` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `custo_seguro` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `unidade` | `int` | NO | `` | `` | `PRI` | `` |
| 17 | `issqn` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 18 | `icms_comissao` | `decimal(7,2)` | YES | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: (nenhum padrão _id/id_ detectado)
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `base`, `calculos`
