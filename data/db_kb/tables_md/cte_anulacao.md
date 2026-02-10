# Tabela `azportoex.cte_anulacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cte_anulacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `124`
- **Create time**: `2025-09-07T17:37:31`
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
- `id_minuta` → `minuta.id_minuta` (constraint=`cte_anulacao_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `cte_anulacao_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `cte_chave` | `varchar(44)` | NO | `` | `` | `` | `` |
| 4 | `recibo` | `varchar(15)` | YES | `` | `` | `` | `` |
| 5 | `protocolo` | `varchar(15)` | YES | `` | `` | `` | `` |
| 6 | `data_emissao` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 7 | `data_autorizacao` | `datetime` | YES | `` | `` | `` | `` |
| 8 | `numero` | `int` | NO | `` | `` | `` | `` |
| 9 | `serie` | `int` | NO | `` | `` | `` | `` |
| 10 | `arquivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `status` | `tinyint` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_minuta`
- **Datas/tempos prováveis**: `data_emissao`, `data_autorizacao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `cte`, `anulacao`
