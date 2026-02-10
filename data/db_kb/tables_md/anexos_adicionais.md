# Tabela `azportoex.anexos_adicionais`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `anexos_adicionais`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `9005`
- **Create time**: `2025-09-07T17:36:52`
- **Update time**: `2025-12-17T14:37:36`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

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
| 2 | `id_fornecedor` | `int` | NO | `` | `` | `` | `` |
| 3 | `anexar_xml` | `int` | YES | `0` | `` | `` | `` |
| 4 | `anexar_excel` | `int` | YES | `0` | `` | `` | `` |
| 5 | `anexar_conferencia` | `int` | YES | `0` | `` | `` | `` |
| 6 | `anexar_nota` | `tinyint` | YES | `1` | `` | `` | `` |
| 7 | `anexar_doccob` | `int` | YES | `0` | `` | `` | `` |
| 8 | `anexar_conemb` | `int` | YES | `0` | `` | `` | `` |
| 9 | `anexar_arquivos` | `int` | YES | `0` | `` | `` | `` |
| 10 | `anexar_comprovantes` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `anexar_fat_excel` | `tinyint` | YES | `0` | `` | `` | `` |
| 12 | `anexar_fat_dacte` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fornecedor`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:37:36`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `anexos`, `adicionais`
