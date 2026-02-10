# Tabela `azportoex.cliente_tabelas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cliente_tabelas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:10`
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
- `id_clienteTabela`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_clienteTabela`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_clienteTabela` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_local` | `smallint` | NO | `` | `` | `` | `` |
| 3 | `id_tabela` | `smallint` | NO | `` | `` | `` | `` |
| 4 | `referencia` | `varchar(45)` | YES | `` | `` | `` | `` |
| 5 | `id_origem` | `smallint` | YES | `` | `` | `` | `` |
| 6 | `status` | `int` | NO | `1` | `` | `` | `` |
| 7 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 8 | `operador` | `smallint` | YES | `` | `` | `` | `` |
| 9 | `data_inativo` | `date` | YES | `` | `` | `` | `` |
| 10 | `operador_inativo` | `smallint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_clienteTabela`, `id_local`, `id_tabela`, `id_origem`
- **Datas/tempos prováveis**: `data_incluido`, `data_inativo`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `cliente`, `tabelas`
