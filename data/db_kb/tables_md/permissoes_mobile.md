# Tabela `azportoex.permissoes_mobile`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `permissoes_mobile`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `1`
- **Create time**: `2025-09-07T17:40:30`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `seguranca_autenticacao`
- **Evidência**: `inferido_por_nome:/(user|usuario|usuarios|perfil|role|permiss|auth|login|token|sess)/`

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
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `disponivel_amanha` | `int` | YES | `0` | `` | `` | `` |
| 3 | `disponivel_amanha_tipo` | `int` | YES | `0` | `` | `` | `` |
| 4 | `obriga_km_coleta` | `int` | YES | `1` | `` | `` | `` |
| 5 | `ignora_km_encerramento` | `int` | YES | `0` | `` | `` | `` |
| 6 | `exibir_manifesto_agente` | `tinyint` | YES | `0` | `` | `` | `` |
| 7 | `horario_saida_efetiva` | `tinyint` | YES | `` | `` | `` | `` |
| 8 | `horario_saida_efetiva_inicio` | `time` | YES | `` | `` | `` | `` |
| 9 | `horario_saida_efetiva_fim` | `time` | YES | `` | `` | `` | `` |
| 10 | `gerar_ocorrencia_manifesto` | `tinyint` | YES | `0` | `` | `` | `` |
| 11 | `visualiza_entregas_antes_saida` | `int` | YES | `0` | `` | `` | `` |
| 12 | `imprimir_etiquetas_entrega` | `int` | YES | `0` | `` | `` | `` |
| 13 | `confirmar_chegada_coleta` | `int` | YES | `1` | `` | `` | `` |
| 14 | `ignora_km_saida` | `int` | YES | `0` | `` | `` | `` |
| 15 | `finalizar_conferencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 16 | `observacao_finalizacao_conferencia` | `int` | YES | `0` | `` | `` | `` |
| 17 | `bloqueia_ocorrencia` | `int` | YES | `0` | `` | `` | `` |
| 18 | `cerca_entrega` | `int` | YES | `0` | `` | `` | `` |
| 19 | `valida_imagem` | `int` | YES | `0` | `` | `` | `` |
| 20 | `dest_diferentes` | `int` | YES | `0` | `` | `` | `` |
| 21 | `manifestos_diferentes` | `int` | YES | `0` | `` | `` | `` |
| 22 | `consolidadores_diferentes` | `int` | YES | `0` | `` | `` | `` |
| 23 | `layout_comprovante` | `tinyint` | YES | `1` | `` | `` | `` |
| 24 | `manifesto_sem_conferencia` | `int` | YES | `0` | `` | `` | `` |
| 25 | `manifesto_dias` | `int` | YES | `0` | `` | `` | `` |
| 26 | `qtd_dias` | `int` | YES | `` | `` | `` | `` |
| 27 | `finalizar_conferencia_automatico` | `tinyint` | YES | `1` | `` | `` | `` |
| 28 | `encerra_mdfe` | `tinyint` | YES | `0` | `` | `` | `` |
| 29 | `valida_cnpj_destinatario_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 30 | `visualiza_info_valores_transportados` | `tinyint` | YES | `0` | `` | `` | `` |
| 31 | `obriga_senha_recebedor_entrega` | `tinyint` | YES | `0` | `` | `` | `` |
| 32 | `ocorrencia_conferencia` | `tinyint` | YES | `0` | `` | `` | `` |
| 33 | `etiqueta_awb_conferencia` | `tinyint` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `horario_saida_efetiva`, `horario_saida_efetiva_inicio`, `horario_saida_efetiva_fim`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `permissoes`, `mobile`
