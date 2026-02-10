# Tabela `azportoex.gnre_guias`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `gnre_guias`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:06`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_guia`

## Chaves estrangeiras (evidência estrutural)
- `id_minuta` → `minuta.id_minuta` (constraint=`id_fk_gnre_minuta`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_guia`]
- `id_fk_gnre_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_guia` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_minuta` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `id_lote` | `bigint` | NO | `` | `` | `` | `` |
| 4 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 5 | `uf` | `varchar(2)` | NO | `` | `` | `` | `` |
| 6 | `valor` | `float` | NO | `` | `` | `` | `` |
| 7 | `receita` | `varchar(45)` | NO | `` | `` | `` | `` |
| 8 | `detalhamento_receita` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `produto` | `varchar(70)` | YES | `` | `` | `` | `` |
| 10 | `vencimento` | `date` | YES | `` | `` | `` | `` |
| 11 | `pagamento` | `date` | YES | `` | `` | `` | `` |
| 12 | `periodo` | `int` | YES | `` | `` | `` | `` |
| 13 | `parcela` | `int` | YES | `` | `` | `` | `` |
| 14 | `mes` | `varchar(2)` | YES | `` | `` | `` | `` |
| 15 | `ano` | `varchar(4)` | YES | `` | `` | `` | `` |
| 16 | `convenio` | `varchar(45)` | YES | `` | `` | `` | `` |
| 17 | `tipo_documento_origem` | `varchar(4)` | YES | `` | `` | `` | `` |
| 18 | `arquivo` | `mediumtext` | YES | `` | `` | `` | `` |
| 19 | `geracao` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 20 | `desconto` | `decimal(6,2)` | YES | `0.00` | `` | `` | `` |
| 21 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 22 | `codigo_barras` | `varchar(55)` | YES | `` | `` | `` | `` |
| 23 | `linha_digitavel` | `varchar(55)` | YES | `` | `` | `` | `` |
| 24 | `id_lancamento` | `int` | YES | `` | `` | `` | `` |
| 25 | `inclui_frase_convenio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 26 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 27 | `guia` | `varchar(5000)` | YES | `` | `` | `` | `` |
| 28 | `xml` | `varchar(5000)` | YES | `` | `` | `` | `` |
| 29 | `total` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 30 | `multa` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 31 | `juros` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_guia`, `id_minuta`, `id_lote`, `id_lancamento`
- **Datas/tempos prováveis**: `vencimento`, `pagamento`, `geracao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `gnre`, `guias`
