# Tabela `azportoex.armazem_categoria`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `armazem_categoria`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:36:54`
- **Update time**: `None`
- **Comment**: `	`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `estoque`
- **Evidência**: `inferido_por_nome:/(estoque|almox|deposito|armaz|invent|mov_estoq)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_categoria`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_categoria`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_categoria` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 3 | `codigo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 4 | `ncm` | `varchar(45)` | YES | `` | `` | `` | `` |
| 5 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 6 | `status` | `smallint` | NO | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_categoria`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `estoque`, `armazem`, `categoria`
