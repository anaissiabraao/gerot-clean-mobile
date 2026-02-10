# Agente LangGraph (RAG-First) — GeRot (100% local)

Este módulo evolui o fluxo **retrieve → generate** para um **agente determinístico** orquestrado por **LangGraph**, com:

- **Validação obrigatória** antes de sintetizar resposta.
- **Loop controlado** (Retriever ↔ Validation) para evitar respostas genéricas.
- **Prioridade total ao knowledge base existente** (KB JSON ou Postgres/pgvector).
- **Declaração explícita** quando a informação não existir no knowledge.

## Endpoints

- **RAG clássico (mantido)**: `POST /v1/qa`
- **Agente (novo)**: `POST /v1/agent/qa`
- Debug:
  - `GET /debug/rag/last`
  - `GET /debug/agent/last`

## Payload (Agente)

`POST /v1/agent/qa`

Campos:
- **`question`**: string (obrigatório)
- **`top_k`**: int (default 6)
- **`metadata_filters`**: dict opcional (ver seção abaixo)
- **`max_attempts`**: int opcional (override do loop)

Retorno:
- **`answer`**: resposta final
- **`sources`**: lista de chunks recuperados (com `document_id`, `chunk_index`, `score`, `metadata`)
- **`intent`**: intenção detectada (determinística)
- **`used_rag`**: se o grafo exigiu consulta ao KB
- **`attempts`**: quantas tentativas de retrieval ocorreram
- **`trace`**: trilha com decisões/queries/top_k (observabilidade)

## `metadata_filters` (sem alterar o KB)

O agente e o RAG clássico aceitam `metadata_filters` e aplicam **somente como filtro de recuperação**.

### KB JSON (`data/knowledge_dump.json`)

Filtros suportados (igualdade simples):
- `{"category": "..."}` (ex.: categoria do item)
- `{"source": "..."}` (ex.: nome de arquivo/origem)
- Listas também funcionam:
  - `{"category": ["Faturamento", "Fiscal"]}`

### Postgres/pgvector

Filtros suportados:
- Campos “primários”:
  - `{"document_id": "..."}` (filtra `adc.document_id`)
  - `{"source_name": "..."}` (filtra `doc.source_name`)
- Demais chaves: igualdade em `doc.metadata` (jsonb) via `metadata ->> key`.
  - Ex.: `{"category": "Fiscal"}`
  - Ex.: `{"category": ["Fiscal", "Faturamento"]}`

## Variáveis de ambiente (Agent)

Configuradas em `rag_service/config.py`:

- **`RAG_AGENT_MAX_ATTEMPTS`** (default `3`): máximo de loops Retriever ↔ Validation.
- **`RAG_AGENT_MIN_CHUNKS`** (default `2`): mínimo de chunks para considerar contexto suficiente.
- **`RAG_AGENT_MIN_COVERAGE`** (default `0.15`): cobertura mínima de tokens relevantes no contexto.
- **`RAG_AGENT_MAX_DISTANCE`** (default `0.60`): corte de similaridade para pgvector (distance).
- **`RAG_AGENT_FORCE_RAG`** (default `true`): força KB-first (evita genérico).
- **`RAG_AGENT_ALLOW_GENERAL_WITHOUT_KB`** (default `true`): permite resposta geral apenas para intenção conversacional (com disclaimer).
- **`RAG_AGENT_SQL_WITH_RAG`** (default `false`): quando `true`, após executar SQL o agente também consulta a KB para contexto/explicação. Quando `false`, prioriza retorno “somente dados”.
- **`RAG_AGENT_ALLOW_OUT_OF_DOMAIN_LLM`** (default `true`): quando `true`, perguntas fora do domínio GeRot/DB (ex.: clima) podem ser respondidas pela LLM com disclaimer de ausência de dados em tempo real.
- **`RAG_AGENT_FALLBACK_TO_LLM_WHEN_NO_CONTEXT`** (default `false`): quando `true`, se não houver contexto interno suficiente (KB/SQL/external), o agente pode responder com a LLM de forma geral (com disclaimer) ao invés de bloquear.

## SQL (MySQL) — dados atuais (read-only, whitelist)

Quando habilitado, o agente pode executar consultas **read-only** no MySQL **apenas via templates whitelisted** (não existe “SQL livre”).

### Habilitar

- **`RAG_AGENT_SQL_ENABLED`**: `true|false` (default `false`)
- **`RAG_AGENT_SQL_TIMEOUT_S`**: timeout (default `20`)
- **`RAG_AGENT_SQL_MAX_ROWS`**: limite de linhas retornadas (default `50`)
- **`RAG_AGENT_SQL_WITH_RAG`**: `true|false` (default `false`)

### Conexão (reutiliza variáveis do projeto)

- **`MYSQL_AZ_HOST`** (ex.: `portoex.db.brudam.com.br`)
- **`MYSQL_AZ_PORT`** (default `3306`)
- **`MYSQL_AZ_DB`** (default `azportoex`)
- **`MYSQL_AZ_USER`**
- **`MYSQL_AZ_PASSWORD`**

### Fontes

Quando a resposta usar SQL, ela cita: **`[sql:<template>]`** (ex.: `[sql:manifesto.count_by_data_emissao]`).

## Fontes externas (HTTP) — fallback quando não há contexto interno

Quando habilitado, o agente pode consultar fontes externas **via templates whitelisted** (sem URL livre).

### Habilitar

- **`RAG_AGENT_EXTERNAL_ENABLED`**: `true|false` (default `false`)
- **`RAG_AGENT_EXTERNAL_TIMEOUT_S`**: timeout (default `15`)

### Fontes

- Open-Meteo (clima/temperatura): cita **`[ext:open-meteo]`**
- Open Library (livros/resumos): cita **`[ext:openlibrary]`**

## Mapeamento dos nós (requisito do grafo)

Implementação em `rag_service/agent_graph.py`:

- **INTENT_CLASSIFIER**: `intent_classifier_node`
- **RETRIEVER_AGENT**: `retriever_agent_node`
- **VALIDATION_AGENT**: `validation_agent_node`
- **SYNTHESIS_AGENT**: `synthesis_agent_node`
- **FINAL_RESPONSE**: `final_response_node`

Rota:
Usuário → Intent → (Retriever ↔ Validation)* → Synthesis → Final → END

## Exemplos de chamada

### PowerShell

```powershell
$body = @{
  question = "Como funciona a ingestão de documentos?"
  top_k = 6
  metadata_filters = @{ category = "Uploads" }
  max_attempts = 3
} | ConvertTo-Json -Depth 6

Invoke-RestMethod -Method Post -Uri "http://localhost:8000/v1/agent/qa" -Headers @{ "x-api-key" = "local-dev" } -ContentType "application/json" -Body $body
```

## Observações

- Se o console do Windows mostrar acentos quebrados, é um detalhe de **codepage** (saída do terminal), não do agente.

