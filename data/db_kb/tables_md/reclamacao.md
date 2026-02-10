# Tabela `azportoex.reclamacao`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `reclamacao`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1019`
- **Create time**: `2025-09-07T17:41:00`
- **Update time**: `2025-12-16T17:26:22`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_reclamacao`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `reclamacao_remessa.id_reclamacao` → `reclamacao.id_reclamacao` (constraint=`fk_reclamacao_remessa`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `relacionamento_cliente.id_reclamacao` → `reclamacao.id_reclamacao` (constraint=`fk_relacionamento_cliente_reclamacao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_reclamacao`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_reclamacao` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 3 | `protocolo` | `varchar(15)` | YES | `` | `` | `` | `` |
| 4 | `tipo_reclamacao` | `int` | YES | `` | `` | `` | `` |
| 5 | `reclamante` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `atendente` | `int` | YES | `` | `` | `` | `` |
| 7 | `telefone` | `varchar(20)` | YES | `` | `` | `` | `` |
| 8 | `email` | `varchar(100)` | YES | `` | `` | `` | `` |
| 9 | `obs` | `mediumtext` | YES | `` | `` | `` | `` |
| 10 | `plano_acao` | `varchar(500)` | YES | `` | `` | `` | `` |
| 11 | `causa_raiz` | `varchar(500)` | YES | `` | `` | `` | `` |
| 12 | `data_incluido` | `date` | YES | `` | `` | `` | `` |
| 13 | `hora_incluido` | `time` | YES | `` | `` | `` | `` |
| 14 | `operador` | `int` | YES | `` | `` | `` | `` |
| 15 | `status` | `int` | YES | `1` | `` | `` | `` |
| 16 | `referencia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 17 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 18 | `regiao` | `tinyint` | YES | `` | `` | `` | `` |
| 19 | `id_causa_raiz` | `int` | YES | `` | `` | `` | `` |
| 20 | `data_prazo` | `date` | NO | `` | `` | `` | `` |
| 21 | `resp_prazo` | `int` | NO | `` | `` | `` | `` |
| 22 | `categoria_atendimento` | `int` | NO | `0` | `` | `` | `` |
| 23 | `acao_imediata` | `varchar(300)` | YES | `` | `` | `` | `` |
| 24 | `data_hora_ocorrencia` | `datetime` | YES | `` | `` | `` | `` |
| 25 | `tipo_motorista` | `tinyint` | NO | `1` | `` | `` | `` |
| 26 | `id_motorista` | `int` | NO | `0` | `` | `` | `` |
| 27 | `id_integrador` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_reclamacao`, `id_cliente`, `id_causa_raiz`, `id_motorista`, `id_integrador`
- **Datas/tempos prováveis**: `data_incluido`, `hora_incluido`, `data_prazo`, `data_hora_ocorrencia`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T17:26:22`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `reclamacao`
