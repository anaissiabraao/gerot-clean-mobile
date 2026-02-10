# Tabela `azportoex.contas_bancaria`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `contas_bancaria`
- **Tipo**: `BASE TABLE`
- **Engine**: `InnoDB`
- **Collation**: `utf8mb4_unicode_ci`
- **Registros (estimativa)**: `4`
- **Create time**: `2025-09-07T17:37:19`
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
- `id_conta`

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- `PRIMARY` type=`BTREE` non_unique=`False` cols=[`id_conta`]

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_conta` | `int` | NO | `` | `auto_increment` | `PRI` | `` |
| 2 | `nome` | `varchar(60)` | NO | `` | `` | `` | `` |
| 3 | `id_banco` | `int` | NO | `0` | `` | `` | `` |
| 4 | `agencia` | `varchar(10)` | NO | `` | `` | `` | `` |
| 5 | `agencia_digito` | `varchar(5)` | NO | `` | `` | `` | `` |
| 6 | `numero` | `varchar(21)` | YES | `` | `` | `` | `` |
| 7 | `digito` | `int` | YES | `` | `` | `` | `` |
| 8 | `saldo_inicial` | `decimal(20,2)` | NO | `` | `` | `` | `` |
| 9 | `data_saldo` | `date` | NO | `` | `` | `` | `` |
| 10 | `saldo_tipo` | `varchar(1)` | NO | `+` | `` | `` | `` |
| 11 | `saldo_atual` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 12 | `boleto` | `int` | NO | `0` | `` | `` | `` |
| 13 | `taxa_boleto` | `decimal(15,2)` | NO | `` | `` | `` | `` |
| 14 | `boleto_carteira` | `varchar(15)` | NO | `` | `` | `` | `` |
| 15 | `boleto_aceite` | `varchar(3)` | NO | `` | `` | `` | `` |
| 16 | `boleto_especie` | `varchar(15)` | NO | `` | `` | `` | `` |
| 17 | `cheque` | `int` | NO | `` | `` | `` | `` |
| 18 | `status` | `int` | NO | `1` | `` | `` | `` |
| 19 | `endereco` | `varchar(60)` | NO | `` | `` | `` | `` |
| 20 | `bairro` | `varchar(60)` | NO | `` | `` | `` | `` |
| 21 | `id_cidade` | `int` | NO | `` | `` | `` | `` |
| 22 | `cep` | `varchar(15)` | NO | `` | `` | `` | `` |
| 23 | `cnpj` | `varchar(14)` | YES | `` | `` | `` | `` |
| 24 | `insc_est` | `int` | NO | `` | `` | `` | `` |
| 25 | `contato_nome` | `varchar(60)` | NO | `` | `` | `` | `` |
| 26 | `contato_fone` | `varchar(16)` | NO | `` | `` | `` | `` |
| 27 | `contato_email` | `varchar(255)` | NO | `` | `` | `` | `` |
| 28 | `data_incluido` | `date` | NO | `` | `` | `` | `` |
| 29 | `operador` | `int` | NO | `` | `` | `` | `` |
| 30 | `agencaia_dv` | `varchar(45)` | NO | `` | `` | `` | `` |
| 31 | `cod_empresa` | `varchar(45)` | YES | `` | `` | `` | `` |
| 32 | `convenio` | `varchar(45)` | NO | `` | `` | `` | `` |
| 33 | `instrucao_1` | `varchar(255)` | NO | `` | `` | `` | `` |
| 34 | `instrucao_2` | `varchar(255)` | NO | `` | `` | `` | `` |
| 35 | `instrucao_3` | `varchar(255)` | NO | `` | `` | `` | `` |
| 36 | `limite` | `decimal(15,2)` | NO | `0.00` | `` | `` | `` |
| 37 | `juros_atraso` | `decimal(5,2)` | NO | `0.00` | `` | `` | `` |
| 38 | `codigo_cedente` | `varchar(20)` | YES | `` | `` | `` | `` |
| 39 | `variacao_carteira` | `smallint` | YES | `0` | `` | `` | `` |
| 40 | `dias_protesto` | `int` | NO | `3` | `` | `` | `` |
| 41 | `fluxo_caixa` | `int` | NO | `1` | `` | `` | `` |
| 42 | `dias_pagto` | `int` | YES | `10` | `` | `` | `` |
| 43 | `multa_diaria` | `decimal(6,3)` | YES | `0.000` | `` | `` | `` |
| 44 | `juros_tipo` | `int` | YES | `0` | `` | `` | `` |
| 45 | `cnab` | `smallint` | YES | `400` | `` | `` | `` |
| 46 | `contrato` | `varchar(45)` | NO | `` | `` | `` | `` |
| 47 | `unidade` | `int` | YES | `` | `` | `` | `` |
| 48 | `taxa_padrao_boleto` | `float` | YES | `0` | `` | `` | `` |
| 49 | `desconta_taxa_boleto` | `tinyint` | YES | `0` | `` | `` | `` |
| 50 | `desconto_taxa_boleto` | `tinyint` | YES | `0` | `` | `` | `` |
| 51 | `lancamento_taxa_boleto` | `tinyint` | YES | `0` | `` | `` | `` |
| 52 | `id_local` | `int` | YES | `0` | `` | `` | `` |
| 53 | `prazo_compensacao_boleto` | `tinyint` | YES | `` | `` | `` | `` |
| 54 | `tipo_cobranca` | `varchar(10)` | YES | `` | `` | `` | `` |
| 55 | `id_centro` | `int` | YES | `` | `` | `` | `` |
| 56 | `cod_conta` | `int` | YES | `` | `` | `` | `` |
| 57 | `aplicacao_juros` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 58 | `aplicacao_multa` | `tinyint(1)` | YES | `1` | `` | `` | `` |
| 59 | `ativa_conta_pagar` | `int` | YES | `0` | `` | `` | `` |
| 60 | `convenio_recebe` | `varchar(15)` | YES | `` | `` | `` | `` |
| 61 | `chave_pix` | `varchar(35)` | YES | `` | `` | `` | `` |
| 62 | `servico_bancario` | `json` | YES | `` | `` | `` | `` |
| 63 | `ativa_faixa_sequencial` | `int` | YES | `` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_conta`, `id_banco`, `id_cidade`, `id_local`, `id_centro`
- **Datas/tempos prováveis**: `data_saldo`, `data_incluido`

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `financeiro`, `contas`, `bancaria`
