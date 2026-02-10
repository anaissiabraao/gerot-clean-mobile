# Tabela `azportoex.fatura_cambio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fatura_cambio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:53`
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
- `id_fatura_cambio`

## Chaves estrangeiras (evidência estrutural)
- `fatura_id` → `fatura.id_fatura` (constraint=`fatura_cambio_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `moeda_id` → `moedas.id_moeda` (constraint=`fatura_cambio_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_fatura_cambio`]
- `fatura_id` type=`BTREE` non_unique=`True` cols=[`fatura_id`]
- `moeda_id` type=`BTREE` non_unique=`True` cols=[`moeda_id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_fatura_cambio` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `fatura_id` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `minuta_id` | `int` | YES | `` | `` | `` | `` |
| 4 | `moeda_id` | `int` | YES | `` | `` | `MUL` | `` |
| 5 | `tipo_cambio` | `int` | YES | `` | `` | `` | `` |
| 6 | `pagador_fatura` | `int` | YES | `` | `` | `` | `` |
| 7 | `data` | `date` | YES | `` | `` | `` | `` |
| 8 | `taxa` | `decimal(10,4)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_fatura_cambio`, `fatura_id`, `minuta_id`, `moeda_id`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `fatura`, `cambio`
