"""Remove chaves do Gemini do Render para evitar fallback."""
from __future__ import annotations

import os
import sys
from typing import Dict

import requests

# Adicionar o diretório raiz ao path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from scripts.render_update_env import (
    API_BASE,
    _get_env_vars,
    _get_service_id,
    _headers,
    _normalize_env_list,
    _put_env_vars,
    _restart_service,
)

GEMINI_KEYS = [
    "GOOGLE_API_KEY",
    "GEMINI_API_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
]


def main() -> int:
    api_key = os.getenv("RENDER_API_KEY", "").strip()
    if not api_key:
        print("ERRO: Defina RENDER_API_KEY.")
        return 2

    service_id = _get_service_id(api_key)
    print(f"Service ID: {service_id}")

    # Obter env vars atuais
    env_list = _get_env_vars(api_key, service_id)
    try:
        env = _normalize_env_list(env_list)
    except RuntimeError as exc:
        print(f"ERRO: {exc}")
        return 3

    # Remover chaves do Gemini
    removed = []
    for key in GEMINI_KEYS:
        if key in env:
            del env[key]
            removed.append(key)

    if not removed:
        print("Nenhuma chave do Gemini encontrada para remover.")
        return 0

    print(f"Removendo chaves do Gemini: {', '.join(removed)}")
    _put_env_vars(api_key, service_id, env)
    print("OK: Chaves removidas.")

    # Restart sem build
    apply_mode = os.getenv("RENDER_APPLY_MODE", "restart").lower().strip()
    if apply_mode == "restart":
        print("Reiniciando serviço para aplicar mudanças (sem build)...")
        _restart_service(api_key, service_id)
        print("OK: Restart solicitado.")
    else:
        print("Aviso: nenhum restart foi executado (RENDER_APPLY_MODE != restart).")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

