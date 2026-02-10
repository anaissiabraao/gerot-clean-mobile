# FASE 3 — Ciclo de vida candidato (INFERIDO) — trilha `cadastro` (azportoex)

## Escopo e evidência
- Gerado em (UTC): **2025-12-17T16:50:41.035715+00:00**
- Seeds do recorte: `fornecedores`
- Seeds ausentes no schema (ignoradas): `clientes`
- Hops: **3** (FK explícita, conectividade fraca)
- Tabelas no recorte: **43**
- FKs explícitas no recorte: **47**

## Regras
- Estrutura (PK/FK/colunas) = evidência (information_schema).
- Interpretação de estágios / satélites / status / histórico = **INFERIDO**.

## Aviso (âncoras ausentes)
- As seguintes âncoras não foram encontradas no schema e foram ignoradas:
  - `clientes`

## Entidade âncora: `azportoex.fornecedores`

### Estrutura (evidência)
- **PK**: `id_local`
- **Colunas**: 318
- **Registros (estimativa)**: `58230`

### Dependências (FK OUT) — evidência
- (nenhuma FK OUT explícita)

### Dependentes (FK IN) — evidência
- `agendamento_coleta_dias.id_cliente` → `fornecedores.id_local` (constraint=`agendamento_coleta_dias_ibfk_1`)
- `cliente_trecho.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_trecho_fornecedor`)
- `cliente_usuario.id_cliente` → `fornecedores.id_local` (constraint=`fk_cliente_usuario_fornecedor`)
- `cliente_vinculado_fornecedor_usuario.id_usuario` → `fornecedores.id_local` (constraint=`cliente_vinculado_fornecedor_usuario_ibfk_1`)
- `cotacao.id_cliente` → `fornecedores.id_local` (constraint=`fk_id_cliente_cotacao`)
- `custo_diverso_coleta.id_fornecedor` → `fornecedores.id_local` (constraint=`custo_diverso_coleta_ibfk_2`)
- `edi_seq.cliente` → `fornecedores.id_local` (constraint=`edi_seq_fk`)
- `empresa_ie.id_empresa` → `fornecedores.id_local` (constraint=`empresa_ie_ibfk_1`)
- `fornecedor_bases_atendidas.id_fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_bases_atendidas_ibfk_1`)
- `fornecedor_dominio.empresa` → `fornecedores.id_local` (constraint=`fornecedor_dominio_ibfk_1`)
- `fornecedor_pagamento.fornecedor` → `fornecedores.id_local` (constraint=`fornecedor_pagamento_ibfk_1`)
- `hfornecedores.id_f` → `fornecedores.id_local` (constraint=`fk_fornecedor_hist`)
- `informacoes_adicionais.cliente` → `fornecedores.id_local` (constraint=`fk_informacoes_adicionais_fornecedores`)
- `manifesto_historico.fornecedor` → `fornecedores.id_local` (constraint=`fk_manifesto_historico_fornecedores`)
- `oco_envio.cliente` → `fornecedores.id_local` (constraint=`fk_cliente_oco_envio_fornecedores`)
- `oco_envio2.cliente` → `fornecedores.id_local` (constraint=`fk_oco_envio_cliente`)
- `ocorrencia_brd.cliente` → `fornecedores.id_local` (constraint=`clientes_brd_cliente_fk`)
- `permissoes_usuario_fornecedor.id_fornecedor` → `fornecedores.id_local` (constraint=`permissoes_usuario_fornecedor_ibfk_1`)
- `regras_importacoes_nfe.id_cliente` → `fornecedores.id_local` (constraint=`regras_importacoes_nfe_ibfk_2`)
- `restricoes_fornecedores.fornecedor` → `fornecedores.id_local` (constraint=`fk_restricoes_fornecedores_fornecedores`)
- `status_fornecedor_usuario.id_fornecedor` → `fornecedores.id_local` (constraint=`status_fornecedor_usuario_ibfk_1`)

### Satélites prováveis (INFERIDO)
- Critérios: (1) tabelas relacionadas por FK direta; (2) tabelas cujo nome contém o nome da âncora; (3) marcação `hist/log` por nome.
- **Satélites históricos/auditoria (por nome, INFERIDO)**: `manifesto_historico`
- **Outros satélites (INFERIDO)**: `agendamento_coleta_dias`, `cliente_trecho`, `cliente_usuario`, `cliente_vinculado_fornecedor_usuario`, `cotacao`, `custo_diverso_coleta`, `edi_seq`, `empresa_ie`, `fornecedor_bases_atendidas`, `fornecedor_dominio`, `fornecedor_pagamento`, `hfornecedores`, `informacoes_adicionais`, `oco_envio`, `oco_envio2`, `ocorrencia_brd`, `permissoes_usuario_fornecedor`, `regras_importacoes_nfe`, `restricoes_fornecedores`, `status_fornecedor_usuario`

### Sinais de ciclo de vida (INFERIDO)
- **Colunas de data/tempo prováveis**: `data_incluido`, `dt_fundacao`, `data_atualizado`, `data_cancelado`, `serasaData`, `serasavalidade`, `hora_bloqueio`, `dataDDR`, `data_vigencia`, `data_vigencia_2`, `updated_at`, `data_inativado`, `valida_data_nf`, `define_data_nf`
- **Colunas de status/estado prováveis**: `cnpj_tipo`, `cliente_tipo`, `tipo_pagamento`, `status`, `tipo_cadastro`, `data_cancelado`, `operador_cancelado`, `tipo_faturamento`, `dias_bloqueio`, `hora_bloqueio`, `faturas_bloqueio`, `tipo_imposto`, `tipoPeso`, `emissao_bloqueada`, `tipo_cliente`, `rateio_tipo`, `abc_tipo`, `bloquear_limite_credito`, `valor_nf_tipo`, `bloqueia_km`, `tipo_cambio`, `bloquea_emissao_cte_fob`, `tipoEtiquetaPeso`, `tipo_dias`

### Hipótese de estágios (INFERIDO, a validar)
- Esta é uma hipótese guiada por nomes de colunas (datas/status) e satélites; não é regra de negócio confirmada.
- Criação/entrada (ex.: `data_incluido` / `hora_incluido`).
- Cancelamento (campos `cancel*`).

### Checklist de validação (queries sugeridas) — INFERIDO
> Queries para inspeção manual (não executadas automaticamente). Ajuste nomes/colunas conforme necessário.
```sql
-- Amostra de registros (inspeção de colunas relevantes)
SELECT * FROM azportoex.fornecedores ORDER BY id_local DESC LIMIT 10;

-- Distribuição por status (ajuste a coluna conforme sua escolha)
SELECT `cnpj_tipo` AS status, COUNT(*) AS qtd FROM azportoex.fornecedores GROUP BY `cnpj_tipo` ORDER BY qtd DESC;

-- Faixa temporal (ajuste a coluna conforme sua escolha)
SELECT MIN(`data_incluido`) AS min_dt, MAX(`data_incluido`) AS max_dt FROM azportoex.fornecedores;
```
