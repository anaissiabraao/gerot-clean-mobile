#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script para ajudar na configuração do Railway."""
import os
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

def generate_secret_key():
    """Gera uma chave secreta aleatória."""
    return secrets.token_hex(32)

def main():
    print("=" * 70)
    print("Configuracao Railway - GeRot")
    print("=" * 70)
    print()
    
    print("Este script vai gerar as configuracoes necessarias para Railway.")
    print()
    
    # Gerar SECRET_KEY
    secret_key = generate_secret_key()
    print("SECRET_KEY gerada:")
    print(f"  {secret_key}")
    print()
    
    # Variáveis Flask
    print("=" * 70)
    print("VARIAVEIS DE AMBIENTE - FLASK (Dashboard)")
    print("=" * 70)
    print()
    flask_vars = f"""# Banco de Dados (do PostgreSQL criado no Railway)
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# Seguranca
SECRET_KEY={secret_key}

# RAG Service (URL sera configurada apos criar servico RAG)
RAG_API_URL=https://gerot-rag.up.railway.app
RAG_API_KEY={generate_secret_key()}
RAG_STRICT_MODE=true
RAG_TOP_K=6
RAG_TIMEOUT_SECONDS=180

# Microsoft Planner (se usar)
MS_TENANT_ID=
MS_CLIENT_ID=
MS_CLIENT_SECRET=
MS_PLANNER_PLAN_ID=
MS_PLANNER_BUCKET_ID=

# Configuracoes Flask
FLASK_DEBUG=false
GUNICORN_WORKERS=4
PORT=5000

# Tailwind
USE_TAILWIND_THEME=true
"""
    print(flask_vars)
    
    # Variáveis RAG
    rag_api_key = generate_secret_key()
    print("=" * 70)
    print("VARIAVEIS DE AMBIENTE - RAG Service")
    print("=" * 70)
    print()
    rag_vars = f"""# Banco de Dados (mesmo PostgreSQL do Flask)
DATABASE_URL=postgresql://user:password@host:port/database

# API Key (mesma do Flask)
RAG_INTERNAL_API_KEY={rag_api_key}

# RAG Configuration
RAG_USE_JSON_KB=false
RAG_KB_PATH=/app/data/knowledge_dump.json
RAG_TOP_K=6
RAG_MAX_CONTEXT_TOKENS=1200
RAG_LLM_MAX_TOKENS=160
RAG_LLM_MAX_TOKENS_NO_CONTEXT=120
RAG_FAST_MODE=true

# Embedding Provider (configure conforme seu setup)
RAG_EMBEDDING_PROVIDER=http
RAG_EMBEDDING_URL=https://seu-ollama-service.com/api/embeddings
RAG_EMBEDDING_MODEL=nomic-embed-text
RAG_EMBEDDING_DIM=1536

# LLM Provider (configure conforme seu setup)
RAG_LLM_PROVIDER=http
RAG_LLM_URL=https://seu-ollama-service.com/api/generate
RAG_LLM_MODEL=llama3.2

# Uvicorn Workers
UVICORN_WORKERS=2
PORT=8000
"""
    print(rag_vars)
    
    print("=" * 70)
    print("INSTRUCOES")
    print("=" * 70)
    print()
    print("1. Crie projeto no Railway: https://railway.app")
    print("2. Adicione PostgreSQL Database")
    print("3. Crie servico Flask (detecta Dockerfile automaticamente)")
    print("4. Crie servico RAG (configure Dockerfile.rag)")
    print("5. Configure variaveis de ambiente conforme acima")
    print("6. Apos deploy do RAG, atualize RAG_API_URL no Flask")
    print()
    print("Documentacao completa: RAILWAY_SETUP.md")
    print()
    
    # Salvar em arquivo
    output_file = BASE_DIR / "railway-env-vars.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 70 + "\n")
        f.write("VARIAVEIS DE AMBIENTE - FLASK\n")
        f.write("=" * 70 + "\n\n")
        f.write(flask_vars)
        f.write("\n" + "=" * 70 + "\n")
        f.write("VARIAVEIS DE AMBIENTE - RAG\n")
        f.write("=" * 70 + "\n\n")
        f.write(rag_vars)
    
    print(f"OK: Configuracoes salvas em: {output_file}")
    print()

if __name__ == "__main__":
    main()

