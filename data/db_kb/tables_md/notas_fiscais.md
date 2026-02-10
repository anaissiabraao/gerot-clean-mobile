# Tabela `azportoex.notas_fiscais`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notas_fiscais`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `385440`
- **Create time**: `2025-10-11T06:50:34`
- **Update time**: `2025-12-17T16:50:02`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_nf`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `anexos.id_nota` → `notas_fiscais.id_nf` (constraint=`fk_anexos_id_nota`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `dce.id_nf` → `notas_fiscais.id_nf` (constraint=`fk_notas_fiscais`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `frete_hist.id_nf` → `notas_fiscais.id_nf` (constraint=`fk_frete_hist_nf`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_nf`]
- `idx_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]
- `idx_nf` type=`BTREE` non_unique=`True` cols=[`nf`]
- `idx_notas_fiscais` type=`BTREE` non_unique=`True` cols=[`chave_nfe`]
- `idx_notas_fiscais_pedido` type=`BTREE` non_unique=`True` cols=[`pedido`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_nf` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `empresa` | `int` | NO | `` | `` | `` | `` |
| 4 | `data` | `date` | NO | `` | `` | `` | `` |
| 5 | `cfop` | `smallint` | YES | `` | `` | `` | `` |
| 6 | `nf` | `varchar(20)` | YES | `` | `` | `MUL` | `` |
| 7 | `serie` | `varchar(3)` | YES | `` | `` | `` | `` |
| 8 | `natureza` | `int` | YES | `` | `` | `` | `` |
| 9 | `especie` | `int` | YES | `` | `` | `` | `` |
| 10 | `volumes` | `int` | YES | `1` | `` | `` | `` |
| 11 | `peso` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `nf_valor` | `decimal(22,2)` | YES | `` | `` | `` | `` |
| 13 | `nf_valor_prod` | `decimal(22,2)` | YES | `` | `` | `` | `` |
| 14 | `pedido` | `varchar(50)` | YES | `` | `` | `MUL` | `` |
| 15 | `pin_suframa` | `varchar(45)` | YES | `` | `` | `` | `` |
| 16 | `pedido_tipo` | `varchar(3)` | YES | `` | `` | `` | `` |
| 17 | `nf_tipo` | `varchar(40)` | NO | `` | `` | `` | `` |
| 18 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 19 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 20 | `volumes_unidade` | `int unsigned` | YES | `` | `` | `` | `` |
| 21 | `peso_unidade` | `int unsigned` | YES | `` | `` | `` | `` |
| 22 | `chave_nfe` | `varchar(45)` | YES | `` | `` | `MUL` | `` |
| 23 | `tipo` | `varchar(1)` | NO | `m` | `` | `` | `` |
| 24 | `entrega_nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 25 | `entrega_grau` | `varchar(45)` | YES | `` | `` | `` | `` |
| 26 | `entrega_rg` | `varchar(45)` | YES | `` | `` | `` | `` |
| 27 | `data_entrega` | `date` | YES | `` | `` | `` | `` |
| 28 | `hora_entrega` | `time` | YES | `` | `` | `` | `` |
| 29 | `cnpj_destinatario` | `varchar(15)` | YES | `` | `` | `` | `` |
| 30 | `id_ctrc` | `int` | YES | `` | `` | `` | `` |
| 31 | `nf_valor_ocul` | `decimal(22,2)` | YES | `` | `` | `` | `` |
| 32 | `vBC` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 33 | `vICMS` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 34 | `vBCST` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 35 | `vST` | `decimal(13,2)` | YES | `` | `` | `` | `` |
| 36 | `processo` | `varchar(40)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_nf`, `id_minuta`, `id_ctrc`
- **Datas/tempos prováveis**: `data`, `data_entrega`, `hora_entrega`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:02`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `notas`, `fiscais`
