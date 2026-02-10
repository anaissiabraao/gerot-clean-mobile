# Tabela `azportoex.permissoes_usuario_fornecedor`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `permissoes_usuario_fornecedor`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
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
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- `id_fornecedor` → `fornecedores.id_local` (constraint=`permissoes_usuario_fornecedor_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `fk_permissoes_usuario_fornecedor` type=`BTREE` non_unique=`True` cols=[`id_fornecedor`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_fornecedor` | `int` | NO | `` | `` | `MUL` | `` |
| 2 | `emite_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 3 | `visualiza_coleta` | `tinyint` | YES | `0` | `` | `` | `` |
| 4 | `destinatario` | `tinyint` | YES | `0` | `` | `` | `` |
| 5 | `peso_real` | `tinyint` | YES | `0` | `` | `` | `` |
| 6 | `volumes` | `tinyint` | YES | `0` | `` | `` | `` |
| 7 | `valor_notas` | `tinyint` | YES | `0` | `` | `` | `` |
| 8 | `telefone` | `tinyint` | YES | `0` | `` | `` | `` |
| 9 | `cubagem` | `tinyint` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_fornecedor`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `permissoes`, `usuario`, `fornecedor`
