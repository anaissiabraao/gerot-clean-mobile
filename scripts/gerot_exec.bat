@echo off
chcp 65001 > nul
cls

echo ============================================================
echo  INICIAR SERVIÇO COMPLETO
echo ============================================================
echo.
echo  Este script iniciará:
echo  • Proxy MySQL (porta 3307) para acesso via ZeroTier
echo  • Sincronização automática a cada 5 minutos
echo.
echo ============================================================
echo.

:: Verificar se a pasta logs existe
if not exist "logs" (
    echo Criando pasta logs...
    mkdir logs
)

:: Verificar se o arquivo .env existe
if not exist "..\.env" (
    echo.
    echo ❌ ERRO: Arquivo .env não encontrado!
    echo.
    echo Por favor, crie o arquivo .env antes de continuar:
    echo    1. Copie .env.example para .env
    echo    2. Preencha a senha do Supabase
    echo.
    pause
    exit /b 1
)

:: Iniciar o serviço em uma nova janela minimizada
echo Iniciando serviços...
start "Serviço Completo - Proxy + Sync" /MIN python servico_completo.py

echo.
echo ✅ Serviços iniciados em segundo plano!
echo.
echo 📋 INFORMAÇÕES:
echo    • Proxy MySQL: localhost:3307
echo    • Sincronização: a cada 5 minutos
echo    • Alertas Motoristas: a cada 1 minuto (Brudam → Supabase)
echo    • Logs: logs\servico_completo_*.log
echo.
echo 📝 MONITORAMENTO:
echo    • Ver logs em tempo real:
echo      powershell -Command "Get-Content logs\servico_completo_*.log -Wait -Tail 50"
echo.
echo ⏹️  PARAR SERVIÇOS:
echo    • Feche a janela "Serviço Completo - Proxy + Sync"
echo    • Ou execute: taskkill /FI "WINDOWTITLE eq Serviço Completo*" /T /F
echo.
pause
