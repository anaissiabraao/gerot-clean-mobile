# Tabela `azportoex.tabela_formulas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_formulas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `98`
- **Create time**: `2025-09-07T17:41:23`
- **Update time**: `2025-12-15T20:22:05`
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
- `id_tabela` → `tabela_frete.id_tabela` (constraint=`tabela_formulas_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `tabela_formulas_fk` type=`BTREE` non_unique=`True` cols=[`id_tabela`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tabela` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `servico` | `int` | NO | `` | `` | `` | `` |
| 4 | `campo` | `varchar(20)` | NO | `` | `` | `` | `` |
| 5 | `expressao` | `varchar(255)` | NO | `` | `` | `` | `` |
| 6 | `sim` | `varchar(255)` | NO | `` | `` | `` | `` |
| 7 | `nao` | `varchar(255)` | NO | `` | `` | `` | `` |
| 8 | `operador` | `int` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tabela`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-15T20:22:05`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tabela`, `formulas`
