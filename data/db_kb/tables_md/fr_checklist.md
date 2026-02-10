# Tabela `azportoex.fr_checklist`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_checklist`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `8`
- **Create time**: `2025-09-07T17:38:03`
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
| 2 | `modelo_id` | `int` | NO | `` | `` | `` | `` |
| 3 | `unidade_id` | `int` | YES | `` | `` | `` | `` |
| 4 | `funcionario_id` | `int` | YES | `` | `` | `` | `` |
| 5 | `veiculo_id` | `int` | YES | `` | `` | `` | `` |
| 6 | `data` | `date` | YES | `` | `` | `` | `` |
| 7 | `hora` | `time` | YES | `` | `` | `` | `` |
| 8 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 9 | `status` | `int` | YES | `1` | `` | `` | `` |
| 10 | `tipo_checklist` | `tinyint` | NO | `1` | `` | `` | `1 = saida | 2 = encerramento` |
| 11 | `criado_em` | `datetime` | YES | `` | `` | `` | `` |
| 12 | `criado_por` | `int` | NO | `` | `` | `` | `` |
| 13 | `tipo_motorista` | `int` | NO | `0` | `` | `` | `` |
| 14 | `ultimo_km_veiculo` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `modelo_id`, `unidade_id`, `funcionario_id`, `veiculo_id`
- **Datas/tempos prováveis**: `data`, `hora`, `criado_em`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `checklist`
