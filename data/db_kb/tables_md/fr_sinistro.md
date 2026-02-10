# Tabela `azportoex.fr_sinistro`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_sinistro`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:06`
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
- `id_sinistro`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_sinistro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_sinistro` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario` | `int` | YES | `` | `` | `` | `` |
| 3 | `num_sinistro` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `num_manifesto` | `varchar(255)` | YES | `` | `` | `` | `` |
| 5 | `data_abertura` | `date` | YES | `` | `` | `` | `` |
| 6 | `data_sinistro` | `date` | YES | `` | `` | `` | `` |
| 7 | `hora_sinistro` | `time` | YES | `` | `` | `` | `` |
| 8 | `veiculo` | `int` | NO | `` | `` | `` | `` |
| 9 | `placa` | `char(8)` | NO | `` | `` | `` | `` |
| 10 | `motorista` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `cpf` | `char(14)` | YES | `` | `` | `` | `` |
| 12 | `num_boletim` | `varchar(100)` | YES | `` | `` | `` | `` |
| 13 | `data_boletim` | `date` | YES | `` | `` | `` | `` |
| 14 | `hora_boletim` | `time` | YES | `` | `` | `` | `` |
| 15 | `local_boletim` | `varchar(255)` | YES | `` | `` | `` | `` |
| 16 | `descricao_boletim` | `mediumtext` | YES | `` | `` | `` | `` |
| 17 | `status` | `int` | YES | `1` | `` | `` | `` |
| 18 | `tipo_sinistro` | `int` | NO | `` | `` | `` | `` |
| 19 | `uf` | `int` | YES | `` | `` | `` | `` |
| 20 | `cidade` | `int` | YES | `` | `` | `` | `` |
| 21 | `updated_by` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_sinistro`
- **Datas/tempos prováveis**: `data_abertura`, `data_sinistro`, `hora_sinistro`, `data_boletim`, `hora_boletim`, `updated_by`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `sinistro`
