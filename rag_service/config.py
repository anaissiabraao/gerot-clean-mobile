"""Configurações do serviço RAG."""
from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()

def _strip_outer_quotes(value: str | None) -> str | None:
    if value is None:
        return None
    v = value.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in {"'", '"'}:
        return v[1:-1]
    return v


@dataclass
class Settings:
    # OBS: Em Windows/.bat é comum o .env conter DATABASE_URL="postgresql://...".
    # Como load_dotenv() não sobrescreve env já setada pelo processo, garantimos aqui
    # que o valor não venha com aspas externas (senão psycopg2 acusa DSN inválido).
    database_url: str | None = _strip_outer_quotes(os.getenv("DATABASE_URL"))
    # Providers: "http" (serviço próprio) ou "ollama" (LLM/embeddings locais via Ollama)
    # Importante: em Railway/.env é comum vir com espaço acidental ("ollama ").
    embedding_provider: str = os.getenv("RAG_EMBEDDING_PROVIDER", "ollama").strip().lower()
    llm_provider: str = os.getenv("RAG_LLM_PROVIDER", "ollama").strip().lower()

    # Base local (JSON) - permite RAG sem Postgres/pgvector.
    kb_path: str = os.getenv(
        "RAG_KB_PATH",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_dump.json")),
    )
    use_json_kb: bool = False

    # Mantemos dimensão fixa para compatibilidade com a tabela ai_document_chunks.embedding VECTOR(1536)
    embedding_dim: int = int(os.getenv("RAG_EMBEDDING_DIM", "1536"))

    embedding_service_url: str = os.getenv(
        "RAG_EMBEDDING_URL",
        "http://localhost:11434/api/embeddings" if embedding_provider == "ollama" else "http://embed_service:8001/embed",
    )
    # Sugestão: em Ollama use um modelo de embedding (ex.: "nomic-embed-text")
    embedding_model: str = os.getenv("RAG_EMBEDDING_MODEL", "nomic-embed-text")

    llm_service_url: str = os.getenv(
        "RAG_LLM_URL",
        "http://localhost:11434/api/generate" if llm_provider == "ollama" else "http://llama_service:8002/generate",
    )
    # Sugestão: em Ollama use "llama3.2" / "llama3" / outro modelo instalado
    llm_model: str = os.getenv("RAG_LLM_MODEL", "llama3.2")
    api_key: str = os.getenv("RAG_INTERNAL_API_KEY", "local-dev")
    similarity_top_k: int = int(os.getenv("RAG_TOP_K", "6"))
    max_context_tokens: int = int(os.getenv("RAG_MAX_CONTEXT_TOKENS", "1200"))
    # Importante: 96 tokens costuma truncar respostas. Mantemos um default mais saudável e
    # deixamos o usuário controlar via env caso queira reduzir latência.
    llm_max_tokens: int = int(os.getenv("RAG_LLM_MAX_TOKENS", "256"))
    llm_max_tokens_no_context: int = int(os.getenv("RAG_LLM_MAX_TOKENS_NO_CONTEXT", "256"))
    # Corta a geração do LLM antes do Cloudflare (524) e antes do cliente desistir.
    # Dica: mantenha < 100s se for consumir via trycloudflare/cloudflare proxy.
    # Tente manter <= 60s para evitar que o proxy do Railway/Cloudflare encerre a conexão.
    llm_request_timeout_s: int = int(os.getenv("RAG_LLM_REQUEST_TIMEOUT_S", "60"))
    # Mantém o modelo “aquecido” no Ollama para reduzir latência (evita reload a cada request).
    # Aceita string do Ollama (ex.: "10m", "30m", "0" para descarregar).
    ollama_keep_alive: str = os.getenv("RAG_OLLAMA_KEEP_ALIVE", "15m").strip()
    # Reduz custo de contexto no Ollama (menor ctx costuma ser mais rápido).
    ollama_num_ctx: int = int(os.getenv("RAG_OLLAMA_NUM_CTX", "2048"))
    # Se true, não chama LLM quando HÁ contexto (muito mais rápido), mas ainda chama LLM sem contexto.
    fast_mode: bool = os.getenv("RAG_FAST_MODE", "true").lower() == "true"

    # Quando usa KB JSON, chamar LLM com contexto costuma ser lento e não agrega (e estoura timeout via túnel).
    # Default: NÃO chamar LLM quando houver contexto na KB JSON.
    json_llm_with_context: bool = os.getenv("RAG_JSON_LLM_WITH_CONTEXT", "false").lower() == "true"
    # Limite de tamanho da resposta extrativa (KB JSON) para não estourar payload/latência.
    # Default mais alto para “resposta completa”, mas ainda com limite para não travar UI.
    json_extractive_max_chars: int = int(os.getenv("RAG_JSON_EXTRACTIVE_MAX_CHARS", "30000"))

    # Observabilidade (logs) do Ollama
    log_ollama: bool = os.getenv("RAG_LOG_OLLAMA", "false").lower() == "true"
    log_prompts: bool = os.getenv("RAG_LOG_PROMPTS", "false").lower() == "true"
    log_prompt_max_chars: int = int(os.getenv("RAG_LOG_PROMPT_MAX_CHARS", "800"))

    # ===== Agent (LangGraph) =====
    # Quantas tentativas máximas de retrieval (loop controlado Retriever <-> Validation)
    agent_max_attempts: int = int(os.getenv("RAG_AGENT_MAX_ATTEMPTS", "3"))
    # Quantidade mínima de chunks para considerar “suficiente” (antes de sintetizar)
    agent_min_chunks: int = int(os.getenv("RAG_AGENT_MIN_CHUNKS", "2"))
    # Cobertura mínima (0..1) de tokens relevantes da pergunta presentes nos chunks recuperados
    agent_min_coverage: float = float(os.getenv("RAG_AGENT_MIN_COVERAGE", "0.15"))
    # Distância máxima (pgvector). Quanto menor, mais similar. Se não souber, deixe alto.
    agent_max_distance: float = float(os.getenv("RAG_AGENT_MAX_DISTANCE", "0.60"))
    # Se true, o agente tenta SEMPRE consultar o KB (exceto conversas triviais).
    agent_force_rag: bool = os.getenv("RAG_AGENT_FORCE_RAG", "true").lower() == "true"
    # Se true, permite resposta “geral” sem KB (para smalltalk/FAQ), mas sempre declara ausência de base.
    agent_allow_general_without_kb: bool = os.getenv("RAG_AGENT_ALLOW_GENERAL_WITHOUT_KB", "true").lower() == "true"
    # Permite resposta geral via LLM para perguntas fora do domínio GeRot/DB (ex.: clima),
    # sempre com disclaimer de que não há base interna / dados em tempo real.
    agent_allow_out_of_domain_llm: bool = os.getenv("RAG_AGENT_ALLOW_OUT_OF_DOMAIN_LLM", "true").lower() == "true"
    # Se true, quando NÃO houver contexto interno suficiente (KB/SQL/external), o agente pode
    # responder com a LLM de forma geral (com disclaimer), ao invés de bloquear.
    agent_fallback_to_llm_when_no_context: bool = os.getenv("RAG_AGENT_FALLBACK_TO_LLM_WHEN_NO_CONTEXT", "false").lower() == "true"
    # Limite para respostas gerais via LLM (fallback/out-of-domain). Mantém rápido para não estourar tunnel/timeouts.
    agent_general_llm_max_tokens: int = int(os.getenv("RAG_AGENT_GENERAL_LLM_MAX_TOKENS", "128"))

    # ===== Agent External (HTTP) =====
    # Permite buscar fontes externas quando não há contexto interno suficiente.
    agent_external_enabled: bool = os.getenv("RAG_AGENT_EXTERNAL_ENABLED", "false").lower() == "true"
    agent_external_timeout_s: int = int(os.getenv("RAG_AGENT_EXTERNAL_TIMEOUT_S", "15"))

    # ===== Agent SQL (MySQL Brudam) =====
    # Habilita o nó SQL do agente (consultas read-only via templates whitelisted).
    agent_sql_enabled: bool = os.getenv("RAG_AGENT_SQL_ENABLED", "false").lower() == "true"
    agent_sql_timeout_s: int = int(os.getenv("RAG_AGENT_SQL_TIMEOUT_S", "20"))
    agent_sql_max_rows: int = int(os.getenv("RAG_AGENT_SQL_MAX_ROWS", "50"))
    # Se true, após SQL o agente também consulta a KB (RAG) para contexto/explicação.
    # Default false para perguntas “apenas dados” (evita anexar fontes/trechos no chat).
    agent_sql_with_rag: bool = os.getenv("RAG_AGENT_SQL_WITH_RAG", "false").lower() == "true"

    # Conexão MySQL (reutiliza variáveis já usadas no projeto)
    mysql_host: str = os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br")
    mysql_port: int = int(os.getenv("MYSQL_AZ_PORT", "3306"))
    mysql_user: str = os.getenv("MYSQL_AZ_USER", "")
    mysql_password: str = os.getenv("MYSQL_AZ_PASSWORD", "")
    mysql_db: str = os.getenv("MYSQL_AZ_DB", "azportoex")

    def __post_init__(self) -> None:
        # Regra:
        # - Se RAG_USE_JSON_KB estiver definido, respeitar.
        # - Caso contrário, habilitar automaticamente quando não houver DATABASE_URL.
        raw = os.getenv("RAG_USE_JSON_KB", "").strip().lower()
        if raw in {"true", "false"}:
            self.use_json_kb = raw == "true"
        else:
            self.use_json_kb = not bool(self.database_url)

    def ensure_database(self) -> None:
        if not self.database_url:
            raise RuntimeError("DATABASE_URL não configurada para o serviço RAG.")


settings = Settings()
