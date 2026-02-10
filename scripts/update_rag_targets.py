#!/usr/bin/env python3
"""Atualiza arquivos .env com os endpoints do RAG/LLM (Railway)."""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Dict

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_ENV_FILE = BASE_DIR / ".env"


def _load_env(path: Path) -> list[str]:
    if not path.exists():
        return []
    return path.read_text(encoding="utf-8").splitlines()


def _dump_env(path: Path, lines: list[str]) -> None:
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _update_lines(lines: list[str], updates: Dict[str, str]) -> list[str]:
    seen = set()
    result: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#") or "=" not in stripped:
            result.append(line)
            continue
        key, _ = stripped.split("=", 1)
        key = key.strip()
        if key in updates:
            result.append(f"{key}={updates[key]}")
            seen.add(key)
        else:
            result.append(line)
    for key, value in updates.items():
        if key not in seen:
            result.append(f"{key}={value}")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Atualiza RAG_API_URL/RAG_LLM_URL/RAG_EMBEDDING_URL no .env"
    )
    parser.add_argument(
        "--env-file",
        default=str(DEFAULT_ENV_FILE),
        help="Caminho para o arquivo .env (default: %(default)s)",
    )
    parser.add_argument(
        "--rag-url",
        default="https://gerot-rag.up.railway.app",
        help="URL pública do serviço RAG (default: %(default)s)",
    )
    parser.add_argument(
        "--llm-url",
        default="",
        help="URL da API do LLM (opcional, mantém valor atual se vazio)",
    )
    parser.add_argument(
        "--embedding-url",
        default="",
        help="URL da API de embeddings (opcional, mantém valor atual se vazio)",
    )
    args = parser.parse_args()

    env_path = Path(args.env_file).expanduser().resolve()
    lines = _load_env(env_path)

    updates: Dict[str, str] = {"RAG_API_URL": args.rag_url.rstrip("/")}
    if args.llm_url:
        updates["RAG_LLM_URL"] = args.llm_url.rstrip("/")
    if args.embedding_url:
        updates["RAG_EMBEDDING_URL"] = args.embedding_url.rstrip("/")

    new_lines = _update_lines(lines, updates)
    _dump_env(env_path, new_lines)

    print("=== Atualização concluída ===")
    print(f"Arquivo .env: {env_path}")
    for key, value in updates.items():
        print(f"  - {key} = {value}")


if __name__ == "__main__":
    main()

