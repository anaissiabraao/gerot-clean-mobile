"""Tool de consulta MySQL (read-only) para o agente.

Regras de segurança:
- Executa APENAS queries de um catálogo (templates whitelisted).
- Sempre aplica LIMIT e timeouts.
- Não aceita SQL livre do usuário/LLM.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import Any, Callable, Optional

import pymysql

from .config import settings


@dataclass(frozen=True)
class SqlResult:
    query_name: str
    sql: str
    params: dict[str, Any]
    rows: list[dict[str, Any]]


def _connect():
    if not settings.mysql_user or not settings.mysql_password:
        raise RuntimeError("Credenciais MySQL ausentes (MYSQL_AZ_USER/MYSQL_AZ_PASSWORD).")
    return pymysql.connect(
        host=settings.mysql_host,
        port=int(settings.mysql_port),
        user=settings.mysql_user,
        password=settings.mysql_password,
        database=settings.mysql_db,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=min(20, max(3, int(settings.agent_sql_timeout_s))),
        read_timeout=min(60, max(3, int(settings.agent_sql_timeout_s))),
        write_timeout=min(60, max(3, int(settings.agent_sql_timeout_s))),
    )


def _parse_days_range(question: str) -> tuple[date, date]:
    """INFERIDO (controlado): interpreta janelas simples de tempo."""
    q = (question or "").lower()
    today = date.today()
    if "ontem" in q:
        d = today - timedelta(days=1)
        return d, d
    if "hoje" in q or "agora" in q:
        return today, today
    m = re.search(r"ultim[oa]s?\s+(\d{1,3})\s+dias", q)
    if m:
        n = max(1, min(365, int(m.group(1))))
        return today - timedelta(days=n - 1), today
    # default conservador: hoje
    return today, today


def _limit(max_rows: int | None = None) -> int:
    max_rows = int(max_rows or settings.agent_sql_max_rows or 50)
    return max(1, min(max_rows, 200))


def _tmpl_manifesto_count_by_emissao(question: str) -> tuple[str, dict[str, Any]]:
    d0, d1 = _parse_days_range(question)
    sql = """
SELECT COUNT(*) AS total
FROM azportoex.manifesto
WHERE data_emissao BETWEEN %(d0)s AND %(d1)s
""".strip()
    return sql, {"d0": d0.isoformat(), "d1": d1.isoformat()}


def _tmpl_manifesto_recent(question: str) -> tuple[str, dict[str, Any]]:
    sql = f"""
SELECT id_manifesto, data_emissao, hora_emissao, status, tipo, motorista, veiculo, destino
FROM azportoex.manifesto
ORDER BY id_manifesto DESC
LIMIT {_limit()}
""".strip()
    return sql, {}


def _tmpl_minuta_count_by_data_incluido(question: str) -> tuple[str, dict[str, Any]]:
    d0, d1 = _parse_days_range(question)
    sql = """
SELECT COUNT(*) AS total
FROM azportoex.minuta
WHERE DATE(data_incluido) BETWEEN %(d0)s AND %(d1)s
""".strip()
    return sql, {"d0": d0.isoformat(), "d1": d1.isoformat()}


def _tmpl_minuta_recent(question: str) -> tuple[str, dict[str, Any]]:
    sql = f"""
SELECT id_minuta, data_incluido, status, cte_status, coleta_data, coleta_hora, data_entrega, prev_entrega
FROM azportoex.minuta
ORDER BY id_minuta DESC
LIMIT {_limit()}
""".strip()
    return sql, {}


def _tmpl_coleta_count_by_data_incluido(question: str) -> tuple[str, dict[str, Any]]:
    d0, d1 = _parse_days_range(question)
    sql = """
SELECT COUNT(*) AS total
FROM azportoex.coleta
WHERE DATE(data_incluido) BETWEEN %(d0)s AND %(d1)s
""".strip()
    return sql, {"d0": d0.isoformat(), "d1": d1.isoformat()}


def _tmpl_coleta_recent(question: str) -> tuple[str, dict[str, Any]]:
    sql = f"""
SELECT id_coleta, data_incluido, status, coleta_data, coleta_hora, entrega_data, entrega_hora, id_cliente
FROM azportoex.coleta
ORDER BY id_coleta DESC
LIMIT {_limit()}
""".strip()
    return sql, {}


# Catálogo whitelisted (nome -> builder)
TEMPLATES: dict[str, Callable[[str], tuple[str, dict[str, Any]]]] = {
    "manifesto.count_by_data_emissao": _tmpl_manifesto_count_by_emissao,
    "manifesto.recent": _tmpl_manifesto_recent,
    "minuta.count_by_data_incluido": _tmpl_minuta_count_by_data_incluido,
    "minuta.recent": _tmpl_minuta_recent,
    "coleta.count_by_data_incluido": _tmpl_coleta_count_by_data_incluido,
    "coleta.recent": _tmpl_coleta_recent,
}


def choose_query_template(question: str) -> Optional[str]:
    """Decisão determinística (sem LLM) para escolher um template."""
    q = (question or "").lower()
    wants_count = any(k in q for k in ("quantos", "quantas", "qtd", "total", "quantidade", "número", "numero"))
    wants_recent = any(k in q for k in ("listar", "lista", "últim", "ultim", "recent", "recentes"))

    if any(k in q for k in ("manifesto", "manifestos")):
        if wants_count:
            return "manifesto.count_by_data_emissao"
        if wants_recent:
            return "manifesto.recent"
    if any(k in q for k in ("minuta", "minutas")):
        if wants_count:
            return "minuta.count_by_data_incluido"
        if wants_recent:
            return "minuta.recent"
    if any(k in q for k in ("coleta", "coletas")):
        if wants_count:
            return "coleta.count_by_data_incluido"
        if wants_recent:
            return "coleta.recent"

    return None


def run_mysql_template(template_name: str, question: str) -> SqlResult:
    if not settings.agent_sql_enabled:
        raise RuntimeError("Agent SQL está desabilitado (RAG_AGENT_SQL_ENABLED=false).")
    if template_name not in TEMPLATES:
        raise RuntimeError(f"Template SQL não permitido: {template_name}")

    sql, params = TEMPLATES[template_name](question)
    # segurança adicional: forçar SELECT-only
    if not re.match(r"^\s*select\b", sql, flags=re.IGNORECASE):
        raise RuntimeError("Template inválido: não começa com SELECT.")

    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        rows = list(cur.fetchall() or [])
        # aplica limite defensivo mesmo que o template esqueça
        maxr = _limit()
        if len(rows) > maxr:
            rows = rows[:maxr]
        cur.close()
        return SqlResult(query_name=template_name, sql=sql, params=params, rows=rows)
    finally:
        conn.close()


