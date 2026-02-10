# Tabela `azportoex.rateio_frete_alt`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rateio_frete_alt`
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
| 2 | `id_original` | `int` | NO | `` | `` | `` | `` |
| 3 | `empresa` | `int` | NO | `` | `` | `` | `` |
| 4 | `descricao` | `varchar(60)` | YES | `` | `` | `` | `` |
| 5 | `coleta` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `entrega` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `nf` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `peso` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `pedagio` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `tad` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 11 | `adv` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `outros` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `gris` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 14 | `peso_adicional` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `redespacho` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `despacho` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 17 | `tas` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 18 | `trt` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 19 | `tde` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 20 | `set_cat` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 21 | `tipo` | `tinyint` | YES | `1` | `` | `` | `1 - subtituir valor nas minutas, 2 - somar valor nas minutas` |
| 22 | `fator` | `tinyint` | YES | `1` | `` | `` | `1 - numero de minuta, 2 - volumes, 3 - peso, 4 - valor das NFS` |
| 23 | `destinatario` | `int` | YES | `` | `` | `` | `` |
| 24 | `frequencia` | `varchar(7)` | YES | `` | `` | `` | `` |
| 25 | `ciclo` | `tinyint` | YES | `` | `` | `` | `` |
| 26 | `id_contrato` | `int` | YES | `` | `` | `` | `` |
| 27 | `tomador` | `int` | YES | `` | `` | `` | `` |
| 28 | `data` | `date` | YES | `` | `` | `` | `` |
| 29 | `atendimentos` | `int` | YES | `` | `` | `` | `` |
| 30 | `atendimentos_total` | `int` | YES | `` | `` | `` | `` |
| 31 | `valor_novo` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 32 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 33 | `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 34 | `tarifa_minima` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 35 | `peso_franquia` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 36 | `peso_excedente` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 37 | `opcao_calculo` | `tinyint` | YES | `1` | `` | `` | `` |
| 38 | `percentual_frete` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_original`, `id_contrato`
- **Datas/tempos prováveis**: `data`, `updated_at`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `rateio`, `frete`, `alt`
