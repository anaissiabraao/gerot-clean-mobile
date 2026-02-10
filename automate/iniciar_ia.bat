@echo off
title Assistente IA - Sistema Brudam
color 0A

echo.
echo ========================================
echo    ASSISTENTE IA - SISTEMA BRUDAM
echo ========================================
echo.
echo Iniciando o assistente de coleta de dados...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Por favor, instale o Python primeiro.
    echo.
    pause
    exit /b 1
)

REM Verificar se o arquivo ia.py existe
if not exist "ia.py" (
    echo ERRO: Arquivo ia.py nao encontrado!
    echo Certifique-se de que o arquivo esta na mesma pasta.
    echo.
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
echo Verificando dependencias...
python -c "import selenium, pandas, openpyxl" >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias necessarias...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias!
        echo Execute: pip install -r requirements.txt
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Dependencias verificadas!
echo Iniciando o Assistente IA...
echo.

REM Iniciar o programa Python
python ia.py

REM Se o programa terminar, mostrar mensagem
echo.
echo ========================================
echo    ASSISTENTE IA FINALIZADO
echo ========================================
echo.
pause
