# Tabela `azportoex.destinos_coleta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `destinos_coleta`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_general_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:36`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_coleta` | `int` | YES | `` | `` | `` | `` |
| 3 | `cotacao` | `int` | YES | `` | `` | `` | `` |
| 4 | `tipo_responsavel` | `int` | YES | `` | `` | `` | `` |
| 5 | `responsavel` | `int` | YES | `` | `` | `` | `` |
| 6 | `veiculo` | `int` | YES | `` | `` | `` | `` |
| 7 | `transf_origem` | `int` | YES | `` | `` | `` | `` |
| 8 | `transf_destino` | `int` | YES | `` | `` | `` | `` |
| 9 | `semi_reboque1` | `int` | YES | `` | `` | `` | `` |
| 10 | `semi_reboque2` | `int` | YES | `` | `` | `` | `` |
| 11 | `semi_reboque3` | `int` | YES | `` | `` | `` | `` |
| 12 | `semi_reboque4` | `int` | YES | `` | `` | `` | `` |
| 13 | `volumes` | `int` | YES | `` | `` | `` | `` |
| 14 | `peso_real` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 15 | `peso_cubado` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 16 | `valor_transportado` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 17 | `valor_nf` | `decimal(15,2)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_coleta`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `destinos`, `coleta`
