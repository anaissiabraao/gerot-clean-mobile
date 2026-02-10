# Tabela `azportoex.veiculos_portaria`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `veiculos_portaria`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3`
- **Create time**: `2025-09-07T17:41:37`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_veiculo`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_veiculo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_veiculo` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `placa` | `varchar(9)` | NO | `` | `` | `` | `` |
| 3 | `renavam` | `varchar(20)` | NO | `` | `` | `` | `` |
| 4 | `marca` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `modelo` | `varchar(60)` | NO | `` | `` | `` | `` |
| 6 | `cor` | `varchar(60)` | NO | `Branco` | `` | `` | `` |
| 7 | `ano` | `int` | NO | `2011` | `` | `` | `` |
| 8 | `status` | `int` | NO | `1` | `` | `` | `` |
| 9 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 10 | `operador` | `int` | NO | `` | `` | `` | `` |
| 11 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 12 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_veiculo`
- **Datas/tempos prováveis**: `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `veiculos`, `portaria`
