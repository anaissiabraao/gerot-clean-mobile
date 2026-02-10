# Tabela `azportoex.prefat`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `prefat`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:33`
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
| 2 | `id_fatura` | `int` | NO | `` | `` | `` | `` |
| 3 | `numero` | `int` | NO | `` | `` | `` | `` |
| 4 | `id_tomador` | `int` | NO | `` | `` | `` | `` |
| 5 | `cnpj_tomador` | `varchar(14)` | YES | `` | `` | `` | `` |
| 6 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 7 | `cnpj_cliente` | `varchar(14)` | YES | `` | `` | `` | `` |
| 8 | `nome_cliente` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `id_unidade` | `int` | YES | `` | `` | `` | `` |
| 10 | `codigo_transportadora` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `cnpj_transportadora` | `varchar(14)` | YES | `` | `` | `` | `` |
| 12 | `codigo_deposito` | `varchar(45)` | YES | `` | `` | `` | `` |
| 13 | `tipo_frete` | `char(1)` | YES | `` | `` | `` | `` |
| 14 | `modalidade_frete` | `char(1)` | YES | `` | `` | `` | `` |
| 15 | `tipo_frete_urbano` | `char(1)` | YES | `` | `` | `` | `` |
| 16 | `data_inicio_fechamento` | `date` | YES | `` | `` | `` | `` |
| 17 | `data_fim_fechamento` | `date` | YES | `` | `` | `` | `` |
| 18 | `valor_bloqueio` | `float` | YES | `` | `` | `` | `` |
| 19 | `valor_desbloqueio` | `float` | YES | `` | `` | `` | `` |
| 20 | `data_vencimento` | `date` | YES | `` | `` | `` | `` |
| 21 | `valor_frete` | `float` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fatura`, `id_tomador`, `id_cliente`, `id_unidade`
- **Datas/tempos prováveis**: `data_inicio_fechamento`, `data_fim_fechamento`, `data_vencimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `prefat`
