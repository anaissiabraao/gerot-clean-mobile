"""FASE 4 — Semântica/Regras (com evidência) — Glossário + Joins canônicos.

Gera itens de knowledge com foco em:
- Glossário semântico (termo -> tabelas/colunas relevantes)
- Padrões de join canônicos (templates SQL) para investigação

Importante:
- Não executa queries nem infere regras de negócio fora do que é suportado por schema.
- Tudo que for hipótese é marcado como **INFERIDO**.
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from typing import Any


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _table(schema: dict[str, Any], name: str) -> dict[str, Any]:
    return (schema.get("tables") or {}).get(name) or {}


def _pk(schema: dict[str, Any], name: str) -> list[str]:
    return list(_table(schema, name).get("primary_key") or [])


def _columns(schema: dict[str, Any], name: str) -> list[dict[str, Any]]:
    return list(_table(schema, name).get("columns") or [])


def _fks(schema: dict[str, Any], name: str) -> list[dict[str, Any]]:
    return list(_table(schema, name).get("foreign_keys") or [])


def _find_reverse_fks(schema: dict[str, Any], target_table: str) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for tname, t in (schema.get("tables") or {}).items():
        for fk in (t.get("foreign_keys") or []):
            if fk.get("ref_table") == target_table:
                out.append(
                    {
                        "from_table": tname,
                        "from_column": fk.get("column"),
                        "to_table": target_table,
                        "to_column": fk.get("ref_column"),
                        "constraint": fk.get("constraint"),
                    }
                )
    out.sort(key=lambda x: (x["from_table"], str(x.get("from_column") or "")))
    return out


def _date_like_columns(cols: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    for c in cols:
        n = (c.get("name") or "")
        nl = n.lower()
        dt = (c.get("data_type") or "").lower()
        if dt in {"date", "datetime", "timestamp", "time", "year"}:
            out.append(n)
            continue
        if any(k in nl for k in ("data", "date", "created", "updated", "deleted", "hora", "emissao", "cancel", "encerr")):
            out.append(n)
    seen = set()
    uniq = []
    for x in out:
        if x and x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq


def _status_like_columns(cols: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    for c in cols:
        n = (c.get("name") or "")
        nl = n.lower()
        if any(k in nl for k in ("status", "situac", "estado", "fase", "cancel", "encerr", "bloque", "ativo", "tipo_oco")):
            out.append(n)
    seen = set()
    uniq = []
    for x in out:
        if x and x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq


def _glossary_item(schema: dict[str, Any], term: str, tables: list[str]) -> dict[str, Any]:
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()

    lines: list[str] = []
    lines.append(f"# FASE 4 — Glossário: **{term}** ({db})")
    lines.append("")
    lines.append("## O que é (INFERIDO)")
    lines.append("- Definição inicial baseada em nomenclatura e relações de schema; valide com dados e rotina do sistema.")
    lines.append("")
    lines.append("## Tabelas primárias (evidência)")
    for t in tables:
        tt = _table(schema, t)
        if not tt:
            lines.append(f"- `{t}` (não encontrada no schema)")
            continue
        pk = _pk(schema, t)
        cols = _columns(schema, t)
        lines.append(f"- `{t}` — PK: {', '.join([f'`{c}`' for c in pk]) if pk else '(sem PK explícita)'} | colunas={len(cols)}")
    lines.append("")

    lines.append("## Campos relevantes (INFERIDO, por padrão de nomes/tipos)")
    for t in tables:
        cols = _columns(schema, t)
        dcols = _date_like_columns(cols)
        scols = _status_like_columns(cols)
        if not cols:
            continue
        lines.append(f"- `{t}`:")
        lines.append(f"  - datas/tempo: {', '.join([f'`{c}`' for c in dcols]) or '(nenhum detectado)'}")
        lines.append(f"  - status/estado: {', '.join([f'`{c}`' for c in scols]) or '(nenhum detectado)'}")
    lines.append("")

    lines.append("## Relações (FK) — evidência")
    for t in tables:
        for fk in _fks(schema, t):
            lines.append(f"- `{t}.{fk.get('column')}` → `{fk.get('ref_table')}.{fk.get('ref_column')}` (constraint=`{fk.get('constraint')}`)")
    lines.append("")

    lines.append("## Dependentes (FK IN) — evidência")
    for t in tables:
        rev = _find_reverse_fks(schema, t)
        if not rev:
            continue
        lines.append(f"- Referenciam `{t}`:")
        for e in rev[:30]:
            lines.append(f"  - `{e['from_table']}.{e.get('from_column')}` → `{t}.{e.get('to_column')}` (constraint=`{e.get('constraint')}`)")
        if len(rev) > 30:
            lines.append(f"  - ... truncado (total={len(rev)})")
    lines.append("")

    md = "\n".join(lines)
    return {
        "id": f"db::{db}::phase4::glossary::{term.lower()}",
        "question": f"Glossário: o que significa '{term}' no banco {db}?",
        "answer": md,
        "category": "DB Semantics",
        "synced_at": gen,
        "source": f"mysql::{db}",
        "metadata": {"kind": "db_glossary", "database": db, "term": term, "tables": tables, "evidence": ["information_schema"]},
    }


def _join_pattern_item(schema: dict[str, Any], name: str, description: str, sql: str, tables: list[str]) -> dict[str, Any]:
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()
    md = "\n".join(
        [
            f"# FASE 4 — Join canônico: **{name}** ({db})",
            "",
            "## Objetivo",
            f"- {description}",
            "",
            "## SQL (template, READ-ONLY) — INFERIDO",
            "```sql",
            sql.strip(),
            "```",
            "",
            "## Tabelas envolvidas (evidência)",
            *[f"- `{t}`" for t in tables],
        ]
    )
    return {
        "id": f"db::{db}::phase4::join::{name.lower().replace(' ', '_')}",
        "question": f"Como fazer o join canônico '{name}' no banco {db}?",
        "answer": md,
        "category": "DB Semantics",
        "synced_at": gen,
        "source": f"mysql::{db}",
        "metadata": {"kind": "db_join_pattern", "database": db, "name": name, "tables": tables, "evidence": ["information_schema"]},
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--out", default=os.path.join("data", "db_kb", "phase4_knowledge_items.json"))
    args = parser.parse_args()

    schema = _load(args.schema)

    items: list[dict[str, Any]] = []
    items.append(_glossary_item(schema, "Manifesto", ["manifesto", "manifesto_historico"]))
    items.append(_glossary_item(schema, "Minuta", ["minuta", "alteracoes_minuta"]))
    items.append(_glossary_item(schema, "Coleta", ["coleta", "coleta_historico"]))
    items.append(_glossary_item(schema, "Fatura", ["fatura", "fatura_historico"]))
    items.append(_glossary_item(schema, "Ocorrência/Status (tipo_oco)", ["tipo_oco"]))
    items.append(_glossary_item(schema, "Fornecedor (e Cliente canônico)", ["fornecedores", "hfornecedores"]))

    # Join patterns (baseados nos FKs vistos na trilha; SQL é INFERIDO como “padrão recomendado”)
    items.append(
        _join_pattern_item(
            schema,
            name="Manifesto → Fatura",
            description="Relacionar manifesto com fatura associada (quando existir).",
            sql="""
SELECT m.id_manifesto, m.data_emissao, m.status, m.fatura AS id_fatura, f.emissao, f.vencimento, f.dt_pagamento
FROM azportoex.manifesto m
LEFT JOIN azportoex.fatura f ON f.id_fatura = m.fatura
ORDER BY m.id_manifesto DESC
LIMIT 50;
""",
            tables=["manifesto", "fatura"],
        )
    )
    items.append(
        _join_pattern_item(
            schema,
            name="Minuta → Fatura(s)",
            description="Minuta referencia múltiplas faturas (coleta/entrega/seguro/...).",
            sql="""
SELECT
  mn.id_minuta,
  mn.data_incluido,
  mn.status,
  mn.coleta_fatura,
  mn.entrega_fatura,
  f1.emissao AS coleta_emissao,
  f2.emissao AS entrega_emissao
FROM azportoex.minuta mn
LEFT JOIN azportoex.fatura f1 ON f1.id_fatura = mn.coleta_fatura
LEFT JOIN azportoex.fatura f2 ON f2.id_fatura = mn.entrega_fatura
ORDER BY mn.id_minuta DESC
LIMIT 50;
""",
            tables=["minuta", "fatura"],
        )
    )

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"[OK] Phase4 knowledge items: {args.out} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


