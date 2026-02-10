# Tabela `azportoex.notamovimento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `notamovimento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:14`
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
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nota` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `tipo` | `int unsigned` | NO | `1` | `` | `` | `` |
| 4 | `quantidade` | `int unsigned` | NO | `0` | `` | `` | `` |
| 5 | `uCom` | `int unsigned` | NO | `0` | `` | `` | `` |
| 6 | `vProd` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 7 | `CFOP` | `varchar(4)` | YES | `` | `` | `` | `` |
| 8 | `vOutro` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 9 | `vDesc` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 10 | `vFrete` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 11 | `vSeg` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 12 | `uTrib` | `int unsigned` | YES | `` | `` | `` | `` |
| 13 | `produto` | `int` | NO | `0` | `` | `` | `` |

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
- `fiscal_documentos`, `notamovimento`
