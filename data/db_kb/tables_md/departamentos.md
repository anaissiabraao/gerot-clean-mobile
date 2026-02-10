# Tabela `azportoex.departamentos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `departamentos`
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
- `id_departamento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `departamento_rateio.id_departamento` → `departamentos.id_departamento` (constraint=`fk_departamento_rateio_departamentos`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_departamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_departamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `departamento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 3 | `limite` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 4 | `status` | `smallint` | NO | `1` | `` | `` | `` |
| 5 | `id_unidade` | `int` | YES | `0` | `` | `` | `` |
| 6 | `codigo` | `varchar(25)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_departamento`, `id_unidade`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `departamentos`
