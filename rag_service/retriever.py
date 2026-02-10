"""Retriever unificado (KB JSON ou Postgres/pgvector) com suporte a metadata_filters.

Objetivo:
- Reaproveitar integralmente o knowledge existente (sem alterar o KB).
- Oferecer uma interface única para o agente (LangGraph) e para o pipeline RAG clássico.
"""

from __future__ import annotations

from typing import Any

from .config import settings
from .embedding_client import embedding_client
from .kb_json import search as search_json_kb


async def retrieve_chunks(
    query: str,
    *,
    top_k: int = 6,
    metadata_filters: dict[str, Any] | None = None,
) -> list[dict]:
    """Retorna uma lista de chunks relevantes (dicts compatíveis com o pipeline atual)."""
    top_k = max(1, min(int(top_k or 6), int(settings.similarity_top_k)))

    if settings.use_json_kb:
        return search_json_kb(
            settings.kb_path,
            query,
            top_k=top_k,
            metadata_filters=metadata_filters,
        )

    # Postgres/pgvector
    from .db import fetch_relevant_chunks  # lazy import (evita exigir DB quando não usado)

    embedding = await embedding_client.embed(query)
    return fetch_relevant_chunks(embedding, top_k, metadata_filters=metadata_filters)


