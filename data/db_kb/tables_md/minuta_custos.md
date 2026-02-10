# Tabela `azportoex.minuta_custos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `minuta_custos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `142816`
- **Create time**: `2025-09-07T17:40:02`
- **Update time**: `2025-12-17T16:50:01`
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
- `minuta` → `minuta.id_minuta` (constraint=`fk_id_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `minuta` → `minuta.id_minuta` (constraint=`fk_minuta_custos_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_id_minuta` type=`BTREE` non_unique=`True` cols=[`minuta`]
- `idx_documento_minuta_custos` type=`BTREE` non_unique=`True` cols=[`documento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `tipo` | `varchar(15)` | NO | `` | `` | `` | `` |
| 4 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 5 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 6 | `documento` | `int` | NO | `` | `` | `MUL` | `` |
| 7 | `valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:01`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `minuta`, `custos`
