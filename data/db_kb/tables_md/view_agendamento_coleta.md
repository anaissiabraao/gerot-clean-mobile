# Tabela `azportoex.view_agendamento_coleta`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `view_agendamento_coleta`
- **Tipo**: `VIEW`
- **Engine**: `None`
- **Collation**: `None`
- **Registros (estimativa)**: `0`
- **Create time**: `2024-11-24T16:21:29`
- **Update time**: `None`
- **Comment**: `VIEW`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_agendamento` | `int` | NO | `0` | `` | `` | `` |
| 2 | `hora` | `time` | YES | `` | `` | `` | `` |
| 3 | `id_cliente` | `int` | YES | `` | `` | `` | `` |
| 4 | `dia_semana` | `int` | YES | `` | `` | `` | `` |
| 5 | `responsavel_frete` | `int` | YES | `1` | `` | `` | `` |
| 6 | `id_destinatario` | `int` | YES | `0` | `` | `` | `` |
| 7 | `coleta_tipo_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 8 | `coleta_id_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 9 | `coleta_veiculo_responsavel` | `int` | YES | `0` | `` | `` | `` |
| 10 | `valor_nf` | `decimal(15,2)` | YES | `0.00` | `` | `` | `` |
| 11 | `peso_real` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `peso_cubado` | `int` | YES | `0` | `` | `` | `` |
| 13 | `volumes` | `int` | YES | `0` | `` | `` | `` |
| 14 | `responsavel_seguro` | `int` | YES | `0` | `` | `` | `` |
| 15 | `responsavel_seguro_id` | `int` | YES | `0` | `` | `` | `` |
| 16 | `origem_sigla` | `varchar(5)` | YES | `` | `` | `` | `` |
| 17 | `destino_sigla` | `varchar(5)` | YES | `` | `` | `` | `` |
| 18 | `cia_transferencia` | `int` | YES | `0` | `` | `` | `` |
| 19 | `cia_transferencia_servico` | `int` | YES | `0` | `` | `` | `` |
| 20 | `coleta_motorista` | `int` | YES | `0` | `` | `` | `` |
| 21 | `tomador_frete` | `int` | YES | `0` | `` | `` | `` |
| 22 | `solicitante` | `varchar(20)` | YES | `` | `` | `` | `` |
| 23 | `hora_inicio` | `time` | YES | `` | `` | `` | `` |
| 24 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 25 | `endereco` | `varchar(150)` | YES | `` | `` | `` | `` |
| 26 | `bairro` | `varchar(60)` | YES | `` | `` | `` | `` |
| 27 | `cep` | `varchar(8)` | YES | `` | `` | `` | `` |
| 28 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 29 | `complemento` | `varchar(45)` | YES | `` | `` | `` | `` |
| 30 | `numero` | `varchar(45)` | YES | `` | `` | `` | `` |
| 31 | `autorizacao_frete` | `varchar(255)` | YES | `` | `` | `` | `` |
| 32 | `previsao_chegada_hora` | `time` | YES | `` | `` | `` | `` |
| 33 | `id_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 34 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 35 | `emissao_automatica` | `tinyint` | YES | `0` | `` | `` | `` |
| 36 | `servico` | `bigint` | YES | `` | `` | `` | `` |
| 37 | `fantasia` | `varchar(60)` | YES | `` | `` | `` | `` |
| 38 | `contato` | `varchar(60)` | YES | `` | `` | `` | `` |
| 39 | `telefone` | `varchar(14)` | YES | `` | `` | `` | `` |
| 40 | `cnpj_cliente` | `varchar(15)` | YES | `` | `` | `` | `` |
| 41 | `cidade_cliente` | `varchar(50)` | YES | `` | `` | `` | `` |
| 42 | `cidade_dest` | `varchar(50)` | YES | `` | `` | `` | `` |
| 43 | `cep_dest` | `varchar(8)` | YES | `` | `` | `` | `` |
| 44 | `cnpj_dest` | `varchar(15)` | YES | `` | `` | `` | `` |
| 45 | `desabilitado` | `int` | YES | `0` | `` | `` | `` |
| 46 | `transf_id_origem` | `int` | YES | `0` | `` | `` | `` |
| 47 | `transf_id_destino` | `int` | YES | `0` | `` | `` | `` |
| 48 | `modalprev` | `int` | YES | `` | `` | `` | `` |
| 49 | `tipo_feriado` | `int unsigned` | YES | `2` | `` | `` | `` |
| 50 | `tipo_find` | `int` | YES | `2` | `` | `` | `` |
| 51 | `modal` | `tinyint` | YES | `1` | `` | `` | `` |
| 52 | `tipo_coleta` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_agendamento`, `id_cliente`, `id_destinatario`, `responsavel_seguro_id`, `id_expedidor`
- **Datas/tempos prováveis**: `hora`, `hora_inicio`, `previsao_chegada_hora`, `emissao_automatica`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `view`, `agendamento`, `coleta`
