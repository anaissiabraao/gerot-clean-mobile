"""Probe de objeto MySQL (tabela/view) para diagnóstico estrutural.

Motivação:
- Às vezes `information_schema.COLUMNS` não retorna colunas (ex.: views/privileges/definer).
- Este probe consulta diretamente o MySQL para identificar:
  - tipo (BASE TABLE / VIEW)
  - SHOW CREATE TABLE / SHOW CREATE VIEW (quando suportado)
  - DESCRIBE
  - amostra de colunas via SELECT ... LIMIT 0 (sem ler dados)

Uso:
  python scripts/db_kb/mysql_probe_object.py --host portoex.db.brudam.com.br --port 3306 --db azportoex --name clientes
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pymysql


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load_dotenv(env_path: str | None) -> None:
    try:
        from dotenv import load_dotenv  # type: ignore

        if env_path:
            load_dotenv(env_path, override=False)
            return
        # raiz do repo: .../scripts/db_kb/mysql_probe_object.py -> ../../.env
        repo_root = Path(__file__).resolve().parents[2]
        default_env = repo_root / ".env"
        if default_env.exists():
            load_dotenv(default_env, override=False)
    except Exception:
        pass


def _connect(host: str, port: int, user: str, password: str, db: str):
    return pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=db,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=20,
        read_timeout=120,
        write_timeout=120,
    )


def probe_object(*, host: str, port: int, db: str, name: str) -> dict[str, Any]:
    user = os.getenv("MYSQL_AZ_USER", "")
    password = os.getenv("MYSQL_AZ_PASSWORD", "")
    if not user or not password:
        raise SystemExit("Credenciais ausentes: defina MYSQL_AZ_USER e MYSQL_AZ_PASSWORD.")

    out: dict[str, Any] = {
        "generated_at": _utc_now_iso(),
        "server": {"host": host, "port": port},
        "database": db,
        "object": name,
        "table_status": None,
        "describe": None,
        "show_create": None,
        "select_zero_columns": None,
        "errors": [],
    }

    conn = _connect(host, port, user, password, db)
    try:
        cur = conn.cursor()

        # Tipo (TABLE_TYPE)
        try:
            cur.execute(
                """
                SELECT TABLE_NAME, TABLE_TYPE, ENGINE, CREATE_TIME, UPDATE_TIME, TABLE_COMMENT
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
                """,
                (db, name),
            )
            out["table_status"] = cur.fetchone()
        except Exception as e:
            out["errors"].append({"step": "information_schema.TABLES", "error": str(e)})

        # DESCRIBE (funciona para tabelas e geralmente para views)
        try:
            cur.execute(f"DESCRIBE `{name}`")
            out["describe"] = cur.fetchall()
        except Exception as e:
            out["errors"].append({"step": "DESCRIBE", "error": str(e)})

        # SHOW CREATE (tenta TABLE e depois VIEW)
        sc = None
        try:
            cur.execute(f"SHOW CREATE TABLE `{name}`")
            sc = cur.fetchone()
        except Exception as e:
            out["errors"].append({"step": "SHOW CREATE TABLE", "error": str(e)})
        if not sc:
            try:
                cur.execute(f"SHOW CREATE VIEW `{name}`")
                sc = cur.fetchone()
            except Exception as e:
                out["errors"].append({"step": "SHOW CREATE VIEW", "error": str(e)})
        out["show_create"] = sc

        # SELECT ... LIMIT 0 (colunas pelo cursor.description)
        try:
            cur.execute(f"SELECT * FROM `{name}` LIMIT 0")
            cols = []
            if getattr(cur, "description", None):
                for d in cur.description:
                    # d[0] = name
                    cols.append(str(d[0]))
            out["select_zero_columns"] = cols
        except Exception as e:
            out["errors"].append({"step": "SELECT LIMIT 0", "error": str(e)})

        cur.close()
        return out
    finally:
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", default="", help="Path opcional para .env")
    parser.add_argument("--host", required=True)
    parser.add_argument("--port", default="3306")
    parser.add_argument("--db", default="azportoex")
    parser.add_argument("--name", required=True)
    parser.add_argument("--out", default="")
    args = parser.parse_args()

    _load_dotenv((args.env or "").strip() or None)

    try:
        port = int(args.port)
    except Exception:
        raise SystemExit(f"Port inválida: {args.port!r}")

    result = probe_object(host=args.host, port=port, db=args.db, name=args.name)

    out_path = (args.out or "").strip()
    if not out_path:
        out_path = os.path.join("data", "db_kb", "probes", f"{args.db}.{args.name}.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2, default=str)
    print(f"[OK] Probe salvo: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


