# Tabela `azportoex.reclamacao_remessa`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `reclamacao_remessa`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1032`
- **Create time**: `2025-09-07T17:41:00`
- **Update time**: `2025-12-12T13:16:37`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_rec_remessa`

## Chaves estrangeiras (evidência estrutural)
- `id_reclamacao` → `reclamacao.id_reclamacao` (constraint=`fk_reclamacao_remessa`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_rec_remessa`]
- `fk_reclamacao_remessa` type=`BTREE` non_unique=`True` cols=[`id_reclamacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_rec_remessa` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_reclamacao` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `id_remessa` | `int` | YES | `` | `` | `` | `` |
| 4 | `tipo` | `tinyint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_rec_remessa`, `id_reclamacao`, `id_remessa`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-12T13:16:37`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `reclamacao`, `remessa`
