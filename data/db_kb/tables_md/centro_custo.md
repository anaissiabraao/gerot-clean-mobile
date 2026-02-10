# Tabela `azportoex.centro_custo`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `centro_custo`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `597`
- **Create time**: `2025-09-07T17:37:05`
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
- `id_centro`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_centro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_centro` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `tipo` | `int` | NO | `1` | `` | `` | `` |
| 4 | `data` | `date` | NO | `` | `` | `` | `` |
| 5 | `operador` | `int` | NO | `` | `` | `` | `` |
| 6 | `status` | `int` | NO | `1` | `` | `` | `` |
| 7 | `raiz` | `int unsigned` | YES | `` | `` | `` | `` |
| 8 | `rateio` | `int unsigned` | NO | `0` | `` | `` | `` |
| 9 | `natureza` | `varchar(45)` | YES | `` | `` | `` | `` |
| 10 | `integracao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `despesa` | `varchar(1)` | YES | `` | `` | `` | `` |
| 12 | `ordem` | `varchar(25)` | YES | `` | `` | `` | `` |
| 13 | `perfil` | `int` | NO | `1` | `` | `` | `` |
| 14 | `limite` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 15 | `id_trecho_cliente` | `int` | NO | `` | `` | `` | `` |
| 16 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 17 | `id_origem` | `int` | YES | `` | `` | `` | `` |
| 18 | `id_destino` | `int` | YES | `` | `` | `` | `` |
| 19 | `desconto_frete_peso` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 20 | `desconto_advalorem` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 21 | `desconto_gris` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 22 | `acrescimo_frete_peso` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 23 | `acrescimo_advalorem` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 24 | `acrescimo_gris` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 25 | `dre_financeiro` | `tinyint` | YES | `1` | `` | `` | `` |
| 26 | `dre_contabil` | `tinyint` | YES | `1` | `` | `` | `` |
| 27 | `tipo_contabil` | `tinyint` | YES | `1` | `` | `` | `` |
| 28 | `codigo_fitid` | `varchar(11)` | YES | `` | `` | `` | `` |
| 29 | `codigo_contabil_externo` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_centro`, `id_trecho_cliente`, `id_cliente`, `id_origem`, `id_destino`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `centro`, `custo`
