# Tabela `azportoex.api_user`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `api_user`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:36:53`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `seguranca_autenticacao`
- **Evidência**: `inferido_por_nome:/(user|usuario|usuarios|perfil|role|permiss|auth|login|token|sess)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_group` → `api_group.id` (constraint=`ausr_agrp_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `system_user` → `usuarios.id_usuario` (constraint=`ausr_usr_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `ausr_agrp_fk` type=`BTREE` non_unique=`True` cols=[`id_group`]
- `ausr_usr_fk` type=`BTREE` non_unique=`True` cols=[`system_user`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `username` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `password` | `varchar(64)` | NO | `` | `` | `` | `` |
| 4 | `token` | `varchar(50)` | YES | `` | `` | `` | `` |
| 5 | `system_user` | `int` | NO | `` | `` | `MUL` | `` |
| 6 | `id_group` | `int` | NO | `` | `` | `MUL` | `` |
| 7 | `permissions` | `json` | YES | `` | `` | `` | `` |
| 8 | `status` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_group`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `api`, `user`
