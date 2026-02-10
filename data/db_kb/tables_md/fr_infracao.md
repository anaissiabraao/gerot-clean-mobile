# Tabela `azportoex.fr_infracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_infracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:04`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

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
- `num_infracao` type=`BTREE` non_unique=`False` cols=[`num_infracao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario` | `int` | YES | `` | `` | `` | `` |
| 3 | `num_infracao` | `varchar(255)` | YES | `` | `` | `UNI` | `` |
| 4 | `data_infracao` | `date` | YES | `` | `` | `` | `` |
| 5 | `hora_infracao` | `time` | YES | `` | `` | `` | `` |
| 6 | `tipo_infracao` | `int` | YES | `` | `` | `` | `` |
| 7 | `local_infracao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `cidade_infracao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `uf_infracao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 10 | `veiculo` | `int` | YES | `` | `` | `` | `` |
| 11 | `motorista` | `int` | YES | `` | `` | `` | `` |
| 12 | `num_manifesto` | `int` | YES | `` | `` | `` | `` |
| 13 | `status` | `int` | YES | `1` | `` | `` | `` |
| 14 | `guia_pagamento` | `varchar(500)` | YES | `` | `` | `` | `` |
| 15 | `data_recebimento` | `date` | YES | `` | `` | `` | `` |
| 16 | `data_limite` | `date` | YES | `` | `` | `` | `` |
| 17 | `data_vencimento` | `date` | YES | `` | `` | `` | `` |
| 18 | `lancamento` | `int` | YES | `` | `` | `` | `` |
| 19 | `observacao` | `varchar(2000)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data_infracao`, `hora_infracao`, `data_recebimento`, `data_limite`, `data_vencimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `infracao`
