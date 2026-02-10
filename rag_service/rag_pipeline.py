"""Funções de alto nível para executar o RAG."""
from __future__ import annotations

import asyncio
import time as _time
import time
from collections import deque
import re
from textwrap import shorten
from typing import Any, Deque, Dict

from .config import settings
from .embedding_client import embedding_client
from .kb_json import search as search_json_kb
from .llm_client import llm_client
from .retriever import retrieve_chunks

PROMPT_TEMPLATE_WITH_CONTEXT = """
<SYSTEM>
Você é o assistente oficial do GeRot.

Regras:
- Se houver contexto relevante, responda priorizando esse contexto e cite as fontes como [doc:{{document_id}} chunk:{{chunk_index}}].
- Se NÃO houver contexto suficiente, responda com conhecimento geral (sem inventar dados específicos do GeRot) e deixe claro que a informação não estava na base interna.
- Seja objetivo: use bullets curtos e evite texto longo.
- Se o usuário pedir "etapas", "modelo", "passo a passo", "melhorar o passo-a-passo" ou "sugerir", então:
  - Gere uma resposta interpretativa baseada no contexto, com:
    1) **Resumo do que a base diz**
    2) **Passo a passo refinado (melhorado)**
    3) **Modelo/Template** (se fizer sentido)
    4) **Checklist** (itens rápidos)
- Se o usuário pedir "mapa mental" ou "tabela/quadro", organize SEMPRE por **tema**:
  - Primeiro identifique 3–7 temas a partir do contexto (use categorias, títulos e palavras-chave do conteúdo).
  - Depois estruture o conteúdo agrupado por tema.
  - Se for "mapa mental": devolva o mapa dentro de um bloco de código com linguagem `mindmap` (para a UI renderizar bonito), assim:

```mindmap
Tema
├─ Subtema
│  └─ Item
└─ ...
```

  - Se for "quadro": devolva dentro de um bloco `quadro` com seções por tema (para UI renderizar como colunas/cards), assim:

```quadro
[Faturamento]
- item
- item
[Cobrança]
- item
```

  - Se for "tabela": use tabela em Markdown (| coluna | ... |) com colunas adequadas ao tema (ex.: Etapa / Objetivo / Como / Dono / Observações).
</SYSTEM>

<CONTEXT>
{context}
</CONTEXT>

<USER>
{question}
</USER>
""".strip()

PROMPT_TEMPLATE_NO_CONTEXT = """
<SYSTEM>
Você é o assistente oficial do GeRot.

Regras:
- NÃO cite fontes do tipo [doc:...] quando não houver contexto.
- Responda com conhecimento geral (sem inventar dados específicos do GeRot) e deixe claro que a informação não estava na base interna.
</SYSTEM>

<USER>
{question}
</USER>
""".strip()

_RAG_LAST: Deque[Dict[str, Any]] = deque(maxlen=50)

_SYNTHESIS_KEYWORDS = {
    "etapa", "etapas",
    "passo a passo", "passo-a-passo", "passo a passo refinado", "melhorar", "melhorado",
    "modelo", "modelos", "template", "checklist",
    "mapa mental", "mapa", "mindmap", "quadro", "tabela", "tabelar",
    "sugerir", "sugest", "refinar", "interpret", "estratégia", "estrategia",
}


def _wants_synthesis(question: str) -> bool:
    q = (question or "").lower()
    return any(k in q for k in _SYNTHESIS_KEYWORDS)


def get_last_rag_events(limit: int = 20) -> list[Dict[str, Any]]:
    limit = max(1, min(int(limit or 20), 50))
    return list(_RAG_LAST)[-limit:]


def build_context(chunks: list[dict]) -> str:
    lines: list[str] = []
    # Limitar o contexto para não explodir o prompt e causar timeout no Ollama/túnel.
    # Heurística simples: 1 token ~ 4 chars.
    max_chars = max(500, int(settings.max_context_tokens) * 4)
    used = 0
    for idx, chunk in enumerate(chunks, start=1):
        meta = chunk.get("metadata") or {}
        header = meta.get("heading") or meta.get("section") or meta.get("category")
        header = header or short_fragment(chunk["content"])
        content = (chunk.get("content") or "").strip()
        # Trunca o conteúdo para caber no orçamento de contexto
        remaining = max_chars - used
        if remaining <= 0:
            break
        # Reservar um pouco para o cabeçalho
        header_block = f"[{idx}] Fonte: {header} (doc:{chunk['document_id']} chunk:{chunk['chunk_index']})\n"
        remaining_after_header = max(0, remaining - len(header_block))
        if remaining_after_header <= 0:
            break
        if len(content) > remaining_after_header:
            content = content[:remaining_after_header].rstrip() + "\n...[truncado]..."
        block = header_block + content
        lines.append(block)
        used += len(block) + 2
    return "\n\n".join(lines)


def short_fragment(text: str, width: int = 60) -> str:
    return shorten(text.replace("\n", " "), width=width, placeholder="...")


_URL_FIX_RE = re.compile(r"\b(https?):\s*//", re.IGNORECASE)


def _normalize_urls(text: str) -> str:
    """
    Corrige URLs quebradas vindas da base (ex.: 'https:\\n//dominio' ou 'https: //dominio').
    """
    if not text:
        return text
    return _URL_FIX_RE.sub(lambda m: f"{m.group(1).lower()}://", text)


async def run_rag(
    question: str,
    *,
    top_k: int = 6,
    metadata_filters: Dict[str, Any] | None = None,
) -> tuple[str, list[dict], int]:
    start = time.perf_counter()
    trace: Dict[str, Any] = {
        "ts": int(_time.time()),
        "question_preview": (question or "")[:2000],
        "top_k": top_k,
        "use_json_kb": settings.use_json_kb,
        "fast_mode": settings.fast_mode,
    }

    # Fonte de conhecimento:
    # - JSON local (data/knowledge_dump.json) quando RAG_USE_JSON_KB=true OU DATABASE_URL ausente
    # - Postgres/pgvector caso contrário
    # Recuperação unificada (KB JSON ou pgvector), com filtros de metadata.
    chunks = await retrieve_chunks(
        question,
        top_k=min(top_k, settings.similarity_top_k),
        metadata_filters=metadata_filters,
    )

    has_context = bool(chunks)
    trace["has_context"] = has_context
    trace["chunks"] = [
        {
            "document_id": c.get("document_id"),
            "chunk_index": c.get("chunk_index"),
            "score": c.get("score", c.get("distance")),
        }
        for c in (chunks[:5] if chunks else [])
    ]
    context_text = build_context(chunks) or "Não há contexto relevante."

    # KB JSON + contexto: por padrão, responder de forma extrativa (sem LLM) para evitar timeout no túnel/Railway.
    # Se a pergunta pede "interpretação" (etapas/modelos/passo-a-passo), usamos LLM com contexto.
    if settings.use_json_kb and has_context and (settings.fast_mode or not settings.json_llm_with_context) and not _wants_synthesis(question):
        max_chars = max(1000, int(getattr(settings, "json_extractive_max_chars", 12000)))
        parts: list[str] = []
        used = 0
        for idx, ch in enumerate(chunks, start=1):
            doc = ch.get("document_id")
            cidx = ch.get("chunk_index")
            content = _normalize_urls((ch.get("content") or "").strip())
            if not content:
                continue
            header = f"[Trecho {idx}] doc:{doc} chunk:{cidx}\n"
            block = header + content
            # respeita o limite total
            remaining = max_chars - used
            if remaining <= 0:
                break
            if len(block) > remaining:
                block = block[:remaining].rstrip() + "\n...[truncado]..."
            parts.append(block)
            used += len(block) + 2
            if used >= max_chars:
                break

        answer = "Encontrei os seguintes trechos na base interna do GeRot:\n\n" + "\n\n".join(parts)
        latency_ms = int((time.perf_counter() - start) * 1000)
        trace["llm_called"] = False
        trace["result"] = "json_context_extractive"
        trace["latency_ms"] = latency_ms
        _RAG_LAST.append(trace)
        return answer, chunks, latency_ms

    # Modo rápido: evita chamar o LLM quando HÁ contexto (reduz muito a latência),
    # mas ainda permite usar Llama quando NÃO houver contexto (resposta geral).
    if settings.fast_mode and has_context:
        best = chunks[0]
        answer = (
            "Encontrei o seguinte trecho na base interna do GeRot:\n\n"
            + best["content"].strip()
            + f"\n\n[Fonte] doc:{best.get('document_id')} chunk:{best.get('chunk_index')}"
        )
        latency_ms = int((time.perf_counter() - start) * 1000)
        trace["llm_called"] = False
        trace["result"] = "fast_mode_context"
        trace["latency_ms"] = latency_ms
        if not settings.use_json_kb:
            from .db import log_query  # lazy

            log_query(question, answer, chunks, latency_ms)
        _RAG_LAST.append(trace)
        return answer, chunks, latency_ms

    # Quando não há contexto, pedir resposta curta para reduzir latência e evitar timeout do webapp.
    if not has_context:
        question = (
            question.strip()
            + "\n\nResponda em português, em até 4 bullets curtos, com frases completas e ponto final."
        )
        trace["no_context_shortening"] = True

    if has_context:
        prompt = PROMPT_TEMPLATE_WITH_CONTEXT.format(context=context_text, question=question)
    else:
        prompt = PROMPT_TEMPLATE_NO_CONTEXT.format(question=question)
    max_tokens = settings.llm_max_tokens if has_context else settings.llm_max_tokens_no_context
    try:
        answer = await asyncio.wait_for(
            llm_client.generate(prompt, max_tokens=max_tokens),
            timeout=float(settings.llm_request_timeout_s),
        )
        trace["llm_called"] = True
        trace["llm_status"] = "ok"
    except asyncio.TimeoutError:
        # Evita 524/timeout em chamadas via Cloudflare Tunnel quando o Ollama está frio/lento.
        if has_context:
            best = chunks[0]
            answer = (
                "O Llama local demorou demais para responder. Vou retornar o trecho mais relevante da base interna:\n\n"
                + best["content"].strip()
                + f"\n\n[Fonte] doc:{best.get('document_id')} chunk:{best.get('chunk_index')}"
            )
        else:
            answer = (
                "O Llama local demorou demais para responder via túnel. "
                "Tente novamente ou reduza RAG_LLM_MAX_TOKENS_NO_CONTEXT, "
                "ou aumente RAG_LLM_REQUEST_TIMEOUT_S (atenção ao limite do Cloudflare)."
            )
        trace["llm_called"] = True
        trace["llm_status"] = "timeout"
    except Exception as exc:
        # Fallback local (sem LLM externa): devolve o melhor trecho, para não quebrar o agente
        # quando o Ollama estiver sem modelo baixado.
        if has_context:
            best = chunks[0]
            answer = (
                "No momento não consegui gerar com o Llama local, então vou retornar o trecho mais relevante da base interna:\n\n"
                + best["content"].strip()
                + f"\n\n[Fonte] doc:{best.get('document_id')} chunk:{best.get('chunk_index')}"
            )
        else:
            answer = (
                "No momento não consegui gerar com o Llama local (Ollama) e não encontrei contexto suficiente na base interna.\n\n"
                "Checklist rápido:\n"
                "- Confirme que o Ollama está rodando (ex.: app aberto ou `ollama serve`).\n"
                "- Confirme que o modelo está instalado (`ollama pull " + settings.llm_model + "`).\n"
                "- Tente novamente (a 1ª geração costuma ser mais lenta/instável quando o modelo está frio)."
            )
        trace["llm_called"] = True
        trace["llm_status"] = f"error:{type(exc).__name__}"

    latency_ms = int((time.perf_counter() - start) * 1000)
    trace["latency_ms"] = latency_ms
    if not settings.use_json_kb:
        from .db import log_query  # lazy

        log_query(question, answer, chunks, latency_ms)
    _RAG_LAST.append(trace)
    return answer, chunks, latency_ms
