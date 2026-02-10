# Tabela `azportoex.edi`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `edi`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:37`
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
- `id_edi`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_edi`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_edi` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `` | `` |
| 3 | `arquivo` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `tipo` | `int` | NO | `0` | `` | `` | `` |
| 5 | `entregas` | `int` | NO | `0` | `` | `` | `` |
| 6 | `volumes` | `int` | NO | `` | `` | `` | `` |
| 7 | `nf_valor` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 8 | `peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 9 | `status` | `int` | NO | `0` | `` | `` | `` |
| 10 | `data` | `date` | NO | `` | `` | `` | `` |
| 11 | `hora` | `varchar(5)` | NO | `` | `` | `` | `` |
| 12 | `operador` | `int` | NO | `` | `` | `` | `` |
| 13 | `campanha` | `int` | YES | `0` | `` | `` | `` |
| 14 | `agrupa_nf` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_edi`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `edi`
