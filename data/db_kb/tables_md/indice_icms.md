# Tabela `azportoex.indice_icms`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `indice_icms`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `729`
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
- `id_icms`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_icms`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_icms` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cfop` | `varchar(5)` | NO | `6.352` | `` | `` | `` |
| 3 | `origem` | `varchar(2)` | NO | `` | `` | `` | `` |
| 4 | `destino` | `varchar(2)` | NO | `` | `` | `` | `` |
| 5 | `valor` | `decimal(6,2)` | NO | `` | `` | `` | `` |
| 6 | `valor_aereo` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 8 | `operador` | `int` | NO | `` | `` | `` | `` |
| 9 | `obs` | `varchar(150)` | YES | `` | `` | `` | `` |
| 10 | `obs_aereo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `modal` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `isento` | `tinyint` | YES | `0` | `` | `` | `` |
| 13 | `isencao_aereo` | `tinyint` | YES | `0` | `` | `` | `` |
| 14 | `valor_fcp` | `decimal(6,2)` | NO | `0.00` | `` | `` | `` |
| 15 | `pedagio` | `tinyint` | YES | `0` | `` | `` | `` |
| 16 | `calcula_fcp` | `tinyint` | YES | `1` | `` | `` | `` |
| 17 | `aereo_modal_cte` | `tinyint` | NO | `1` | `` | `` | `` |
| 18 | `multi_modal_cte` | `tinyint` | NO | `1` | `` | `` | `` |
| 19 | `rodo_modal_cte` | `tinyint` | NO | `1` | `` | `` | `` |
| 20 | `fato_gerador_icms` | `tinyint` | YES | `0` | `` | `` | `` |
| 21 | `ibs` | `decimal(6,2)` | YES | `0.10` | `` | `` | `` |
| 22 | `cbs` | `decimal(6,2)` | YES | `0.90` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_icms`
- **Datas/tempos prováveis**: `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `indice`, `icms`
