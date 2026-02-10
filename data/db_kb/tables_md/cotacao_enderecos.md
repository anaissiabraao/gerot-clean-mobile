# Tabela `azportoex.cotacao_enderecos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cotacao_enderecos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3978`
- **Create time**: `2025-09-07T17:37:28`
- **Update time**: `2025-12-17T14:50:12`
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
| 2 | `endereco` | `varchar(60)` | YES | `` | `` | `` | `` |
| 3 | `bairro` | `varchar(60)` | YES | `` | `` | `` | `` |
| 4 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 5 | `cidade` | `varchar(50)` | YES | `` | `` | `` | `` |
| 6 | `numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 7 | `telefone` | `varchar(12)` | YES | `` | `` | `` | `` |
| 8 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 9 | `contato` | `varchar(55)` | YES | `` | `` | `` | `` |
| 10 | `fantasia` | `varchar(50)` | YES | `` | `` | `` | `` |
| 11 | `latitude` | `varchar(16)` | YES | `` | `` | `` | `` |
| 12 | `longitude` | `varchar(16)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T14:50:12`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cotacao`, `enderecos`
