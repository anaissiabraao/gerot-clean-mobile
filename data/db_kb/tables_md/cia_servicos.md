# Tabela `azportoex.cia_servicos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cia_servicos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `166`
- **Create time**: `2025-09-07T17:37:05`
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
| 2 | `cia` | `int unsigned` | NO | `0` | `` | `` | `` |
| 3 | `descricao` | `varchar(45)` | YES | `` | `` | `` | `` |
| 4 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 5 | `finaliza` | `int unsigned` | NO | `0` | `` | `` | `` |
| 6 | `descricao_cia` | `varchar(250)` | YES | `` | `` | `` | `` |
| 7 | `id_cia` | `int` | YES | `` | `` | `` | `` |
| 8 | `operador` | `int` | YES | `` | `` | `` | `` |
| 9 | `bloqueia_selecao_servico` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 10 | `alerta_usuario_selecao_servico` | `tinyint unsigned` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_cia`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `cia`, `servicos`
