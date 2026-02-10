# Tabela `azportoex.equipamento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `equipamento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `39`
- **Create time**: `2025-09-07T17:37:49`
- **Update time**: `2025-12-16T13:33:12`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_equipamento`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `cte_serie_servico.servico` → `equipamento.id_equipamento` (constraint=`fk_cte_serie_servico_equipamento`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `regras_importacoes_nfe.id_servico` → `equipamento.id_equipamento` (constraint=`regras_importacoes_nfe_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_equipamento`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_equipamento` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `equipamento` | `varchar(40)` | NO | `` | `` | `` | `` |
| 3 | `data` | `date` | YES | `` | `` | `` | `` |
| 4 | `status` | `int` | NO | `1` | `` | `` | `` |
| 5 | `valor` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 6 | `tipo_calculo` | `int` | NO | `1` | `` | `` | `` |
| 7 | `tipo_find` | `int` | NO | `2` | `` | `` | `` |
| 8 | `tipo_feriado` | `int unsigned` | NO | `2` | `` | `` | `` |
| 9 | `tipo_sabado` | `tinyint` | YES | `` | `` | `` | `` |
| 10 | `saida_sabado` | `tinyint` | YES | `` | `` | `` | `` |
| 11 | `saida_fim_semana` | `tinyint` | YES | `1` | `` | `` | `` |
| 12 | `saida_feriados` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `percentual` | `decimal(12,2)` | NO | `` | `` | `` | `` |
| 14 | `modal` | `int` | NO | `` | `` | `` | `` |
| 15 | `tipo_comercial` | `tinyint` | YES | `0` | `` | `` | `` |
| 16 | `codigo` | `varchar(45)` | NO | `` | `` | `` | `` |
| 17 | `cor` | `varchar(11)` | NO | `` | `` | `` | `` |
| 18 | `valorKm` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 19 | `carro_dedicado` | `int unsigned` | NO | `0` | `` | `` | `` |
| 20 | `cubagem` | `int` | YES | `0` | `` | `` | `` |
| 21 | `modal_cubagem` | `tinyint` | YES | `1` | `` | `` | `` |
| 22 | `modalcte` | `tinyint` | YES | `1` | `` | `` | `` |
| 23 | `temperatura` | `int` | YES | `2` | `` | `` | `` |
| 24 | `lotacao` | `int` | YES | `1` | `` | `` | `` |
| 25 | `tpserv` | `tinyint` | YES | `0` | `` | `` | `` |
| 26 | `cia_aerea` | `tinyint` | YES | `` | `` | `` | `` |
| 27 | `cia` | `int` | YES | `` | `` | `` | `` |
| 28 | `servico_cia` | `int` | YES | `` | `` | `` | `` |
| 29 | `arredondar` | `smallint` | NO | `0` | `` | `` | `` |
| 30 | `sufixo` | `varchar(45)` | YES | `` | `` | `` | `` |
| 31 | `taxa_entrega` | `tinyint` | YES | `1` | `` | `` | `` |
| 32 | `impressao_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 33 | `altera_praca` | `tinyint` | YES | `0` | `` | `` | `` |
| 34 | `cubagem_total` | `tinyint` | YES | `0` | `` | `` | `` |
| 35 | `resultado_m3` | `tinyint` | YES | `0` | `` | `` | `` |
| 36 | `ignora_local_entrega` | `tinyint` | NO | `0` | `` | `` | `Ignorar local de entrega/recebedor no CTe e calculo de frete` |
| 37 | `arredondar_m3` | `tinyint` | YES | `1` | `` | `` | `` |
| 38 | `bloqueios_cotacao` | `int` | YES | `0` | `` | `` | `` |
| 39 | `limite_peso` | `int` | YES | `` | `` | `` | `` |
| 40 | `limite_volume` | `int` | YES | `` | `` | `` | `` |
| 41 | `limite_peso_volume` | `int` | YES | `` | `` | `` | `` |
| 42 | `origem_calcFrete` | `tinyint` | YES | `0` | `` | `` | `` |
| 43 | `destino_calcFrete` | `tinyint` | YES | `0` | `` | `` | `` |
| 44 | `container` | `int` | YES | `0` | `` | `` | `` |
| 45 | `valor_container` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 46 | `limite_servico_volumes` | `int` | YES | `` | `` | `` | `` |
| 47 | `limite_servico_peso` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 48 | `limite_servico_total_transportado` | `decimal(15,2)` | YES | `` | `` | `` | `` |
| 49 | `limite_servico_frete_total` | `decimal(10,2)` | YES | `` | `` | `` | `` |
| 50 | `limite_servico_comprimento` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 51 | `limite_servico_largura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 52 | `limite_servico_altura` | `decimal(8,2)` | YES | `` | `` | `` | `` |
| 53 | `tabelas` | `json` | YES | `` | `` | `` | `` |
| 54 | `seguro_item_add` | `json` | YES | `` | `` | `` | `` |
| 55 | `marca_agua_dacte` | `varchar(20)` | YES | `` | `` | `` | `` |
| 56 | `tipo_parametrizacao_limite_servico` | `tinyint` | YES | `1` | `` | `` | `` |
| 57 | `limite_servico_peso_taxado` | `decimal(15,2)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_equipamento`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T13:33:12`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `equipamento`
