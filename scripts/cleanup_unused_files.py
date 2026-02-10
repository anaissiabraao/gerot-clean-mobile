#!/usr/bin/env python3
"""Script para identificar e remover arquivos temporários e templates não utilizados."""
import os
import re
from pathlib import Path
from typing import Set, List

# Templates usados em app_production.py (baseado na análise)
TEMPLATES_USED_IN_APP = {
    'admin_live_users.html',
    'first_login.html',
    'login.html',
    'profile.html',
    'change_password.html',
    'admin_dashboard.html',
    'admin_users.html',
    'admin_environments.html',
    'admin_add_dashboard.html',
    'team_dashboard.html',
    'cd_facilities.html',
    'cd_booking.html',
    'agent.html',
    'rpa_detail.html',
    'dashboard_gen_detail.html',
    'dashboard_editor.html',
    'dashboard_view.html',
    'errors/404.html',
    'errors/500.html',
}

# Templates usados em views/ (mas precisamos verificar se estão registrados)
TEMPLATES_USED_IN_VIEWS = {
    'auth/login.html',
    'auth/register.html',
    'auth/profile.html',
    'admin/dashboard.html',
    'admin/users.html',
    'admin/sectors.html',
    'admin/routines.html',
    'admin/reports.html',
    'admin/logs.html',
    'team/dashboard.html',
    'team/tasks.html',
    'team/calendar.html',
    'team/schedule.html',
}

# Arquivos temporários conhecidos
TEMP_PATTERNS = [
    '*.log',
    '*.tmp',
    '*.bak',
    '*~',
    '~$*.xlsx',
    'rag_tunnel_url.txt',
    'last_rag_response.json',
    '__pycache__',
    '*.pyc',
    '.DS_Store',
    'Thumbs.db',
]

BASE_DIR = Path(__file__).parent.parent

def get_all_templates() -> List[Path]:
    """Lista todos os templates HTML."""
    templates_dir = BASE_DIR / 'templates'
    templates = []
    if templates_dir.exists():
        for root, dirs, files in os.walk(templates_dir):
            for file in files:
                if file.endswith('.html'):
                    templates.append(Path(root) / file)
    return templates

def normalize_template_path(template_path: Path) -> str:
    """Normaliza o caminho do template para comparação."""
    rel_path = template_path.relative_to(BASE_DIR / 'templates')
    return str(rel_path).replace('\\', '/')

def check_if_blueprints_registered() -> bool:
    """Verifica se os blueprints em views/ estão registrados."""
    app_file = BASE_DIR / 'app_production.py'
    if not app_file.exists():
        return False
    
    content = app_file.read_text(encoding='utf-8')
    # Verifica se há registro de blueprints
    has_blueprint_registration = (
        'register_blueprint' in content or
        'Blueprint' in content or
        'from views' in content
    )
    return has_blueprint_registration

def find_unused_templates() -> List[Path]:
    """Encontra templates não utilizados."""
    all_templates = get_all_templates()
    used_templates = TEMPLATES_USED_IN_APP.copy()
    
    # Se blueprints estão registrados, adiciona templates de views
    if check_if_blueprints_registered():
        used_templates.update(TEMPLATES_USED_IN_VIEWS)
    
    unused = []
    for template_path in all_templates:
        normalized = normalize_template_path(template_path)
        # Remove extensão .html para comparação
        base_name = normalized.replace('.html', '')
        
        # Verifica se é usado diretamente ou como _tailwind
        is_used = (
            normalized in used_templates or
            base_name in used_templates or
            normalized.replace('_tailwind', '') in used_templates or
            base_name.replace('_tailwind', '') in used_templates
        )
        
        # Templates base são sempre necessários
        if normalized in ['base.html', 'base_tailwind.html']:
            is_used = True
        
        if not is_used:
            unused.append(template_path)
    
    return unused

def find_temp_files() -> List[Path]:
    """Encontra arquivos temporários."""
    temp_files = []
    
    # Padrões de arquivos temporários
    patterns = [
        '*.log',
        '*.tmp',
        '*.bak',
        '*~',
        'rag_tunnel_url.txt',
        'last_rag_response.json',
    ]
    
    for pattern in patterns:
        for file_path in BASE_DIR.rglob(pattern):
            if file_path.is_file():
                temp_files.append(file_path)
    
    # Arquivos específicos conhecidos
    specific_files = [
        BASE_DIR / 'rag_tunnel_url.txt',
        BASE_DIR / 'last_rag_response.json',
        BASE_DIR / 'cloudflared_tunnel.log',
        BASE_DIR / 'rag_uvicorn.log',
        BASE_DIR / '~$dados.xlsx',
    ]
    
    for file_path in specific_files:
        if file_path.exists():
            temp_files.append(file_path)
    
    # __pycache__ directories
    for pycache_dir in BASE_DIR.rglob('__pycache__'):
        if pycache_dir.is_dir():
            temp_files.extend(pycache_dir.rglob('*'))
    
    return temp_files

def find_unused_python_files() -> List[Path]:
    """Encontra arquivos Python não utilizados."""
    unused = []
    
    # Verifica se views/ está sendo usado
    app_file = BASE_DIR / 'app_production.py'
    if app_file.exists():
        content = app_file.read_text(encoding='utf-8')
        views_used = 'from views' in content or 'register_blueprint' in content
        
        if not views_used:
            # Se views não está sendo usado, marca arquivos relacionados
            views_dir = BASE_DIR / 'views'
            if views_dir.exists():
                for py_file in views_dir.rglob('*.py'):
                    if py_file.name != '__init__.py':
                        unused.append(py_file)
            
            # Models também podem não ser usados se views não está
            models_dir = BASE_DIR / 'models'
            if models_dir.exists():
                for py_file in models_dir.rglob('*.py'):
                    if py_file.name != '__init__.py':
                        unused.append(py_file)
    
    # Scripts temporários/debug
    debug_scripts = [
        'apply_fix.py',
        'check_deploy.py',
        'check_setup.py',
        'setup_agent_tables.py',
    ]
    
    scripts_dir = BASE_DIR
    for script_name in debug_scripts:
        script_path = scripts_dir / script_name
        if script_path.exists():
            unused.append(script_path)
    
    return unused

def main():
    """Função principal."""
    print("=" * 60)
    print("LIMPEZA DE ARQUIVOS NÃO UTILIZADOS")
    print("=" * 60)
    print()
    
    # Verificar blueprints
    blueprints_registered = check_if_blueprints_registered()
    print(f"Blueprints em views/ registrados: {blueprints_registered}")
    print()
    
    # Templates não utilizados
    unused_templates = find_unused_templates()
    print(f"Templates não utilizados encontrados: {len(unused_templates)}")
    for template in unused_templates:
        print(f"  - {template.relative_to(BASE_DIR)}")
    print()
    
    # Arquivos temporários
    temp_files = find_temp_files()
    print(f"Arquivos temporários encontrados: {len(temp_files)}")
    for temp_file in temp_files[:20]:  # Mostra primeiros 20
        print(f"  - {temp_file.relative_to(BASE_DIR)}")
    if len(temp_files) > 20:
        print(f"  ... e mais {len(temp_files) - 20} arquivos")
    print()
    
    # Arquivos Python não utilizados
    unused_python = find_unused_python_files()
    print(f"Arquivos Python não utilizados encontrados: {len(unused_python)}")
    for py_file in unused_python:
        print(f"  - {py_file.relative_to(BASE_DIR)}")
    print()
    
    # Resumo
    total_to_remove = len(unused_templates) + len(temp_files) + len(unused_python)
    print("=" * 60)
    print(f"TOTAL DE ARQUIVOS PARA REMOVER: {total_to_remove}")
    print("=" * 60)
    print()
    
    # Remove automaticamente (sem confirmação interativa)
    # Para executar com confirmação, descomente as linhas abaixo e comente o bloco de remoção
    # response = input("Deseja remover estes arquivos? (s/N): ").strip().lower()
    # if response == 's':
    if True:  # Remove automaticamente
        removed_count = 0
        
        # Remove templates
        for template in unused_templates:
            try:
                template.unlink()
                removed_count += 1
                print(f"Removido: {template.relative_to(BASE_DIR)}")
            except Exception as e:
                print(f"Erro ao remover {template}: {e}")
        
        # Remove arquivos temporários
        for temp_file in temp_files:
            try:
                if temp_file.is_file():
                    temp_file.unlink()
                    removed_count += 1
                elif temp_file.is_dir():
                    import shutil
                    shutil.rmtree(temp_file)
                    removed_count += 1
            except Exception as e:
                print(f"Erro ao remover {temp_file}: {e}")
        
        # Remove arquivos Python não utilizados
        for py_file in unused_python:
            try:
                py_file.unlink()
                removed_count += 1
                print(f"Removido: {py_file.relative_to(BASE_DIR)}")
            except Exception as e:
                print(f"Erro ao remover {py_file}: {e}")
        
        print()
        print(f"OK: {removed_count} arquivos removidos com sucesso!")
    else:
        print("Operação cancelada.")

if __name__ == '__main__':
    main()

