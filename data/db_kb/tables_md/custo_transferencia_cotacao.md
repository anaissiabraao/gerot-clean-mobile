# Tabela `azportoex.custo_transferencia_cotacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `custo_transferencia_cotacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:35`
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
- `id_custo_transferencia_cotacao`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_custo_transferencia_cotacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_custo_transferencia_cotacao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cotacao` | `int` | NO | `` | `` | `` | `` |
| 3 | `trecho` | `varchar(30)` | YES | `` | `` | `` | `` |
| 4 | `companhia` | `varchar(400)` | YES | `` | `` | `` | `` |
| 5 | `valor_custo` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 6 | `cia_id` | `int` | YES | `` | `` | `` | `` |
| 7 | `servico_id` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_custo_transferencia_cotacao`, `id_cotacao`, `cia_id`, `servico_id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `custo`, `transferencia`, `cotacao`
