@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo ============================================================
echo   Verificacao de Plano e Minutos do Render
echo ============================================================
echo.

:: Resolve path do projeto (voltar 2 níveis para chegar à raiz)
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

:: Carregar variaveis do .env se existir
if exist "%ROOT%\.env" (
    echo Carregando variaveis do .env...
    for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ROOT%\.env") do (
        if not "%%A"=="" (
            set "K=%%A"
            set "V=%%B"
            :: Remover aspas externas
            if defined V (
                if "!V:~0,1!"=="^"" if "!V:~-1!"=="^"" set "V=!V:~1,-1!"
                if "!V:~0,1!"=="'" if "!V:~-1!"=="'" set "V=!V:~1,-1!"
            )
            for /f "delims=" %%K in ("!K!") do for /f "delims=" %%V in ("!V!") do endlocal & set "%%K=%%V" & setlocal EnableDelayedExpansion
        )
    )
    echo.
)

if not defined RENDER_API_KEY (
    echo ERRO: RENDER_API_KEY nao encontrada.
    echo.
    echo Configure no arquivo .env ou nas variaveis de ambiente:
    echo   RENDER_API_KEY=seu_token_aqui
    echo.
    pause
    exit /b 1
)

echo Verificando plano e workspace...
echo.
python "%ROOT%\scripts\check_render_plan.py"

echo.
echo ============================================================
echo   SOLUCAO PARA MINUTOS ESGOTADOS
echo ============================================================
echo.
echo Se ainda mostra "pipeline minutes exhausted":
echo.
echo 1. VERIFIQUE O PLANO DO WORKSPACE (nao apenas do servico):
echo    - Acesse: https://dashboard.render.com/account
echo    - Vá para "Billing" ou "Plan"
echo    - Verifique se o workspace esta em Standard
echo    - Se nao estiver, atualize o plano do WORKSPACE
echo.
echo 2. ATUALIZE O PLANO DO SERVICO:
echo    - Acesse: https://dashboard.render.com
echo    - Vá para o servico "gerot-dashboard"
echo    - Settings ^> Plan ^> Change Plan ^> Standard
echo.
echo 3. AGUARDE PROPAGACAO:
echo    - Pode levar alguns minutos para a atualizacao propagar
echo    - Tente fazer deploy novamente apos 5-10 minutos
echo.
echo 4. SE AINDA NAO FUNCIONAR:
echo    - Entre em contato com suporte@render.com
echo    - Mencione que atualizou para Standard mas ainda bloqueia
echo.
pause

