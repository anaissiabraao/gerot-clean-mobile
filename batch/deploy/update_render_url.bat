@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Atualizar URL do Tunnel no Render

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\..\..\.env"

if "%RENDER_API_KEY%"=="" (
  echo.
  echo ============================================================
  echo  ERRO: RENDER_API_KEY nao configurada
  echo ============================================================
  echo Configure a variavel de ambiente antes de rodar:
  echo.
  echo CMD:
  echo   set RENDER_API_KEY=seu_token_aqui
  echo.
  echo PowerShell:
  echo   $env:RENDER_API_KEY=\"seu_token_aqui\"
  echo.
  pause
  exit /b 1
)

if not exist "%ROOT%\..\..\rag_tunnel_url.txt" (
  echo.
  echo ERRO: Arquivo rag_tunnel_url.txt nao encontrado.
  echo Execute start_rag_tunnel_oneclick.bat primeiro para gerar a URL.
  pause
  exit /b 1
)

set "TUNNEL_URL="
for /f "usebackq delims=" %%U in ("%ROOT%\..\..\rag_tunnel_url.txt") do set "TUNNEL_URL=%%U"

if "%TUNNEL_URL%"=="" (
  echo ERRO: URL vazia em rag_tunnel_url.txt
  pause
  exit /b 1
)

rem Remover espaços em branco
set "TUNNEL_URL=%TUNNEL_URL: =%"

echo.
echo ============================================================
echo  Atualizando Render com URL do Tunnel
echo ============================================================
echo URL: %TUNNEL_URL%
echo.

:: Para contas sem build minutes, use restart (não faz build)
set "RENDER_APPLY_MODE=restart"
python "%ROOT%\..\..\scripts\render_update_env.py" --replace-with-dotenv "%ROOT%\..\..\.env" --set RAG_API_URL=%TUNNEL_URL% --set RAG_STRICT_MODE=true
set "RENDER_APPLY_MODE="

echo.
echo ✅ Pronto! O Render foi atualizado com a URL correta.
echo    (RAG_STRICT_MODE=true configurado para evitar fallback Gemini)
echo.
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
    rem Remover aspas externas
    if defined V (
      if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
      if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
    )
    for /f "delims=" %%K in ("!K!") do for /f "delims=" %%V in ("!V!") do endlocal & set "%%K=%%V" & setlocal EnableDelayedExpansion
  )
)
endlocal & exit /b 0

