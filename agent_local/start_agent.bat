@echo off
chcp 65001 > nul
cls

echo ============================================================
echo  🤖 AGENTE BRUDAM - GeRot RPA
echo ============================================================
echo.
echo  Este script iniciará o agente local que:
echo  • Conecta ao MySQL Brudam via ZeroTier (10.147.17.88:3307)
echo  • Busca RPAs pendentes no GeRot
echo  • Executa queries e envia resultados
echo.
echo ============================================================
echo.

:: Ir para o diretório do script
cd /d "%~dp0"

:: Verificar se o arquivo .env existe
if not exist "..\.env" (
    echo.
    echo ❌ ERRO: Arquivo .env não encontrado!
    echo.
    echo Por favor, crie o arquivo .env:
    echo    1. Copie .env.example para .env
    echo    2. Preencha as credenciais
    echo.
    echo Criando .env a partir do exemplo...
    if exist ".env.example" (
        copy ".env.example" "..\.env" > nul
        echo.
        echo ⚠️  Arquivo .env criado! Edite-o com as credenciais corretas.
        echo.
        notepad "..\.env"
        pause
        exit /b 1
    ) else (
        echo ❌ .env.example também não encontrado!
        pause
        exit /b 1
    )
)

:: Verificar se Python está instalado
python --version > nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Python não encontrado!
    echo Instale Python 3.8+ e adicione ao PATH.
    pause
    exit /b 1
)

:: Verificar/instalar dependências
echo 📦 Verificando dependências...
pip show pymysql > nul 2>&1
if errorlevel 1 (
    echo Instalando pymysql...
    pip install pymysql requests
)

:: Testar conexão MySQL antes de iniciar
echo.
echo 🔍 Testando conexão MySQL...
python -c "from dotenv import load_dotenv; load_dotenv(); import os; import pymysql; host=os.getenv('MYSQL_AZ_HOST', 'portoex.db.brudam.com.br'); port=int(os.getenv('MYSQL_AZ_PORT','3306')); print(f'   Host: {host}:{port}'); c=pymysql.connect(host=host,port=port,user=os.getenv('MYSQL_AZ_USER'),password=os.getenv('MYSQL_AZ_PASSWORD'),database=os.getenv('MYSQL_AZ_DB')); print('✅ Conexão MySQL OK'); c.close()" 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Falha na conexão MySQL!
    echo Verifique:
    echo    • ZeroTier está conectado?
    echo    • Credenciais no .env estão corretas?
    echo    • Host portoex.db.brudam.com.br está acessível?
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  ▶️  INICIANDO AGENTE...
echo ============================================================
echo.
echo 📋 Pressione Ctrl+C para parar o agente
echo.

:: Executar o agente
python brudam_agent.py

echo.
echo 🛑 Agente encerrado.
pause
