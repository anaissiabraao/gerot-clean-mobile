# Tabela `azportoex.ciot_vale_pedagio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_vale_pedagio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:09`
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
- `id_ciot` → `ciot.id` (constraint=`fk_ciot_vale_pedagio_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_ciot_vale_pedagio_ciot` type=`BTREE` non_unique=`True` cols=[`id_ciot`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_ciot` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `id_administradora` | `int` | NO | `` | `` | `` | `` |
| 4 | `id_manifesto` | `int` | NO | `` | `` | `` | `` |
| 5 | `id_lancamento` | `varchar(255)` | YES | `` | `` | `` | `` |
| 6 | `vale_pedagio_id` | `int` | NO | `` | `` | `` | `` |
| 7 | `vale_pedagio_cartao` | `varchar(255)` | NO | `` | `` | `` | `` |
| 8 | `vale_pedagio_valor` | `decimal(16,2)` | NO | `` | `` | `` | `` |
| 9 | `vale_pedagio_status` | `int` | NO | `0` | `` | `` | `` |
| 10 | `antt_ciot_numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `antt_ciot_protocolo` | `int` | YES | `` | `` | `` | `` |
| 12 | `antt_digito` | `int` | YES | `` | `` | `` | `` |
| 13 | `antt_id` | `varchar(45)` | YES | `` | `` | `` | `` |
| 14 | `data_declaracao` | `date` | YES | `` | `` | `` | `` |
| 15 | `vale_pedagio_status_descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 16 | `vale_pedagio_favorecido_tipo` | `int` | YES | `` | `` | `` | `` |
| 17 | `identificador` | `varchar(45)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ciot`, `id_administradora`, `id_manifesto`, `id_lancamento`, `vale_pedagio_id`, `antt_id`
- **Datas/tempos prováveis**: `data_declaracao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `vale`, `pedagio`
