# Tabela `azportoex.centro_raiz`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `centro_raiz`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `114`
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
- `id_raiz`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_raiz`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_raiz` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(45)` | NO | `` | `` | `` | `` |
| 3 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 4 | `data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 5 | `operador` | `int unsigned` | NO | `0` | `` | `` | `` |
| 6 | `tipo` | `int unsigned` | NO | `1` | `` | `` | `` |
| 7 | `ordem` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `limite` | `decimal(15,2)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_raiz`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `centro`, `raiz`
