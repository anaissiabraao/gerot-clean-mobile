import os
import sys
import json
import time
import logging
import hashlib
import requests
import pymysql
import re
from datetime import datetime
from pathlib import Path

# Configuração de Log
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('sync_engine.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# Caminhos e integrações externas
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DOCLING_PATH = os.getenv("DOCLING_PATH", str(BASE_DIR / "docling-main"))
if os.path.isdir(DEFAULT_DOCLING_PATH) and DEFAULT_DOCLING_PATH not in sys.path:
    sys.path.append(DEFAULT_DOCLING_PATH)

DOCLING_AVAILABLE = False
try:
    from docling.document_converter import DocumentConverter
    from docling.datamodel.base_models import InputFormat

    DOCLING_AVAILABLE = True
except Exception as docling_error:  # noqa: F841
    logger.warning(
        "Docling não disponível (%s). Ingestão de PDFs/DOCX será ignorada.",
        docling_error,
    )

# Carregar variáveis de ambiente
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configurações
GEROT_API_URL = os.getenv("GEROT_API_URL", "https://gerot.onrender.com")
AGENT_API_KEY = os.getenv("AGENT_API_KEY", "")
LOCAL_RAG_API_URL = os.getenv("LOCAL_RAG_API_URL") or os.getenv("RAG_API_URL", "")
LOCAL_RAG_API_KEY = os.getenv("LOCAL_RAG_API_KEY") or os.getenv("RAG_API_KEY", "local-dev")
LOCAL_RAG_INGEST_ENABLED = os.getenv("LOCAL_RAG_INGEST_ENABLED", "false").lower() == "true"
LOCAL_RAG_INGEST_ONLY_ON_CHANGE = os.getenv("LOCAL_RAG_INGEST_ONLY_ON_CHANGE", "true").lower() == "true"
LOCAL_RAG_TIMEOUT_SECONDS = int(os.getenv("LOCAL_RAG_TIMEOUT_SECONDS", "20"))
MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_AZ_HOST", "10.147.17.88"),
    "port": int(os.getenv("MYSQL_AZ_PORT", "3306")),
    "user": os.getenv("MYSQL_AZ_USER", ""),
    "password": os.getenv("MYSQL_AZ_PASSWORD", ""),
    "database": os.getenv("MYSQL_AZ_DB", "azportoex"),
    "charset": "utf8mb4",
    "connect_timeout": 10
}

QUERIES_FILE = os.path.join("config", "queries.json")
DATA_FILE = os.path.join("data", "knowledge_dump.json")
DOC_KNOWLEDGE_DIR = Path(os.getenv("KNOWLEDGE_DOCS_DIR", os.path.join("documents", "incoming")))
DOC_DEFAULT_CATEGORY = os.getenv("KNOWLEDGE_DOC_CATEGORY", "Documentos")
SUPPORTED_DOC_EXTENSIONS = {".pdf", ".docx", ".png", ".jpg", ".jpeg"}
LOCAL_RAG_CHECKSUM_FILE = Path(__file__).resolve().parent / ".last_rag_ingest_checksum"

def _int_from_env(var_name: str, default: int) -> int:
    try:
        return int(os.getenv(var_name, default))
    except (TypeError, ValueError):
        return default

DOC_SECTION_MAX_CHARS = _int_from_env("DOC_SECTION_MAX_CHARS", 1200)
DOC_SECTIONS_LIMIT = _int_from_env("DOC_SECTIONS_LIMIT", 25)

def get_mysql_connection():
    return pymysql.connect(**MYSQL_CONFIG, cursorclass=pymysql.cursors.DictCursor)

def load_queries():
    if not os.path.exists(QUERIES_FILE):
        logger.error(f"Arquivo de queries não encontrado: {QUERIES_FILE}")
        return []
    try:
        with open(QUERIES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Erro ao ler queries.json: {e}")
        return []

def run_sync():
    logger.info(">>> Iniciando motor de sincronização...")

    knowledge_items = []

    query_items = collect_query_knowledge()
    if query_items:
        knowledge_items.extend(query_items)
        logger.info("✓ Conhecimentos de consultas SQL: %s item(s)", len(query_items))

    doc_items = collect_docling_knowledge()
    if doc_items:
        knowledge_items.extend(doc_items)
        logger.info("✓ Conhecimentos extraídos de documentos: %s item(s)", len(doc_items))

    if not knowledge_items:
        logger.warning("Nenhum conhecimento gerado de queries ou documentos.")
        return 0

    os.makedirs("data", exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(knowledge_items, f, indent=2, default=str)
    logger.info(f"Dump salvo em: {DATA_FILE}")

    send_to_gerot(knowledge_items)

    # Opcional: enfileirar ingestão no RAG local (FastAPI) para vetorização.
    if LOCAL_RAG_INGEST_ENABLED and LOCAL_RAG_API_URL:
        try:
            queued = send_to_local_rag(knowledge_items)
            logger.info("✓ Enfileirado para RAG local: %s item(s)", queued)
        except Exception as exc:
            logger.warning("Falha ao enviar conhecimento ao RAG local: %s", exc)
    return len(knowledge_items)


def collect_query_knowledge():
    queries = load_queries()
    if not queries:
        logger.info("Nenhuma query SQL configurada para sincronização.")
        return []

    knowledge_items = []
    conn = None
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor()

        for q in queries:
            try:
                # Executar SQL
                cursor.execute(q['sql'])
                row = cursor.fetchone()

                if row:
                    # Preparar contexto para formatação
                    ctx = row.copy()
                    ctx['date'] = datetime.now().strftime("%d/%m/%Y")
                    ctx['time'] = datetime.now().strftime("%H:%M")
                    
                    # Formatar resposta
                    answer = q['answer_template'].format(**ctx)
                    
                    item = {
                        "id": q.get('id'),
                        "question": q['question_template'],
                        "answer": answer,
                        "category": q.get('category', 'Geral'),
                        "allowed_roles": q.get('allowed_roles', []),
                        "synced_at": datetime.now().isoformat()
                    }
                    
                    knowledge_items.append(item)
                    logger.info(f"[OK] {q['id']}: {answer}")
                else:
                    logger.warning(f"[VAZIO] {q['id']} retornou sem dados.")

            except Exception as e:
                logger.error(f"[ERRO] Query '{q.get('id')}': {e}")

        cursor.close()
    except Exception as e:
        logger.error(f"Erro fatal na sincronização: {e}")
    finally:
        if conn:
            conn.close()

    return knowledge_items


def collect_docling_knowledge():
    if not DOCLING_AVAILABLE:
        return []

    docs_dir = DOC_KNOWLEDGE_DIR
    if not docs_dir.exists():
        logger.info("Diretório de documentos %s não existe. Pulando ingestão de arquivos.", docs_dir)
        return []

    allowed_formats = [InputFormat.PDF, InputFormat.DOCX, InputFormat.IMAGE]
    converter = DocumentConverter(allowed_formats=allowed_formats)
    knowledge_items = []

    for doc_path in sorted(docs_dir.glob("**/*")):
        if doc_path.is_dir() or doc_path.suffix.lower() not in SUPPORTED_DOC_EXTENSIONS:
            continue

        logger.info("Processando documento: %s", doc_path.name)
        try:
            conv_result = converter.convert(doc_path)
            markdown_text = conv_result.document.export_to_markdown()
            metadata_title = getattr(conv_result.document, "metadata", None)
            doc_title = getattr(metadata_title, "title", None) or doc_path.stem

            sections = extract_markdown_sections(markdown_text, default_title=doc_title)
            if not sections:
                sections = [{"title": doc_title, "content": markdown_text}]

            for idx, section in enumerate(sections[:DOC_SECTIONS_LIMIT], start=1):
                chunks = chunk_section_text(section["content"])
                for chunk_idx, chunk in enumerate(chunks, start=1):
                    if len(chunk) < 80:
                        continue

                    section_title = section["title"]
                    question = f"O que diz o documento '{doc_title}' sobre '{section_title}'?"
                    section_slug = slugify(f"{doc_title}-{section_title}-{chunk_idx}")

                    knowledge_items.append({
                        "id": f"doc::{section_slug}",
                        "question": question,
                        "answer": chunk.strip(),
                        "category": section.get("category", DOC_DEFAULT_CATEGORY),
                        "synced_at": datetime.now().isoformat(),
                        "source": doc_path.name,
                    })
        except Exception as doc_error:
            logger.error("Falha ao converter %s: %s", doc_path.name, doc_error)

    return knowledge_items


def extract_markdown_sections(markdown_text: str, default_title: str = "Resumo"):
    sections = []
    current_title = default_title or "Resumo"
    buffer: list[str] = []

    for line in markdown_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            if buffer:
                content = "\n".join(buffer).strip()
                if content:
                    sections.append({"title": current_title, "content": content})
            current_title = stripped.lstrip("#").strip() or current_title
            buffer = []
            continue
        buffer.append(line)

    if buffer:
        content = "\n".join(buffer).strip()
        if content:
            sections.append({"title": current_title, "content": content})

    return sections


def chunk_section_text(text: str):
    text = text.strip()
    if not text:
        return []

    chunks = []
    current = []
    current_len = 0

    for paragraph in text.split("\n\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        paragraph_len = len(paragraph)
        potential_len = current_len + paragraph_len + 2

        if potential_len > DOC_SECTION_MAX_CHARS and current:
            chunks.append("\n\n".join(current).strip())
            current = [paragraph]
            current_len = paragraph_len
        else:
            current.append(paragraph)
            current_len = potential_len

    if current:
        chunks.append("\n\n".join(current).strip())

    return chunks


def slugify(text: str):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower())
    slug = re.sub(r"-{2,}", "-", slug)
    return slug.strip("-") or "sec"

def send_to_gerot(items):
    url = f"{GEROT_API_URL}/api/agent/sync/knowledge"
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": AGENT_API_KEY
    }
    
    # Preparar payload (filtrar campos desnecessários se precisar)
    payload = {"items": items}
    
    try:
        logger.info(f"Enviando {len(items)} itens para {url}...")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ Sincronização API Sucesso! Itens processados: {data.get('count')}")
        else:
            logger.error(f"❌ Erro API: {response.status_code} - {response.text}")
    except Exception as e:
        logger.error(f"❌ Falha de conexão com GeRot: {e}")


def _calc_items_checksum(items) -> str:
    payload = json.dumps(items, ensure_ascii=False, sort_keys=True, default=str).encode("utf-8", errors="ignore")
    return hashlib.sha256(payload).hexdigest()


def _read_last_checksum() -> str | None:
    try:
        if LOCAL_RAG_CHECKSUM_FILE.exists():
            return LOCAL_RAG_CHECKSUM_FILE.read_text(encoding="utf-8").strip() or None
    except Exception:
        return None
    return None


def _write_last_checksum(checksum: str) -> None:
    try:
        LOCAL_RAG_CHECKSUM_FILE.write_text(checksum, encoding="utf-8")
    except Exception:
        pass


def send_to_local_rag(items) -> int:
    """Enfileira itens no serviço RAG local (/v1/ingest)."""
    if not LOCAL_RAG_API_URL:
        return 0

    current_checksum = _calc_items_checksum(items)
    if LOCAL_RAG_INGEST_ONLY_ON_CHANGE:
        last = _read_last_checksum()
        if last == current_checksum:
            logger.info("[RAG LOCAL] Dump sem alterações. Pulando ingestão.")
            return 0

    url = f"{LOCAL_RAG_API_URL.rstrip('/')}/v1/ingest"
    headers = {"x-api-key": LOCAL_RAG_API_KEY}

    queued = 0
    for idx, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            continue

        question = (item.get("question") or "").strip()
        answer = (item.get("answer") or "").strip()
        if not (question or answer):
            continue

        item_id = item.get("id") or f"item-{idx}"
        source_name = f"knowledge_dump::{item_id}"
        content = f"Pergunta: {question}\n\nResposta:\n{answer}".strip()

        payload = {
            "source_name": source_name,
            "content": content,
            "content_type": "text",
            "metadata": {
                "kind": "knowledge_dump",
                "knowledge_id": item.get("id"),
                "category": item.get("category"),
                "source": item.get("source"),
                "synced_at": item.get("synced_at"),
            },
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=LOCAL_RAG_TIMEOUT_SECONDS)
            if resp.status_code == 200:
                queued += 1
            else:
                logger.warning("[RAG LOCAL] HTTP %s ao enfileirar %s: %s", resp.status_code, source_name, resp.text)
        except Exception as exc:
            logger.warning("[RAG LOCAL] Falha ao enfileirar %s: %s", source_name, exc)

    _write_last_checksum(current_checksum)
    return queued

def check_data_requests():
    """Verifica se há novas solicitações de dados vindas do chat."""
    url = f"{GEROT_API_URL}/api/agent/data-request/pending"
    headers = {
        "X-API-Key": AGENT_API_KEY
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            requests_list = data.get("requests", [])
            
            if requests_list:
                logger.info(f"\n🔔 [NOVAS SOLICITAÇÕES] Encontradas {len(requests_list)} demandas de usuários:")
                for req in requests_list:
                    logger.info(f"   👤 {req['user_name']} ({req['user_role']}): {req['request_query']}")
                    logger.info(f"      Data: {req['created_at']}")
                logger.info("--------------------------------------------------\n")
                
                # Salvar em arquivo local para persistência
                log_file = "requests_received.log"
                with open(log_file, "a", encoding="utf-8") as f:
                    for req in requests_list:
                        f.write(f"[{datetime.now().isoformat()}] {req['user_name']}: {req['request_query']}\n")
                        
    except Exception as e:
        logger.error(f"Erro ao buscar solicitações: {e}")

if __name__ == "__main__":
    run_sync()
    check_data_requests()
