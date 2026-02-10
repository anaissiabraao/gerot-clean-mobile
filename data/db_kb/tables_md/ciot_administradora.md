# Tabela `azportoex.ciot_administradora`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_administradora`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `8`
- **Create time**: `2025-09-07T17:37:07`
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
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_unidade` | `int` | YES | `` | `` | `` | `` |
| 4 | `conta_bancaria` | `int` | YES | `0` | `` | `` | `` |
| 5 | `id_forma` | `int` | YES | `0` | `` | `` | `` |
| 6 | `tipo_cartao` | `int` | YES | `0` | `` | `` | `` |
| 7 | `vencimento` | `int` | YES | `0` | `` | `` | `` |
| 8 | `id_natureza_frete` | `int` | YES | `0` | `` | `` | `` |
| 9 | `id_natureza_pedagio` | `int` | YES | `1` | `` | `` | `` |
| 10 | `id_natureza_combustivel` | `int` | YES | `0` | `` | `` | `` |
| 11 | `id_natureza_despesas` | `int` | YES | `0` | `` | `` | `` |
| 12 | `taxa_saque` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `taxa_transferencia` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 14 | `taxa_saque_outro` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `taxa_transferencia_outro` | `decimal(16,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `taxa_saque_quantidade` | `int` | YES | `0` | `` | `` | `` |
| 17 | `taxa_transferencia_quantidade` | `int` | YES | `0` | `` | `` | `` |
| 18 | `taxa_saque_outro_quantidade` | `int` | YES | `0` | `` | `` | `` |
| 19 | `taxa_transferencia_outro_quantidade` | `int` | YES | `0` | `` | `` | `` |
| 20 | `ambiente` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 21 | `vale_pedagio_id` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 22 | `company` | `varchar(255)` | YES | `` | `` | `` | `` |
| 23 | `authorization` | `varchar(2000)` | YES | `` | `` | `` | `` |
| 24 | `obs` | `text` | YES | `` | `` | `` | `` |
| 25 | `tipo_token` | `int` | NO | `1` | `` | `` | `` |
| 26 | `favorecido_adiantamento` | `tinyint` | NO | `3` | `` | `` | `` |
| 27 | `permite_alteracao_manifesto` | `int` | NO | `1` | `` | `` | `` |
| 28 | `modelo_impressao` | `int` | NO | `0` | `` | `` | `` |
| 29 | `favorecido_pedagio` | `tinyint` | YES | `1` | `` | `` | `` |
| 30 | `favorecido_saldo_final` | `tinyint` | NO | `1` | `` | `` | `` |
| 31 | `id_natureza_adiantamento` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_unidade`, `id_forma`, `id_natureza_frete`, `id_natureza_pedagio`, `id_natureza_combustivel`, `id_natureza_despesas`, `vale_pedagio_id`, `id_natureza_adiantamento`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `ciot`, `administradora`
