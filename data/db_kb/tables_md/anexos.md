# Tabela `azportoex.anexos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `anexos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `337496`
- **Create time**: `2025-10-11T06:50:30`
- **Update time**: `2025-12-17T16:49:11`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_anexo`

## Chaves estrangeiras (evidência estrutural)
- `id_nota` → `notas_fiscais.id_nf` (constraint=`fk_anexos_id_nota`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_anexo`]
- `fk_anexos_id_minuta` type=`BTREE` non_unique=`True` cols=[`id_minuta`]
- `fk_anexos_id_nota` type=`BTREE` non_unique=`True` cols=[`id_nota`]
- `idx_anexos_id_coleta` type=`BTREE` non_unique=`True` cols=[`id_coleta`]
- `idx_anexos_manifesto` type=`BTREE` non_unique=`True` cols=[`id_manifesto`]
- `idx_created_at` type=`BTREE` non_unique=`True` cols=[`created_at`]
- `idx_data_hora` type=`BTREE` non_unique=`True` cols=[`data`, `hora`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_anexo` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 3 | `id_minuta` | `int` | YES | `` | `` | `MUL` | `` |
| 4 | `imagem` | `varchar(255)` | NO | `` | `` | `` | `` |
| 5 | `data` | `date` | NO | `` | `` | `MUL` | `` |
| 6 | `hora` | `time` | NO | `` | `` | `` | `` |
| 7 | `operador` | `int` | YES | `` | `` | `` | `` |
| 8 | `id_coleta` | `int` | YES | `` | `` | `MUL` | `` |
| 9 | `id_fatura` | `int` | YES | `` | `` | `` | `` |
| 10 | `id_lancamento` | `int` | YES | `` | `` | `` | `` |
| 11 | `id_nota` | `int` | YES | `` | `` | `MUL` | `` |
| 12 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `id_agente` | `int` | YES | `` | `` | `` | `` |
| 14 | `id_local` | `int` | YES | `` | `` | `` | `` |
| 15 | `tipo_cadastro` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 16 | `id_reclamacao` | `int` | YES | `` | `` | `` | `` |
| 17 | `provider` | `tinyint` | YES | `1` | `` | `` | `` |
| 18 | `id_manifesto` | `int` | YES | `` | `` | `MUL` | `` |
| 19 | `created_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_anexo`, `id_minuta`, `id_coleta`, `id_fatura`, `id_lancamento`, `id_nota`, `id_agente`, `id_local`, `id_reclamacao`, `id_manifesto`
- **Datas/tempos prováveis**: `data`, `hora`, `created_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T16:49:11`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `anexos`
