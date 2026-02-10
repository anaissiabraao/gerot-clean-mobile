"""FASE 1 — Mapeamento Global do Banco (a partir do schema extraído).

Entrada: JSON gerado por scripts/db_kb/mysql_introspect.py
Saídas:
- Markdown: Visão Geral do Banco de Dados (domínios, tabelas centrais, estatísticas)
- JSON (knowledge items): pronto para ingestão no RAG (metadata rica)
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _slug(text: str) -> str:
    t = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").strip().lower()).strip("-")
    return t or "x"


def _guess_domain(table_name: str) -> tuple[str, str]:
    """Heurística determinística por nome (inferência explícita). Retorna (domínio, evidência)."""
    t = (table_name or "").lower()

    rules: list[tuple[str, str]] = [
        ("seguranca_autenticacao", r"(user|usuario|usuarios|perfil|role|permiss|auth|login|token|sess)"),
        ("cadastros_base", r"(cliente|fornec|produto|item|cadastro|empresa|filial|porto|agente)"),
        ("fiscal_documentos", r"(nf|nfe|nfse|cte|mdfe|nota|fiscal|cfop|cst|icms|pis|cofins)"),
        ("operacao_logistica", r"(manifesto|cte|mdfe|romane|viagem|rota|motorista|veicul|placa|frete)"),
        ("financeiro", r"(fatur|cobr|pag|receb|conta|banco|caixa|boleto|pix|tarifa|juros)"),
        ("estoque", r"(estoque|almox|deposito|armaz|invent|mov_estoq)"),
        ("configuracao", r"(config|param|setting|opcao|preferenc|sys_)"),
        ("auditoria_logs", r"(log|audit|hist|history|evento|event|trace)"),
        ("integracoes", r"(sync|integr|import|export|api|webhook|queue)"),
        ("tabelas_auxiliares", r"(_tmp|tmp_|backup|bkp|old_|_old|teste|test_)"),
    ]
    for dom, rx in rules:
        if re.search(rx, t):
            return dom, f"inferido_por_nome:/{rx}/"
    return "nao_classificado", "inferido_por_nome:sem_match"


def _build_fk_graph(schema: dict[str, Any]) -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    """Grafo por FKs explícitas (evidência estrutural)."""
    out_edges: dict[str, set[str]] = defaultdict(set)
    in_edges: dict[str, set[str]] = defaultdict(set)
    tables = schema.get("tables") or {}
    for tname, t in tables.items():
        for fk in (t.get("foreign_keys") or []):
            ref = fk.get("ref_table")
            if ref:
                out_edges[tname].add(ref)
                in_edges[ref].add(tname)
    return out_edges, in_edges


def _centrality(schema: dict[str, Any]) -> list[dict[str, Any]]:
    """Centralidade simples por grau (somente FKs explícitas)."""
    out_edges, in_edges = _build_fk_graph(schema)
    tables = schema.get("tables") or {}
    scores = []
    for t in tables.keys():
        outd = len(out_edges.get(t) or set())
        ind = len(in_edges.get(t) or set())
        scores.append({"table": t, "in_degree": ind, "out_degree": outd, "degree": ind + outd})
    scores.sort(key=lambda x: (x["degree"], x["in_degree"], x["out_degree"], x["table"]), reverse=True)
    return scores


def _render_markdown(schema: dict[str, Any], domains: dict[str, list[str]], central: list[dict[str, Any]]) -> str:
    db = schema.get("database") or "?"
    gen = schema.get("generated_at") or "?"
    total = len(schema.get("tables") or {})
    fk_total = 0
    for t in (schema.get("tables") or {}).values():
        fk_total += len(t.get("foreign_keys") or [])

    lines = []
    lines.append(f"# Visão Geral do Banco de Dados ({db})")
    lines.append("")
    lines.append(f"- Gerado em (UTC): **{gen}**")
    lines.append(f"- Total de tabelas: **{total}**")
    lines.append(f"- Total de FKs explícitas: **{fk_total}**")
    lines.append("")
    lines.append("## Domínios (classificação inferida por nome)")
    lines.append("> Observação: esta classificação é **inferida** (heurística por nome). Pode ser refinada na FASE 2/4.")
    lines.append("")
    for dom in sorted(domains.keys()):
        tbls = domains[dom]
        lines.append(f"### {dom} ({len(tbls)})")
        for t in tbls:
            lines.append(f"- `{t}`")
        lines.append("")

    lines.append("## Tabelas centrais (por grau de relacionamento via FK explícita)")
    lines.append("> Observação: se o banco não tiver constraints FK definidas, esta métrica ficará limitada.")
    lines.append("")
    lines.append("| Tabela | Grau | Entradas (in) | Saídas (out) |")
    lines.append("|---|---:|---:|---:|")
    for row in central[:50]:
        lines.append(f"| `{row['table']}` | {row['degree']} | {row['in_degree']} | {row['out_degree']} |")
    lines.append("")
    return "\n".join(lines)


def _knowledge_items(schema: dict[str, Any], domains: dict[str, list[str]], central: list[dict[str, Any]]) -> list[dict[str, Any]]:
    db = schema.get("database") or "?"
    gen = schema.get("generated_at") or _utc_now_iso()
    items: list[dict[str, Any]] = []

    md = _render_markdown(schema, domains, central)
    items.append(
        {
            "id": f"db::{db}::phase1::overview::{_slug(gen)}",
            "question": f"Visão geral do banco {db}: domínios, tabelas e relacionamentos",
            "answer": md,
            "category": "DB Schema",
            "synced_at": gen,
            "source": f"mysql::{db}",
            "metadata": {
                "kind": "db_phase1_overview",
                "database": db,
                "generated_at": gen,
                "evidence": ["information_schema", "heuristica_por_nome", "grafo_fk_explicita"],
            },
        }
    )

    # Um item por domínio (para retrieval por domínio)
    for dom, tbls in sorted(domains.items(), key=lambda x: x[0]):
        items.append(
            {
                "id": f"db::{db}::phase1::domain::{dom}",
                "question": f"Quais tabelas pertencem ao domínio '{dom}' no banco {db}?",
                "answer": "\n".join([f"- `{t}`" for t in tbls]) or "(vazio)",
                "category": "DB Domains",
                "synced_at": gen,
                "source": f"mysql::{db}",
                "metadata": {
                    "kind": "db_phase1_domain_tables",
                    "database": db,
                    "domain": dom,
                    "tables_count": len(tbls),
                    "evidence": ["heuristica_por_nome"],
                },
            }
        )

    return items


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--out-md", default=os.path.join("data", "db_kb", "phase1_visao_geral.md"))
    parser.add_argument("--out-items", default=os.path.join("data", "db_kb", "phase1_knowledge_items.json"))
    args = parser.parse_args()

    schema = _load(args.schema)
    tables = sorted((schema.get("tables") or {}).keys())

    domains: dict[str, list[str]] = defaultdict(list)
    for t in tables:
        dom, _ev = _guess_domain(t)
        domains[dom].append(t)
    # ordenar tabelas dentro de cada domínio
    for dom in list(domains.keys()):
        domains[dom] = sorted(domains[dom])

    central = _centrality(schema)
    md = _render_markdown(schema, domains, central)
    os.makedirs(os.path.dirname(args.out_md), exist_ok=True)
    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write(md)

    items = _knowledge_items(schema, domains, central)
    with open(args.out_items, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"[OK] FASE1 Markdown: {args.out_md}")
    print(f"[OK] FASE1 Knowledge items: {args.out_items} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


