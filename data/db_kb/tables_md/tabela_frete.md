# Tabela `azportoex.tabela_frete`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_frete`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `469`
- **Create time**: `2025-09-07T17:41:23`
- **Update time**: `2025-12-15T19:23:07`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_tabela`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `tabela_formulas.id_tabela` → `tabela_frete.id_tabela` (constraint=`tabela_formulas_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_tabela`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_tabela` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(40)` | NO | `` | `` | `` | `` |
| 3 | `referencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 4 | `imposto` | `tinyint` | YES | `0` | `` | `` | `` |
| 5 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 6 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 7 | `hora` | `varchar(8)` | NO | `` | `` | `` | `` |
| 8 | `operador` | `smallint` | NO | `` | `` | `` | `` |
| 9 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 10 | `negocia` | `tinyint` | YES | `1` | `` | `` | `` |
| 11 | `tx_coleta` | `tinyint` | YES | `` | `` | `` | `` |
| 12 | `unidade` | `smallint` | YES | `5` | `` | `` | `` |
| 13 | `data_vigencia` | `date` | YES | `` | `` | `` | `` |
| 14 | `padrao` | `smallint` | YES | `0` | `` | `` | `` |
| 15 | `id_grupo` | `int` | YES | `` | `` | `` | `` |
| 16 | `desconto_imposto` | `tinyint` | YES | `0` | `` | `` | `` |
| 17 | `decimais` | `tinyint` | YES | `2` | `` | `` | `` |
| 18 | `origem` | `varchar(13)` | YES | `` | `` | `` | `` |
| 19 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 20 | `anexo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 21 | `horario_corte` | `time` | YES | `` | `` | `` | `` |
| 22 | `permite_desconto` | `tinyint` | YES | `1` | `` | `` | `` |
| 23 | `permite_acrescimo` | `tinyint` | YES | `1` | `` | `` | `` |
| 24 | `servicos` | `json` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_tabela`, `id_grupo`
- **Datas/tempos prováveis**: `data_incluido`, `hora`, `data_vigencia`, `horario_corte`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-15T19:23:07`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `tabela`, `frete`
