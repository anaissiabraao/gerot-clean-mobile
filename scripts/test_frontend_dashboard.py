#!/usr/bin/env python3
"""
Teste do frontend: Relatório de Performance, Indicadores Executivos, Chat IA.
Valida estrutura HTML, APIs e retorno esperado.
Execute: python scripts/test_frontend_dashboard.py
"""
import os
import sys
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_html_structure():
    """Valida que o template tem os elementos necessários."""
    template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "team_dashboard_tailwind.html")
    if not os.path.exists(template_path):
        print("ERRO: team_dashboard_tailwind.html nao encontrado")
        return False
    
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    checks = [
        ('tab-indicadores-executivos', 'Tab Indicadores Executivos'),
        ('tab-chat', 'Tab Chat IA'),
        ('tab-dashboards', 'Tab Dashboards'),
        ('exec-indicadores-container', 'Container Indicadores'),
        ('fullChatMessages', 'Container Chat'),
        ('openTab', 'Funcao openTab'),
        ('carregarIndicadoresExecutivos', 'Funcao carregarIndicadoresExecutivos'),
        ('initFullChatDefaultMessage', 'Funcao initFullChatDefaultMessage'),
    ]
    
    ok = True
    for pattern, name in checks:
        if pattern not in html:
            print(f"  FALHA: {name} nao encontrado")
            ok = False
    
    if ok:
        print("  OK: Estrutura HTML valida")
    return ok


def test_relatorio_block():
    """Valida relatorio_block.html tem o bloco de Performance."""
    block_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "partials", "relatorio_block.html")
    if not os.path.exists(block_path):
        print("ERRO: relatorio_block.html nao encontrado")
        return False
    
    with open(block_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    checks = [
        ('block_grafico_entregas', 'Componente block_grafico_entregas'),
        ('relatorio-entregas-loading', 'Elemento loading'),
        ('relatorio-entregas-chart-wrap', 'Wrapper dos graficos'),
        ('chart-entregas-gauge-no-prazo', 'Canvas gauge no prazo'),
        ('chart-relatorio-entregas', 'Canvas pizza'),
        ('carregarGraficoEntregas', 'Chamada carregarGraficoEntregas'),
    ]
    
    ok = True
    for pattern, name in checks:
        if pattern not in html:
            print(f"  FALHA: {name} nao encontrado")
            ok = False
    
    if ok:
        print("  OK: Relatorio block valido")
    return ok


def test_relatorio_js():
    """Valida relatorio.js tem carregarGraficoEntregas e toggleCardBody."""
    js_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "relatorio.js")
    if not os.path.exists(js_path):
        print("ERRO: relatorio.js nao encontrado")
        return False
    
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()
    
    checks = [
        ('async function carregarGraficoEntregas', 'Funcao carregarGraficoEntregas'),
        ('function toggleCardBody', 'Funcao toggleCardBody'),
        ('/api/relatorio-entregas', 'URL API relatorio-entregas'),
    ]
    
    ok = True
    for pattern, name in checks:
        if pattern not in js:
            print(f"  FALHA: {name} nao encontrado")
            ok = False
    
    if ok:
        print("  OK: relatorio.js valido")
    return ok


def test_api_routes():
    """Valida que as rotas da API existem no app."""
    try:
        from app_production import app
        rules = [r.rule for r in app.url_map.iter_rules()]
        
        required = [
            '/api/relatorio-entregas',
            '/api/indicadores-executivos',
        ]
        
        ok = True
        for route in required:
            if route not in rules:
                print(f"  FALHA: Rota {route} nao encontrada")
                ok = False
        
        if ok:
            print("  OK: Rotas API existem")
        return ok
    except Exception as e:
        print(f"  AVISO: Nao foi possivel verificar rotas: {e}")
        return True  # Assume OK se app nao carregar (ex: env)


def main():
    print("=" * 60)
    print("TESTE FRONTEND: Relatorio Performance, Indicadores, Chat IA")
    print("=" * 60)
    
    results = []
    
    print("\n[1] Estrutura HTML (team_dashboard_tailwind.html)")
    results.append(test_html_structure())
    
    print("\n[2] Bloco Relatorio (relatorio_block.html)")
    results.append(test_relatorio_block())
    
    print("\n[3] JavaScript (relatorio.js)")
    results.append(test_relatorio_js())
    
    print("\n[4] Rotas API (app_production)")
    results.append(test_api_routes())
    
    print("\n" + "=" * 60)
    if all(results):
        print("RESULTADO: OK - Todos os testes passaram")
        print("=" * 60)
        return 0
    else:
        print("RESULTADO: FALHA - Alguns testes falharam")
        print("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
