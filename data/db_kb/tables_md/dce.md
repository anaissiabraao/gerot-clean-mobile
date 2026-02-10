# Tabela `azportoex.dce`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `dce`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-29T17:47:35`
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
- `id_nf` → `notas_fiscais.id_nf` (constraint=`fk_notas_fiscais`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_notas_fiscais` type=`BTREE` non_unique=`True` cols=[`id_nf`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_nf` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `itens` | `json` | YES | `` | `` | `` | `` |
| 4 | `chave` | `varchar(44)` | YES | `` | `` | `` | `` |
| 5 | `numero` | `varchar(20)` | YES | `` | `` | `` | `` |
| 6 | `serie` | `varchar(5)` | YES | `` | `` | `` | `` |
| 7 | `status` | `tinyint` | YES | `` | `` | `` | `` |
| 8 | `caminho` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `data_autorizacao` | `timestamp` | YES | `` | `` | `` | `` |
| 10 | `data_cancelamento` | `timestamp` | YES | `` | `` | `` | `` |
| 11 | `prot_autorizacao` | `varchar(16)` | YES | `` | `` | `` | `` |
| 12 | `prot_cancelamento` | `varchar(16)` | YES | `` | `` | `` | `` |
| 13 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_nf`
- **Datas/tempos prováveis**: `data_autorizacao`, `data_cancelamento`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `dce`
