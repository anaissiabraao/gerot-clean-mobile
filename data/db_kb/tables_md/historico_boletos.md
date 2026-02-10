# Tabela `azportoex.historico_boletos`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `historico_boletos`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `33033`
- **Create time**: `2025-09-07T17:39:12`
- **Update time**: `None`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `financeiro`
- **Evidência**: `inferido_por_nome:/(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)/`

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
| 2 | `lancamento` | `int` | NO | `` | `` | `` | `` |
| 3 | `status` | `tinyint` | NO | `` | `` | `` | `` |
| 4 | `ocorrencia` | `varchar(80)` | NO | `` | `` | `` | `` |
| 5 | `data` | `date` | NO | `` | `` | `` | `` |
| 6 | `arquivo` | `varchar(255)` | YES | `` | `` | `` | `` |
| 7 | `hora` | `time` | YES | `00:00:00` | `` | `` | `` |
| 8 | `operador` | `smallint` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`
- **Datas/tempos prováveis**: `data`, `hora`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `historico`, `boletos`
