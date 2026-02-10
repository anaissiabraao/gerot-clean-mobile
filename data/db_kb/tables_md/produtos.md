# Tabela `azportoex.produtos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `produtos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1409`
- **Create time**: `2025-09-07T17:40:35`
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
- `id_produto`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `produtos_nota.id_produto` → `produtos.id_produto` (constraint=`fk_produtos_nota_produto`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_produto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_produto` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `xProd` | `varchar(120)` | YES | `` | `` | `` | `` |
| 3 | `cProd` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `NCM` | `varchar(12)` | YES | `` | `` | `` | `` |
| 5 | `cEAN` | `varchar(45)` | YES | `` | `` | `` | `` |
| 6 | `categoria` | `int unsigned` | NO | `1` | `` | `` | `` |
| 7 | `estoqueMinimo` | `decimal(12,2) unsigned` | NO | `0.00` | `` | `` | `` |
| 8 | `valorVenda` | `decimal(12,2)` | NO | `0.00` | `` | `` | `` |
| 9 | `peso` | `decimal(12,2)` | NO | `0.01` | `` | `` | `` |
| 10 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 11 | `dataIncluido` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 12 | `operador` | `int unsigned` | NO | `0` | `` | `` | `` |
| 13 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `id_centro` | `int` | YES | `0` | `` | `` | `` |
| 15 | `unidade` | `varchar(15)` | YES | `` | `` | `` | `` |
| 16 | `fornecedor` | `varchar(30)` | YES | `` | `` | `` | `` |
| 17 | `valor_un` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 18 | `forma` | `varchar(15)` | NO | `FIFO` | `` | `` | `` |
| 19 | `descricao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 20 | `cliente` | `int` | NO | `0` | `` | `` | `` |
| 21 | `codigo` | `varchar(30)` | NO | `` | `` | `` | `` |
| 22 | `cst` | `int` | NO | `` | `` | `` | `` |
| 23 | `cfop` | `int` | NO | `` | `` | `` | `` |
| 24 | `id_categoria` | `int` | YES | `0` | `` | `` | `` |
| 25 | `validade` | `date` | YES | `` | `` | `` | `` |
| 26 | `lote` | `varchar(45)` | YES | `` | `` | `` | `` |
| 27 | `origem` | `tinyint` | YES | `0` | `` | `` | `` |
| 28 | `qtde_caixa` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 29 | `m3_caixa` | `varchar(45)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_produto`, `id_centro`, `id_categoria`
- **Datas/tempos prováveis**: `dataIncluido`, `validade`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `produtos`
