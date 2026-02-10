# Tabela `azportoex.prev_entrega_trechos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `prev_entrega_trechos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1263`
- **Create time**: `2025-09-07T17:40:33`
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
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `idx_cnpjs` type=`BTREE` non_unique=`True` cols=[`origem_cnpj`, `destino_cnpj`]
- `idx_trecho` type=`BTREE` non_unique=`True` cols=[`origem`, `destino`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `origem` | `varchar(12)` | YES | `` | `` | `MUL` | `` |
| 3 | `destino` | `varchar(12)` | YES | `` | `` | `` | `` |
| 4 | `prazo` | `int` | NO | `` | `` | `` | `` |
| 5 | `status` | `int` | NO | `1` | `` | `` | `` |
| 6 | `cep_inicial` | `int unsigned` | NO | `` | `` | `` | `` |
| 7 | `cep_final` | `int unsigned` | NO | `` | `` | `` | `` |
| 8 | `modal` | `smallint` | YES | `0` | `` | `` | `` |
| 9 | `servico` | `int` | YES | `0` | `` | `` | `` |
| 10 | `horas` | `time` | YES | `` | `` | `` | `` |
| 11 | `origem_cnpj` | `varchar(15)` | YES | `` | `` | `MUL` | `` |
| 12 | `destino_cnpj` | `varchar(15)` | YES | `` | `` | `` | `` |
| 13 | `corte` | `varchar(5)` | YES | `` | `` | `` | `` |
| 14 | `chegada` | `varchar(5)` | YES | `` | `` | `` | `` |
| 15 | `saida` | `varchar(5)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `horas`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `prev`, `entrega`, `trechos`
