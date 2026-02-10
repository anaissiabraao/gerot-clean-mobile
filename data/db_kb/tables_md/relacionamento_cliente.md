# Tabela `azportoex.relacionamento_cliente`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `relacionamento_cliente`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `3284`
- **Create time**: `2025-09-07T17:41:01`
- **Update time**: `2025-12-16T17:26:22`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_relacionamento`

## Chaves estrangeiras (evidência estrutural)
- `id_reclamacao` → `reclamacao.id_reclamacao` (constraint=`fk_relacionamento_cliente_reclamacao`, on_update=`RESTRICT`, on_delete=`RESTRICT`)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_relacionamento`]
- `fk_relacionamento_cliente_reclamacao` type=`BTREE` non_unique=`True` cols=[`id_reclamacao`]
- `idx_cliente` type=`BTREE` non_unique=`True` cols=[`id_cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_relacionamento` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `id_cliente` | `int unsigned` | NO | `0` | `` | `MUL` | `` |
| 3 | `titulo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 4 | `data` | `date` | NO | `0000-00-00` | `` | `` | `` |
| 5 | `hora` | `time` | NO | `00:00:00` | `` | `` | `` |
| 6 | `recado` | `varchar(2)` | NO | `0` | `` | `` | `0- Nao quer recado 1- Recado` |
| 7 | `mensagem` | `mediumtext` | NO | `` | `` | `` | `` |
| 8 | `contato` | `varchar(60)` | NO | `` | `` | `` | `` |
| 9 | `status` | `int` | NO | `1` | `` | `` | `` |
| 10 | `usuario` | `int` | YES | `` | `` | `` | `` |
| 11 | `tipo` | `tinyint(1)` | YES | `` | `` | `` | `` |
| 12 | `vendedor` | `int` | YES | `` | `` | `` | `` |
| 13 | `km_rodado` | `int` | YES | `` | `` | `` | `` |
| 14 | `encerrado` | `tinyint(1)` | YES | `0` | `` | `` | `` |
| 15 | `data_encerrado` | `date` | YES | `` | `` | `` | `` |
| 16 | `hora_encerrado` | `time` | YES | `` | `` | `` | `` |
| 17 | `finalidade` | `smallint` | YES | `` | `` | `` | `` |
| 18 | `data_proximo` | `date` | YES | `` | `` | `` | `` |
| 19 | `hora_proximo` | `time` | YES | `` | `` | `` | `` |
| 20 | `feedback` | `mediumtext` | YES | `` | `` | `` | `` |
| 21 | `mais_vendedor` | `int` | YES | `0` | `` | `` | `` |
| 22 | `volumetria` | `int` | YES | `` | `` | `` | `` |
| 23 | `tipo_carga` | `int` | YES | `` | `` | `` | `` |
| 24 | `necessidade` | `int` | YES | `` | `` | `` | `` |
| 25 | `pracas` | `varchar(255)` | YES | `` | `` | `` | `` |
| 26 | `concorrentes` | `varchar(255)` | YES | `` | `` | `` | `` |
| 27 | `data_proximo_contato` | `date` | YES | `` | `` | `` | `` |
| 28 | `hora_proximo_contato` | `time` | YES | `00:00:00` | `` | `` | `` |
| 29 | `mensagem_encerramento` | `mediumtext` | YES | `` | `` | `` | `` |
| 30 | `km_inicial` | `int` | YES | `` | `` | `` | `` |
| 31 | `km_final` | `int` | YES | `` | `` | `` | `` |
| 32 | `comissao_lancamento` | `int` | YES | `` | `` | `` | `` |
| 33 | `potencial_cargas` | `decimal(12,2)` | YES | `` | `` | `` | `` |
| 34 | `id_reclamacao` | `int` | YES | `` | `` | `MUL` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_relacionamento`, `id_cliente`, `id_reclamacao`
- **Datas/tempos prováveis**: `data`, `hora`, `data_encerrado`, `hora_encerrado`, `data_proximo`, `hora_proximo`, `data_proximo_contato`, `hora_proximo_contato`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-16T17:26:22`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `relacionamento`, `cliente`
