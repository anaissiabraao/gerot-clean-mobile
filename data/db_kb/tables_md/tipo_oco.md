# Tabela `azportoex.tipo_oco`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `tipo_oco`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `299`
- **Create time**: `2025-12-02T18:34:59`
- **Update time**: `2025-12-08T14:21:44`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_oco`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `alteracoes_tipo_oco.id_ocorrencia` → `tipo_oco.id_oco` (constraint=`alteracoes_tipo_oco_id_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `coleta_historico.status` → `tipo_oco.id_oco` (constraint=`fk_coleta_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `manifesto_historico.status` → `tipo_oco.id_oco` (constraint=`fk_manifesto_historico_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `mdfe_hist.status` → `tipo_oco.id_oco` (constraint=`fk_mdfe_hist_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `oco_envio.ocorrencia` → `tipo_oco.id_oco` (constraint=`fk_ocorrencia_oco_envio_tipo_oco`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_oco`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_oco` | `smallint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `descricao` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `descricao_ingles` | `varchar(55)` | NO | `` | `` | `` | `` |
| 4 | `sigla` | `varchar(10)` | NO | `` | `` | `` | `` |
| 5 | `view_cliente` | `int` | NO | `1` | `` | `` | `` |
| 6 | `status_minuta` | `tinyint` | YES | `` | `` | `` | `` |
| 7 | `gera_oco` | `int` | NO | `1` | `` | `` | `` |
| 8 | `exclui` | `int unsigned` | NO | `1` | `` | `` | `` |
| 9 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 10 | `awb` | `int unsigned` | NO | `0` | `` | `` | `` |
| 11 | `coleta` | `int unsigned` | NO | `0` | `` | `` | `` |
| 12 | `agente` | `int unsigned` | NO | `1` | `` | `` | `` |
| 13 | `movel` | `int unsigned` | NO | `0` | `` | `` | `` |
| 14 | `vincular` | `tinyint` | YES | `0` | `` | `` | `` |
| 15 | `principal` | `tinyint` | NO | `0` | `` | `` | `` |
| 16 | `agendamento` | `tinyint` | YES | `0` | `` | `` | `` |
| 17 | `recebedor_obrigatorio` | `tinyint` | YES | `0` | `` | `` | `` |
| 18 | `falha_cliente` | `tinyint` | YES | `0` | `` | `` | `` |
| 19 | `comprovante_obrigatorio` | `tinyint` | YES | `0` | `` | `` | `` |
| 20 | `foto_pacote_obrigatorio` | `tinyint` | YES | `0` | `` | `` | `` |
| 21 | `insucesso` | `tinyint` | YES | `0` | `` | `` | `` |
| 22 | `hora_futura` | `tinyint` | YES | `1` | `` | `` | `` |
| 23 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED on update CURRENT_TIMESTAMP` | `` | `` |
| 24 | `minuta` | `tinyint` | YES | `1` | `` | `` | `` |
| 25 | `vincula_multimodal` | `tinyint` | YES | `0` | `` | `` | `` |
| 26 | `vicula_multimodal` | `tinyint` | YES | `0` | `` | `` | `` |
| 27 | `assinatura_obrigatoria` | `tinyint` | YES | `0` | `` | `` | `` |
| 28 | `gerar_oco_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 29 | `falha_agente` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 30 | `status_tracking` | `tinyint` | YES | `` | `` | `` | `` |
| 31 | `comprovante_obrigatorio_api` | `tinyint` | YES | `0` | `` | `` | `` |
| 32 | `modo_log` | `tinyint` | NO | `0` | `` | `` | `` |
| 33 | `config_ocorrencias` | `json` | YES | `` | `` | `` | `` |
| 34 | `permite_remover` | `tinyint` | NO | `1` | `` | `` | `` |
| 35 | `evento_insucesso` | `int` | NO | `0` | `` | `` | `0 => NÃO, 1 => RECEBEDOR NÃO ENCONTRADO, 2 => RECUSA DO RECEBEDOR, 3 => ENDEREÇO INEXISTENTE, 4 => OUTROS` |
| 36 | `motivo_insucesso` | `varchar(250)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_oco`
- **Datas/tempos prováveis**: `hora_futura`, `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-08T14:21:44`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `tipo`, `oco`
