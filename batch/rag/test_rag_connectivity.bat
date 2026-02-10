@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Teste RAG (Health/QA)

for %%I in ("%~dp0..\..") do set "ROOT=%%~fI"
cd /d "%ROOT%"

call :load_env "%ROOT%\.env"

set "URL=%~1"
if "%URL%"=="" (
  if not "%RAG_API_URL%"=="" (
    set "URL=%RAG_API_URL%"
  ) else (
    set "URL=http://localhost:8000"
  )
)

set "KEY=%~2"
if "%KEY%"=="" set "KEY=%RAG_API_KEY%"
if "%KEY%"=="" set "KEY=local-dev"

echo ============================================================
echo  🧪 Teste de Conectividade - RAG
echo ============================================================
echo.
echo URL: %URL%
echo KEY: (mascarada)
echo.

echo [1/2] GET %URL%/health
powershell -NoProfile -Command "$u='%URL%'.TrimEnd('/'); try { $r=Invoke-RestMethod -Method GET -Uri ($u+'/health') -TimeoutSec 10; $r | ConvertTo-Json -Depth 6 } catch { Write-Host ('ERRO: '+$_.Exception.Message); exit 1 }"
if errorlevel 1 (
  echo.
  echo ❌ Falhou no /health. Se for acesso externo: confira túnel/port-forward/firewall.
  pause
  exit /b 1
)

echo.
echo [2/2] POST %URL%/v1/qa
powershell -NoProfile -Command "$u='%URL%'.TrimEnd('/'); $k='%KEY%'; $body=@{question='Responda com base no GeRot: como emitir NF-e?'; top_k=4} | ConvertTo-Json; try { $r=Invoke-RestMethod -Method POST -Uri ($u+'/v1/qa') -Headers @{'x-api-key'=$k} -ContentType 'application/json' -Body $body -TimeoutSec 60; $r | ConvertTo-Json -Depth 6 } catch { Write-Host ('ERRO: '+$_.Exception.Message); if ($_.Exception.Response) { try { $sr=New-Object IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host ($sr.ReadToEnd()) } catch {} } exit 1 }"

echo.
echo ✅ Teste concluído.
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
