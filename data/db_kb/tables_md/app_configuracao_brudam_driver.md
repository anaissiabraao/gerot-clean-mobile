# Tabela `azportoex.app_configuracao_brudam_driver`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `app_configuracao_brudam_driver`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `2`
- **Create time**: `2025-11-12T15:01:40`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `fiscal_documentos`
- **Evidência**: `inferido_por_nome:/(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)/`

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
- `id` type=`BTREE` non_unique=`True` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `tinyint` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `exige_recebedor_finalizar_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 3 | `exige_foto_pacote_finalizar_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 4 | `exige_assinatura_finalizar_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 5 | `exige_comprovante_finalizar_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `updated_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 7 | `layout_assinatura` | `tinyint` | YES | `1` | `` | `` | `` |
| 8 | `exige_comprovante_finalizar_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `exige_checklist_veiculo` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 10 | `checklist_motorista_tipo` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 11 | `exige_km_finalizar_tarefa` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `updated_at`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `app`, `configuracao`, `brudam`, `driver`
