# Tabela `azportoex.fr_abastecimento`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `fr_abastecimento`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:38:03`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `nao_classificado`
- **Evidência**: `inferido_por_nome:sem_match`

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
- `fk_manifesto` type=`BTREE` non_unique=`True` cols=[`manifesto`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `tipo_responsavel` | `tinyint` | NO | `1` | `` | `` | `1=proprio, 2=agente, 3=terceiro` |
| 3 | `responsavel` | `int` | YES | `` | `` | `` | `agente/terceiro` |
| 4 | `funcionario` | `int` | NO | `` | `` | `` | `` |
| 5 | `fornecedor` | `int` | NO | `` | `` | `` | `` |
| 6 | `veiculo` | `int` | NO | `` | `` | `` | `` |
| 7 | `criado_em` | `date` | NO | `` | `` | `` | `` |
| 8 | `data` | `datetime` | YES | `` | `` | `` | `` |
| 9 | `status` | `int` | YES | `0` | `` | `` | `` |
| 10 | `km` | `int` | YES | `0` | `` | `` | `` |
| 11 | `valor` | `varchar(200)` | YES | `0` | `` | `` | `` |
| 12 | `litros` | `decimal(16,3)` | YES | `0.000` | `` | `` | `` |
| 13 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 14 | `logim_finalizada` | `int` | YES | `` | `` | `` | `` |
| 15 | `data_finalizada` | `date` | YES | `` | `` | `` | `` |
| 16 | `hora_finalizada` | `time` | YES | `` | `` | `` | `` |
| 17 | `lancamento_gerado` | `int` | YES | `` | `` | `` | `` |
| 18 | `transacao` | `varchar(20)` | YES | `` | `` | `` | `` |
| 19 | `produto` | `int` | NO | `` | `` | `` | `` |
| 20 | `ordem_servico` | `int` | YES | `` | `` | `` | `` |
| 21 | `km_anterior` | `int` | YES | `0` | `` | `` | `` |
| 22 | `km_atual` | `int` | YES | `0` | `` | `` | `` |
| 23 | `id_fatura` | `int` | YES | `` | `` | `` | `` |
| 24 | `posto` | `varchar(60)` | YES | `` | `` | `` | `` |
| 25 | `data_emissao` | `datetime` | YES | `` | `` | `` | `` |
| 26 | `logim_emissao` | `int` | YES | `` | `` | `` | `` |
| 27 | `manifesto` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_fatura`
- **Datas/tempos prováveis**: `criado_em`, `data`, `data_finalizada`, `hora_finalizada`, `data_emissao`, `logim_emissao`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `nao_classificado`, `abastecimento`
