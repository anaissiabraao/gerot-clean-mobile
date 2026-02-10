# Tabela `azportoex.tabela_trecho`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tabela_trecho`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `45724`
- **Create time**: `2025-09-07T17:41:24`
- **Update time**: `2025-12-16T13:33:12`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_trecho`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `tabela_especifica.id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_tabela_especifica_id_trecho`, on_update=`NO ACTION`, on_delete=`NO ACTION`)
- `tabela_faixas_historico.id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_tabela_faixas_historico_trecho`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `trecho_cnpj.id_trecho` → `tabela_trecho.id_trecho` (constraint=`fk_trecho_cnpj_trecho`, on_update=`NO ACTION`, on_delete=`NO ACTION`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_trecho`]
- `idx_tabela_trecho_destino` type=`BTREE` non_unique=`True` cols=[`destino`]
- `idx_tabela_trecho_id_tabela` type=`BTREE` non_unique=`True` cols=[`id_tabela`]
- `idx_tabela_trecho_origem` type=`BTREE` non_unique=`True` cols=[`origem`]
- `idx_tabela_trecho_servico` type=`BTREE` non_unique=`True` cols=[`servico`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_trecho` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tabela` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `origem` | `varchar(11)` | YES | `` | `` | `MUL` | `` |
| 4 | `destino` | `varchar(11)` | YES | `` | `` | `MUL` | `` |
| 5 | `cep_inicial` | `varchar(8)` | YES | `` | `` | `` | `` |
| 6 | `cep_final` | `varchar(8)` | YES | `` | `` | `` | `` |
| 7 | `suframa` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 8 | `reentrega` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 9 | `reentrega_fixa` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 10 | `reentrega_minima` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 11 | `reentrega_icms` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `pedagio` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 13 | `pedagio_fator` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 14 | `aero_minimo` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 15 | `taxa_extra` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 16 | `tad` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 17 | `prazo_rodo` | `tinyint` | YES | `1` | `` | `` | `` |
| 18 | `prazo_aereo` | `tinyint` | YES | `1` | `` | `` | `` |
| 19 | `icms_frete` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 20 | `soma_icms_frete` | `tinyint` | YES | `0` | `` | `` | `` |
| 21 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 22 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 23 | `hora` | `varchar(8)` | YES | `` | `` | `` | `` |
| 24 | `operador` | `smallint` | NO | `` | `` | `` | `` |
| 25 | `servico` | `smallint` | NO | `0` | `` | `MUL` | `` |
| 26 | `tde` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 27 | `devolucao` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 28 | `devolucao_fixa` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 29 | `devolucao_minima` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 30 | `devolucao_icms` | `tinyint` | YES | `0` | `` | `` | `` |
| 31 | `imposto_rodo` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 32 | `imposto_aereo` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 33 | `percentual_frete` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 34 | `reverso` | `char(1)` | YES | `2` | `` | `` | `` |
| 35 | `desconto_limite` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 36 | `percentual_pedagio` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 37 | `taxa_emergencia` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 38 | `soma_minimo` | `tinyint` | YES | `1` | `` | `` | `` |
| 39 | `prazo_rodo_hora` | `smallint unsigned` | YES | `` | `` | `` | `` |
| 40 | `prazo_aereo_hora` | `smallint unsigned` | YES | `` | `` | `` | `` |
| 41 | `base_desconto` | `tinyint` | YES | `0` | `` | `` | `` |
| 42 | `soma_frete` | `tinyint` | YES | `1` | `` | `` | `` |
| 43 | `acrescimo_limite` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 44 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 45 | `minimo_trecho` | `decimal(15,5)` | YES | `0.00000` | `` | `` | `` |
| 46 | `tipo_minuta` | `smallint` | NO | `0` | `` | `` | `` |
| 47 | `base_percentual_cte` | `tinyint` | YES | `1` | `` | `` | `0 - Frete saldo, 1 - Frete total` |
| 48 | `horario_corte` | `time` | YES | `` | `` | `` | `` |
| 49 | `faixas_tde` | `varchar(250)` | YES | `` | `` | `` | `` |
| 50 | `soma_frete_tde` | `tinyint(1)` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_trecho`, `id_tabela`
- **Datas/tempos prováveis**: `data_incluido`, `hora`, `prazo_rodo_hora`, `prazo_aereo_hora`, `updated_at`, `horario_corte`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T13:33:12`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tabela`, `trecho`
