# Tabela `azportoex.produtos_nf`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `produtos_nf`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
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
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_produto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_produto` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `codigo` | `varchar(20)` | NO | `` | `` | `` | `` |
| 3 | `codigo_interno` | `varchar(20)` | NO | `` | `` | `` | `` |
| 4 | `produto` | `varchar(255)` | NO | `` | `` | `` | `` |
| 5 | `fornecedor` | `int` | NO | `` | `` | `` | `` |
| 6 | `valor_unit` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 7 | `cst` | `varchar(5)` | YES | `` | `` | `` | `` |
| 8 | `ncm` | `varchar(20)` | YES | `` | `` | `` | `` |
| 9 | `cfop` | `varchar(5)` | YES | `` | `` | `` | `` |
| 10 | `icms` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 11 | `ipi` | `varchar(2)` | YES | `` | `` | `` | `` |
| 12 | `pis` | `varchar(2)` | YES | `` | `` | `` | `` |
| 13 | `operador` | `int` | YES | `` | `` | `` | `` |
| 14 | `situacao_tributaria` | `varchar(2)` | YES | `` | `` | `` | `` |
| 15 | `aliquota_pis` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 16 | `aliquota_confins` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 17 | `unidade_medida` | `varchar(255)` | YES | `` | `` | `` | `DEV-2209 -> UN - UNIDADE | PC - PEÇAS | LT - LITROS | CX - CAIXA` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_produto`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `produtos`
