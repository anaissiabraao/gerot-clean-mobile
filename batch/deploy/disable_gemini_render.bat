@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Desabilitar Gemini no Render

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

echo.
echo ============================================================
echo  Desabilitando Gemini no Render
echo ============================================================
echo.
echo Esta operacao vai REMOVER as seguintes env vars do Render:
echo   - GOOGLE_API_KEY
echo   - GEMINI_API_KEY
echo   - GOOGLE_GENERATIVE_AI_API_KEY
echo.
echo Isso vai fazer com que o codigo antigo nao consiga usar Gemini
echo mesmo tentando, evitando os erros 429.
echo.
pause

:: Para contas sem build minutes, use restart (não faz build)
set "RENDER_APPLY_MODE=restart"
python "%ROOT%\..\..\scripts\remove_gemini_keys.py"
set "RENDER_APPLY_MODE="

echo.
echo ✅ Pronto! As chaves do Gemini foram removidas do Render.
echo    O codigo antigo nao conseguira usar Gemini mesmo tentando.
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

