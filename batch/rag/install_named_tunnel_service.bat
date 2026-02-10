@echo off
chcp 65001 > nul
title GeRot - Instalar Named Tunnel como Servico

echo ============================================================
echo  🔧 Instalar Cloudflared como servico do Windows
echo ============================================================
echo.
echo Requer executar como ADMINISTRADOR.
echo Usa %%USERPROFILE%%\.cloudflared\config.yml
echo.

net session >nul 2>&1
if errorlevel 1 (
  echo ❌ Execute este .bat como Administrador.
  pause
  exit /b 1
)

set "CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
if not exist "%CF%" (
  for /f "delims=" %%P in ('where cloudflared 2^>nul') do set "CF=%%P"
)
if not exist "%CF%" (
  echo ❌ cloudflared nao encontrado.
  pause
  exit /b 1
)

echo Instalando servico...
"%CF%" service install

echo.
echo ✅ Se instalou, o servico vai iniciar automaticamente.
echo Para remover depois: cloudflared service uninstall
echo.
pause

