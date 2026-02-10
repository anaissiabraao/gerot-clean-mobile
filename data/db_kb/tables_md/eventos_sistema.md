# Tabela `azportoex.eventos_sistema`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `eventos_sistema`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `8`
- **Create time**: `2025-09-07T17:37:51`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `auditoria_logs`
- **Evidência**: `inferido_por_nome:/(log|audit|hist|history|evento|event|trace)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo` | `varchar(45)` | NO | `` | `` | `` | `` |
| 3 | `nome` | `varchar(30)` | NO | `` | `` | `` | `Nome do evento` |
| 4 | `descricao` | `varchar(1000)` | NO | `` | `` | `` | `Descricao do evento. Detalhar finalidade e aplicacao` |
| 5 | `entidade` | `varchar(30)` | NO | `` | `` | `` | `Identificador da entidade que gera o evento. Ex: minuta, fatura, lancamento, etc` |
| 6 | `evento` | `enum('insert','delete','update','create')` | NO | `` | `` | `` | `` |
| 7 | `categoria` | `varchar(45)` | YES | `` | `` | `` | `` |

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
- `auditoria_logs`, `eventos`, `sistema`
