# Tabela `azportoex.cotacao_reprovada`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cotacao_reprovada`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `32017`
- **Create time**: `2025-09-07T17:37:30`
- **Update time**: `2025-12-17T13:47:13`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_cotacao_reprovada`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_cotacao_reprovada`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_cotacao_reprovada` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cotacao` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_motivo_cotacao_reprovada` | `int` | NO | `` | `` | `` | `` |
| 4 | `obs` | `varchar(100)` | YES | `` | `` | `` | `` |
| 5 | `valor_concorrencia` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `data_reprovada` | `date` | NO | `` | `` | `` | `` |
| 7 | `tipo` | `int unsigned` | NO | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_cotacao_reprovada`, `id_cotacao`, `id_motivo_cotacao_reprovada`
- **Datas/tempos prováveis**: `data_reprovada`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T13:47:13`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cotacao`, `reprovada`
