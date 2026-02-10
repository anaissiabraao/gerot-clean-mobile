# Tabela `azportoex.cte_bloqueios`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cte_bloqueios`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
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
- `id_bloqueio`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_bloqueio`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_bloqueio` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 3 | `mensagem` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `bloqueia` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 5 | `valor_de` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 6 | `valor_ate` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 7 | `estado_origem` | `varchar(2)` | YES | `` | `` | `` | `` |
| 8 | `estado_destino` | `varchar(2)` | YES | `` | `` | `` | `` |
| 9 | `todos_estados` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 10 | `todos_clientes` | `tinyint(1)` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_bloqueio`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `cte`, `bloqueios`
