# Tabela `azportoex.consolidador`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `consolidador`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:19`
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
- `itens_consolidados.id_consolidador` → `consolidador.id` (constraint=`fk_id_consolidador`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 3 | `referencia` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `descricao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 5 | `formato` | `int` | NO | `` | `` | `` | `` |
| 6 | `c_cubica` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 7 | `peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 8 | `alt` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 9 | `larg` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 10 | `prof` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 11 | `status` | `int` | NO | `` | `` | `` | `` |
| 12 | `tp_cod` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 13 | `rota` | `int` | YES | `` | `` | `` | `` |
| 14 | `tipo` | `int` | YES | `` | `` | `` | `` |
| 15 | `ultima_consolidacao` | `timestamp` | YES | `` | `` | `` | `` |
| 16 | `ultima_conferencia` | `timestamp` | YES | `` | `` | `` | `` |
| 17 | `situacao` | `enum('aberto','fechado','finalizado')` | NO | `aberto` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `ultima_consolidacao`, `ultima_conferencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `consolidador`
