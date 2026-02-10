# Tabela `azportoex.his_contato_fornecedor`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `his_contato_fornecedor`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `317`
- **Create time**: `2025-09-07T17:39:08`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

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
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_contato` | `int` | NO | `` | `` | `` | `` |
| 3 | `usuario` | `int` | NO | `` | `` | `` | `` |
| 4 | `data` | `datetime` | NO | `` | `` | `` | `` |
| 5 | `campo` | `varchar(55)` | NO | `` | `` | `` | `` |
| 6 | `valor_antigo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `valor_novo` | `varchar(60)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_contato`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `his`, `contato`, `fornecedor`
