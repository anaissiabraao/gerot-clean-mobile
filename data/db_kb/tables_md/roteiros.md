# Tabela `azportoex.roteiros`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `roteiros`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-09-07T17:41:04`
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
- `id_roteiro`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_roteiro`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_roteiro` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `roteiro` | `varchar(120)` | YES | `` | `` | `` | `` |
| 3 | `redespacho` | `int` | NO | `0` | `` | `` | `` |
| 4 | `proprio` | `int` | NO | `0` | `` | `` | `` |
| 5 | `transferencia` | `int` | NO | `0` | `` | `` | `` |
| 6 | `status` | `int` | NO | `1` | `` | `` | `` |
| 7 | `operador` | `int` | NO | `` | `` | `` | `` |
| 8 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 9 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 10 | `chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 11 | `prefixo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 12 | `origem` | `varchar(45)` | YES | `` | `` | `` | `` |
| 13 | `destino` | `varchar(45)` | YES | `` | `` | `` | `` |
| 14 | `km` | `smallint` | YES | `` | `` | `` | `` |
| 15 | `tempo` | `time` | YES | `` | `` | `` | `` |
| 16 | `responsavel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 17 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 18 | `id_resp` | `int` | YES | `` | `` | `` | `` |
| 19 | `servico` | `int` | YES | `` | `` | `` | `` |
| 20 | `dias_roteiro` | `int` | YES | `` | `` | `` | `` |
| 21 | `tipo_operacao` | `tinyint` | YES | `0` | `` | `` | `` |
| 22 | `identifica_etq_minuta` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_roteiro`, `id_resp`
- **Datas/tempos prováveis**: `data_incluido`, `tempo`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `roteiros`
