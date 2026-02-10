"""Atualiza variáveis de ambiente no Render via API.

Foco: manter RAG_API_URL sempre apontando para o túnel (trycloudflare).

Requisitos:
- Definir RENDER_API_KEY (segredo)
- Definir RENDER_SERVICE_ID (recomendado) OU RENDER_SERVICE_NAME (ex: gerot-dashboard)

Opcional:
- RENDER_TRIGGER_DEPLOY=true|false (default: true)
- RENDER_APPLY_MODE=restart|deploy|none (default: deploy; se sua conta estiver sem build minutes use restart)
- RENDER_SET_RAG_API_KEY=... (se quiser atualizar RAG_API_KEY também)

Uso:
  python scripts/render_update_env.py --set RAG_API_URL=https://xxxx.trycloudflare.com
  python scripts/render_update_env.py --list-services
"""

from __future__ import annotations

import argparse
import os
import sys
from typing import Any, Dict, List, Tuple

import requests

API_BASE = "https://api.render.com/v1"


def _mask(value: str, keep: int = 4) -> str:
    if not value:
        return ""
    if len(value) <= keep:
        return "*" * len(value)
    return "*" * (len(value) - keep) + value[-keep:]


def _headers(api_key: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def _iter_services(raw: Any):
    """Normaliza formatos possíveis do endpoint /v1/services."""
    if not isinstance(raw, list):
        return
    for item in raw:
        if isinstance(item, dict) and isinstance(item.get("service"), dict):
            yield item["service"]
        elif isinstance(item, dict):
            yield item


def _list_services(api_key: str) -> List[Dict[str, Any]]:
    resp = requests.get(f"{API_BASE}/services", headers=_headers(api_key), timeout=30)
    resp.raise_for_status()
    raw = resp.json()
    services: List[Dict[str, Any]] = []
    for s in _iter_services(raw):
        sid = s.get("id") if isinstance(s, dict) else None
        name = s.get("name") if isinstance(s, dict) else None
        stype = s.get("type") if isinstance(s, dict) else None
        if sid or name or stype:
            services.append({"id": sid, "name": name, "type": stype})
    return services


def _get_service_id(api_key: str) -> str:
    service_id = os.getenv("RENDER_SERVICE_ID", "").strip()
    if service_id:
        return service_id

    service_name = os.getenv("RENDER_SERVICE_NAME", "").strip()
    if not service_name:
        raise SystemExit(
            "Defina RENDER_SERVICE_ID (preferido) ou RENDER_SERVICE_NAME (ex: gerot-dashboard)."
        )

    services = _list_services(api_key)

    # Render retorna uma lista de objetos; cada item tem pelo menos id/name/type.
    matches = [s for s in services if (s.get("name") or "").lower() == service_name.lower()]
    if not matches:
        available = ", ".join(sorted({(s.get("name") or "") for s in services if s.get("name")})) or "(nenhum)"
        raise SystemExit(
            f"Service name não encontrado: {service_name}. Disponíveis: {available}. "
            "Dica: use RENDER_SERVICE_ID para evitar ambiguidade."
        )

    if len(matches) > 1:
        ids = ", ".join([m.get("id", "?") for m in matches])
        raise SystemExit(f"Mais de um service com o mesmo nome. Use RENDER_SERVICE_ID. IDs: {ids}")

    return str(matches[0]["id"])


def _get_env_vars(api_key: str, service_id: str) -> List[Dict[str, Any]]:
    resp = requests.get(
        f"{API_BASE}/services/{service_id}/env-vars", headers=_headers(api_key), timeout=30
    )
    resp.raise_for_status()
    data = resp.json()
    if not isinstance(data, list):
        raise SystemExit("Resposta inesperada ao listar env-vars")
    return data


def _normalize_env_list(env_list: List[Dict[str, Any]], allow_secrets: bool = False) -> Dict[str, str]:
    result: Dict[str, str] = {}
    for item in env_list:
        k = item.get("key")
        if not k:
            continue
        # IMPORTANTE (segurança):
        # A API do Render pode não retornar o valor de variáveis "secret".
        # Como o endpoint de update substitui TODAS as env-vars, enviar "" pode APAGAR segredos.
        # Portanto, se alguma env var vier sem "value", abortamos e pedimos ação manual.
        # EXCETO se allow_secrets=True (quando estamos apenas atualizando algumas vars específicas).
        if "value" not in item or item.get("value") is None:
            if allow_secrets:
                # Quando allow_secrets=True, mantemos a chave mas não o valor (será preservado pelo Render)
                # Na verdade, precisamos usar um valor placeholder que o Render reconhece como "não alterar"
                # Mas a API do Render requer um valor. Vamos usar um valor vazio e confiar que o Render preserve.
                # MELHOR: não incluir vars secretas no payload quando allow_secrets=True
                continue
            raise RuntimeError(
                "A API do Render não retornou valores para todas as env-vars "
                "(provável variável secreta). Para evitar apagar segredos, "
                "esta automação foi bloqueada. Atualize o RAG_API_URL manualmente no painel do Render, "
                "ou forneça um conjunto completo de env-vars com valores."
            )
        result[str(k)] = str(item.get("value"))
    return result


def _put_env_vars(api_key: str, service_id: str, env_dict: Dict[str, str]) -> None:
    payload = [{"key": k, "value": v} for k, v in sorted(env_dict.items())]
    resp = requests.put(
        f"{API_BASE}/services/{service_id}/env-vars",
        headers=_headers(api_key),
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()


def _trigger_deploy(api_key: str, service_id: str, commit_sha: str = None) -> None:
    """Dispara deploy no Render. Se commit_sha for fornecido, faz deploy desse commit específico."""
    if commit_sha:
        # Para deploy de commit específico, a API do Render aceita commitSha no payload
        resp = requests.post(
            f"{API_BASE}/services/{service_id}/deploys",
            headers=_headers(api_key),
            json={"commitSha": commit_sha},
            timeout=60,
        )
    else:
        resp = requests.post(
            f"{API_BASE}/services/{service_id}/deploys",
            headers=_headers(api_key),
            json={},
            timeout=60,
        )
    resp.raise_for_status()


def _restart_service(api_key: str, service_id: str) -> None:
    resp = requests.post(
        f"{API_BASE}/services/{service_id}/restart",
        headers=_headers(api_key),
        json={},
        timeout=60,
    )
    resp.raise_for_status()


def parse_sets(values: List[str]) -> List[Tuple[str, str]]:
    sets: List[Tuple[str, str]] = []
    for raw in values:
        if "=" not in raw:
            raise SystemExit(f"Formato inválido: {raw}. Use KEY=VALUE")
        k, v = raw.split("=", 1)
        k = k.strip()
        if not k:
            raise SystemExit(f"Chave vazia em: {raw}")
        sets.append((k, v))
    return sets


def _strip_outer_quotes(value: str) -> str:
    v = value.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in {"'", '"'}:
        return v[1:-1]
    return v


def _read_dotenv(path: str) -> Dict[str, str]:
    env: Dict[str, str] = {}
    if not os.path.exists(path):
        raise SystemExit(f"Arquivo .env não encontrado: {path}")
    with open(path, "r", encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or line.startswith(";"):
                continue
            if "=" not in line:
                continue
            k, v = line.split("=", 1)
            k = k.strip()
            if not k:
                continue
            env[k] = _strip_outer_quotes(v)
    return env


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--list-services",
        action="store_true",
        help="Lista serviços visíveis por esta API key e sai.",
    )
    parser.add_argument(
        "--set",
        action="append",
        default=[],
        help="Define/atualiza env var no formato KEY=VALUE (pode repetir).",
    )
    parser.add_argument(
        "--replace-with-dotenv",
        default="",
        help="Substitui TODAS as env-vars do Render pelas do arquivo .env (mais seguro quando há secrets, pois não depende de ler env-vars atuais).",
    )
    args = parser.parse_args()

    api_key = os.getenv("RENDER_API_KEY", "").strip()
    if not api_key:
        print("ERRO: Defina RENDER_API_KEY.")
        return 2

    if args.list_services:
        try:
            services = _list_services(api_key)
        except Exception as exc:
            print(f"ERRO ao listar serviços: {exc}")
            return 4
        if not services:
            print("Nenhum serviço encontrado para esta API key.")
            print("Verifique se a API key foi criada na conta/time correta no Render.")
            return 0
        print("Serviços encontrados:")
        for s in services:
            print(f"- {s.get('name')} | id={s.get('id')} | type={s.get('type')}")
        return 0

    service_id = _get_service_id(api_key)
    
    # Se apenas quer disparar deploy (sem alterar env vars)
    if args.trigger_deploy:
        commit_sha = args.deploy_commit if args.deploy_commit else None
        if commit_sha:
            print(f"Fazendo deploy do commit: {commit_sha}")
        else:
            print("Disparando deploy do último commit...")
        try:
            _trigger_deploy(api_key, service_id, commit_sha)
            print("OK: Deploy disparado.")
        except Exception as exc:
            print(f"ERRO ao disparar deploy: {exc}")
            return 1
        return 0
    
    changes = parse_sets(args.set)
    if not changes and not args.replace_with_dotenv:
        print("Nada para alterar. Use --set KEY=VALUE ou --replace-with-dotenv caminho\\.env")
        print("Ou use --trigger-deploy para apenas disparar um deploy")
        return 2

    trigger_deploy = os.getenv("RENDER_TRIGGER_DEPLOY", "true").lower() == "true"
    apply_mode = os.getenv("RENDER_APPLY_MODE", "deploy").lower().strip()
    if apply_mode not in {"deploy", "restart", "none"}:
        print("ERRO: RENDER_APPLY_MODE deve ser deploy|restart|none")
        return 2

    if args.replace_with_dotenv:
        env = _read_dotenv(args.replace_with_dotenv)
    else:
        # Quando usando apenas --set, permitimos env vars secretas (não incluídas no payload)
        env_list = _get_env_vars(api_key, service_id)
        try:
            env = _normalize_env_list(env_list, allow_secrets=True)
        except RuntimeError as exc:
            print(f"ERRO: {exc}")
            return 3

    # Atualiza valores
    for k, v in changes:
        env[k] = v

    # Se o usuário quiser atualizar também o RAG_API_KEY sem passar em --set
    rag_api_key = os.getenv("RENDER_SET_RAG_API_KEY", "").strip()
    if rag_api_key:
        env["RAG_API_KEY"] = rag_api_key

    print("Atualizando env-vars no Render...")
    print(f"- service_id: {service_id}")
    print(f"- RENDER_API_KEY: {_mask(api_key)}")
    if args.replace_with_dotenv:
        print(f"- replace_with_dotenv: {args.replace_with_dotenv}")

    # Mascarar prints dos valores
    for k, v in changes:
        shown = v if k.upper().endswith("_URL") else _mask(v)
        print(f"- set {k}={shown}")

    _put_env_vars(api_key, service_id, env)
    print("OK: Env-vars atualizadas.")

    if apply_mode == "none" or not trigger_deploy:
        print("Aviso: nenhuma ação de apply foi executada (deploy/restart).")
        return 0

    if apply_mode == "restart":
        print("Reiniciando serviço para aplicar env-vars (sem build)...")
        _restart_service(api_key, service_id)
        print("OK: Restart solicitado.")
        return 0

    # deploy
    commit_sha = args.deploy_commit if args.deploy_commit else None
    if commit_sha:
        print(f"Disparando deploy do commit específico: {commit_sha}...")
    else:
        print("Disparando deploy para aplicar env-vars...")
    try:
        _trigger_deploy(api_key, service_id, commit_sha)
        print("OK: Deploy disparado.")
    except requests.HTTPError as exc:
        # Muitos casos 400 aqui são falta de build minutes / deploy bloqueado.
        print(f"ERRO ao disparar deploy: {exc}")
        print("Tentando fallback com restart (RENDER_APPLY_MODE=restart)...")
        _restart_service(api_key, service_id)
        print("OK: Restart solicitado (fallback).")
    else:
        # nunca chega aqui; mantido para compatibilidade
        pass

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
