"""FASE 3 — Ciclo de vida candidato (INFERIDO) para entidades-âncora.

Objetivo:
- A partir do schema (information_schema) e de um recorte (seeds + hops),
  gerar um documento que descreve:
  - relações estruturais (PK/FK, dependências, satélites)
  - sinais de histórico/eventos (tabelas *_hist/*_historico/log*)
  - colunas de data/status que sugerem estágios do ciclo de vida
  - hipóteses de fluxo (INFERIDO) + checklist de validação (queries sugeridas)

Regras:
- Não inventar sem evidência: o que é estrutura vem do schema.
- Tudo que for interpretação recebe rótulo **INFERIDO**.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict, deque
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


def _extract_explicit_fk_edges(schema: dict[str, Any]) -> list[dict[str, Any]]:
    edges: list[dict[str, Any]] = []
    for from_table, t in (schema.get("tables") or {}).items():
        for fk in (t.get("foreign_keys") or []):
            to_table = fk.get("ref_table")
            if not to_table:
                continue
            edges.append(
                {
                    "from_table": from_table,
                    "from_column": fk.get("column"),
                    "to_table": to_table,
                    "to_column": fk.get("ref_column"),
                    "constraint": fk.get("constraint"),
                    "on_update": fk.get("on_update"),
                    "on_delete": fk.get("on_delete"),
                }
            )
    edges.sort(key=lambda e: (e["from_table"], str(e.get("constraint") or ""), str(e.get("from_column") or "")))
    return edges


def _undirected_neighbors(edges: list[dict[str, Any]]) -> dict[str, set[str]]:
    g: dict[str, set[str]] = defaultdict(set)
    for e in edges:
        a = e["from_table"]
        b = e["to_table"]
        g[a].add(b)
        g[b].add(a)
    return g


def _subgraph_nodes(seeds: list[str], neighbors: dict[str, set[str]], hops: int) -> set[str]:
    seeds = [s for s in seeds if s]
    seen = set(seeds)
    q = deque([(s, 0) for s in seeds])
    while q:
        cur, d = q.popleft()
        if d >= hops:
            continue
        for nx in neighbors.get(cur, set()):
            if nx not in seen:
                seen.add(nx)
                q.append((nx, d + 1))
    return seen


def _table(schema: dict[str, Any], name: str) -> dict[str, Any]:
    return (schema.get("tables") or {}).get(name) or {}


def _columns(schema: dict[str, Any], name: str) -> list[dict[str, Any]]:
    return list(_table(schema, name).get("columns") or [])


def _pk(schema: dict[str, Any], name: str) -> list[str]:
    return list(_table(schema, name).get("primary_key") or [])


def _infer_date_columns(cols: list[dict[str, Any]]) -> list[str]:
    """
    INFERIDO (controlado):
    - Prioriza colunas cujo data_type é temporal.
    - Só usa heurística por nome quando NÃO conflita com padrões de "tipo_*" e quando o tipo não é numérico.
    """
    temporal_types = {"date", "datetime", "timestamp", "time", "year"}
    numeric_types = {"int", "tinyint", "smallint", "bigint", "decimal", "float", "double", "numeric"}

    typed: list[str] = []
    named: list[str] = []

    for c in cols or []:
        n = (c.get("name") or "")
        name = n.lower()
        dtype = (c.get("data_type") or "").lower()

        if dtype in temporal_types:
            typed.append(n)
            continue

        # heurística por nome (mais fraca) — evita falsos positivos como "tipo_emissao"
        if name.startswith("tipo_") or name.endswith("_tipo") or "tipo" == name:
            continue
        if dtype in numeric_types and any(tok in name for tok in ("emissao", "emissão", "cancel", "encerr")):
            # tipicamente "tipo_emissao" / flags numéricos, não data
            continue

        if any(
            tok in name
            for tok in (
                "data",
                "date",
                "dt_",
                "_dt",
                "created",
                "updated",
                "deleted",
                "emissao",
                "emissão",
                "cancel",
                "encerr",
                "hora",
            )
        ):
            named.append(n)

    # unique preserve order: typed primeiro
    seen = set()
    out: list[str] = []
    for lst in (typed, named):
        for x in lst:
            if not x or x in seen:
                continue
            seen.add(x)
            out.append(x)
    return out


def _infer_status_columns(cols: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    for c in cols or []:
        n = (c.get("name") or "")
        name = n.lower()
        if any(tok in name for tok in ("status", "situac", "estado", "fase", "tipo", "cancel", "encerr", "bloque", "ativo")):
            out.append(n)
    seen = set()
    uniq = []
    for x in out:
        if not x or x in seen:
            continue
        seen.add(x)
        uniq.append(x)
    return uniq


def _history_like(table_name: str) -> bool:
    t = (table_name or "").lower()
    return any(k in t for k in ("_hist", "historico", "history", "_log", "logs"))


def _edges_in_subgraph(edges: list[dict[str, Any]], nodes: set[str]) -> list[dict[str, Any]]:
    return [e for e in edges if e["from_table"] in nodes and e["to_table"] in nodes]


def _incoming_outgoing(edges: list[dict[str, Any]], anchor: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    incoming = [e for e in edges if e["to_table"] == anchor]
    outgoing = [e for e in edges if e["from_table"] == anchor]
    incoming.sort(key=lambda x: (x["from_table"], str(x.get("from_column") or "")))
    outgoing.sort(key=lambda x: (x["to_table"], str(x.get("from_column") or "")))
    return incoming, outgoing


def _candidate_satellites(anchor: str, nodes: set[str], edges: list[dict[str, Any]]) -> dict[str, list[str]]:
    """Satélites = tabelas diretamente relacionadas (FK in/out) + tabelas com nome parecido."""
    inc, out = _incoming_outgoing(edges, anchor)
    related = set([e["from_table"] for e in inc] + [e["to_table"] for e in out])
    name_related = {t for t in nodes if (anchor.lower() in (t or "").lower()) and t != anchor}
    all_rel = sorted((related | name_related) - {anchor})
    history = [t for t in all_rel if _history_like(t)]
    others = [t for t in all_rel if t not in set(history)]
    return {"history": history, "others": others}


def _render_anchor_section(db: str, schema: dict[str, Any], sub_edges: list[dict[str, Any]], nodes: set[str], anchor: str) -> str:
    t = _table(schema, anchor)
    cols = _columns(schema, anchor)
    pk = _pk(schema, anchor)
    inc, out = _incoming_outgoing(sub_edges, anchor)
    sat = _candidate_satellites(anchor, nodes, sub_edges)

    date_cols = _infer_date_columns(cols)
    status_cols = _infer_status_columns(cols)

    lines: list[str] = []
    lines.append(f"## Entidade âncora: `{db}.{anchor}`")
    lines.append("")
    lines.append("### Estrutura (evidência)")
    lines.append(f"- **PK**: " + (", ".join([f"`{c}`" for c in pk]) if pk else "(sem PK explícita)"))
    lines.append(f"- **Colunas**: {len(cols)}")
    lines.append(f"- **Registros (estimativa)**: `{t.get('table_rows_estimate')}`")
    lines.append("")

    lines.append("### Dependências (FK OUT) — evidência")
    if not out:
        lines.append("- (nenhuma FK OUT explícita)")
    else:
        for e in out:
            lines.append(
                f"- `{anchor}.{e.get('from_column')}` → `{e.get('to_table')}.{e.get('to_column')}` "
                f"(constraint=`{e.get('constraint')}`)"
            )
    lines.append("")

    lines.append("### Dependentes (FK IN) — evidência")
    if not inc:
        lines.append("- (nenhuma FK IN explícita)")
    else:
        for e in inc[:80]:
            lines.append(
                f"- `{e.get('from_table')}.{e.get('from_column')}` → `{anchor}.{e.get('to_column')}` "
                f"(constraint=`{e.get('constraint')}`)"
            )
        if len(inc) > 80:
            lines.append(f"- ... truncado (total={len(inc)})")
    lines.append("")

    lines.append("### Satélites prováveis (INFERIDO)")
    lines.append("- Critérios: (1) tabelas relacionadas por FK direta; (2) tabelas cujo nome contém o nome da âncora; (3) marcação `hist/log` por nome.")
    lines.append(f"- **Satélites históricos/auditoria (por nome, INFERIDO)**: {', '.join([f'`{x}`' for x in sat['history']]) or '(nenhum)'}")
    lines.append(f"- **Outros satélites (INFERIDO)**: {', '.join([f'`{x}`' for x in sat['others'][:30]]) or '(nenhum)'}")
    if len(sat["others"]) > 30:
        lines.append(f"- ... truncado (total={len(sat['others'])})")
    lines.append("")

    lines.append("### Sinais de ciclo de vida (INFERIDO)")
    lines.append("- **Colunas de data/tempo prováveis**: " + (", ".join([f"`{c}`" for c in date_cols]) if date_cols else "(nenhuma detectada)"))
    lines.append("- **Colunas de status/estado prováveis**: " + (", ".join([f"`{c}`" for c in status_cols]) if status_cols else "(nenhuma detectada)"))
    lines.append("")

    lines.append("### Hipótese de estágios (INFERIDO, a validar)")
    lines.append("- Esta é uma hipótese guiada por nomes de colunas (datas/status) e satélites; não é regra de negócio confirmada.")
    # sugestões genéricas
    stage_hints = []
    if any("incluido" in (c or "").lower() for c in date_cols):
        stage_hints.append("Criação/entrada (ex.: `data_incluido` / `hora_incluido`).")
    if any("emissao" in (c or "").lower() for c in date_cols):
        stage_hints.append("Emissão/geração (ex.: `data_emissao` / `hora_emissao`).")
    if any("prev" in (c or "").lower() for c in date_cols):
        stage_hints.append("Planejamento (ex.: `prev_*`).")
    if any("saida" in (c or "").lower() for c in date_cols) or any("chegada" in (c or "").lower() for c in date_cols):
        stage_hints.append("Execução (saída/chegada efetiva).")
    if any("entrega" in (c or "").lower() for c in date_cols):
        stage_hints.append("Finalização (entrega).")
    if any("cancel" in (c or "").lower() for c in date_cols + status_cols):
        stage_hints.append("Cancelamento (campos `cancel*`).")
    if not stage_hints:
        stage_hints.append("Sem sinais fortes por nome; validar por amostras de dados e logs.")
    for s in stage_hints:
        lines.append(f"- {s}")
    lines.append("")

    lines.append("### Checklist de validação (queries sugeridas) — INFERIDO")
    lines.append("> Queries para inspeção manual (não executadas automaticamente). Ajuste nomes/colunas conforme necessário.")
    lines.append("```sql")
    lines.append(f"-- Amostra de registros (inspeção de colunas relevantes)")
    lines.append(f"SELECT * FROM {db}.{anchor} ORDER BY {pk[0] if pk else '1'} DESC LIMIT 10;")
    if status_cols:
        lines.append("")
        lines.append("-- Distribuição por status (ajuste a coluna conforme sua escolha)")
        lines.append(f"SELECT `{status_cols[0]}` AS status, COUNT(*) AS qtd FROM {db}.{anchor} GROUP BY `{status_cols[0]}` ORDER BY qtd DESC;")
    # Faixa temporal: preferir uma coluna de tipo temporal (date/datetime/timestamp/time/year)
    date_cols_typed = []
    for c in cols:
        if (c.get("data_type") or "").lower() in {"date", "datetime", "timestamp", "time", "year"}:
            if c.get("name"):
                date_cols_typed.append(c.get("name"))
    if date_cols_typed or date_cols:
        lines.append("")
        lines.append("-- Faixa temporal (ajuste a coluna conforme sua escolha)")
        dt_col = date_cols_typed[0] if date_cols_typed else date_cols[0]
        lines.append(f"SELECT MIN(`{dt_col}`) AS min_dt, MAX(`{dt_col}`) AS max_dt FROM {db}.{anchor};")
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--track", required=True, help="Nome lógico do recorte (ex.: logistica)")
    parser.add_argument("--seeds", required=True, help="Seeds separadas por vírgula (ex.: manifesto,minuta,coleta)")
    parser.add_argument("--hops", default="3")
    parser.add_argument("--anchors", required=True, help="Âncoras separadas por vírgula (ex.: minuta,manifesto)")
    parser.add_argument("--out-md", default=os.path.join("data", "db_kb", "phase3_lifecycle_logistica.md"))
    parser.add_argument("--out-items", default=os.path.join("data", "db_kb", "phase3_lifecycle_knowledge_items.json"))
    args = parser.parse_args()

    schema = _load(args.schema)
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()
    tables: dict[str, Any] = schema.get("tables") or {}

    raw_seeds = [s.strip() for s in (args.seeds or "").split(",") if s.strip()]
    seeds = [s for s in raw_seeds if s in tables]
    missing_seeds = [s for s in raw_seeds if s not in tables]
    raw_anchors = [s.strip() for s in (args.anchors or "").split(",") if s.strip()]
    anchors = [s for s in raw_anchors if s in tables]
    missing_anchors = [s for s in raw_anchors if s not in tables]
    try:
        hops = int(args.hops or 3)
    except Exception:
        hops = 3
    hops = max(0, min(6, hops))

    explicit_edges = _extract_explicit_fk_edges(schema)
    neigh = _undirected_neighbors(explicit_edges)
    nodes = _subgraph_nodes(seeds, neigh, hops=hops)
    sub_edges = _edges_in_subgraph(explicit_edges, nodes)

    lines: list[str] = []
    lines.append(f"# FASE 3 — Ciclo de vida candidato (INFERIDO) — trilha `{args.track}` ({db})")
    lines.append("")
    lines.append("## Escopo e evidência")
    lines.append(f"- Gerado em (UTC): **{gen}**")
    lines.append(f"- Seeds do recorte: {', '.join([f'`{s}`' for s in seeds])}")
    if missing_seeds:
        lines.append(f"- Seeds ausentes no schema (ignoradas): {', '.join([f'`{s}`' for s in missing_seeds])}")
    lines.append(f"- Hops: **{hops}** (FK explícita, conectividade fraca)")
    lines.append(f"- Tabelas no recorte: **{len(nodes)}**")
    lines.append(f"- FKs explícitas no recorte: **{len(sub_edges)}**")
    lines.append("")
    lines.append("## Regras")
    lines.append("- Estrutura (PK/FK/colunas) = evidência (information_schema).")
    lines.append("- Interpretação de estágios / satélites / status / histórico = **INFERIDO**.")
    lines.append("")

    if missing_anchors:
        lines.append("## Aviso (âncoras ausentes)")
        lines.append("- As seguintes âncoras não foram encontradas no schema e foram ignoradas:")
        for a in missing_anchors:
            lines.append(f"  - `{a}`")
        lines.append("")

    for a in anchors:
        if a not in nodes:
            lines.append("## Aviso")
            lines.append(f"- Âncora `{a}` existe no schema, mas não caiu no recorte atual; verifique seeds/hops.")
            lines.append("")
            continue
        lines.append(_render_anchor_section(db=db, schema=schema, sub_edges=sub_edges, nodes=nodes, anchor=a))

    md = "\n".join(lines)
    os.makedirs(os.path.dirname(args.out_md), exist_ok=True)
    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write(md)

    # knowledge item único para a trilha
    item = {
        "id": f"db::{db}::phase3::lifecycle::{args.track}::{_slug(gen)}",
        "question": f"Ciclo de vida candidato (trilha {args.track}) para entidades {', '.join(anchors)} no banco {db}",
        "answer": md,
        "category": "DB Lifecycle",
        "synced_at": gen,
        "source": f"mysql::{db}",
        "metadata": {
            "kind": "db_phase3_lifecycle_candidate",
            "database": db,
            "track": args.track,
            "seeds": seeds,
            "anchors": anchors,
            "hops": hops,
            "tables_count": len(nodes),
            "explicit_fk_edges_count": len(sub_edges),
            "evidence": ["information_schema"],
            "inferences": ["lifecycle_stages_by_columns", "history_tables_by_name", "status_fields_by_name"],
        },
    }
    items: list[dict[str, Any]] = []
    if os.path.exists(args.out_items):
        try:
            with open(args.out_items, "r", encoding="utf-8") as f:
                items = json.load(f) or []
        except Exception:
            items = []
    # remove antigos da mesma trilha (mantém histórico por generated_at no id, mas evita duplicar sem querer)
    items = [it for it in items if not str(it.get("id", "")).startswith(f"db::{db}::phase3::lifecycle::{args.track}::")]
    items.append(item)
    items.sort(key=lambda x: str(x.get("id") or ""))
    with open(args.out_items, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"[OK] Lifecycle candidate: {args.out_md}")
    print(f"[OK] Lifecycle knowledge items: {args.out_items} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


