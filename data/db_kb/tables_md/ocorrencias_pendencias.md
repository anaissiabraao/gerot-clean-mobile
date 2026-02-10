# Tabela `azportoex.ocorrencias_pendencias`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ocorrencias_pendencias`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:27`
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
- `id_oco_pendencias`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_oco_pendencias`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_oco_pendencias` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `manifesto` | `int` | YES | `` | `` | `` | `` |
| 3 | `observacao` | `mediumtext` | YES | `` | `` | `` | `` |
| 4 | `operador` | `int` | YES | `` | `` | `` | `` |
| 5 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 6 | `data` | `date` | YES | `` | `` | `` | `` |
| 7 | `hora` | `time` | YES | `` | `` | `` | `` |
| 8 | `tipo` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 9 | `hora_conferencia` | `time` | YES | `` | `` | `` | `` |
| 10 | `data_conferencia` | `date` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_oco_pendencias`
- **Datas/tempos prováveis**: `data`, `hora`, `hora_conferencia`, `data_conferencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ocorrencias`, `pendencias`
