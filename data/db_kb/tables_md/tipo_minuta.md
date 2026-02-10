# Tabela `azportoex.tipo_minuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tipo_minuta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `5`
- **Create time**: `2025-09-07T17:41:29`
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

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 3 | `edita` | `tinyint` | YES | `1` | `` | `` | `` |
| 4 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 5 | `calcula_devolucao` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `calcula_reentrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 7 | `tipo_imposto` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `consolida_awb` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `permitir_duplicidade_nota` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `gera_ocorrencia` | `int` | YES | `0` | `` | `` | `` |
| 11 | `operador` | `int` | YES | `` | `` | `` | `` |
| 12 | `emissao_cte` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `prefixo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 14 | `base_retira` | `int` | YES | `` | `` | `` | `` |
| 15 | `inverte` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 16 | `confirma_copia` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 17 | `tipo_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `tde_devolucao` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 19 | `cotacao_sem_frete` | `tinyint(1)` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `emissao_cte`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tipo`, `minuta`
