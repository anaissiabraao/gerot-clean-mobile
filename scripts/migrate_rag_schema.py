"""Migração simples do schema RAG no Supabase/Postgres.

Alinha o banco com o código atual (`rag_service/db.py`):
- adiciona `updated_at` em `ai_document_chunks`
- adiciona UNIQUE(document_id, chunk_index) para permitir ON CONFLICT
"""

from __future__ import annotations

import sys
from pathlib import Path

import psycopg2

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from rag_service.config import settings
from rag_service.db import _clean_dsn


def main() -> int:
    if not settings.database_url:
        print("ERRO: DATABASE_URL não configurada.")
        return 2

    dsn = _clean_dsn(settings.database_url)
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    try:
        cur.execute(
            "alter table ai_document_chunks add column if not exists updated_at timestamptz not null default now()"
        )
        conn.commit()

        cur.execute("select 1 from pg_constraint where conname=%s", ("ai_document_chunks_doc_chunk_uq",))
        exists = cur.fetchone() is not None
        if not exists:
            cur.execute(
                "alter table ai_document_chunks add constraint ai_document_chunks_doc_chunk_uq unique (document_id, chunk_index)"
            )
            conn.commit()

        print("OK: schema atualizado.")
        print(f"- updated_at em ai_document_chunks: ok")
        print(f"- constraint ai_document_chunks_doc_chunk_uq: {'já existia' if exists else 'criada'}")
        return 0
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())


