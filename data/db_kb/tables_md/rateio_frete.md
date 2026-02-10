# Tabela `azportoex.rateio_frete`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rateio_frete`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:59`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

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
| 2 | `empresa` | `int` | NO | `` | `` | `` | `` |
| 3 | `descricao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 4 | `coleta` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 5 | `entrega` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `nf` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `peso` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `pedagio` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `tad` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `adv` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 11 | `outros` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `gris` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `peso_adicional` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 14 | `redespacho` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `despacho` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `tas` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 17 | `trt` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 18 | `tde` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 19 | `set_cat` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 20 | `tipo` | `tinyint` | YES | `1` | `` | `` | `1 - subtituir valor nas minutas, 2 - somar valor nas minutas` |
| 21 | `fator` | `tinyint` | YES | `1` | `` | `` | `1 - numero de minuta, 2 - volumes, 3 - peso, 4 - valor das NFS` |
| 22 | `destinatario` | `int` | YES | `` | `` | `` | `` |
| 23 | `frequencia` | `varchar(7)` | YES | `` | `` | `` | `` |
| 24 | `ciclo` | `tinyint` | YES | `` | `` | `` | `` |
| 25 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 26 | `id_contrato` | `int` | YES | `` | `` | `` | `` |
| 27 | `tomador` | `int` | YES | `` | `` | `` | `` |
| 28 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 29 | `tarifa_minima` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 30 | `peso_franquia` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 31 | `peso_excedente` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 32 | `opcao_calculo` | `int` | YES | `0` | `` | `` | `` |
| 33 | `percentual_frete` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_contrato`
- **Datas/tempos prováveis**: `updated_at`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `rateio`, `frete`
