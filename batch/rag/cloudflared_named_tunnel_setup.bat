@echo off
chcp 65001 > nul
title GeRot - Setup Cloudflare Named Tunnel (URL fixa)

:: Resolve path do projeto (forma curta) para evitar problemas com acentos
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

set "CF="

:: 0. Tentar modo portatil (binário ao lado do projeto)
if exist "%~dp0tools\cloudflared.exe" set "CF=%~dp0tools\cloudflared.exe"

:: 1. Tentar local padrão do WinGet
if "%CF%"=="" if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" (
  set "CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
)

:: 2. Tentar via where (PATH)
if "%CF%"=="" (
  for /f "delims=" %%P in ('where cloudflared 2^>nul') do (
    if exist "%%P" set "CF=%%P"
  )
)

:: 3. Tentar AppData Local (modo portatil baixado)
if "%CF%"=="" if exist "%LOCALAPPDATA%\cloudflared\cloudflared.exe" (
  set "CF=%LOCALAPPDATA%\cloudflared\cloudflared.exe"
)

if "%CF%"=="" (
  echo ❌ cloudflared nao encontrado.
  echo.
  echo Tentando instalar automaticamente via winget...
  echo.

  where winget >nul 2>&1
  if errorlevel 1 (
    echo ❌ winget nao encontrado.
    echo Baixe manualmente de: https://github.com/cloudflare/cloudflared/releases
    echo.
    echo Tentando baixar cloudflared automaticamente (modo portatil)...
    echo.
    set "CF_DL_DIR=%LOCALAPPDATA%\cloudflared"
    set "CF_DL=%CF_DL_DIR%\cloudflared.exe"
    if not exist "%CF_DL_DIR%" mkdir "%CF_DL_DIR%" >nul 2>&1
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'; $o='%CF_DL%'; try { Invoke-WebRequest -Uri $u -OutFile $o -UseBasicParsing; exit 0 } catch { exit 1 }" >nul
    if errorlevel 1 (
      echo ❌ Falha ao baixar cloudflared automaticamente.
      echo Baixe manualmente de: https://github.com/cloudflare/cloudflared/releases
      pause
      exit /b 1
    )
    if exist "%CF_DL%" set "CF=%CF_DL%"
  ) else (
    echo Executando: winget install -e --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements
    winget install -e --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements

    if errorlevel 1 (
      echo.
      echo ❌ Falha na instalacao automatica.
      echo Tente instalar manualmente:
      echo   winget install -e --id Cloudflare.cloudflared
      echo.
      echo Tentando baixar cloudflared automaticamente (modo portatil)...
      echo.
      set "CF_DL_DIR=%LOCALAPPDATA%\cloudflared"
      set "CF_DL=%CF_DL_DIR%\cloudflared.exe"
      if not exist "%CF_DL_DIR%" mkdir "%CF_DL_DIR%" >nul 2>&1
      powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'; $o='%CF_DL%'; try { Invoke-WebRequest -Uri $u -OutFile $o -UseBasicParsing; exit 0 } catch { exit 1 }" >nul
      if errorlevel 1 (
        echo ❌ Falha ao baixar cloudflared automaticamente.
        echo Baixe manualmente de: https://github.com/cloudflare/cloudflared/releases
        pause
        exit /b 1
      )
      if exist "%CF_DL%" set "CF=%CF_DL%"
    ) else (
      timeout /t 2 /nobreak >nul
      if "%CF%"=="" if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" set "CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
      if "%CF%"=="" (
        for /f "delims=" %%P in ('where cloudflared 2^>nul') do (
          if exist "%%P" set "CF=%%P"
        )
      )
    )
  )
)

if "%CF%"=="" (
  echo ❌ cloudflared ainda nao foi localizado.
  echo Baixe manualmente de: https://github.com/cloudflare/cloudflared/releases
  pause
  exit /b 1
)

echo ============================================================
echo  🌐 Cloudflare Named Tunnel (producao / URL fixa)
echo ============================================================
echo.
echo Requisitos:
echo - Voce precisa ter um dominio gerenciado no Cloudflare
echo - Voce vai autorizar no navegador quando solicitado
echo.

echo [1/6] Login no Cloudflare (vai abrir no navegador)...
"%CF%" tunnel login
if errorlevel 1 (
  echo ❌ Falha no login.
  pause
  exit /b 1
)

echo.
set /p TUNNEL_NAME=Digite um nome para o tunnel (ex: gerot-rag): 
if "%TUNNEL_NAME%"=="" set "TUNNEL_NAME=gerot-rag"

echo.
set /p HOSTNAME=Digite o hostname publico (ex: rag.seudominio.com): 
if "%HOSTNAME%"=="" (
  echo ❌ Hostname obrigatorio.
  pause
  exit /b 1
)

echo.
echo [2/6] Criando tunnel: %TUNNEL_NAME%
"%CF%" tunnel create "%TUNNEL_NAME%"
if errorlevel 1 (
  echo ❌ Falha ao criar tunnel (talvez ja exista).
)

echo.
echo [3/6] Obtendo UUID do tunnel...
set "TUNNEL_ID="
for /f "usebackq tokens=1,2 delims= " %%A in (`"%CF%" tunnel list ^| findstr /i /c:"%TUNNEL_NAME%"`) do (
  set "TUNNEL_ID=%%A"
)
if "%TUNNEL_ID%"=="" (
  echo ❌ Nao consegui localizar o UUID do tunnel na lista.
  echo Rode: cloudflared tunnel list
  pause
  exit /b 1
)

echo Tunnel UUID: %TUNNEL_ID%

echo.
echo [4/6] Criando rota DNS (CNAME) para: %HOSTNAME%
"%CF%" tunnel route dns "%TUNNEL_NAME%" "%HOSTNAME%"
if errorlevel 1 (
  echo ❌ Falha ao criar rota DNS.
  echo - Verifique se o dominio esta no Cloudflare
  echo - Verifique permissao da conta
  pause
  exit /b 1
)

echo.
echo [5/6] Gerando config.yml em %%USERPROFILE%%\.cloudflared\config.yml
set "CF_DIR=%USERPROFILE%\.cloudflared"
if not exist "%CF_DIR%" mkdir "%CF_DIR%" >nul 2>&1

(
  echo tunnel: %TUNNEL_ID%
  echo credentials-file: %CF_DIR%\%TUNNEL_ID%.json
  echo.
  echo ingress:
  echo   - hostname: %HOSTNAME%
  echo     service: http://localhost:8000
  echo   - service: http_status:404
) > "%CF_DIR%\config.yml"

echo Config criado: %CF_DIR%\config.yml

echo.
echo [6/6] Pronto!
echo URL fixa configurada:
echo   https://%HOSTNAME%
echo.
echo Proximo passo:
echo - Rode: start_named_tunnel.bat
echo - No Render configure: RAG_API_URL=https://%HOSTNAME%
echo.
pause
