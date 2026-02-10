@echo off
chcp 65001 > nul
title GeRot - Remover Firewall (RAG/Ollama)

echo ============================================================
echo  🔒 Firewall - Remover regras locais do GeRot
echo ============================================================
echo.
echo Este script precisa ser executado como ADMINISTRADOR.
echo.

net session >nul 2>&1
if errorlevel 1 (
  echo ❌ Execute este .bat como Administrador.
  pause
  exit /b 1
)

echo Removendo regra: GeRot RAG Local...
netsh advfirewall firewall delete rule name="GeRot RAG Local" >nul

echo Removendo regra: GeRot Ollama Local...
netsh advfirewall firewall delete rule name="GeRot Ollama Local" >nul

echo.
echo ✅ Regras removidas.
echo.
pause
