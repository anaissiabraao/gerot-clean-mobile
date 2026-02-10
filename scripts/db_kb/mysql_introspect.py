"""Introspecção estrutural do MySQL para construir Knowledge Base (RAG).

Regras:
- NÃO infere sem evidência: este módulo só extrai estrutura (DDL implícito via information_schema).
- É seguro para produção: apenas SELECT em information_schema.

Uso (Windows / PowerShell):
  python scripts/db_kb/mysql_introspect.py --out data/db_kb/azportoex_schema.json

Credenciais (env):
  MYSQL_AZ_HOST, MYSQL_AZ_PORT, MYSQL_AZ_USER, MYSQL_AZ_PASSWORD, MYSQL_AZ_DB (default azportoex)
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import pymysql


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class MysqlConfig:
    host: str
    port: int
    user: str
    password: str
    database: str

    @staticmethod
    def from_env() -> "MysqlConfig":
        return MysqlConfig(
            host=os.getenv("MYSQL_AZ_HOST", "10.147.17.88"),
            port=int(os.getenv("MYSQL_AZ_PORT", "3306")),
            user=os.getenv("MYSQL_AZ_USER", ""),
            password=os.getenv("MYSQL_AZ_PASSWORD", ""),
            database=os.getenv("MYSQL_AZ_DB", "azportoex"),
        )


def _connect(cfg: MysqlConfig):
    return pymysql.connect(
        host=cfg.host,
        port=cfg.port,
        user=cfg.user,
        password=cfg.password,
        database=cfg.database,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=20,
        read_timeout=120,
        write_timeout=120,
    )


def extract_schema(cfg: MysqlConfig) -> dict[str, Any]:
    """Extrai estrutura do schema a partir de information_schema + SHOW FULL TABLES fallback."""
    out: dict[str, Any] = {
        "generated_at": _utc_now_iso(),
        "source": "information_schema",
        "database": cfg.database,
        "server": {"host": cfg.host, "port": cfg.port},
        "tables": {},
    }

    conn = _connect(cfg)
    try:
        cur = conn.cursor()

        # 1) Lista de tabelas base (exclui views) + metadados (engine, rows estimado etc.)
        cur.execute(
            """
            SELECT
              t.TABLE_NAME,
              t.TABLE_TYPE,
              t.ENGINE,
              t.TABLE_ROWS,
              t.CREATE_TIME,
              t.UPDATE_TIME,
              t.TABLE_COLLATION,
              t.TABLE_COMMENT
            FROM information_schema.TABLES t
            WHERE t.TABLE_SCHEMA = %s
            ORDER BY t.TABLE_NAME
            """,
            (cfg.database,),
        )
        tables = cur.fetchall() or []

        for t in tables:
            name = t["TABLE_NAME"]
            out["tables"][name] = {
                "table_type": t.get("TABLE_TYPE"),
                "engine": t.get("ENGINE"),
                "table_rows_estimate": int(t.get("TABLE_ROWS") or 0),
                "create_time": (t.get("CREATE_TIME").isoformat() if t.get("CREATE_TIME") else None),
                "update_time": (t.get("UPDATE_TIME").isoformat() if t.get("UPDATE_TIME") else None),
                "collation": t.get("TABLE_COLLATION"),
                "comment": t.get("TABLE_COMMENT"),
                "columns": [],
                "primary_key": [],
                "foreign_keys": [],
                "indexes": [],
            }

        # 2) Colunas
        cur.execute(
            """
            SELECT
              c.TABLE_NAME,
              c.ORDINAL_POSITION,
              c.COLUMN_NAME,
              c.COLUMN_TYPE,
              c.DATA_TYPE,
              c.IS_NULLABLE,
              c.COLUMN_DEFAULT,
              c.EXTRA,
              c.COLUMN_KEY,
              c.COLLATION_NAME,
              c.CHARACTER_SET_NAME,
              c.COLUMN_COMMENT
            FROM information_schema.COLUMNS c
            WHERE c.TABLE_SCHEMA = %s
            ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION
            """,
            (cfg.database,),
        )
        for row in cur.fetchall() or []:
            table = row["TABLE_NAME"]
            if table not in out["tables"]:
                continue
            out["tables"][table]["columns"].append(
                {
                    "ordinal": int(row.get("ORDINAL_POSITION") or 0),
                    "name": row.get("COLUMN_NAME"),
                    "column_type": row.get("COLUMN_TYPE"),
                    "data_type": row.get("DATA_TYPE"),
                    "nullable": (row.get("IS_NULLABLE") == "YES"),
                    "default": row.get("COLUMN_DEFAULT"),
                    "extra": row.get("EXTRA"),
                    "column_key": row.get("COLUMN_KEY"),  # PRI/UNI/MUL (heurístico)
                    "collation": row.get("COLLATION_NAME"),
                    "charset": row.get("CHARACTER_SET_NAME"),
                    "comment": row.get("COLUMN_COMMENT"),
                }
            )

        # 3) Primary key
        cur.execute(
            """
            SELECT
              kcu.TABLE_NAME,
              kcu.COLUMN_NAME,
              kcu.ORDINAL_POSITION
            FROM information_schema.KEY_COLUMN_USAGE kcu
            WHERE kcu.TABLE_SCHEMA = %s
              AND kcu.CONSTRAINT_NAME = 'PRIMARY'
            ORDER BY kcu.TABLE_NAME, kcu.ORDINAL_POSITION
            """,
            (cfg.database,),
        )
        for row in cur.fetchall() or []:
            table = row["TABLE_NAME"]
            if table in out["tables"]:
                out["tables"][table]["primary_key"].append(row["COLUMN_NAME"])

        # 4) Foreign keys (somente explícitas: constraints reais)
        cur.execute(
            """
            SELECT
              kcu.CONSTRAINT_NAME,
              kcu.TABLE_NAME,
              kcu.COLUMN_NAME,
              kcu.REFERENCED_TABLE_NAME,
              kcu.REFERENCED_COLUMN_NAME,
              kcu.ORDINAL_POSITION,
              rc.UPDATE_RULE,
              rc.DELETE_RULE
            FROM information_schema.KEY_COLUMN_USAGE kcu
            LEFT JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
              ON rc.CONSTRAINT_SCHEMA = kcu.TABLE_SCHEMA
             AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE kcu.TABLE_SCHEMA = %s
              AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY kcu.TABLE_NAME, kcu.CONSTRAINT_NAME, kcu.ORDINAL_POSITION
            """,
            (cfg.database,),
        )
        for row in cur.fetchall() or []:
            table = row["TABLE_NAME"]
            if table not in out["tables"]:
                continue
            out["tables"][table]["foreign_keys"].append(
                {
                    "constraint": row.get("CONSTRAINT_NAME"),
                    "column": row.get("COLUMN_NAME"),
                    "ref_table": row.get("REFERENCED_TABLE_NAME"),
                    "ref_column": row.get("REFERENCED_COLUMN_NAME"),
                    "ordinal": int(row.get("ORDINAL_POSITION") or 0),
                    "on_update": row.get("UPDATE_RULE"),
                    "on_delete": row.get("DELETE_RULE"),
                }
            )

        # 5) Índices
        cur.execute(
            """
            SELECT
              s.TABLE_NAME,
              s.INDEX_NAME,
              s.NON_UNIQUE,
              s.SEQ_IN_INDEX,
              s.COLUMN_NAME,
              s.COLLATION,
              s.CARDINALITY,
              s.SUB_PART,
              s.PACKED,
              s.NULLABLE,
              s.INDEX_TYPE
            FROM information_schema.STATISTICS s
            WHERE s.TABLE_SCHEMA = %s
            ORDER BY s.TABLE_NAME, s.INDEX_NAME, s.SEQ_IN_INDEX
            """,
            (cfg.database,),
        )
        # agrupamento por (tabela, índice)
        idx_map: dict[tuple[str, str], dict[str, Any]] = {}
        for row in cur.fetchall() or []:
            table = row["TABLE_NAME"]
            if table not in out["tables"]:
                continue
            key = (table, row["INDEX_NAME"])
            if key not in idx_map:
                idx_map[key] = {
                    "name": row.get("INDEX_NAME"),
                    "non_unique": bool(row.get("NON_UNIQUE")),
                    "index_type": row.get("INDEX_TYPE"),
                    "columns": [],
                }
            idx_map[key]["columns"].append(
                {
                    "seq": int(row.get("SEQ_IN_INDEX") or 0),
                    "column": row.get("COLUMN_NAME"),
                    "collation": row.get("COLLATION"),
                    "sub_part": row.get("SUB_PART"),
                    "nullable": row.get("NULLABLE"),
                }
            )
        for (table, _), idx in idx_map.items():
            out["tables"][table]["indexes"].append(idx)

        cur.close()
        return out
    finally:
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--env",
        default="",
        help="Caminho para arquivo .env (opcional). Se omitido, tenta carregar .env da raiz do projeto.",
    )
    parser.add_argument("--host", default="", help="Override do host MySQL (opcional).")
    parser.add_argument("--port", default="", help="Override da porta MySQL (opcional). Ex.: 3306 ou 3307.")
    parser.add_argument("--db", default="", help="Override do database/schema (opcional). Ex.: azportoex.")
    parser.add_argument("--out", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    args = parser.parse_args()

    # Carregar .env (conveniência local). Se python-dotenv não estiver instalado, segue só com env do processo.
    try:
        from dotenv import load_dotenv  # type: ignore

        env_path = (args.env or "").strip()
        if env_path:
            load_dotenv(env_path, override=False)
        else:
            # Assume raiz do repo: .../scripts/db_kb/mysql_introspect.py -> ../../.env
            repo_root = Path(__file__).resolve().parents[2]
            default_env = repo_root / ".env"
            if default_env.exists():
                load_dotenv(default_env, override=False)
    except Exception:
        pass

    cfg = MysqlConfig.from_env()
    # Overrides via CLI (útil para testar rapidamente sem mexer no .env)
    host = (args.host or "").strip()
    db = (args.db or "").strip()
    port_raw = (args.port or "").strip()
    if host:
        cfg = MysqlConfig(host=host, port=cfg.port, user=cfg.user, password=cfg.password, database=cfg.database)
    if db:
        cfg = MysqlConfig(host=cfg.host, port=cfg.port, user=cfg.user, password=cfg.password, database=db)
    if port_raw:
        try:
            cfg = MysqlConfig(host=cfg.host, port=int(port_raw), user=cfg.user, password=cfg.password, database=cfg.database)
        except Exception:
            raise SystemExit(f"Port inválida em --port: {port_raw!r}")

    if not cfg.user or not cfg.password:
        raise SystemExit(
            "Credenciais ausentes. Defina MYSQL_AZ_USER e MYSQL_AZ_PASSWORD (e opcionalmente MYSQL_AZ_HOST/PORT/DB)."
        )

    # Execução com mensagem de erro amigável (evita stack trace gigante)
    try:
        schema = extract_schema(cfg)
    except pymysql.err.OperationalError as exc:
        # Erros comuns:
        # - WinError 10061: conexão recusada (porta errada ou firewall)
        # - 2003: não conecta ao servidor
        msg = str(exc)
        raise SystemExit(
            "Falha ao conectar no MySQL para introspecção.\n"
            f"- Host: {cfg.host}\n"
            f"- Porta: {cfg.port}\n"
            f"- Database: {cfg.database}\n"
            f"- Erro: {msg}\n\n"
            "Checklist (rápido):\n"
            "- Você está na rede correta (ZeroTier/VPN) que alcança o host?\n"
            "- A porta está correta? Teste 3306 vs 3307.\n"
            "- O MySQL está aceitando conexões remotas nesse IP/porta (bind-address/firewall)?\n\n"
            "Dica: você pode testar rapidamente com:\n"
            "  python scripts/db_kb/mysql_introspect.py --host portoex.db.brudam.com.br --port 3306\n"
            "  python scripts/db_kb/mysql_introspect.py --host 10.147.17.88 --port 3307\n"
        ) from exc
    out_path = args.out
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(schema, f, ensure_ascii=False, indent=2)
    print(f"[OK] Schema exportado: {out_path} (tabelas={len(schema.get('tables') or {})})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


