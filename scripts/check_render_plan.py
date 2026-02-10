#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script para verificar o plano e minutos de build do Render."""
import os
import sys
from pathlib import Path

# Configurar encoding UTF-8 para stdout no Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Adicionar diretório raiz ao path
BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))

# Carregar .env antes de importar requests
from dotenv import load_dotenv
load_dotenv(BASE_DIR / ".env")

import requests
import json

def check_render_plan():
    """Verifica o plano e minutos de build do Render."""
    api_key = os.getenv("RENDER_API_KEY", "").strip()
    if not api_key:
        print("ERRO: Defina RENDER_API_KEY no arquivo .env ou variaveis de ambiente.")
        print()
        print("Verifique se o arquivo .env existe e contem:")
        print("  RENDER_API_KEY=seu_token_aqui")
        return 1
    
    # Listar serviços para pegar o workspace
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }
    
    try:
        # Listar serviços usando a mesma lógica do render_update_env.py
        response = requests.get(
            "https://api.render.com/v1/services",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        raw = response.json()
        
        # Normalizar formato (pode vir como lista direta ou com wrapper)
        services_list = []
        if isinstance(raw, list):
            for item in raw:
                if isinstance(item, dict):
                    # Pode vir como {"service": {...}} ou diretamente {...}
                    if "service" in item:
                        services_list.append(item["service"])
                    else:
                        services_list.append(item)
        
        if not services_list:
            print("Nenhum servico encontrado.")
            print()
            print("Verifique se:")
            print("1. A RENDER_API_KEY esta correta")
            print("2. A API key tem permissao para listar servicos")
            print("3. Voce tem servicos criados no Render")
            return 0
        
        print("=" * 60)
        print("INFORMACOES DOS SERVICOS")
        print("=" * 60)
        print()
        
        for service in services_list:
            service_id = service.get("id")
            service_name = service.get("name", "N/A")
            service_type = service.get("type", "N/A")
            
            if not service_id:
                continue
            
            print(f"Servico: {service_name}")
            print(f"ID: {service_id}")
            print(f"Tipo: {service_type}")
            
            # Buscar detalhes do serviço
            try:
                detail_response = requests.get(
                    f"https://api.render.com/v1/services/{service_id}",
                    headers=headers,
                    timeout=10
                )
                
                if detail_response.status_code == 200:
                    details = detail_response.json()
                    # A resposta pode vir como {"service": {...}} ou diretamente {...}
                    service_details = details.get("service", details)
                    
                    # Informações do plano (pode estar em diferentes campos)
                    plan = (
                        service_details.get("plan") or 
                        service_details.get("serviceDetails", {}).get("plan") or
                        "N/A"
                    )
                    print(f"Plano do Servico: {plan}")
                    
                    # Owner (workspace)
                    owner_id = service_details.get("ownerId")
                    if owner_id:
                        print(f"Workspace ID: {owner_id}")
                        
                        # Tentar buscar informações do workspace para ver o plano
                        try:
                            workspace_response = requests.get(
                                f"https://api.render.com/v1/owners/{owner_id}",
                                headers=headers,
                                timeout=10
                            )
                            if workspace_response.status_code == 200:
                                workspace_data = workspace_response.json()
                                # Pode vir como {"owner": {...}} ou diretamente {...}
                                owner_info = workspace_data.get("owner", workspace_data)
                                workspace_name = owner_info.get("name", "N/A")
                                workspace_type = owner_info.get("type", "N/A")
                                print(f"Workspace: {workspace_name} ({workspace_type})")
                                
                                # Verificar se há informação de plano no workspace
                                workspace_plan = (
                                    owner_info.get("plan") or 
                                    owner_info.get("subscription", {}).get("plan") or
                                    owner_info.get("subscriptionTier") or
                                    "N/A (verifique manualmente)"
                                )
                                print(f"Plano do Workspace: {workspace_plan}")
                                
                                # Aviso se workspace não está em Standard
                                if workspace_plan and workspace_plan.lower() not in ["standard", "pro", "enterprise"]:
                                    print(f"[ATENCAO] Workspace em '{workspace_plan}' pode estar bloqueando builds!")
                        except Exception as e:
                            error_msg = str(e).encode('ascii', 'ignore').decode('ascii')
                            print(f"  (Nao foi possivel buscar detalhes do workspace: {error_msg})")
                    
                    # Status
                    suspended = service_details.get("suspendedAt")
                    if suspended:
                        print(f"Status: SUSPENSO (desde {suspended})")
                    else:
                        print(f"Status: Ativo")
                    
                    print()
                else:
                    print(f"  (Nao foi possivel buscar detalhes: HTTP {detail_response.status_code})")
                    print()
            except Exception as e:
                print(f"  (Erro ao buscar detalhes: {e})")
                print()
        
        print("=" * 60)
        print("DIAGNOSTICO E SOLUCOES")
        print("=" * 60)
        print()
        
        # Verificar se há problemas - buscar o plano real do serviço GeRot
        gerot_plan = None
        gerot_id = None
        for service in services_list:
            service_name = service.get("name", "")
            if service_name and "gerot" in service_name.lower():
                gerot_id = service.get("id")
                # Buscar detalhes completos do serviço GeRot
                try:
                    detail_resp = requests.get(
                        f"https://api.render.com/v1/services/{gerot_id}",
                        headers=headers,
                        timeout=10
                    )
                    if detail_resp.status_code == 200:
                        details = detail_resp.json()
                        service_details = details.get("service", details)
                        gerot_plan = (
                            service_details.get("plan") or 
                            service_details.get("serviceDetails", {}).get("plan") or
                            "N/A"
                        )
                except:
                    pass
                break
        
        if gerot_plan:
            print(f"[OK] Servico GeRot: {gerot_plan.upper()}")
            
            if gerot_plan.lower() not in ["standard", "pro", "enterprise"]:
                print()
                print("[PROBLEMA] O servico GeRot nao esta em Standard!")
                print()
                print("SOLUCAO:")
                print("1. Acesse: https://dashboard.render.com")
                print("2. Va para o servico 'GeRot'")
                print("3. Settings > Plan > Change Plan > Standard")
                print("4. Confirme a mudanca")
                print()
            else:
                print(f"[OK] Servico GeRot esta em {gerot_plan.upper()}")
                print()
        
        print("Se ainda mostra 'pipeline minutes exhausted':")
        print()
        print("[ATENCAO] O PROBLEMA PODE SER O PLANO DO WORKSPACE (nao do servico)!")
        print()
        print("SOLUCAO:")
        print("1. Acesse: https://dashboard.render.com/account")
        print("2. Vá para 'Billing' ou 'Plan'")
        print("3. Verifique o plano do WORKSPACE (nao do servico)")
        print("4. Se o workspace estiver em 'Free', atualize para 'Standard'")
        print("5. Aguarde 5-10 minutos para a atualização propagar")
        print("6. Tente fazer deploy novamente")
        print()
        print("NOTA: Mesmo que o servico esteja em Standard, se o workspace")
        print("      estiver em Free, os builds podem ser bloqueados.")
        print()
        
        return 0
        
    except requests.exceptions.RequestException as e:
        print(f"ERRO ao consultar API do Render: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                print(f"Detalhes: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Resposta: {e.response.text}")
        return 1
    except Exception as e:
        print(f"ERRO inesperado: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(check_render_plan())

