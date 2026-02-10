# Tabela `azportoex.natureza`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `natureza`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `384`
- **Create time**: `2025-09-07T17:40:13`
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
- `id_natureza`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_natureza`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_natureza` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `natureza` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `status` | `int` | NO | `1` | `` | `` | `` |
| 4 | `icms_isento` | `tinyint` | YES | `0` | `` | `` | `` |
| 5 | `ncm` | `varchar(8)` | YES | `` | `` | `` | `` |
| 6 | `codigo_te` | `varchar(3)` | YES | `` | `` | `` | `` |
| 7 | `controle` | `int` | YES | `0` | `` | `` | `` |
| 8 | `codigo_onu` | `varchar(4)` | YES | `` | `` | `` | `` |
| 9 | `controle_pgr` | `tinyint` | NO | `0` | `` | `` | `` |
| 10 | `classificacao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `mais_utilizadas` | `tinyint` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_natureza`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `natureza`
