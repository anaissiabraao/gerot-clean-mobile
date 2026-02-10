# Tabela `azportoex.ViewFornecedores`

## Identificação
- **Banco**: `azportoex`
- **Tabela**: `ViewFornecedores`
- **Tipo**: `VIEW`
- **Engine**: `None`
- **Collation**: `None`
- **Registros (estimativa)**: `0`
- **Create time**: `2024-02-26T05:13:46`
- **Update time**: `None`
- **Comment**: `VIEW`
- **Gerado em (UTC)**: `2025-12-17T16:50:41.035715+00:00`

## Domínio (INFERIDO)
- **Domínio sugerido**: `cadastros_base`
- **Evidência**: `inferido_por_nome:/(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)/`

## Finalidade funcional (INFERIDO)
- **Não inferida automaticamente nesta fase.**
  - Nesta FASE 2, descrevemos a estrutura.
  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais.

## Chave primária (evidência estrutural)
- (sem PK explícita)

## Chaves estrangeiras (evidência estrutural)
- (nenhuma FK explícita encontrada)

## Referenciado por (FK reversa) — evidência estrutural
- (nenhuma referência explícita encontrada)

## Índices (evidência estrutural)
- (nenhum índice encontrado via information_schema.STATISTICS)

## Estrutura resumida (colunas) — evidência estrutural
| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |
|---:|---|---|---|---|---|---|---|
| 1 | `id_local` | `int` | NO | `0` | `` | `` | `` |
| 2 | `cnpj_tipo` | `int` | NO | `0` | `` | `` | `` |
| 3 | `cnpj` | `int` | NO | `0` | `` | `` | `` |
| 4 | `fantasia` | `int` | NO | `0` | `` | `` | `` |
| 5 | `razao` | `int` | NO | `0` | `` | `` | `` |
| 6 | `endereco` | `int` | NO | `0` | `` | `` | `` |
| 7 | `numero` | `int` | NO | `0` | `` | `` | `` |
| 8 | `bairro` | `int` | NO | `0` | `` | `` | `` |
| 9 | `cep` | `int` | NO | `0` | `` | `` | `` |
| 10 | `cidade` | `int` | NO | `0` | `` | `` | `` |
| 11 | `complemento` | `int` | NO | `0` | `` | `` | `` |
| 12 | `status` | `int` | NO | `0` | `` | `` | `` |
| 13 | `insc_estadual` | `int` | NO | `0` | `` | `` | `` |
| 14 | `tipo_cadastro` | `int` | NO | `0` | `` | `` | `` |
| 15 | `bandeira_cia` | `int` | NO | `0` | `` | `` | `` |
| 16 | `seg_proprio` | `int` | NO | `0` | `` | `` | `` |
| 17 | `vendedor` | `int` | NO | `0` | `` | `` | `` |
| 18 | `telefone` | `int` | NO | `0` | `` | `` | `` |

## Campos críticos (INFERIDO)
- **IDs prováveis**: `id_local`
- **Datas/tempos prováveis**: (nenhum padrão de data detectado)

## Frequência de atualização (INFERIDO/limitado)
- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).
- Update time observado: `None`
- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4).

## Observações importantes
- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).
- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).

## Tags semânticas (INFERIDO)
- `cadastros_base`, `viewfornecedores`
