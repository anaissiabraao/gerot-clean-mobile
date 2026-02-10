# Tabela `azportoex.categoria_veiculos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `categoria_veiculos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:05`
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
- `id_categoria_veiculos`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_categoria_veiculos`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_categoria_veiculos` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `categoria` | `varchar(200)` | NO | `` | `` | `` | `` |
| 3 | `status_categoria` | `tinyint(1)` | NO | `` | `` | `` | `` |
| 4 | `peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 5 | `cubagem` | `decimal(10,3)` | YES | `` | `` | `` | `` |
| 6 | `km` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 7 | `tipo_veiculo` | `int` | YES | `` | `` | `` | `` |
| 8 | `eixo` | `int` | YES | `` | `` | `` | `` |
| 9 | `qtd_atendimentos` | `int` | YES | `` | `` | `` | `` |
| 10 | `pneus` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_categoria_veiculos`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `categoria`, `veiculos`
