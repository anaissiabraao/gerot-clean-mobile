# Tabela `azportoex.processo_autorizacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `processo_autorizacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `557`
- **Create time**: `2025-09-07T17:40:34`
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
- `id_autorizacao`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_autorizacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_autorizacao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `logim` | `varchar(45)` | YES | `` | `` | `` | `` |
| 3 | `data_autorizado` | `date` | YES | `` | `` | `` | `` |
| 4 | `hora_autorizado` | `time` | YES | `` | `` | `` | `` |
| 5 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 6 | `id_processo` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_lancamento` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_autorizacao`, `id_processo`, `id_lancamento`
- **Datas/tempos prováveis**: `data_autorizado`, `hora_autorizado`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `processo`, `autorizacao`
