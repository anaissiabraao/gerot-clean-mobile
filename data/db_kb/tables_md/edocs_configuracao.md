# Tabela `azportoex.edocs_configuracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `edocs_configuracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3`
- **Create time**: `2025-10-07T15:35:43`
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
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 3 | `aplicativo` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `cte_ambiente` | `tinyint` | NO | `` | `` | `` | `` |
| 5 | `nfe_ambiente` | `tinyint` | NO | `` | `` | `` | `` |
| 6 | `mdfe_ambiente` | `tinyint` | NO | `` | `` | `` | `` |
| 7 | `cte_forma` | `tinyint` | NO | `` | `` | `` | `` |
| 8 | `nfe_forma` | `tinyint` | NO | `` | `` | `` | `` |
| 9 | `mdfe_forma` | `tinyint` | NO | `` | `` | `` | `` |
| 10 | `cte_versao` | `varchar(5)` | NO | `` | `` | `` | `` |
| 11 | `nfe_versao` | `varchar(5)` | NO | `` | `` | `` | `` |
| 12 | `mdfe_versao` | `varchar(5)` | NO | `` | `` | `` | `` |
| 13 | `cte_webservice` | `varchar(5)` | YES | `` | `` | `` | `` |
| 14 | `nfe_webservice` | `varchar(5)` | YES | `` | `` | `` | `` |
| 15 | `mdfe_webservice` | `varchar(5)` | YES | `` | `` | `` | `` |
| 16 | `cte_xuf` | `varchar(5)` | NO | `` | `` | `` | `` |
| 17 | `nfe_xuf` | `varchar(5)` | NO | `` | `` | `` | `` |
| 18 | `mdfe_xuf` | `varchar(5)` | NO | `` | `` | `` | `` |
| 19 | `cte_cuf` | `tinyint` | NO | `` | `` | `` | `` |
| 20 | `nfe_cuf` | `tinyint` | NO | `` | `` | `` | `` |
| 21 | `mdfe_cuf` | `tinyint` | NO | `` | `` | `` | `` |
| 22 | `senha` | `varchar(60)` | YES | `` | `` | `` | `` |
| 23 | `nfse_ambiente` | `tinyint` | YES | `2` | `` | `` | `` |
| 24 | `cst` | `varchar(20)` | YES | `` | `` | `` | `` |
| 25 | `itemServico` | `varchar(5)` | NO | `` | `` | `` | `` |
| 26 | `naturezaoperacao` | `tinyint` | YES | `1` | `` | `` | `` |
| 27 | `regimeespecialtributacao` | `varchar(1)` | YES | `` | `` | `` | `` |
| 28 | `nfse_versao` | `varchar(4)` | YES | `1.00` | `` | `` | `` |
| 29 | `xServico` | `varchar(255)` | YES | `` | `` | `` | `` |
| 30 | `cnae` | `varchar(20)` | YES | `` | `` | `` | `` |
| 31 | `iss_retido` | `tinyint` | YES | `2` | `` | `` | `` |
| 32 | `encerrar_mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 33 | `gnre_ambiente` | `tinyint` | NO | `1` | `` | `` | `` |
| 34 | `gnre_versao` | `varchar(5)` | NO | `2.00` | `` | `` | `` |
| 35 | `operador` | `int` | YES | `` | `` | `` | `` |
| 36 | `naturezaOperacaoFora` | `tinyint` | YES | `0` | `` | `` | `` |
| 37 | `provedor` | `int` | NO | `2` | `` | `` | `` |
| 38 | `impressao` | `int` | YES | `0` | `` | `` | `` |
| 39 | `limite_dia_cancelamento_cte` | `int` | YES | `` | `` | `` | `` |
| 40 | `dce_ambiente` | `tinyint` | NO | `2` | `` | `` | `` |
| 41 | `dce_versao` | `varchar(5)` | NO | `1.00` | `` | `` | `` |
| 42 | `cbs_ibs` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `edocs`, `configuracao`
