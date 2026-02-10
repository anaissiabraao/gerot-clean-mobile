# Tabela `azportoex.abastecimentos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `abastecimentos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:35:59`
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
- `id_abastecimento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_abastecimento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_abastecimento` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_lancamento` | `int unsigned` | NO | `` | `` | `` | `` |
| 3 | `veiculo` | `int unsigned` | NO | `` | `` | `` | `` |
| 4 | `km` | `int unsigned` | NO | `` | `` | `` | `` |
| 5 | `produto` | `int unsigned` | NO | `` | `` | `` | `` |
| 6 | `quantidade` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 7 | `v_unit` | `decimal(15,3)` | NO | `` | `` | `` | `` |
| 8 | `v_total` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 9 | `fornecedor` | `int unsigned` | NO | `` | `` | `` | `` |
| 10 | `data` | `date` | NO | `` | `` | `` | `` |
| 11 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 12 | `operador` | `int unsigned` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_abastecimento`, `id_lancamento`
- **Datas/tempos prováveis**: `data`, `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `abastecimentos`
