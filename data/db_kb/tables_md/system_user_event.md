# Tabela `azportoex.system_user_event`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `system_user_event`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:11`
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
- `id_event` → `system_events.id` (constraint=`fk_system_event_user`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- `event_shipping.id_user_event` → `system_user_event.id` (constraint=`fk_event_shipping_user_event`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `fk_system_event_user` type=`BTREE` non_unique=`True` cols=[`id_event`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `name` | `varchar(100)` | NO | `` | `` | `` | `` |
| 3 | `id_event` | `smallint` | NO | `` | `` | `MUL` | `` |
| 4 | `observable` | `json` | YES | `` | `` | `` | `Em eventos de UPDATE, listar colunas observáveis em um array JSON.` |
| 5 | `url` | `varchar(200)` | NO | `` | `` | `` | `URL de destino do evento. Tratar para que a URL possa tambem conter variaveis.` |
| 6 | `body` | `mediumtext` | NO | `` | `` | `` | `Corpo da requisicao. Tratar variaveis ao gerar evento.` |
| 7 | `method` | `enum('get','post','delete','put')` | NO | `` | `` | `` | `Metodo HTTP para usar neste evento` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_event`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `system`, `user`, `event`
