# Tabela `azportoex.cliente_futuro`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `cliente_futuro`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `0`
- **Create time**: `2025-09-07T17:37:09`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- `id_cliente`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_cliente`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_cliente` | `int unsigned` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `cnpj` | `int unsigned` | NO | `` | `` | `` | `` |
| 3 | `razaosocial` | `varchar(60)` | NO | `` | `` | `` | `` |
| 4 | `fantasia` | `varchar(45)` | NO | `` | `` | `` | `` |
| 5 | `endereco` | `varchar(45)` | NO | `` | `` | `` | `` |
| 6 | `bairro` | `varchar(45)` | NO | `` | `` | `` | `` |
| 7 | `numero` | `varchar(15)` | NO | `` | `` | `` | `` |
| 8 | `cidade` | `int unsigned` | NO | `` | `` | `` | `` |
| 9 | `nomea` | `varchar(45)` | NO | `` | `` | `` | `` |
| 10 | `emaila` | `varchar(45)` | NO | `` | `` | `` | `` |
| 11 | `telefonea` | `varchar(15)` | NO | `` | `` | `` | `` |
| 12 | `paginapessoala` | `varchar(45)` | NO | `` | `` | `` | `` |
| 13 | `dataa` | `date` | NO | `` | `` | `` | `` |
| 14 | `obsa` | `varchar(45)` | NO | `` | `` | `` | `` |
| 15 | `nomeb` | `varchar(45)` | NO | `` | `` | `` | `` |
| 16 | `emailb` | `varchar(45)` | NO | `` | `` | `` | `` |
| 17 | `telefoneb` | `varchar(15)` | NO | `` | `` | `` | `` |
| 18 | `paginapessoalb` | `varchar(45)` | NO | `` | `` | `` | `` |
| 19 | `dataniverb` | `date` | NO | `` | `` | `` | `` |
| 20 | `obsb` | `varchar(45)` | NO | `` | `` | `` | `` |
| 21 | `nomec` | `varchar(45)` | NO | `` | `` | `` | `` |
| 22 | `emailc` | `varchar(45)` | NO | `` | `` | `` | `` |
| 23 | `telefonec` | `varchar(15)` | NO | `` | `` | `` | `` |
| 24 | `paginapessoalc` | `varchar(45)` | NO | `` | `` | `` | `` |
| 25 | `dataniverc` | `date` | NO | `` | `` | `` | `` |
| 26 | `obsc` | `varchar(45)` | NO | `` | `` | `` | `` |
| 27 | `datafuncao` | `date` | NO | `` | `` | `` | `` |
| 28 | `site` | `varchar(45)` | NO | `` | `` | `` | `` |
| 29 | `datacontato` | `date` | NO | `` | `` | `` | `` |
| 30 | `obss` | `varchar(45)` | NO | `` | `` | `` | `` |
| 31 | `telefonee` | `varchar(15)` | NO | `` | `` | `` | `` |
| 32 | `fax` | `varchar(15)` | NO | `` | `` | `` | `` |
| 33 | `emaill` | `varchar(45)` | NO | `` | `` | `` | `` |
| 34 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 35 | `hora_incluido` | `varchar(8)` | NO | `` | `` | `` | `` |
| 36 | `operador` | `int unsigned` | NO | `` | `` | `` | `` |
| 37 | `ramoatividade` | `varchar(45)` | NO | `` | `` | `` | `` |
| 38 | `insc` | `int unsigned` | NO | `` | `` | `` | `` |
| 39 | `cep` | `int unsigned` | NO | `` | `` | `` | `` |
| 40 | `status` | `int unsigned` | NO | `1` | `` | `` | `` |
| 41 | `ultimo_contato` | `date` | YES | `0000-00-00` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_cliente`
- **Datas/tempos prováveis**: `dataa`, `dataniverb`, `dataniverc`, `datafuncao`, `datacontato`, `data_incluido`, `hora_incluido`, `ultimo_contato`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `cliente`, `futuro`
