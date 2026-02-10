# Tabela `azportoex.nf_contra`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `nf_contra`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
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
- `id_nf`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `nf_contra_lancamento.id_nf` → `nf_contra.id_nf` (constraint=`fk_nf_contra`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_nf`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_nf` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_api` | `int` | NO | `` | `` | `` | `` |
| 3 | `tipo` | `enum('nfe','nfse')` | NO | `` | `` | `` | `` |
| 4 | `chave` | `varchar(255)` | NO | `` | `` | `` | `` |
| 5 | `numero` | `int` | NO | `` | `` | `` | `` |
| 6 | `serie` | `int` | NO | `` | `` | `` | `` |
| 7 | `status` | `int` | YES | `` | `` | `` | `` |
| 8 | `dtEmi` | `date` | NO | `` | `` | `` | `` |
| 9 | `emit` | `json` | NO | `` | `` | `` | `` |
| 10 | `dest` | `json` | NO | `` | `` | `` | `` |
| 11 | `vNF` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 12 | `dup` | `json` | YES | `` | `` | `` | `` |
| 13 | `det` | `json` | YES | `` | `` | `` | `` |
| 14 | `total` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_nf`, `id_api`
- **Datas/tempos prováveis**: `dtEmi`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `contra`
