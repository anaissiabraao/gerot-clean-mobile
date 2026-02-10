# Tabela `azportoex.alteracoes_cliente_usuario`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `alteracoes_cliente_usuario`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `488`
- **Create time**: `2025-09-07T17:36:02`
- **Update time**: `2025-12-12T18:29:51`
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
- `operador` → `usuarios.id_usuario` (constraint=`alteracoes_cliente_usuario_operador_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `usuario_cliente` → `cliente_usuario.id_usuario` (constraint=`alteracoes_cliente_usuario_usuario_cliente_fk`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `alteracoes_cliente_usuario_operador_fk` type=`BTREE` non_unique=`True` cols=[`operador`]
- `alteracoes_cliente_usuario_usuario_cliente_fk` type=`BTREE` non_unique=`True` cols=[`usuario_cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `usuario_cliente` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `campo` | `varchar(100)` | YES | `` | `` | `` | `` |
| 4 | `valor_antigo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 5 | `valor_novo` | `varchar(60)` | YES | `` | `` | `` | `` |
| 6 | `data` | `datetime` | YES | `CURRENT_TIMESTAMP` | `DEFAULT_GENERATED` | `` | `` |
| 7 | `operador` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-12T18:29:51`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `alteracoes`, `cliente`, `usuario`
