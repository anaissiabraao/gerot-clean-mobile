# Tabela `azportoex.indice_iss`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `indice_iss`
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
- `id_iss`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_iss`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_iss` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cidade` | `int` | NO | `` | `` | `` | `` |
| 3 | `valor` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 4 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 5 | `operador` | `int` | NO | `` | `` | `` | `` |
| 6 | `cfop` | `varchar(10)` | NO | `6.352` | `` | `` | `` |
| 7 | `tipo_imposto` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_iss`
- **Datas/tempos prováveis**: `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `indice`, `iss`
