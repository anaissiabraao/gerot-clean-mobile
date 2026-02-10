"""Worker simplificado para processar ai_ingestion_jobs."""
from __future__ import annotations

import hashlib
from pathlib import Path

import httpx
from docling_core.types.io import DocumentStream
from docling.document_converter import DocumentConverter

from .chunker import chunk_text
from .config import settings
from .db import insert_chunk, update_ingestion_job, upsert_document
from .embedding_client import embedding_client

POLL_INTERVAL_SECONDS = 5


async def process_job(job: dict) -> None:
    job_id = job["id"]
    payload = job.get("payload") or {}
    text = payload.get("text") or payload.get("content")
    source_name = job.get("source_name") or payload.get("source_name") or "unknown"

    # Caso especial: job aponta para arquivo remoto (PDF/DOCX) -> baixa e converte via Docling
    if not text and payload.get("file_url"):
        file_url = payload["file_url"]
        try:
            async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
                resp = await client.get(file_url)
                resp.raise_for_status()
                file_bytes = resp.content

            filename = payload.get("metadata", {}).get("filename") or payload.get("filename") or "documento"
            converter = DocumentConverter()
            from io import BytesIO

            doc_stream = DocumentStream(name=filename, stream=BytesIO(file_bytes))
            conv_result = converter.convert(doc_stream)
            doc_dict = conv_result.document.export_to_dict()

            # texto para indexação (best-effort): concatena campos "text"
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
            payload_meta = payload.get("metadata") or {}
            payload_meta = {**payload_meta, "docling": doc_dict, "file_url": file_url, "filename": filename}
            payload["metadata"] = payload_meta
            payload["source_type"] = "docling"
        except Exception as exc:
            update_ingestion_job(job_id, status="failed", error=f"Falha Docling: {exc}")
            return

    if not text:
        update_ingestion_job(job_id, status="failed", error="Payload sem texto")
        return

    checksum = hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()
    doc_id = upsert_document(
        source_name=source_name,
        source_type=payload.get("source_type", "manual"),
        checksum=checksum,
        metadata=payload.get("metadata"),
    )

    chunks = chunk_text(text)
    stats = {"chunks": len(chunks)}

    for chunk in chunks:
        embedding = await embedding_client.embed(chunk["text"])
        insert_chunk(
            document_id=doc_id,
            chunk_index=chunk["index"],
            content=chunk["text"],
            tokens=chunk["tokens"],
            embedding=embedding,
        )

    update_ingestion_job(job_id, status="completed", stats=stats)


def load_next_job() -> dict | None:
    import psycopg2.extras

    from .db import get_conn, put_conn

    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT * FROM ai_ingestion_jobs
            WHERE status IN ('pending', 'queued')
            ORDER BY created_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED
            """
        )
        job = cursor.fetchone()
        if not job:
            return None
        cursor.execute(
            "UPDATE ai_ingestion_jobs SET status = 'processing' WHERE id = %s",
            (job["id"],),
        )
        conn.commit()
        return job
    finally:
        cursor.close()
        put_conn(conn)


async def run_worker() -> None:
    import asyncio

    while True:
        job = load_next_job()
        if job:
            try:
                await process_job(job)
            except Exception as exc:
                update_ingestion_job(job["id"], status="failed", error=str(exc))
        else:
            await asyncio.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    import asyncio

    asyncio.run(run_worker())
