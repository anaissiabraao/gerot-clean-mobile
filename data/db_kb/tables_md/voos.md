# Tabela `azportoex.voos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `voos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3879`
- **Create time**: `2025-09-07T17:42:11`
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
- `id_voo`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_voo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_voo` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cia` | `smallint` | NO | `` | `` | `` | `` |
| 3 | `voo` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `tempo` | `varchar(5)` | NO | `` | `` | `` | `` |
| 5 | `escalas` | `smallint` | NO | `0` | `` | `` | `` |
| 6 | `partida` | `varchar(5)` | NO | `` | `` | `` | `` |
| 7 | `chegada` | `varchar(5)` | NO | `` | `` | `` | `` |
| 8 | `origem` | `varchar(4)` | NO | `` | `` | `` | `` |
| 9 | `destino` | `varchar(4)` | NO | `` | `` | `` | `` |
| 10 | `dias` | `varchar(15)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_voo`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `voos`
