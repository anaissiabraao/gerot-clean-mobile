@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Migrar para Railway

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

echo.
echo ============================================================
echo  Migracao: Render -^> Railway
echo ============================================================
echo.
echo Railway e uma alternativa MUITO MAIS BARATA ao Render:
echo   - Render Standard: $25+/mes
echo   - Railway: $5-10/mes
echo   - Economia: ~$15-20/mes
echo.
echo ============================================================
echo  PASSO-A-PASSO
echo ============================================================
echo.
echo PASSO 1: Criar conta no Railway
echo   1. Acesse: https://railway.app
echo   2. Clique em "Start a New Project"
echo   3. Conecte seu GitHub
echo   4. Autorize o acesso ao repositorio
echo.
echo PASSO 2: Criar projeto
echo   1. Selecione seu repositorio "GeRot-1"
echo   2. Railway detecta automaticamente o Dockerfile
echo   3. Clique em "Deploy Now"
echo   4. Aguarde o primeiro deploy (2-5 minutos)
echo.
echo PASSO 3: Adicionar PostgreSQL
echo   1. No projeto Railway, clique em "+ New"
echo   2. Selecione "Database" -^> "PostgreSQL"
echo   3. Railway cria automaticamente
echo   4. Vá em "Variables" e copie o DATABASE_URL
echo.
echo PASSO 4: Configurar variaveis de ambiente
echo   1. Vá em "Variables" -^> "Raw Editor"
echo   2. Adicione todas as variaveis do .env:
echo      - DATABASE_URL (do PostgreSQL criado)
echo      - SECRET_KEY
echo      - RAG_API_URL
echo      - RAG_STRICT_MODE
echo      - Todas as outras (exceto RENDER_*)
echo.
echo PASSO 5: Deploy automatico
echo   - Railway faz deploy automaticamente a cada push
echo   - Acompanhe em: https://railway.app
echo   - URL sera: seu-projeto.up.railway.app
echo.
echo PASSO 6: Migrar banco de dados (opcional)
echo   Exportar do Render:
echo     pg_dump %%DATABASE_URL_RENDER%% ^> backup.sql
echo.
echo   Importar no Railway:
echo     railway run psql ^< backup.sql
echo.
echo ============================================================
echo  VANTAGENS DO RAILWAY
echo ============================================================
echo.
echo   - Muito mais barato ($5-10/mes vs $25+/mes)
echo   - Sem limite de minutos de build
echo   - PostgreSQL incluido (gratuito ate 5GB)
echo   - Deploy automatico
echo   - Interface mais simples
echo   - Dockerfile funciona direto (sem mudancas)
echo.
echo ============================================================
echo  VERIFICAR MIGRACAO
echo ============================================================
echo.
echo Apos migrar, execute:
echo   python "%ROOT%\scripts\migrar_para_railway.py"
echo.
echo Para ver instrucoes detalhadas:
echo   type "%ROOT%\ALTERNATIVAS_DETALHADAS.md"
echo.
pause

