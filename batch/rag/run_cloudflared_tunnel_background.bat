@echo off
chcp 65001 > nul
cd /d "%~dp0"

set CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe
set LOG=%~dp0cloudflared_tunnel.log
if exist "%LOG%" del /f /q "%LOG%" >nul 2>&1

if not exist "%CF%" (
  echo ERRO: cloudflared nao encontrado em: %CF%
  echo Tente reabrir o terminal/PC ou reinstalar via winget.
  exit /b 1
)

echo Iniciando Tunnel em background (log: %LOG%)
echo Alvo: http://localhost:8000
start "Cloudflare Tunnel" /min cmd /c "\"%CF%\" tunnel --url http://localhost:8000 --loglevel info >> \"%LOG%\" 2>&1"
echo OK
