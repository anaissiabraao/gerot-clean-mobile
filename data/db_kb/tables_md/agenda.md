# Tabela `azportoex.agenda`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `agenda`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:36:01`
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
- `id_agenda`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_agenda`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_agenda` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_usuario` | `int` | NO | `` | `` | `` | `` |
| 3 | `nome` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 5 | `comercial` | `varchar(14)` | NO | `` | `` | `` | `` |
| 6 | `residencial` | `varchar(14)` | NO | `` | `` | `` | `` |
| 7 | `nextel` | `varchar(15)` | NO | `` | `` | `` | `` |
| 8 | `celular` | `varchar(14)` | NO | `` | `` | `` | `` |
| 9 | `msn` | `varchar(255)` | NO | `` | `` | `` | `` |
| 10 | `skype` | `varchar(55)` | NO | `` | `` | `` | `` |
| 11 | `aniversario` | `date` | NO | `` | `` | `` | `` |
| 12 | `empresa` | `varchar(120)` | NO | `` | `` | `` | `` |
| 13 | `cargo` | `varchar(60)` | NO | `` | `` | `` | `` |
| 14 | `obs` | `varchar(255)` | NO | `` | `` | `` | `` |
| 15 | `data` | `date` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_agenda`, `id_usuario`
- **Datas/tempos prováveis**: `aniversario`, `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `agenda`
