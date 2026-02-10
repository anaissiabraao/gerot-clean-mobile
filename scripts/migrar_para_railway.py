#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script para ajudar na migração do Render para Railway."""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

def main():
    print("=" * 60)
    print("Migracao: Render -> Railway")
    print("=" * 60)
    print()
    
    print("PASSO 1: Criar conta no Railway")
    print("  Acesse: https://railway.app")
    print("  Clique em 'Start a New Project'")
    print("  Conecte seu GitHub")
    print()
    
    print("PASSO 2: Criar projeto")
    print("  1. Selecione seu repositorio 'GeRot-1'")
    print("  2. Railway detecta automaticamente o Dockerfile")
    print("  3. Clique em 'Deploy Now'")
    print()
    
    print("PASSO 3: Criar PostgreSQL")
    print("  1. No projeto Railway, clique em '+ New'")
    print("  2. Selecione 'Database' -> 'PostgreSQL'")
    print("  3. Railway cria automaticamente")
    print("  4. Vá em 'Variables' e copie DATABASE_URL")
    print()
    
    print("PASSO 4: Configurar variaveis de ambiente")
    print()
    
    # Ler .env se existir
    env_file = BASE_DIR / ".env"
    if env_file.exists():
        print("Variaveis encontradas no .env:")
        print()
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key = line.split('=')[0].strip()
                    if key and key not in ['RENDER_API_KEY', 'RENDER_SERVICE_ID']:
                        print(f"  - {key}")
        print()
        print("Adicione todas essas variaveis no Railway:")
        print("  Projeto -> Variables -> Raw Editor")
        print()
    
    print("PASSO 5: Deploy automatico")
    print("  Railway faz deploy automaticamente a cada push")
    print("  Acompanhe em: https://railway.app")
    print()
    
    print("PASSO 6: Migrar banco de dados")
    print()
    print("Exportar do Render:")
    print("  pg_dump $DATABASE_URL_RENDER > backup.sql")
    print()
    print("Importar no Railway:")
    print("  psql $DATABASE_URL_RAILWAY < backup.sql")
    print()
    print("Ou use Railway CLI:")
    print("  railway run psql < backup.sql")
    print()
    
    print("=" * 60)
    print("Vantagens do Railway sobre Render:")
    print("=" * 60)
    print("  - Muito mais barato ($5-10/mes vs $25+/mes)")
    print("  - Sem limite de minutos de build")
    print("  - PostgreSQL incluido")
    print("  - Deploy automatico")
    print("  - Interface mais simples")
    print()
    
    print("Custo estimado Railway: $5-10/mes")
    print("Custo atual Render: $25+/mes (Standard)")
    print("Economia: ~$15-20/mes")
    print()

if __name__ == "__main__":
    main()

