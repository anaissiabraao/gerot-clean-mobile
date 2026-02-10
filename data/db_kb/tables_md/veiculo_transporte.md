# Tabela `azportoex.veiculo_transporte`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `veiculo_transporte`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `109173`
- **Create time**: `2025-09-07T17:41:35`
- **Update time**: `2025-12-17T16:42:45`
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
- `idx_veiculo_transporte_documento` type=`BTREE` non_unique=`True` cols=[`codigo`]
- `idx_veiculo_transporte_veiculo` type=`BTREE` non_unique=`True` cols=[`veiculo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `codigo` | `int` | NO | `` | `` | `MUL` | `ID do documento relacionado (coleta, minuta, manifesto, etc` |
| 3 | `tipo` | `tinyint` | NO | `` | `` | `` | `Tipo de documento relacionado: 1 - Coleta, 2 - Minuta, 3 - Manifesto` |
| 4 | `veiculo` | `int` | NO | `` | `` | `MUL` | `ID do veiculo selecionado` |
| 5 | `tipo_transporte` | `tinyint` | NO | `` | `` | `` | `Tipo de serviço prestado: 1 - Coleta, 2 - Entrega, 3 - Embarque (AWB), 4 - Retira (AWB), 5 - Tranferencia` |
| 6 | `custo` | `decimal(10,2)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:42:45`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `veiculo`, `transporte`
