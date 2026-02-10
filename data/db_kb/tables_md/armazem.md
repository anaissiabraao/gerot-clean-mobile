# Tabela `azportoex.armazem`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `armazem`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:36:54`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `estoque`
- **Evidência**: `inferido_por_nome:/(estoque|almox|deposito|armaz|invent|mov_estoq)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_item`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_item`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_item` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `barra` | `varchar(45)` | NO | `` | `` | `` | `` |
| 3 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 4 | `operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 5 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 6 | `hora_incluido` | `varchar(9)` | NO | `` | `` | `` | `` |
| 7 | `data_saida` | `date` | NO | `` | `` | `` | `` |
| 8 | `hora_saida` | `varchar(9)` | NO | `` | `` | `` | `` |
| 9 | `operador_saida` | `int unsigned` | NO | `` | `` | `` | `` |
| 10 | `lote` | `int unsigned` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_item`
- **Datas/tempos prováveis**: `data_incluido`, `hora_incluido`, `data_saida`, `hora_saida`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `estoque`, `armazem`
