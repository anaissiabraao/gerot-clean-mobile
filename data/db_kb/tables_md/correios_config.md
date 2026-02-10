# Tabela `azportoex.correios_config`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `correios_config`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:20`
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
- `id_config`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_config`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_config` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `dominio` | `varchar(255)` | NO | `` | `` | `` | `` |
| 3 | `usuario` | `varchar(45)` | NO | `` | `` | `` | `` |
| 4 | `senha` | `varchar(45)` | NO | `` | `` | `` | `` |
| 5 | `codAdministrativo` | `varchar(45)` | NO | `` | `` | `` | `` |
| 6 | `numeroContrato` | `varchar(45)` | NO | `` | `` | `` | `` |
| 7 | `cartaoPostagem` | `varchar(45)` | NO | `` | `` | `` | `` |
| 8 | `cnpjEmpresa` | `varchar(14)` | NO | `` | `` | `` | `` |
| 9 | `anoContrato` | `varchar(45)` | YES | `` | `` | `` | `` |
| 10 | `diretoria` | `int` | YES | `` | `` | `` | `` |
| 11 | `id_fornecedor` | `int` | YES | `` | `` | `` | `` |
| 12 | `ambiente` | `tinyint` | YES | `1` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_config`, `id_fornecedor`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `correios`, `config`
