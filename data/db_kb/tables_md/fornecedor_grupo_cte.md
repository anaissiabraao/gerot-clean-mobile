# Tabela `azportoex.fornecedor_grupo_cte`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fornecedor_grupo_cte`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3480`
- **Create time**: `2025-09-07T17:37:58`
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
- `idx_id_fornecedor` type=`BTREE` non_unique=`True` cols=[`id_fornecedor`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_fornecedor` | `int` | NO | `0` | `` | `MUL` | `` |
| 2 | `email` | `varchar(255)` | YES | `` | `` | `` | `` |
| 3 | `pdf` | `varchar(3)` | YES | `` | `` | `` | `` |
| 4 | `xml` | `varchar(3)` | YES | `` | `` | `` | `` |
| 5 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 6 | `nome` | `varchar(45)` | YES | `` | `` | `` | `` |
| 7 | `telefone` | `varchar(45)` | YES | `` | `` | `` | `` |
| 8 | `ocorrencias` | `varchar(3)` | YES | `` | `` | `` | `` |
| 9 | `aniversario` | `varchar(5)` | YES | `` | `` | `` | `` |
| 10 | `skype` | `varchar(45)` | YES | `` | `` | `` | `` |
| 11 | `setor` | `varchar(45)` | YES | `` | `` | `` | `` |
| 12 | `celular` | `varchar(15)` | YES | `` | `` | `` | `` |
| 13 | `nextel` | `varchar(15)` | YES | `` | `` | `` | `` |
| 14 | `fatura` | `varchar(3)` | NO | `SIM` | `` | `` | `` |
| 15 | `cpf` | `varchar(14)` | YES | `` | `` | `` | `` |
| 16 | `socio` | `varchar(3)` | YES | `NAO` | `` | `` | `` |
| 17 | `conemb` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `ocorren` | `tinyint` | YES | `0` | `` | `` | `` |
| 19 | `doccob` | `tinyint` | YES | `0` | `` | `` | `` |
| 20 | `notfis` | `tinyint` | YES | `0` | `` | `` | `` |
| 21 | `comprovante` | `tinyint` | YES | `0` | `` | `` | `` |
| 22 | `pre_alerta_whats` | `tinyint` | YES | `0` | `` | `` | `` |
| 23 | `pre_alerta_whats1` | `tinyint` | YES | `0` | `` | `` | `` |
| 24 | `operador` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_fornecedor`, `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `fornecedor`, `grupo`, `cte`
