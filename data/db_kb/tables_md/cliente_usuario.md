# Tabela `azportoex.cliente_usuario`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cliente_usuario`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `712`
- **Create time**: `2025-09-07T17:37:10`
- **Update time**: `2025-12-12T18:39:19`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `seguranca_autenticacao`
- **Evidência**: `inferido_por_nome:/(user|usuario|usuarios|perfil|role|permiss|auth|login|token|sess)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_usuario`

## Chaves estrangeiras (evidência estrutural)
- `id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_usuario_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `alteracoes_cliente_usuario.usuario_cliente` → `cliente_usuario.id_usuario` (constraint=`alteracoes_cliente_usuario_usuario_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_usuario`]
- `fk_cliente_usuario_fornecedor` type=`BTREE` non_unique=`True` cols=[`id_cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_usuario` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `logim` | `varchar(55)` | NO | `` | `` | `` | `` |
| 4 | `senha` | `varchar(25)` | NO | `123456` | `` | `` | `` |
| 5 | `nome_completo` | `varchar(120)` | NO | `` | `` | `` | `` |
| 6 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 7 | `data` | `date` | NO | `` | `` | `` | `` |
| 8 | `status` | `int` | NO | `1` | `` | `` | `` |
| 9 | `relatorio` | `int unsigned` | NO | `1` | `` | `` | `` |
| 10 | `remetente` | `smallint` | NO | `0` | `` | `` | `` |
| 11 | `destinatario` | `smallint` | NO | `0` | `` | `` | `` |
| 12 | `tomador` | `smallint` | NO | `0` | `` | `` | `` |
| 13 | `controlador` | `smallint` | YES | `0` | `` | `` | `` |
| 14 | `login` | `varchar(20)` | YES | `` | `` | `` | `` |
| 15 | `admin` | `tinyint unsigned` | NO | `1` | `` | `` | `` |
| 16 | `ver_cotacao` | `int unsigned` | NO | `` | `` | `` | `` |
| 17 | `emitir_cotacao` | `int` | YES | `` | `` | `` | `` |
| 18 | `obs_minuta` | `int unsigned` | NO | `` | `` | `` | `` |
| 19 | `performance` | `int unsigned` | NO | `` | `` | `` | `` |
| 20 | `expedidor` | `smallint` | YES | `0` | `` | `` | `` |
| 21 | `recebedor` | `smallint` | YES | `0` | `` | `` | `` |
| 22 | `emitir_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 23 | `ver_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 24 | `ver_fatura` | `tinyint` | YES | `1` | `` | `` | `` |
| 25 | `grafico` | `tinyint` | YES | `1` | `` | `` | `` |
| 26 | `estoque` | `int` | YES | `0` | `` | `` | `` |
| 27 | `ver_anexos` | `tinyint` | YES | `0` | `` | `` | `` |
| 28 | `ver_tabela` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 29 | `xml_cte` | `tinyint` | YES | `0` | `` | `` | `` |
| 30 | `ver_dacte` | `tinyint(1)` | NO | `1` | `` | `` | `` |
| 31 | `ver_minuta` | `tinyint(1)` | NO | `1` | `` | `` | `` |
| 32 | `ver_frete` | `tinyint(1)` | NO | `1` | `` | `` | `` |
| 33 | `ver_awb` | `tinyint(1)` | NO | `1` | `` | `` | `` |
| 34 | `ver_transp` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 35 | `cancela_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 36 | `resp_coleta` | `tinyint` | NO | `0` | `` | `` | `` |
| 37 | `busca_site` | `tinyint` | YES | `0` | `` | `` | `` |
| 38 | `operador` | `int` | YES | `` | `` | `` | `` |
| 39 | `ver_conemb` | `tinyint` | YES | `0` | `` | `` | `` |
| 40 | `ver_ocorren` | `tinyint` | YES | `0` | `` | `` | `` |
| 41 | `entrega_status` | `tinyint` | YES | `0` | `` | `` | `` |
| 42 | `ver_rastreamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 43 | `ver_notas` | `tinyint` | YES | `1` | `` | `` | `` |
| 44 | `autorizacao_frete` | `tinyint` | YES | `0` | `` | `` | `` |
| 45 | `obr_autorizacao_frete_coleta` | `int` | YES | `0` | `` | `` | `` |
| 46 | `ver_rastreamento_notas` | `tinyint` | YES | `0` | `` | `` | `` |
| 47 | `recuperacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 48 | `validade` | `date` | YES | `` | `` | `` | `` |
| 49 | `imprime_etiqueta` | `tinyint` | YES | `0` | `` | `` | `` |
| 50 | `obri_contatos` | `tinyint` | YES | `0` | `` | `` | `` |
| 51 | `ver_multimodal` | `tinyint` | YES | `1` | `` | `` | `` |
| 52 | `ver_comp_entrega` | `tinyint` | YES | `1` | `` | `` | `` |
| 53 | `filtro_unidade` | `tinyint` | YES | `0` | `` | `` | `` |
| 54 | `ver_anexo_fatura` | `tinyint` | YES | `0` | `` | `` | `` |
| 55 | `monitoramento_rotas` | `tinyint` | YES | `0` | `` | `` | `` |
| 56 | `ver_info_pereciveis` | `tinyint` | YES | `0` | `` | `` | `` |
| 57 | `relatorio_notas` | `tinyint` | YES | `0` | `` | `` | `` |
| 58 | `ver_serv_vinculados` | `tinyint` | YES | `0` | `` | `` | `` |
| 59 | `perm_gest_pre_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 60 | `aprova_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 61 | `usuario_sistema` | `int` | NO | `` | `` | `` | `` |
| 62 | `apresenta_lote` | `tinyint` | YES | `0` | `` | `` | `` |
| 63 | `emite_minuta_xml` | `tinyint` | YES | `0` | `` | `` | `` |
| 64 | `cadastra_nova_empresa` | `tinyint` | YES | `0` | `` | `` | `` |
| 65 | `visualiza_pre_emissao` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_usuario`, `id_cliente`
- **Datas/tempos prováveis**: `data`, `validade`, `visualiza_pre_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-12T18:39:19`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `cliente`, `usuario`
