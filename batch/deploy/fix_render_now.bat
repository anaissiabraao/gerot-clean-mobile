@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Corrigir Render (Remover Gemini + Atualizar URL)

:: Resolve path do projeto (voltar 2 níveis para chegar à raiz)
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\.env"

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
  echo OU adicione no arquivo .env:
  echo   RENDER_API_KEY=seu_token_aqui
  echo.
  pause
  exit /b 1
)

if not exist "%ROOT%\rag_tunnel_url.txt" (
  echo.
  echo ERRO: Arquivo rag_tunnel_url.txt nao encontrado.
  echo Execute start_rag_tunnel_oneclick.bat primeiro para gerar a URL.
  pause
  exit /b 1
)

set "TUNNEL_URL="
for /f "usebackq delims=" %%U in ("%ROOT%\rag_tunnel_url.txt") do set "TUNNEL_URL=%%U"

if "%TUNNEL_URL%"=="" (
  echo ERRO: URL vazia em rag_tunnel_url.txt
  pause
  exit /b 1
)

rem Remover espaços em branco
set "TUNNEL_URL=%TUNNEL_URL: =%"

echo.
echo ============================================================
echo  Corrigindo Render
echo ============================================================
echo.
echo [1/2] Removendo chaves do Gemini...
echo [2/2] Atualizando URL do tunnel: %TUNNEL_URL%
echo.

:: Para contas sem build minutes, use restart (não faz build)
set "RENDER_APPLY_MODE=restart"

echo Executando remocao de chaves Gemini...
python "%ROOT%\scripts\remove_gemini_keys.py"
if errorlevel 1 (
  echo AVISO: Falha ao remover chaves do Gemini (pode nao existir)
)

echo.
echo Executando atualizacao de URL do tunnel...
python "%ROOT%\scripts\render_update_env.py" --replace-with-dotenv "%ROOT%\.env" --set RAG_API_URL=%TUNNEL_URL% --set RAG_STRICT_MODE=true

set "RENDER_APPLY_MODE="

echo.
echo ============================================================
echo  ✅ Pronto!
echo ============================================================
echo.
echo O Render foi atualizado:
echo   - Chaves do Gemini removidas (se existiam)
echo   - RAG_API_URL atualizada: %TUNNEL_URL%
echo   - RAG_STRICT_MODE=true configurado
echo.
echo IMPORTANTE: O codigo no Render ainda esta antigo e tentara usar Gemini
echo quando o RAG falhar. Sem as chaves, ele falhara imediatamente em vez
echo de tentar varias vezes e gerar erros 429.
echo.
echo Quando tiver minutos de build disponiveis, faca um novo deploy para
echo atualizar o codigo e remover completamente o fallback do Gemini.
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

