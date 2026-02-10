"""Verifica se não há código tentando usar Gemini."""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))

def check_file_for_gemini(file_path: Path) -> list[str]:
    """Verifica um arquivo por referências ao Gemini."""
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        lines = content.split("\n")
        
        for i, line in enumerate(lines, 1):
            line_lower = line.lower()
            # Procurar por imports ou uso do Gemini
            if any(keyword in line_lower for keyword in [
                "import google.generativeai",
                "from google import generativeai",
                "import generativeai",
                "from google.generativeai",
                "GenerativeModel",
                "genai.generate_content",
                "genai.chat",
                ".generate_content(",
                ".chat(",
            ]):
                # Ignorar comentários e strings de erro
                if not line.strip().startswith("#") and '"gemini' not in line and "'gemini" not in line:
                    issues.append(f"Linha {i}: {line.strip()}")
    except Exception as e:
        issues.append(f"Erro ao ler arquivo: {e}")
    
    return issues

def main() -> int:
    """Verifica todos os arquivos Python relevantes."""
    print("Verificando código por referências ao Gemini...\n")
    
    files_to_check = [
        BASE_DIR / "app_production.py",
        BASE_DIR / "rag_service" / "llm_client.py",
        BASE_DIR / "rag_service" / "rag_pipeline.py",
        BASE_DIR / "rag_service" / "main.py",
        BASE_DIR / "rag_service" / "config.py",
    ]
    
    all_issues = {}
    for file_path in files_to_check:
        if file_path.exists():
            issues = check_file_for_gemini(file_path)
            if issues:
                all_issues[str(file_path.relative_to(BASE_DIR))] = issues
    
    if all_issues:
        print("ERRO: ENCONTRADAS REFERENCIAS AO GEMINI:\n")
        for file_path, issues in all_issues.items():
            print(f"📄 {file_path}:")
            for issue in issues:
                print(f"   {issue}")
            print()
        return 1
    else:
        print("OK: Nenhuma referencia ao Gemini encontrada no codigo!")
        print("\nArquivos verificados:")
        for file_path in files_to_check:
            if file_path.exists():
                print(f"   OK: {file_path.relative_to(BASE_DIR)}")
        return 0

if __name__ == "__main__":
    raise SystemExit(main())

