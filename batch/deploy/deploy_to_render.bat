@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo ============================================================
echo   Deploy para Render (via GitHub)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando status do Git...
git status --short
echo.

echo [2/4] Adicionando arquivos modificados...
git add app_production.py
git add rag_service/
git add templates/
git add scripts/
git add start_rag_tunnel*.bat
git add requirements*.txt
git add .gitignore
git add *.md
git add *.bat
echo.
echo ⚠️  Arquivos temporários (logs, tunnel URL) serão ignorados pelo Git.
echo.

echo [3/4] Fazendo commit...
git commit -m "Melhorias no chat e ajustes diversos

- Melhora formatação e layout do chat no dashboard
- Melhora renderização de markdown (listas, links, código)
- Ajusta espaçamento e responsividade das mensagens
- Remove referências ao Google Gemini
- Configura RAG para usar apenas Ollama/Llama"
echo.

if errorlevel 1 (
  echo ⚠️ Nenhuma alteração para commitar (ou commit falhou).
  echo Continuando mesmo assim...
)

echo [4/4] Fazendo push para GitHub...
git push origin main

if errorlevel 1 (
  echo.
  echo ❌ ERRO: Falha ao fazer push para GitHub.
  echo Verifique suas credenciais Git e tente novamente.
  pause
  exit /b 1
)

echo.
echo ✅ Deploy iniciado!
echo.
echo O Render vai detectar o push e fazer deploy automaticamente.
echo Acompanhe o progresso em: https://dashboard.render.com
echo.
pause

