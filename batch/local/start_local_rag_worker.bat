@echo off
chcp 65001 > nul
title GeRot - RAG Worker (Ingestão)
cd /d "%~dp0"

echo ============================================================
echo  🧩 GeRot RAG Worker (LOCAL)
echo ============================================================
echo.
echo Este processo consome ai_ingestion_jobs e grava embeddings/chunks.
echo.
echo (Ctrl+C para parar)
echo.

:: Defaults (você pode sobrescrever via variáveis de ambiente/.env)
if "%RAG_INTERNAL_API_KEY%"=="" set RAG_INTERNAL_API_KEY=local-dev

if "%RAG_EMBEDDING_PROVIDER%"=="" set RAG_EMBEDDING_PROVIDER=ollama
if "%RAG_EMBEDDING_URL%"=="" set RAG_EMBEDDING_URL=http://localhost:11434/api/embeddings
if "%RAG_EMBEDDING_MODEL%"=="" set RAG_EMBEDDING_MODEL=nomic-embed-text
if "%RAG_EMBEDDING_DIM%"=="" set RAG_EMBEDDING_DIM=1536

python --version > nul 2>&1
if errorlevel 1 (
  echo ❌ Python não encontrado no PATH.
  pause
  exit /b 1
)

python -m rag_service.ingestion_worker

echo.
echo 🛑 Worker encerrado.
pause
