@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title GeRot - One-Click (RAG + Tunnel)

rem Resolver path curto do projeto (evita problemas com acentos/espacos)
for %%I in ("%~dp0.") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

set "RAG_LOG=%ROOT%\rag_uvicorn.log"
set "RAG_ERR_LOG=%ROOT%\rag_uvicorn.err.log"
set "CF_LOG=%ROOT%\cloudflared_tunnel.log"
set "CF_ERR_LOG=%ROOT%\cloudflared_tunnel.err.log"
set "URL_FILE=%ROOT%\rag_tunnel_url.txt"
set "URL_FILE_LASTSEEN=%ROOT%\rag_tunnel_url_last_seen.txt"
set "RAG_PID_FILE=%ROOT%\rag_uvicorn.pid"
set "CF_PID_FILE=%ROOT%\cloudflared.pid"
set "WATCH_LOG=%ROOT%\tunnel_watch.log"
set "WATCH_PID_FILE=%ROOT%\tunnel_watcher.pid"
set "TOOLS_DIR=%ROOT%\tools"
set "CF_EXE=%TOOLS_DIR%\cloudflared.exe"

rem Preferir o launcher "py" (evita python.exe stub da Windows Store)
set "PY_EXE=python"
where py >nul 2>&1 && set "PY_EXE=py"

rem Criar/zerar log do watcher desde o início (para debug mesmo se o script falhar antes)
del /f /q "%WATCH_LOG%" >nul 2>&1
rem "break > file" é uma forma mais robusta de truncar/criar arquivo em cmd
break > "%WATCH_LOG%" 2>nul
echo [oneclick] iniciado em %DATE% %TIME% > "%WATCH_LOG%"
echo [oneclick] ROOT=%ROOT%>> "%WATCH_LOG%"
echo [oneclick] step=pre-load-env>> "%WATCH_LOG%"
echo [oneclick] RAILWAY_AUTO_UPDATE(pre-load-env)=%RAILWAY_AUTO_UPDATE%>> "%WATCH_LOG%"

call :load_env "%ROOT%\.env"
echo [oneclick] step=pos-load-env>> "%WATCH_LOG%"
echo [oneclick] RAILWAY_AUTO_UPDATE(pos-load-env)=%RAILWAY_AUTO_UPDATE%>> "%WATCH_LOG%"
echo [oneclick] RAILWAY_DASHBOARD_PROJECT_ID(pos-load-env)=%RAILWAY_DASHBOARD_PROJECT_ID%>> "%WATCH_LOG%"
echo [oneclick] step=ensure_cloudflared>> "%WATCH_LOG%"
call :ensure_cloudflared
if errorlevel 1 goto :fail

echo [oneclick] step=ensure_python_deps>> "%WATCH_LOG%"
call :ensure_python_deps
if errorlevel 1 goto :fail

echo ============================================================
echo  GeRot One-Click (RAG + Cloudflare Tunnel)
echo ============================================================
echo Pasta: %ROOT%
echo.

call :kill_old

rem ============================================================
rem  Watcher: iniciar DEPOIS do kill_old (kill_old mata watcher antigo via PID)
rem ============================================================
rem Normalizar RAILWAY_AUTO_UPDATE (remove aspas e espaços comuns)
if defined RAILWAY_AUTO_UPDATE (
  for /f "tokens=* delims= " %%A in ("%RAILWAY_AUTO_UPDATE%") do set "RAILWAY_AUTO_UPDATE=%%A"
  if "!RAILWAY_AUTO_UPDATE:~0,1!"=="^"" if "!RAILWAY_AUTO_UPDATE:~-1!"=="^"" set "RAILWAY_AUTO_UPDATE=!RAILWAY_AUTO_UPDATE:~1,-1!"
)

if /i not "%RAILWAY_AUTO_UPDATE%"=="false" (
  del /f /q "%WATCH_PID_FILE%" >nul 2>&1
  echo [oneclick] step=watcher_start(pos-kill_old)>> "%WATCH_LOG%"
  echo [auto] Watcher: iniciando (pos-kill_old)... >> "%WATCH_LOG%"
  start "GeRot Watcher" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\watch_tunnel_and_update_railway.ps1" -ProjectRoot "%ROOT%" -IntervalSec 15 -LogPath "%WATCH_LOG%" -PidFile "%WATCH_PID_FILE%"
  rem esperar até 10s pelo PID
  set "WATCH_PID="
  for /l %%I in (1,1,10) do (
    if exist "%WATCH_PID_FILE%" (
      for /f "usebackq delims=" %%P in ("%WATCH_PID_FILE%") do set "WATCH_PID=%%P"
    )
    if defined WATCH_PID goto :watcher_pid_ok
    timeout /t 1 /nobreak >nul 2>&1
  )
  echo [oneclick] watcher_pid_file_not_created_yet>> "%WATCH_LOG%"
  goto :watcher_pid_done
:watcher_pid_ok
  echo [oneclick] watcher_pid=%WATCH_PID%>> "%WATCH_LOG%"
:watcher_pid_done
) else (
  echo [auto] Watcher: desativado (RAILWAY_AUTO_UPDATE=false). >> "%WATCH_LOG%"
)

rem Defaults (podem vir do .env)
if not defined RAG_INTERNAL_API_KEY set "RAG_INTERNAL_API_KEY=local-dev"
rem Fonte de conhecimento:
rem - Se houver DATABASE_URL, usamos Postgres/pgvector (mais "RAG" de verdade)
rem - Se NAO houver DATABASE_URL, caimos automaticamente para JSON KB (evita erro 500)
if not defined RAG_USE_JSON_KB (
  if defined DATABASE_URL (
    set "RAG_USE_JSON_KB=false"
  ) else (
    set "RAG_USE_JSON_KB=true"
  )
)
if not defined RAG_KB_PATH set "RAG_KB_PATH=%ROOT%\data\knowledge_dump.json"
rem Por padrao: rápido com contexto (não chama LLM) e chama LLM só quando não houver contexto.
if not defined RAG_FAST_MODE set "RAG_FAST_MODE=true"
if not defined RAG_LLM_PROVIDER set "RAG_LLM_PROVIDER=ollama"
if not defined RAG_LLM_URL set "RAG_LLM_URL=http://localhost:11434/api/generate"
if not defined RAG_LLM_MODEL set "RAG_LLM_MODEL=llama3.2"
if not defined RAG_EMBEDDING_PROVIDER set "RAG_EMBEDDING_PROVIDER=ollama"
if not defined RAG_EMBEDDING_URL set "RAG_EMBEDDING_URL=http://localhost:11434/api/embeddings"
if not defined RAG_EMBEDDING_MODEL set "RAG_EMBEDDING_MODEL=nomic-embed-text"
if not defined RAG_EMBEDDING_DIM set "RAG_EMBEDDING_DIM=1536"

rem Cloudflared (trycloudflare) - defaults mais robustos no Windows
rem - protocol=http2 evita dependência de UDP/QUIC (muitas redes/antivírus bloqueiam UDP e causam quedas)
rem - edge-ip-version=4 evita problemas de IPv6/DNS em ambientes restritos
if not defined CF_PROTOCOL set "CF_PROTOCOL=http2"
if not defined CF_EDGE_IP_VERSION set "CF_EDGE_IP_VERSION=4"

echo [1/4] Subindo RAG em http://127.0.0.1:8000
del /f /q "%RAG_LOG%" >nul 2>&1
type nul > "%RAG_LOG%" 2>nul
del /f /q "%RAG_ERR_LOG%" >nul 2>&1
type nul > "%RAG_ERR_LOG%" 2>nul
rem Iniciar em processo DETACHED (Start-Process) para não morrer quando a janela do one-click fecha.
powershell -NoProfile -ExecutionPolicy Bypass -Command "try{ $args=@(); if('%PY_EXE%' -eq 'py'){ $args += @('-3') }; $args += @('-m','uvicorn','rag_service.main:app','--host','127.0.0.1','--port','8000'); $p=Start-Process -FilePath '%PY_EXE%' -ArgumentList $args -WorkingDirectory '%ROOT%' -WindowStyle Minimized -PassThru -RedirectStandardOutput '%RAG_LOG%' -RedirectStandardError '%RAG_ERR_LOG%'; $p.Id | Set-Content -Path '%RAG_PID_FILE%' -Encoding ASCII -NoNewline; exit 0 } catch { ('[oneclick] Falha ao iniciar uvicorn: ' + $_.Exception.Message) | Add-Content -Path '%RAG_ERR_LOG%'; exit 1 }" >nul
if errorlevel 1 (
  echo ❌ Falha ao iniciar o processo do RAG. Veja os logs:
  echo    - %RAG_LOG%
  echo    - %RAG_ERR_LOG%
  goto :fail
)

echo Aguardando porta 8000...
rem Evitar Test-NetConnection (às vezes trava em Ping/ICMP). Usar teste TCP (socket) com timeout curto.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false; for($i=0;$i -lt 120;$i++){ try{ $c=New-Object System.Net.Sockets.TcpClient; $iar=$c.BeginConnect('127.0.0.1',8000,$null,$null); if($iar.AsyncWaitHandle.WaitOne(300)){ $c.EndConnect($iar); $ok=$true; $c.Close(); break } $c.Close() } catch{}; Start-Sleep -Milliseconds 250 }; if($ok){ exit 0 } else { exit 1 }" >nul
if errorlevel 1 (
  echo ❌ RAG nao subiu na porta 8000. Veja o log: %RAG_LOG%
  goto :fail
)

echo [2/4] Iniciando Tunnel (trycloudflare.com)
del /f /q "%CF_LOG%" >nul 2>&1
type nul > "%CF_LOG%" 2>nul
del /f /q "%CF_ERR_LOG%" >nul 2>&1
type nul > "%CF_ERR_LOG%" 2>nul
rem Iniciar em processo DETACHED (Start-Process) para não morrer quando a janela do one-click fecha.
rem Use 127.0.0.1 (não "localhost") para evitar resolução IPv6 (::1) e falha ao conectar na origem.
powershell -NoProfile -ExecutionPolicy Bypass -Command "try{ $p=Start-Process -FilePath '%CF_EXE%' -ArgumentList @('tunnel','--url','http://127.0.0.1:8000','--protocol','%CF_PROTOCOL%','--edge-ip-version','%CF_EDGE_IP_VERSION%','--loglevel','info') -WorkingDirectory '%ROOT%' -WindowStyle Minimized -PassThru -RedirectStandardOutput '%CF_LOG%' -RedirectStandardError '%CF_ERR_LOG%'; $p.Id | Set-Content -Path '%CF_PID_FILE%' -Encoding ASCII -NoNewline; exit 0 } catch { ('[oneclick] Falha ao iniciar cloudflared: ' + $_.Exception.Message) | Add-Content -Path '%CF_ERR_LOG%'; exit 1 }" >nul
if errorlevel 1 (
  echo ❌ Falha ao iniciar o processo do tunnel. Veja os logs:
  echo    - %CF_LOG%
  echo    - %CF_ERR_LOG%
  goto :fail
)

rem Aguardar 5 segundos para o cloudflared iniciar e começar a escrever no log.
timeout /t 5 /nobreak >nul 2>&1

echo [3/4] Aguardando URL publica...
rem Aguardar URL no log e VALIDAR que /health responde antes de salvar/atualizar Railway
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p1='%CF_LOG%'; $p2='%CF_ERR_LOG%'; $out='%URL_FILE%'; $seen='%URL_FILE_LASTSEEN%'; $deadline=(Get-Date).AddMinutes(3); $url=$null; while((Get-Date) -lt $deadline){ $content=''; if((Test-Path $p1) -and ((Get-Item $p1).Length -gt 0)){ $content += (Get-Content $p1 -Raw -ErrorAction SilentlyContinue) + [Environment]::NewLine } ; if((Test-Path $p2) -and ((Get-Item $p2).Length -gt 0)){ $content += (Get-Content $p2 -Raw -ErrorAction SilentlyContinue) } ; if($content){ $ms=[regex]::Matches($content, 'https://[a-z0-9-]+\.trycloudflare\.com'); if($ms.Count -gt 0){ $url=$ms[$ms.Count-1].Value; break } } ; Start-Sleep -Milliseconds 800 }; if(-not $url){ exit 1 }; # salva sempre a ultima URL vista (debug)  $url | Set-Content -Path $seen -Encoding ASCII -NoNewline; $healthDeadline=(Get-Date).AddMinutes(2); $ok=$false; while((Get-Date) -lt $healthDeadline){ try{ $r=Invoke-RestMethod -Method Get -Uri ($url + '/health') -TimeoutSec 15; if($r -and $r.status -eq 'ok'){ $ok=$true; break } } catch{}; Start-Sleep -Milliseconds 800 }; if(-not $ok){ Write-Host ('URL encontrada, mas /health nao respondeu a tempo: ' + $url); exit 2 }; # somente aqui gravamos a URL "boa" usada pelo Railway  $url | Set-Content -Path $out -Encoding ASCII -NoNewline; Write-Host $url; exit 0"
if errorlevel 1 (
  echo ❌ Nao consegui capturar a URL do tunnel. Veja o log: %CF_LOG%
  echo    (debug) Ultima URL vista (se existir): %URL_FILE_LASTSEEN%
  goto :fail
)

rem Ler a URL do arquivo para exibir
set "TUNNEL_URL="
for /f "usebackq delims=" %%U in ("%URL_FILE%") do set "TUNNEL_URL=%%U"

if not defined TUNNEL_URL (
  echo ❌ URL vazia apos captura. Veja o log: %CF_LOG%
  goto :fail
)

echo [4/4] OK! URL publica:
echo   %TUNNEL_URL%
echo.
echo URL salva em: %URL_FILE%
echo.
echo IMPORTANTE: mantenha este PC ligado (RAG + tunnel rodando).
echo.

rem ============================================================
rem  (Opcional) Atualizar Railway automaticamente (gerot-dashboard)
rem ============================================================
echo [auto] Railway: tentando atualizar RAG_API_URL no gerot-dashboard...
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\update_railway_rag_url.ps1" -Url "%TUNNEL_URL%"
if errorlevel 1 (
  rem Nao use parenteses aqui dentro do bloco (cmd quebra com ')')
  echo [auto] Railway: falha no auto-update. Veja as mensagens acima. Voce pode colar a URL manualmente no Railway.
)

rem ============================================================
rem  Watcher: manter Railway sincronizado se a URL do trycloudflare mudar
rem ============================================================
if /i not "%RAILWAY_AUTO_UPDATE%"=="false" (
  echo [auto] Watcher: iniciando monitor de URL do tunnel (atualiza Railway automaticamente)...
  echo [auto] Watcher: iniciando... >> "%WATCH_LOG%"
  rem Inicia em uma janela minimizada separada (mais confiável que Start-Process dentro do PowerShell)
  echo [auto] Watcher: ja iniciado no comeco. Log: %WATCH_LOG%
) else (
  echo [auto] Watcher: desativado (RAILWAY_AUTO_UPDATE=false). Log: %WATCH_LOG%
)

set "EXITCODE=0"
goto :done

:fail
echo.
echo ============================================================
echo  ERRO
echo ============================================================
echo Logs:
echo   - %RAG_LOG%
echo   - %CF_LOG%
echo.
set "EXITCODE=1"
echo [oneclick] step=fail>> "%WATCH_LOG%"
echo [oneclick] EXITCODE=1>> "%WATCH_LOG%"

:done
if defined GEROT_NO_PAUSE exit /b %EXITCODE%
pause
exit /b %EXITCODE%

:kill_old
echo [pre] Encerrando processos antigos (8000/cloudflared)...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%P >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
rem Tenta matar pelos PIDs salvos (quando existir)
if exist "%RAG_PID_FILE%" (
  for /f "usebackq delims=" %%P in ("%RAG_PID_FILE%") do taskkill /F /PID %%P >nul 2>&1
  del /f /q "%RAG_PID_FILE%" >nul 2>&1
)
if exist "%CF_PID_FILE%" (
  for /f "usebackq delims=" %%P in ("%CF_PID_FILE%") do taskkill /F /PID %%P >nul 2>&1
  del /f /q "%CF_PID_FILE%" >nul 2>&1
)
if exist "%WATCH_PID_FILE%" (
  for /f "usebackq delims=" %%P in ("%WATCH_PID_FILE%") do taskkill /F /PID %%P >nul 2>&1
  del /f /q "%WATCH_PID_FILE%" >nul 2>&1
)
exit /b 0

:auto_update_railway
set "NEW_URL=%~1"
if not defined NEW_URL exit /b 0

rem Controle: defina RAILWAY_AUTO_UPDATE=false no .env para desativar
if /i "%RAILWAY_AUTO_UPDATE%"=="false" (
  echo [auto] Railway: auto-update desativado (RAILWAY_AUTO_UPDATE=false)
  exit /b 0
)

rem Requisitos mínimos
if not defined RAILWAY_TOKEN (
  echo [auto] Railway: RAILWAY_TOKEN nao definido. Pulando update automatico.
  echo        (Dica) No seu .env local, adicione: RAILWAY_TOKEN=seu_token
  exit /b 0
)

if not defined RAILWAY_DASHBOARD_PROJECT_ID (
  echo [auto] Railway: RAILWAY_DASHBOARD_PROJECT_ID nao definido. Pulando.
  exit /b 0
)

if not defined RAILWAY_DASHBOARD_SERVICE_NAME set "RAILWAY_DASHBOARD_SERVICE_NAME=gerot-dashboard"
if not defined RAILWAY_DASHBOARD_ENVIRONMENT_NAME set "RAILWAY_DASHBOARD_ENVIRONMENT_NAME=production"

rem Verificar npx/Node
where npx >nul 2>&1
if errorlevel 1 (
  echo [auto] Railway: npx nao encontrado. Instale Node.js LTS para habilitar auto-update.
  exit /b 0
)

echo [auto] Railway: atualizando RAG_API_URL no service %RAILWAY_DASHBOARD_SERVICE_NAME% (%RAILWAY_DASHBOARD_ENVIRONMENT_NAME%)...

rem Linkar o projeto (nao-interativo) e setar variável
set "RAILWAY_TOKEN=%RAILWAY_TOKEN%"
npx -y @railway/cli link --project "%RAILWAY_DASHBOARD_PROJECT_ID%" --environment "%RAILWAY_DASHBOARD_ENVIRONMENT_NAME%" --service "%RAILWAY_DASHBOARD_SERVICE_NAME%" >nul 2>&1

npx -y @railway/cli variables --service "%RAILWAY_DASHBOARD_SERVICE_NAME%" --environment "%RAILWAY_DASHBOARD_ENVIRONMENT_NAME%" --set "RAG_API_URL=%NEW_URL%" --skip-deploys
if errorlevel 1 (
  echo [auto] Railway: falha ao setar variavel RAG_API_URL. Verifique token/ids/permissoes.
  exit /b 1
)

rem Redeploy para o dashboard pegar a nova env var
npx -y @railway/cli redeploy --service "%RAILWAY_DASHBOARD_SERVICE_NAME%" --yes
if errorlevel 1 (
  echo [auto] Railway: falha ao redeployar. Voce pode redeployar manualmente no painel.
  exit /b 1
)

echo [auto] Railway: OK! RAG_API_URL atualizado e redeploy disparado.
exit /b 0

:ensure_cloudflared
if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%" >nul 2>&1
if exist "%CF_EXE%" exit /b 0

rem 1) Copiar do PATH se existir
for /f "delims=" %%P in ('where cloudflared 2^>nul') do (
  if exist "%%P" (
    copy /y "%%P" "%CF_EXE%" >nul 2>&1
    if exist "%CF_EXE%" exit /b 0
  )
)

rem 2) Copiar do WinGet Links se existir
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" (
  copy /y "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" "%CF_EXE%" >nul 2>&1
  if exist "%CF_EXE%" exit /b 0
)

rem 3) Baixar (modo portatil)
echo Baixando cloudflared (modo portatil)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try{Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CF_EXE%' -UseBasicParsing; exit 0}catch{ exit 1 }" >nul
if errorlevel 1 (
  echo ❌ Falha ao baixar cloudflared.
  exit /b 1
)
if not exist "%CF_EXE%" (
  echo ❌ cloudflared nao foi salvo em %CF_EXE%
  exit /b 1
)
exit /b 0

:ensure_python_deps
python --version >nul 2>&1
if errorlevel 1 (
  echo ❌ Python nao encontrado no PATH.
  exit /b 1
)

rem Verifica se o app realmente importa (pega deps reais, não só uvicorn)
python -c "import rag_service.main" >nul 2>&1
if not errorlevel 1 exit /b 0

echo Instalando dependencias do RAG (requirements-rag-win.txt)...
python -m pip install --disable-pip-version-check --no-input -r "%ROOT%\requirements-rag-win.txt"
if errorlevel 1 (
  echo ❌ Falha ao instalar dependencias.
  exit /b 1
)
exit /b 0

:load_env
set "ENV_FILE=%~1"
if not exist "%ENV_FILE%" exit /b 0
rem Carrega linhas KEY=VALUE (ignora #comentarios). tokens=1* preserva '=' no valor.
for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ENV_FILE%") do (
  if not "%%A"=="" (
    set "K=%%A"
    set "V=%%B"
    rem Remover aspas externas (ex.: DATABASE_URL="postgresql://...")
    if defined V (
      if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
      if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
    )
    set "!K!=!V!"
  )
)
exit /b 0

