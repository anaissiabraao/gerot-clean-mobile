# Tabela `azportoex.tabela_especifica`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_especifica`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `270`
- **Create time**: `2025-09-07T17:41:11`
- **Update time**: `2025-12-16T13:33:12`
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
- `id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_tabela_especifica_id_trecho`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_tabela_especifica_id_trecho` type=`BTREE` non_unique=`True` cols=[`id_trecho`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tabela` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_trecho` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `codigo` | `varchar(4)` | NO | `` | `` | `` | `` |
| 5 | `valor` | `decimal(15,5)` | YES | `` | `` | `` | `` |
| 6 | `minimo` | `decimal(15,5)` | YES | `` | `` | `` | `` |
| 7 | `soma_frete` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `peso_franquia` | `decimal(15,5)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tabela`, `id_trecho`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T13:33:12`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tabela`, `especifica`
