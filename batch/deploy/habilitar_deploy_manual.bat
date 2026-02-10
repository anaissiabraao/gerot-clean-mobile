@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Habilitar Deploy Manual no Render

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

echo.
echo ============================================================
echo  Como Habilitar Deploy Manual no Render
echo ============================================================
echo.
echo O deploy manual pode estar desabilitado nas configuracoes do Render.
echo.
echo SIGA ESTES PASSOS:
echo.
echo 1. Acesse o Dashboard do Render:
echo    https://dashboard.render.com
echo.
echo 2. Va para o servico "gerot-dashboard"
echo.
echo 3. Clique em "Settings" (no menu lateral)
echo.
echo 4. Va para a secao "Build ^& Deploy"
echo.
echo 5. Verifique as seguintes configuracoes:
echo.
echo    a) Auto-Deploy:
echo       - Deve estar em "Yes" para permitir deploys automaticos
echo       - Mas mesmo com "Yes", voce pode fazer deploys manuais
echo.
echo    b) Branch:
echo       - Deve estar configurado como "main"
echo       - Se nao estiver, altere e salve
echo.
echo    c) Root Directory:
echo       - Deve estar vazio (raiz do repositorio)
echo       - Ou configurado corretamente se usar subdiretorio
echo.
echo 6. Para fazer deploy manual:
echo    - Volte para a pagina principal do servico
echo    - Clique no botao "Manual Deploy" (no topo da pagina)
echo    - Selecione uma das opcoes:
echo      * "Deploy latest commit" - deploy do ultimo commit
echo      * "Deploy specific commit" - deploy de um commit especifico
echo.
echo 7. Se o botao "Manual Deploy" nao aparecer:
echo    - Verifique se o servico esta conectado ao repositorio Git
echo    - Va em Settings ^> Git Repository
echo    - Se nao estiver conectado, clique em "Connect Repository"
echo    - Autorize o acesso ao seu repositorio GitHub/GitLab/Bitbucket
echo.
echo 8. Verificar se o commit esta no GitHub:
echo    - Execute: git log --oneline origin/main
echo    - Procure pelo commit desejado
echo    - Se nao estiver, faca: git push origin main
echo.
echo ============================================================
echo  Scripts Disponiveis
echo ============================================================
echo.
echo Para fazer deploy de um commit especifico:
echo   batch\deploy\force_deploy_commit.bat 119219d
echo.
echo Para verificar configuracao do Render:
echo   batch\deploy\verificar_render_config.bat
echo.
echo Para fazer deploy normal (push para GitHub):
echo   batch\deploy\deploy_to_render.bat
echo.
pause

