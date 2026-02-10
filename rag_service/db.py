"""Conexão com o banco (Supabase/PostgreSQL)."""
from __future__ import annotations

import threading
from urllib.parse import parse_qsl, urlsplit, urlunsplit, urlencode

import psycopg2
import psycopg2.extras
from psycopg2 import pool
from pgvector.psycopg2 import register_vector

from .config import settings


def _build_metadata_where_clause(metadata_filters: dict | None) -> tuple[str, list]:
    """Monta um WHERE determinístico e seguro (placeholders) para filtrar por metadata.

    Suporta um subconjunto útil (sem DSL, sem improviso):
    - `document_id`: filtra por `adc.document_id`
    - `source_name`: filtra por `doc.source_name`
    - Demais chaves escalares em `doc.metadata` (jsonb): filtra por igualdade usando `metadata ->> key = value`
      - Se o valor for lista/tupla: usa `IN (...)` com placeholders

    Importante: as chaves são interpoladas apenas via identificadores controlados (não entram no SQL como texto livre).
    """
    if not metadata_filters:
        return "", []

    clauses: list[str] = []
    params: list = []

    # Campos “primários” fora do JSON
    doc_id = metadata_filters.get("document_id")
    if doc_id:
        clauses.append("adc.document_id = %s")
        params.append(doc_id)

    source_name = metadata_filters.get("source_name")
    if source_name:
        clauses.append("doc.source_name = %s")
        params.append(source_name)

    # Filtros JSON (restante)
    for k, v in (metadata_filters or {}).items():
        if v is None:
            continue
        if k in {"document_id", "source_name"}:
            continue
        # chave precisa ser string simples (evita SQL injection por chave)
        if not isinstance(k, str) or not k or len(k) > 80:
            continue
        if isinstance(v, (list, tuple, set)):
            vals = [str(x) for x in v if x is not None]
            if not vals:
                continue
            placeholders = ", ".join(["%s"] * len(vals))
            clauses.append(f"(doc.metadata ->> %s) IN ({placeholders})")
            params.append(k)
            params.extend(vals)
        else:
            clauses.append("(doc.metadata ->> %s) = %s")
            params.append(k)
            params.append(str(v))

    if not clauses:
        return "", []
    return " AND " + " AND ".join(clauses), params


_connection_pool: pool.ThreadedConnectionPool | None = None
_pool_lock = threading.Lock()


def _init_pool() -> pool.ThreadedConnectionPool:
    settings.ensure_database()
    dsn = _clean_dsn(settings.database_url)
    conn_pool = psycopg2.pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=10,
        dsn=dsn,
        cursor_factory=psycopg2.extras.RealDictCursor,
    )

    with conn_pool.getconn() as conn:  # type: ignore[arg-type]
        register_vector(conn)
        conn_pool.putconn(conn)

    return conn_pool


def get_conn():  # type: ignore[override]
    global _connection_pool
    if not _connection_pool:
        with _pool_lock:
            if not _connection_pool:
                _connection_pool = _init_pool()
    assert _connection_pool is not None
    return _connection_pool.getconn()


def put_conn(conn) -> None:
    if _connection_pool and conn:
        _connection_pool.putconn(conn)


def fetch_relevant_chunks(embedding: list[float], top_k: int, *, metadata_filters: dict | None = None) -> list[dict]:
    """Busca chunks mais similares usando pgvector."""
    conn = get_conn()
    cursor = conn.cursor()
    try:
        where_extra, extra_params = _build_metadata_where_clause(metadata_filters)
        cursor.execute(
            """
            SELECT
                adc.id,
                adc.content,
                adc.chunk_index,
                adc.document_id,
                doc.source_name,
                doc.metadata,
                (adc.embedding <=> %s::vector) AS distance
            FROM ai_document_chunks adc
            JOIN ai_documents doc ON doc.id = adc.document_id
            WHERE adc.is_active = TRUE
            """
            + where_extra
            + """
            ORDER BY adc.embedding <=> %s::vector
            LIMIT %s
            """,
            (embedding, *extra_params, embedding, top_k),
        )
        return list(cursor.fetchall())
    finally:
        cursor.close()
        put_conn(conn)


def create_ingestion_job(
    source_name: str,
    *,
    stats: dict | None = None,
    payload: dict | None = None,
) -> str:
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO ai_ingestion_jobs (source_name, status, stats, payload)
            VALUES (%s, 'queued', %s, %s)
            RETURNING id
            """,
            (
                source_name,
                psycopg2.extras.Json(stats or {}),
                psycopg2.extras.Json(payload or {}),
            ),
        )
        job_id = cursor.fetchone()["id"]
        conn.commit()
        return str(job_id)
    finally:
        cursor.close()
        put_conn(conn)


def log_query(question: str, answer: str, sources: list[dict], latency_ms: int) -> None:
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO queries_log (question, response, latency_ms, retrieved_chunk_ids, metadata)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                question,
                answer,
                latency_ms,
                [s.get("id") for s in sources],
                psycopg2.extras.Json({"count": len(sources)}),
            ),
        )
        conn.commit()
    except Exception:
        conn.rollback()
    finally:
        cursor.close()
        put_conn(conn)


def upsert_document(*, source_name: str, source_type: str, checksum: str, metadata: dict | None) -> str:
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO ai_documents (source_name, source_type, checksum, metadata)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (source_name, checksum)
            DO UPDATE SET metadata = EXCLUDED.metadata, updated_at = NOW()
            RETURNING id
            """,
            (source_name, source_type, checksum, psycopg2.extras.Json(metadata or {})),
        )
        doc_id = cursor.fetchone()["id"]
        conn.commit()
        return str(doc_id)
    finally:
        cursor.close()
        put_conn(conn)


def insert_chunk(
    *,
    document_id: str,
    chunk_index: int,
    content: str,
    tokens: int,
    embedding: list[float],
) -> None:
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO ai_document_chunks (document_id, chunk_index, content, tokens, embedding)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (document_id, chunk_index)
            DO UPDATE SET
                content = EXCLUDED.content,
                tokens = EXCLUDED.tokens,
                embedding = EXCLUDED.embedding,
                updated_at = NOW()
            """,
            (document_id, chunk_index, content, tokens, _vector_literal(embedding)),
        )
        conn.commit()
    finally:
        cursor.close()
        put_conn(conn)


def _vector_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.10f}" for v in values) + "]"


def _clean_dsn(dsn: str | None) -> str | None:
    if not dsn or "?" not in dsn:
        return dsn

    parts = urlsplit(dsn)
    filtered_query = urlencode(
        [(k, v) for k, v in parse_qsl(parts.query) if k.lower() != "pgbouncer"],
        doseq=True,
    )
    return urlunsplit((parts.scheme, parts.netloc, parts.path, filtered_query, parts.fragment))


def update_ingestion_job(
    job_id: str, *, status: str, error: str | None = None, stats: dict | None = None
) -> None:
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE ai_ingestion_jobs
            SET status = %s,
                error = %s,
                stats = COALESCE(%s, stats),
                finished_at = CASE WHEN %s IN ('completed', 'failed') THEN NOW() ELSE finished_at END
            WHERE id = %s
            """,
            (
                status,
                error,
                psycopg2.extras.Json(stats) if stats is not None else None,
                status,
                job_id,
            ),
        )
        conn.commit()
    finally:
        cursor.close()
        put_conn(conn)
