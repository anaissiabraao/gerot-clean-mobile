@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - One-Click (Tunnel + Update Render)

:: Resolve path do projeto (forma curta) para evitar problemas com acentos
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\..\..\.env"

if "%RENDER_API_KEY%"=="" goto :missing_key
if "%RENDER_SERVICE_ID%"=="" (
  if "%RENDER_SERVICE_NAME%"=="" goto :missing_service
)

echo.
echo DICA: para descobrir o SERVICE_ID automaticamente, rode:
echo   python "%ROOT%\scripts\render_update_env.py" --list-services
echo.

echo ============================================================
echo  🚀 GeRot - Tunnel + Atualizar Render (RAG_API_URL)
echo ============================================================
echo.
echo [1/2] Subindo RAG + gerando URL (trycloudflare)...
rem IMPORTANTE: evitar usar URL antiga (stale). Se o oneclick falhar, abortar.
del /f /q "%ROOT%\rag_tunnel_url.txt" >nul 2>&1
set "GEROT_NO_PAUSE=1"
call "%ROOT%\start_rag_tunnel_oneclick.bat"
set "GEROT_NO_PAUSE="
if errorlevel 1 (
  echo ❌ Falha ao subir o RAG/tunnel. Abortando para nao usar URL antiga.
  pause
  exit /b 1
)

if not exist "%ROOT%\..\..\rag_tunnel_url.txt" (
  echo ❌ Arquivo rag_tunnel_url.txt nao encontrado.
  pause
  exit /b 1
)

set "TUNNEL_URL="
for /f "usebackq delims=" %%U in ("%ROOT%\..\..\rag_tunnel_url.txt") do set "TUNNEL_URL=%%U"
if "%TUNNEL_URL%"=="" (
  echo ❌ URL vazia em rag_tunnel_url.txt
  pause
  exit /b 1
)
rem Remover espaços em branco e caracteres inválidos
set "TUNNEL_URL=%TUNNEL_URL: =%"
if "%TUNNEL_URL%"=="" (
  echo ❌ URL invalida em rag_tunnel_url.txt
  pause
  exit /b 1
)
rem Verificar se parece uma URL válida
echo %TUNNEL_URL% | findstr /i "https://.*trycloudflare.com" >nul
if errorlevel 1 (
  echo ❌ URL nao parece valida: %TUNNEL_URL%
  pause
  exit /b 1
)

echo.
echo [2/2] Atualizando Render: RAG_API_URL=%TUNNEL_URL%
echo   (Garantindo RAG_STRICT_MODE=true para evitar fallback Gemini)
:: Para contas sem build minutes, prefira restart (não faz build)
set "RENDER_APPLY_MODE=restart"
python "%ROOT%\..\..\scripts\render_update_env.py" --replace-with-dotenv "%ROOT%\..\..\.env" --set RAG_API_URL=%TUNNEL_URL% --set RAG_STRICT_MODE=true
set "RENDER_APPLY_MODE="

echo.
echo ✅ Pronto. Agora o Render deve estar redeployando (se o script nao bloqueou por seguranca).
pause
exit /b 0

:missing_key
echo.
echo ============================================================
echo  Render API Key
echo ============================================================
echo Defina a variavel de ambiente RENDER_API_KEY antes de rodar.
echo.
echo CMD:
echo   set RENDER_API_KEY=SEU_TOKEN
echo.
echo PowerShell:
echo   $env:RENDER_API_KEY=\"SEU_TOKEN\"
echo.
pause
exit /b 1

:load_env
setlocal EnableExtensions EnableDelayedExpansion
set "ENV_FILE=%~1"
if not exist "%ENV_FILE%" ( endlocal & exit /b 0 )
for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ENV_FILE%") do (
  if not "%%A"=="" (
    set "K=%%A"
    set "V=%%B"
    rem Remover aspas externas (ex.: DATABASE_URL="postgresql://...")
    if defined V (
      if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
      if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
    )
    for /f "delims=" %%K in ("!K!") do for /f "delims=" %%V in ("!V!") do endlocal & set "%%K=%%V" & setlocal EnableDelayedExpansion
  )
)
endlocal & exit /b 0

:missing_service
echo.
echo ============================================================
echo  Render Service (ID/Name)
echo ============================================================
echo Defina RENDER_SERVICE_ID (recomendado) ou RENDER_SERVICE_NAME (ex: gerot-dashboard)
echo.
echo CMD:
echo   set RENDER_SERVICE_NAME=gerot-dashboard
echo.
echo PowerShell:
echo   $env:RENDER_SERVICE_NAME=\"gerot-dashboard\"
echo.
pause
exit /b 1
