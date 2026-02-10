@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Forcar Atualizacao RAG_API_URL

for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\..\..\.env"

if "%RENDER_API_KEY%"=="" (
  echo ERRO: RENDER_API_KEY nao configurada
  pause
  exit /b 1
)

if not exist "%ROOT%\..\..\rag_tunnel_url.txt" (
  echo ERRO: rag_tunnel_url.txt nao encontrado
  pause
  exit /b 1
)

set "TUNNEL_URL="
for /f "usebackq delims=" %%U in ("%ROOT%\..\..\rag_tunnel_url.txt") do set "TUNNEL_URL=%%U"
set "TUNNEL_URL=%TUNNEL_URL: =%"

echo.
echo ============================================================
echo  Forcando atualizacao RAG_API_URL
echo ============================================================
echo URL: %TUNNEL_URL%
echo.
echo IMPORTANTE: Usando apenas --set para nao substituir env vars secretas
echo.

set "RENDER_APPLY_MODE=restart"
python "%ROOT%\..\..\scripts\render_update_env.py" --set RAG_API_URL=%TUNNEL_URL% --set RAG_STRICT_MODE=true
set "RENDER_APPLY_MODE="

echo.
echo ✅ Pronto!
pause
exit /b 0

:load_env
setlocal EnableExtensions EnableDelayedExpansion
set "ENV_FILE=%~1"
if not exist "%ENV_FILE%" ( endlocal & exit /b 0 )
for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ENV_FILE%") do (
  if not "%%A"=="" (
    set "K=%%A"
    set "V=%%B"
    if defined V (
      if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
      if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
    )
    for /f "delims=" %%K in ("!K!") do for /f "delims=" %%V in ("!V!") do endlocal & set "%%K=%%V" & setlocal EnableDelayedExpansion
  )
)
endlocal & exit /b 0

