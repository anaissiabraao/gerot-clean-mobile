# Tabela `azportoex.entrada`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `entrada`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:49`
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
| 2 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 3 | `tipo_registro` | `int` | YES | `1` | `` | `` | `` |
| 4 | `motivo` | `tinyint` | YES | `1` | `` | `` | `` |
| 5 | `controle` | `int` | YES | `` | `` | `` | `` |
| 6 | `autorizacao` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_empresa` | `varchar(100)` | YES | `` | `` | `` | `` |
| 8 | `id_pessoa` | `int` | YES | `` | `` | `` | `` |
| 9 | `id_unidade` | `smallint` | NO | `` | `` | `` | `` |
| 10 | `id_veiculo` | `int` | YES | `` | `` | `` | `` |
| 11 | `obs` | `varchar(150)` | YES | `` | `` | `` | `` |
| 12 | `data` | `datetime` | NO | `` | `` | `` | `` |
| 13 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `saida` | `datetime` | YES | `` | `` | `` | `` |
| 15 | `obs_saida` | `varchar(150)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_empresa`, `id_pessoa`, `id_unidade`, `id_veiculo`
- **Datas/tempos prováveis**: `data`, `saida`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `entrada`
