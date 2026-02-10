"""Base de conhecimento local via JSON (data/knowledge_dump.json).

Objetivo: permitir o RAG funcionar sem Postgres/pgvector, usando apenas o arquivo
`knowledge_dump.json` já existente no repositório.
"""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Dict, List, Tuple


_WORD_RE = re.compile(r"[a-zA-ZÀ-ÿ0-9]+", re.UNICODE)

# Stopwords PT-BR (mínimo, foco em reduzir falsos positivos na KB JSON).
# A ideia é evitar que tokens como "a", "da", "de", "qual" gerem "match" com qualquer coisa.
_STOPWORDS = {
    "a", "o", "as", "os",
    "um", "uma", "uns", "umas",
    "de", "do", "da", "dos", "das",
    "em", "no", "na", "nos", "nas",
    "e", "ou",
    "que", "qual", "quais", "quem", "quando", "onde", "como", "porque", "por", "para",
    "com", "sem",
    "ao", "aos", "à", "às",
    "se", "sua", "seu", "suas", "seus",
    "me", "minha", "meu", "minhas", "meus",
    "te", "tua", "teu", "tuas", "teus",
    "ele", "ela", "eles", "elas",
    "isso", "isto", "aquilo",
    "essa", "esse", "essas", "esses",
    "esta", "este", "estas", "estes",
}

# Tokens curtos, mas importantes no domínio (não filtrar)
_KEEP_SHORT = {"nf", "nfe", "nfs", "nfse", "cst", "cfop"}

# Em perguntas gerais, 1 hit (ex.: "capital") costuma dar falso positivo.
# Por padrão exigimos 2 hits quando a pergunta tem 2+ tokens relevantes.
_JSON_MIN_HITS_DEFAULT = 2


def _tokenize(text: str) -> List[str]:
    tokens = [t.lower() for t in _WORD_RE.findall(text or "")]
    out: List[str] = []
    for t in tokens:
        if t in _KEEP_SHORT:
            out.append(t)
            continue
        # remover stopwords e tokens muito curtos (evita match por "da", "a", etc.)
        if t in _STOPWORDS:
            continue
        if len(t) < 3:
            continue
        out.append(t)
    return out


def _score(query_tokens: List[str], doc_tokens: List[str]) -> float:
    """Score simples por overlap (rápido e sem deps).

    Retorna maior = melhor.
    """
    if not query_tokens or not doc_tokens:
        return 0.0
    dt = set(doc_tokens)
    hits = sum(1 for t in query_tokens if t in dt)
    # Se a pergunta tem 2+ tokens relevantes, exigimos no mínimo 2 hits por padrão.
    # Ex.: "capital alemanha" não deve casar com "CAPITAL TRADE" (hits=1).
    try:
        min_hits = int(os.getenv("RAG_JSON_MIN_HITS", str(_JSON_MIN_HITS_DEFAULT)))
    except Exception:
        min_hits = _JSON_MIN_HITS_DEFAULT
    required_hits = 1 if len(set(query_tokens)) <= 1 else max(1, min_hits)
    if hits < required_hits:
        return 0.0
    # bônus leve para frases mais longas (evita empates constantes)
    return float(hits) + min(0.5, len(doc_tokens) / 2000.0)


@dataclass(frozen=True)
class KBItem:
    document_id: str
    chunk_index: int
    content: str
    metadata: Dict[str, Any]
    tokens: List[str]


@lru_cache(maxsize=4)
def _load_items(path: str) -> List[KBItem]:
    if not path:
        return []
    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as fp:
        raw = json.load(fp)

    if not isinstance(raw, list):
        return []

    items: List[KBItem] = []
    for idx, it in enumerate(raw):
        if not isinstance(it, dict):
            continue
        doc_id = str(it.get("id") or f"kb::{idx}")
        question = str(it.get("question") or "").strip()
        answer = str(it.get("answer") or "").strip()
        category = str(it.get("category") or "").strip()
        source = str(it.get("source") or "").strip()
        if not (question or answer):
            continue

        content = answer or question
        # Preserva metadata extra do item (se houver) para permitir filtros ricos no modo KB JSON.
        # A base "meta" abaixo é sempre mantida (não sobrescrever com valores inconsistentes).
        extra_meta = it.get("metadata") if isinstance(it.get("metadata"), dict) else {}
        meta = {
            "kind": "knowledge_dump_json",
            "question": question,
            "category": category or None,
            "source": source or None,
            "synced_at": it.get("synced_at"),
        }
        # Merge: mantém as chaves base acima como fonte de verdade; demais chaves vêm do metadata extra.
        for k, v in (extra_meta or {}).items():
            if k in meta:
                continue
            meta[k] = v
        items.append(
            KBItem(
                document_id=doc_id,
                chunk_index=0,
                content=content,
                metadata=meta,
                # Inclui category/source para melhorar match em perguntas genéricas
                # (ex.: "emissão de NF" tende a casar com "EMISSÃO DE NOTA FISCAL.docx").
                tokens=_tokenize(f"{question}\n{answer}\n{category}\n{source}"),
            )
        )
    return items


def _matches_metadata_filters(meta: Dict[str, Any], filters: Dict[str, Any] | None) -> bool:
    """Aplica filtros simples de metadata.

    Semântica (intencionalmente simples e determinística):
    - Para cada (chave, valor) em filters:
      - Se o valor for lista/tupla/conjunto: meta[chave] deve estar contido nessa lista.
      - Caso contrário: meta[chave] deve ser exatamente igual ao valor (comparação string-safe).

    Observação: este é um filtro para KB JSON (arquivo). Não altera o KB, apenas restringe itens.
    """
    if not filters:
        return True
    meta = meta or {}
    for k, v in (filters or {}).items():
        if v is None:
            continue
        mv = meta.get(k)
        if isinstance(v, (list, tuple, set)):
            if mv not in v:
                return False
        else:
            # comparação tolerante (muito comum metadata virar string no JSON)
            if str(mv) != str(v):
                return False
    return True


def search(
    path: str,
    query: str,
    *,
    top_k: int = 6,
    metadata_filters: Dict[str, Any] | None = None,
) -> List[Dict[str, Any]]:
    q_tokens = _tokenize(query)
    qset = set(q_tokens)
    items = _load_items(path)
    if not items:
        return []

    # Filtra por metadata (ex.: category/source), antes de calcular score.
    if metadata_filters:
        filtered = [it for it in items if _matches_metadata_filters(it.metadata, metadata_filters)]
        if filtered:
            items = filtered

    # Se o usuário está claramente perguntando sobre NF/nota fiscal e houver itens cuja fonte
    # explicitamente trate disso, restringimos para evitar respostas "genéricas" de faturamento.
    if qset.intersection({"nf", "nfe", "nota", "fiscal", "nf-e", "nfs", "nfse"}):
        focused = []
        for it in items:
            src = str((it.metadata or {}).get("source") or "").upper()
            if "NOTA FISCAL" in src or src.startswith("EMISS") or "NFS" in src:
                focused.append(it)
        if focused:
            items = focused

    def _heuristic_boost(it: KBItem) -> float:
        # Heurística simples para perguntas comuns (ex.: "emissão de NF")
        # Prioriza itens cujo "source" sugere nota fiscal quando o usuário menciona NF/nota fiscal.
        boost = 0.0
        src = str((it.metadata or {}).get("source") or "").upper()
        if qset.intersection({"nf", "nfe", "nota", "fiscal", "nf-e", "nfs", "nfse"}):
            if "NOTA FISCAL" in src or "NFS" in src or "NF" in src:
                boost += 5.0
        if qset.intersection({"emissao", "emissão", "emitir"}):
            if "EMISS" in src:
                boost += 2.0
        return boost

    scored: List[Tuple[float, KBItem]] = [(_score(q_tokens, it.tokens) + _heuristic_boost(it), it) for it in items]
    scored.sort(key=lambda x: x[0], reverse=True)
    best_scored = [(s, it) for s, it in scored if s > 0.0][: max(1, top_k)]

    # Interface compatível com o restante do pipeline (chunks dict)
    out: List[Dict[str, Any]] = []
    for s, it in best_scored:
        out.append(
            {
                "document_id": it.document_id,
                "chunk_index": it.chunk_index,
                "content": it.content,
                "metadata": it.metadata,
                # Para KB JSON, usamos score (maior=melhor). Mantemos "distance" por compat.
                "score": float(s),
                "distance": float(s),
            }
        )
    return out


def invalidate_cache() -> None:
    """Limpa cache do loader para refletir alterações no arquivo JSON em runtime."""
    try:
        _load_items.cache_clear()
    except Exception:
        pass

