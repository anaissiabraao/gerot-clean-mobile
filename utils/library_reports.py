from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

import matplotlib.pyplot as plt

from utils.pdf_generator import PDFGenerator


@dataclass(frozen=True)
class TabularReport:
    title: str
    subtitle: str | None
    generated_at: str
    columns: list[str]
    rows: list[list[Any]]
    summary: dict[str, Any]


def _safe_str(v: Any) -> str:
    if v is None:
        return ""
    return str(v)


def build_tabular_report(title: str, records: list[dict[str, Any]], subtitle: str | None = None) -> TabularReport:
    generated_at = datetime.now().strftime("%d/%m/%Y %H:%M")
    if not records:
        return TabularReport(
            title=title,
            subtitle=subtitle,
            generated_at=generated_at,
            columns=[],
            rows=[],
            summary={"row_count": 0},
        )

    # Colunas determinísticas: usa chaves do primeiro registro
    columns = list(records[0].keys())
    rows = [[r.get(c) for c in columns] for r in records]

    # Métricas básicas
    summary: dict[str, Any] = {"row_count": len(records), "columns": columns}

    # Inferir colunas numéricas (amostrando)
    def _to_float(v: Any) -> float | None:
        if v is None:
            return None
        s = str(v).strip()
        if not s:
            return None
        # normalizações comuns (pt-BR)
        s = s.replace(".", "").replace(",", ".")
        # remove símbolos
        for ch in ["R$", "%", "(", ")", " "]:
            s = s.replace(ch, "")
        try:
            return float(s)
        except Exception:
            return None

    numeric_cols: list[str] = []
    numeric_sums: dict[str, float] = {}
    sample = records[:50]
    for c in columns:
        parsed = [_to_float(r.get(c)) for r in sample]
        parsed_ok = [p for p in parsed if p is not None]
        if len(parsed_ok) >= max(3, int(len(sample) * 0.6)):
            numeric_cols.append(c)
            numeric_sums[c] = 0.0
            for r in records:
                v = _to_float(r.get(c))
                if v is not None:
                    numeric_sums[c] += v

    summary["numeric_columns"] = numeric_cols
    summary["numeric_sums"] = numeric_sums

    # Top grupos (para insights): escolhe primeira coluna não-numérica com boa cardinalidade
    group_col = None
    for c in columns:
        if c in numeric_cols:
            continue
        # evita IDs puros
        if c.lower().endswith("_id") or c.lower().startswith("id_"):
            continue
        group_col = c
        break
    top_groups = []
    if group_col:
        counts: dict[str, int] = {}
        for r in records:
            k = _safe_str(r.get(group_col)) or "N/A"
            counts[k] = counts.get(k, 0) + 1
        top_groups = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:10]
    summary["group_by"] = group_col
    summary["top_groups"] = top_groups

    return TabularReport(
        title=title,
        subtitle=subtitle,
        generated_at=generated_at,
        columns=columns,
        rows=rows,
        summary=summary,
    )


def render_report_html(report: TabularReport) -> str:
    # Template HTML corporativo simples (único) - reutilizável para modal e export.
    # Mantém CSS inline para portabilidade.
    cols = report.columns
    header_cells = "".join([f"<th>{_safe_str(c)}</th>" for c in cols])
    body_rows = []
    for r in report.rows[:500]:  # limite defensivo para HTML
        tds = "".join([f"<td>{_safe_str(v)}</td>" for v in r])
        body_rows.append(f"<tr>{tds}</tr>")
    body_html = "\n".join(body_rows)

    subtitle_html = f"<div class='subtitle'>{report.subtitle}</div>" if report.subtitle else ""

    # KPIs dinâmicos: row_count + 2 somatórios relevantes (se existirem)
    sums = report.summary.get("numeric_sums") or {}
    top_sum_items = sorted(sums.items(), key=lambda x: abs(x[1]), reverse=True)[:2]
    kpi_extra = ""
    for key, val in top_sum_items:
        kpi_extra += f"""
        <div class="kpi">
          <div class="label">{_safe_str(key)}</div>
          <div class="value">{val:,.2f}</div>
        </div>"""
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{report.title}</title>
  <style>
    :root {{
      --bg: #0b1220;
      --card: #0f1a2e;
      --muted: #94a3b8;
      --text: #e2e8f0;
      --brand: #3b82f6;
      --border: rgba(148,163,184,.18);
    }}
    body {{ margin:0; background:#f6f7fb; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#0f172a; }}
    .wrap {{ max-width:1100px; margin: 32px auto; padding: 0 16px; }}
    .header {{
      background: linear-gradient(135deg, #0b1220, #102042);
      color: var(--text);
      border-radius: 14px;
      padding: 22px 20px;
      box-shadow: 0 18px 40px rgba(2, 6, 23, .18);
    }}
    .title {{ font-size: 22px; font-weight: 700; margin:0; }}
    .subtitle {{ margin-top:6px; color: var(--muted); font-size: 13px; }}
    .meta {{ margin-top:10px; color: rgba(226,232,240,.75); font-size: 12px; }}
    .kpis {{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top: 14px; }}
    .kpi {{ background: rgba(15,26,46,.65); border: 1px solid var(--border); border-radius: 12px; padding: 12px; }}
    .kpi .label {{ color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }}
    .kpi .value {{ font-size: 18px; font-weight: 700; margin-top: 4px; }}
    .card {{ background:white; border: 1px solid rgba(15,23,42,.08); border-radius: 14px; padding: 16px; margin-top: 14px; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th, td {{ text-align:left; padding: 10px 10px; border-bottom: 1px solid rgba(15,23,42,.08); font-size: 12px; }}
    th {{ background: #f1f5f9; position: sticky; top: 0; z-index: 1; }}
    .note {{ color: #64748b; font-size: 12px; margin-top: 10px; }}
    @media (max-width: 760px) {{
      .kpis {{ grid-template-columns: 1fr; }}
      th, td {{ font-size: 11px; padding: 8px; }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="header">
      <h1 class="title">{report.title}</h1>
      {subtitle_html}
      <div class="meta">Gerado em: {report.generated_at}</div>
      <div class="kpis">
        <div class="kpi">
          <div class="label">Registros</div>
          <div class="value">{report.summary.get("row_count", 0)}</div>
        </div>
        <div class="kpi">
          <div class="label">Colunas</div>
          <div class="value">{len(report.columns)}</div>
        </div>
        {kpi_extra}
      </div>
    </section>

    <section class="card">
      <div style="overflow:auto; max-height: 70vh;">
        <table>
          <thead><tr>{header_cells}</tr></thead>
          <tbody>
            {body_html}
          </tbody>
        </table>
      </div>
      <div class="note">Mostrando até 500 linhas no HTML. Exporte para Excel/PDF para o dataset completo.</div>
    </section>
  </div>
</body>
</html>"""


def generate_report_pdf(report: TabularReport) -> bytes:
    pdf = PDFGenerator()
    pdf.add_header(report.title)
    if report.subtitle:
        pdf.add_text(report.subtitle, 11, "")
    pdf.add_text(f"Gerado em: {report.generated_at}", 10, "")
    pdf.pdf.ln(4)

    pdf.add_text("Resumo executivo", 12, "B")
    pdf.add_text(f"Registros: {report.summary.get('row_count', 0)}", 11, "")
    pdf.add_text(f"Colunas: {len(report.columns)}", 11, "")
    sums = report.summary.get("numeric_sums") or {}
    if sums:
        top_sum_items = sorted(sums.items(), key=lambda x: abs(x[1]), reverse=True)[:3]
        for key, val in top_sum_items:
            pdf.add_text(f"Soma {key}: {val:,.2f}", 11, "")
    pdf.pdf.ln(6)

    # Tabela (cap defensivo)
    if report.columns and report.rows:
        pdf.add_text("Dados coletados (amostra)", 12, "B")
        sample_rows = report.rows[:40]
        safe_sample = [[_safe_str(v)[:40] for v in row] for row in sample_rows]
        pdf.add_table(report.columns[:8], [r[:8] for r in safe_sample])  # limita colunas para caber
        pdf.pdf.ln(8)

    # Gráfico simples: prioriza top grupos (contagem) se existir, senão top 10 por soma numérica
    try:
        top_groups = report.summary.get("top_groups") or []
        if top_groups:
            labels = [k for k, _ in top_groups]
            vals = [v for _, v in top_groups]
            fig, ax = plt.subplots(figsize=(10, 4))
            ax.bar(labels, vals, color="#3b82f6", alpha=0.85)
            ax.set_title(f"Top 10 por {report.summary.get('group_by') or 'grupo'} (contagem)")
            ax.tick_params(axis="x", labelrotation=35)
            plt.tight_layout()
            pdf.add_text("Gráfico", 12, "B")
            pdf.add_chart_from_matplotlib(fig)
        else:
            if report.rows and report.columns:
                cat_idx = 0
                num_idx = None
                numeric_cols = report.summary.get("numeric_columns") or []
                for i, c in enumerate(report.columns):
                    if c in numeric_cols:
                        num_idx = i
                        break
                if num_idx is not None:
                    agg: dict[str, float] = {}
                    for row in report.rows:
                        k = _safe_str(row[cat_idx]) or "N/A"
                        try:
                            v = float(str(row[num_idx]).replace(".", "").replace(",", "."))
                        except Exception:
                            v = 0.0
                        agg[k] = agg.get(k, 0.0) + v
                    top = sorted(agg.items(), key=lambda x: x[1], reverse=True)[:10]
                    labels = [k for k, _ in top]
                    vals = [v for _, v in top]
                    fig, ax = plt.subplots(figsize=(10, 4))
                    ax.bar(labels, vals, color="#3b82f6", alpha=0.85)
                    ax.set_title("Top 10 (agregado)")
                    ax.tick_params(axis="x", labelrotation=35)
                    plt.tight_layout()
                    pdf.add_text("Gráfico", 12, "B")
                    pdf.add_chart_from_matplotlib(fig)
    except Exception:
        # Não falhar geração do PDF por causa de gráfico
        pass

    buf = bytes(pdf.pdf.output(dest="S"))
    return buf

