# Tabela `azportoex.comissao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `comissao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `6`
- **Create time**: `2025-09-07T17:37:17`
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
- `id_comissao`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_comissao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_comissao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `total_vendas` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 3 | `total_peso` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 4 | `total_emissoes` | `int` | YES | `0` | `` | `` | `` |
| 5 | `visitas` | `int` | YES | `0` | `` | `` | `` |
| 6 | `id_vendedor` | `int` | YES | `` | `` | `` | `` |
| 7 | `mes_vigencia` | `date` | YES | `` | `` | `` | `` |
| 8 | `meta_dia` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 9 | `futuros_clientes` | `int` | YES | `0` | `` | `` | `` |
| 10 | `operador` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_comissao`, `id_vendedor`
- **Datas/tempos prováveis**: `mes_vigencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `comissao`
