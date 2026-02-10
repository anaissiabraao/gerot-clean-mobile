@echo off
chcp 65001 > nul
title GeRot - Ingest knowledge_dump.json (RAG)
cd /d "%~dp0"

echo ============================================================
echo  📥 Ingestão do data\knowledge_dump.json para o RAG
echo ============================================================
echo.
echo Pré-requisitos:
echo   - DATABASE_URL configurada
echo   - Embeddings configurados (ex.: Ollama)
echo.

:: Defaults (você pode sobrescrever via variáveis de ambiente/.env)
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

python "..\..\scripts\ingest_knowledge_dump_to_rag.py"

pause
