# Tabela `azportoex.emails_configuracao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `emails_configuracao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:39`
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
- `emails_configuracao_tipo.id_config` → `emails_configuracao.id` (constraint=`emails_configuracao_tipo_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `tinyint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `driver` | `enum('gmail','mailgun','sendgrid','maildocker','smtp')` | NO | `` | `` | `` | `` |
| 3 | `api` | `varchar(100)` | YES | `` | `` | `` | `` |
| 4 | `usuario` | `varchar(100)` | YES | `` | `` | `` | `` |
| 5 | `senha` | `varchar(100)` | YES | `` | `` | `` | `` |
| 6 | `dominio` | `varchar(100)` | YES | `` | `` | `` | `` |
| 7 | `porta` | `smallint` | YES | `` | `` | `` | `` |
| 8 | `remetente` | `varchar(100)` | YES | `` | `` | `` | `` |
| 9 | `tls` | `tinyint(1)` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `emails`, `configuracao`
