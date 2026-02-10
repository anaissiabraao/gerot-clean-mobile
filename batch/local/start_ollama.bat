@echo off
chcp 65001 > nul
title Ollama (LLM local)

echo ============================================================
echo  🦙 Ollama - Servidor local
echo ============================================================
echo.
echo Se o Ollama estiver instalado, este comando sobe a API em:
echo   http://localhost:11434
echo.
echo (Ctrl+C para parar)
echo.

ollama --version > nul 2>&1
if errorlevel 1 (
  echo ❌ Ollama não encontrado no PATH.
  echo Instale o Ollama e tente novamente.
  pause
  exit /b 1
)

ollama serve

pause
