# Tabela `azportoex.smart`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `smart`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:09`
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
| 2 | `mes` | `date` | NO | `` | `` | `` | `` |
| 3 | `minuta` | `int` | YES | `300` | `` | `` | `` |
| 4 | `awb` | `int` | YES | `300` | `` | `` | `` |
| 5 | `nota` | `int` | YES | `300` | `` | `` | `` |
| 6 | `nfse` | `int` | YES | `0` | `` | `` | `` |
| 7 | `manifesto` | `int` | YES | `300` | `` | `` | `` |
| 8 | `adicionais_minuta` | `int` | YES | `0` | `` | `` | `` |
| 9 | `adicionais_awb` | `int` | YES | `0` | `` | `` | `` |
| 10 | `adicionais_nota` | `int` | YES | `0` | `` | `` | `` |
| 11 | `adicionais_nfse` | `int` | YES | `0` | `` | `` | `` |
| 12 | `adicionais_manifesto` | `int` | YES | `0` | `` | `` | `` |
| 13 | `total_minuta` | `int` | YES | `0` | `` | `` | `` |
| 14 | `total_awb` | `int` | YES | `0` | `` | `` | `` |
| 15 | `total_nota` | `int` | YES | `0` | `` | `` | `` |
| 16 | `total_nfse` | `int` | YES | `0` | `` | `` | `` |
| 17 | `total_manifesto` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `mes`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `smart`
