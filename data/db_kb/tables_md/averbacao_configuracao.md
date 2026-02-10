# Tabela `azportoex.averbacao_configuracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `averbacao_configuracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3`
- **Create time**: `2025-11-26T16:37:46`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `averbacao_config_modais.id_configuracao` → `averbacao_configuracao.id` (constraint=`averbacao_config_modais_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_seguradoras.id_configuracao` → `averbacao_configuracao.id` (constraint=`averbacao_config_seguradoras_fk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_tipo_documento.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_config_tipo_documento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_config_unidades.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_config_unidades`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_forma_pagamento.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_forma_pagamento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_modal_adicional.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_modal_adicional_configuracao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_protocolos.id_config` → `averbacao_configuracao.id` (constraint=`averbacao_protocolos_fk_averb_config`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_tipo_manifesto.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_tipo_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `averbacao_tipo_minuta.id_configuracao` → `averbacao_configuracao.id` (constraint=`fk_averbacao_tipo_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `integracao` | `smallint` | YES | `1` | `` | `` | `` |
| 3 | `usuario` | `varchar(100)` | YES | `` | `` | `` | `` |
| 4 | `senha` | `varchar(100)` | YES | `` | `` | `` | `` |
| 5 | `codigo` | `varchar(30)` | YES | `` | `` | `` | `` |
| 6 | `id_ftp` | `int` | YES | `` | `` | `` | `` |
| 7 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `proprio` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `cliente` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `automatico` | `tinyint` | YES | `1` | `` | `` | `` |
| 12 | `manual` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 14 | `operador` | `int` | YES | `` | `` | `` | `` |
| 15 | `remetente` | `tinyint` | YES | `1` | `` | `` | `` |
| 16 | `destinatario` | `tinyint` | YES | `1` | `` | `` | `` |
| 17 | `expedidor` | `tinyint` | YES | `1` | `` | `` | `` |
| 18 | `recebedor` | `tinyint` | YES | `1` | `` | `` | `` |
| 19 | `valor_minimo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 20 | `valor_maximo` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 21 | `coleta` | `tinyint` | NO | `0` | `` | `` | `` |
| 22 | `clientes` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_ftp`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `averbacao`, `configuracao`
