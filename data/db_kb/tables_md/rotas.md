# Tabela `azportoex.rotas`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `rotas`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `11070`
- **Create time**: `2025-10-09T13:40:05`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `operacao_logistica`
- **Evidência**: `inferido_por_nome:/(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- `integracao_rota.id_rota` → `rotas.id_rota` (constraint=`integracao_rota_ibfk_2`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]
- `id_rota` type=`BTREE` non_unique=`False` cols=[`id_rota`]
- `idx_rotas_id_rota` type=`BTREE` non_unique=`True` cols=[`id_rota`]
- `idx_sigla` type=`BTREE` non_unique=`True` cols=[`sigla`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `rota` | `varchar(50)` | YES | `` | `` | `` | `` |
| 3 | `uf` | `char(2)` | NO | `` | `` | `` | `` |
| 4 | `uf_ibge` | `tinyint unsigned` | NO | `` | `` | `` | `` |
| 5 | `cep_inicial` | `varchar(8)` | YES | `` | `` | `` | `` |
| 6 | `cep_final` | `varchar(8)` | YES | `` | `` | `` | `` |
| 7 | `id_rota` | `varchar(11)` | NO | `` | `` | `UNI` | `` |
| 8 | `capital` | `tinyint unsigned` | YES | `0` | `` | `` | `` |
| 9 | `sigla` | `varchar(7)` | YES | `` | `` | `MUL` | `` |
| 10 | `risco` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 11 | `redespacho` | `tinyint unsigned` | NO | `0` | `` | `` | `` |
| 12 | `pais` | `varchar(50)` | NO | `Brasil` | `` | `` | `` |
| 13 | `id_pais` | `smallint unsigned` | YES | `1058` | `` | `` | `` |
| 14 | `status` | `tinyint` | YES | `1` | `` | `` | `` |
| 15 | `praca` | `varchar(7)` | YES | `` | `` | `` | `` |
| 16 | `kmcapital` | `smallint unsigned` | YES | `` | `` | `` | `` |
| 17 | `nivercidade` | `date` | YES | `` | `` | `` | `` |
| 18 | `siafi` | `varchar(5)` | YES | `` | `` | `` | `` |
| 19 | `dipam` | `varchar(5)` | YES | `` | `` | `` | `` |
| 20 | `zona` | `int unsigned` | YES | `` | `` | `` | `` |
| 21 | `zona_cep` | `int unsigned` | YES | `` | `` | `` | `` |
| 22 | `agente` | `int unsigned` | YES | `` | `` | `` | `` |
| 23 | `id_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 24 | `resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 25 | `servico_resp` | `int unsigned` | YES | `` | `` | `` | `` |
| 26 | `prefixo` | `varchar(4)` | YES | `` | `` | `` | `` |
| 27 | `latitude` | `decimal(12,8)` | YES | `` | `` | `` | `` |
| 28 | `longitude` | `decimal(12,8)` | YES | `` | `` | `` | `` |
| 29 | `cod_tom` | `int(5) unsigned zerofill` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_rota`, `id_pais`, `id_resp`
- **Datas/tempos prováveis**: `nivercidade`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `operacao_logistica`, `rotas`
