"""FASE 3 — Refinamento por trilhas (Logística, Cadastro, etc.).

Gera subgrafos a partir de tabelas-semente (seeds) e N hops no grafo:
- Camada 1 (EVIDÊNCIA): apenas FKs explícitas
- Camada 2 (INFERIDO controlado): matches únicos *_id/id_* -> PK simples

Saídas:
- Markdown por trilha: data/db_kb/phase3_track_<nome>.md
- Knowledge items: data/db_kb/phase3_track_knowledge_items.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any, Iterable


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _slug(text: str) -> str:
    t = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").strip().lower()).strip("-")
    return t or "x"


def _guess_domain(table_name: str) -> str:
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
            return dom
    return "nao_classificado"


def _extract_explicit_fk_edges(schema: dict[str, Any]) -> list[dict[str, Any]]:
    edges: list[dict[str, Any]] = []
    for from_table, t in (schema.get("tables") or {}).items():
        for fk in (t.get("foreign_keys") or []):
            to_table = fk.get("ref_table")
            if not to_table:
                continue
            edges.append(
                {
                    "type": "explicit_fk",
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


def _columns_of(schema: dict[str, Any], table: str) -> list[dict[str, Any]]:
    t = (schema.get("tables") or {}).get(table) or {}
    return list(t.get("columns") or [])


def _pk_of(schema: dict[str, Any], table: str) -> list[str]:
    t = (schema.get("tables") or {}).get(table) or {}
    return list(t.get("primary_key") or [])


def _infer_edges_by_unique_id_match(schema: dict[str, Any]) -> list[dict[str, Any]]:
    tables = schema.get("tables") or {}
    pk_name_to_tables: dict[str, list[str]] = defaultdict(list)
    for tname in tables.keys():
        pk = _pk_of(schema, tname)
        if len(pk) == 1 and pk[0]:
            pk_name_to_tables[str(pk[0]).lower()].append(tname)

    inferred: list[dict[str, Any]] = []
    for from_table in tables.keys():
        cols = _columns_of(schema, from_table)
        for cobj in cols:
            col = cobj.get("name")
            c = (col or "").lower()
            if not c:
                continue
            if not (c == "id" or c.startswith("id_") or c.endswith("_id")):
                continue
            candidates = pk_name_to_tables.get(c, [])
            if len(candidates) == 1:
                to_table = candidates[0]
                if to_table != from_table:
                    inferred.append(
                        {
                            "type": "inferred_id_pk_match",
                            "from_table": from_table,
                            "from_column": col,
                            "to_table": to_table,
                            "to_column": _pk_of(schema, to_table)[0],
                            "evidence": "column_name_matches_unique_pk_name",
                        }
                    )
    # de-dupe
    seen = set()
    out = []
    for e in sorted(inferred, key=lambda x: (x["from_table"], x["from_column"], x["to_table"])):
        k = (e["from_table"], e["from_column"], e["to_table"], e["to_column"])
        if k in seen:
            continue
        seen.add(k)
        out.append(e)
    return out


def _build_adj(edges: list[dict[str, Any]], nodes_filter: set[str] | None = None) -> dict[str, list[dict[str, Any]]]:
    adj: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for e in edges:
        a = e["from_table"]
        b = e["to_table"]
        if nodes_filter is not None and (a not in nodes_filter and b not in nodes_filter):
            continue
        adj[a].append(e)
    for k in list(adj.keys()):
        adj[k].sort(key=lambda x: (x["to_table"], str(x.get("from_column") or ""), str(x.get("constraint") or "")))
    return adj


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


def _infer_date_columns(cols: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    for c in cols or []:
        name = (c.get("name") or "").lower()
        dtype = (c.get("data_type") or "").lower()
        if dtype in {"date", "datetime", "timestamp", "time", "year"}:
            out.append(c.get("name"))
            continue
        if any(tok in name for tok in ("data", "date", "dt_", "_dt", "created", "updated", "deleted", "emissao", "emissão", "hora")):
            out.append(c.get("name"))
    seen = set()
    uniq = []
    for x in out:
        if not x or x in seen:
            continue
        seen.add(x)
        uniq.append(x)
    return uniq


def _render_track_md(
    *,
    db: str,
    generated_at: str,
    track_name: str,
    seeds: list[str],
    nodes: set[str],
    explicit_edges: list[dict[str, Any]],
    inferred_edges: list[dict[str, Any]],
    schema: dict[str, Any],
) -> str:
    exp_in = [e for e in explicit_edges if e["from_table"] in nodes and e["to_table"] in nodes]
    inf_in = [e for e in inferred_edges if e["from_table"] in nodes and e["to_table"] in nodes]

    # Hubs dentro do recorte
    in_deg: dict[str, int] = defaultdict(int)
    out_deg: dict[str, int] = defaultdict(int)
    for e in exp_in:
        out_deg[e["from_table"]] += 1
        in_deg[e["to_table"]] += 1
    hubs = sorted(
        [{"table": t, "degree": in_deg[t] + out_deg[t], "in": in_deg[t], "out": out_deg[t]} for t in nodes],
        key=lambda r: (r["degree"], r["in"], r["out"], r["table"]),
        reverse=True,
    )[:25]

    # Datas por tabela (para sugerir “ciclo de vida”)
    date_by_table = {}
    for t in nodes:
        cols = _columns_of(schema, t)
        dcols = _infer_date_columns(cols)
        if dcols:
            date_by_table[t] = dcols[:12]

    lines: list[str] = []
    lines.append(f"# FASE 3 — Trilha: {track_name} ({db})")
    lines.append("")
    lines.append("## Escopo")
    lines.append(f"- Gerado em (UTC): **{generated_at}**")
    lines.append(f"- Seeds: {', '.join([f'`{s}`' for s in seeds])}")
    lines.append(f"- Hops (FK explícita, fraco): **{len(nodes)} tabelas no recorte**")
    lines.append(f"- Arestas (FK explícita no recorte): **{len(exp_in)}**")
    lines.append(f"- Arestas (INFERIDO controlado no recorte): **{len(inf_in)}**")
    lines.append("")

    lines.append("## Tabelas do recorte (com domínio INFERIDO por nome)")
    for t in sorted(nodes):
        lines.append(f"- `{t}` (domínio INFERIDO: `{_guess_domain(t)}`)")
    lines.append("")

    lines.append("## Hubs (somente FK explícita dentro do recorte)")
    lines.append("| Tabela | Grau | in | out |")
    lines.append("|---|---:|---:|---:|")
    for h in hubs:
        lines.append(f"| `{h['table']}` | {h['degree']} | {h['in']} | {h['out']} |")
    lines.append("")

    lines.append("## Relacionamentos (FK explícita) — evidência estrutural")
    if not exp_in:
        lines.append("- (nenhum relacionamento explícito dentro do recorte)")
    else:
        for e in exp_in:
            lines.append(
                f"- `{e['from_table']}.{e.get('from_column')}` → `{e['to_table']}.{e.get('to_column')}` "
                f"(constraint=`{e.get('constraint')}`, on_update=`{e.get('on_update')}`, on_delete=`{e.get('on_delete')}`)"
            )
    lines.append("")

    lines.append("## Links INFERIDOS (controlados) — NÃO é evidência")
    lines.append("> Critério: match único de nome de coluna `_id/id_*/*_id` com PK simples (1 coluna) de outra tabela.")
    if not inf_in:
        lines.append("- (nenhum link inferido dentro do recorte)")
    else:
        for e in inf_in[:150]:
            lines.append(
                f"- `{e['from_table']}.{e.get('from_column')}` ⇒ `{e['to_table']}.{e.get('to_column')}` "
                f"(INFERIDO: {e.get('evidence')})"
            )
        if len(inf_in) > 150:
            lines.append(f"- ... truncado (total={len(inf_in)})")
    lines.append("")

    lines.append("## Sinais de ciclo de vida (INFERIDO, por presença de colunas de data)")
    lines.append("> Aqui NÃO inferimos regras de negócio, só listamos prováveis colunas de tempo para guiar investigação.")
    if not date_by_table:
        lines.append("- (nenhuma coluna de data/tempo detectada por padrão)")
    else:
        for t in sorted(date_by_table.keys()):
            lines.append(f"- `{t}`: {', '.join([f'`{c}`' for c in date_by_table[t]])}")
    lines.append("")

    lines.append("## Próximos refinamentos sugeridos (INFERIDO)")
    lines.append("- Confirmar quais tabelas representam **entidades de negócio** vs **eventos/histórico**.")
    lines.append("- Validar colunas de status/cancelamento/finalização em tabelas hub.")
    lines.append("- Adicionar inferências controladas por: `*_codigo`, `*_numero`, e match por índices únicos (mais forte que nome).")
    lines.append("")

    return "\n".join(lines)


def _knowledge_item(db: str, gen: str, track: str, md: str, seeds: list[str], nodes: set[str]) -> dict[str, Any]:
    return {
        "id": f"db::{db}::phase3::track::{track}",
        "question": f"Mapa de relacionamentos e fluxo (trilha {track}) no banco {db}",
        "answer": md,
        "category": "DB Flows",
        "synced_at": gen,
        "source": f"mysql::{db}",
        "metadata": {
            "kind": "db_phase3_track",
            "database": db,
            "track": track,
            "seeds": seeds,
            "tables_count": len(nodes),
            "evidence": ["information_schema"],
            "inferences": ["id_pk_unique_match", "domain_by_name", "date_fields_by_patterns"],
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--track", required=True, help="Nome da trilha (ex.: logistica, cadastro)")
    parser.add_argument("--seeds", required=True, help="Lista de tabelas semente separadas por vírgula.")
    parser.add_argument("--hops", default="2", help="Número de hops (inteiro) no grafo de FK explícita.")
    parser.add_argument("--out-md", default="", help="Override do caminho do Markdown.")
    parser.add_argument("--out-items", default=os.path.join("data", "db_kb", "phase3_track_knowledge_items.json"))
    args = parser.parse_args()

    schema = _load(args.schema)
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()
    tables: dict[str, Any] = schema.get("tables") or {}

    raw_seeds = [s.strip() for s in (args.seeds or "").split(",") if s.strip()]
    seeds = [s for s in raw_seeds if s in tables]
    missing_seeds = [s for s in raw_seeds if s not in tables]
    try:
        hops = int(args.hops or 2)
    except Exception:
        hops = 2
    hops = max(0, min(6, hops))

    explicit_edges = _extract_explicit_fk_edges(schema)
    inferred_edges = _infer_edges_by_unique_id_match(schema)

    neigh = _undirected_neighbors(explicit_edges)
    nodes = _subgraph_nodes(seeds, neigh, hops=hops)

    out_md = args.out_md.strip() or os.path.join("data", "db_kb", f"phase3_track_{args.track}.md")
    md = _render_track_md(
        db=db,
        generated_at=gen,
        track_name=args.track,
        seeds=seeds,
        nodes=nodes,
        explicit_edges=explicit_edges,
        inferred_edges=inferred_edges,
        schema=schema,
    )

    if missing_seeds:
        warn = (
            "\n\n## Aviso (seeds ausentes)\n"
            "- As seguintes seeds não foram encontradas no schema e foram ignoradas no recorte:\n"
            + "\n".join([f"  - `{s}`" for s in missing_seeds])
            + "\n"
        )
        md = md.rstrip() + warn

    os.makedirs(os.path.dirname(out_md), exist_ok=True)
    with open(out_md, "w", encoding="utf-8") as f:
        f.write(md)

    # append (ou cria) items
    items: list[dict[str, Any]] = []
    if os.path.exists(args.out_items):
        try:
            with open(args.out_items, "r", encoding="utf-8") as f:
                items = json.load(f) or []
        except Exception:
            items = []
    # remove item antigo da mesma trilha
    items = [it for it in items if str(it.get("id")) != f"db::{db}::phase3::track::{args.track}"]
    items.append(_knowledge_item(db=db, gen=gen, track=args.track, md=md, seeds=seeds, nodes=nodes))
    items.sort(key=lambda x: str(x.get("id") or ""))

    os.makedirs(os.path.dirname(args.out_items), exist_ok=True)
    with open(args.out_items, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"[OK] Track={args.track} nodes={len(nodes)} explicit_edges_total={len(explicit_edges)} inferred_edges_total={len(inferred_edges)}")
    print(f"[OK] Markdown: {out_md}")
    print(f"[OK] Track knowledge items: {args.out_items} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


