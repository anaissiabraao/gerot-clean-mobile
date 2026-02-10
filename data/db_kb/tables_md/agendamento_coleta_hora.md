# Tabela `azportoex.agendamento_coleta_hora`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `agendamento_coleta_hora`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-11-07T13:12:30`
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
- `id_agendamento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_agendamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_agendamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_dia` | `int` | YES | `` | `` | `` | `` |
| 3 | `horario` | `time` | YES | `` | `` | `` | `` |
| 4 | `id_destinatario` | `int` | YES | `0` | `` | `` | `` |
| 5 | `responsavel_frete` | `int` | YES | `1` | `` | `` | `` |
| 6 | `tomador_frete` | `int` | YES | `0` | `` | `` | `` |
| 7 | `autorizacao_frete` | `varchar(255)` | YES | `` | `` | `` | `` |
| 8 | `valor_nf` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `peso_real` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `peso_cubado` | `int` | YES | `0` | `` | `` | `` |
| 11 | `volumes` | `int` | YES | `0` | `` | `` | `` |
| 12 | `coleta_tipo_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 13 | `coleta_id_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 14 | `coleta_veiculo_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 15 | `responsavel_seguro` | `int` | YES | `0` | `` | `` | `` |
| 16 | `responsavel_seguro_id` | `int` | YES | `0` | `` | `` | `` |
| 17 | `cia_transferencia` | `int` | YES | `0` | `` | `` | `` |
| 18 | `cia_transferencia_servico` | `int` | YES | `0` | `` | `` | `` |
| 19 | `origem_sigla` | `varchar(5)` | YES | `` | `` | `` | `` |
| 20 | `destino_sigla` | `varchar(5)` | YES | `` | `` | `` | `` |
| 21 | `solicitante` | `varchar(20)` | YES | `` | `` | `` | `` |
| 22 | `servico` | `int` | YES | `1` | `` | `` | `` |
| 23 | `coleta_motorista` | `int` | YES | `0` | `` | `` | `` |
| 24 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 25 | `hora_inicio` | `time` | YES | `` | `` | `` | `` |
| 26 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 27 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 28 | `bairro` | `varchar(60)` | YES | `` | `` | `` | `` |
| 29 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 30 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 31 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 32 | `numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 33 | `id_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 34 | `previsao_chegada_hora` | `time` | YES | `` | `` | `` | `` |
| 35 | `expedidor` | `varchar(60)` | YES | `` | `` | `` | `` |
| 36 | `hora_corte` | `time` | YES | `` | `` | `` | `` |
| 37 | `tipo_coleta` | `tinyint` | YES | `1` | `` | `` | `` |
| 38 | `centro_custo` | `int` | YES | `` | `` | `` | `` |
| 39 | `coleta_custo` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_agendamento`, `id_dia`, `id_destinatario`, `responsavel_seguro_id`, `id_expedidor`
- **Datas/tempos prováveis**: `horario`, `hora_inicio`, `previsao_chegada_hora`, `hora_corte`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `agendamento`, `coleta`, `hora`
