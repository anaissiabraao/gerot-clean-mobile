# Tabela `azportoex.roteiro_base`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `roteiro_base`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
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
| 2 | `roteiro` | `varchar(60)` | NO | `ORIGEM X DESTINO` | `` | `` | `` |
| 3 | `prefixo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 4 | `id_origem` | `int` | NO | `` | `` | `` | `` |
| 5 | `id_destino` | `int` | NO | `` | `` | `` | `` |
| 6 | `status` | `int` | YES | `1` | `` | `` | `` |
| 7 | `operador` | `int` | YES | `0` | `` | `` | `` |
| 8 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 9 | `prazo_transferencia` | `tinyint` | YES | `` | `` | `` | `` |
| 10 | `tipo_resp` | `tinyint` | YES | `` | `` | `` | `` |
| 11 | `id_resp` | `int` | YES | `` | `` | `` | `` |
| 12 | `veiculo_resp` | `int` | YES | `` | `` | `` | `` |
| 13 | `regiao` | `int` | YES | `` | `` | `` | `` |
| 14 | `doca` | `int` | YES | `` | `` | `` | `` |
| 15 | `categoria` | `int` | YES | `` | `` | `` | `` |
| 16 | `servico` | `int` | YES | `` | `` | `` | `` |
| 17 | `tipo_operacao` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_origem`, `id_destino`, `id_resp`
- **Datas/tempos prováveis**: `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `roteiro`, `base`
