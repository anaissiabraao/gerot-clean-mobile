"""Consolida os artefatos de DB-KB (FASE 1/2/3) em um único arquivo de knowledge.

Motivação:
- O `rag_service` em modo KB JSON consome um arquivo (lista de itens).
- Nossos itens DB-KB estão espalhados em vários JSONs (phase1/phase2/phase3).
- Este script cria um arquivo único com IDs estáveis, pronto para apontar via `RAG_KB_PATH`.

Saída recomendada:
  data/knowledge_db_schema.json
"""

from __future__ import annotations

import argparse
import json
import os
from typing import Any


DEFAULT_INPUTS = [
    os.path.join("data", "db_kb", "phase1_knowledge_items.json"),
    os.path.join("data", "db_kb", "phase2_knowledge_items_tables.json"),
    os.path.join("data", "db_kb", "phase3_knowledge_items.json"),
    os.path.join("data", "db_kb", "phase3_track_knowledge_items.json"),
    os.path.join("data", "db_kb", "phase3_lifecycle_knowledge_items.json"),
    os.path.join("data", "db_kb", "phase4_knowledge_items.json"),
]


def _load_list(path: str) -> list[dict[str, Any]]:
    if not path or not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    return []


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=os.path.join("data", "knowledge_db_schema.json"))
    parser.add_argument(
        "--inputs",
        default=";".join(DEFAULT_INPUTS),
        help="Lista de arquivos JSON separados por ';' (cada um deve conter uma lista de itens).",
    )
    args = parser.parse_args()

    inputs = [p.strip() for p in (args.inputs or "").split(";") if p.strip()]
    all_items: list[dict[str, Any]] = []
    for p in inputs:
        all_items.extend(_load_list(p))

    # de-dupe por id (último ganha, determinístico pela ordem de inputs)
    by_id: dict[str, dict[str, Any]] = {}
    for it in all_items:
        _id = str(it.get("id") or "").strip()
        if not _id:
            continue
        by_id[_id] = it

    merged = [by_id[k] for k in sorted(by_id.keys())]
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print(f"[OK] DB-KB consolidado: {args.out} (items={len(merged)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


