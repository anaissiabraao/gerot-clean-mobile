@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Forcar Restart Render

for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

call :load_env "%ROOT%\..\..\.env"

if "%RENDER_API_KEY%"=="" (
  echo ERRO: RENDER_API_KEY nao configurada
  pause
  exit /b 1
)

echo.
echo ============================================================
echo  Forcando restart do Render (3x)
echo ============================================================
echo.

python "%ROOT%\..\..\scripts\render_update_env.py" --set RAG_API_URL=https://person-ourselves-directly-mathematical.trycloudflare.com --set RAG_STRICT_MODE=true

echo.
echo Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo Fazendo restart 1...
python -c "import os, sys, requests; sys.path.insert(0, r'%ROOT%\scripts'); from render_update_env import _get_service_id, _restart_service, _headers; api_key=os.getenv('RENDER_API_KEY'); sid=_get_service_id(api_key); _restart_service(api_key, sid); print('OK')"

echo Aguardando 10 segundos...
timeout /t 10 /nobreak >nul

echo Fazendo restart 2...
python -c "import os, sys, requests; sys.path.insert(0, r'%ROOT%\scripts'); from render_update_env import _get_service_id, _restart_service, _headers; api_key=os.getenv('RENDER_API_KEY'); sid=_get_service_id(api_key); _restart_service(api_key, sid); print('OK')"

echo.
echo ✅ Restarts concluidos!
echo.
echo IMPORTANTE: Aguarde alguns segundos e teste o chat novamente.
echo Se ainda estiver usando URL antiga, o codigo no Render pode ter
echo a URL hardcoded ou cacheada. Nesse caso, so um deploy vai resolver.
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
    if defined V (
      if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
      if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
    )
    for /f "delims=" %%K in ("!K!") do for /f "delims=" %%V in ("!V!") do endlocal & set "%%K=%%V" & setlocal EnableDelayedExpansion
  )
)
endlocal & exit /b 0

