#!/usr/bin/env python3
"""
Migra schema + dados do Postgres do Supabase para o Postgres do Railway.

Variáveis de ambiente:
  SUPABASE_DATABASE_URL  - origem (Supabase)
  DATABASE_URL           - destino (Railway), ou DIRECT_URL / DATABASE_PUBLIC_URL

Uso:
  python scripts/migrate_supabase_to_railway.py              # migração completa
  python scripts/migrate_supabase_to_railway.py --schema-only # só cria schema no Railway
  python scripts/migrate_supabase_to_railway.py --data-only   # só copia dados (schema já existe)
"""
import os
import sys
import argparse

# Carrega .env do projeto
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

import psycopg2
import psycopg2.extras


# Ordem de tabelas para respeitar FKs (origem do app_production.py e db/)
TABLE_ORDER = [
    "users_new",
    "dashboards",
    "user_dashboards",
    "planner_sync_logs",
    "assets",
    "asset_assignments",
    "asset_logs",
    "relatorio_meta_settings",
    "relatorio_layouts",
    "agent_rpa_types",
    "agent_data_sources",
    "agent_settings",
    "agent_rpas",
    "agent_dashboard_requests",
    "agent_logs",
    "agent_dashboard_templates",
    "agent_conversations",
    "agent_messages",
    "agent_knowledge_base",
    "agent_library_models",
    "environments",
    "environment_resources",
    "room_bookings",
]


def get_connection(url: str, statement_timeout_sec: int = 0):
    conn = psycopg2.connect(url, cursor_factory=psycopg2.extras.RealDictCursor)
    if statement_timeout_sec > 0:
        with conn.cursor() as c:
            c.execute(f"SET statement_timeout = '{statement_timeout_sec}s'")
        conn.commit()
    return conn


def list_public_tables(conn) -> list[str]:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name
        """)
        return [r["table_name"] for r in cur.fetchall()]


def ordered_tables(conn_src) -> list[str]:
    """Retorna tabelas na ordem de dependência (FK)."""
    all_src = set(list_public_tables(conn_src))
    ordered = [t for t in TABLE_ORDER if t in all_src]
    remaining = sorted(all_src - set(ordered))
    return ordered + remaining


def _adapt_value(val):
    """Converte dict/list para JSONB (psycopg2.extras.Json)."""
    if isinstance(val, dict) or isinstance(val, list):
        return psycopg2.extras.Json(val)
    return val


def copy_table(src_conn, dst_conn, table: str, batch_size: int = 500) -> int:
    with src_conn.cursor() as cur_src:
        cur_src.execute(f'SELECT * FROM "{table}"')
        columns = [d[0] for d in cur_src.description]
    cols_str = ", ".join(f'"{c}"' for c in columns)
    placeholders = ", ".join("%s" for _ in columns)
    insert_sql = f'INSERT INTO "{table}" ({cols_str}) VALUES ({placeholders})'

    total = 0
    skip_rest_of_table = False
    with src_conn.cursor() as cur_src:
        cur_src.execute(f'SELECT * FROM "{table}"')
        while True:
            rows = cur_src.fetchmany(batch_size)
            if not rows or skip_rest_of_table:
                break
            for row in rows:
                params = [_adapt_value(row[c]) for c in columns]
                try:
                    with dst_conn.cursor() as cur_dst:
                        cur_dst.execute(insert_sql, params)
                    dst_conn.commit()
                    total += 1
                except psycopg2.Error as e:
                    dst_conn.rollback()
                    if e.pgcode == "42P01":
                        print(f"  {table}: (tabela não existe no destino, pulando)")
                        skip_rest_of_table = True
                        break
                    print(f"  [AVISO] {table} linha ignorada: {e}", file=sys.stderr)
                except Exception as e:
                    dst_conn.rollback()
                    print(f"  [AVISO] {table} linha ignorada: {e}", file=sys.stderr)
    return total


def sync_sequences(dst_conn, table: str) -> None:
    try:
        with dst_conn.cursor() as cur:
            cur.execute("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = %s
                  AND column_default LIKE 'nextval%%'
            """, (table,))
            for r in cur.fetchall():
                col = r["column_name"]
                cur.execute(
                    'SELECT setval(pg_get_serial_sequence(%s, %s), GREATEST(COALESCE((SELECT MAX("' + col + '") FROM "' + table + '"), 1), 1))',
                    (table, col),
                )
    except Exception:
        pass


def run_pg_dump_restore(url_src: str, url_dst: str, schema_only: bool) -> bool:
    """Usa pg_dump + pg_restore se disponíveis. Retorna True se executou."""
    import subprocess
    import tempfile

    try:
        with tempfile.NamedTemporaryFile(suffix=".dump", delete=False) as f:
            dump_path = f.name
        args_dump = [
            "pg_dump",
            url_src,
            "--schema=public",
            "--no-owner",
            "--no-acl",
            "-Fc",
            "-f",
            dump_path,
        ]
        if schema_only:
            args_dump.append("--schema-only")
        subprocess.run(args_dump, check=True, capture_output=True, text=True)
        args_restore = [
            "pg_restore",
            "--dbname=" + url_dst,
            "--no-owner",
            "--no-acl",
            "--clean",
            "--if-exists",
            dump_path,
        ]
        out = subprocess.run(args_restore, capture_output=True, text=True)
        try:
            os.unlink(dump_path)
        except Exception:
            pass
        if out.returncode != 0 and "does not exist" not in (out.stderr or ""):
            print(out.stderr or out.stdout, file=sys.stderr)
            return False
        return True
    except FileNotFoundError:
        return False
    except subprocess.CalledProcessError as e:
        print(f"pg_dump falhou: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="Migra Supabase → Railway PG")
    parser.add_argument("--schema-only", action="store_true", help="Só criar schema no destino (via dump)")
    parser.add_argument("--data-only", action="store_true", help="Só copiar dados (schema já existe)")
    parser.add_argument("--truncate-destination", action="store_true", help="Trunca tabelas no Railway antes de copiar (evita duplicatas)")
    parser.add_argument("--no-pg-dump", action="store_true", help="Não usar pg_dump/pg_restore, só Python")
    parser.add_argument("--timeout", type=int, default=600, help="Timeout em segundos por comando no destino (default 600; use 0 para desativar)")
    args = parser.parse_args()

    url_src = os.getenv("SUPABASE_DATABASE_URL") or os.getenv("SUPABASE_DB_URL")
    url_dst = (
        os.getenv("DATABASE_PUBLIC_URL")
        or os.getenv("DIRECT_URL")
        or os.getenv("DATABASE_URL")
    )

    if not url_src:
        print("ERRO: defina SUPABASE_DATABASE_URL no .env", file=sys.stderr)
        sys.exit(1)
    if not url_dst:
        print("ERRO: defina DATABASE_URL (ou DIRECT_URL / DATABASE_PUBLIC_URL) no .env", file=sys.stderr)
        sys.exit(1)

    if not args.no_pg_dump and not args.data_only:
        print("Tentando migração via pg_dump/pg_restore...")
        if run_pg_dump_restore(url_src, url_dst, schema_only=args.schema_only):
            print("Migração concluída (pg_dump/pg_restore).")
            return
        print("pg_dump não disponível ou falhou; usando cópia via Python.\n")

    print("Conectando Supabase (origem)...")
    src = get_connection(url_src)
    print("Conectando Railway (destino)...")
    dst = get_connection(url_dst, statement_timeout_sec=args.timeout)

    try:
        tables = ordered_tables(src)
        print(f"Tabelas a migrar: {len(tables)}")

        if not args.data_only:
            print("Exportando schema da origem...")
            with src.cursor() as cur:
                cur.execute("""
                    SELECT 'CREATE TABLE IF NOT EXISTS ' || quote_ident(table_name) || ' ('
                      || string_agg(
                          quote_ident(column_name) || ' ' || data_type,
                          ', '
                        ) || ');'
                    FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = ANY(%s)
                    GROUP BY table_name
                """, (tables,))
            # Nota: o schema real é mais complexo (PK, FK, etc). Melhor usar ensure_schema no destino.
            print("No modo Python puro, o schema deve já existir no Railway (rode o app uma vez ou use --no-pg-dump após instalar pg_dump).")
            print("Copiando dados...")

        if args.data_only or args.truncate_destination:
            dst_tables = set(list_public_tables(dst))
            print("Truncando tabelas no destino (ordem reversa)...")
            for table in reversed(tables):
                if table not in dst_tables:
                    continue
                try:
                    with dst.cursor() as cur:
                        cur.execute(f'TRUNCATE TABLE "{table}" CASCADE')
                    dst.commit()
                except Exception as e:
                    print(f"  truncate {table}: {e}", file=sys.stderr)
                    dst.rollback()

        for table in tables:
            try:
                dst.rollback()  # garante estado limpo antes de cada tabela (evita cascata após timeout)
                n = copy_table(src, dst, table)
                sync_sequences(dst, table)
                print(f"  {table}: {n} linhas")
            except psycopg2.Error as e:
                dst.rollback()
                if e.pgcode == "42P01":
                    print(f"  {table}: (tabela não existe no destino, ignorando)")
                else:
                    print(f"  {table}: ERRO {e}", file=sys.stderr)
            except Exception as e:
                dst.rollback()
                print(f"  {table}: ERRO {e}", file=sys.stderr)

        print("Migração concluída.")
    finally:
        src.close()
        dst.close()


if __name__ == "__main__":
    main()
