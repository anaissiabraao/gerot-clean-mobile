#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script para organizar arquivos .bat em pastas e atualizar caminhos."""
import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

BASE_DIR = Path(__file__).parent.parent

# Estrutura de organização
BATCH_STRUCTURE = {
    "batch/deploy": [
        "deploy_to_render.bat",
        "verificar_plano_render.bat",
        "verificar_render_config.bat",
        "check_render_env.bat",
        "fix_render_now.bat",
        "force_restart_render.bat",
        "force_update_rag_url.bat",
        "disable_gemini_render.bat",
        "update_render_url.bat",
        "start_rag_tunnel_and_update_render.bat",
        "diagnostico_completo.bat",
    ],
    "batch/rag": [
        "start_rag_tunnel_oneclick.bat",
        "test_rag_connectivity.bat",
        "run_rag_background.bat",
        "run_cloudflared_tunnel_background.bat",
        "start_named_tunnel.bat",
        "cloudflared_named_tunnel_setup.bat",
        "install_named_tunnel_service.bat",
    ],
    "batch/local": [
        "start_local_rag.bat",
        "start_local_rag_worker.bat",
        "start_local_stack.bat",
        "start_ollama.bat",
        "install_ollama_and_models.bat",
    ],
    "batch/utils": [
        "open_firewall_gerot_local.bat",
        "close_firewall_gerot_local.bat",
        "ingest_knowledge_dump_to_rag.bat",
    ],
}

# Arquivos que devem permanecer na raiz (são chamados frequentemente ou são especiais)
KEEP_IN_ROOT = [
    "start_rag_tunnel_oneclick.bat",  # Pode ser chamado de outros lugares
]

def get_relative_path(from_file: Path, to_file: Path) -> str:
    """Calcula caminho relativo entre dois arquivos."""
    try:
        rel_path = os.path.relpath(to_file, from_file.parent)
        # Normalizar para Windows
        rel_path = rel_path.replace("/", "\\")
        return rel_path
    except ValueError:
        # Se não conseguir calcular relativo, usar absoluto
        return str(to_file)

def update_batch_paths(file_path: Path, file_mapping: Dict[str, Path]) -> bool:
    """Atualiza caminhos em um arquivo .bat."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changed = False
        
        # Não usar patterns genéricos, fazer substituições específicas
        
        # Atualizar referências a outros arquivos .bat
        for old_name, new_path in file_mapping.items():
            if old_name == file_path.name:
                continue
            
            # Padrões de substituição (usar raw strings corretamente)
            escaped_name = re.escape(old_name)
            rel_path_str = get_relative_path(file_path, new_path)
            
            replacements = [
                # call "arquivo.bat"
                (r'call\s+"?' + escaped_name + r'"?', f'call "{rel_path_str}"'),
                # "%ROOT%\arquivo.bat"
                (r'%ROOT%\\' + escaped_name, f'%ROOT%\\{rel_path_str}'),
                # "arquivo.bat" em geral
                (r'"' + escaped_name + r'"', f'"{rel_path_str}"'),
                # 'arquivo.bat'
                (r"'" + escaped_name + r"'", f"'{rel_path_str}'"),
            ]
            
            for pattern, replacement in replacements:
                new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                if new_content != content:
                    content = new_content
                    changed = True
        
        # Atualizar caminhos para scripts/ (sempre relativo à raiz)
        scripts_pattern = r'(python\s+["\']?)([^"\']*scripts\\)([^"\']*\.py)(["\']?)'
        def replace_scripts(match):
            prefix = match.group(1)
            script_name = match.group(3)
            suffix = match.group(4)
            # Calcular caminho relativo para scripts/
            scripts_dir = BASE_DIR / "scripts"
            rel_path = get_relative_path(file_path, scripts_dir / script_name)
            return f'{prefix}{rel_path}{suffix}'
        
        new_content = re.sub(scripts_pattern, replace_scripts, content)
        if new_content != content:
            content = new_content
            changed = True
        
        # Atualizar caminhos para .env (sempre relativo à raiz)
        env_pattern = r'(["\']?)([^"\']*\.env)(["\']?)'
        def replace_env(match):
            env_path = BASE_DIR / ".env"
            rel_path = get_relative_path(file_path, env_path)
            return f'{match.group(1)}{rel_path}{match.group(3)}'
        
        new_content = re.sub(env_pattern, replace_env, content)
        if new_content != content:
            content = new_content
            changed = True
        
        # Atualizar caminhos para arquivos na raiz (rag_tunnel_url.txt, logs, etc)
        root_files = ["rag_tunnel_url.txt", "rag_uvicorn.log", "cloudflared_tunnel.log"]
        for root_file in root_files:
            root_file_path = BASE_DIR / root_file
            rel_path = get_relative_path(file_path, root_file_path)
            escaped_file = re.escape(root_file)
            
            patterns_to_replace = [
                (r'%ROOT%\\' + escaped_file, f'%ROOT%\\{rel_path}'),
                (r'"' + escaped_file + r'"', f'"{rel_path}"'),
                (r"'" + escaped_file + r"'", f"'{rel_path}'"),
            ]
            
            for pattern, replacement in patterns_to_replace:
                new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                if new_content != content:
                    content = new_content
                    changed = True
        
        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"ERRO ao atualizar {file_path}: {e}")
        return False

def main():
    """Organiza arquivos .bat em pastas."""
    print("=" * 60)
    print("Organizando arquivos .bat em pastas")
    print("=" * 60)
    print()
    
    # Criar estrutura de pastas
    for folder in BATCH_STRUCTURE.keys():
        folder_path = BASE_DIR / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        print(f"Criada pasta: {folder}")
    
    print()
    
    # Mapear arquivos antigos -> novos
    file_mapping: Dict[str, Path] = {}
    moved_files: List[Tuple[Path, Path]] = []
    
    # Mover arquivos
    for folder, files in BATCH_STRUCTURE.items():
        for file_name in files:
            old_path = BASE_DIR / file_name
            new_path = BASE_DIR / folder / file_name
            
            if old_path.exists():
                # Verificar se não está na lista de manter na raiz
                if file_name not in KEEP_IN_ROOT:
                    try:
                        # Mover arquivo
                        new_path.parent.mkdir(parents=True, exist_ok=True)
                        old_path.rename(new_path)
                        file_mapping[file_name] = new_path
                        moved_files.append((old_path, new_path))
                        print(f"Movido: {file_name} -> {folder}/{file_name}")
                    except Exception as e:
                        print(f"ERRO ao mover {file_name}: {e}")
                else:
                    print(f"Mantido na raiz: {file_name}")
                    file_mapping[file_name] = old_path
            elif new_path.exists():
                # Já está na pasta correta
                file_mapping[file_name] = new_path
                print(f"Já organizado: {folder}/{file_name}")
            else:
                print(f"Não encontrado: {file_name}")
    
    print()
    print("=" * 60)
    print("Atualizando caminhos nos arquivos .bat")
    print("=" * 60)
    print()
    
    # Atualizar caminhos em todos os arquivos .bat
    updated_count = 0
    for folder, files in BATCH_STRUCTURE.items():
        for file_name in files:
            file_path = BASE_DIR / folder / file_name
            if not file_path.exists():
                # Tentar na raiz se não encontrado na pasta
                file_path = BASE_DIR / file_name
            
            if file_path.exists():
                if update_batch_paths(file_path, file_mapping):
                    updated_count += 1
                    print(f"Atualizado: {file_path.relative_to(BASE_DIR)}")
    
    # Atualizar também arquivos que ficaram na raiz mas referenciam outros
    for root_file in BASE_DIR.glob("*.bat"):
        if root_file.name not in file_mapping:
            file_mapping[root_file.name] = root_file
    
    # Segunda passagem: atualizar arquivos que referenciam os movidos
    for bat_file in BASE_DIR.rglob("*.bat"):
        if update_batch_paths(bat_file, file_mapping):
            updated_count += 1
            print(f"Atualizado: {bat_file.relative_to(BASE_DIR)}")
    
    print()
    print("=" * 60)
    print("Resumo")
    print("=" * 60)
    print(f"Arquivos movidos: {len(moved_files)}")
    print(f"Arquivos atualizados: {updated_count}")
    print()
    print("Estrutura criada:")
    for folder in BATCH_STRUCTURE.keys():
        print(f"  {folder}/")
        for file_name in BATCH_STRUCTURE[folder]:
            file_path = BASE_DIR / folder / file_name
            if file_path.exists():
                print(f"    [OK] {file_name}")
            else:
                print(f"    [X] {file_name} (nao encontrado)")
    print()
    print("Pronto! Arquivos organizados.")

if __name__ == "__main__":
    main()

