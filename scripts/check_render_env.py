"""Verifica env vars atuais no Render."""
from __future__ import annotations

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from scripts.render_update_env import _get_env_vars, _get_service_id, _headers

API_BASE = "https://api.render.com/v1"


def main() -> int:
    api_key = os.getenv("RENDER_API_KEY", "").strip()
    if not api_key:
        print("ERRO: Defina RENDER_API_KEY.")
        return 2

    service_id = _get_service_id(api_key)
    print(f"Service ID: {service_id}\n")

    env_list = _get_env_vars(api_key, service_id)
    print("Env vars atuais no Render:")
    print("-" * 60)
    if not env_list:
        print("(nenhuma env var encontrada)")
    else:
        for item in env_list:
            key = item.get("key", "")
            value = item.get("value", "")
            if value is None or value == "":
                print(f"{key} = (sem valor ou secreto)")
            elif "URL" in key.upper():
                print(f"{key} = {value}")
            elif "KEY" in key.upper() or "SECRET" in key.upper() or "PASSWORD" in key.upper():
                masked = "*" * (len(value) - 4) + value[-4:] if len(value) > 4 else "*" * len(value)
                print(f"{key} = {masked}")
            else:
                print(f"{key} = {value}")
    print("-" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

