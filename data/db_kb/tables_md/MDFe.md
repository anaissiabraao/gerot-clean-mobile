# Tabela `azportoex.MDFe`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `MDFe`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `26017`
- **Create time**: `2025-09-07T17:35:59`
- **Update time**: `2025-12-17T15:44:04`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_mdfe`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `averbacao_protocolos.manifesto` → `MDFe.id_mdfe` (constraint=`fk_averbacao_protocolos_manifesto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_mdfe`]
- `id_manifesto` type=`BTREE` non_unique=`False` cols=[`id_manifesto`, `destino`]
- `idx_manifesto` type=`BTREE` non_unique=`True` cols=[`id_manifesto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_mdfe` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_manifesto` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `numero` | `int` | NO | `0` | `` | `` | `` |
| 4 | `chave` | `varchar(44)` | NO | `` | `` | `` | `` |
| 5 | `recibo` | `varchar(16)` | YES | `` | `` | `` | `` |
| 6 | `protocolo` | `varchar(16)` | YES | `` | `` | `` | `` |
| 7 | `prot_cancelamento` | `varchar(16)` | YES | `` | `` | `` | `` |
| 8 | `prot_encerramento` | `varchar(16)` | YES | `` | `` | `` | `` |
| 9 | `status` | `int` | NO | `1` | `` | `` | `` |
| 10 | `data_emissao` | `date` | YES | `` | `` | `` | `` |
| 11 | `hora_emissao` | `varchar(8)` | YES | `` | `` | `` | `` |
| 12 | `data_cancelamento` | `date` | YES | `` | `` | `` | `` |
| 13 | `hora_cancelamento` | `varchar(8)` | YES | `` | `` | `` | `` |
| 14 | `data_encerramento` | `date` | YES | `` | `` | `` | `` |
| 15 | `hora_encerramento` | `varchar(8)` | YES | `` | `` | `` | `` |
| 16 | `operador_emissao` | `int` | NO | `` | `` | `` | `` |
| 17 | `operador_encerramento` | `int` | YES | `` | `` | `` | `` |
| 18 | `operador_cancelamento` | `int` | YES | `` | `` | `` | `` |
| 19 | `ambiente` | `tinyint` | NO | `0` | `` | `` | `` |
| 20 | `tpemis` | `tinyint` | YES | `1` | `` | `` | `` |
| 21 | `serie` | `smallint` | YES | `0` | `` | `` | `` |
| 22 | `mdfe_arquivo_aut` | `varchar(255)` | YES | `` | `` | `` | `` |
| 23 | `mdfe_arquivo_canc` | `varchar(255)` | YES | `` | `` | `` | `` |
| 24 | `mdfe_arquivo_enc` | `varchar(255)` | YES | `` | `` | `` | `` |
| 25 | `destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 26 | `origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 27 | `base` | `tinyint` | YES | `` | `` | `` | `` |
| 28 | `averbacao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 29 | `trecho` | `varchar(250)` | YES | `` | `` | `` | `` |
| 30 | `nSeqEvento` | `tinyint` | YES | `0` | `` | `` | `campo usado como sequencial para cada vez que um condutor foi incluido no manifesto` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_mdfe`, `id_manifesto`
- **Datas/tempos prováveis**: `data_emissao`, `hora_emissao`, `data_cancelamento`, `hora_cancelamento`, `data_encerramento`, `hora_encerramento`, `operador_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T15:44:04`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `mdfe`
