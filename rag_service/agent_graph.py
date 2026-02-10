"""Agente RAG-First (LangGraph) para execução 100% local.

Metas (obrigatórias):
- Fluxo não-linear e determinístico (grafo de estados).
- Nunca responder sem validação de contexto.
- Priorizar o knowledge base existente (RAG).
- Declarar explicitamente quando a informação não existir no knowledge.
- Evitar respostas amplas/genéricas quando a intenção exige base.
"""

from __future__ import annotations

import time
from collections import deque
from dataclasses import dataclass
from typing import Any, Deque, Dict, Literal, Optional, TypedDict

from langgraph.graph import END, StateGraph

from .config import settings
from .external_tool import choose_external_template, run_external_template
from .llm_client import llm_client
from .mysql_tool import choose_query_template, run_mysql_template
from .rag_pipeline import build_context
from .retriever import retrieve_chunks


Intent = Literal["informacional", "tecnica", "comparativa", "validacao", "conversacional"]


class AgentState(TypedDict, total=False):
    # input
    question: str
    top_k: int
    metadata_filters: Dict[str, Any] | None
    # control
    intent: Intent
    needs_rag: bool
    needs_sql: bool
    needs_external: bool
    attempt: int
    max_attempts: int
    refined_query: str
    # retrieval
    chunks: list[dict]
    # live SQL (read-only)
    sql_query_name: str
    sql_rows: list[dict]
    sql_error: str
    # external
    external_provider: str
    external_query_name: str
    external_data: dict
    external_error: str
    # validation
    is_sufficient: bool
    validation_reason: str
    # generation
    draft_answer: str
    final_answer: str
    # observability
    trace: Dict[str, Any]


_AGENT_LAST: Deque[Dict[str, Any]] = deque(maxlen=50)


def get_last_agent_events(limit: int = 20) -> list[Dict[str, Any]]:
    limit = max(1, min(int(limit or 20), 50))
    return list(_AGENT_LAST)[-limit:]


def _tokenize_pt(text: str) -> list[str]:
    # Tokenização simples/determinística (sem deps)
    import re

    word_re = re.compile(r"[a-zA-ZÀ-ÿ0-9]+", re.UNICODE)
    stop = {
        "a",
        "o",
        "as",
        "os",
        "um",
        "uma",
        "uns",
        "umas",
        "de",
        "do",
        "da",
        "dos",
        "das",
        "em",
        "no",
        "na",
        "nos",
        "nas",
        "e",
        "ou",
        "que",
        "qual",
        "quais",
        "quem",
        "quando",
        "onde",
        "como",
        "porque",
        "por",
        "para",
        "com",
        "sem",
        "ao",
        "aos",
        "à",
        "às",
        "se",
        "sua",
        "seu",
        "suas",
        "seus",
        "isso",
        "isto",
        "aquilo",
        "essa",
        "esse",
        "essas",
        "esses",
        "esta",
        "este",
        "estas",
        "estes",
    }
    keep_short = {"nf", "nfe", "nfs", "nfse", "cfop", "cst"}
    toks = [t.lower() for t in word_re.findall(text or "")]
    out: list[str] = []
    for t in toks:
        if t in keep_short:
            out.append(t)
            continue
        if t in stop:
            continue
        if len(t) < 3:
            continue
        out.append(t)
    return out


def _infer_intent(question: str) -> Intent:
    q = (question or "").strip().lower()
    if any(k in q for k in ("compare", "compar", "diferença", "diferenca", "versus", "vs")):
        return "comparativa"
    if any(k in q for k in ("valide", "validar", "confere", "conferir", "está certo", "esta certo", "verifique")):
        return "validacao"
    if any(k in q for k in ("oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "obrigado", "valeu")):
        return "conversacional"
    # padrão
    if any(k in q for k in ("erro", "bug", "config", "instalar", "docker", "api", "endpoint", "sql")):
        return "tecnica"
    return "informacional"


def _decide_needs_rag(intent: Intent, question: str) -> bool:
    if intent == "conversacional":
        return False
    # Por default, priorizamos KB (RAG-first), pois o objetivo é evitar genérico.
    if settings.agent_force_rag:
        return True
    # Heurística: perguntas curtas “gerais” podem não exigir KB.
    toks = _tokenize_pt(question)
    return len(toks) >= 2


def _is_out_of_domain(question: str) -> bool:
    """Heurística determinística e conservadora para perguntas fora do domínio GeRot/DB."""
    q = (question or "").lower()
    # sinais fortes de domínio interno
    domain_terms = (
        "gerot",
        "azportoex",
        "tabela",
        "banco",
        "sql",
        "manifesto",
        "minuta",
        "coleta",
        "fatura",
        "fornecedor",
        "fornecedores",
        "cliente",
        "cte",
        "nfe",
        "mdfe",
        "tipo_oco",
    )
    if any(t in q for t in domain_terms):
        return False
    # sinais comuns de perguntas gerais
    general_terms = (
        "temperatura",
        "clima",
        "previsão",
        "previsao",
        "chuva",
        "tempo em",
        "cotação",
        "dólar",
        "dolar",
        "bitcoin",
        "notícias",
        "noticias",
        "quem é",
        "o que é",
        "defina",
    )
    return any(t in q for t in general_terms)


async def intent_classifier_node(state: AgentState) -> AgentState:
    intent = _infer_intent(state.get("question", ""))
    needs_rag = _decide_needs_rag(intent, state.get("question", ""))
    # Heurística determinística: só tenta SQL quando a pergunta pede “dados atuais”
    # e há um template whitelisted aplicável.
    question = state.get("question", "") or ""
    ql = question.lower()
    wants_live = any(k in ql for k in ("hoje", "ontem", "agora", "últim", "ultim", "quantos", "qtd", "total", "listar", "recent"))
    template = choose_query_template(question) if (settings.agent_sql_enabled and wants_live) else None
    needs_sql = bool(template)
    ext_template = choose_external_template(question) if bool(getattr(settings, "agent_external_enabled", False)) else None
    needs_external = bool(ext_template)

    # Perguntas fora do domínio: permitir LLM responder de forma geral (com disclaimer),
    # sem forçar RAG nem SQL.
    if not needs_sql and bool(getattr(settings, "agent_allow_out_of_domain_llm", True)) and _is_out_of_domain(question):
        intent = "conversacional"
        needs_rag = False
        # Se houver template externo, preferimos fonte externa antes da LLM.
        if needs_external:
            trace = dict(state.get("trace") or {})
            trace["external_template"] = ext_template
            state = {**state, "trace": trace}  # preserve

    # Para perguntas de dados atuais via SQL, por padrão NÃO fazemos RAG junto
    # (evita “Fontes (trechos recuperados)” e respostas “misturadas”).
    if needs_sql and not bool(getattr(settings, "agent_sql_with_rag", False)):
        needs_rag = False
    st: AgentState = {
        **state,
        "intent": intent,
        "needs_rag": needs_rag,
        "needs_sql": needs_sql,
        "needs_external": needs_external,
        "attempt": int(state.get("attempt") or 0),
        "max_attempts": int(state.get("max_attempts") or settings.agent_max_attempts),
        "refined_query": question,
    }
    trace = dict(state.get("trace") or {})
    trace["intent"] = intent
    trace["needs_rag"] = needs_rag
    trace["needs_sql"] = needs_sql
    trace["sql_template"] = template
    trace["needs_external"] = needs_external
    trace["external_template"] = ext_template
    st["trace"] = trace
    return st


async def sql_agent_node(state: AgentState) -> AgentState:
    """Executa consulta MySQL read-only via templates whitelisted (sem SQL livre)."""
    needs_sql = bool(state.get("needs_sql"))
    question = state.get("question", "") or ""
    trace = dict(state.get("trace") or {})

    if not needs_sql:
        return {**state}

    template = choose_query_template(question)
    if not template:
        trace["sql_exec"] = {"ok": False, "error": "no_template"}
        return {**state, "sql_error": "no_template", "trace": trace}

    t0 = time.perf_counter()
    try:
        res = run_mysql_template(template, question)
        dt_ms = int((time.perf_counter() - t0) * 1000)
        trace["sql_exec"] = {"ok": True, "template": res.query_name, "rows": len(res.rows), "ms": dt_ms}
        return {
            **state,
            "sql_query_name": res.query_name,
            "sql_rows": res.rows,
            "sql_error": "",
            "trace": trace,
        }
    except Exception as e:
        dt_ms = int((time.perf_counter() - t0) * 1000)
        trace["sql_exec"] = {"ok": False, "error": str(e), "ms": dt_ms}
        return {**state, "sql_error": str(e), "trace": trace}


async def external_agent_node(state: AgentState) -> AgentState:
    question = state.get("question", "") or ""
    trace = dict(state.get("trace") or {})

    if not bool(getattr(settings, "agent_external_enabled", False)):
        return {**state}

    tmpl = choose_external_template(question)
    if not tmpl:
        trace["external"] = {"skipped": True, "reason": "no_template"}
        return {**state, "trace": trace}

    try:
        res = await run_external_template(tmpl, question)
        trace["external"] = {"ok": True, "provider": res.provider, "template": res.query_name}
        return {
            **state,
            "external_provider": res.provider,
            "external_query_name": res.query_name,
            "external_data": res.data,
            "external_error": "",
            "trace": trace,
        }
    except Exception as e:
        trace["external"] = {"ok": False, "error": str(e)}
        return {**state, "external_error": str(e), "trace": trace}


async def retriever_agent_node(state: AgentState) -> AgentState:
    attempt = int(state.get("attempt") or 0) + 1
    base_top_k = int(state.get("top_k") or 6)
    # aumento determinístico de recall a cada tentativa
    top_k = min(12, base_top_k + (attempt - 1) * 2)
    query = (state.get("refined_query") or state.get("question") or "").strip()
    chunks = await retrieve_chunks(
        query,
        top_k=top_k,
        metadata_filters=state.get("metadata_filters"),
    )
    trace = dict(state.get("trace") or {})
    trace.setdefault("retrieval_attempts", []).append(
        {
            "attempt": attempt,
            "query": query[:600],
            "top_k": top_k,
            "returned": len(chunks),
            "sample": [
                {
                    "document_id": c.get("document_id"),
                    "chunk_index": c.get("chunk_index"),
                    "score": c.get("score", c.get("distance")),
                }
                for c in (chunks[:3] if chunks else [])
            ],
        }
    )
    return {**state, "attempt": attempt, "chunks": chunks, "trace": trace}


def _coverage(question: str, chunks: list[dict]) -> float:
    q_tokens = list(dict.fromkeys(_tokenize_pt(question)))  # unique, deterministic order
    if not q_tokens:
        return 1.0
    text = "\n".join([(c.get("content") or "") for c in (chunks or [])]).lower()
    hits = sum(1 for t in q_tokens if t in text)
    return float(hits) / float(len(q_tokens))


def _has_bad_distance(chunks: list[dict]) -> bool:
    # pgvector: distance menor é melhor. Se vier distante demais, tratamos como insuficiente.
    if not chunks:
        return True
    # Se não houver campo distance, não aplicamos esse critério.
    distances = [c.get("distance") for c in chunks if c.get("distance") is not None]
    if not distances:
        return False
    try:
        best = float(min(distances))
    except Exception:
        return False
    return best > float(settings.agent_max_distance)


async def validation_agent_node(state: AgentState) -> AgentState:
    needs_rag = bool(state.get("needs_rag"))
    needs_sql = bool(state.get("needs_sql"))
    chunks = state.get("chunks") or []
    sql_rows = state.get("sql_rows") or []
    sql_error = (state.get("sql_error") or "").strip()
    question = state.get("question") or ""

    # Se a pergunta foi classificada para SQL (dados atuais), valida primeiro o SQL.
    # Isso permite modo SQL-only (needs_rag=False) sem cair no guardrail de smalltalk.
    if needs_sql:
        ok = bool(sql_rows) and not sql_error
        reason = "sql_ok" if ok else ("sql_error" if sql_error else "sql_empty")
        trace = dict(state.get("trace") or {})
        trace["validation"] = {"ok": ok, "reason": reason, "needs_sql": True, "sql_rows": len(sql_rows), "sql_error": sql_error or None}
        return {**state, "is_sufficient": ok, "validation_reason": reason, "trace": trace}

    if not needs_rag:
        # “Sem RAG” só é permitido quando explicitamente habilitado e intenção é conversacional.
        ok = bool(settings.agent_allow_general_without_kb) and state.get("intent") == "conversacional"
        reason = "no_rag_allowed" if ok else "no_rag_denied_force_rag"
        trace = dict(state.get("trace") or {})
        trace["validation"] = {"ok": ok, "reason": reason}
        return {**state, "is_sufficient": ok, "validation_reason": reason, "trace": trace}

    # Critérios de suficiência (determinísticos)
    # - Se a pergunta exigiu SQL (dados atuais), OK depende do SQL retornar linhas e não ter erro.
    # - Caso contrário, aplica suficiência do RAG (chunks + cobertura).
    if len(chunks) < int(settings.agent_min_chunks):
        ok = False
        reason = f"insufficient_chunks({len(chunks)}<{settings.agent_min_chunks})"
    elif _has_bad_distance(chunks):
        ok = False
        reason = "insufficient_similarity(distance)"
    else:
        cov = _coverage(question, chunks)
        ok = cov >= float(settings.agent_min_coverage)
        reason = f"coverage={cov:.2f}"

    trace = dict(state.get("trace") or {})
    trace["validation"] = {"ok": ok, "reason": reason, "needs_sql": needs_sql, "sql_rows": len(sql_rows), "sql_error": sql_error or None}

    # Se insuficiente, refina query de forma controlada
    refined = (state.get("refined_query") or question).strip()
    if not ok:
        # adiciona termos de domínio para reduzir respostas genéricas
        extras: list[str] = []
        if state.get("intent") in {"tecnica", "validacao"}:
            extras.append("GeRot")
        if state.get("intent") == "comparativa":
            extras.append("comparação")
        # evita crescimento infinito
        extras_txt = " ".join([e for e in extras if e and e.lower() not in refined.lower()])
        if extras_txt:
            refined = (refined + " " + extras_txt).strip()

    return {
        **state,
        "is_sufficient": ok,
        "validation_reason": reason,
        "refined_query": refined,
        "trace": trace,
    }


async def synthesis_agent_node(state: AgentState) -> AgentState:
    question = (state.get("question") or "").strip()
    chunks = state.get("chunks") or []
    ok = bool(state.get("is_sufficient"))
    needs_rag = bool(state.get("needs_rag"))
    needs_sql = bool(state.get("needs_sql"))
    sql_rows = state.get("sql_rows") or []
    sql_name = (state.get("sql_query_name") or "").strip()
    sql_error = (state.get("sql_error") or "").strip()
    ext_data = state.get("external_data") or {}
    ext_provider = (state.get("external_provider") or "").strip()
    ext_q = (state.get("external_query_name") or "").strip()
    ext_error = (state.get("external_error") or "").strip()

    # Se fonte externa foi usada com sucesso, responder determinísticamente e citar fonte.
    # Colocamos ANTES dos guardrails "no_rag" para não cair em resposta genérica/LLM.
    if ext_data and not ext_error:
        if ext_q == "weather.open_meteo.current_temp":
            place = ext_data.get("place") or {}
            cur = ext_data.get("current") or {}
            units = ext_data.get("current_units") or {}
            temp = cur.get("temperature_2m")
            tu = units.get("temperature_2m") or "°C"
            ttime = cur.get("time")
            loc = ", ".join([x for x in [place.get("name"), place.get("admin1"), place.get("country")] if x])
            draft = (
                f"Temperatura atual em **{loc}**: **{temp}{tu}** (horário: {ttime}).\n\n"
                "Fonte:\n"
                f"- [ext:{ext_provider or 'open-meteo'}]"
            )
            return {**state, "draft_answer": draft}
        if ext_q == "books.openlibrary.summary":
            title = ext_data.get("title") or "Livro"
            desc = (ext_data.get("description") or "").strip()
            authors = ext_data.get("authors") or []
            year = ext_data.get("first_publish_year")
            url = ext_data.get("url")
            parts = [f"**{title}**"]
            if authors:
                parts.append(f"Autores: {', '.join([str(a) for a in authors[:5]])}")
            if year:
                parts.append(f"Primeira publicação (aprox.): {year}")
            if desc:
                parts.append("")
                parts.append(desc)
            if url:
                parts.append("")
                parts.append("Fonte:")
                parts.append(f"- [ext:openlibrary] ({url})")
            else:
                parts.append("")
                parts.append("Fonte:")
                parts.append("- [ext:openlibrary]")
            draft = "\n".join(parts).strip()
            return {**state, "draft_answer": draft}
        # fallback genérico
        draft = f"Dados externos obtidos: {ext_data}\n\nFonte:\n- [ext:{ext_provider or 'external'}]"
        return {**state, "draft_answer": draft}

    if not ok and needs_rag:
        # Proibido “inventar”/generalizar quando a intenção exige KB
        if bool(getattr(settings, "agent_fallback_to_llm_when_no_context", False)):
            prompt = f"""
<SYSTEM>
Você é o assistente do GeRot.

Regras obrigatórias:
- A base interna (KB/DB) não trouxe contexto suficiente para responder com evidência.
- Responda de forma **geral** (conceitual) e claramente **sem afirmar fatos específicos do GeRot/azportoex**.
- NÃO invente dados operacionais internos.
- Se a pergunta pedir dados atuais/específicos, explique quais filtros/IDs você precisa.
- Seja objetivo.
</SYSTEM>

<USER>
{question}
</USER>
""".strip()
            try:
                max_t = min(int(settings.llm_max_tokens_no_context), int(getattr(settings, "agent_general_llm_max_tokens", 128)))
                draft = await llm_client.generate(prompt, max_tokens=max_t)
                draft = (draft or "").strip()
            except Exception:
                draft = ""
            if draft:
                draft = (
                    "Aviso: não encontrei contexto suficiente na base interna para responder com evidência.\n\n"
                    + draft
                )
                return {**state, "draft_answer": draft}

        if needs_sql:
            draft = (
                "Não consegui obter dados atuais via SQL com segurança.\n\n"
                f"Motivo: {sql_error or 'consulta não retornou linhas'}\n\n"
                "O que posso fazer a seguir:\n"
                "- Você pode informar um filtro mais específico (ex.: ID do manifesto/minuta, data exata, status).\n"
                "- Se o problema for conexão, confirme `MYSQL_AZ_HOST` e `MYSQL_AZ_PORT=3306`.\n"
            )
        else:
            draft = (
                "Não encontrei informação suficiente na base interna para responder com segurança.\n\n"
                "O que posso fazer a seguir:\n"
                "- Se você indicar termos mais específicos (nome de tela, rotina, tabela, processo), eu tento uma nova busca.\n"
                "- Se você tiver um documento/link interno, envie para ingestão e eu respondo baseado nele.\n"
            )
        return {**state, "draft_answer": draft}

    if not ok and not needs_rag:
        # Fora do domínio: usar LLM para uma resposta geral (sem alucinar “tempo real”).
        prompt = f"""
<SYSTEM>
Você é um assistente geral.
Regras obrigatórias:
- Você NÃO tem acesso à internet nem a dados em tempo real.
- NÃO invente valores atuais (ex.: temperatura atual). Se o usuário pedir algo atual, explique a limitação e sugira onde obter.
- Seja direto e útil em PT-BR.
</SYSTEM>

<USER>
{question}
</USER>
""".strip()
        try:
            max_t = min(int(settings.llm_max_tokens_no_context), int(getattr(settings, "agent_general_llm_max_tokens", 128)))
            draft = await llm_client.generate(prompt, max_tokens=max_t)
            draft = (draft or "").strip()
        except Exception:
            draft = ""
        if not draft:
            draft = (
                "Não consultei a base interna do GeRot para esta pergunta.\n\n"
                "Não tenho acesso a dados em tempo real (ex.: clima/temperatura atual). "
                "Se você quiser, posso te orientar a checar isso em um serviço de meteorologia e como interpretar o resultado."
            )
        return {**state, "draft_answer": draft}

    # Se SQL foi usado e validado, preferir resposta determinística (evita alucinação do LLM).
    if needs_sql and sql_rows and not sql_error:
        # Heurística por nome do template (determinística).
        # - *count*: primeira linha com chave `total`
        # - *recent*: lista de linhas
        if ".count_" in sql_name or sql_name.endswith(".count") or "count" in sql_name:
            total = None
            try:
                total = (sql_rows[0] or {}).get("total")
            except Exception:
                total = None
            if total is None:
                # fallback: mostra a linha crua
                draft = f"Resultado SQL (contagem): {sql_rows[:1]}\n\nFonte:\n- [sql:{sql_name or 'query'}]"
            else:
                draft = f"Total encontrado: **{total}**.\n\nFonte:\n- [sql:{sql_name or 'query'}]"
            return {**state, "draft_answer": draft}

        # recent/list: renderizar tabela simples (markdown)
        rows = sql_rows[: min(len(sql_rows), 20)]
        if not rows:
            draft = f"Consulta SQL não retornou linhas.\n\nFonte:\n- [sql:{sql_name or 'query'}]"
            return {**state, "draft_answer": draft}
        cols = list(rows[0].keys())
        cols = cols[: min(len(cols), 10)]
        header = "| " + " | ".join(cols) + " |"
        sep = "| " + " | ".join(["---"] * len(cols)) + " |"
        body = []
        for r in rows:
            body.append("| " + " | ".join([str(r.get(c, "")) for c in cols]) + " |")
        draft = "\n".join(
            [
                f"Registros (amostra, n={len(rows)}):",
                header,
                sep,
                *body,
                "",
                "Fonte:",
                f"- [sql:{sql_name or 'query'}]",
            ]
        )
        return {**state, "draft_answer": draft}

    # ok=True: sintetizar com base SOMENTE no contexto recuperado
    context_text = build_context(chunks) or "Não há contexto relevante."
    if sql_rows:
        # Limita para não estourar prompt/payload.
        sample = sql_rows[: min(len(sql_rows), int(settings.agent_sql_max_rows or 50))]
        context_text = (
            context_text
            + "\n\n[SQL_CONTEXT]\n"
            + f"query_name={sql_name or 'unknown'}\n"
            + f"rows_total={len(sql_rows)}\n"
            + f"rows_sample={sample}\n"
            + "[/SQL_CONTEXT]\n"
        )
    prompt = f"""
<SYSTEM>
Você é o assistente oficial do GeRot.

Regras obrigatórias:
- Responda APENAS com base no CONTEXTO fornecido. Não invente dados.
- Se algo não estiver explícito no CONTEXTO, diga claramente que não está na base interna.
- Cite fontes no formato [doc:{{document_id}} chunk:{{chunk_index}}] para cada afirmação relevante.
- Se usar dados do SQL_CONTEXT, cite no formato [sql:{sql_name or 'query'}].
- Seja objetivo: use bullets curtos e evite texto longo.

Formatações especiais (para a UI renderizar):
- Se o usuário pedir "etapas", "modelo", "passo a passo", "melhorar o passo-a-passo" ou "sugerir":
  - Gere:
    1) **Resumo do que a base diz**
    2) **Passo a passo refinado (melhorado)**
    3) **Modelo/Template** (se fizer sentido)
    4) **Checklist** (itens rápidos)
- Se o usuário pedir "mapa mental" ou "quadro" ou "tabela":
  - Primeiro identifique 3–7 temas a partir do contexto e agrupe por tema.
  - Se for "mapa mental": devolva dentro de um bloco de código com linguagem `mindmap`:

```mindmap
Tema
├─ Subtema
│  └─ Item
└─ ...
```

  - Se for "quadro": devolva dentro de um bloco `quadro` com seções por tema:

```quadro
[Faturamento]
- item
- item
[Cobrança]
- item
```

  - Se for "tabela": use tabela em Markdown (| coluna | ... |) com colunas adequadas ao tema.
</SYSTEM>

<CONTEXT>
{context_text}
</CONTEXT>

<USER>
{question}
</USER>
""".strip()
    draft = await llm_client.generate(prompt, max_tokens=int(settings.llm_max_tokens))
    return {**state, "draft_answer": (draft or "").strip()}


async def final_response_node(state: AgentState) -> AgentState:
    # Finalização determinística (não chama LLM).
    answer = (state.get("draft_answer") or "").strip()
    if not answer:
        answer = "Não consegui gerar uma resposta no momento."
    # Guardrail: se houve retrieval e a resposta não tiver nenhuma citação, adiciona um rodapé de fontes.
    chunks = state.get("chunks") or []
    # Se a resposta já tem [sql:*], NÃO anexamos fontes de RAG automaticamente.
    if bool(state.get("is_sufficient")) and chunks and "[doc:" not in answer and "[sql:" not in answer:
        src_lines = []
        for c in chunks[:3]:
            src_lines.append(f"- [doc:{c.get('document_id')} chunk:{c.get('chunk_index')}]")
        answer = answer.rstrip() + "\n\nFontes (trechos recuperados):\n" + "\n".join(src_lines)
    # Guardrail: se houve SQL e a resposta não citou, adiciona um rodapé.
    sql_rows = state.get("sql_rows") or []
    if sql_rows and "[sql:" not in answer:
        qn = (state.get("sql_query_name") or "query").strip()
        answer = answer.rstrip() + f"\n\nFonte (SQL):\n- [sql:{qn}]"
    return {**state, "final_answer": answer}


def _route_after_intent(state: AgentState) -> str:
    return "retriever" if state.get("needs_rag") else "validation"


def _route_after_validation(state: AgentState) -> str:
    ok = bool(state.get("is_sufficient"))
    if ok:
        return "synthesis"
    # loop controlado
    attempt = int(state.get("attempt") or 0)
    max_attempts = int(state.get("max_attempts") or settings.agent_max_attempts)
    if attempt < max_attempts and bool(state.get("needs_rag")):
        return "retriever"
    # Sem contexto interno suficiente: tenta fonte externa (se habilitado) antes de sintetizar.
    if bool(getattr(settings, "agent_external_enabled", False)):
        return "external"
    return "synthesis"


@dataclass(frozen=True)
class AgentResult:
    answer: str
    chunks: list[dict]
    intent: Intent
    used_rag: bool
    attempts: int
    latency_ms: int
    trace: Dict[str, Any]


def build_agent_graph():
    graph = StateGraph(AgentState)
    graph.add_node("intent", intent_classifier_node)
    graph.add_node("sql", sql_agent_node)
    graph.add_node("external", external_agent_node)
    graph.add_node("retriever", retriever_agent_node)
    graph.add_node("validation", validation_agent_node)
    graph.add_node("synthesis", synthesis_agent_node)
    graph.add_node("final", final_response_node)

    graph.set_entry_point("intent")
    def _route_after_intent_with_sql(state: AgentState) -> str:
        if state.get("needs_sql"):
            return "sql"
        if state.get("needs_external"):
            return "external"
        return _route_after_intent(state)

    graph.add_conditional_edges(
        "intent",
        _route_after_intent_with_sql,
        {"sql": "sql", "external": "external", "retriever": "retriever", "validation": "validation"},
    )
    # Após SQL, segue para RAG (se habilitado) para contexto estrutural + validação.
    def _route_after_sql(state: AgentState) -> str:
        return "retriever" if state.get("needs_rag") else "validation"

    graph.add_conditional_edges("sql", _route_after_sql, {"retriever": "retriever", "validation": "validation"})
    graph.add_edge("retriever", "validation")
    graph.add_conditional_edges(
        "validation",
        _route_after_validation,
        {"retriever": "retriever", "external": "external", "synthesis": "synthesis"},
    )
    # Fonte externa sempre segue para síntese determinística (se houver dados).
    graph.add_edge("external", "synthesis")
    graph.add_edge("synthesis", "final")
    graph.add_edge("final", END)
    return graph.compile()


_AGENT_APP = None


async def run_agent(
    question: str,
    *,
    top_k: int = 6,
    metadata_filters: Optional[Dict[str, Any]] = None,
    max_attempts: Optional[int] = None,
) -> AgentResult:
    global _AGENT_APP
    if _AGENT_APP is None:
        _AGENT_APP = build_agent_graph()

    t0 = time.perf_counter()
    init: AgentState = {
        "question": question,
        "top_k": int(top_k or 6),
        "metadata_filters": metadata_filters,
        "max_attempts": int(max_attempts or settings.agent_max_attempts),
        "trace": {
            "ts": int(time.time()),
            "top_k": int(top_k or 6),
            "metadata_filters": metadata_filters,
        },
    }
    out: AgentState = await _AGENT_APP.ainvoke(init)  # type: ignore[assignment]
    latency_ms = int((time.perf_counter() - t0) * 1000)

    trace = dict(out.get("trace") or {})
    trace["latency_ms"] = latency_ms
    _AGENT_LAST.append(trace)

    return AgentResult(
        answer=str(out.get("final_answer") or out.get("draft_answer") or ""),
        chunks=list(out.get("chunks") or []),
        intent=out.get("intent") or "informacional",
        used_rag=bool(out.get("needs_rag")),
        attempts=int(out.get("attempt") or 0),
        latency_ms=latency_ms,
        trace=trace,
    )


