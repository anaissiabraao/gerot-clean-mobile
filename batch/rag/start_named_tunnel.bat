@echo off
chcp 65001 > nul
title GeRot - Start Named Tunnel (Cloudflare)

:: Resolve path do projeto (forma curta) para evitar problemas com acentos
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

set "CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
if not exist "%CF%" (
  for /f "delims=" %%P in ('where cloudflared 2^>nul') do set "CF=%%P"
)
if not exist "%CF%" (
  echo ❌ cloudflared nao encontrado.
  pause
  exit /b 1
)

echo ============================================================
echo  ▶️  Subindo RAG + Named Tunnel
echo ============================================================
echo.
echo - RAG: http://127.0.0.1:8000
echo - Tunnel: usa %%USERPROFILE%%\.cloudflared\config.yml
echo.

set "RAG_LOG=%ROOT%\..\..\rag_uvicorn.log"
del /f /q "%RAG_LOG%" >nul 2>&1
start "GeRot RAG" /min cmd /c "cd /d \"%ROOT%\" && python -m uvicorn rag_service.main:app --host 127.0.0.1 --port 8000 > \"%RAG_LOG%\" 2>&1"

echo Aguardando porta 8000...
powershell -NoProfile -Command "for($i=0;$i -lt 30;$i++){ $ok=(Test-NetConnection -ComputerName 127.0.0.1 -Port 8000).TcpTestSucceeded; if($ok){ exit 0 }; Start-Sleep -Milliseconds 500 }; exit 1" >nul
if errorlevel 1 (
  echo ❌ RAG nao subiu. Veja: %RAG_LOG%
  pause
  exit /b 1
)

echo.
echo Iniciando cloudflared tunnel run (CTRL+C para parar)...
echo.
"%CF%" tunnel run

pause

