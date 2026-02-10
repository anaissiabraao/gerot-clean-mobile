# Tabela `azportoex.alteracoes_tipo_oco`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `alteracoes_tipo_oco`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `124`
- **Create time**: `2025-09-07T17:36:47`
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
- `id_ocorrencia` → `tipo_oco.id_oco` (constraint=`alteracoes_tipo_oco_id_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `operador` → `usuarios.id_usuario` (constraint=`alteracoes_tipo_oco_operador_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `alteracoes_tipo_oco_id_fk` type=`BTREE` non_unique=`True` cols=[`id_ocorrencia`]
- `alteracoes_tipo_oco_operador_fk` type=`BTREE` non_unique=`True` cols=[`operador`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_ocorrencia` | `smallint` | NO | `` | `` | `MUL` | `` |
| 3 | `campo` | `varchar(100)` | NO | `` | `` | `` | `` |
| 4 | `valor_antigo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 5 | `valor_novo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `data` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 7 | `operador` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ocorrencia`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `alteracoes`, `tipo`, `oco`
