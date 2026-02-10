# Tabela `azportoex.fr_produtos_nota`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_produtos_nota`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:06`
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
| 1 | `id_nota` | `int` | NO | `` | `` | `` | `` |
| 2 | `id_produto` | `int` | NO | `` | `` | `` | `` |
| 3 | `cst_pis` | `varchar(2)` | NO | `` | `` | `` | `` |
| 4 | `cst_cofins` | `varchar(2)` | NO | `` | `` | `` | `` |
| 5 | `cst_icms` | `varchar(3)` | YES | `` | `` | `` | `` |
| 6 | `cst_ipi` | `varchar(2)` | YES | `` | `` | `` | `` |
| 7 | `quantidade` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 8 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 9 | `tipo` | `tinyint` | YES | `0` | `` | `` | `` |
| 10 | `CFOP` | `smallint` | YES | `0` | `` | `` | `` |
| 11 | `valorVenda` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 12 | `peso` | `decimal(12,2)` | NO | `0.01` | `` | `` | `` |
| 13 | `id_estoque` | `int` | NO | `` | `` | `` | `` |
| 14 | `unidade` | `varchar(15)` | YES | `` | `` | `` | `` |
| 15 | `valor_un` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `base_pis` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 17 | `aliquota_pis` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 18 | `base_cofins` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 19 | `aliquota_cofins` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 20 | `base_ipi` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 21 | `aliquota_ipi` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 22 | `desconto` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 23 | `origem` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_nota`, `id_produto`, `id`, `id_estoque`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `produtos`, `nota`
