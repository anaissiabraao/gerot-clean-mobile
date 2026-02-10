"""Utilitários para dividir textos em chunks."""
from __future__ import annotations

import re
from typing import Iterable

WHITESPACE_RE = re.compile(r"\s+")


def normalize_text(text: str) -> str:
    return WHITESPACE_RE.sub(" ", text).strip()


def chunk_text(
    text: str,
    *,
    max_tokens: int = 480,
    overlap: int = 60,
) -> list[dict]:
    """Divide texto em pedaços baseado em contagem aproximada de tokens."""
    normalized = normalize_text(text)
    if not normalized:
        return []

    words = normalized.split(" ")
    chunks: list[dict] = []
    start = 0
    chunk_index = 0

    while start < len(words):
        end = min(start + max_tokens, len(words))
        chunk_words = words[start:end]
        chunk_text_str = " ".join(chunk_words)
        chunks.append(
            {
                "index": chunk_index,
                "text": chunk_text_str,
                "tokens": len(chunk_words),
            }
        )
        chunk_index += 1
        if end == len(words):
            break
        start = max(0, end - overlap)

    return chunks


def iter_chunks_from_documents(docs: Iterable[str], **kwargs):
    for doc in docs:
        yield from chunk_text(doc, **kwargs)
