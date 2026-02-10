"""Injeta data/knowledge_dump.json na base vetorial do rag_service.

Uso:
  python scripts/ingest_knowledge_dump_to_rag.py

Pré-requisitos:
- DATABASE_URL configurada (ex.: Supabase/Postgres com pgvector)
- Embeddings configurados (ex.: Ollama em localhost:11434)

Variáveis úteis:
- KNOWLEDGE_DUMP_PATH: caminho do knowledge_dump.json
- RAG_EMBEDDING_PROVIDER=ollama
- RAG_EMBEDDING_URL=http://localhost:11434/api/embeddings
- RAG_EMBEDDING_MODEL=nomic-embed-text
- RAG_EMBEDDING_DIM=1536 (será pad/truncate se o modelo não bater)
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

# Garantir import do pacote local `rag_service` mesmo quando o script é executado
# via .bat/atalho e o cwd/sys.path não incluem a raiz do projeto.
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from rag_service.chunker import chunk_text
from rag_service.config import settings
from rag_service.db import insert_chunk, upsert_document
from rag_service.embedding_client import embedding_client


DEFAULT_KNOWLEDGE_PATH = BASE_DIR / "data" / "knowledge_dump.json"


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def _safe_str(value) -> str:
    if value is None:
        return ""
    return str(value)


async def ingest_knowledge_dump(path: Path) -> dict:
    settings.ensure_database()

    if not path.exists():
        raise SystemExit(f"Arquivo não encontrado: {path}")

    with open(path, "r", encoding="utf-8") as fp:
        items = json.load(fp)

    if not isinstance(items, list):
        raise SystemExit("knowledge_dump.json deve ser uma lista de itens")

    total_items = len(items)
    ingested_docs = 0
    ingested_chunks = 0
    failed_items = 0

    for idx, item in enumerate(items, start=1):
        try:
            if not isinstance(item, dict):
                failed_items += 1
                continue

            item_id = _safe_str(item.get("id")) or f"item-{idx}"
            question = _safe_str(item.get("question")).strip()
            answer = _safe_str(item.get("answer")).strip()

            if not (question or answer):
                failed_items += 1
                continue

            text = f"Pergunta: {question}\n\nResposta:\n{answer}".strip()
            checksum = _sha256(text)

            metadata = {
                "kind": "knowledge_dump",
                "knowledge_id": item.get("id"),
                "question": question,
                "category": item.get("category"),
                "source": item.get("source"),
                "synced_at": item.get("synced_at"),
                # Guardar o item original em JSON (fonte de verdade no banco)
                "raw_item": item,
            }

            # Um documento por item (facilita rastrear fontes)
            source_name = f"knowledge_dump::{item_id}"
            doc_id = upsert_document(
                source_name=source_name,
                source_type="knowledge_dump",
                checksum=checksum,
                metadata=metadata,
            )

            chunks = chunk_text(text)
            if not chunks:
                failed_items += 1
                continue

            for chunk in chunks:
                try:
                    emb = await embedding_client.embed(chunk["text"])
                except Exception:
                    # Alguns conteúdos (ex.: tabelas grandes/markdown) podem causar erro 500 no Ollama.
                    # Fallback: truncar o texto para o embedding (mantém ingestão funcionando).
                    truncated = (chunk["text"] or "")[:2000]
                    emb = await embedding_client.embed(truncated)
                insert_chunk(
                    document_id=doc_id,
                    chunk_index=int(chunk["index"]),
                    content=chunk["text"],
                    tokens=int(chunk["tokens"]),
                    embedding=emb,
                )
                ingested_chunks += 1

            ingested_docs += 1

            if idx % 25 == 0:
                print(f"[{idx}/{total_items}] docs={ingested_docs} chunks={ingested_chunks} falhas={failed_items}")

        except Exception as exc:
            failed_items += 1
            print(f"[ERRO] Item {idx}: {exc}")

    return {
        "items_total": total_items,
        "docs_ingested": ingested_docs,
        "chunks_ingested": ingested_chunks,
        "items_failed": failed_items,
        "knowledge_path": str(path),
        "embedding_provider": settings.embedding_provider,
        "embedding_model": settings.embedding_model,
        "embedding_dim": settings.embedding_dim,
    }


def main() -> None:
    raw_path = os.getenv("KNOWLEDGE_DUMP_PATH")
    path = Path(raw_path) if raw_path else DEFAULT_KNOWLEDGE_PATH
    summary = asyncio.run(ingest_knowledge_dump(path))
    print("\nOK: Ingestão concluída")
    for k, v in summary.items():
        print(f"- {k}: {v}")


if __name__ == "__main__":
    main()
