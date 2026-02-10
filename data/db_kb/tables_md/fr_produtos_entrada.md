# Tabela `azportoex.fr_produtos_entrada`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_produtos_entrada`
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
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_nota` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `quantidade` | `decimal(12,2) unsigned` | NO | `0.00` | `` | `` | `` |
| 4 | `uCom` | `int unsigned` | NO | `0` | `` | `` | `` |
| 5 | `vProd` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 6 | `CFOP` | `varchar(4)` | YES | `` | `` | `` | `` |
| 7 | `vOutro` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 8 | `vDesc` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 9 | `vFrete` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 10 | `vSeg` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 11 | `uTrib` | `int unsigned` | YES | `` | `` | `` | `` |
| 12 | `xProd` | `varchar(120)` | YES | `` | `` | `` | `` |
| 13 | `cProd` | `varchar(45)` | NO | `` | `` | `` | `` |
| 14 | `NCM` | `varchar(12)` | YES | `` | `` | `` | `` |
| 15 | `cEAN` | `varchar(45)` | YES | `` | `` | `` | `` |
| 16 | `valorVenda` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 17 | `peso` | `decimal(12,2)` | NO | `0.01` | `` | `` | `` |
| 18 | `unidade` | `varchar(15)` | YES | `` | `` | `` | `` |
| 19 | `valor_un` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 20 | `id_produto` | `int` | YES | `` | `` | `` | `` |
| 21 | `lote` | `varchar(30)` | YES | `` | `` | `` | `` |
| 22 | `validade` | `date` | YES | `` | `` | `` | `` |
| 23 | `orig` | `varchar(2)` | YES | `` | `` | `` | `` |
| 24 | `tipo_item` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_nota`, `id_produto`
- **Datas/tempos prováveis**: `validade`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `produtos`, `entrada`
