@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Diagnostico Completo

for %%I in ("%~dp0..\..") do set "ROOT=%%~fI"
cd /d "%ROOT%"

call :load_env "%ROOT%\.env"

echo ============================================================
echo  GeRot - Diagnostico Completo
echo ============================================================
echo.

echo [1/4] Verificando codigo local por referencias ao Gemini...
python ".\scripts\verify_no_gemini.py"
if errorlevel 1 (
  echo ERRO: Codigo local ainda tem referencias ao Gemini!
  pause
  exit /b 1
)
echo OK: Codigo local limpo.
echo.

set "RAG_URL=%RAG_API_URL%"
if "%RAG_URL%"=="" set "RAG_URL=http://localhost:8000"

echo [2/4] Verificando RAG em: %RAG_URL%
powershell -NoProfile -Command "$u='%RAG_URL%'.TrimEnd('/'); try { $r=Invoke-RestMethod -Method GET -Uri ($u+'/health') -TimeoutSec 15; $r | ConvertTo-Json -Depth 4 } catch { Write-Host ('ERRO: '+$_.Exception.Message); exit 1 }"
if errorlevel 1 (
  echo ❌ Falha no /health do RAG. Confirme que o servico no Railway esta ativo.
  pause
  exit /b 1
) else (
  echo OK: RAG respondendo.
)
echo.

if not "%RAG_LLM_URL%"=="" (
  echo [3/4] Verificando LLM em: %RAG_LLM_URL%
  powershell -NoProfile -Command "$u='%RAG_LLM_URL%'.TrimEnd('/'); try { $body=@{prompt='ping'; model='auto'; stream=$false} | ConvertTo-Json; $r=Invoke-RestMethod -Method POST -Uri ($u) -ContentType 'application/json' -Body $body -TimeoutSec 30; $r | ConvertTo-Json -Depth 4 } catch { Write-Host ('AVISO: LLM nao respondeu -> '+$_.Exception.Message); exit 1 }"
  if errorlevel 1 (
    echo AVISO: LLM nao respondeu. Verifique a URL configurada.
  ) else (
    echo OK: LLM respondeu (JSON acima).
  )
  echo.
)

echo [4/4] Checklist rapido:
if "%RAG_API_URL%"=="" (
  echo  - RAG_API_URL nao definida no .env. Execute apontar_rag_para_railway.bat
) else (
  echo  - RAG_API_URL configurada: %RAG_API_URL%
)
if "%RAG_API_KEY%"=="" (
  echo  - RAG_API_KEY nao definida (usando local-dev)
) else (
  echo  - RAG_API_KEY configurada.
)
echo.

echo ============================================================
echo  Diagnostico Concluido
echo ============================================================
echo.
echo Se precisar apontar o dashboard para o RAG do Railway:
echo   batch\deploy\apontar_rag_para_railway.bat
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

