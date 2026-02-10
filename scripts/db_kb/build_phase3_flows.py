"""FASE 3 — Relacionamentos e Fluxos (mapa global).

Gera um mapa global em duas camadas:
1) Evidência estrutural: apenas FKs explícitas (information_schema.KEY_COLUMN_USAGE).
2) INFERIDO (controlado): heurísticas conservadoras para sugerir links quando não há FK.

Saídas:
- Markdown: data/db_kb/phase3_fluxos.md
- Knowledge items: data/db_kb/phase3_knowledge_items.json
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


def _columns_of(schema: dict[str, Any], table: str) -> list[str]:
    t = (schema.get("tables") or {}).get(table) or {}
    cols = t.get("columns") or []
    return [c.get("name") for c in cols if c.get("name")]


def _pk_of(schema: dict[str, Any], table: str) -> list[str]:
    t = (schema.get("tables") or {}).get(table) or {}
    return list(t.get("primary_key") or [])


def _infer_edges_by_unique_id_match(schema: dict[str, Any]) -> list[dict[str, Any]]:
    """INFERIDO (controlado):
    Se uma coluna em A (ex.: cliente_id / id_cliente) casa de forma única com a PK de alguma tabela B,
    sugerimos A -> B. Não cria arestas quando há ambiguidade.
    """
    tables = schema.get("tables") or {}
    # index pk_name -> [table]
    pk_name_to_tables: dict[str, list[str]] = defaultdict(list)
    for tname in tables.keys():
        pk = _pk_of(schema, tname)
        # só inferimos por PK simples (1 coluna) para reduzir falso positivo
        if len(pk) == 1 and pk[0]:
            pk_name_to_tables[str(pk[0]).lower()].append(tname)

    inferred: list[dict[str, Any]] = []

    for from_table in tables.keys():
        cols = _columns_of(schema, from_table)
        for col in cols:
            c = (col or "").lower()
            if not c:
                continue
            # padrão conservador: id_xxx / xxx_id / idxxx (mínimo)
            if not (c == "id" or c.startswith("id_") or c.endswith("_id")):
                continue
            # se o nome da coluna é igual ao nome da PK de outra tabela e o match é único, inferimos
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
            # variação: coluna "id_xxx" pode casar com PK "id_xxx"
            if c.startswith("id_"):
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
                                "evidence": "id_prefix_matches_unique_pk_name",
                            }
                        )

    # de-dupe determinístico
    seen = set()
    out = []
    for e in sorted(inferred, key=lambda x: (x["from_table"], x["from_column"], x["to_table"])):
        k = (e["from_table"], e["from_column"], e["to_table"], e["to_column"])
        if k in seen:
            continue
        seen.add(k)
        out.append(e)
    return out


def _build_graph(edges: list[dict[str, Any]]) -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    out_edges: dict[str, set[str]] = defaultdict(set)
    in_edges: dict[str, set[str]] = defaultdict(set)
    for e in edges:
        a = e["from_table"]
        b = e["to_table"]
        out_edges[a].add(b)
        in_edges[b].add(a)
    return out_edges, in_edges


def _connected_components(nodes: Iterable[str], edges: list[dict[str, Any]]) -> list[list[str]]:
    # componente fraco (ignora direção)
    adj: dict[str, set[str]] = defaultdict(set)
    for e in edges:
        a, b = e["from_table"], e["to_table"]
        adj[a].add(b)
        adj[b].add(a)

    visited = set()
    comps: list[list[str]] = []
    for n in nodes:
        if n in visited:
            continue
        q = deque([n])
        visited.add(n)
        comp = []
        while q:
            cur = q.popleft()
            comp.append(cur)
            for nx in adj.get(cur, set()):
                if nx not in visited:
                    visited.add(nx)
                    q.append(nx)
        comp.sort()
        comps.append(comp)
    comps.sort(key=lambda c: (len(c), c[0] if c else ""), reverse=True)
    return comps


def _top_hubs(out_edges: dict[str, set[str]], in_edges: dict[str, set[str]], limit: int = 40) -> list[dict[str, Any]]:
    nodes = sorted(set(out_edges.keys()) | set(in_edges.keys()))
    rows = []
    for n in nodes:
        outd = len(out_edges.get(n) or set())
        ind = len(in_edges.get(n) or set())
        rows.append({"table": n, "degree": outd + ind, "in_degree": ind, "out_degree": outd})
    rows.sort(key=lambda r: (r["degree"], r["in_degree"], r["out_degree"], r["table"]), reverse=True)
    return rows[:limit]


def _sample_chains(out_edges: dict[str, set[str]], hubs: list[dict[str, Any]], max_chains: int = 25) -> list[list[str]]:
    """Gera algumas cadeias por BFS a partir de hubs (determinístico)."""
    chains: list[list[str]] = []
    for h in hubs[:10]:
        start = h["table"]
        # BFS limitado em profundidade
        q = deque([(start, [start])])
        seen_local = {start}
        while q and len(chains) < max_chains:
            cur, path = q.popleft()
            nxts = sorted(out_edges.get(cur) or set())
            if not nxts:
                if len(path) >= 2:
                    chains.append(path)
                continue
            for nx in nxts[:6]:
                if len(path) >= 6:
                    chains.append(path)
                    continue
                # evita loops
                if nx in path:
                    continue
                q.append((nx, path + [nx]))
                seen_local.add(nx)
    # de-dupe
    uniq = []
    seen = set()
    for c in chains:
        k = tuple(c)
        if k in seen:
            continue
        seen.add(k)
        uniq.append(c)
    return uniq[:max_chains]


def _render_md(
    *,
    schema: dict[str, Any],
    explicit_edges: list[dict[str, Any]],
    inferred_edges: list[dict[str, Any]],
) -> str:
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()
    tables = sorted((schema.get("tables") or {}).keys())

    out_e, in_e = _build_graph(explicit_edges)
    hubs = _top_hubs(out_e, in_e, limit=40)
    comps = _connected_components(tables, explicit_edges)
    chains = _sample_chains(out_e, hubs, max_chains=25)

    # Domínios por componente (contagem)
    comp_domains = []
    for comp in comps[:20]:
        dom_count: dict[str, int] = defaultdict(int)
        for t in comp:
            dom_count[_guess_domain(t)] += 1
        top = sorted(dom_count.items(), key=lambda x: (x[1], x[0]), reverse=True)[:5]
        comp_domains.append({"size": len(comp), "top_domains": top, "sample": comp[:12]})

    lines: list[str] = []
    lines.append(f"# Fluxos e Ciclo de Vida dos Dados — Visão Global ({db})")
    lines.append("")
    lines.append("## Escopo e evidência")
    lines.append(f"- Gerado em (UTC): **{gen}**")
    lines.append(f"- Tabelas no schema: **{len(tables)}**")
    lines.append(f"- Arestas (FK explícita): **{len(explicit_edges)}**")
    lines.append(f"- Arestas (INFERIDO controlado): **{len(inferred_edges)}**")
    lines.append("")
    lines.append("Camadas:")
    lines.append("- **Evidência estrutural**: apenas constraints FK explícitas (information_schema).")
    lines.append("- **INFERIDO (controlado)**: correspondência única `*_id/id_*` → PK simples (1 coluna).")
    lines.append("")

    lines.append("## Componentes (conectividade por FK explícita)")
    lines.append("> Componentes fracos (ignora direção). Se o banco não declarar FKs, a conectividade fica subestimada.")
    lines.append("")
    lines.append("| # | Tamanho | Domínios dominantes (INFERIDO por nome) | Amostra de tabelas |")
    lines.append("|---:|---:|---|---|")
    for i, cd in enumerate(comp_domains, start=1):
        doms = ", ".join([f"{d}={n}" for d, n in cd["top_domains"]])
        sample = ", ".join([f"`{t}`" for t in cd["sample"]])
        lines.append(f"| {i} | {cd['size']} | {doms} | {sample} |")
    lines.append("")

    lines.append("## Tabelas hub (centralidade por FK explícita)")
    lines.append("| Tabela | Grau | in | out | Domínio (INFERIDO) |")
    lines.append("|---|---:|---:|---:|---|")
    for h in hubs:
        lines.append(
            f"| `{h['table']}` | {h['degree']} | {h['in_degree']} | {h['out_degree']} | `{_guess_domain(h['table'])}` |"
        )
    lines.append("")

    lines.append("## Cadeias de dependência (amostras) — FK explícita")
    lines.append("> Cadeias obtidas por BFS a partir de hubs; são amostras, não fluxo completo de negócio.")
    lines.append("")
    for c in chains:
        lines.append("- " + " → ".join([f"`{t}`" for t in c]))
    lines.append("")

    lines.append("## INFERÊNCIAS controladas (links sugeridos)")
    lines.append("> Abaixo são links **sugeridos**. Eles NÃO são evidência; servem para guiar investigação/validação.")
    lines.append("")
    lines.append("### Resumo")
    lines.append(f"- Total de links inferidos: **{len(inferred_edges)}**")
    lines.append("- Critério: match único de nome de coluna `_id/id_` com PK simples de outra tabela.")
    lines.append("- Ambiguidades são descartadas (não inferimos quando há múltiplas tabelas candidatas).")
    lines.append("")
    lines.append("### Exemplos (primeiros 60)")
    for e in inferred_edges[:60]:
        lines.append(
            f"- `{e['from_table']}.{e['from_column']}` ⇒ `{e['to_table']}.{e['to_column']}` "
            f"(INFERIDO: {e.get('evidence')})"
        )
    if len(inferred_edges) > 60:
        lines.append(f"- ... truncado (total={len(inferred_edges)})")
    lines.append("")

    lines.append("## Histórico vs atual (sinal por nome) — INFERIDO")
    lines.append("- Padrões como `hist`, `historico`, `history`, `log` sugerem tabelas históricas/auditáveis.")
    lines.append("- Isso será refinado cruzando campos de data/versionamento e uso real nas consultas (FASE 4).")
    lines.append("")

    return "\n".join(lines)


def _knowledge_items(
    *,
    schema: dict[str, Any],
    md: str,
    explicit_edges: list[dict[str, Any]],
    inferred_edges: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    db = schema.get("database") or "azportoex"
    gen = schema.get("generated_at") or _utc_now_iso()

    items: list[dict[str, Any]] = []
    items.append(
        {
            "id": f"db::{db}::phase3::flows::{_slug(gen)}",
            "question": f"Mapa global de fluxos e relacionamentos do banco {db}",
            "answer": md,
            "category": "DB Flows",
            "synced_at": gen,
            "source": f"mysql::{db}",
            "metadata": {
                "kind": "db_phase3_global_flows",
                "database": db,
                "generated_at": gen,
                "explicit_fk_edges": len(explicit_edges),
                "inferred_edges": len(inferred_edges),
                "evidence": ["information_schema"],
                "inferences": ["id_pk_unique_match"],
            },
        }
    )
    return items


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--out-md", default=os.path.join("data", "db_kb", "phase3_fluxos.md"))
    parser.add_argument("--out-items", default=os.path.join("data", "db_kb", "phase3_knowledge_items.json"))
    args = parser.parse_args()

    schema = _load(args.schema)
    explicit_edges = _extract_explicit_fk_edges(schema)
    inferred_edges = _infer_edges_by_unique_id_match(schema)
    md = _render_md(schema=schema, explicit_edges=explicit_edges, inferred_edges=inferred_edges)

    os.makedirs(os.path.dirname(args.out_md), exist_ok=True)
    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write(md)

    items = _knowledge_items(schema=schema, md=md, explicit_edges=explicit_edges, inferred_edges=inferred_edges)
    with open(args.out_items, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"[OK] FASE3 Markdown: {args.out_md}")
    print(f"[OK] FASE3 Knowledge items: {args.out_items} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


