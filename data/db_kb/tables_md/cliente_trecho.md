# Tabela `azportoex.cliente_trecho`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cliente_trecho`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `119`
- **Create time**: `2025-09-07T17:37:10`
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
- `id_trecho_cliente`

## Chaves estrangeiras (evidência estrutural)
- `id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_trecho_fornecedor`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_trecho_cliente`]
- `fk_cliente_trecho_fornecedor` type=`BTREE` non_unique=`True` cols=[`id_cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_trecho_cliente` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | YES | `` | `` | `MUL` | `` |
| 3 | `id_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 4 | `id_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 5 | `desconto_frete_coleta` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `desconto_frete_entrega` | `decimal(5,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `desconto_frete_peso` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 8 | `desconto_advalorem` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 9 | `desconto_gris` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 10 | `acrescimo_frete_peso` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 11 | `acrescimo_advalorem` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 12 | `acrescimo_gris` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 13 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `fixo_gris` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 15 | `vigencia` | `date` | YES | `` | `` | `` | `` |
| 16 | `desconto_frete_minimo` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 17 | `peso_inicio` | `decimal(11,2)` | YES | `0.01` | `` | `` | `` |
| 18 | `peso_fim` | `decimal(11,2)` | YES | `9999999.99` | `` | `` | `` |
| 19 | `servico` | `int` | YES | `0` | `` | `` | `` |
| 20 | `minimo_frete_peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 21 | `minimo_advalorem` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 22 | `minimo_gris` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 23 | `desconto_fixo_peso_excedente` | `decimal(8,2)` | YES | `0.00` | `` | `` | `` |
| 24 | `adv_exc_fixo` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 25 | `gris_exc_fixo` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 26 | `zona_destino` | `int` | YES | `` | `` | `` | `` |
| 27 | `estado_destino` | `int` | YES | `` | `` | `` | `` |
| 28 | `estado_origem` | `int` | YES | `` | `` | `` | `` |
| 29 | `zona_origem` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_trecho_cliente`, `id_cliente`, `id_origem`, `id_destino`
- **Datas/tempos prováveis**: `vigencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `cliente`, `trecho`
