@echo off
chcp 65001 > nul
title GeRot - Stack Local (Ollama + RAG)
cd /d "%~dp0"

echo ============================================================
echo  🚀 GeRot - Stack LOCAL
echo ============================================================
echo.
echo Este script abre 3 janelas:
echo   1) Ollama (LLM/embeddings)
echo   2) RAG Worker (ingestão)
echo   3) RAG API (FastAPI)
echo.
echo Depois rode: ingest_knowledge_dump_to_rag.bat
echo.

start "Ollama" cmd /k "%~dp0start_ollama.bat"
timeout /t 2 /nobreak >nul
start "RAG Worker" cmd /k "%~dp0start_local_rag_worker.bat"
timeout /t 1 /nobreak >nul
start "RAG API" cmd /k "%~dp0start_local_rag.bat"

echo.
echo ✅ Janelas iniciadas.
echo.
pause
