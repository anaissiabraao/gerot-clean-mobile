# Tabela `azportoex.nfse`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `nfse`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:40:14`
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
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cliente` | `int` | NO | `` | `` | `` | `` |
| 3 | `vlservico` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 4 | `vldeducoes` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 5 | `vlpis` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 6 | `vlcofins` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 7 | `vlinss` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 8 | `vlir` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 9 | `vlcsll` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 10 | `issretido` | `tinyint` | YES | `2` | `` | `` | `` |
| 11 | `vliss` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 12 | `vlretencoes` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 13 | `aliquota` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 14 | `vlissretido` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 15 | `desccondicionado` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 16 | `descincondicionado` | `decimal(10,2)` | YES | `0.00` | `` | `` | `` |
| 17 | `itemservico` | `varchar(5)` | YES | `` | `` | `` | `` |
| 18 | `codigocnae` | `varchar(7)` | YES | `` | `` | `` | `` |
| 19 | `cst` | `varchar(20)` | YES | `` | `` | `` | `` |
| 20 | `discriminacao` | `varchar(40)` | YES | `` | `` | `` | `` |
| 21 | `municipio` | `int` | YES | `` | `` | `` | `` |
| 22 | `numero` | `varchar(16)` | YES | `` | `` | `` | `` |
| 23 | `serie` | `varchar(3)` | YES | `` | `` | `` | `` |
| 24 | `tipo` | `tinyint` | YES | `1` | `` | `` | `` |
| 25 | `demi` | `date` | YES | `` | `` | `` | `` |
| 26 | `hora` | `varchar(5)` | YES | `` | `` | `` | `` |
| 27 | `data` | `date` | YES | `` | `` | `` | `` |
| 28 | `competencia` | `date` | YES | `` | `` | `` | `` |
| 29 | `naturezaoperacao` | `tinyint` | YES | `1` | `` | `` | `` |
| 30 | `regimeespecialtributacao` | `varchar(1)` | YES | `` | `` | `` | `` |
| 31 | `simplesnacional` | `tinyint` | YES | `2` | `` | `` | `` |
| 32 | `incentivadorcultural` | `tinyint` | YES | `2` | `` | `` | `` |
| 33 | `statusrps` | `tinyint` | YES | `1` | `` | `` | `` |
| 34 | `numrps` | `int` | YES | `` | `` | `` | `` |
| 35 | `serierps` | `varchar(3)` | YES | `` | `` | `` | `` |
| 36 | `subtipo` | `varchar(3)` | YES | `1` | `` | `` | `` |
| 37 | `protocolo` | `varchar(55)` | YES | `` | `` | `` | `` |
| 38 | `unidade` | `tinyint` | YES | `` | `` | `` | `` |
| 39 | `operador` | `smallint` | YES | `0` | `` | `` | `` |
| 40 | `status` | `tinyint` | YES | `0` | `` | `` | `` |
| 41 | `memo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 42 | `xtributacao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 43 | `xservico` | `varchar(255)` | YES | `` | `` | `` | `` |
| 44 | `descricao` | `varchar(255)` | YES | `` | `` | `` | `` |
| 45 | `codver` | `varchar(40)` | YES | `` | `` | `` | `` |
| 46 | `dhcanc` | `datetime` | YES | `` | `` | `` | `` |
| 47 | `arquivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 48 | `tpamb` | `tinyint` | YES | `2` | `` | `` | `` |
| 49 | `obs` | `varchar(1000)` | YES | `` | `` | `` | `` |
| 50 | `fatura` | `int` | YES | `` | `` | `` | `` |
| 51 | `id_lancamento` | `int` | YES | `` | `` | `` | `` |
| 52 | `minuta` | `int` | YES | `` | `` | `` | `` |
| 53 | `dhemi` | `datetime` | YES | `` | `` | `` | `` |
| 54 | `substituido` | `int` | YES | `` | `` | `` | `` |
| 55 | `cidade` | `varchar(11)` | YES | `` | `` | `` | `` |
| 56 | `provedor` | `enum('BRUDAM','NDD','MIGRATE')` | YES | `` | `` | `` | `` |
| 57 | `protocolo_cancelamento` | `varchar(55)` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_lancamento`
- **Datas/tempos prováveis**: `demi`, `hora`, `data`, `competencia`, `dhcanc`, `dhemi`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `fiscal_documentos`, `nfse`
