# Tabela `azportoex.regras_importacoes_nfe`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `regras_importacoes_nfe`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:41:01`
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
- `id_servico` → `equipamento.id_equipamento` (constraint=`regras_importacoes_nfe_ibfk_1`, on_update=`RESTRICT`, on_delete=`RESTRICT`)
- `id_cliente` → `fornecedores.id_local` (constraint=`regras_importacoes_nfe_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `id_cliente` type=`BTREE` non_unique=`True` cols=[`id_cliente`]
- `id_servico` type=`BTREE` non_unique=`True` cols=[`id_servico`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_tag` | `tinyint` | NO | `` | `` | `` | `` |
| 3 | `id_servico` | `int` | NO | `` | `` | `MUL` | `` |
| 4 | `id_cliente` | `int` | NO | `` | `` | `MUL` | `` |
| 5 | `descricao` | `varchar(255)` | NO | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_tag`, `id_servico`, `id_cliente`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `regras`, `importacoes`, `nfe`
