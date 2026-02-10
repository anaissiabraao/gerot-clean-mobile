# Tabela `azportoex.fat_boleto`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fat_boleto`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:51`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `financeiro`
- **Evidência**: `inferido_por_nome:/(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_boleto`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_boleto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_boleto` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo` | `int` | NO | `9999` | `` | `` | `` |
| 3 | `cliente` | `int` | NO | `` | `` | `` | `` |
| 4 | `emissao` | `date` | NO | `` | `` | `` | `` |
| 5 | `vencimento` | `date` | NO | `` | `` | `` | `` |
| 6 | `valor` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 7 | `conta` | `int` | NO | `` | `` | `` | `` |
| 8 | `fatura` | `int` | NO | `` | `` | `` | `` |
| 9 | `status` | `int` | NO | `0` | `` | `` | `` |
| 10 | `mora` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 11 | `multa` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 12 | `dias` | `int` | NO | `` | `` | `` | `` |
| 13 | `chave` | `varchar(255)` | NO | `000` | `` | `` | `` |
| 14 | `lancamento` | `int unsigned` | NO | `` | `` | `` | `` |
| 15 | `numero` | `varchar(45)` | NO | `` | `` | `` | `` |
| 16 | `serie` | `varchar(45)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_boleto`
- **Datas/tempos prováveis**: `emissao`, `vencimento`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `fat`, `boleto`
