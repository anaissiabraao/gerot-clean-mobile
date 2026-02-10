@echo off
chcp 65001 > nul
title GeRot - RAG Local (FastAPI)
cd /d "%~dp0"

echo ============================================================
echo  🧠 GeRot RAG (LOCAL)
echo ============================================================
echo.
echo Este serviço expõe:
echo   - POST /v1/qa
echo   - POST /v1/ingest
echo   - GET  /health
echo.
echo A webapp chama via RAG_API_URL=http://SEU_IP:8000
echo.

:: Defaults (você pode sobrescrever via variáveis de ambiente/.env)
if "%RAG_INTERNAL_API_KEY%"=="" set RAG_INTERNAL_API_KEY=local-dev

if "%RAG_LLM_PROVIDER%"=="" set RAG_LLM_PROVIDER=ollama
if "%RAG_LLM_URL%"=="" set RAG_LLM_URL=http://localhost:11434/api/generate
if "%RAG_LLM_MODEL%"=="" set RAG_LLM_MODEL=llama3.2

if "%RAG_EMBEDDING_PROVIDER%"=="" set RAG_EMBEDDING_PROVIDER=ollama
if "%RAG_EMBEDDING_URL%"=="" set RAG_EMBEDDING_URL=http://localhost:11434/api/embeddings
if "%RAG_EMBEDDING_MODEL%"=="" set RAG_EMBEDDING_MODEL=nomic-embed-text
if "%RAG_EMBEDDING_DIM%"=="" set RAG_EMBEDDING_DIM=1536

echo Config atual:
echo   - RAG_INTERNAL_API_KEY=%RAG_INTERNAL_API_KEY%
echo   - RAG_LLM_PROVIDER=%RAG_LLM_PROVIDER%  (modelo: %RAG_LLM_MODEL%)
echo   - RAG_EMBEDDING_PROVIDER=%RAG_EMBEDDING_PROVIDER%  (modelo: %RAG_EMBEDDING_MODEL%)
echo.

python --version > nul 2>&1
if errorlevel 1 (
  echo ❌ Python não encontrado no PATH.
  pause
  exit /b 1
)

echo ▶️  Iniciando uvicorn em 0.0.0.0:8000
echo (Ctrl+C para parar)
echo.

python -m uvicorn rag_service.main:app --host 0.0.0.0 --port 8000

echo.
echo 🛑 Serviço encerrado.
pause
