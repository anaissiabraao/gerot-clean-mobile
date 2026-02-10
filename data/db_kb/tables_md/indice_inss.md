# Tabela `azportoex.indice_inss`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `indice_inss`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:19`
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
- `id_inss`

## Chaves estrangeiras (evidência estrutural)
- `id_indice` → `indice_inss_vigencia.id` (constraint=`fk_indice_inss_indice_inss_vigencia`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_inss`]
- `fk_indice_inss_indice_inss_vigencia` type=`BTREE` non_unique=`True` cols=[`id_indice`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_inss` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `inicio` | `decimal(20,2)` | YES | `` | `` | `` | `` |
| 3 | `fim` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 4 | `mes` | `varchar(7)` | YES | `` | `` | `` | `` |
| 5 | `aliquota` | `decimal(5,2)` | YES | `` | `` | `` | `` |
| 6 | `operador` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_indice` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_inss`, `id_indice`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `indice`, `inss`
