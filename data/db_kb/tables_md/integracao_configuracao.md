# Tabela `azportoex.integracao_configuracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `integracao_configuracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `9`
- **Create time**: `2025-09-07T17:39:19`
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
- `id_tipo` → `integracao_tipo.id` (constraint=`id_tipo_integracao_configuracao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `integracao_codigo.id_configuracao` → `integracao_configuracao.id` (constraint=`id_configuracao_integracao_configuracao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `integracao_rota.id_configuracao` → `integracao_configuracao.id` (constraint=`integracao_rota_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `id_tipo_integracao_configuracao` type=`BTREE` non_unique=`True` cols=[`id_tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario` | `varchar(255)` | NO | `` | `` | `` | `` |
| 3 | `senha` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `chave` | `varchar(3000)` | YES | `` | `` | `` | `` |
| 5 | `contrato` | `varchar(255)` | YES | `` | `` | `` | `` |
| 6 | `id_tipo` | `int` | NO | `` | `` | `MUL` | `TIpo de integraçao (GR, greemile)` |
| 7 | `gerenciadora` | `int` | YES | `` | `` | `` | `` |
| 8 | `ambiente` | `tinyint` | YES | `2` | `` | `` | `1 - Producao, 2 - Homologação` |
| 9 | `unidade` | `int` | YES | `0` | `` | `` | `` |
| 10 | `fornecedor` | `int` | YES | `` | `` | `` | `` |
| 11 | `informa_valor` | `tinyint` | YES | `1` | `` | `` | `` |
| 12 | `informa_notas` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `customerid` | `varchar(255)` | YES | `` | `` | `` | `` |
| 15 | `servico` | `varchar(20)` | YES | `` | `` | `` | `` |
| 16 | `tipo_remessa` | `tinyint` | YES | `` | `` | `` | `` |
| 17 | `prazo_pesquisa` | `tinyint` | YES | `` | `` | `` | `` |
| 18 | `envio_comprovei` | `tinyint` | YES | `1` | `` | `` | `` |
| 19 | `bloqueio_despacho` | `tinyint` | YES | `` | `` | `` | `` |
| 20 | `minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 21 | `coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 22 | `awb` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `texto_generico` | `mediumtext` | YES | `` | `` | `` | `` |
| 24 | `tipo_data_ocorren` | `int` | YES | `0` | `` | `` | `` |
| 25 | `pasta` | `varchar(100)` | YES | `` | `` | `` | `` |
| 26 | `dados_padrao` | `varchar(500)` | YES | `` | `` | `` | `` |
| 27 | `host` | `varchar(45)` | YES | `` | `` | `` | `` |
| 28 | `conexao` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tipo`
- **Datas/tempos prováveis**: `tipo_data_ocorren`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `integracao`, `configuracao`
