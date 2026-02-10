# Tabela `azportoex.frete_composicao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `frete_composicao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `100626`
- **Create time**: `2025-12-10T12:37:54`
- **Update time**: `2025-12-17T16:50:01`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

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
- `idx_documento_frete_composicao` type=`BTREE` non_unique=`True` cols=[`documento`, `tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | YES | `` | `` | `` | `` |
| 3 | `base_calculo_imposto` | `decimal(10,2)` | NO | `0.00` | `` | `` | `Base de calculo de imposto` |
| 4 | `valor_prestacao_frete` | `decimal(10,2)` | NO | `0.00` | `` | `` | `Valor da prestação (valor calculado para o transporte)` |
| 5 | `valor_receber_frete` | `decimal(10,2)` | NO | `0.00` | `` | `` | `Valor a receber (valor que realmente o transportador vai receber)` |
| 6 | `documento` | `int` | NO | `` | `` | `MUL` | `` |
| 7 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 8 | `valor_ibs` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `valor_cbs` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `valor_bc` | `decimal(10,2)` | NO | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_minuta`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:50:01`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `frete`, `composicao`
