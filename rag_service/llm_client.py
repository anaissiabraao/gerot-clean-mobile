"""Cliente para o serviço LLM self-hosted."""
from __future__ import annotations

import time
from collections import deque
from typing import Any, Deque, Dict, Optional

import httpx

from .config import settings


_OLLAMA_LAST: Deque[Dict[str, Any]] = deque(maxlen=50)


def get_last_ollama_events(limit: int = 20) -> list[Dict[str, Any]]:
    limit = max(1, min(int(limit or 20), 50))
    return list(_OLLAMA_LAST)[-limit:]


class LLMClient:
    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = base_url or settings.llm_service_url
        self.model = settings.llm_model

    async def generate(self, prompt: str, *, max_tokens: int = 512) -> str:
        # Não deixe o endpoint /v1/qa ficar preso indefinidamente esperando o Ollama.
        # O pipeline também aplica um asyncio.wait_for, mas aqui garantimos timeout no HTTP.
        timeout_s = float(getattr(settings, "llm_request_timeout_s", 90))
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            if settings.llm_provider == "ollama":
                # Ollama: POST /api/generate { model, prompt, stream:false, options:{...} }
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    # Mantém o modelo carregado para próximos requests (melhora MUITO a latência).
                    "keep_alive": getattr(settings, "ollama_keep_alive", "15m"),
                    "options": {
                        "temperature": 0.1,
                        "top_p": 0.8,
                        # num_predict ~ max new tokens
                        "num_predict": max_tokens,
                        # Contexto menor costuma ser mais rápido e suficiente para respostas curtas.
                        "num_ctx": int(getattr(settings, "ollama_num_ctx", 2048)),
                    },
                }
                headers = {}
            else:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "max_tokens": max_tokens,
                    "temperature": 0.1,
                    "top_p": 0.8,
                }
                headers = {"x-api-key": settings.api_key}

            t0 = time.perf_counter()
            try:
                response = await client.post(self.base_url, json=payload, headers=headers)
                elapsed_ms = int((time.perf_counter() - t0) * 1000)
            except Exception as exc:
                elapsed_ms = int((time.perf_counter() - t0) * 1000)
                # Também registra falhas (ex.: Ollama não está rodando / conexão recusada),
                # para ficar visível em /debug/ollama/last.
                evt: Dict[str, Any] = {
                    "ts": int(time.time()),
                    "provider": settings.llm_provider,
                    "url": self.base_url,
                    "model": self.model,
                    "http_status": None,
                    "elapsed_ms": elapsed_ms,
                    "num_predict": max_tokens,
                    "prompt_chars": len(prompt or ""),
                    "error": f"{type(exc).__name__}: {exc}",
                }
                _OLLAMA_LAST.append(evt)
                raise
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                # Caso comum em ambientes locais: modelo não está baixado no Ollama ainda.
                text = ""
                try:
                    text = response.text
                except Exception:
                    pass
                evt: Dict[str, Any] = {
                    "ts": int(time.time()),
                    "provider": settings.llm_provider,
                    "url": self.base_url,
                    "model": self.model,
                    "http_status": exc.response.status_code,
                    "elapsed_ms": elapsed_ms,
                    "num_predict": max_tokens,
                    "prompt_chars": len(prompt or ""),
                    "error": f"HTTPStatusError: {text[:600]}",
                }
                _OLLAMA_LAST.append(evt)
                raise RuntimeError(f"Falha ao gerar com LLM ({exc.response.status_code}): {text}") from exc
            data = response.json()
            # Observabilidade do Ollama (best-effort)
            if settings.llm_provider == "ollama":
                evt: Dict[str, Any] = {
                    "ts": int(time.time()),
                    "provider": "ollama",
                    "url": self.base_url,
                    "model": self.model,
                    "http_status": response.status_code,
                    "elapsed_ms": elapsed_ms,
                    "num_predict": max_tokens,
                    "prompt_chars": len(prompt or ""),
                    # métricas do Ollama (sem o campo "context", que é gigante)
                    "ollama": {k: v for k, v in (data or {}).items() if k != "context"},
                }
                if settings.log_prompts:
                    maxc = max(0, int(settings.log_prompt_max_chars))
                    if maxc > 0:
                        evt["prompt_preview"] = (prompt or "")[:maxc]
                _OLLAMA_LAST.append(evt)
                if settings.log_ollama:
                    # Log enxuto (não imprime prompt inteiro por padrão)
                    try:
                        import logging

                        logging.getLogger("rag_service").info(
                            "[Ollama] model=%s ms=%s prompt_chars=%s num_predict=%s",
                            self.model,
                            elapsed_ms,
                            len(prompt or ""),
                            max_tokens,
                        )
                    except Exception:
                        pass
            # Ollama: "response". Serviços custom: "text"/"output"
            return data.get("response") or data.get("text") or data.get("output") or ""


llm_client = LLMClient()
