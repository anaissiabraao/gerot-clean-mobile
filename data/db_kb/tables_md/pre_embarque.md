# Tabela `azportoex.pre_embarque`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `pre_embarque`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:31`
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
| 2 | `id_cliente` | `int` | NO | `0` | `` | `` | `` |
| 3 | `tabela` | `int` | YES | `` | `` | `` | `` |
| 4 | `servico` | `int` | YES | `` | `` | `` | `` |
| 5 | `cotacao` | `int` | YES | `` | `` | `` | `` |
| 6 | `modal` | `int` | YES | `` | `` | `` | `` |
| 7 | `forma_transp` | `int` | NO | `2` | `` | `` | `` |
| 8 | `id_origem` | `int` | NO | `` | `` | `` | `` |
| 9 | `id_destino` | `int` | NO | `` | `` | `` | `` |
| 10 | `transf_origem` | `varchar(11)` | YES | `` | `` | `` | `` |
| 11 | `transf_destino` | `varchar(11)` | YES | `` | `` | `` | `` |
| 12 | `cia_transf` | `int` | YES | `0` | `` | `` | `` |
| 13 | `cia_servico` | `int` | YES | `0` | `` | `` | `` |
| 14 | `obs` | `varchar(255)` | YES | `` | `` | `` | `` |
| 15 | `status` | `smallint` | NO | `1` | `` | `` | `` |
| 16 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 17 | `data` | `date` | NO | `` | `` | `` | `` |
| 18 | `operador` | `int` | NO | `` | `` | `` | `` |
| 19 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 20 | `embarque_data` | `date` | YES | `` | `` | `` | `` |
| 21 | `embarque_hora` | `time` | YES | `` | `` | `` | `` |
| 22 | `embarque_hora_de` | `time` | YES | `` | `` | `` | `` |
| 23 | `chave` | `varchar(255)` | YES | `` | `` | `` | `` |
| 24 | `total_nf` | `int` | YES | `` | `` | `` | `` |
| 25 | `total_nf_valor` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 26 | `total_volumes` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 27 | `total_peso` | `decimal(10,2)` | NO | `` | `` | `` | `` |
| 28 | `total_cubo` | `decimal(12,3)` | NO | `` | `` | `` | `` |
| 29 | `cubagem_aereo` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 30 | `cubagem_rodoviario` | `decimal(12,3)` | YES | `0.000` | `` | `` | `` |
| 31 | `memo` | `mediumtext` | YES | `` | `` | `` | `` |
| 32 | `notas` | `varchar(55)` | YES | `` | `` | `` | `` |
| 33 | `solicitante` | `varchar(45)` | YES | `` | `` | `` | `` |
| 34 | `telefone` | `varchar(45)` | YES | `` | `` | `` | `` |
| 35 | `tipo_frequencia` | `int` | YES | `` | `` | `` | `` |
| 36 | `resp_frete` | `int unsigned` | NO | `1` | `` | `` | `` |
| 37 | `entrega_data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 38 | `entrega_hora` | `varchar(5)` | NO | `` | `` | `` | `` |
| 39 | `seguro_resp` | `int unsigned` | NO | `0` | `` | `` | `` |
| 40 | `id_seguro` | `int unsigned` | NO | `0` | `` | `` | `` |
| 41 | `autorizacao` | `varchar(55)` | YES | `` | `` | `` | `` |
| 42 | `tipo_pagamento` | `smallint` | NO | `2` | `` | `` | `` |
| 43 | `re_contato` | `varchar(35)` | YES | `` | `` | `` | `` |
| 44 | `forma_pagamento` | `int` | YES | `` | `` | `` | `` |
| 45 | `agendamento_coleta` | `int` | YES | `` | `` | `` | `` |
| 46 | `hora` | `time` | YES | `` | `` | `` | `` |
| 47 | `entrega_agendada` | `tinyint` | YES | `0` | `` | `` | `` |
| 48 | `id_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 49 | `id_entrega` | `int` | YES | `0` | `` | `` | `` |
| 50 | `id_endereco_expedidor` | `int` | YES | `0` | `` | `` | `` |
| 51 | `id_endereco_entrega` | `int` | YES | `0` | `` | `` | `` |
| 52 | `valor_total_notas` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 53 | `valor_total_produto` | `decimal(22,2)` | YES | `0.00` | `` | `` | `` |
| 54 | `tipo_valor_nota` | `tinyint` | YES | `0` | `` | `` | `` |
| 55 | `entrega_taxa_emergencia` | `tinyint` | YES | `` | `` | `` | `` |
| 56 | `alterado_por` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_cliente`, `id_origem`, `id_destino`, `id_seguro`, `id_expedidor`, `id_entrega`, `id_endereco_expedidor`, `id_endereco_entrega`
- **Datas/tempos prováveis**: `data_incluido`, `data`, `embarque_data`, `embarque_hora`, `embarque_hora_de`, `entrega_data`, `entrega_hora`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `pre`, `embarque`
