@echo off

setlocal EnableExtensions

chcp 65001 > nul

title GeRot - Instalar Ollama + Modelos

cd /d "%~dp0"



echo ============================================================

echo  Instalar Ollama + Modelos (LLM local)

echo ============================================================

echo.

echo Aviso: pode baixar alguns GB dependendo do modelo.

echo.



where winget >nul 2>nul

if errorlevel 1 goto :no_winget



:: Detectar Ollama mesmo sem PATH

set "OLLAMA_EXE="

if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" set "OLLAMA_EXE=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"

if exist "%ProgramFiles%\Ollama\ollama.exe" set "OLLAMA_EXE=%ProgramFiles%\Ollama\ollama.exe"



where ollama >nul 2>nul

if errorlevel 1 (

  if not "%OLLAMA_EXE%"=="" goto :pull_models

  goto :install_ollama

)



set "OLLAMA_EXE=ollama"

goto :pull_models



:install_ollama

echo Instalando Ollama via winget...

winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements

echo.

echo Verificando instalacao do Ollama...



:: Rechecar PATH

where ollama >nul 2>nul

if not errorlevel 1 (

  set "OLLAMA_EXE=ollama"

  goto :pull_models

)



:: Rechecar caminhos comuns

set "OLLAMA_EXE="

if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" set "OLLAMA_EXE=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"

if exist "%ProgramFiles%\Ollama\ollama.exe" set "OLLAMA_EXE=%ProgramFiles%\Ollama\ollama.exe"

if "%OLLAMA_EXE%"=="" goto :no_ollama_path

goto :pull_models



:pull_models

echo.

echo Usando Ollama: "%OLLAMA_EXE%"

echo.

echo Baixando modelos (pode demorar)...

echo - LLM: llama3.2

echo - Embeddings: nomic-embed-text

echo.

"%OLLAMA_EXE%" pull llama3.2

if errorlevel 1 goto :ollama_pull_failed

"%OLLAMA_EXE%" pull nomic-embed-text

if errorlevel 1 goto :ollama_pull_failed



echo.

echo OK: Ollama e modelos prontos.

echo.

pause

exit /b 0



:no_winget

echo ERRO: winget nao encontrado.

echo Instale o App Installer pela Microsoft Store.

echo.

pause

exit /b 1



:no_ollama_path

echo ERRO: Ollama instalado, mas nao esta acessivel via PATH.

echo Caminho esperado (ex.):

echo   %LOCALAPPDATA%\Programs\Ollama\ollama.exe

echo.

echo Solucao rapida no PowerShell (sessao atual):

echo   $env:Path += ";%LOCALAPPDATA%\Programs\Ollama"

echo.

echo Depois tente: ollama --version

echo.

pause

exit /b 1



:ollama_pull_failed

echo.

echo ERRO: falha ao baixar modelos do Ollama.

echo Verifique sua internet e tente novamente.

echo.

pause

exit /b 1

