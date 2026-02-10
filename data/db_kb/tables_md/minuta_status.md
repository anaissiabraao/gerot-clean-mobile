# Tabela `azportoex.minuta_status`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_status`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `17`
- **Create time**: `2025-09-07T17:40:09`
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
- `id_status`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_status`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_status` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 3 | `cor` | `varchar(12)` | NO | `` | `` | `` | `` |
| 4 | `descricao_b2w` | `varchar(55)` | NO | `` | `` | `` | `` |
| 5 | `tipo` | `tinyint` | NO | `0` | `` | `` | `` |
| 6 | `editar` | `tinyint` | NO | `0` | `` | `` | `` |
| 7 | `descricao_ingles` | `varchar(45)` | YES | `` | `` | `` | `` |
| 8 | `prazo_padrao` | `tinyint` | YES | `` | `` | `` | `` |
| 9 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 10 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 11 | `perm_manifesto` | `tinyint` | NO | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_status`
- **Datas/tempos prováveis**: `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`, `status`
