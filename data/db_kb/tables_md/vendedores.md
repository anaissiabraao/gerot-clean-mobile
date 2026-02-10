# Tabela `azportoex.vendedores`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `vendedores`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `39`
- **Create time**: `2025-09-07T17:41:37`
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
- `id_vendedor`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_vendedor`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_vendedor` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(150)` | NO | `` | `` | `` | `` |
| 3 | `email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 4 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 5 | `celular` | `varchar(14)` | NO | `` | `` | `` | `` |
| 6 | `nextel` | `varchar(60)` | YES | `` | `` | `` | `` |
| 7 | `skype` | `varchar(60)` | YES | `` | `` | `` | `` |
| 8 | `comissao` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `status` | `int` | NO | `1` | `` | `` | `` |
| 10 | `usuario_sistema` | `smallint` | NO | `0` | `` | `` | `` |
| 11 | `tipo_calculo` | `int` | NO | `1` | `` | `` | `` |
| 12 | `operacao` | `int` | NO | `1` | `` | `` | `` |
| 13 | `tipo_vendedor` | `tinyint` | YES | `1` | `` | `` | `` |
| 14 | `id_local` | `int` | YES | `` | `` | `` | `` |
| 15 | `formula` | `varchar(255)` | YES | `` | `` | `` | `` |
| 16 | `valor_km` | `decimal(7,2)` | YES | `` | `` | `` | `` |
| 17 | `operador` | `int` | YES | `` | `` | `` | `` |
| 18 | `obs` | `text` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_vendedor`, `id_local`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `vendedores`
