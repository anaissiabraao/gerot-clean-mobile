# Tabela `azportoex.notas_entrada`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notas_entrada`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:40:15`
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
- `id_nota`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_nota`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_nota` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `int unsigned` | NO | `` | `` | `` | `` |
| 3 | `operador` | `int` | NO | `` | `` | `` | `` |
| 4 | `remetente` | `int unsigned` | NO | `` | `` | `` | `` |
| 5 | `cliente` | `int unsigned` | NO | `` | `` | `` | `` |
| 6 | `destinatario` | `int unsigned` | NO | `` | `` | `` | `` |
| 7 | `nfe_chave` | `varchar(44)` | NO | `` | `` | `` | `` |
| 8 | `nf_numero` | `varchar(15)` | NO | `` | `` | `` | `` |
| 9 | `nf_serie` | `varchar(5)` | NO | `` | `` | `` | `` |
| 10 | `nf_data` | `date` | NO | `` | `` | `` | `` |
| 11 | `data_entrada` | `date` | NO | `` | `` | `` | `` |
| 12 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 13 | `hora_incluido` | `varchar(45)` | NO | `` | `` | `` | `` |
| 14 | `nf_operacao` | `int unsigned` | NO | `` | `` | `` | `` |
| 15 | `volumes` | `int unsigned` | YES | `` | `` | `` | `` |
| 16 | `peso_real` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 17 | `peso_cubado` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 18 | `nf_bc_icms` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 19 | `nf_icms` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 20 | `nf_bc_icms_st` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 21 | `nf_bc_icms_st_valor` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 22 | `nf_produtos` | `decimal(18,3)` | YES | `0.000` | `` | `` | `` |
| 23 | `nf_frete` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 24 | `nf_seguro` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 25 | `nf_ipi` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 26 | `nf_total` | `decimal(18,2)` | NO | `` | `` | `` | `` |
| 27 | `pis` | `float` | YES | `` | `` | `` | `` |
| 28 | `cofins` | `float` | YES | `` | `` | `` | `` |
| 29 | `id_coleta` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_nota`, `id_coleta`
- **Datas/tempos prováveis**: `nf_data`, `data_entrada`, `data_incluido`, `hora_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `notas`, `entrada`
