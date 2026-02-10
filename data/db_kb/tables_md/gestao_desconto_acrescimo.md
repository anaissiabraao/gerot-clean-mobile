# Tabela `azportoex.gestao_desconto_acrescimo`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `gestao_desconto_acrescimo`
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
| 2 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 3 | `data_emissao` | `date` | NO | `` | `` | `` | `` |
| 4 | `id_fornecedor` | `int` | NO | `` | `` | `` | `` |
| 5 | `descricao` | `text` | YES | `` | `` | `` | `` |
| 6 | `tipo_operacao` | `tinyint` | NO | `` | `` | `` | `` |
| 7 | `vencimento` | `date` | NO | `` | `` | `` | `` |
| 8 | `valor` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 10 | `ultimo_usuario` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fornecedor`
- **Datas/tempos prováveis**: `data_emissao`, `vencimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `gestao`, `desconto`, `acrescimo`
