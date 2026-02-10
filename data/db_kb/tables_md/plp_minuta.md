# Tabela `azportoex.plp_minuta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `plp_minuta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:31`
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
- `id_plp`, `id_minuta`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_plp`, `id_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_plp` | `int` | NO | `` | `` | `PRI` | `` |
| 2 | `id_minuta` | `int` | NO | `` | `` | `PRI` | `` |
| 3 | `id_destino` | `int` | NO | `` | `` | `` | `` |
| 4 | `servico` | `varchar(6)` | NO | `` | `` | `` | `` |
| 5 | `embalagem` | `varchar(3)` | NO | `` | `` | `` | `` |
| 6 | `quantidade` | `int` | NO | `` | `` | `` | `` |
| 7 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `valor` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |
| 9 | `rn` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 10 | `mp` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 11 | `ar` | `tinyint(1)` | NO | `0` | `` | `` | `` |
| 12 | `vd` | `tinyint(1)` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_plp`, `id_minuta`, `id_destino`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `plp`, `minuta`
