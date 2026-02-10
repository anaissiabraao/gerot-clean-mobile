# Tabela `azportoex.resp_retirada`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `resp_retirada`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:02`
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
- `id_resp`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_resp`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_resp` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(255)` | YES | `` | `` | `` | `` |
| 3 | `rg` | `varchar(15)` | YES | `` | `` | `` | `` |
| 4 | `cpf` | `varchar(15)` | YES | `` | `` | `` | `` |
| 5 | `celular` | `varchar(20)` | YES | `` | `` | `` | `` |
| 6 | `data_nascimento` | `date` | YES | `` | `` | `` | `` |
| 7 | `funcao` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 8 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 9 | `id_usuario` | `int` | YES | `0` | `` | `` | `` |
| 10 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_resp`, `id_usuario`
- **Datas/tempos prováveis**: `data_nascimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `resp`, `retirada`
