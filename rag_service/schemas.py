"""Modelos Pydantic usados pelo serviço RAG."""
from __future__ import annotations

from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field


class QARequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=4096)
    metadata_filters: Optional[Dict[str, Any]] = None
    top_k: int = Field(default=6, ge=1, le=12)


class SourceChunk(BaseModel):
    document_id: str
    chunk_index: int
    score: float
    snippet: str
    metadata: Optional[Dict[str, Any]] = None


class QAResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    model: str
    latency_ms: int


class AgentQARequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=4096)
    metadata_filters: Optional[Dict[str, Any]] = None
    top_k: int = Field(default=6, ge=1, le=12)
    max_attempts: Optional[int] = Field(default=None, ge=1, le=6)


class AgentQAResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    intent: str
    used_rag: bool
    attempts: int
    model: str
    latency_ms: int
    trace: Optional[Dict[str, Any]] = None


class IngestRequest(BaseModel):
    source_name: str
    content: str
    content_type: Literal["text"] = "text"
    metadata: Optional[Dict[str, Any]] = None


class IngestFileURLRequest(BaseModel):
    source_name: str
    file_url: str
    content_type: Literal["file_url"] = "file_url"
    metadata: Optional[Dict[str, Any]] = None


class IngestResponse(BaseModel):
    job_id: str
    status: str
