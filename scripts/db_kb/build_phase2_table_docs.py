"""FASE 2 — Análise Tabela a Tabela (a partir do schema extraído).

Entrada:
  - JSON gerado por scripts/db_kb/mysql_introspect.py (estrutura via information_schema)

Saídas:
  - Um Markdown por tabela (para leitura humana / auditoria)
  - Um JSON com 1 knowledge item por tabela (pronto para ingestão no RAG)

Regras de qualidade:
  - Tudo que é "estrutura" é baseado no schema (evidência).
  - Tudo que é "domínio" ou "semântica" gerada por heurística vem marcado como INFERIDO.
  - Não tenta entender "significado do negócio" (isso é FASE 4); aqui descrevemos a estrutura
    e indicamos perguntas/inferências para validação.
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


def _write(path: str, text: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def _slug(text: str) -> str:
    t = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").strip().lower()).strip("-")
    return t or "x"


def _guess_domain(table_name: str) -> tuple[str, str]:
    """Heurística determinística por nome. Retorna (domínio, evidência)."""
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


def _build_reverse_fk(schema: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    """Mapa: tabela_referenciada -> lista de referências (tabela/coluna/constraint)."""
    rev: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for tname, t in (schema.get("tables") or {}).items():
        for fk in (t.get("foreign_keys") or []):
            ref_table = fk.get("ref_table")
            if not ref_table:
                continue
            rev[ref_table].append(
                {
                    "from_table": tname,
                    "from_column": fk.get("column"),
                    "constraint": fk.get("constraint"),
                    "ref_column": fk.get("ref_column"),
                    "on_update": fk.get("on_update"),
                    "on_delete": fk.get("on_delete"),
                }
            )
    # ordenação determinística
    for k in list(rev.keys()):
        rev[k].sort(key=lambda x: (x.get("from_table") or "", x.get("from_column") or "", x.get("constraint") or ""))
    return rev


def _infer_date_columns(columns: list[dict[str, Any]]) -> list[str]:
    """INFERIDO: identifica prováveis campos de data/tempo."""
    out: list[str] = []
    for c in columns or []:
        name = (c.get("name") or "").lower()
        dtype = (c.get("data_type") or "").lower()
        if dtype in {"date", "datetime", "timestamp", "time", "year"}:
            out.append(c.get("name"))
            continue
        if any(tok in name for tok in ("data", "date", "dt_", "_dt", "created", "updated", "deleted", "emissao", "emissão", "hora")):
            out.append(c.get("name"))
    # unique preserve order
    seen = set()
    uniq = []
    for x in out:
        if not x or x in seen:
            continue
        seen.add(x)
        uniq.append(x)
    return uniq


def _infer_id_columns(columns: list[dict[str, Any]]) -> list[str]:
    """INFERIDO: identifica colunas que parecem IDs."""
    out: list[str] = []
    for c in columns or []:
        name = (c.get("name") or "").lower()
        if name == "id" or name.endswith("_id") or name.startswith("id_"):
            out.append(c.get("name"))
    seen = set()
    uniq = []
    for x in out:
        if not x or x in seen:
            continue
        seen.add(x)
        uniq.append(x)
    return uniq


def _table_doc_markdown(
    *,
    db: str,
    generated_at: str,
    table_name: str,
    table_obj: dict[str, Any],
    reverse_refs: list[dict[str, Any]],
) -> str:
    columns: list[dict[str, Any]] = list(table_obj.get("columns") or [])
    pk: list[str] = list(table_obj.get("primary_key") or [])
    fks: list[dict[str, Any]] = list(table_obj.get("foreign_keys") or [])
    idxs: list[dict[str, Any]] = list(table_obj.get("indexes") or [])

    dom, dom_ev = _guess_domain(table_name)
    date_cols = _infer_date_columns(columns)
    id_cols = _infer_id_columns(columns)

    lines: list[str] = []
    lines.append(f"# Tabela `{db}.{table_name}`")
    lines.append("")
    lines.append("## Identificação")
    lines.append(f"- **Banco**: `{db}`")
    lines.append(f"- **Tabela**: `{table_name}`")
    lines.append(f"- **Tipo**: `{table_obj.get('table_type')}`")
    lines.append(f"- **Engine**: `{table_obj.get('engine')}`")
    lines.append(f"- **Collation**: `{table_obj.get('collation')}`")
    lines.append(f"- **Registros (estimativa)**: `{table_obj.get('table_rows_estimate')}`")
    lines.append(f"- **Create time**: `{table_obj.get('create_time')}`")
    lines.append(f"- **Update time**: `{table_obj.get('update_time')}`")
    if table_obj.get("comment"):
        lines.append(f"- **Comment**: `{table_obj.get('comment')}`")
    lines.append(f"- **Gerado em (UTC)**: `{generated_at}`")
    lines.append("")

    lines.append("## Domínio (INFERIDO)")
    lines.append(f"- **Domínio sugerido**: `{dom}`")
    lines.append(f"- **Evidência**: `{dom_ev}`")
    lines.append("")

    lines.append("## Finalidade funcional (INFERIDO)")
    lines.append(
        "- **Não inferida automaticamente nesta fase.**\n"
        "  - Nesta FASE 2, descrevemos a estrutura.\n"
        "  - A finalidade funcional detalhada será inferida/validada na FASE 4 (semântica) com evidências adicionais."
    )
    lines.append("")

    lines.append("## Chave primária (evidência estrutural)")
    lines.append("- " + (", ".join([f"`{c}`" for c in pk]) if pk else "(sem PK explícita)"))
    lines.append("")

    lines.append("## Chaves estrangeiras (evidência estrutural)")
    if not fks:
        lines.append("- (nenhuma FK explícita encontrada)")
    else:
        for fk in fks:
            lines.append(
                f"- `{fk.get('column')}` → `{fk.get('ref_table')}.{fk.get('ref_column')}` "
                f"(constraint=`{fk.get('constraint')}`, on_update=`{fk.get('on_update')}`, on_delete=`{fk.get('on_delete')}`)"
            )
    lines.append("")

    lines.append("## Referenciado por (FK reversa) — evidência estrutural")
    if not reverse_refs:
        lines.append("- (nenhuma referência explícita encontrada)")
    else:
        for r in reverse_refs[:200]:
            lines.append(
                f"- `{r.get('from_table')}.{r.get('from_column')}` → `{table_name}.{r.get('ref_column')}` "
                f"(constraint=`{r.get('constraint')}`, on_update=`{r.get('on_update')}`, on_delete=`{r.get('on_delete')}`)"
            )
        if len(reverse_refs) > 200:
            lines.append(f"- ... truncado (total={len(reverse_refs)})")
    lines.append("")

    lines.append("## Índices (evidência estrutural)")
    if not idxs:
        lines.append("- (nenhum índice encontrado via information_schema.STATISTICS)")
    else:
        for idx in sorted(idxs, key=lambda x: (str(x.get("name") or ""), str(x.get("index_type") or ""))):
            cols = idx.get("columns") or []
            col_list = ", ".join([f"`{c.get('column')}`" for c in cols if c.get("column")])
            lines.append(
                f"- `{idx.get('name')}` type=`{idx.get('index_type')}` non_unique=`{idx.get('non_unique')}` cols=[{col_list}]"
            )
    lines.append("")

    lines.append("## Estrutura resumida (colunas) — evidência estrutural")
    lines.append("| # | Coluna | Tipo | Nulo | Default | Extra | Key | Comentário |")
    lines.append("|---:|---|---|---|---|---|---|---|")
    for c in columns:
        lines.append(
            "| {ord} | `{name}` | `{ctype}` | {null} | `{default}` | `{extra}` | `{ckey}` | `{comment}` |".format(
                ord=int(c.get("ordinal") or 0),
                name=c.get("name") or "",
                ctype=c.get("column_type") or c.get("data_type") or "",
                null="YES" if c.get("nullable") else "NO",
                default=str(c.get("default")) if c.get("default") is not None else "",
                extra=c.get("extra") or "",
                ckey=c.get("column_key") or "",
                comment=(c.get("comment") or "").replace("`", "'"),
            )
        )
    lines.append("")

    lines.append("## Campos críticos (INFERIDO)")
    lines.append("- **IDs prováveis**: " + (", ".join([f"`{x}`" for x in id_cols]) if id_cols else "(nenhum padrão _id/id_ detectado)"))
    lines.append("- **Datas/tempos prováveis**: " + (", ".join([f"`{x}`" for x in date_cols]) if date_cols else "(nenhum padrão de data detectado)"))
    lines.append("")

    lines.append("## Frequência de atualização (INFERIDO/limitado)")
    lines.append(
        "- Baseado apenas em `information_schema.TABLES.UPDATE_TIME` (quando disponível).\n"
        f"- Update time observado: `{table_obj.get('update_time')}`\n"
        "- Observação: muitos MySQL não atualizam `UPDATE_TIME` para InnoDB; validar via logs/queries de negócio (FASE 3/4)."
    )
    lines.append("")

    lines.append("## Observações importantes")
    lines.append("- Se não houver PK/FK explícitas, isso pode indicar ausência de constraints no banco (não significa ausência de relacionamento).")
    lines.append("- Próximos passos: validar semântica via exemplos de dados e consultas (FASE 3/4).")
    lines.append("")

    lines.append("## Tags semânticas (INFERIDO)")
    tags = []
    tags.append(dom)
    tags.extend([t for t in re.split(r"[_\\-]+", table_name.lower()) if t and len(t) >= 3][:8])
    tags = list(dict.fromkeys(tags))[:12]
    lines.append("- " + ", ".join([f"`{t}`" for t in tags]))
    lines.append("")

    return "\n".join(lines)


def _knowledge_item_for_table(
    *,
    db: str,
    generated_at: str,
    table_name: str,
    markdown: str,
    table_obj: dict[str, Any],
) -> dict[str, Any]:
    dom, dom_ev = _guess_domain(table_name)
    columns = list(table_obj.get("columns") or [])
    pk = list(table_obj.get("primary_key") or [])
    fks = list(table_obj.get("foreign_keys") or [])

    return {
        "id": f"db::{db}::phase2::table::{table_name}",
        "question": f"Estrutura e relacionamentos da tabela {db}.{table_name}",
        "answer": markdown,
        "category": "DB Table",
        "synced_at": generated_at,
        "source": f"mysql::{db}",
        "metadata": {
            "kind": "db_phase2_table",
            "database": db,
            "table": table_name,
            "domain_inferred": dom,
            "domain_evidence": dom_ev,
            "columns_count": len(columns),
            "pk": pk,
            "fk_count": len(fks),
            "table_rows_estimate": int(table_obj.get("table_rows_estimate") or 0),
            "create_time": table_obj.get("create_time"),
            "update_time": table_obj.get("update_time"),
            "evidence": ["information_schema"],
            "inferences": ["domain_by_name", "critical_fields_by_patterns", "date_fields_by_patterns"],
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default=os.path.join("data", "db_kb", "azportoex_schema.json"))
    parser.add_argument("--out-dir", default=os.path.join("data", "db_kb", "tables_md"))
    parser.add_argument("--out-items", default=os.path.join("data", "db_kb", "phase2_knowledge_items_tables.json"))
    parser.add_argument("--limit", default="0", help="Processar apenas N tabelas (0 = todas).")
    parser.add_argument("--only", default="", help="Regex para filtrar tabelas (opcional). Ex.: '^manifesto$|^cte_'")
    args = parser.parse_args()

    schema = _load(args.schema)
    db = schema.get("database") or "azportoex"
    generated_at = schema.get("generated_at") or _utc_now_iso()
    tables: dict[str, Any] = schema.get("tables") or {}

    names = sorted(tables.keys())
    if args.only:
        rx = re.compile(args.only, re.IGNORECASE)
        names = [n for n in names if rx.search(n)]

    try:
        limit = int(args.limit or 0)
    except Exception:
        limit = 0
    if limit and limit > 0:
        names = names[:limit]

    reverse_fk = _build_reverse_fk(schema)

    items: list[dict[str, Any]] = []
    for tname in names:
        md = _table_doc_markdown(
            db=db,
            generated_at=generated_at,
            table_name=tname,
            table_obj=tables[tname],
            reverse_refs=reverse_fk.get(tname) or [],
        )
        out_path = os.path.join(args.out_dir, f"{tname}.md")
        _write(out_path, md)
        items.append(
            _knowledge_item_for_table(
                db=db,
                generated_at=generated_at,
                table_name=tname,
                markdown=md,
                table_obj=tables[tname],
            )
        )

    os.makedirs(os.path.dirname(args.out_items), exist_ok=True)
    with open(args.out_items, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"[OK] FASE2 tables processed: {len(names)}")
    print(f"[OK] FASE2 md dir: {args.out_dir}")
    print(f"[OK] FASE2 knowledge items: {args.out_items} (items={len(items)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


