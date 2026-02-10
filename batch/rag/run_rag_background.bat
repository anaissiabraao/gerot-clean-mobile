@echo off
chcp 65001 > nul
cd /d "%~dp0"

set LOG=%~dp0rag_local_uvicorn.log
if exist "%LOG%" del /f /q "%LOG%" >nul 2>&1

echo Iniciando RAG em background (log: %LOG%)
start "GeRot RAG" /min cmd /c "python -m uvicorn rag_service.main:app --host 127.0.0.1 --port 8000 >> \"%LOG%\" 2>&1"
echo OK
