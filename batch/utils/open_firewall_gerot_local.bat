@echo off
chcp 65001 > nul
title GeRot - Abrir Firewall (RAG/Ollama)

echo ============================================================
echo  🔓 Firewall - Liberar portas locais do GeRot
echo ============================================================
echo.
echo Este script precisa ser executado como ADMINISTRADOR.
echo Ele cria regras de entrada para:
echo   - TCP 8000 (RAG FastAPI)
echo   - TCP 11434 (Ollama)
echo.

net session >nul 2>&1
if errorlevel 1 (
  echo ❌ Execute este .bat como Administrador.
  pause
  exit /b 1
)

echo Criando regra: GeRot RAG Local (8000)...
netsh advfirewall firewall add rule name="GeRot RAG Local" dir=in action=allow protocol=TCP localport=8000 profile=private >nul

echo Criando regra: GeRot Ollama Local (11434)...
netsh advfirewall firewall add rule name="GeRot Ollama Local" dir=in action=allow protocol=TCP localport=11434 profile=private >nul

echo.
echo ✅ Regras adicionadas (perfil: private).
echo.
pause
