from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

AutomationCategory = Literal["Fiscal", "Controladoria", "Logística", "Financeiro"]
AutomationKind = Literal[
    # Cria um registro em agent_dashboard_requests e acompanha via status/<id>
    "agent_dashboard_request",
    # Cria um registro em agent_rpas e acompanha via rpa/<id>/logs
    "agent_rpa",
]


@dataclass(frozen=True)
class AutomationParam:
    key: str
    label: str
    type: Literal["date", "text", "select", "number"]
    required: bool = True
    default: Any | None = None
    placeholder: str | None = None
    options: list[dict[str, str]] | None = None  # [{value,label}]
    help_text: str | None = None


@dataclass(frozen=True)
class Automation:
    id: str
    name: str
    description: str
    category: AutomationCategory
    kind: AutomationKind
    # "Fonte única" do fluxo: etapas exibidas no modal (derivadas do padrão de execução do RPA)
    steps: list[str]
    # Parâmetros visíveis no formulário do card/modal
    params: list[AutomationParam]
    # Para kind="agent_dashboard_request": category armazenada em agent_dashboard_requests.category
    request_category: str | None = None


# ---------------------------------------------------------------------------
# Fonte única de verdade (fase 1):
# - Este catálogo alimenta o /agent (Biblioteca)
# - Também deve ser usado como referência para evoluções do RPA (ex.: automate/ia.py)
# ---------------------------------------------------------------------------

# Extraído do padrão existente em automate/ia.py (data range + execução + resultado)
DEFAULT_STEPS = [
    "Validar parâmetros",
    "Enfileirar execução",
    "Executar no Agente Local",
    "Consolidar resultado",
    "Gerar relatório (HTML/PDF)",
]

BRUDAM_CLIENTS: list[str] = [
    # Mantido como lista explícita para evitar import pesado do ia.py no backend.
    # (Fonte única: evoluir aqui e o ia.py pode consumir via import opcional.)
    "SAMSONITE",
    "ITAPOA TERMINAIS PORTUARI",
    "FORTE",
    "ANSELL",
    "COMEXPORT",
    "MATTEL",
    "VENTUNO",
    "HERCULES",
    "LOJAS AVENIDA S.A",
    "BATIKI COM IMPORT EXPORT",
    "SEGER COMERCIAL IMPORTADO",
    "AC COMERCIAL",
    "BERTOLUCCI",
    "STRATUS COMERCIAL TEXTIL",
    "ITACORDA INDUSTRIA E COME",
    "SKO COMERCIO, IMPORTACAO",
    "BRAFT DO BRASIL IMPORTACA",
    "TECADI ARMAZENS GERAIS LT",
    "CLIF",
    "CKS INTERNATIONAL COMERCI",
    "BSG BIJOU BRASIL COMERCIO",
    "HGS GAS E AGUA DO BRASIL",
    "WINWIN TEXTILCOMERCIO E I",
    "TIMBRO",
    "GEO AGRI TECNOLOGIA AGRIC",
    "FOTON MOTOR DO BRASIL VEN",
    "FITA UP LTDA",
    "TOTALITY COMERCIO TECNICO",
    "MRCEGLIA IMPORTACAO E SER",
]


AUTOMATIONS: list[Automation] = [
    Automation(
        id="auditoria_fiscal_manifestos",
        name="Auditoria Fiscal • Manifestos",
        description="Auditoria de manifestos no Brudam (azportoex), com filtros por período e operador.",
        category="Fiscal",
        kind="agent_dashboard_request",
        request_category="auditoria",
        steps=DEFAULT_STEPS,
        params=[
            AutomationParam(key="data_inicio", label="Data início", type="date", required=True),
            AutomationParam(key="data_fim", label="Data fim", type="date", required=True),
            AutomationParam(
                key="operador_id",
                label="Operador (opcional)",
                type="number",
                required=False,
                placeholder="Ex.: 123",
                help_text="Se vazio, considera todos os operadores.",
            ),
        ],
    ),
    Automation(
        id="relatorio_resultados_controladoria",
        name="Relatório de Resultados • Controladoria",
        description="Executa procedure do Relatório 147 (mês atual e últimos 3 meses) e consolida resultados (Matriz/Filial SP).",
        category="Financeiro",
        kind="agent_dashboard_request",
        request_category="relatorio_resultados",
        steps=DEFAULT_STEPS,
        params=[
            AutomationParam(
                key="period",
                label="Período",
                type="select",
                required=True,
                default="mes_atual",
                options=[
                    {"value": "mes_atual", "label": "Mês atual"},
                    {"value": "mes_menos1", "label": "Mês -1"},
                    {"value": "mes_menos2", "label": "Mês -2"},
                    {"value": "mes_menos3", "label": "Mês -3"},
                    {"value": "custom", "label": "Custom (datas)"},
                ],
            ),
            AutomationParam(key="data_inicio", label="Data início (custom)", type="date", required=False),
            AutomationParam(key="data_fim", label="Data fim (custom)", type="date", required=False),
            AutomationParam(
                key="database",
                label="Unidade",
                type="select",
                required=True,
                default="azportoex",
                options=[
                    {"value": "azportoex", "label": "MATRIZ (azportoex)"},
                    {"value": "portoexsp", "label": "FILIAL SP (portoexsp)"},
                ],
            ),
            AutomationParam(
                key="forma_pagamento",
                label="Forma de pagamento (tokens, default: Faturado + À vista)",
                type="select",
                required=True,
                default="A vista",
                options=[
                    {"value": "A vista", "label": "À vista"},
                    {"value": "", "label": "Todas"},
                ],
            ),
        ],
    ),
    Automation(
        id="gerar_dashboard",
        name="Gerar Dashboard",
        description="Gera um dashboard com base em filtros e tipos de gráfico. (Enfileira para o Agente Local)",
        category="Controladoria",
        kind="agent_dashboard_request",
        request_category="dashboard_gen",
        steps=DEFAULT_STEPS,
        params=[
            AutomationParam(key="title", label="Título", type="text", required=True, placeholder="Ex.: KPIs Operação"),
            AutomationParam(
                key="description",
                label="Descrição",
                type="text",
                required=True,
                placeholder="Ex.: Visão executiva dos indicadores do período",
            ),
            AutomationParam(key="filters_json", label="Filtros (JSON)", type="text", required=False, placeholder='{"query":"..."}'),
        ],
    ),
    Automation(
        id="logistica_km_por_motorista",
        name="Logística • KM Rodado por Motorista",
        description="Consolida KM rodado, valores e custos por motorista no período (Brudam).",
        category="Logística",
        kind="agent_dashboard_request",
        request_category="logistica",
        steps=DEFAULT_STEPS,
        params=[
            AutomationParam(key="data_inicio", label="Data início", type="date", required=True),
            AutomationParam(key="data_fim", label="Data fim", type="date", required=True),
            AutomationParam(
                key="database",
                label="Base",
                type="select",
                required=True,
                default="azportoex",
                options=[
                    {"value": "azportoex", "label": "azportoex (matriz)"},
                    {"value": "portoexsp", "label": "portoexsp (filial)"},
                    {"value": "ambas", "label": "Ambas"},
                ],
                help_text="Em 'Ambas', cria duas execuções e consolida no relatório.",
            ),
        ],
    ),
    Automation(
        id="brudam_relatorio_completo_selenium",
        name="Brudam • Relatório Completo (Selenium)",
        description="Executa o RPA local (Selenium) e gera o relatório completo no modelo 'relatorio_completo_brudam_*.html'.",
        category="Controladoria",
        kind="agent_dashboard_request",
        request_category="rpa_selenium",
        steps=[
            "Validar parâmetros",
            "Enfileirar execução",
            "Abrir navegador (Selenium)",
            "Coletar dados (visão geral + clientes)",
            "Gerar relatório HTML (modelo completo)",
        ],
        params=[
            AutomationParam(key="data_inicio", label="Data início", type="date", required=True),
            AutomationParam(key="data_fim", label="Data fim", type="date", required=True),
            AutomationParam(
                key="modo",
                label="Modo",
                type="select",
                required=True,
                default="completo",
                options=[
                    {"value": "completo", "label": "Completo (inclui clientes)"},
                    {"value": "geral", "label": "Somente Visão Geral (mais rápido)"},
                ],
                help_text="Em 'Completo', roda a busca por cliente e monta abas/gráficos por cliente no HTML.",
            ),
            AutomationParam(
                key="headless",
                label="Navegador em 2º plano (headless)",
                type="select",
                required=True,
                default="1",
                options=[
                    {"value": "1", "label": "Sim (headless)"},
                    {"value": "0", "label": "Não (mostrar Chrome)"},
                ],
                help_text="Se 'Não', o Chrome abre na sua máquina durante a execução do agente local.",
            ),
        ],
    ),
]


def list_automations() -> list[Automation]:
    return AUTOMATIONS


def get_automation(automation_id: str) -> Automation | None:
    for a in AUTOMATIONS:
        if a.id == automation_id:
            return a
    return None

