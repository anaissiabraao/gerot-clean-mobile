# Tabela `azportoex.trecho_cnpj`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `trecho_cnpj`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `16`
- **Create time**: `2025-09-07T17:41:31`
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
- `id_trecho_cnpj`

## Chaves estrangeiras (evidência estrutural)
- `id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_trecho_cnpj_trecho`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_trecho_cnpj`]
- `fk_trecho_cnpj_trecho` type=`BTREE` non_unique=`True` cols=[`id_trecho`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_trecho_cnpj` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tabela` | `int` | NO | `` | `` | `` | `` |
| 3 | `id_trecho` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `cnpj` | `varchar(15)` | NO | `` | `` | `` | `` |
| 5 | `tipo` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_trecho_cnpj`, `id_tabela`, `id_trecho`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `trecho`, `cnpj`
