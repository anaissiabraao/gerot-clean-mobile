# Tabela `azportoex.ciot_usuarios`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ciot_usuarios`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `7`
- **Create time**: `2025-09-07T17:37:09`
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
| 2 | `id_administradora` | `int` | YES | `` | `` | `` | `` |
| 3 | `id_usuario` | `int` | YES | `` | `` | `` | `` |
| 4 | `gerar` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 5 | `consultar` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 6 | `cancelar` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 7 | `encerrar` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 8 | `incluir_frete` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 9 | `incluir_pedagio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 10 | `incluir_combustivel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 11 | `incluir_adiantamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 12 | `cancela_adiantamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 13 | `cancela_combustivel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 14 | `cancela_pedagio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 15 | `cancela_frete` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 16 | `bloquear_adiantamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 17 | `bloquear_combustivel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 18 | `bloquear_pedagio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 19 | `bloquear_frete` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 20 | `libera_frete` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 21 | `libera_pedagio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 22 | `libera_combustivel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 23 | `libera_adiantamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 24 | `efetiva_frete` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 25 | `efetiva_pedagio` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 26 | `efetiva_combustivel` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 27 | `efetiva_adiantamento` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 28 | `incluir_frete_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 29 | `incluir_pedagio_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 30 | `incluir_combustivel_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 31 | `incluir_adiantamento_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 32 | `libera_frete_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 33 | `libera_pedagio_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 34 | `libera_combustivel_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 35 | `libera_adiantamento_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 36 | `efetiva_frete_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 37 | `efetiva_pedagio_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 38 | `efetiva_combustivel_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 39 | `efetiva_adiantamento_valor` | `decimal(12,2)` | YES | `0.00` | `` | `` | `` |
| 40 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 41 | `altera_imposto` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_administradora`, `id_usuario`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `ciot`, `usuarios`
