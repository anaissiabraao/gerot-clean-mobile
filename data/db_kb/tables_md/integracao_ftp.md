# Tabela `azportoex.integracao_ftp`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `integracao_ftp`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(100)` | NO | `` | `` | `` | `` |
| 3 | `servidor` | `varchar(100)` | NO | `` | `` | `` | `` |
| 4 | `usuario` | `varchar(60)` | NO | `` | `` | `` | `` |
| 5 | `senha` | `varchar(60)` | NO | `` | `` | `` | `` |
| 6 | `pasta` | `json` | NO | `` | `` | `` | `JSON com diretorios utilizados para cada tipo de integracao (NOTFIS, OCOREN, DOCCOB, CONEMB, XML/CTe, PDF, etc)` |
| 7 | `porta` | `smallint unsigned` | YES | `21` | `` | `` | `` |
| 8 | `conexao` | `enum('ativo','passivo','sftp')` | YES | `` | `` | `` | `` |
| 9 | `tls` | `enum('sim','nao')` | YES | `nao` | `` | `` | `` |
| 10 | `ignora_ip_passivo` | `enum('sim','nao')` | YES | `` | `` | `` | `` |
| 11 | `sistema_operacional` | `enum('windows','unix')` | YES | `` | `` | `` | `` |
| 12 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 13 | `conexoes_invalidas` | `int` | YES | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `integracoes`, `integracao`, `ftp`
