@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Forcar Deploy de Commit Especifico

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\.env"

if "%RENDER_API_KEY%"=="" (
  echo ERRO: RENDER_API_KEY nao configurada
  echo Configure no arquivo .env
  pause
  exit /b 1
)

echo.
echo ============================================================
echo  Forcar Deploy de Commit no Render
echo ============================================================
echo.

if "%1"=="" (
  echo Uso: force_deploy_commit.bat [COMMIT_HASH]
  echo.
  echo Exemplo:
  echo   force_deploy_commit.bat 119219d
  echo.
  echo Commit atual (HEAD): 
  git rev-parse --short HEAD
  echo.
  echo Ultimos 10 commits:
  git log --oneline -10
  echo.
  pause
  exit /b 1
)

set "COMMIT_HASH=%1"

echo Verificando se commit existe...
git rev-parse --verify %COMMIT_HASH% >nul 2>&1
if errorlevel 1 (
  echo ERRO: Commit %COMMIT_HASH% nao encontrado
  pause
  exit /b 1
)

set "COMMIT_FULL=$(git rev-parse %COMMIT_HASH%)"
echo Commit encontrado: %COMMIT_FULL%
echo Mensagem: 
git log -1 --format=%%s %COMMIT_HASH%
echo.

echo IMPORTANTE: Para fazer deploy de um commit especifico no Render:
echo.
echo 1. Opcao via API (forcar deploy):
echo    - Vou tentar fazer deploy via API agora...
echo.
echo 2. Opcao manual (recomendado):
echo    - Acesse: https://dashboard.render.com
echo    - Va para o servico "gerot-dashboard"
echo    - Settings ^> Build ^& Deploy
echo    - Clique em "Manual Deploy"
echo    - Selecione "Deploy specific commit"
echo    - Cole o hash: %COMMIT_FULL%
echo    - Clique em "Deploy"
echo.

echo Tentando fazer deploy via API...
python "%ROOT%\scripts\render_update_env.py" --trigger-deploy --deploy-commit %COMMIT_FULL%

if errorlevel 1 (
  echo.
  echo AVISO: Falha ao fazer deploy via API.
  echo Tentando com hash curto...
  python "%ROOT%\scripts\render_update_env.py" --trigger-deploy --deploy-commit %COMMIT_HASH%
  if errorlevel 1 (
    echo.
    echo ERRO: Falha ao fazer deploy via API.
    echo Siga os passos manuais acima.
  ) else (
    echo.
    echo Deploy iniciado via API (hash curto)!
    echo Acompanhe em: https://dashboard.render.com
  )
) else (
  echo.
  echo Deploy iniciado via API!
  echo Acompanhe em: https://dashboard.render.com
)

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

