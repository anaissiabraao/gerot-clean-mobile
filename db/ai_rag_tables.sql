-- Tabelas para Knowledge Base com pgvector

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'manual',
    checksum TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_name, checksum)
);

CREATE TABLE IF NOT EXISTS ai_document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES ai_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    tokens INTEGER NOT NULL DEFAULT 0,
    embedding VECTOR(1536) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_document_chunks_doc_idx
    ON ai_document_chunks(document_id, chunk_index);

CREATE INDEX IF NOT EXISTS ai_document_chunks_active_idx
    ON ai_document_chunks(is_active);

CREATE INDEX IF NOT EXISTS ai_document_chunks_embedding_idx
    ON ai_document_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 200);

CREATE TABLE IF NOT EXISTS ai_ingestion_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    payload JSONB,
    error TEXT,
    stats JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ai_ingestion_jobs_status_idx ON ai_ingestion_jobs(status);

CREATE TABLE IF NOT EXISTS queries_log (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    response TEXT,
    latency_ms INTEGER,
    retrieved_chunk_ids UUID[],
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
