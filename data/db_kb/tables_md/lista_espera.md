# Tabela `azportoex.lista_espera`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `lista_espera`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:28`
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
- `id_espera`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_espera`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_espera` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_entrada` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_guiche` | `int` | YES | `` | `` | `` | `` |
| 4 | `tipo` | `int` | YES | `` | `` | `` | `` |
| 5 | `entrada` | `int` | YES | `0` | `` | `` | `` |
| 6 | `saida` | `int` | YES | `0` | `` | `` | `` |
| 7 | `inicio_embarque` | `datetime` | YES | `` | `` | `` | `` |
| 8 | `final_embarque` | `datetime` | YES | `` | `` | `` | `` |
| 9 | `inicio_retira` | `datetime` | YES | `` | `` | `` | `` |
| 10 | `final_retira` | `datetime` | YES | `` | `` | `` | `` |
| 11 | `status` | `int` | YES | `` | `` | `` | `` |
| 12 | `ordem` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_espera`, `id_entrada`, `id_guiche`
- **Datas/tempos prováveis**: `inicio_embarque`, `final_embarque`, `inicio_retira`, `final_retira`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `lista`, `espera`
