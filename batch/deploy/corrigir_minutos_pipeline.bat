@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Corrigir Minutos de Pipeline Esgotados

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

echo.
echo ============================================================
echo  CORRIGIR: Minutos de Pipeline Esgotados
echo ============================================================
echo.
echo PROBLEMA: Workspace esgotou minutos de pipeline
echo.
echo CAUSA: O WORKSPACE (conta) precisa estar em Standard,
echo        nao apenas o servico!
echo.
echo ============================================================
echo  PASSO-A-PASSO PARA CORRIGIR
echo ============================================================
echo.
echo PASSO 1: Atualizar PLANO DO WORKSPACE
echo.
echo   1. Acesse: https://dashboard.render.com/account
echo   2. Va para "Billing" ou "Plan"
echo   3. Verifique o plano do WORKSPACE
echo   4. Se estiver em Free/Starter:
echo      - Clique em "Upgrade to Standard"
echo      - Configure metodo de pagamento
echo      - Confirme a atualizacao
echo.
echo PASSO 2: Verificar PLANO DO SERVICO
echo.
echo   1. Acesse: https://dashboard.render.com
echo   2. Va para o servico "gerot-dashboard"
echo   3. Settings ^> Plan
echo   4. Deve estar em "Standard"
echo   5. Se nao estiver, altere para Standard
echo.
echo PASSO 3: Aguardar Propagacao
echo.
echo   - Aguarde 5-10 minutos apos atualizar
echo   - O Render precisa propagar as mudancas
echo.
echo PASSO 4: Verificar Status
echo.
echo   Execute: batch\deploy\verificar_plano_render.bat
echo.
echo PASSO 5: Tentar Deploy Novamente
echo.
echo   - Acesse o dashboard do Render
echo   - Va para o servico
echo   - Clique em "Manual Deploy"
echo   - Selecione o commit desejado
echo.
echo ============================================================
echo  VERIFICAR STATUS ATUAL
echo ============================================================
echo.
echo Deseja verificar o status agora? (S/N)
set /p VERIFICAR="> "

if /i "%VERIFICAR%"=="S" (
  echo.
  echo Executando verificacao...
  echo.
  call "%ROOT%\batch\deploy\verificar_plano_render.bat"
) else (
  echo.
  echo Para verificar depois, execute:
  echo   batch\deploy\verificar_plano_render.bat
)

echo.
echo ============================================================
echo  IMPORTANTE
echo ============================================================
echo.
echo AMBOS precisam estar em Standard:
echo   [X] Workspace (conta) em Standard
echo   [X] Servico em Standard
echo.
echo Se apenas o servico estiver em Standard, os builds
echo ainda serao bloqueados por falta de minutos!
echo.
pause

