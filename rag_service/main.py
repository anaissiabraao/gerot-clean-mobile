"""biblioteca infalível para entregar com base no RAG (heuheueh agora só ajustar os requests)"""
from __future__ import annotations

import logging
import hashlib
import json
import os
import threading
from datetime import datetime
from typing import Optional

from typing_extensions import Annotated

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, UploadFile, status
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from .config import settings
from .db import create_ingestion_job
from .chunker import chunk_text
from .embedding_client import get_last_embedding_events
from .llm_client import get_last_ollama_events
from .kb_json import invalidate_cache
from .agent_graph import get_last_agent_events, run_agent
from .rag_pipeline import get_last_rag_events, run_rag
from .schemas import (
    AgentQARequest,
    AgentQAResponse,
    IngestFileURLRequest,
    IngestRequest,
    IngestResponse,
    QARequest,
    QAResponse,
    SourceChunk,
)

logger = logging.getLogger("rag_service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="GeRot RAG Service", version="1.0.0")
Instrumentator().instrument(app).expose(app, include_in_schema=False)

_KB_WRITE_LOCK = threading.Lock()


async def verify_api_key(
    request: Request,
    x_api_key: Annotated[Optional[str], Header(alias="x-api-key")] = None,
) -> None:
    expected = settings.api_key
    # Conveniência para DEV local: permite acessar endpoints protegidos via localhost
    # sem precisar expor/ler o segredo do .env no editor.
    client_host = getattr(getattr(request, "client", None), "host", None)
    if client_host in {"127.0.0.1", "::1", "localhost"}:
        return
    if expected and x_api_key != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")


@app.post("/v1/qa", response_model=QAResponse)
async def question_answer(payload: QARequest, _: Annotated[None, Depends(verify_api_key)]):
    answer, chunks, latency_ms = await run_rag(
        payload.question,
        top_k=payload.top_k,
        metadata_filters=payload.metadata_filters,
    )
    response_chunks = [
        SourceChunk(
            document_id=str(chunk["document_id"]),
            chunk_index=chunk["chunk_index"],
            # Em Postgres/pgvector usamos "distance". Em KB JSON usamos "score".
            score=float(chunk.get("score", chunk.get("distance", 0.0))),
            snippet=chunk["content"],
            metadata=chunk.get("metadata"),
        )
        for chunk in chunks
    ]
    return QAResponse(
        answer=answer,
        sources=response_chunks,
        model=settings.llm_model,
        latency_ms=latency_ms,
    )


@app.post("/v1/agent/qa", response_model=AgentQAResponse)
async def agent_question_answer(payload: AgentQARequest, _: Annotated[None, Depends(verify_api_key)]):
    """
    Endpoint agentic (LangGraph): fluxo não-linear com validação obrigatória e loop controlado.
    Mantém /v1/qa intacto para comparação/regressão.
    """
    result = await run_agent(
        payload.question,
        top_k=payload.top_k,
        metadata_filters=payload.metadata_filters,
        max_attempts=payload.max_attempts,
    )
    response_chunks = [
        SourceChunk(
            document_id=str(chunk["document_id"]),
            chunk_index=chunk["chunk_index"],
            score=float(chunk.get("score", chunk.get("distance", 0.0))),
            snippet=chunk["content"],
            metadata=chunk.get("metadata"),
        )
        for chunk in (result.chunks or [])
    ]
    return AgentQAResponse(
        answer=result.answer,
        sources=response_chunks,
        intent=str(result.intent),
        used_rag=bool(result.used_rag),
        attempts=int(result.attempts),
        model=settings.llm_model,
        latency_ms=int(result.latency_ms),
        trace=result.trace,
    )


@app.post("/v1/ingest", response_model=IngestResponse)
async def ingest_document(payload: IngestRequest, _: Annotated[None, Depends(verify_api_key)]):
    # Enfileira job com payload completo (o worker consome "text")
    job_id = create_ingestion_job(
        payload.source_name,
        payload={
            "source_name": payload.source_name,
            "source_type": payload.content_type,
            "metadata": payload.metadata,
            "text": payload.content,
        },
    )
    return IngestResponse(job_id=job_id, status="queued")


@app.post("/v1/ingest-file-url", response_model=IngestResponse)
async def ingest_file_url(payload: IngestFileURLRequest, _: Annotated[None, Depends(verify_api_key)]):
    """
    Enfileira um job que referencia um arquivo (PDF/DOCX) por URL.

    O worker local baixa o arquivo, converte via Docling e salva no banco (ai_documents / ai_document_chunks).
    """
    job_id = create_ingestion_job(
        payload.source_name,
        payload={
            "source_name": payload.source_name,
            "source_type": "file_url",
            "metadata": payload.metadata or {},
            "file_url": payload.file_url,
        },
    )
    return IngestResponse(job_id=job_id, status="queued")


@app.post("/v1/ingest-file")
async def ingest_file(
    file: UploadFile = File(...),
    source_name: str = Form("upload"),
    category: str = Form("Uploads"),
    _: Annotated[None, Depends(verify_api_key)] = None,
):
    """
    Upload direto (multipart/form-data) para ingestão via Docling.

    - Se `RAG_USE_JSON_KB=true`: extrai texto com Docling e escreve no `knowledge_dump.json`.
    - Se `RAG_USE_JSON_KB=false`: recomenda-se usar `/v1/ingest-file-url` (worker + banco).
    """
    filename = (file.filename or "documento").strip() or "documento"
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Arquivo vazio")

    # Converter:
    # - .txt/.md: usa texto puro (Docling normalmente não aceita)
    # - demais: Docling (PDF/DOCX/HTML etc.)
    ext = os.path.splitext(filename.lower())[1]
    if ext in {".txt", ".md", ".markdown"}:
        try:
            text = data.decode("utf-8", errors="ignore").strip()
        except Exception:
            text = ""
    else:
        # Converter via Docling (best-effort)
        try:
            # Import local para evitar warnings de lint quando a lib não está no ambiente do editor
            from docling_core.types.io import DocumentStream  # type: ignore
            from docling.document_converter import DocumentConverter  # type: ignore
            from io import BytesIO

            converter = DocumentConverter()
            doc_stream = DocumentStream(name=filename, stream=BytesIO(data))
            conv_result = converter.convert(doc_stream)
            doc_dict = conv_result.document.export_to_dict()

            def _collect_text(obj) -> list[str]:
                out: list[str] = []
                if isinstance(obj, dict):
                    for k, v in obj.items():
                        if k == "text" and isinstance(v, str) and v.strip():
                            out.append(v.strip())
                        out.extend(_collect_text(v))
                elif isinstance(obj, list):
                    for it in obj:
                        out.extend(_collect_text(it))
                return out

            pieces = _collect_text(doc_dict)
            text = "\n".join(pieces).strip()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Falha ao converter com Docling: {exc}") from exc

    if not text:
        raise HTTPException(status_code=400, detail="Não consegui extrair texto do arquivo (Docling retornou vazio)")

    if not settings.use_json_kb:
        raise HTTPException(
            status_code=400,
            detail="Este serviço está configurado para Postgres/pgvector. Use /v1/ingest-file-url (job) ou habilite RAG_USE_JSON_KB=true.",
        )

    # Quebrar em chunks e salvar como itens no knowledge_dump.json
    chunks = chunk_text(text, max_tokens=520, overlap=80)
    if not chunks:
        raise HTTPException(status_code=400, detail="Texto extraído vazio após normalização")

    kb_path = settings.kb_path
    os.makedirs(os.path.dirname(kb_path), exist_ok=True)
    sha = hashlib.sha256(data).hexdigest()[:16]
    now = datetime.utcnow().isoformat()

    new_items = []
    total = len(chunks)
    for ch in chunks:
        idx = int(ch["index"])
        new_items.append(
            {
                "id": f"upload::{sha}-{idx}",
                "question": f"Conteúdo do documento '{filename}' (parte {idx+1}/{total})",
                "answer": ch["text"],
                "category": category,
                "synced_at": now,
                "source": filename if filename else source_name,
            }
        )

    with _KB_WRITE_LOCK:
        existing: list[dict] = []
        if os.path.exists(kb_path):
            try:
                with open(kb_path, "r", encoding="utf-8") as fp:
                    existing = json.load(fp) or []
            except Exception:
                existing = []
        if not isinstance(existing, list):
            existing = []

        # Evita duplicar o mesmo upload (id determinístico)
        existing_ids = {str(it.get("id")) for it in existing if isinstance(it, dict)}
        to_add = [it for it in new_items if it["id"] not in existing_ids]
        existing.extend(to_add)

        with open(kb_path, "w", encoding="utf-8") as fp:
            json.dump(existing, fp, ensure_ascii=False, indent=2)

    invalidate_cache()
    return {
        "status": "ok",
        "mode": "json_kb",
        "kb_path": kb_path,
        "added_items": len(to_add),
        "total_items": len(existing),
        "filename": filename,
        "source_name": source_name,
    }


@app.get("/health")
async def healthcheck():
    return {"status": "ok", "model": settings.llm_model}


@app.get("/debug/info")
async def debug_info():
    return {
        "main_file": __file__,
        "use_json_kb": settings.use_json_kb,
        "kb_path": settings.kb_path,
        "fast_mode": settings.fast_mode,
        "json_llm_with_context": getattr(settings, "json_llm_with_context", None),
        "json_extractive_max_chars": getattr(settings, "json_extractive_max_chars", None),
        "llm_provider": settings.llm_provider,
        "llm_model": settings.llm_model,
        "llm_url": settings.llm_service_url,
        "llm_request_timeout_s": getattr(settings, "llm_request_timeout_s", None),
        "ollama_keep_alive": getattr(settings, "ollama_keep_alive", None),
        "ollama_num_ctx": getattr(settings, "ollama_num_ctx", None),
        "embedding_provider": settings.embedding_provider,
        "embedding_model": settings.embedding_model,
        "embedding_url": settings.embedding_service_url,
    }


@app.get("/debug/ollama/last")
async def debug_ollama_last(limit: int = 20):
    """
    Retorna as últimas chamadas ao Ollama vistas pelo RAG (não são logs do servidor do Ollama),
    mas ajudam a entender latência, payload e métricas de geração.
    """
    return {
        "llm_events": get_last_ollama_events(limit),
        "embedding_events": get_last_embedding_events(limit),
    }


@app.get("/debug/rag/last")
async def debug_rag_last(limit: int = 20):
    """Últimas execuções do pipeline RAG (decisão de contexto, chunks, timeout etc.)."""
    return {"rag_events": get_last_rag_events(limit)}


@app.get("/debug/agent/last")
async def debug_agent_last(limit: int = 20):
    """Últimas execuções do agente (LangGraph): intenção, loop de retrieval, validação e latência."""
    return {"agent_events": get_last_agent_events(limit)}


@app.exception_handler(Exception)
async def generic_exception_handler(_, exc: Exception):
    logger.exception("Erro não tratado no serviço RAG: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Erro interno no serviço RAG", "error": str(exc)},
    )


def get_app() -> FastAPI:
    return app


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("rag_service.main:app", host="0.0.0.0", port=8000, reload=False)
