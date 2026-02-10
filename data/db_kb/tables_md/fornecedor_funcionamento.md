# Tabela `azportoex.fornecedor_funcionamento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fornecedor_funcionamento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `9572`
- **Create time**: `2025-09-07T17:37:57`
- **Update time**: `2025-12-17T14:37:36`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_local`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_local`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_local` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `horaSegDe` | `varchar(5)` | YES | `` | `` | `` | `` |
| 3 | `horaSegAte` | `varchar(5)` | YES | `` | `` | `` | `` |
| 4 | `horaSegDas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 5 | `horaSegAteas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 6 | `horaSabDe` | `varchar(5)` | YES | `` | `` | `` | `` |
| 7 | `horaSabAte` | `varchar(5)` | YES | `` | `` | `` | `` |
| 8 | `horaSabDas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 9 | `horaSabAteas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 10 | `horaDomDe` | `varchar(5)` | YES | `` | `` | `` | `` |
| 11 | `horaDomAte` | `varchar(5)` | YES | `` | `` | `` | `` |
| 12 | `horaDomDas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 13 | `horaDomAteas` | `varchar(5)` | YES | `` | `` | `` | `` |
| 14 | `diaSeg` | `int unsigned` | YES | `` | `` | `` | `` |
| 15 | `diaTer` | `int unsigned` | YES | `` | `` | `` | `` |
| 16 | `diaQua` | `int unsigned` | YES | `` | `` | `` | `` |
| 17 | `diaQui` | `int unsigned` | YES | `` | `` | `` | `` |
| 18 | `diaSex` | `int unsigned` | YES | `` | `` | `` | `` |
| 19 | `diaSab` | `int unsigned` | YES | `` | `` | `` | `` |
| 20 | `diaDom` | `int unsigned` | YES | `` | `` | `` | `` |
| 21 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_local`
- **Datas/tempos prováveis**: `horaSegDe`, `horaSegAte`, `horaSegDas`, `horaSegAteas`, `horaSabDe`, `horaSabAte`, `horaSabDas`, `horaSabAteas`, `horaDomDe`, `horaDomAte`, `horaDomDas`, `horaDomAteas`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:37:36`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `fornecedor`, `funcionamento`
