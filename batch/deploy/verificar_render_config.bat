@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo ============================================================
echo   Verificacao de Configuracao do Render
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando render.yaml...
findstr /C:"plan:" render.yaml
echo.

echo [2/4] Verificando se RENDER_API_KEY esta configurada...
if defined RENDER_API_KEY (
    echo OK: RENDER_API_KEY encontrada
    echo.
) else (
    echo AVISO: RENDER_API_KEY nao encontrada nas variaveis de ambiente
    echo Verifique se esta no arquivo .env
    echo.
)

echo [3/4] Listando servicos no Render...
if defined RENDER_API_KEY (
    python "..\..\scripts\render_update_env.py" --list-services
    echo.
) else (
    echo Pule esta etapa - RENDER_API_KEY nao configurada
    echo.
)

echo [4/4] Checklist de Configuracao:
echo.
echo IMPORTANTE: Siga estes passos no Dashboard do Render:
echo.
echo 1. Acesse: https://dashboard.render.com
echo 2. Vá para o serviço "gerot-dashboard"
echo 3. Verifique em Settings ^> Plan: deve estar em "Standard"
echo 4. Verifique em Settings ^> Build ^& Deploy:
echo    - Auto-Deploy: Yes
echo    - Branch: main (ou master)
echo 5. Verifique em Settings ^> Git Repository:
echo    - Deve estar conectado ao seu repositório
echo    - Se não estiver, clique em "Connect Repository"
echo.
echo 6. No GitHub/GitLab/Bitbucket:
echo    - Vá para Settings ^> Applications
echo    - Verifique se Render está autorizado
echo    - Se não estiver, autorize o acesso
echo.
echo 7. Após configurar, faça commit do render.yaml:
echo    git add render.yaml
echo    git commit -m "Atualizar plano para Standard"
echo    git push origin main
echo.
echo 8. Teste deploy manual no Render:
echo    - Clique em "Manual Deploy" ^> "Deploy latest commit"
echo.
echo ============================================================
echo   Documentacao completa: CONFIGURAR_RENDER_STANDARD.md
echo ============================================================
echo.
pause

