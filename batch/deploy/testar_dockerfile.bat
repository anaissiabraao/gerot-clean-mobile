@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 > nul
title GeRot - Testar Dockerfile Otimizado

:: Resolve path do projeto
for %%I in ("%~dp0..\..") do set "ROOT=%%~fsI"
cd /d "%ROOT%"

echo.
echo ============================================================
echo  Testar Dockerfile Otimizado
echo ============================================================
echo.
echo Este script vai:
echo   1. Fazer build da imagem Docker localmente
echo   2. Mostrar o tamanho da imagem
echo   3. Verificar se esta menor que 4GB
echo.
echo ============================================================
echo.

:: Verificar se Docker esta instalado
docker --version >nul 2>&1
if errorlevel 1 (
  echo ERRO: Docker nao esta instalado ou nao esta no PATH.
  echo Instale o Docker Desktop: https://www.docker.com/products/docker-desktop
  pause
  exit /b 1
)

echo [1/3] Fazendo build da imagem...
echo.
docker build -t gerot-test:latest .

if errorlevel 1 (
  echo.
  echo ERRO: Build falhou!
  pause
  exit /b 1
)

echo.
echo [2/3] Verificando tamanho da imagem...
echo.
docker images gerot-test:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo.
echo [3/3] Analisando tamanho...
echo.

:: Extrair tamanho (formato: "2.5GB" ou "3500MB")
for /f "tokens=3" %%S in ('docker images gerot-test:latest --format "{{.Size}}"') do set "SIZE=%%S"

echo Tamanho da imagem: %SIZE%
echo Limite do Railway: 4.0 GB
echo.

:: Verificar se contem "GB"
echo %SIZE% | findstr /i "GB" >nul
if errorlevel 1 (
  echo Imagem parece estar OK (menor que 1GB ou em MB).
) else (
  echo Verifique se o tamanho esta abaixo de 4.0 GB.
)

echo.
echo ============================================================
echo  Pronto!
echo ============================================================
echo.
echo Se o tamanho estiver OK, faca commit e push:
echo   git add Dockerfile .dockerignore
echo   git commit -m "Otimizar Dockerfile: reduzir tamanho"
echo   git push origin main
echo.
pause

