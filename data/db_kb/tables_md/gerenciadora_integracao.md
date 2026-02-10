# Tabela `azportoex.gerenciadora_integracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `gerenciadora_integracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:06`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `integracoes`
- **Evidência**: `inferido_por_nome:/(sync|integr|import|export|api|webhook|queue)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `gerenciadora` | `int` | NO | `` | `` | `` | `` |
| 3 | `integracao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 4 | `contrato` | `varchar(45)` | YES | `` | `` | `` | `` |
| 5 | `chave1` | `varchar(45)` | YES | `` | `` | `` | `` |
| 6 | `chave2` | `varchar(45)` | YES | `` | `` | `` | `` |
| 7 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 8 | `ambiente` | `tinyint` | YES | `2` | `` | `` | `` |
| 9 | `informa_valor` | `tinyint` | YES | `1` | `` | `` | `` |
| 10 | `informa_notas` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `unidade` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `gerenciadora`, `integracao`
