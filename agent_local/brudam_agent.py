#!/usr/bin/env python3
import os
import sys
import time
import json
import logging
import gzip
import base64
import uuid
from datetime import datetime, timedelta, date
from pathlib import Path

# Mudar para o diretório do script
os.chdir(Path(__file__).parent)

# Permitir imports do código do projeto (ex.: GeRot/automate/*) a partir do agent_local
try:
    PROJECT_DIR = Path(__file__).resolve().parents[1]  # .../GeRot
    sys.path.insert(0, str(PROJECT_DIR))
except Exception:
    pass

# Carregar .env usando dotenv (mais robusto)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Fallback: carregar manualmente
    env_path = Path(".env")
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip().strip("'").strip('"')

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('brudam_agent.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# Configurações
GEROT_API_URL = os.getenv("GEROT_API_URL", "https://gerot.onrender.com")
AGENT_API_KEY = (os.getenv("AGENT_API_KEY", "") or "").strip()
POLLING_INTERVAL = int(os.getenv("POLLING_INTERVAL", "3"))  # segundos (mais rápido)
MAX_CONCURRENCY = int(os.getenv("MAX_CONCURRENCY", "2"))
AGENT_ID = os.getenv("AGENT_ID", "").strip() or f"agent_local:{os.getenv('COMPUTERNAME','pc')}:{uuid.uuid4().hex[:8]}"

# Brudam (Selenium)
BRUDAM_URL = os.getenv("BRUDAM_URL", "https://azportoex.brudam.com.br/index.php")
BRUDAM_USUARIO = os.getenv("BRUDAM_USUARIO", "")
BRUDAM_SENHA = os.getenv("BRUDAM_SENHA", "")

if not AGENT_API_KEY:
    logger.warning("[AVISO] AGENT_API_KEY nao configurada (requests ao GeRot /api/agent/* vao retornar 401 se o backend exigir API key)")

# MySQL Brudam
MYSQL_CONFIG_AZPORTOEX = {
    "host": os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br"),
    "port": int(os.getenv("MYSQL_AZ_PORT", "3306")),
    "user": os.getenv("MYSQL_AZ_USER", ""),
    "password": os.getenv("MYSQL_AZ_PASSWORD", ""),
    "database": os.getenv("MYSQL_AZ_DB", "azportoex"),
    "charset": "utf8mb4",
    "connect_timeout": 10,
    "read_timeout": 120
}

# portoexsp (filial) - configuração separada
MYSQL_CONFIG_PORTOEXSP = {
    "host": os.getenv("MYSQL_SP_HOST", os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br")),
    "port": int(os.getenv("MYSQL_SP_PORT", os.getenv("MYSQL_AZ_PORT", "3306"))),
    "user": os.getenv("MYSQL_SP_USER", os.getenv("MYSQL_AZ_USER", "")),
    "password": os.getenv("MYSQL_SP_PASSWORD", os.getenv("MYSQL_AZ_PASSWORD", "")),
    "database": os.getenv("MYSQL_SP_DB", "portoexsp"),
    "charset": "utf8mb4",
    "connect_timeout": 10,
    "read_timeout": 120
}

# Config padrão (mantido para compatibilidade)
MYSQL_CONFIG = MYSQL_CONFIG_AZPORTOEX

try:
    import pymysql
    import requests
except ImportError as e:
    logger.error(f"Dependência não encontrada: {e}")
    logger.error("Instale com: pip install pymysql requests")
    sys.exit(1)


def get_mysql_connection(database_name=None):
    """
    Conecta ao MySQL Brudam.
    
    Args:
        database_name: Nome do banco ('azportoex' ou 'portoexsp'). 
                      Se None, usa o padrão (azportoex).
    """
    if database_name == "portoexsp":
        config = MYSQL_CONFIG_PORTOEXSP
        logger.debug(f"Conectando ao banco: portoexsp")
    else:
        config = MYSQL_CONFIG_AZPORTOEX
        logger.debug(f"Conectando ao banco: azportoex (padrão)")
    
    return pymysql.connect(
        **config,
        cursorclass=pymysql.cursors.DictCursor
    )


def detect_database_from_procedure(procedure):
    """
    Detecta qual banco usar baseado no nome da procedure.
    
    Args:
        procedure: Nome da procedure (ex: 'portoexsp.relatorio147' ou 'azportoex.procedure_name')
    
    Returns:
        'azportoex' ou 'portoexsp' ou None se não conseguir detectar
    """
    if not procedure:
        return None
    
    procedure_lower = procedure.lower().strip()
    
    if procedure_lower.startswith("portoexsp."):
        return "portoexsp"
    elif procedure_lower.startswith("azportoex."):
        return "azportoex"
    else:
        # Se não tem prefixo, assume azportoex (padrão)
        return "azportoex"


def test_mysql_connection():
    """Testa conexão com ambos os bancos MySQL."""
    results = {}
    
    # Testar azportoex
    try:
        conn = get_mysql_connection("azportoex")
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE() as db, 1 as test")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.info(f"[OK] Conexao MySQL azportoex OK (banco: {result.get('db', 'N/A')})")
        results["azportoex"] = True
    except Exception as e:
        logger.error(f"[ERRO] Erro ao conectar MySQL azportoex: {e}")
        results["azportoex"] = False
    
    # Testar portoexsp
    try:
        conn = get_mysql_connection("portoexsp")
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE() as db, 1 as test")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.info(f"[OK] Conexao MySQL portoexsp OK (banco: {result.get('db', 'N/A')})")
        results["portoexsp"] = True
    except Exception as e:
        logger.error(f"[ERRO] Erro ao conectar MySQL portoexsp: {e}")
        results["portoexsp"] = False
    
    # Retorna True se pelo menos um banco estiver funcionando
    return any(results.values())


def fetch_pending_rpas():
    """Busca RPAs pendentes no GeRot."""
    try:
        headers = {"X-API-Key": AGENT_API_KEY} if AGENT_API_KEY else {}
        response = requests.get(
            f"{GEROT_API_URL}/api/agent/rpas/pending",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json().get("rpas", [])
        elif response.status_code == 404:
            # Endpoint ainda não existe, retornar vazio
            return []
        else:
            logger.warning(f"Erro ao buscar RPAs: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        logger.error(f"Erro ao conectar ao GeRot: {e}")
        return []


def execute_rpa(rpa: dict) -> dict:
    """Executa uma RPA e retorna o resultado."""
    rpa_id = rpa.get("id")
    name = rpa.get("name", "Sem nome")
    parameters = rpa.get("parameters", {}) or {}
    
    logs = []
    result = {"success": False, "data": None, "error": None, "row_count": 0}
    
    logs.append(f"[{datetime.now().isoformat()}] Iniciando execução: {name}")
    
    try:
        # Conectar ao MySQL
        logs.append(f"[{datetime.now().isoformat()}] Conectando ao MySQL Brudam...")
        conn = get_mysql_connection()
        cursor = conn.cursor()
        logs.append(f"[{datetime.now().isoformat()}] Conexão estabelecida!")
        
        # Obter query dos parâmetros
        query = parameters.get("query", "SELECT 1 as test")
        limit = parameters.get("limit", 100)
        
        # Adicionar LIMIT se não existir
        if "LIMIT" not in query.upper():
            query = f"{query} LIMIT {limit}"
        
        # Segurança: apenas SELECT
        if not query.strip().upper().startswith("SELECT"):
            raise ValueError("Apenas queries SELECT são permitidas")
        
        logs.append(f"[{datetime.now().isoformat()}] Executando query...")
        cursor.execute(query)
        data = cursor.fetchall()
        
        # Converter tipos não serializáveis para JSON
        from decimal import Decimal
        for row in data:
            for key, value in row.items():
                if isinstance(value, datetime):
                    row[key] = value.isoformat()
                elif hasattr(value, 'isoformat'):
                    row[key] = value.isoformat()
                elif isinstance(value, Decimal):
                    row[key] = float(value)
                elif isinstance(value, bytes):
                    row[key] = value.decode('utf-8', errors='replace')
                elif value is not None and not isinstance(value, (str, int, float, bool, list, dict)):
                    row[key] = str(value)
        
        logs.append(f"[{datetime.now().isoformat()}] Query executada! {len(data)} registros.")
        
        result["success"] = True
        result["data"] = data
        result["row_count"] = len(data)
        
        cursor.close()
        conn.close()
        logs.append(f"[{datetime.now().isoformat()}] Conexão fechada.")
        
    except Exception as e:
        logs.append(f"[{datetime.now().isoformat()}] ERRO: {str(e)}")
        result["error"] = str(e)
    
    result["logs"] = logs
    return result


def send_result(rpa_id: int, result: dict):
    """Envia resultado da execução para o GeRot."""
    try:
        headers = {
            "Content-Type": "application/json",
            "X-API-Key": AGENT_API_KEY
        } if AGENT_API_KEY else {"Content-Type": "application/json"}
        
        response = requests.post(
            f"{GEROT_API_URL}/api/agent/rpa/{rpa_id}/result",
            headers=headers,
            json=result,
            timeout=60
        )
        
        if response.status_code == 200:
            logger.info(f"[OK] Resultado enviado para RPA #{rpa_id}")
            return True
        else:
            logger.warning(f"[AVISO] Erro ao enviar resultado: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"[ERRO] Erro ao enviar resultado: {e}")
        return False


def fetch_pending_dashboards():
    """Busca solicitações de dashboard pendentes no GeRot."""
    try:
        headers = {"X-API-Key": AGENT_API_KEY, "X-Agent-Id": AGENT_ID} if AGENT_API_KEY else {"X-Agent-Id": AGENT_ID}
        limit = max(1, min(MAX_CONCURRENCY * 2, 25))
        response = requests.get(
            f"{GEROT_API_URL}/api/agent/dashboards/pending?limit={limit}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json().get("dashboards", [])
        elif response.status_code == 404:
            return []
        else:
            logger.warning(f"Erro ao buscar dashboards: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        logger.error(f"Erro ao conectar ao GeRot: {e}")
        return []


def send_dashboard_progress(dash_id: int, logs_append: list[str] | None = None, percent: int | None = None, text: str | None = None):
    """Envia progresso/logs parciais para alimentar o modal no /agent (polling)."""
    try:
        headers = {"Content-Type": "application/json", "X-API-Key": AGENT_API_KEY, "X-Agent-Id": AGENT_ID} if AGENT_API_KEY else {"Content-Type": "application/json", "X-Agent-Id": AGENT_ID}
        payload: dict = {}
        if logs_append:
            payload["logs_append"] = logs_append
        progress_payload = {}
        if percent is not None:
            progress_payload["percent"] = int(percent)
        if text:
            progress_payload["text"] = str(text)
        if progress_payload:
            payload["progress"] = progress_payload
        if not payload:
            return True

        response = requests.post(
            f"{GEROT_API_URL}/api/agent/dashboard/{dash_id}/progress",
            headers=headers,
            json=payload,
            timeout=20,
        )
        return response.status_code == 200
    except Exception as e:
        logger.warning(f"[AVISO] Falha ao enviar progresso do dashboard #{dash_id}: {e}")
        return False


def execute_dashboard(dash: dict) -> dict:
    """Executa uma solicitação de dashboard e retorna o resultado."""
    dash_id = dash.get("id")
    title = dash.get("title", "Sem titulo")
    dash_category = (dash.get("category") or "").strip().lower()
    filters = dash.get("filters", {}) or {}
    
    logs = []
    result = {"success": False, "data": None, "error": None, "row_count": 0}
    
    logs.append(f"[{datetime.now().isoformat()}] Iniciando dashboard: {title}")
    
    try:
        # Debug de roteamento (ajuda a identificar por que caiu no fallback SQL)
        try:
            filter_keys = list(filters.keys()) if isinstance(filters, dict) else [type(filters).__name__]
        except Exception:
            filter_keys = ["<erro>"]
        logs.append(f"[{datetime.now().isoformat()}] Dashboard meta: category={dash_category} filters_keys={filter_keys[:25]}")

        runner = (filters.get("runner") or "").strip() if isinstance(filters, dict) else ""
        is_selenium_job = (
            runner == "brudam_selenium_report"
            or dash_category == "rpa_selenium"
            or ("brudam" in (title or "").lower() and "selenium" in (title or "").lower())
        )
        is_relatorio_entregas = (
            runner == "relatorio_entregas"
            or dash_category == "relatorio_entregas"
        )

        is_indicadores_executivos = (
            runner == "indicadores_executivos"
            or dash_category == "indicadores_executivos"
            or dash_category == "indicadores"
        )

        if is_indicadores_executivos:
            database = (filters.get("database") or "azportoex").strip() if isinstance(filters, dict) else "azportoex"
            data_inicio = (filters.get("data_inicio") or "").strip() if isinstance(filters, dict) else ""
            data_fim = (filters.get("data_fim") or "").strip() if isinstance(filters, dict) else ""
            custos_dia = filters.get("custos_dia") if isinstance(filters, dict) else None

            if custos_dia is not None:
                try:
                    custos_dia = float(custos_dia)
                except Exception:
                    custos_dia = None

            if not data_inicio or not data_fim:
                hoje = datetime.now().date()
                data_inicio = date(hoje.year, hoje.month, 1).strftime("%Y-%m-%d")
                data_fim = hoje.strftime("%Y-%m-%d")

            logs.append(f"[{datetime.now().isoformat()}] Runner indicadores_executivos: database={database} {data_inicio} a {data_fim}")
            send_dashboard_progress(dash_id, [logs[-1]], percent=5, text="Conectando ao MySQL...")

            di = data_inicio.replace("-", "")
            df = data_fim.replace("-", "")

            try:
                from utils.indicadores_executivos import montar_indicadores_executivos
            except Exception as e:
                logs.append(f"[{datetime.now().isoformat()}] ERRO import indicadores_executivos: {e}")
                result["error"] = str(e)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                return result

            operacoes = []
            total_rows = 0

            try:
                conn_m = get_mysql_connection(database)
                cur = conn_m.cursor()

                def _table_columns(table_name: str) -> set:
                    try:
                        cur.execute(f"SHOW COLUMNS FROM {table_name}")
                        cols = cur.fetchall() or []
                        out = set()
                        for row in cols:
                            name = row.get('Field') if isinstance(row, dict) else None
                            if name:
                                out.add(str(name))
                        return out
                    except Exception:
                        return set()

                minuta_cols = _table_columns('minuta')
                coleta_cols = _table_columns('coleta')

                def _sel(col: str, alias: str = None, table_alias: str = 'm') -> str:
                    a = alias or col
                    if table_alias == 'm':
                        ok = col in minuta_cols
                    else:
                        ok = col in coleta_cols
                    if ok:
                        return f"{table_alias}.{col} AS {a}"
                    return f"NULL AS {a}"

                send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Buscando operações (minuta)..."], percent=15, text="Buscando minutas...")

                q_minuta = f"""
                    SELECT
                        m.id_minuta AS id_operacao,
                        m.id_minuta AS id_minuta,
                        {_sel('coleta_numero', 'id_coleta', 'm')},
                        'Entrega' AS tipo_operacao,
                        {_sel('data', 'data_operacao', 'm')},
                        NULL AS coleta_data,
                        {_sel('total_nf_valor', 'valor_nf', 'm')},
                        {_sel('total_peso', 'peso', 'm')},
                        {_sel('total_volumes', 'volume', 'm')},
                        {_sel('total_cubo', 'cubagem', 'm')},
                        {_sel('status', 'status', 'm')},
                        {_sel('prev_entrega_data', 'prev_entrega_data', 'm')},
                        {_sel('prev_entrega', 'prev_entrega', 'm')},
                        {_sel('data_entrega', 'entrega_data', 'm')}
                    FROM minuta m
                    WHERE m.data >= %s AND m.data <= %s
                """
                cur.execute(q_minuta, (di, df))
                rows = cur.fetchall() or []
                total_rows += len(rows)

                from decimal import Decimal
                for row in rows:
                    op = {}
                    for key, value in row.items():
                        if isinstance(value, Decimal):
                            op[key] = float(value)
                        elif isinstance(value, (datetime, date)):
                            op[key] = value.isoformat() if isinstance(value, datetime) else str(value)
                        else:
                            op[key] = value
                    operacoes.append(op)

                send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Minutas: {len(rows)}"], percent=35, text="Buscando coletas...")

                try:
                    cur.execute("SHOW TABLES LIKE 'coleta'")
                    has_coleta = cur.fetchone() is not None
                except Exception:
                    has_coleta = False

                if has_coleta:
                    q_coleta = f"""
                        SELECT
                            c.id_coleta AS id_operacao,
                            c.id_coleta AS id_coleta,
                            NULL AS id_minuta,
                            'Coleta' AS tipo_operacao,
                            {_sel('data', 'data_operacao', 'c')},
                            {_sel('data', 'coleta_data', 'c')},
                            {_sel('total_nf_valor', 'valor_nf', 'c')},
                            {_sel('total_peso', 'peso', 'c')},
                            {_sel('total_volumes', 'volume', 'c')},
                            {_sel('total_cubo', 'cubagem', 'c')},
                            {_sel('status', 'status', 'c')},
                            {_sel('prev_entrega_data', 'prev_entrega_data', 'c')},
                            {_sel('prev_entrega', 'prev_entrega', 'c')},
                            NULL AS entrega_data
                        FROM coleta c
                        WHERE c.data >= %s AND c.data <= %s
                    """
                    cur.execute(q_coleta, (di, df))
                    rows_c = cur.fetchall() or []
                    total_rows += len(rows_c)
                    for row in rows_c:
                        op = {}
                        for key, value in row.items():
                            if isinstance(value, Decimal):
                                op[key] = float(value)
                            elif isinstance(value, (datetime, date)):
                                op[key] = value.isoformat() if isinstance(value, datetime) else str(value)
                            else:
                                op[key] = value
                        operacoes.append(op)
                    send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Coletas: {len(rows_c)}"], percent=55, text="Calculando indicadores...")
                else:
                    send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Tabela 'coleta' não encontrada; seguindo com minutas"], percent=55, text="Calculando indicadores...")

                cur.close()
                conn_m.close()
            except Exception as e:
                logs.append(f"[{datetime.now().isoformat()}] ERRO indicadores_executivos (MySQL): {e}")
                result["error"] = str(e)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                return result

            try:
                send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Operações carregadas: {len(operacoes)}"], percent=70, text="Calculando indicadores...")
                indicadores_exec = montar_indicadores_executivos(operacoes, custos_dia)

                payload_out = {
                    "success": True,
                    "indicadores_completos": indicadores_exec,
                    "periodo": {"inicio": data_inicio, "fim": data_fim},
                    "database": database,
                    "total_operacoes": len(operacoes),
                    "_meta": {
                        "runner": "indicadores_executivos",
                        "mysql_rows": total_rows,
                    },
                }

                result["success"] = True
                result["data"] = payload_out
                result["row_count"] = len(operacoes)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Concluído: {len(operacoes)} operações"], percent=100, text="Concluído")
                return result
            except Exception as e:
                logs.append(f"[{datetime.now().isoformat()}] ERRO indicadores_executivos (cálculo): {e}")
                result["error"] = str(e)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                return result

        if is_relatorio_entregas:
            # Relatório de Entregas (Script 376) - executa via MySQL local e retorna no formato do frontend
            database = (filters.get("database") or "azportoex").strip()
            data_inicio = (filters.get("data_inicio") or "").strip()
            data_fim = (filters.get("data_fim") or "").strip()
            if not data_inicio or not data_fim:
                hoje = datetime.now().date()
                data_inicio = date(hoje.year, hoje.month, 1).strftime("%Y-%m-%d")
                data_fim = hoje.strftime("%Y-%m-%d")
            di = data_inicio.replace("-", "")
            df = data_fim.replace("-", "")
            logs.append(f"[{datetime.now().isoformat()}] Runner relatorio_entregas: database={database} {data_inicio} a {data_fim}")
            send_dashboard_progress(dash_id, [logs[-1]], percent=10, text="Conectando ao MySQL...")

            NO_PRAZO_KEYS = {"ENTREGUE NO PRAZO", "NO PRAZO", "NO PRAZO (IN.CLIENTE)", "FORA DO PRAZO (IN.CLIENTE)", "ENTREGUE FORA DO PRAZO (IN.CLIENTE)"}
            FORA_PRAZO_KEYS = {"FORA DO PRAZO", "ENTREGUE FORA DO PRAZO"}
            SEM_PREVISAO_KEYS = {"SEM PREVISAO", "PRAZO CONGELADO"}

            query_status = """
                SELECT STATUS, COUNT(*) as qtd
                FROM (
                    SELECT
                        CASE
                            WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
                            WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00')
                                 AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00')
                              THEN 'SEM PREVISAO'
                            WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
                                CASE
                                    WHEN (
                                        (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL
                                        AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false'
                                        AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
                                    ) THEN
                                        CASE
                                            WHEN NOW() > STR_TO_DATE(
                                                CONCAT(
                                                    (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                                                    ' ', (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)
                                                ), '%%Y-%%m-%%d %%H:%%i:%%s'
                                            )
                                            THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                            ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
                                        END
                                    ELSE
                                        CASE
                                            WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
                                              THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                            ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
                                        END
                                END
                            ELSE
                                CASE
                                    WHEN (
                                        COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> ''
                                        AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
                                    ) THEN
                                        CASE
                                            WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%%Y-%%m-%%d %%H:%%i')
                                               > STR_TO_DATE(
                                                    CONCAT(
                                                        (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                                                        ' ', LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)
                                                    ), '%%Y-%%m-%%d %%H:%%i'
                                                )
                                              THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                            ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
                                        END
                                    ELSE
                                        CASE
                                            WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
                                              THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                            ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
                                        END
                                END
                        END AS STATUS
                    FROM minuta m
                    WHERE m.data >= %s AND m.data <= %s
                ) sub
                GROUP BY STATUS
                ORDER BY qtd DESC
            """
            try:
                conn_m = get_mysql_connection(database)
                cur = conn_m.cursor()
                cur.execute(query_status, (di, df))
                rows = cur.fetchall()
                status_counts = {str(row.get("STATUS") or row.get("status", "N/D")): int(row.get("qtd", 0) or 0) for row in rows}
                total = sum(status_counts.values())
                no_prazo = sum(status_counts.get(k, 0) for k in NO_PRAZO_KEYS)
                fora_prazo = sum(status_counts.get(k, 0) for k in FORA_PRAZO_KEYS)
                sem_previsao = sum(status_counts.get(k, 0) for k in SEM_PREVISAO_KEYS)
                agregado = {"no_prazo": no_prazo, "fora_prazo": fora_prazo, "sem_previsao": sem_previsao, "total": total}
                cur.close()
                conn_m.close()
                logs.append(f"[{datetime.now().isoformat()}] Query status OK: {total} entregas")
                send_dashboard_progress(dash_id, [logs[-1]], percent=40, text="Buscando por cliente...")

                por_cliente = []
                q_cliente = """
                    SELECT SUBSTR(c.fantasia, 1, 30) AS cliente, sub.STATUS, COUNT(*) AS qtd
                    FROM (
                        SELECT m.id_cliente,
                            CASE WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
                            WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00') AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN 'SEM PREVISAO'
                            WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
                                CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL
                                    AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false'
                                    AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
                                THEN CASE WHEN NOW() > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)), '%%Y-%%m-%%d %%H:%%i:%%s')
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                                ELSE CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                            END
                            ELSE CASE WHEN COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> '' AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
                                THEN CASE WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%%Y-%%m-%%d %%H:%%i') > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)), '%%Y-%%m-%%d %%H:%%i')
                                THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                            ELSE CASE WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
                                THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                            END
                        END AS STATUS
                        FROM minuta m WHERE m.data >= %s AND m.data <= %s
                    ) sub
                    INNER JOIN fornecedores c ON c.id_local = sub.id_cliente
                    GROUP BY c.id_local, sub.STATUS
                """
                conn2 = get_mysql_connection(database)
                cur_cli = conn2.cursor()
                cur_cli.execute(q_cliente, (di, df))
                rows_cli = cur_cli.fetchall()
                cli_map = {}
                for r in rows_cli:
                    cli = str(r.get("cliente") or r.get("CLIENTE") or "").strip() or "N/D"
                    st = str(r.get("STATUS") or "").strip()
                    q = int(r.get("qtd", 0) or 0)
                    if cli not in cli_map:
                        cli_map[cli] = {"no_prazo": 0, "fora_prazo": 0, "sem_previsao": 0}
                    if st in NO_PRAZO_KEYS:
                        cli_map[cli]["no_prazo"] += q
                    elif st in FORA_PRAZO_KEYS:
                        cli_map[cli]["fora_prazo"] += q
                    else:
                        cli_map[cli]["sem_previsao"] += q
                por_cliente = [{"cliente": k, **v, "total": v["no_prazo"] + v["fora_prazo"] + v["sem_previsao"]} for k, v in cli_map.items()]
                por_cliente.sort(key=lambda x: -x["total"])
                cur_cli.close()
                conn2.close()
                logs.append(f"[{datetime.now().isoformat()}] Query cliente OK: {len(por_cliente)} clientes")
                send_dashboard_progress(dash_id, [logs[-1]], percent=70, text="Buscando por agente...")

                por_agente = []
                q_agente = """
                    SELECT agente, STATUS, COUNT(*) AS qtd
                    FROM (
                        SELECT
                            SUBSTR(CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END, 1, 40) AS agente,
                            CASE WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
                            WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00') AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN 'SEM PREVISAO'
                            WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
                                CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false' AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
                                THEN CASE WHEN NOW() > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)), '%%Y-%%m-%%d %%H:%%i:%%s')
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                                ELSE CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                            END
                            ELSE CASE WHEN COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> '' AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
                                THEN CASE WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%%Y-%%m-%%d %%H:%%i') > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)), '%%Y-%%m-%%d %%H:%%i')
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                                ELSE CASE WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                            END
                        END AS STATUS
                        FROM minuta m
                        LEFT JOIN funcionario fu ON fu.id_funcionario = m.entrega_resp_id AND m.entrega_resp = 1
                        LEFT JOIN fornecedores fe ON fe.id_local = m.entrega_resp_id AND m.entrega_resp = 2
                        LEFT JOIN terceiros te ON te.id_terceiro = m.entrega_resp_id AND m.entrega_resp = 3
                        WHERE m.data >= %s AND m.data <= %s
                    ) sub
                    WHERE sub.agente IS NOT NULL AND sub.agente <> ''
                    GROUP BY sub.agente, sub.STATUS
                """
                conn3 = get_mysql_connection(database)
                cur2 = conn3.cursor()
                cur2.execute(q_agente, (di, df))
                rows_ag = cur2.fetchall()
                ag_map = {}
                for r in rows_ag:
                    ag = str(r.get("agente") or "").strip() or "N/D"
                    st = str(r.get("STATUS") or "").strip()
                    q = int(r.get("qtd", 0) or 0)
                    if ag not in ag_map:
                        ag_map[ag] = {"no_prazo": 0, "fora_prazo": 0, "sem_previsao": 0}
                    if st in NO_PRAZO_KEYS:
                        ag_map[ag]["no_prazo"] += q
                    elif st in FORA_PRAZO_KEYS:
                        ag_map[ag]["fora_prazo"] += q
                    else:
                        ag_map[ag]["sem_previsao"] += q
                por_agente = [{"agente": k, **v, "total": v["no_prazo"] + v["fora_prazo"] + v["sem_previsao"]} for k, v in ag_map.items()]
                por_agente.sort(key=lambda x: -x["total"])
                cur2.close()
                conn3.close()
                logs.append(f"[{datetime.now().isoformat()}] Query agente OK: {len(por_agente)} agentes")

                # Minutas por agente (para exibir ao clicar no agente)
                minutas_por_agente = {}
                q_minutas = """
                    SELECT
                        SUBSTR(CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END, 1, 40) AS agente,
                        m.id_minuta AS id_minuta,
                        m.id_minuta AS numero_minuta,
                        SUBSTR(c.fantasia, 1, 40) AS cliente,
                        CASE WHEN m.cte_numero > 0 THEN CONCAT(m.cte_numero, '-', COALESCE(m.cte_serie, '')) ELSE '' END AS cte,
                        CASE WHEN m.coleta_numero > 0 THEN CAST(m.coleta_numero AS CHAR) ELSE '' END AS ordem_coleta,
                        CASE WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
                        WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00') AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN 'SEM PREVISAO'
                        WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
                            CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false' AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
                                THEN CASE WHEN NOW() > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)), '%%Y-%%m-%%d %%H:%%i:%%s')
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                                ELSE CASE WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END END
                        END
                        ELSE CASE WHEN COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> '' AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
                            THEN CASE WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%%Y-%%m-%%d %%H:%%i') > STR_TO_DATE(CONCAT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END), ' ', LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)), '%%Y-%%m-%%d %%H:%%i')
                                THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                            ELSE CASE WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
                                THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END END
                        END
                        END AS status_minuta
                    FROM minuta m
                    LEFT JOIN funcionario fu ON fu.id_funcionario = m.entrega_resp_id AND m.entrega_resp = 1
                    LEFT JOIN fornecedores fe ON fe.id_local = m.entrega_resp_id AND m.entrega_resp = 2
                    LEFT JOIN terceiros te ON te.id_terceiro = m.entrega_resp_id AND m.entrega_resp = 3
                    LEFT JOIN fornecedores c ON c.id_local = m.id_cliente
                    WHERE m.data >= %s AND m.data <= %s
                      AND (CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END) IS NOT NULL
                      AND (CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END) <> ''
                """
                try:
                    conn4 = get_mysql_connection(database)
                    cur4 = conn4.cursor()
                    cur4.execute(q_minutas, (di, df))
                    rows_min = cur4.fetchall()
                    for r in rows_min:
                        ag = str(r.get("agente") or "").strip() or "N/D"
                        if ag not in minutas_por_agente:
                            minutas_por_agente[ag] = []
                        minutas_por_agente[ag].append({
                            "id_minuta": r.get("id_minuta"),
                            "numero": r.get("numero_minuta") or r.get("numero") or "",
                            "cliente": str(r.get("cliente") or "").strip() or "N/D",
                            "status": str(r.get("status_minuta") or "").strip() or "N/D",
                            "cte": str(r.get("cte") or "").strip() or "",
                            "ordem_coleta": str(r.get("ordem_coleta") or "").strip() or "",
                        })
                    cur4.close()
                    conn4.close()
                    logs.append(f"[{datetime.now().isoformat()}] Minutas por agente: {sum(len(v) for v in minutas_por_agente.values())} registros")
                except Exception as em:
                    logs.append(f"[{datetime.now().isoformat()}] AVISO minutas_por_agente: {em}")
            except Exception as e:
                logs.append(f"[{datetime.now().isoformat()}] ERRO relatorio_entregas: {e}")
                result["error"] = str(e)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                return result

            payload_out = {
                "success": True,
                "status_counts": status_counts,
                "agregado": agregado,
                "por_cliente": por_cliente,
                "por_agente": por_agente,
                "minutas_por_agente": minutas_por_agente,
                "total": total,
                "data_inicio": data_inicio,
                "data_fim": data_fim,
                "database": database,
            }
            result["success"] = True
            result["data"] = payload_out
            result["row_count"] = total
            result["logs"] = logs
            send_dashboard_progress(dash_id, [f"[{datetime.now().isoformat()}] Concluído: {total} entregas"], percent=100, text="Concluído")
            return result

        if is_selenium_job:
            # Execução local via Selenium (sem SQL): usa o fluxo do automate/ia.py como referência
            from brudam_selenium_report import run_brudam_selenium_complete_report
            try:
                from automate.automation_catalog import BRUDAM_CLIENTS
            except Exception:
                BRUDAM_CLIENTS = []  # fallback

            data_inicio = (filters.get("data_inicio") or "").strip() if isinstance(filters, dict) else ""
            data_fim = (filters.get("data_fim") or "").strip() if isinstance(filters, dict) else ""
            modo = (filters.get("modo") or "completo").strip() if isinstance(filters, dict) else "completo"
            headless = bool(filters.get("headless", True)) if isinstance(filters, dict) else True

            # Credenciais (sem vazar senha em logs)
            brudam_url = (filters.get("brudam_url") or BRUDAM_URL) if isinstance(filters, dict) else BRUDAM_URL
            brudam_usuario = (filters.get("brudam_usuario") or BRUDAM_USUARIO) if isinstance(filters, dict) else BRUDAM_USUARIO
            brudam_senha = (filters.get("brudam_senha") or BRUDAM_SENHA) if isinstance(filters, dict) else BRUDAM_SENHA
            senha_len = len(brudam_senha or "")
            logs.append(
                f"[{datetime.now().isoformat()}] Credenciais Brudam: usuario={'<vazio>' if not brudam_usuario else brudam_usuario} senha={'<vazia>' if senha_len == 0 else f'<{senha_len} chars>'} url={brudam_url}"
            )
            send_dashboard_progress(dash_id, [logs[-1]])

            # Fallback: se as datas não vieram em filters, tenta extrair do título
            if (not data_inicio or not data_fim) and isinstance(title, str):
                import re
                m = re.search(r"(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})", title)
                if m:
                    data_inicio = data_inicio or m.group(1)
                    data_fim = data_fim or m.group(2)

            logs.append(f"[{datetime.now().isoformat()}] Runner Selenium acionado: runner={runner or '<auto>'} modo={modo} headless={headless} data_inicio={data_inicio} data_fim={data_fim}")
            send_dashboard_progress(dash_id, [logs[-1]], percent=5, text="Iniciando Selenium...")

            # Progresso "com heartbeat" para evitar sensação de travamento em waits longos (login/atalho/consulta).
            last_progress = {"percent": -1, "text": "", "t": 0.0}

            def _progress(pct: int, txt: str):
                pct_i = int(pct)
                now = time.time()
                # Permite repetir o mesmo % quando o texto muda OU passou tempo suficiente (heartbeat)
                if (
                    pct_i == last_progress["percent"]
                    and str(txt) == last_progress["text"]
                    and (now - last_progress["t"] < 4.0)
                ):
                    return
                last_progress["percent"] = pct_i
                last_progress["text"] = str(txt)
                last_progress["t"] = now
                line = f"[{datetime.now().isoformat()}] {txt} ({pct_i}%)"
                logs.append(line)
                send_dashboard_progress(dash_id, [line], percent=pct_i, text=txt)

            # Buffer de logs: reduz chamadas HTTP durante o Selenium (ganho de tempo perceptível)
            log_buf: list[str] = []
            last_flush = {"t": time.time()}

            def _flush_logs(force: bool = False):
                now = time.time()
                if not log_buf:
                    return
                if (not force) and (len(log_buf) < 15) and (now - last_flush["t"] < 1.2):
                    return
                batch = log_buf[:]
                log_buf.clear()
                last_flush["t"] = now
                send_dashboard_progress(dash_id, batch)

            def _log(msg: str):
                line = f"[{datetime.now().isoformat()}] {msg}"
                logs.append(line)
                log_buf.append(line)
                _flush_logs(force=False)

            try:
                try:
                    payload = run_brudam_selenium_complete_report(
                        data_inicio=data_inicio,
                        data_fim=data_fim,
                        modo=modo,
                        headless=headless,
                        clientes=BRUDAM_CLIENTS or [],
                        credentials={
                            "url": brudam_url,
                            "usuario": brudam_usuario,
                            "senha": brudam_senha,
                        },
                        log=_log,
                        progress=_progress,
                        run_tag=f"dash_{dash_id}",
                    )
                except Exception as e:
                    logs.append(f"[{datetime.now().isoformat()}] ERRO no runner Selenium: {e}")
                    result["error"] = str(e)
                    result["logs"] = logs
                    send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                    return result
            finally:
                # Sempre tentar enviar logs pendentes (mesmo em erro/timeout)
                _flush_logs(force=True)

            # Gerar HTML no MESMO modelo do ia.py (relatorio_completo_brudam_*.html)
            _progress(94, "Gerando HTML completo (modelo ia.py)...")
            try:
                from automate import ia as ia_mod

                class _DummyVar:
                    def __init__(self, v: str):
                        self._v = v

                    def get(self) -> str:
                        return self._v

                dummy = type("Dummy", (), {})()
                dummy.stats = {"dados_geral": payload.get("dados_geral") or [], "dados_clientes": payload.get("dados_clientes") or {}}
                dummy.data_inicial = _DummyVar(payload.get("data_inicio_ddmmyyyy") or "")
                dummy.data_final = _DummyVar(payload.get("data_fim_ddmmyyyy") or "")
                dummy.log_message = lambda *_a, **_k: None

                html_path = ia_mod.BrudamAssistant.generate_complete_html_report(dummy)
                html_str = ""
                if html_path and os.path.exists(html_path):
                    with open(html_path, "r", encoding="utf-8") as f:
                        html_str = f.read()
                else:
                    raise RuntimeError("Falha ao gerar arquivo HTML no ia.py")

                payload_out = {
                    "html": html_str,
                    "html_filename": os.path.basename(html_path) if html_path else None,
                    "meta": {
                        "runner": "brudam_selenium_report",
                        "modo": modo,
                        "data_inicio": data_inicio,
                        "data_fim": data_fim,
                    },
                }
                _progress(100, "Concluído")
                result["success"] = True
                result["data"] = payload_out
                result["row_count"] = 0
                result["logs"] = logs
                return result
            except Exception as e:
                logs.append(f"[{datetime.now().isoformat()}] ERRO ao gerar HTML: {e}")
                result["error"] = str(e)
                result["logs"] = logs
                send_dashboard_progress(dash_id, [logs[-1]], percent=100, text="Falhou")
                return result

        # Definir estratégia
        limit = int(filters.get("limit", 100))
        procedure = (filters.get("procedure") or "").strip()
        procedure_params = filters.get("procedure_params") or {}
        query = filters.get("query")
        
        # Detectar qual banco usar baseado na procedure
        database_name = (filters.get("database") or "").strip() if isinstance(filters, dict) else ""
        if database_name not in ("azportoex", "portoexsp"):
            database_name = detect_database_from_procedure(procedure) or "azportoex"
        
        logs.append(f"[{datetime.now().isoformat()}] ========== INÍCIO EXECUÇÃO DASHBOARD ==========")
        logs.append(f"[{datetime.now().isoformat()}] Banco detectado: {database_name}")
        logs.append(f"[{datetime.now().isoformat()}] Filtros recebidos: procedure={procedure}, procedure_params={procedure_params}, query={query}, limit={limit}")
        
        # Conectar ao MySQL usando o banco correto
        logs.append(f"[{datetime.now().isoformat()}] Conectando ao MySQL Brudam (banco: {database_name})...")
        conn = get_mysql_connection(database_name)
        # Garantir que o cursor retorne dicionários
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        if procedure:
            logs.append(f"[{datetime.now().isoformat()}] ✅ PROCEDURE DETECTADA: {procedure}")
            logs.append(f"[{datetime.now().isoformat()}] Procedure params recebidos: {procedure_params}")
            
            # Procedures que não aceitam parâmetros (relatorio147 em ambos os bancos)
            procedures_sem_parametros = [
                "portoexsp.relatorio147",
                "azportoex.relatorio147",
                "relatorio147"  # Caso venha sem prefixo
            ]
            
            # Normalizar nome da procedure para comparação
            procedure_normalized = procedure.lower().strip()
            # Verificar se a procedure é relatorio147 (pode ter prefixo de banco ou não)
            is_relatorio147 = (
                procedure_normalized == "relatorio147" or
                procedure_normalized.endswith(".relatorio147") or
                "relatorio147" in procedure_normalized
            )
            
            logs.append(f"[{datetime.now().isoformat()}] Verificação relatorio147: procedure_normalized='{procedure_normalized}', is_relatorio147={is_relatorio147}")
            
            if is_relatorio147:
                logs.append(f"[{datetime.now().isoformat()}] Procedure {procedure} é relatorio147 - NÃO aceita parâmetros - chamando sem parâmetros")
                logs.append(f"[{datetime.now().isoformat()}] Ignorando procedure_params: {procedure_params} (filtro será aplicado após buscar dados)")
                try:
                    try:
                        cursor.execute(f"CALL {procedure}()")
                    except Exception as e:
                        # Fallbacks para ambientes onde o schema-qualified não existe
                        msg = str(e)
                        if "1305" in msg or "does not exist" in msg.lower():
                            # tenta sem prefixo (conexão já está no schema correto)
                            proc_name = procedure.split(".", 1)[-1]
                            logs.append(f"[{datetime.now().isoformat()}] ⚠️ Procedure não encontrada, tentando fallback: CALL {proc_name}()")
                            try:
                                cursor.execute(f"CALL {proc_name}()")
                            except Exception as e2:
                                # tentativa extra: descobrir rotina similar no schema via information_schema
                                try:
                                    cursor.execute(
                                        """
                                        SELECT ROUTINE_NAME
                                        FROM information_schema.routines
                                        WHERE ROUTINE_TYPE = 'PROCEDURE'
                                          AND ROUTINE_SCHEMA = DATABASE()
                                          AND ROUTINE_NAME LIKE %s
                                        ORDER BY ROUTINE_NAME
                                        LIMIT 1
                                        """,
                                        ("%relatorio147%",),
                                    )
                                    found = cursor.fetchone()
                                    if found and found.get("ROUTINE_NAME"):
                                        alt = found["ROUTINE_NAME"]
                                        logs.append(f"[{datetime.now().isoformat()}] 🔎 Encontrada procedure alternativa: {alt}()")
                                        cursor.execute(f"CALL {alt}()")
                                    else:
                                        raise e2
                                except Exception:
                                    raise e2
                        else:
                            raise
                    logs.append(f"[{datetime.now().isoformat()}] Procedure executada com sucesso (sem parâmetros)")
                    if cursor.description:
                        columns = [desc[0] for desc in cursor.description]
                        logs.append(f"[{datetime.now().isoformat()}] Colunas retornadas: {columns[:10]}")
                    else:
                        logs.append(f"[{datetime.now().isoformat()}] AVISO: cursor.description está vazio!")
                except Exception as e:
                    logs.append(f"[{datetime.now().isoformat()}] ERRO ao executar procedure: {e}")
                    import traceback
                    logs.append(f"[{datetime.now().isoformat()}] Traceback: {traceback.format_exc()}")
                    raise
            else:
                # Outras procedures podem aceitar parâmetros
                if procedure_params:
                    placeholders = ", ".join(["%s"] * len(procedure_params))
                    sql = f"CALL {procedure}({placeholders})"
                    params = list(procedure_params.values())
                    logs.append(f"[{datetime.now().isoformat()}] Executando procedure com parâmetros: {sql}, params={params}")
                    try:
                        cursor.execute(sql, params)
                    except Exception as e:
                        msg = str(e)
                        if "1305" in msg or "does not exist" in msg.lower():
                            proc_name = procedure.split(".", 1)[-1]
                            sql2 = f"CALL {proc_name}({placeholders})"
                            logs.append(f"[{datetime.now().isoformat()}] ⚠️ Procedure não encontrada, tentando fallback: {sql2}")
                            cursor.execute(sql2, params)
                        else:
                            raise
                else:
                    logs.append(f"[{datetime.now().isoformat()}] Executando procedure sem parâmetros: CALL {procedure}()")
                    try:
                        cursor.execute(f"CALL {procedure}()")
                    except Exception as e:
                        msg = str(e)
                        if "1305" in msg or "does not exist" in msg.lower():
                            proc_name = procedure.split(".", 1)[-1]
                            logs.append(f"[{datetime.now().isoformat()}] ⚠️ Procedure não encontrada, tentando fallback: CALL {proc_name}()")
                            cursor.execute(f"CALL {proc_name}()")
                        else:
                            raise
        else:
            logs.append(f"[{datetime.now().isoformat()}] ⚠️ PROCEDURE NÃO DETECTADA - Usando query padrão")
            query = (query or "SELECT 1 as test").strip()
            
            if not query.upper().startswith("SELECT"):
                raise ValueError("Apenas queries SELECT são permitidas")
            
            if "LIMIT" not in query.upper():
                query = f"{query} LIMIT {limit}"
            
            logs.append(f"[{datetime.now().isoformat()}] Executando query customizada: {query}")
            cursor.execute(query)
        
        data = cursor.fetchall()

        # Para procedures, pode haver múltiplos result sets (às vezes o 1º vem vazio)
        if procedure:
            result_sets = [data]
            while cursor.nextset():
                additional_data = cursor.fetchall()
                result_sets.append(additional_data)
                if additional_data:
                    logs.append(f"[{datetime.now().isoformat()}] Result set adicional encontrado: {len(additional_data)} registros")

            # Escolher o primeiro result set não-vazio (fallback: o que tiver mais registros)
            non_empty = [rs for rs in result_sets if isinstance(rs, list) and len(rs) > 0]
            if non_empty:
                # Preferir o primeiro não-vazio (ordem do DB), mas garantir que seja o maior caso o 1º seja "lixo"
                best = max(non_empty, key=lambda rs: len(rs))
                if best is not data:
                    logs.append(f"[{datetime.now().isoformat()}] Usando result set com mais registros: {len(best)} (total sets={len(result_sets)})")
                data = best
            else:
                logs.append(f"[{datetime.now().isoformat()}] Nenhum result set retornou registros (total sets={len(result_sets)})")
        else:
            while cursor.nextset():
                pass
        
        logs.append(f"[{datetime.now().isoformat()}] Dados brutos retornados: {len(data)} registros")
        if data:
            # Log do primeiro registro bruto para debug
            first_row = data[0]
            logs.append(f"[{datetime.now().isoformat()}] Primeiro registro bruto (tipo: {type(first_row).__name__}): {list(first_row.keys())[:10] if hasattr(first_row, 'keys') else 'N/A'}")
            if hasattr(first_row, 'items'):
                sample_keys = list(first_row.keys())[:5]
                sample_data = {k: str(first_row.get(k))[:30] for k in sample_keys}
                logs.append(f"[{datetime.now().isoformat()}] Exemplo de campos do primeiro registro: {json.dumps(sample_data, ensure_ascii=False)}")
        
        # Filtrar por data se procedure_params contiver data_inicio e data_fim
        # (útil para procedures que não aceitam parâmetros como relatorio147)
        if procedure and procedure_params:
            data_inicio = procedure_params.get("data_inicio")
            data_fim = procedure_params.get("data_fim")
            
            if data_inicio and data_fim:
                logs.append(f"[{datetime.now().isoformat()}] Aplicando filtro de data: {data_inicio} a {data_fim}")
                logs.append(f"[{datetime.now().isoformat()}] Total de registros antes do filtro: {len(data)}")
                try:
                    # Converter strings de data para datetime para comparação
                    dt_inicio = datetime.strptime(data_inicio, "%Y-%m-%d") if isinstance(data_inicio, str) else data_inicio
                    dt_fim = datetime.strptime(data_fim, "%Y-%m-%d") if isinstance(data_fim, str) else data_fim
                    # Para comparação de datas, não precisamos ajustar o tempo - vamos comparar apenas as datas
                    
                    logs.append(f"[{datetime.now().isoformat()}] Período de filtro: {dt_inicio.date()} a {dt_fim.date()}")
                    
                    # Filtrar dados baseado no campo 'data' ou 'data_coleta'
                    filtered_data = []
                    rows_without_date = 0
                    rows_with_date = 0
                    rows_filtered_out = 0
                    
                    for row in data:
                        row_date = None
                        date_field_used = None
                        # Tentar diferentes campos de data (priorizar 'data' e 'data_coleta')
                        for date_field in ['data', 'data_coleta', 'data_emissao', 'datamov']:
                            if date_field in row and row[date_field]:
                                try:
                                    if isinstance(row[date_field], str):
                                        # Tentar diferentes formatos de data
                                        for fmt in ["%d/%m/%Y", "%Y-%m-%d", "%Y/%m/%d", "%d-%m-%Y"]:
                                            try:
                                                row_date = datetime.strptime(row[date_field], fmt)
                                                date_field_used = date_field
                                                break
                                            except:
                                                continue
                                    elif hasattr(row[date_field], 'date'):
                                        # É um objeto date/datetime do MySQL
                                        if isinstance(row[date_field], datetime):
                                            row_date = row[date_field]
                                        else:
                                            # Converter date para datetime para comparação
                                            row_date = datetime.combine(row[date_field].date(), datetime.min.time())
                                        date_field_used = date_field
                                    break
                                except Exception as e:
                                    continue
                        
                        if row_date:
                            rows_with_date += 1
                            # Garantir que row_date seja datetime para comparação
                            if isinstance(row_date, datetime):
                                # Comparar apenas a data (ignorar hora)
                                row_date_only = row_date.date()
                                dt_inicio_only = dt_inicio.date()
                                dt_fim_only = dt_fim.date()
                                
                                # Comparação simples de datas (já inclui o dia completo)
                                if dt_inicio_only <= row_date_only <= dt_fim_only:
                                    filtered_data.append(row)
                                    # Log dos primeiros 3 registros que passaram no filtro para debug
                                    if len(filtered_data) <= 3:
                                        logs.append(f"[{datetime.now().isoformat()}] Registro {len(filtered_data)} passou no filtro: data={row_date_only}, frete={row.get('frete')}, resultado={row.get('resultado')}")
                                else:
                                    rows_filtered_out += 1
                                    # Log dos primeiros 3 registros que foram filtrados para debug
                                    if rows_filtered_out <= 3:
                                        logs.append(f"[{datetime.now().isoformat()}] Registro filtrado: data={row_date_only}, fora do período {dt_inicio_only} a {dt_fim_only}")
                            else:
                                # Se não for datetime, incluir por segurança
                                filtered_data.append(row)
                        else:
                            rows_without_date += 1
                            # Se não conseguir determinar a data, incluir por segurança
                            # (pode ser que o campo de data tenha um nome diferente ou formato não reconhecido)
                            filtered_data.append(row)
                            if rows_without_date <= 3:  # Log apenas os primeiros 3 para debug
                                logs.append(f"[{datetime.now().isoformat()}] AVISO: Registro sem data identificável. Campos disponíveis: {list(row.keys())[:10]}")
                    
                    data = filtered_data
                    logs.append(f"[{datetime.now().isoformat()}] Filtro aplicado: {len(data)} registros após filtro")
                    logs.append(f"[{datetime.now().isoformat()}] Estatísticas: {rows_with_date} com data, {rows_without_date} sem data, {rows_filtered_out} fora do período")
                except Exception as e:
                    import traceback
                    logs.append(f"[{datetime.now().isoformat()}] AVISO: Erro ao filtrar por data: {e}")
                    logs.append(f"[{datetime.now().isoformat()}] Traceback: {traceback.format_exc()}")
                    logs.append(f"[{datetime.now().isoformat()}] Retornando todos os dados sem filtro")
        
        # ------------------------------------------------------------------
        # Regras de negócio (Relatório 147):
        # - "Faturado" e "À vista" são opções na MESMA coluna forma_pagamento
        # - backend envia tokens (AND / contém) em filters.forma_pagamento_tokens
        # ------------------------------------------------------------------
        try:
            import unicodedata

            def _norm(val) -> str:
                if val is None:
                    return ""
                s = str(val).strip().lower()
                # Remover caractere de substituição (encoding quebrado, ex.: "a� vista")
                s = s.replace("\ufffd", "")
                s = unicodedata.normalize("NFKD", s)
                s = "".join(ch for ch in s if not unicodedata.combining(ch))
                s = s.replace("  ", " ")
                return s

            def _get_ci(row: dict, wanted: list[str]) -> str | None:
                keys = {str(k).lower(): k for k in (row or {}).keys()}
                for w in wanted:
                    k = keys.get(w.lower())
                    if k is not None:
                        return row.get(k)
                # fallback: procura por substring
                for lk, orig in keys.items():
                    for w in wanted:
                        if w.lower().replace("_", "") in lk.replace("_", ""):
                            return row.get(orig)
                return None

            fp_tokens = []
            if isinstance(filters, dict):
                raw = filters.get("forma_pagamento_tokens")
                if isinstance(raw, list):
                    fp_tokens = [str(x).strip() for x in raw if str(x).strip()]
                else:
                    single = (filters.get("forma_pagamento") or "").strip()
                    fp_tokens = [single] if single else []
            if not fp_tokens:
                fp_tokens = ["Faturado", "A vista"]

            fp_excl = []
            if isinstance(filters, dict):
                raw_ex = filters.get("forma_pagamento_exclude_tokens")
                if isinstance(raw_ex, list):
                    fp_excl = [str(x).strip() for x in raw_ex if str(x).strip()]
                else:
                    fp_excl = ["Cortesia"]
            if not fp_excl:
                fp_excl = ["Cortesia"]

            if isinstance(data, list) and data and fp_tokens:
                before = len(data)
                tokens_norm = [_norm(t) for t in fp_tokens if _norm(t)]
                excl_norm = [_norm(t) for t in fp_excl if _norm(t)]

                # Detectar se a coluna existe (evita filtrar tudo para vazio quando a coluna não veio)
                sample_rows = [r for r in data[:20] if isinstance(r, dict)]
                has_forma_col = any(_get_ci(r, ["forma_pagamento", "forma pagamento", "formapagamento"]) is not None for r in sample_rows)

                if tokens_norm and not has_forma_col:
                    logs.append(f"[{datetime.now().isoformat()}] AVISO: coluna 'forma_pagamento' não encontrada no retorno; ignorando filtro de forma_pagamento.")
                    tokens_norm = []

                # Diagnóstico: amostra de valores de forma_pagamento antes do filtro
                try:
                    vals = []
                    for r in sample_rows:
                        v = _get_ci(r, ["forma_pagamento", "forma pagamento", "formapagamento"])
                        if v is not None and str(v).strip():
                            vals.append(str(v).strip())
                        if len(vals) >= 12:
                            break
                    if vals:
                        logs.append(f"[{datetime.now().isoformat()}] Amostra forma_pagamento (pré-filtro): {vals}")
                except Exception:
                    pass

                def _keep(row: dict) -> bool:
                    fp = _norm(_get_ci(row, ["forma_pagamento", "forma pagamento", "formapagamento"]))
                    # OR: aceita qualquer token marcado (valores são opções na MESMA coluna)
                    ok_incl = any(t in fp for t in tokens_norm) if tokens_norm else True
                    ok_excl = all(t not in fp for t in excl_norm) if excl_norm else True
                    return ok_incl and ok_excl

                data = [r for r in data if isinstance(r, dict) and _keep(r)]
                logs.append(f"[{datetime.now().isoformat()}] Filtro negócio aplicado: forma_pagamento_tokens={fp_tokens} exclude={fp_excl} ({before} -> {len(data)})")
        except Exception as e:
            logs.append(f"[{datetime.now().isoformat()}] AVISO: falha ao aplicar filtros de negócio: {e}")
        
        from decimal import Decimal
        sanitized = []
        logs.append(f"[{datetime.now().isoformat()}] Iniciando sanitização de {len(data)} registros (limite: {limit})")
        
        for idx, row in enumerate(data):
            if idx >= limit:
                break
            
            # Verificar se row é um dicionário
            if not isinstance(row, dict):
                logs.append(f"[{datetime.now().isoformat()}] AVISO: Registro {idx} não é um dicionário: {type(row).__name__}")
                continue
            
            clean_row = {}
            for key, value in row.items():
                if isinstance(value, datetime):
                    clean_row[key] = value.isoformat()
                elif hasattr(value, 'isoformat'):
                    clean_row[key] = value.isoformat()
                elif isinstance(value, Decimal):
                    clean_row[key] = float(value)
                elif isinstance(value, bytes):
                    clean_row[key] = value.decode('utf-8', errors='replace')
                elif value is not None and not isinstance(value, (str, int, float, bool, list, dict)):
                    clean_row[key] = str(value)
                else:
                    clean_row[key] = value
            
            # Adicionar informação do banco de origem para facilitar análise quando "ambas" for selecionado
            if database_name:
                clean_row['_database_source'] = database_name
            
            # Log do primeiro registro sanitizado para debug
            if idx == 0:
                logs.append(f"[{datetime.now().isoformat()}] Primeiro registro sanitizado: {json.dumps({k: str(v)[:50] for k, v in list(clean_row.items())[:10]}, ensure_ascii=False)}")
            
            sanitized.append(clean_row)
        
        logs.append(f"[{datetime.now().isoformat()}] Execução concluída com {len(sanitized)} registros (limite {limit}).")
        
        # Log de exemplo do primeiro registro para debug
        if sanitized:
            sample = sanitized[0]
            logs.append(f"[{datetime.now().isoformat()}] Exemplo de registro (primeiro): {json.dumps({k: str(v)[:50] for k, v in list(sample.items())[:10]}, ensure_ascii=False)}")
            # Verificar campos importantes
            campos_importantes = ['frete', 'resultado', 'volumes', 'receita', 'valor']
            campos_encontrados = {k: v for k, v in sample.items() if any(imp in k.lower() for imp in campos_importantes)}
            if campos_encontrados:
                logs.append(f"[{datetime.now().isoformat()}] Campos importantes encontrados: {json.dumps(campos_encontrados, ensure_ascii=False, default=str)}")
            else:
                logs.append(f"[{datetime.now().isoformat()}] AVISO: Nenhum campo importante encontrado no registro!")
                logs.append(f"[{datetime.now().isoformat()}] Campos disponíveis: {list(sample.keys())[:20]}")
        
        result["success"] = True
        result["data"] = sanitized
        result["row_count"] = len(sanitized)
        
        cursor.close()
        conn.close()
        logs.append(f"[{datetime.now().isoformat()}] Conexao fechada.")
        
    except Exception as e:
        logs.append(f"[{datetime.now().isoformat()}] ERRO: {str(e)}")
        result["error"] = str(e)
    
    result["logs"] = logs
    return result


def send_dashboard_result(dash_id: int, result: dict):
    """
    Envia resultado do dashboard para o GeRot em chunks com compressão.
    Garante que TODOS os dados sejam enviados sem perdas.
    """
    max_retries = 5
    timeout_seconds = 300  # 5 minutos por chunk para cargas grandes
    chunk_size = 2000  # Manter 2000 registros por chunk para estabilidade
    
    # Normalizar payload para evitar erro no backend (len(None))
    # - sucesso com tabela: list[dict]
    # - sucesso Selenium: dict (ex.: {"html": "...", ...})
    # - falha: garantir lista vazia
    if result.get("data") is None:
        result["data"] = []
    data = result.get("data", [])
    total_records = len(data) if isinstance(data, list) else 0
    logs = result.get("logs", [])
    
    logger.info(f"[ENVIO] Iniciando envio de {total_records} registros para Dashboard #{dash_id}")
    
    # Se não houver dados ou dados pequenos, enviar tudo de uma vez
    if total_records <= chunk_size:
        return _send_single_chunk(dash_id, result, timeout_seconds, max_retries)
    
    # Dividir em chunks e enviar sequencialmente
    chunks = []
    for i in range(0, total_records, chunk_size):
        chunk_data = data[i:i + chunk_size]
        chunks.append({
            "chunk_index": len(chunks),
            "total_chunks": (total_records + chunk_size - 1) // chunk_size,
            "data": chunk_data,
            "chunk_start": i,
            "chunk_end": min(i + chunk_size, total_records)
        })
    
    logger.info(f"[ENVIO] Dividido em {len(chunks)} chunks de até {chunk_size} registros cada")
    
    # Enviar chunks sequencialmente
    all_sent = True
    for chunk_info in chunks:
        chunk_result = {
            "success": result.get("success", True),
            "data": chunk_info["data"],
            "row_count": len(chunk_info["data"]),
            "logs": logs if chunk_info["chunk_index"] == 0 else [],  # Logs apenas no primeiro chunk
            "_chunk_info": {
                "chunk_index": chunk_info["chunk_index"],
                "total_chunks": chunk_info["total_chunks"],
                "chunk_start": chunk_info["chunk_start"],
                "chunk_end": chunk_info["chunk_end"],
                "total_records": total_records
            }
        }
        
        if not _send_single_chunk(dash_id, chunk_result, timeout_seconds, max_retries):
            logger.error(f"[ERRO] Falha ao enviar chunk {chunk_info['chunk_index'] + 1}/{len(chunks)}")
            all_sent = False
            # Continuar tentando enviar os outros chunks mesmo se um falhar
        else:
            logger.info(f"[OK] Chunk {chunk_info['chunk_index'] + 1}/{len(chunks)} enviado com sucesso")
    
    if all_sent:
        logger.info(f"[OK] Todos os {len(chunks)} chunks enviados com sucesso para Dashboard #{dash_id}")
        return True
    else:
        logger.error(f"[ERRO] Alguns chunks falharam ao enviar para Dashboard #{dash_id}")
        return False


def _send_single_chunk(dash_id: int, result: dict, timeout_seconds: int, max_retries: int):
    """Envia um único chunk de dados com compressão e retry."""
    for attempt in range(max_retries):
        try:
            headers = {
                "Content-Type": "application/json",
                "X-API-Key": AGENT_API_KEY,
                "X-Agent-Id": AGENT_ID,
                "Content-Encoding": "gzip"  # Indicar que está comprimido
            } if AGENT_API_KEY else {
                "Content-Type": "application/json",
                "X-Agent-Id": AGENT_ID,
                "Content-Encoding": "gzip"
            }
            
            # Comprimir dados para reduzir tamanho do payload
            json_str = json.dumps(result, ensure_ascii=False, default=str)
            compressed = gzip.compress(json_str.encode('utf-8'))
            
            chunk_info = result.get("_chunk_info", {})
            if chunk_info:
                logger.info(f"[TENTATIVA {attempt + 1}/{max_retries}] Enviando chunk {chunk_info.get('chunk_index', 0) + 1}/{chunk_info.get('total_chunks', 1)} "
                          f"(registros {chunk_info.get('chunk_start', 0)}-{chunk_info.get('chunk_end', 0)}) "
                          f"- Tamanho: {len(compressed)} bytes comprimidos (timeout: {timeout_seconds}s)")
            else:
                logger.info(f"[TENTATIVA {attempt + 1}/{max_retries}] Enviando resultado para Dashboard #{dash_id} "
                          f"- Tamanho: {len(compressed)} bytes comprimidos (timeout: {timeout_seconds}s)")
            
            response = requests.post(
                f"{GEROT_API_URL}/api/agent/dashboard/{dash_id}/result",
                headers=headers,
                data=compressed,  # Enviar dados comprimidos diretamente
                timeout=timeout_seconds
            )
            
            if response.status_code == 200:
                if chunk_info:
                    logger.info(f"[OK] Chunk {chunk_info.get('chunk_index', 0) + 1} enviado com sucesso")
                else:
                    logger.info(f"[OK] Resultado enviado para Dashboard #{dash_id}")
                return True
            else:
                logger.warning(f"[AVISO] Erro ao enviar: {response.status_code} - {response.text[:200]}")
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5
                    logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                    time.sleep(wait_time)
                    continue
                return False
                
        except requests.exceptions.Timeout as e:
            logger.error(f"[ERRO] Timeout ao enviar (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 10
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                timeout_seconds = min(timeout_seconds * 1.5, 600)
                continue
            return False
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[ERRO] Erro de conexão (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 10
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                continue
            return False
        except Exception as e:
            logger.error(f"[ERRO] Erro ao enviar (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 5
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                continue
            return False
    
    return False
    
    for attempt in range(max_retries):
        try:
            headers = {
                "Content-Type": "application/json",
                "X-API-Key": AGENT_API_KEY
            } if AGENT_API_KEY else {"Content-Type": "application/json"}
            
            logger.info(f"[TENTATIVA {attempt + 1}/{max_retries}] Enviando resultado para Dashboard #{dash_id} (timeout: {timeout_seconds}s)")
            
            response = requests.post(
                f"{GEROT_API_URL}/api/agent/dashboard/{dash_id}/result",
                headers=headers,
                json=result,
                timeout=timeout_seconds
            )
            
            if response.status_code == 200:
                logger.info(f"[OK] Resultado enviado para Dashboard #{dash_id}")
                return True
            else:
                logger.warning(f"[AVISO] Erro ao enviar resultado dashboard: {response.status_code} - {response.text[:200]}")
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5  # Backoff: 5s, 10s, 15s
                    logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                    time.sleep(wait_time)
                    continue
                return False
                
        except requests.exceptions.Timeout as e:
            logger.error(f"[ERRO] Timeout ao enviar resultado dashboard (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 10  # Backoff maior para timeout
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                # Aumentar timeout na próxima tentativa
                timeout_seconds = min(timeout_seconds * 1.5, 600)  # Máximo 10 minutos
                continue
            return False
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[ERRO] Erro de conexão ao enviar resultado dashboard (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 10
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                continue
            return False
        except Exception as e:
            logger.error(f"[ERRO] Erro ao enviar resultado dashboard (tentativa {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 5
                logger.info(f"[RETRY] Aguardando {wait_time}s antes de tentar novamente...")
                time.sleep(wait_time)
                continue
            return False
    
    return False


def run_agent():
    """Loop principal do agente."""
    logger.info("=" * 60)
    logger.info("[AGENTE] Brudam iniciado")
    logger.info(f"   GeRot URL: {GEROT_API_URL}")
    logger.info(f"   MySQL: {MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}")
    logger.info(f"   Polling: {POLLING_INTERVAL}s")
    logger.info("=" * 60)
    
    # Testar conexão MySQL (não bloquear o agente — algumas automações rodam via Selenium sem MySQL)
    if not test_mysql_connection():
        logger.warning("[AVISO] Não foi possível conectar ao MySQL agora. Automations via SQL vão falhar; Selenium continua disponível.")
    
    while True:
        try:
            has_work = False
            
            # Buscar RPAs pendentes
            rpas = fetch_pending_rpas()
            
            if rpas:
                has_work = True
                logger.info(f"[INFO] {len(rpas)} RPA(s) pendente(s)")
                
                for rpa in rpas:
                    rpa_id = rpa.get("id")
                    name = rpa.get("name", "Sem nome")
                    
                    logger.info(f"[EXEC] Executando RPA #{rpa_id}: {name}")
                    
                    # Executar
                    result = execute_rpa(rpa)
                    
                    # Enviar resultado
                    send_result(rpa_id, result)
                    
                    if result["success"]:
                        logger.info(f"[OK] RPA #{rpa_id} concluida: {result['row_count']} registros")
                    else:
                        logger.error(f"[ERRO] RPA #{rpa_id} falhou: {result['error']}")
            
            # Buscar Dashboards pendentes
            dashboards = fetch_pending_dashboards()
            
            if dashboards:
                has_work = True
                logger.info(f"[INFO] {len(dashboards)} Dashboard(s) pendente(s)")

                # Concorrência controlada para suportar múltiplas execuções no mesmo PC/VM
                # (evita uma fila enorme quando há muitos usuários)
                from concurrent.futures import ThreadPoolExecutor, as_completed

                def _process_one(dash: dict):
                    dash_id = dash.get("id")
                    title = dash.get("title", "Sem titulo")
                    category = (dash.get("category") or "").strip()
                    filters = dash.get("filters", {}) or {}
                    try:
                        keys = list(filters.keys()) if isinstance(filters, dict) else [type(filters).__name__]
                    except Exception:
                        keys = ["<erro>"]
                    runner = (filters.get("runner") or "") if isinstance(filters, dict) else ""
                    logger.info(f"[EXEC] Processando Dashboard #{dash_id}: {title} (category={category} runner={runner} filters_keys={keys[:20]})")
                    result = execute_dashboard(dash)
                    ok_send = send_dashboard_result(dash_id, result)
                    return dash_id, title, result, ok_send

                workers = max(1, min(MAX_CONCURRENCY, 8))
                with ThreadPoolExecutor(max_workers=workers) as ex:
                    futs = [ex.submit(_process_one, d) for d in dashboards]
                    for fut in as_completed(futs):
                        dash_id, title, result, ok_send = fut.result()
                        if not ok_send:
                            logger.warning(f"[AVISO] Falha ao enviar resultado do Dashboard #{dash_id} (vai depender de retry do agente)")
                        if result.get("success"):
                            logger.info(f"[OK] Dashboard #{dash_id} concluido: {result.get('row_count', 0)} registros")
                        else:
                            logger.error(f"[ERRO] Dashboard #{dash_id} falhou: {result.get('error')}")
            
            # Aguardar próximo polling (adaptativo)
            sleep_time = 1 if has_work else POLLING_INTERVAL
            time.sleep(sleep_time)
            
        except KeyboardInterrupt:
            logger.info("[STOP] Agente interrompido pelo usuario")
            break
        except Exception as e:
            logger.error(f"Erro no loop principal: {e}")
            time.sleep(POLLING_INTERVAL)


if __name__ == "__main__":
    run_agent()
