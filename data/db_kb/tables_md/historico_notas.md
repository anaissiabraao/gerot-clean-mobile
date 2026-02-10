# Tabela `azportoex.historico_notas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `historico_notas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `186929`
- **Create time**: `2025-11-12T15:58:52`
- **Update time**: `2025-12-17T14:57:26`
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
- `fk_notas_id_nota` type=`BTREE` non_unique=`True` cols=[`id_nota`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `operador` | `int` | YES | `` | `` | `` | `` |
| 3 | `data` | `datetime` | YES | `` | `` | `` | `` |
| 4 | `campo` | `varchar(55)` | YES | `` | `` | `` | `` |
| 5 | `valor_antigo` | `varchar(400)` | YES | `` | `` | `` | `` |
| 6 | `valor_novo` | `varchar(400)` | YES | `` | `` | `` | `` |
| 7 | `id_nota` | `int` | NO | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_nota`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:57:26`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `historico`, `notas`
