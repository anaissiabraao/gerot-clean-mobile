# Tabela `azportoex.controle_pedagios`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `controle_pedagios`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:20`
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
| 2 | `id_veiculo` | `int` | NO | `` | `` | `` | `` |
| 3 | `data` | `datetime` | NO | `` | `` | `` | `` |
| 4 | `id_pedagio` | `int` | NO | `` | `` | `` | `` |
| 5 | `id_sentido_ida` | `int` | YES | `` | `` | `` | `` |
| 6 | `id_sentido_volta` | `int` | YES | `` | `` | `` | `` |
| 7 | `id_bandeira` | `int` | YES | `` | `` | `` | `` |
| 8 | `valor` | `varchar(255)` | YES | `` | `` | `` | `` |
| 9 | `status` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 10 | `manifesto` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_veiculo`, `id_pedagio`, `id_sentido_ida`, `id_sentido_volta`, `id_bandeira`
- **Datas/tempos prováveis**: `data`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `seguranca_autenticacao`, `controle`, `pedagios`
