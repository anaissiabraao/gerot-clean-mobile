# Tabela `azportoex.nfe_series`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `nfe_series`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:40:13`
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
- `id_series`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_series`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_series` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 3 | `serie` | `int` | NO | `` | `` | `` | `` |
| 4 | `data` | `date` | NO | `` | `` | `` | `` |
| 5 | `operador` | `int` | NO | `` | `` | `` | `` |
| 6 | `status` | `int` | NO | `1` | `` | `` | `` |
| 7 | `numero` | `int` | NO | `` | `` | `` | `` |
| 8 | `ambiente` | `tinyint` | YES | `2` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_series`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `nfe`, `series`
