@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Apontar RAG para Railway

for %%I in ("%~dp0..\..") do set "ROOT=%%~fI"
cd /d "%ROOT%"

set "DEFAULT_URL=https://gerot-rag.up.railway.app"
if not "%~1"=="" (
  set "TARGET_URL=%~1"
) else (
  set "TARGET_URL=%DEFAULT_URL%"
)

echo ============================================================
echo   GeRot - Atualizar RAG_API_URL para Railway
echo ============================================================
echo.
echo URL alvo: %TARGET_URL%
echo Arquivo:  %ROOT%\.env
echo.

python --version >nul 2>&1
if errorlevel 1 (
  echo ❌ Python nao encontrado no PATH.
  pause
  exit /b 1
)

python "%ROOT%\scripts\update_rag_targets.py" --rag-url "%TARGET_URL%"
if errorlevel 1 (
  echo ❌ Falha ao atualizar o .env
  pause
  exit /b 1
)

echo.
echo ✅ RAG_API_URL atualizado com sucesso!
echo.
echo Proximo passo:
echo   - Configure a mesma URL nas variaveis do serviço gerot-dashboard no Railway.
echo.
pause
exit /b 0

