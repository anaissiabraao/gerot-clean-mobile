"""Cliente para serviço de embeddings."""
from __future__ import annotations

import time
from collections import deque
from typing import Any, Deque, Dict

import httpx

from .config import settings


_OLLAMA_EMBED_LAST: Deque[Dict[str, Any]] = deque(maxlen=50)


def get_last_embedding_events(limit: int = 20) -> list[Dict[str, Any]]:
    limit = max(1, min(int(limit or 20), 50))
    return list(_OLLAMA_EMBED_LAST)[-limit:]


class EmbeddingClient:
    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = base_url or settings.embedding_service_url
        self.model = settings.embedding_model

    async def embed(self, text: str) -> list[float]:
        async with httpx.AsyncClient(timeout=30) as client:
            if settings.embedding_provider == "ollama":
                # Ollama: POST /api/embeddings { model, prompt }
                payload = {
                    "model": self.model,
                    "prompt": text,
                    # Mantém modelo de embedding em memória também.
                    "keep_alive": getattr(settings, "ollama_keep_alive", "15m"),
                    "options": {"num_ctx": int(getattr(settings, "ollama_num_ctx", 2048))},
                }
                headers = {}  # Ollama local não usa x-api-key
            else:
                payload = {"input": text, "model": self.model}
                headers = {"x-api-key": settings.api_key}

            t0 = time.perf_counter()
            try:
                response = await client.post(self.base_url, json=payload, headers=headers)
                elapsed_ms = int((time.perf_counter() - t0) * 1000)
                response.raise_for_status()
            except Exception as exc:
                elapsed_ms = int((time.perf_counter() - t0) * 1000)
                if settings.embedding_provider == "ollama":
                    evt: Dict[str, Any] = {
                        "ts": int(time.time()),
                        "provider": "ollama",
                        "url": self.base_url,
                        "model": self.model,
                        "http_status": getattr(getattr(exc, "response", None), "status_code", None),
                        "elapsed_ms": elapsed_ms,
                        "text_chars": len(text or ""),
                        "error": f"{type(exc).__name__}: {exc}",
                    }
                    _OLLAMA_EMBED_LAST.append(evt)
                raise
            data = response.json()
            embedding = data["embedding"]
            if settings.embedding_provider == "ollama":
                evt: Dict[str, Any] = {
                    "ts": int(time.time()),
                    "provider": "ollama",
                    "url": self.base_url,
                    "model": self.model,
                    "http_status": response.status_code,
                    "elapsed_ms": elapsed_ms,
                    "text_chars": len(text or ""),
                }
                _OLLAMA_EMBED_LAST.append(evt)
                if settings.log_ollama:
                    try:
                        import logging

                        logging.getLogger("rag_service").info(
                            "[OllamaEmb] model=%s ms=%s text_chars=%s",
                            self.model,
                            elapsed_ms,
                            len(text or ""),
                        )
                    except Exception:
                        pass
            return _fit_embedding_dim(embedding, settings.embedding_dim)


embedding_client = EmbeddingClient()


def _fit_embedding_dim(embedding: list[float], target_dim: int) -> list[float]:
    """Garante dimensão fixa (pad/truncate) para compatibilidade com pgvector."""
    if target_dim <= 0:
        return embedding
    if len(embedding) == target_dim:
        return embedding
    if len(embedding) > target_dim:
        return embedding[:target_dim]
    return embedding + [0.0] * (target_dim - len(embedding))
