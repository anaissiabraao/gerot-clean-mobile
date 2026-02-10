# Tabela `azportoex.contas_bancarias_terceiro`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `contas_bancarias_terceiro`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `145`
- **Create time**: `2025-10-02T19:11:58`
- **Update time**: `2025-12-17T15:59:04`
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
| 2 | `id_empresa` | `int` | YES | `` | `` | `` | `` |
| 3 | `favorecido` | `varchar(60)` | YES | `` | `` | `` | `` |
| 4 | `banco` | `int` | YES | `` | `` | `` | `` |
| 5 | `agencia` | `varchar(10)` | YES | `` | `` | `` | `` |
| 6 | `conta` | `varchar(21)` | YES | `` | `` | `` | `` |
| 7 | `cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 8 | `operacao` | `int` | YES | `` | `` | `` | `` |
| 9 | `status` | `char(1)` | YES | `1` | `` | `` | `` |
| 10 | `tipo_conta` | `char(1)` | YES | `` | `` | `` | `` |
| 11 | `operador` | `int` | YES | `` | `` | `` | `` |
| 12 | `unidade` | `int` | NO | `` | `` | `` | `` |
| 13 | `pix` | `varchar(45)` | YES | `` | `` | `` | `` |
| 14 | `tipo_pix` | `int` | YES | `` | `` | `` | `` |
| 15 | `cnpj_instituicao` | `varchar(14)` | YES | `` | `` | `` | `` |
| 16 | `conta_padrao` | `tinyint` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id`, `id_empresa`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `2025-12-17T15:59:04`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `contas`, `bancarias`, `terceiro`
