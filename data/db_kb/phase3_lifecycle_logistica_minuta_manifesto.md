# FASE 3 — Ciclo de vida candidato (INFERIDO) — trilha `logistica` (azportoex)

## Escopo e evidência
- Gerado em (UTC): **2025-12-17T16:50:41.035715+00:00**
- Seeds do recorte: `manifesto`, `minuta`, `coleta`
- Hops: **3** (FK explícita, conectividade fraca)
- Tabelas no recorte: **72**
- FKs explícitas no recorte: **82**

## Regras
- Estrutura (PK/FK/colunas) = evidência (information_schema).
- Interpretação de estágios / satélites / status / histórico = **INFERIDO**.

## Entidade âncora: `azportoex.minuta`

### Estrutura (evidência)
- **PK**: `id_minuta`
- **Colunas**: 234
- **Registros (estimativa)**: `218380`

### Dependências (FK OUT) — evidência
- `minuta.coleta_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_coleta_fatura`)
- `minuta.despacho_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura`)
- `minuta.despacho_fatura_retira` → `fatura.id_fatura` (constraint=`fk_minuta_despacho_fatura_retira`)
- `minuta.entrega_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_entrega_fatura`)
- `minuta.seguro_fatura` → `fatura.id_fatura` (constraint=`fk_minuta_seguro_fatura`)

### Dependentes (FK IN) — evidência
- `alteracoes_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_alteracoes_minuta_minuta`)
- `averbacao_protocolos.id_minuta` → `minuta.id_minuta` (constraint=`averbacao_protocolos_fk_minuta`)
- `cte_anulacao.id_minuta` → `minuta.id_minuta` (constraint=`cte_anulacao_minuta`)
- `cte_simplificado.minuta_base` → `minuta.id_minuta` (constraint=`cte_simplificado_ibfk_1`)
- `cte_simplificado.minuta_gerada` → `minuta.id_minuta` (constraint=`cte_simplificado_minuta_id_minuta_fk_2`)
- `cte_substituicao.id_minuta` → `minuta.id_minuta` (constraint=`cte_substituicao_minuta`)
- `frete_hist.frete` → `minuta.id_minuta` (constraint=`fk_frete_hist_minuta`)
- `gnre_guias.id_minuta` → `minuta.id_minuta` (constraint=`id_fk_gnre_minuta`)
- `minuta_campos_extras.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_campos_extras`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_id_minuta`)
- `minuta_custos.minuta` → `minuta.id_minuta` (constraint=`fk_minuta_custos_minuta`)
- `minutas_lote.minuta` → `minuta.id_minuta` (constraint=`id_fk_minuta`)
- `palavra_chave_minuta.minuta` → `minuta.id_minuta` (constraint=`fk_palavra_chave_minuta`)
- `performance_app_minuta.id_minuta` → `minuta.id_minuta` (constraint=`fk_performance_app_minuta_minuta`)

### Satélites prováveis (INFERIDO)
- Critérios: (1) tabelas relacionadas por FK direta; (2) tabelas cujo nome contém o nome da âncora; (3) marcação `hist/log` por nome.
- **Satélites históricos/auditoria (por nome, INFERIDO)**: `frete_hist`
- **Outros satélites (INFERIDO)**: `alteracoes_minuta`, `averbacao_protocolos`, `averbacao_tipo_minuta`, `cte_anulacao`, `cte_simplificado`, `cte_substituicao`, `fatura`, `gnre_guias`, `minuta_campos_extras`, `minuta_custos`, `minutas_lote`, `palavra_chave_minuta`, `performance_app_minuta`

### Sinais de ciclo de vida (INFERIDO)
- **Colunas de data/tempo prováveis**: `data_incluido`, `data`, `data_saida`, `data_prev_saida`, `prev_entrega`, `data_entrega`, `hora_entrega`, `coleta_data`, `cte_data`, `cte_hora`, `cte_aut_data`, `cte_aut_hora`, `cte_canc_data`, `cte_canc_hora`, `prev_entrega_hora`, `data_hora`, `agenda_data`, `agenda_hora_inicio`, `agenda_hora_fim`, `prev_saida_hora`, `perecivel_data`, `perecivel_hora`, `updated_at`, `coleta_hora`
- **Colunas de status/estado prováveis**: `tipo_emissao`, `fatura_status`, `status`, `tipo_icms`, `cte_status`, `cte_tipo_cte`, `cte_imposto_tipo`, `tipo_pagamento`, `tipo`, `tipo_valor_nota`

### Hipótese de estágios (INFERIDO, a validar)
- Esta é uma hipótese guiada por nomes de colunas (datas/status) e satélites; não é regra de negócio confirmada.
- Criação/entrada (ex.: `data_incluido` / `hora_incluido`).
- Planejamento (ex.: `prev_*`).
- Execução (saída/chegada efetiva).
- Finalização (entrega).

### Checklist de validação (queries sugeridas) — INFERIDO
> Queries para inspeção manual (não executadas automaticamente). Ajuste nomes/colunas conforme necessário.
```sql
-- Amostra de registros (inspeção de colunas relevantes)
SELECT * FROM azportoex.minuta ORDER BY id_minuta DESC LIMIT 10;

-- Distribuição por status (ajuste a coluna conforme sua escolha)
SELECT `tipo_emissao` AS status, COUNT(*) AS qtd FROM azportoex.minuta GROUP BY `tipo_emissao` ORDER BY qtd DESC;

-- Faixa temporal (ajuste a coluna conforme sua escolha)
SELECT MIN(`data_incluido`) AS min_dt, MAX(`data_incluido`) AS max_dt FROM azportoex.minuta;
```

## Entidade âncora: `azportoex.manifesto`

### Estrutura (evidência)
- **PK**: `id_manifesto`
- **Colunas**: 112
- **Registros (estimativa)**: `78583`

### Dependências (FK OUT) — evidência
- `manifesto.fatura` → `fatura.id_fatura` (constraint=`fk_manifesto_fatura`)
- `manifesto.viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`)

### Dependentes (FK IN) — evidência
- `ajudantes_manifesto.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_ajudante`)
- `ciot_manifesto.manifesto_numero` → `manifesto.id_manifesto` (constraint=`fk_ciot_manifesto_manifesto`)
- `historico_volume.manifesto` → `manifesto.id_manifesto` (constraint=`fk_historico_volume_manifesto`)
- `manifest_charge.manifestId` → `manifesto.id_manifesto` (constraint=`manifest_charge_ibfk_1`)
- `manifesto.viagem` → `manifesto.id_manifesto` (constraint=`fk_manifesto_viagem`)
- `manifesto_historico.manifesto` → `manifesto.id_manifesto` (constraint=`fk_manifesto_historico_man`)
- `picking.id_manifesto` → `manifesto.id_manifesto` (constraint=`fk_picking_manifesto`)
- `rateio_manual.manifestId` → `manifesto.id_manifesto` (constraint=`fk_manifesto_rateio`)

### Satélites prováveis (INFERIDO)
- Critérios: (1) tabelas relacionadas por FK direta; (2) tabelas cujo nome contém o nome da âncora; (3) marcação `hist/log` por nome.
- **Satélites históricos/auditoria (por nome, INFERIDO)**: `historico_volume`, `manifesto_historico`
- **Outros satélites (INFERIDO)**: `ajudantes_manifesto`, `averbacao_tipo_manifesto`, `ciot_manifesto`, `fatura`, `manifest_charge`, `picking`, `rateio_manual`

### Sinais de ciclo de vida (INFERIDO)
- **Colunas de data/tempo prováveis**: `prev_saida_data`, `prev_saida_hora`, `prev_chegada_data`, `prev_chegada_hora`, `saida_efetiva_data`, `saida_efetiva_hora`, `data_emissao`, `hora_emissao`, `chegada_efetiva_data`, `chegada_efetiva_hora`, `data_conferencia`, `hora_conferencia`, `dataMDFE`, `data_conferencia_saida`, `hora_conferencia_saida`, `data_conferencia_saita`, `conferente_inicio`, `conferente_fim`, `data_finalizado`, `updated_at`, `horaMDFE`
- **Colunas de status/estado prováveis**: `tipo`, `status`, `mdf_status`, `statusMDFE`, `tipo_ve`, `tipoMotorista`, `tipoManifesto`, `tipo_rateio`

### Hipótese de estágios (INFERIDO, a validar)
- Esta é uma hipótese guiada por nomes de colunas (datas/status) e satélites; não é regra de negócio confirmada.
- Emissão/geração (ex.: `data_emissao` / `hora_emissao`).
- Planejamento (ex.: `prev_*`).
- Execução (saída/chegada efetiva).

### Checklist de validação (queries sugeridas) — INFERIDO
> Queries para inspeção manual (não executadas automaticamente). Ajuste nomes/colunas conforme necessário.
```sql
-- Amostra de registros (inspeção de colunas relevantes)
SELECT * FROM azportoex.manifesto ORDER BY id_manifesto DESC LIMIT 10;

-- Distribuição por status (ajuste a coluna conforme sua escolha)
SELECT `tipo` AS status, COUNT(*) AS qtd FROM azportoex.manifesto GROUP BY `tipo` ORDER BY qtd DESC;

-- Faixa temporal (ajuste a coluna conforme sua escolha)
SELECT MIN(`prev_saida_data`) AS min_dt, MAX(`prev_saida_data`) AS max_dt FROM azportoex.manifesto;
```
