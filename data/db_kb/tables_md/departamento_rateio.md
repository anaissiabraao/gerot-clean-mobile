# Tabela `azportoex.departamento_rateio`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `departamento_rateio`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:36`
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
- `id_rateio`

## Chaves estrangeiras (evidência estrutural)
- `id_departamento` → `departamentos.id_departamento` (constraint=`fk_departamento_rateio_departamentos`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_rateio`]
- `fk_departamento_rateio_departamentos` type=`BTREE` non_unique=`True` cols=[`id_departamento`]
- `idx_id_lancamento` type=`BTREE` non_unique=`True` cols=[`id_lancamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_rateio` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lancamento` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `id_departamento` | `int` | YES | `` | `` | `MUL` | `` |
| 4 | `porcentagem` | `decimal(8,4)` | YES | `` | `` | `` | `` |
| 5 | `valor` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 6 | `id_centro_custo` | `int` | YES | `0` | `` | `` | `` |
| 7 | `id_nota_fiscal` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_rateio`, `id_lancamento`, `id_departamento`, `id_centro_custo`, `id_nota_fiscal`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `departamento`, `rateio`
