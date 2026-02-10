# Tabela `azportoex.rastreadores_sascar_manifestos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rastreadores_sascar_manifestos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:59`
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
- `id_manifesto`, `id_veiculo`, `rastreador`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_manifesto`, `id_veiculo`, `rastreador`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_manifesto` | `int unsigned` | NO | `` | `` | `PRI` | `` |
| 2 | `id_veiculo` | `int unsigned` | NO | `` | `` | `PRI` | `` |
| 3 | `rastreador` | `int unsigned` | NO | `` | `` | `PRI` | `` |
| 4 | `placa` | `varchar(8)` | YES | `` | `` | `` | `` |
| 5 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 6 | `origem` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `destino` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `enderecoorigem` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `enderecodestino` | `varchar(255)` | YES | `` | `` | `` | `` |
| 10 | `localizacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 11 | `saida_efetiva_data` | `varchar(10)` | YES | `` | `` | `` | `` |
| 12 | `saida_efetiva_hora` | `varchar(5)` | YES | `` | `` | `` | `` |
| 13 | `prev_chegada_data` | `varchar(10)` | YES | `` | `` | `` | `` |
| 14 | `prev_chegada_hora` | `varchar(5)` | YES | `` | `` | `` | `` |
| 15 | `inicioviagem_data` | `varchar(10)` | YES | `` | `` | `` | `` |
| 16 | `inicioviagem_hora` | `varchar(5)` | YES | `` | `` | `` | `` |
| 17 | `inicioviagem_distancia` | `int` | YES | `0` | `` | `` | `` |
| 18 | `inicioviagem_tempo` | `int` | YES | `0` | `` | `` | `` |
| 19 | `previsao_data` | `varchar(10)` | YES | `` | `` | `` | `` |
| 20 | `previsao_hora` | `varchar(5)` | YES | `` | `` | `` | `` |
| 21 | `previsao_distancia` | `int` | YES | `0` | `` | `` | `` |
| 22 | `previsao_tempo` | `int` | YES | `0` | `` | `` | `` |
| 23 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 24 | `atraso` | `varchar(255)` | YES | `` | `` | `` | `` |
| 25 | `latitude` | `varchar(20)` | YES | `` | `` | `` | `` |
| 26 | `longitude` | `varchar(20)` | YES | `` | `` | `` | `` |
| 27 | `progresso_cor` | `varchar(10)` | YES | `green` | `` | `` | `` |
| 28 | `progresso_valor` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_manifesto`, `id_veiculo`
- **Datas/tempos prováveis**: `saida_efetiva_data`, `saida_efetiva_hora`, `prev_chegada_data`, `prev_chegada_hora`, `inicioviagem_data`, `inicioviagem_hora`, `previsao_data`, `previsao_hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `rastreadores`, `sascar`, `manifestos`
