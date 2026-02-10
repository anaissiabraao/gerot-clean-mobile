# Tabela `azportoex.integracao_codigo`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `integracao_codigo`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:39:19`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `integracoes`
- **Evidência**: `inferido_por_nome:/(sync|integr|import|export|api|webhook|queue)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- `id_configuracao` → `integracao_configuracao.id` (constraint=`id_configuracao_integracao_configuracao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_tipo` → `integracao_tipo_codigo.id` (constraint=`id_tipo_integracao_codigo`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `id_configuracao_integracao_configuracao` type=`BTREE` non_unique=`True` cols=[`id_configuracao`]
- `id_tipo_integracao_codigo` type=`BTREE` non_unique=`True` cols=[`id_tipo`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_configuracao` | `int` | NO | `` | `` | `MUL` | `` |
| 3 | `id_tipo` | `int` | NO | `` | `` | `MUL` | `Veiculo, motorista, etc` |
| 4 | `id_interno` | `int` | YES | `` | `` | `` | `` |
| 5 | `id_externo` | `varchar(20)` | NO | `` | `` | `` | `ID do item no sistema do fornecedor` |
| 6 | `descricao` | `varchar(150)` | YES | `` | `` | `` | `` |
| 7 | `versao` | `int` | YES | `0` | `` | `` | `` |
| 8 | `tipo_codigo` | `varchar(10)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_configuracao`, `id_tipo`, `id_interno`, `id_externo`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `integracao`, `codigo`
