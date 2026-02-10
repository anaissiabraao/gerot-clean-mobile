# Tabela `azportoex.ciot`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:37:07`
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
- `ciot_manifesto.id_ciot` → `ciot.id` (constraint=`fk_ciot_id_ciot`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `ciot_parcelas.id_ciot` → `ciot.id` (constraint=`fk_ciot_parcelas_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `ciot_vale_pedagio.id_ciot` → `ciot.id` (constraint=`fk_ciot_vale_pedagio_ciot`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_contrato` | `int` | YES | `0` | `` | `` | `` |
| 4 | `id_protocolo` | `int` | YES | `0` | `` | `` | `` |
| 5 | `id_manifesto` | `int` | YES | `` | `` | `` | `` |
| 6 | `id_unidade` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 8 | `id_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 9 | `id_natureza` | `varchar(4)` | YES | `0001` | `` | `` | `` |
| 10 | `id_veiculo_categoria` | `int` | YES | `` | `` | `` | `` |
| 11 | `id_carga_perfil` | `int` | YES | `1` | `` | `` | `` |
| 12 | `vale_pedagio_id` | `int` | YES | `` | `` | `` | `` |
| 13 | `vale_pedagio_cartao` | `varchar(255)` | YES | `0` | `` | `` | `` |
| 14 | `vale_pedagio_valor` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `vale_pedagio_status` | `int` | YES | `` | `` | `` | `` |
| 16 | `vale_pedagio_lancamento` | `varchar(255)` | YES | `0` | `` | `` | `` |
| 17 | `contratado_id` | `int` | YES | `` | `` | `` | `` |
| 18 | `contratado_tipo_pagamento` | `int` | YES | `` | `` | `` | `` |
| 19 | `contratado_documento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 20 | `contratado_rntrc` | `varchar(15)` | YES | `` | `` | `` | `` |
| 21 | `contratado_ie` | `varchar(15)` | YES | `` | `` | `` | `` |
| 22 | `contratado_cartao` | `varchar(255)` | YES | `0` | `` | `` | `` |
| 23 | `contratado_motorista` | `int` | YES | `` | `` | `` | `` |
| 24 | `motorista_id` | `int` | YES | `` | `` | `` | `` |
| 25 | `motorista_tipo_pagamento` | `int` | YES | `` | `` | `` | `` |
| 26 | `motorista_documento` | `varchar(15)` | YES | `` | `` | `` | `` |
| 27 | `motorista_rg` | `varchar(15)` | YES | `` | `` | `` | `` |
| 28 | `motorista_rg_uf` | `varchar(2)` | YES | `` | `` | `` | `` |
| 29 | `motorista_rntrc` | `varchar(15)` | YES | `` | `` | `` | `` |
| 30 | `motorista_cartao` | `varchar(255)` | YES | `0` | `` | `` | `` |
| 31 | `valor_total_frete` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 32 | `valor_total_pedagio` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 33 | `valor_total_abastecimento` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 34 | `valor_total_adiantamento` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 35 | `frete_bruto` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 36 | `frete_irrf` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 37 | `frete_inss` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 38 | `frete_sest` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 39 | `frete_liquido` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 40 | `frete_peso` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 41 | `antt_ciot_numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 42 | `antt_ciot_protocolo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 43 | `antt_digito` | `int` | YES | `` | `` | `` | `` |
| 44 | `antt_id` | `varchar(45)` | YES | `` | `` | `` | `` |
| 45 | `data_declaracao` | `date` | NO | `` | `` | `` | `` |
| 46 | `data_inicio` | `datetime` | NO | `` | `` | `` | `` |
| 47 | `data_final` | `datetime` | NO | `` | `` | `` | `` |
| 48 | `status` | `int` | YES | `` | `` | `` | `` |
| 49 | `motivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 50 | `id_metodo` | `int` | YES | `0` | `` | `` | `` |
| 51 | `roteirizar` | `int` | YES | `0` | `` | `` | `` |
| 52 | `id_pagamento` | `int` | YES | `0` | `` | `` | `` |
| 53 | `observacao` | `text` | YES | `` | `` | `` | `` |
| 54 | `identificador_pedagio` | `varchar(255)` | YES | `` | `` | `` | `` |
| 55 | `id_equiparado` | `int` | YES | `0` | `` | `` | `` |
| 56 | `data_finalizado_ciot` | `date` | YES | `` | `` | `` | `` |
| 57 | `tipo_carga` | `int` | YES | `0` | `` | `` | `` |
| 58 | `metodo_pagamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 59 | `alteraImposto` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_administradora`, `id_contrato`, `id_protocolo`, `id_manifesto`, `id_unidade`, `id_origem`, `id_destino`, `id_natureza`, `id_veiculo_categoria`, `id_carga_perfil`, `vale_pedagio_id`, `contratado_id`, `motorista_id`, `antt_id`, `id_metodo`, `id_pagamento`, `id_equiparado`
- **Datas/tempos prováveis**: `data_declaracao`, `data_inicio`, `data_final`, `data_finalizado_ciot`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`
