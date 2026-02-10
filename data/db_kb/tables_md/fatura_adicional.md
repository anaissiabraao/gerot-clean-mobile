# Tabela `azportoex.fatura_adicional`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fatura_adicional`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3336`
- **Create time**: `2025-09-07T17:37:52`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `financeiro`
- **Evidência**: `inferido_por_nome:/(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_adicional`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_adicional`]
- `idx_fatura_adicional` type=`BTREE` non_unique=`True` cols=[`id_fatura`, `tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_adicional` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(50)` | YES | `` | `` | `` | `` |
| 3 | `valor` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 4 | `tipo` | `tinyint` | YES | `` | `` | `` | `` |
| 5 | `id_fatura` | `int` | YES | `` | `` | `MUL` | `` |
| 6 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `centro_custo` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `data` | `date` | YES | `2019-01-01` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_adicional`, `id_fatura`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `fatura`, `adicional`
