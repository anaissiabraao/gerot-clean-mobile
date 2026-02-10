import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime, timedelta
import pandas as pd
import requests
import json
import os
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import threading
import random
import webbrowser

# Fonte única de verdade do catálogo (leve) — usada também pelo /agent.
# Mantemos o import aqui para remover duplicação (ex.: lista de clientes).
try:
    from automate.automation_catalog import BRUDAM_CLIENTS
except Exception:
    BRUDAM_CLIENTS = None  # type: ignore[assignment]  # fallback standalone

class BrudamAssistant:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Assistente IA - Sistema Brudam")
        self.root.geometry("700x800")
        self.root.resizable(True, True)
        
        # Definir tamanho mínimo para evitar interface muito pequena
        self.root.minsize(600, 700)
        
        # Configurações do sistema
        self.url = "https://azportoex.brudam.com.br/index.php"
        self.usuario = "SC.ABRAAO"
        self.senha = "Portoex@123"
        self.atalho = "376"
        self.whatsapp_number = "+554799129946"
        
        # Lista de clientes para busca (evitar duplicação: fonte única de verdade no catálogo do automate)
        self.clientes = BRUDAM_CLIENTS or [
            "SAMSONITE", "ITAPOA TERMINAIS PORTUARI", "FORTE", "ANSELL",
            "COMEXPORT", "MATTEL", "VENTUNO", "HERCULES", "LOJAS AVENIDA S.A",
            "BATIKI COM IMPORT EXPORT", "SEGER COMERCIAL IMPORTADO", "AC COMERCIAL",
            "BERTOLUCCI", "STRATUS COMERCIAL TEXTIL", "ITACORDA INDUSTRIA E COME",
            "SKO COMERCIO, IMPORTACAO", "BRAFT DO BRASIL IMPORTACA", "TECADI ARMAZENS GERAIS LT",
            "CLIF", "CKS INTERNATIONAL COMERCI", "BSG BIJOU BRASIL COMERCIO",
            "HGS GAS E AGUA DO BRASIL", "WINWIN TEXTILCOMERCIO E I", "TIMBRO",
            "GEO AGRI TECNOLOGIA AGRIC", "FOTON MOTOR DO BRASIL VEN", "FITA UP LTDA",
            "TOTALITY COMERCIO TECNICO", "MRCEGLIA IMPORTACAO E SER",
        ]
        
        # Driver do selenium
        self.driver = None
        self.is_running = False
        self.current_step = 0
        self.total_steps = 9
        self.start_time = None
        
        # Estatísticas
        self.stats = {
            'elementos_encontrados': 0,
            'dados_extraidos': 0,
            'arquivo_gerado': None,
            'dados_clientes': {}
        }
        
        # Mensagens de progresso
        self.progress_messages = [
            "Iniciando sistema...",
            "Conectando ao Brudam...",
            "Fazendo login...",
            "Navegando para janela 376...",
            "Preenchendo datas...",
            "Executando busca...",
            "Extraindo dados...",
            "Gerando planilha...",
            "Criando relatório HTML..."
        ]
        
        self.setup_ui()
        self.show_welcome_message()
        
    def setup_ui(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título com estilo melhorado
        title_frame = ttk.Frame(main_frame)
        title_frame.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        title_label = ttk.Label(title_frame, text="🤖 RPA - Sistema Brudam", 
                               font=("Arial", 18, "bold"))
        title_label.grid(row=0, column=0)
        
        # Subtítulo
        subtitle_label = ttk.Label(title_frame, text="Coleta Automática de Dados", 
                                  font=("Arial", 10), foreground="gray")
        subtitle_label.grid(row=1, column=0, pady=(5, 0))
        
        # Frame principal com duas colunas
        content_frame = ttk.Frame(main_frame)
        content_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 20))
        content_frame.columnconfigure(0, weight=2)
        content_frame.columnconfigure(1, weight=1)
        
        # Coluna esquerda - Controles
        left_frame = ttk.Frame(content_frame)
        left_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 10))
        
        # Seleção de datas
        date_frame = ttk.LabelFrame(left_frame, text="Seleção de Período", padding="10")
        date_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 20))
        
        # Data inicial
        ttk.Label(date_frame, text="Data Inicial:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.data_inicial = tk.StringVar(value=datetime.now().strftime("%d/%m/%Y"))
        data_inicial_entry = ttk.Entry(date_frame, textvariable=self.data_inicial, width=12)
        data_inicial_entry.grid(row=0, column=1, padx=(10, 0), pady=5)
        
        # Data final
        ttk.Label(date_frame, text="Data Final:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.data_final = tk.StringVar(value=datetime.now().strftime("%d/%m/%Y"))
        data_final_entry = ttk.Entry(date_frame, textvariable=self.data_final, width=12)
        data_final_entry.grid(row=1, column=1, padx=(10, 0), pady=5)
        
        # Botões de ação rápida
        quick_frame = ttk.Frame(date_frame)
        quick_frame.grid(row=2, column=0, columnspan=2, pady=10)
        
        ttk.Button(quick_frame, text="Hoje", command=self.set_today).grid(row=0, column=0, padx=5)
        ttk.Button(quick_frame, text="Ontem", command=self.set_yesterday).grid(row=0, column=1, padx=5)
        ttk.Button(quick_frame, text="Últimos 7 dias", command=self.set_last_week).grid(row=0, column=2, padx=5)
        
        # Configurações do WhatsApp
        whatsapp_frame = ttk.LabelFrame(left_frame, text="Configurações WhatsApp", padding="10")
        whatsapp_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 20))
        
        ttk.Label(whatsapp_frame, text="Número WhatsApp:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.whatsapp_num = tk.StringVar(value=self.whatsapp_number)
        whatsapp_entry = ttk.Entry(whatsapp_frame, textvariable=self.whatsapp_num, width=20)
        whatsapp_entry.grid(row=0, column=1, padx=(10, 0), pady=5)
        
        # Botões principais
        button_frame = ttk.Frame(left_frame)
        button_frame.grid(row=2, column=0, pady=20)
        
        self.start_button = ttk.Button(button_frame, text="Iniciar Busca Completa", 
                                      command=self.start_complete_search, style="Accent.TButton")
        self.start_button.grid(row=0, column=0, padx=5)
        
        self.background_button = ttk.Button(button_frame, text="🔄 Busca em 2º Plano", 
                                           command=self.start_background_search, style="Accent.TButton")
        self.background_button.grid(row=0, column=1, padx=5)
        
        self.stop_button = ttk.Button(button_frame, text="Parar", 
                                     command=self.stop_search, state="disabled")
        self.stop_button.grid(row=0, column=2, padx=5)
        
        # Coluna direita - Janela de Progresso em Tempo Real
        right_frame = ttk.LabelFrame(content_frame, text="🔄 Execução em Tempo Real", padding="10")
        right_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status atual
        self.current_status_label = ttk.Label(right_frame, text="⏸️ Aguardando início...", 
                                            font=("Arial", 12, "bold"), foreground="blue")
        self.current_status_label.grid(row=0, column=0, pady=(0, 10), sticky=tk.W)
        
        # Barra de progresso principal
        self.progress = ttk.Progressbar(right_frame, mode='determinate', length=200)
        self.progress.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Label de progresso
        self.progress_label = ttk.Label(right_frame, text="0% - Pronto para iniciar", 
                                      font=("Arial", 9), foreground="blue")
        self.progress_label.grid(row=2, column=0, sticky=tk.W, pady=(0, 10))
        
        # Lista de etapas com status
        steps_frame = ttk.Frame(right_frame)
        steps_frame.grid(row=3, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Criar lista de etapas
        self.steps = [
            "🔧 Configurando navegador",
            "🌐 Conectando ao Brudam", 
            "🔑 Fazendo login",
            "📋 Navegando para janela 376",
            "📅 Preenchendo datas",
            "🔍 Executando busca",
            "📊 Extraindo dados",
            "📄 Gerando planilha Excel",
            "📈 Criando relatório HTML"
        ]
        
        self.step_labels = []
        self.step_status = []
        
        for i, step in enumerate(self.steps):
            # Status da etapa
            status_frame = ttk.Frame(steps_frame)
            status_frame.grid(row=i, column=0, sticky=(tk.W, tk.E), pady=2)
            
            # Ícone de status
            status_icon = ttk.Label(status_frame, text="⏳", font=("Arial", 10))
            status_icon.grid(row=0, column=0, padx=(0, 5))
            self.step_status.append(status_icon)
            
            # Texto da etapa
            step_label = ttk.Label(status_frame, text=step, font=("Arial", 9))
            step_label.grid(row=0, column=1, sticky=tk.W)
            self.step_labels.append(step_label)
        
        # Estatísticas em tempo real
        stats_frame = ttk.LabelFrame(right_frame, text="📈 Estatísticas", padding="5")
        stats_frame.grid(row=4, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        self.stats_labels = {
            'tempo_decorrido': ttk.Label(stats_frame, text="⏱️ Tempo: 00:00", font=("Arial", 8)),
            'elementos_encontrados': ttk.Label(stats_frame, text="🔍 Elementos: 0", font=("Arial", 8)),
            'dados_extraidos': ttk.Label(stats_frame, text="📊 Dados: 0", font=("Arial", 8)),
            'arquivo_gerado': ttk.Label(stats_frame, text="📁 Arquivo: Nenhum", font=("Arial", 8))
        }
        
        for i, (key, label) in enumerate(self.stats_labels.items()):
            label.grid(row=i, column=0, sticky=tk.W, pady=1)
        
        # Log de status (menor)
        log_frame = ttk.LabelFrame(main_frame, text="📝 Log de Atividades", padding="10")
        log_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        self.log_text = tk.Text(log_frame, height=6, width=70)
        scrollbar = ttk.Scrollbar(log_frame, orient="vertical", command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        # Configurar grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(2, weight=1)
        content_frame.rowconfigure(0, weight=1)
        left_frame.columnconfigure(0, weight=1)
        right_frame.columnconfigure(0, weight=1)
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        steps_frame.columnconfigure(0, weight=1)
        stats_frame.columnconfigure(0, weight=1)
        
    def show_welcome_message(self):
        """Exibe mensagem de boas-vindas"""
        welcome_msg = "Olá Brenda!"
        self.log_message(welcome_msg)
        
    def log_message(self, message, level="INFO"):
        """Adiciona mensagem ao log com diferentes níveis"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        # Cores para diferentes níveis
        colors = {
            "INFO": "black",
            "SUCCESS": "green", 
            "WARNING": "orange",
            "ERROR": "red",
            "PROGRESS": "blue"
        }
        
        # Adicionar emoji baseado no nível
        emojis = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARNING": "⚠️", 
            "ERROR": "❌",
            "PROGRESS": "🔄"
        }
        
        emoji = emojis.get(level, "ℹ️")
        color = colors.get(level, "black")
        
        self.log_text.insert(tk.END, f"[{timestamp}] {emoji} {message}\n")
        self.log_text.see(tk.END)
        self.root.update()
        
    def update_progress(self, step, message=""):
        """Atualiza barra de progresso e status"""
        self.current_step = step
        progress_value = (step / self.total_steps) * 100
        
        # Atualizar barra de progresso
        self.progress['value'] = progress_value
        
        # Atualizar label de progresso
        self.progress_label.config(text=f"{progress_value:.0f}% - {message}")
        
        # Atualizar status atual
        if message:
            self.current_status_label.config(text=f"🔄 {message}")
            self.log_message(message, "PROGRESS")
        
        # Atualizar ícones das etapas
        for i in range(len(self.step_status)):
            if i < step:
                self.step_status[i].config(text="✅", foreground="green")
            elif i == step:
                self.step_status[i].config(text="🔄", foreground="blue")
            else:
                self.step_status[i].config(text="⏳", foreground="gray")
        
        # Atualizar estatísticas de tempo
        if self.start_time:
            elapsed = datetime.now() - self.start_time
            minutes, seconds = divmod(elapsed.total_seconds(), 60)
            self.stats_labels['tempo_decorrido'].config(
                text=f"⏱️ Tempo: {int(minutes):02d}:{int(seconds):02d}"
            )
        
        # Atualizar outras estatísticas
        self.stats_labels['elementos_encontrados'].config(
            text=f"🔍 Elementos: {self.stats['elementos_encontrados']}"
        )
        self.stats_labels['dados_extraidos'].config(
            text=f"📊 Dados: {self.stats['dados_extraidos']}"
        )
        
        if self.stats['arquivo_gerado']:
            filename = os.path.basename(self.stats['arquivo_gerado'])
            self.stats_labels['arquivo_gerado'].config(
                text=f"📁 Arquivo: {filename}"
            )
        
        self.root.update()
        
    def ask_whatsapp_send(self, filepath):
        """Pergunta se deseja enviar via WhatsApp"""
        self.log_message("📱 Deseja que envie os dados pro seu WhatsApp?", "INFO")
        
        # Criar janela de confirmação
        result = messagebox.askyesno(
            "Envio WhatsApp", 
            f"Deseja que envie os dados pro seu WhatsApp?\n\nArquivo: {os.path.basename(filepath)}\nNúmero: {self.whatsapp_number}",
            icon='question'
        )
        
        if result:
            self.log_message("✅ Confirmado! Enviando via WhatsApp...", "SUCCESS")
            return self.send_whatsapp(filepath)
        else:
            self.log_message("❌ Envio cancelado pelo usuário", "WARNING")
            return False
        
    def set_today(self):
        """Define datas para hoje"""
        today = datetime.now().strftime("%d/%m/%Y")
        self.data_inicial.set(today)
        self.data_final.set(today)
        
    def set_yesterday(self):
        """Define datas para ontem"""
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%d/%m/%Y")
        self.data_inicial.set(yesterday)
        self.data_final.set(yesterday)
        
    def set_last_week(self):
        """Define datas para últimos 7 dias"""
        today = datetime.now()
        week_ago = today - timedelta(days=7)
        self.data_inicial.set(week_ago.strftime("%d/%m/%Y"))
        self.data_final.set(today.strftime("%d/%m/%Y"))
        
    def close_popups(self):
        """Fecha pop-ups que possam aparecer"""
        try:
            self.log_message("🔍 Verificando pop-ups...", "PROGRESS")
            
            # Aguardar um pouco para pop-ups aparecerem (reduzido para velocidade)
            time.sleep(1)
            
            # Lista de seletores comuns para pop-ups
            popup_selectors = [
                "button[class*='close']",
                "button[class*='fechar']",
                "button[class*='cancel']",
                "button[class*='ok']",
                "button[class*='aceitar']",
                "button[class*='confirm']",
                ".close",
                ".fechar",
                ".popup-close",
                ".modal-close",
                "[aria-label*='close']",
                "[aria-label*='fechar']",
                "input[type='button'][value*='OK']",
                "input[type='button'][value*='Fechar']",
                "input[type='button'][value*='Cancelar']"
            ]
            
            popups_fechados = 0
            
            for selector in popup_selectors:
                try:
                    popup_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in popup_elements:
                        try:
                            if element.is_displayed() and element.is_enabled():
                                element.click()
                                self.log_message(f"✅ Pop-up fechado: {selector}", "SUCCESS")
                                popups_fechados += 1
                                time.sleep(0.2)
                        except Exception as e:
                            continue
                except Exception as e:
                    continue
            
            # Tentar fechar por tecla ESC
            try:
                from selenium.webdriver.common.keys import Keys
                self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                self.log_message("✅ Tentativa de fechar pop-up com ESC", "SUCCESS")
                time.sleep(0.5)
            except Exception as e:
                pass
            
            if popups_fechados > 0:
                self.log_message(f"📊 Total de pop-ups fechados: {popups_fechados}", "INFO")
            else:
                self.log_message("ℹ️ Nenhum pop-up encontrado", "INFO")
                
            return True
            
        except Exception as e:
            self.log_message(f"⚠️ Erro ao fechar pop-ups: {str(e)}", "WARNING")
            return True  # Continuar mesmo com erro

    def close_search_popup(self):
        """Fecha pop-up específico que aparece após busca"""
        try:
            self.log_message("🔍 Verificando pop-up de busca...", "PROGRESS")
            
            # Aguardar um pouco para o pop-up aparecer
            time.sleep(2)
            
            # Seletores específicos para o pop-up de busca
            popup_selectors = [
                "button.ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close",
                "button[title='Close']",
                ".ui-dialog-titlebar-close",
                ".ui-icon-closethick",
                "button.ui-button[title='Close']",
                "span.ui-icon-closethick"
            ]
            
            popup_fechado = False
            
            for selector in popup_selectors:
                try:
                    popup_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in popup_elements:
                        try:
                            if element.is_displayed() and element.is_enabled():
                                element.click()
                                self.log_message(f"✅ Pop-up de busca fechado: {selector}", "SUCCESS")
                                popup_fechado = True
                                time.sleep(1)
                                break
                        except Exception as e:
                            continue
                    
                    if popup_fechado:
                        break
                        
                except Exception as e:
                    continue
            
            # Tentar fechar por tecla ESC se não encontrou o botão
            if not popup_fechado:
                try:
                    from selenium.webdriver.common.keys import Keys
                    self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                    self.log_message("✅ Tentativa de fechar pop-up com ESC", "SUCCESS")
                    time.sleep(1)
                except Exception as e:
                    pass
            
            if not popup_fechado:
                self.log_message("ℹ️ Nenhum pop-up de busca encontrado", "INFO")
                
            return True
            
        except Exception as e:
            self.log_message(f"⚠️ Erro ao fechar pop-up de busca: {str(e)}", "WARNING")
            return True  # Continuar mesmo com erro

    def setup_driver(self):
        """Configura o driver do Chrome"""
        self.update_progress(1, "Iniciando sistema...")
        
        try:
            self.log_message("🔧 Configurando navegador Chrome...", "PROGRESS")
            
            chrome_options = Options()
            
            # Configurações básicas do Chrome - otimizadas para velocidade
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--start-maximized")
            
            # Configurações para velocidade máxima
            chrome_options.add_argument("--disable-extensions")
            chrome_options.add_argument("--disable-plugins")
            chrome_options.add_argument("--disable-images")
            chrome_options.add_argument("--disable-web-security")
            chrome_options.add_argument("--disable-features=VizDisplayCompositor")
            chrome_options.add_argument("--disable-background-timer-throttling")
            chrome_options.add_argument("--disable-backgrounding-occluded-windows")
            chrome_options.add_argument("--disable-renderer-backgrounding")
            chrome_options.add_argument("--disable-background-networking")
            chrome_options.add_argument("--aggressive-cache-discard")
            chrome_options.add_argument("--memory-pressure-off")
            
            # Configurações para evitar detecção de automação
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # User agent para parecer mais humano
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            self.log_message("🔧 Criando instância do Chrome...", "PROGRESS")
            
            # Tentar criar o driver
            self.driver = webdriver.Chrome(options=chrome_options)
            
            self.log_message("✅ Driver criado com sucesso!", "SUCCESS")
            
            # Configurar timeouts otimizados para estabilidade
            self.driver.implicitly_wait(5)
            self.driver.set_page_load_timeout(30)
            
            self.log_message("🔧 Configurando timeouts...", "PROGRESS")
            
            # Executar script para ocultar automação
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            self.log_message("✅ Navegador configurado com sucesso!", "SUCCESS")
            self.log_message(f"🌐 URL atual: {self.driver.current_url}", "INFO")
            
            return True
            
        except Exception as e:
            self.log_message(f"❌ Erro ao configurar driver: {str(e)}", "ERROR")
            import traceback
            self.log_message(f"📋 Detalhes do erro: {traceback.format_exc()}", "ERROR")
            return False
            
    def login_brudam(self):
        """Realiza login no sistema Brudam"""
        try:
            self.update_progress(2, "Conectando ao Brudam...")
            self.log_message("Acessando sistema Brudam...", "PROGRESS")
            try:
                self.driver.get(self.url)
                self.log_message(f"✅ URL acessada: {self.url}", "SUCCESS")
            except Exception as e:
                self.log_message(f"❌ Erro ao acessar URL: {str(e)}", "ERROR")
                return False
            
            # Aguardar carregamento da página (timeout aumentado para estabilidade)
            self.log_message("Aguardando carregamento da página...", "PROGRESS")
            try:
                WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.ID, "user"))
                )
                self.log_message("✅ Página de login carregada com sucesso", "SUCCESS")
            except TimeoutException:
                self.log_message("⚠️ Timeout na página de login, tentando aguardar mais...", "WARNING")
                time.sleep(5)
                try:
                    WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.ID, "user"))
                    )
                    self.log_message("✅ Página de login carregada após retry", "SUCCESS")
                except TimeoutException:
                    self.log_message("❌ Falha definitiva no carregamento da página", "ERROR")
                    return False
            
            self.log_message("Preenchendo credenciais...", "PROGRESS")
            
            # Preencher usuário
            user_field = self.driver.find_element(By.ID, "user")
            user_field.clear()
            user_field.send_keys(self.usuario)
            self.log_message(f"✅ Usuário preenchido: {self.usuario}", "SUCCESS")
            
            # Preencher senha
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(self.senha)
            self.log_message("✅ Senha preenchida", "SUCCESS")
            
            # Pressionar Enter para fazer login
            self.log_message("⏎ Pressionando Enter para fazer login...", "PROGRESS")
            password_field.send_keys("\n")
            
            # Aguardar redirecionamento (otimizado para estabilidade)
            self.log_message("⏳ Aguardando redirecionamento...", "PROGRESS")
            time.sleep(3)
            
            # Verificar se o login foi bem-sucedido
            current_url = self.driver.current_url
            self.log_message(f"📍 URL após login: {current_url}", "INFO")
            
            if "index.php" not in current_url or "login" not in current_url.lower():
                self.log_message("🎉 Login realizado com sucesso!", "SUCCESS")
                return True
            else:
                self.log_message("⚠️ Login pode ter falhado - ainda na página de login", "WARNING")
                return True  # Continuar mesmo assim
            
        except TimeoutException:
            self.log_message("❌ Timeout ao carregar página de login", "ERROR")
            return False
        except Exception as e:
            self.log_message(f"❌ Erro no login: {str(e)}", "ERROR")
            return False
            
    def navigate_to_window_376(self):
        """Navega para a janela 376"""
        try:
            self.update_progress(3, "Fazendo login...")
            self.log_message("Navegando para janela 376...", "PROGRESS")
            
            # Aguardar um pouco para a página carregar completamente (otimizado)
            time.sleep(0.3)
            
            # Verificar se estamos na página correta
            current_url = self.driver.current_url
            self.log_message(f"URL atual: {current_url}", "INFO")
            
            # Procurar campo de atalho com diferentes seletores
            atalho_field = None
            
            # Primeiro tentar por ID (mais específico) - timeout otimizado
            try:
                atalho_field = WebDriverWait(self.driver, 2).until(
                    EC.element_to_be_clickable((By.ID, "codigo_opcao"))
                )
                self.log_message("✅ Campo de atalho encontrado por ID 'codigo_opcao'", "SUCCESS")
            except TimeoutException:
                self.log_message("❌ Campo não encontrado por ID, tentando outros métodos...", "WARNING")
                
                # Tentar por classe
                try:
                    atalho_field = self.driver.find_element(By.CLASS_NAME, "classIMPUT2")
                    self.log_message("✅ Campo de atalho encontrado por classe 'classIMPUT2'", "SUCCESS")
                except NoSuchElementException:
                    try:
                        # Tentar por placeholder
                        atalho_field = self.driver.find_element(By.XPATH, "//input[@placeholder='Atalho']")
                        self.log_message("✅ Campo de atalho encontrado por placeholder 'Atalho'", "SUCCESS")
                    except NoSuchElementException:
                        try:
                            # Tentar por name
                            atalho_field = self.driver.find_element(By.NAME, "codigo_opcao")
                            self.log_message("✅ Campo de atalho encontrado por name 'codigo_opcao'", "SUCCESS")
                        except NoSuchElementException:
                            self.log_message("❌ Campo de atalho não encontrado por nenhum método", "ERROR")
                            return False
            
            if atalho_field:
                self.log_message("🔄 Preenchendo código 376...", "PROGRESS")
                
                # Focar no campo primeiro
                atalho_field.click()
                time.sleep(0.2)
                
                # Limpar campo
                atalho_field.clear()
                time.sleep(0.1)
                
                # Preencher com 376
                atalho_field.send_keys(self.atalho)
                self.log_message(f"📝 Código '{self.atalho}' inserido", "SUCCESS")
                
                # Aguardar um pouco antes de pressionar Enter
                time.sleep(0.2)
                
                # Pressionar Enter
                atalho_field.send_keys("\n")
                self.log_message("⏎ Enter pressionado", "PROGRESS")
                
                # Aguardar carregamento da janela (otimizado para velocidade máxima)
                self.log_message("⏳ Aguardando carregamento da janela 376...", "PROGRESS")
                time.sleep(1)
                
                # Verificar se a página mudou ou se há elementos da janela 376
                try:
                    # Aguardar mudança na URL ou elementos específicos (timeout otimizado)
                    WebDriverWait(self.driver, 3).until(
                        EC.any_of(
                            EC.presence_of_element_located((By.CSS_SELECTOR, "input.brd-data")),
                            EC.presence_of_element_located((By.CSS_SELECTOR, "input[value='PESQUISAR']")),
                            EC.presence_of_element_located((By.ID, "contents")),
                            EC.presence_of_element_located((By.CSS_SELECTOR, "input.brd-input-submit-required"))
                        )
                    )
                    self.log_message("🎉 Janela 376 carregada com sucesso!", "SUCCESS")
                    return True
                except TimeoutException:
                    # Verificar se ainda estamos na mesma página
                    new_url = self.driver.current_url
                    if new_url != current_url:
                        self.log_message("✅ URL mudou - janela pode ter carregado", "SUCCESS")
                        return True
                    else:
                        self.log_message("⚠️ Janela 376 pode não ter carregado completamente", "WARNING")
                        return True  # Continuar mesmo assim
            else:
                self.log_message("❌ Não foi possível encontrar o campo de atalho", "ERROR")
                return False
            
        except Exception as e:
            self.log_message(f"❌ Erro ao navegar para janela 376: {str(e)}", "ERROR")
            return False
            
    def fill_dates_and_search(self):
        """Preenche as datas e executa a busca"""
        try:
            self.update_progress(4, "Navegando para janela 376...")
            self.log_message("🔍 Procurando campos de data...", "PROGRESS")
            
            # Aguardar um pouco para a página carregar (reduzido)
            time.sleep(1)
            
            # Primeiro: Selecionar serviços necessários
            self.log_message("🔧 Selecionando serviços...", "PROGRESS")
            
            # Tentar clicar no botão de serviços
            servicos_btn_encontrado = False
            try:
                # Aguardar o botão estar disponível (timeout reduzido)
                servicos_btn = WebDriverWait(self.driver, 8).until(
                    EC.element_to_be_clickable((By.ID, "selecionaServico"))
                )
                self.log_message("✅ Botão 'Serviços' encontrado", "SUCCESS")
                
                # Fazer scroll para o botão se necessário
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", servicos_btn)
                time.sleep(1)
                
                # Clicar no botão
                servicos_btn.click()
                self.log_message("✅ Botão 'Serviços' clicado", "SUCCESS")
                servicos_btn_encontrado = True
                
                # Aguardar o menu abrir (reduzido)
                time.sleep(1)
                
            except (TimeoutException, NoSuchElementException) as e:
                self.log_message(f"⚠️ Botão 'Serviços' não encontrado: {str(e)}", "WARNING")
                # Tentar continuar mesmo sem o botão de serviços
                servicos_btn_encontrado = False
            
            # Lista de serviços para selecionar
            servicos_alvos = [
                {"id": "servicos_0", "text": "EXPRESSO_250"},
                {"id": "servicos_2", "text": "ECONOMICO_250"},
                {"id": "servicos_6", "text": "SUBCONTRATO_ECONOMICO"},
                {"id": "servicos_7", "text": "SUBCONTRATO_EXPRESSO"},
                {"id": "servicos_8", "text": "SUBCONTRATO_PERSONALIZADO"},
                {"id": "servicos_9", "text": "PERSONALIZADO"},
                {"id": "servicos_10", "text": "EXPRESSO_200"},
            ]
            
            servicos_selecionados = 0
            for item in servicos_alvos:
                try:
                    self.log_message(f"🔍 Procurando serviço: {item['text']} (ID: {item['id']})", "INFO")
                    
                    # Tentar encontrar o checkbox
                    checkbox = self.driver.find_element(By.ID, item["id"])
                    self.log_message(f"✅ Checkbox encontrado: {item['id']}", "SUCCESS")
                    
                    # Verificar se já está selecionado
                    if checkbox.is_selected():
                        self.log_message(f"ℹ️ Serviço já estava selecionado: {item['text']}", "INFO")
                        servicos_selecionados += 1
                    else:
                        # Tentar clicar no checkbox diretamente
                        try:
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox)
                            time.sleep(0.5)
                            checkbox.click()
                            self.log_message(f"✅ Serviço selecionado via checkbox: {item['text']}", "SUCCESS")
                            servicos_selecionados += 1
                        except Exception as e:
                            # Se não conseguir clicar no checkbox, tentar no label
                            try:
                                label_el = self.driver.find_element(By.XPATH, f"//label[@for='{item['id']}']")
                                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", label_el)
                                time.sleep(0.5)
                                label_el.click()
                                self.log_message(f"✅ Serviço selecionado via label: {item['text']}", "SUCCESS")
                                servicos_selecionados += 1
                            except Exception as e2:
                                self.log_message(f"⚠️ Erro ao selecionar serviço {item['text']}: {str(e2)}", "WARNING")
                    
                    time.sleep(0.5)
                    
                except NoSuchElementException:
                    self.log_message(f"⚠️ Serviço não encontrado: {item['text']} (ID: {item['id']})", "WARNING")
                    continue
                except Exception as e:
                    self.log_message(f"⚠️ Erro geral ao processar serviço {item['text']}: {str(e)}", "WARNING")
                    continue
            
            self.log_message(f"📊 Total de serviços selecionados: {servicos_selecionados} de {len(servicos_alvos)}", "INFO")
            
            # Aguardar um pouco após selecionar os serviços (reduzido)
            time.sleep(1)
            
            # Agora sim, procurar campos de data com diferentes seletores
            data_fields = []
            
            # Tentar por classe brd-data primeiro (mais específico)
            try:
                data_fields = self.driver.find_elements(By.CSS_SELECTOR, "input.brd-data")
                if data_fields:
                    self.log_message(f"✅ Encontrados {len(data_fields)} campos por classe 'brd-data'", "SUCCESS")
                    self.stats['elementos_encontrados'] += len(data_fields)
            except NoSuchElementException:
                pass
            
            # Se não encontrou, tentar por outros seletores
            if not data_fields:
                try:
                    # Tentar por IDs que começam com dp (como mencionado: dp1757512103285, dp1757512103286)
                    data_fields = self.driver.find_elements(By.XPATH, "//input[starts-with(@id, 'dp')]")
                    if data_fields:
                        self.log_message(f"✅ Encontrados {len(data_fields)} campos por ID 'dp'", "SUCCESS")
                        self.stats['elementos_encontrados'] += len(data_fields)
                except NoSuchElementException:
                    pass
            
            if not data_fields:
                try:
                    # Tentar por classe brd-input-submit-required brd-data
                    data_fields = self.driver.find_elements(By.CSS_SELECTOR, "input.brd-input-submit-required.brd-data")
                    if data_fields:
                        self.log_message(f"✅ Encontrados {len(data_fields)} campos por classe combinada", "SUCCESS")
                        self.stats['elementos_encontrados'] += len(data_fields)
                except NoSuchElementException:
                    pass
            
            if not data_fields:
                try:
                    # Tentar por campos de data genéricos
                    data_fields = self.driver.find_elements(By.XPATH, "//input[@type='text' and contains(@class, 'data')]")
                    if data_fields:
                        self.log_message(f"✅ Encontrados {len(data_fields)} campos por classe 'data'", "SUCCESS")
                        self.stats['elementos_encontrados'] += len(data_fields)
                except NoSuchElementException:
                    pass
            
            if len(data_fields) >= 2:
                self.log_message("📅 Preenchendo datas...", "PROGRESS")
                
                # Data inicial
                data_fields[0].clear()
                data_fields[0].send_keys(self.data_inicial.get())
                self.log_message(f"📝 Data inicial: {self.data_inicial.get()}", "INFO")
                
                # Data final
                data_fields[1].clear()
                data_fields[1].send_keys(self.data_final.get())
                self.log_message(f"📝 Data final: {self.data_final.get()}", "INFO")
                
                self.log_message("✅ Datas preenchidas!", "SUCCESS")
                
                # Procurar botão de pesquisa
                self.update_progress(5, "Preenchendo datas...")
                search_button = None
                
                try:
                    search_button = self.driver.find_element(By.CSS_SELECTOR, "input[value='PESQUISAR']")
                    self.log_message("✅ Botão 'PESQUISAR' encontrado", "SUCCESS")
                    self.stats['elementos_encontrados'] += 1
                except NoSuchElementException:
                    try:
                        search_button = self.driver.find_element(By.XPATH, "//input[@value='Pesquisar']")
                        self.log_message("✅ Botão 'Pesquisar' encontrado", "SUCCESS")
                        self.stats['elementos_encontrados'] += 1
                    except NoSuchElementException:
                        try:
                            search_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Pesquisar')]")
                            self.log_message("✅ Botão de pesquisa encontrado", "SUCCESS")
                            self.stats['elementos_encontrados'] += 1
                        except NoSuchElementException:
                            try:
                                # Tentar por classe brd-button
                                search_button = self.driver.find_element(By.CSS_SELECTOR, "input.brd-button")
                                self.log_message("✅ Botão encontrado por classe 'brd-button'", "SUCCESS")
                                self.stats['elementos_encontrados'] += 1
                            except NoSuchElementException:
                                self.log_message("❌ Botão de pesquisa não encontrado", "ERROR")
                                return False
                
                if search_button:
                    self.log_message("🔍 Executando busca...", "PROGRESS")
                    search_button.click()
                    
                    # Aguardar carregamento dos resultados (reduzido)
                    time.sleep(2)
                    
                    # Fechar pop-up que pode aparecer após a busca
                    self.close_search_popup()
                    
                    self.log_message("✅ Busca executada!", "SUCCESS")
                    return True
                else:
                    return False
            else:
                self.log_message(f"❌ Apenas {len(data_fields)} campos de data encontrados (necessário 2)", "ERROR")
                
                # Log de debug - mostrar todos os inputs encontrados
                all_inputs = self.driver.find_elements(By.TAG_NAME, "input")
                self.log_message(f"🔍 Debug: {len(all_inputs)} inputs encontrados na página", "INFO")
                self.stats['elementos_encontrados'] = len(all_inputs)
                
                for i, inp in enumerate(all_inputs[:10]):  # Mostrar apenas os primeiros 10
                    try:
                        inp_id = inp.get_attribute("id") or "sem-id"
                        inp_class = inp.get_attribute("class") or "sem-classe"
                        inp_type = inp.get_attribute("type") or "sem-tipo"
                        self.log_message(f"   Input {i+1}: id='{inp_id}', class='{inp_class}', type='{inp_type}'", "INFO")
                    except:
                        pass
                
                return False
                
        except Exception as e:
            self.log_message(f"❌ Erro ao preencher datas: {str(e)}", "ERROR")
            return False
            
    def extract_table_data(self):
        """Extrai dados da tabela de resultados"""
        try:
            self.update_progress(6, "Executando busca...")
            self.log_message("Extraindo dados da tabela...", "PROGRESS")
            
            # Aguardar carregamento da tabela (timeout reduzido)
            WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.ID, "contents"))
            )
            
            # Fechar pop-up que pode aparecer após extrair dados
            self.close_search_popup()
            
            # Encontrar tabela de resumo
            summary_table = self.driver.find_element(By.ID, "brdtotais")
            rows = summary_table.find_elements(By.TAG_NAME, "tr")
            
            data = []
            for row in rows[1:]:  # Pular cabeçalho
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 4:
                    categoria = cells[0].text.strip()
                    em_aberto = cells[1].text.strip()
                    entregues = cells[2].text.strip()
                    total = cells[3].text.strip()
                    
                    data.append({
                        'Categoria': categoria,
                        'Em Aberto': em_aberto,
                        'Entregues': entregues,
                        'Total': total
                    })
            
            self.stats['dados_extraidos'] = len(data)
            self.log_message(f"Dados extraídos: {len(data)} categorias encontradas", "SUCCESS")
            
            return data
            
        except Exception as e:
            self.log_message(f"Erro ao extrair dados: {str(e)}", "ERROR")
            return []
            
    def generate_excel_report(self, data):
        """Gera relatório em Excel"""
        try:
            self.update_progress(7, "Extraindo dados...")
            self.log_message("Gerando relatório Excel...", "PROGRESS")
            
            # Criar DataFrame
            df = pd.DataFrame(data)
            
            # Filtrar dados principais
            df_principais = df[df['Categoria'].isin(['DENTRO DO PRAZO', 'FORA DO PRAZO'])]
            
            # Salvar arquivo
            filename = f"relatorio_brudam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            filepath = os.path.join(os.getcwd(), filename)
            
            with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
                # Planilha com todos os dados
                df.to_excel(writer, sheet_name='Todos os Dados', index=False)
                
                # Planilha com dados principais
                df_principais.to_excel(writer, sheet_name='Dados Principais', index=False)
            
            self.stats['arquivo_gerado'] = filepath
            self.log_message(f"Relatório Excel salvo: {filename}", "SUCCESS")
            
            return filepath
            
        except Exception as e:
            self.log_message(f"Erro ao gerar Excel: {str(e)}", "ERROR")
            return None
    
    def generate_html_report(self, data):
        """Gera relatório HTML com gráficos CSS"""
        try:
            print("🔍 [TERMINAL] Iniciando generate_html_report")
            self.log_message("🔍 Iniciando geração do HTML...", "INFO")
            self.log_message("Gerando relatório HTML com gráficos...", "PROGRESS")
            
            # Verificar se há dados
            print(f"🔍 [TERMINAL] Dados recebidos: {len(data) if data else 0} registros")
            if not data:
                print("❌ [TERMINAL] Nenhum dado encontrado")
                self.log_message("❌ Nenhum dado encontrado para gerar relatório HTML", "ERROR")
                return None
            
            # Criar DataFrame
            print("🔍 [TERMINAL] Criando DataFrame")
            df = pd.DataFrame(data)
            
            # Calcular estatísticas
            print("🔍 [TERMINAL] Calculando estatísticas")
            
            # Função para limpar e converter valores
            def clean_value(value):
                try:
                    # Remover caracteres especiais e extrair apenas números
                    clean_val = str(value).replace('.', '').replace(',', '.').replace('(', '').replace(')', '').replace('%', '')
                    # Pegar apenas o primeiro número antes de qualquer espaço
                    clean_val = clean_val.split()[0] if clean_val.split() else '0'
                    return float(clean_val)
                except:
                    return 0.0
            
            total_em_aberto = df['Em Aberto'].apply(clean_value).sum()
            total_entregues = df['Entregues'].apply(clean_value).sum()
            total_geral = df['Total'].apply(clean_value).sum()
            print(f"🔍 [TERMINAL] Estatísticas: Em Aberto={total_em_aberto}, Entregues={total_entregues}, Total={total_geral}")
            
            # Dados para gráficos
            categorias = df['Categoria'].tolist()
            em_aberto_values = df['Em Aberto'].apply(clean_value).tolist()
            entregues_values = df['Entregues'].apply(clean_value).tolist()
            
            # Encontrar valores máximos para normalização dos gráficos
            max_em_aberto = max(em_aberto_values) if em_aberto_values else 1
            max_entregues = max(entregues_values) if entregues_values else 1
            
            # Gerar HTML
            html_content = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Brudam - {datetime.now().strftime('%d/%m/%Y')}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }}
        
        .stat-card {{
            background: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }}
        
        .stat-card:hover {{
            transform: translateY(-5px);
        }}
        
        .stat-number {{
            font-size: 2.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }}
        
        .stat-label {{
            color: #7f8c8d;
            font-size: 1.1em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .charts-section {{
            padding: 30px;
        }}
        
        .chart-container {{
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }}
        
        .chart-title {{
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }}
        
        .bar-chart {{
            display: flex;
            align-items: end;
            height: 300px;
            gap: 10px;
            padding: 20px 0;
        }}
        
        .bar {{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }}
        
        .bar-fill {{
            width: 100%;
            border-radius: 5px 5px 0 0;
            transition: all 0.3s ease;
            position: relative;
            min-height: 20px;
        }}
        
        .bar-fill:hover {{
            opacity: 0.8;
            transform: scale(1.02);
        }}
        
        .bar-label {{
            margin-top: 10px;
            font-size: 0.9em;
            color: #2c3e50;
            text-align: center;
            font-weight: 500;
        }}
        
        .bar-value {{
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            white-space: nowrap;
        }}
        
        .data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        
        .data-table th,
        .data-table td {{
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        
        .data-table th {{
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }}
        
        .data-table tr:hover {{
            background: #f8f9fa;
        }}
        
        .footer {{
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }}
        
        @media (max-width: 768px) {{
            .stats-grid {{
                grid-template-columns: 1fr;
            }}
            
            .bar-chart {{
                flex-direction: column;
                height: auto;
            }}
            
            .bar {{
                flex-direction: row;
                height: 40px;
                margin-bottom: 10px;
            }}
            
            .bar-fill {{
                height: 100%;
                border-radius: 0 5px 5px 0;
            }}
            
            .bar-label {{
                margin-top: 0;
                margin-left: 10px;
                text-align: left;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório Brudam</h1>
            <p>Período: {self.data_inicial.get()} a {self.data_final.get()}</p>
            <p>Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{total_em_aberto:,.0f}</div>
                <div class="stat-label">Em Aberto</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{total_entregues:,.0f}</div>
                <div class="stat-label">Entregues</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{total_geral:,.0f}</div>
                <div class="stat-label">Total Geral</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{len(categorias)}</div>
                <div class="stat-label">Categorias</div>
            </div>
        </div>
        
        <div class="charts-section">
            <div class="chart-container">
                <h2 class="chart-title">📈 Distribuição por Categoria - Em Aberto</h2>
                <div class="bar-chart">
"""
            
            # Cores para as barras
            colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22']
            
            for i, (categoria, valor) in enumerate(zip(categorias, em_aberto_values)):
                height = (valor / max_em_aberto) * 100 if max_em_aberto > 0 else 0
                color = colors[i % len(colors)]
                
                html_content += f"""
                    <div class="bar">
                        <div class="bar-fill" style="height: {height}%; background: {color};">
                            <div class="bar-value">{valor:,.0f}</div>
                        </div>
                        <div class="bar-label">{categoria}</div>
                    </div>
"""
            
            html_content += """
                </div>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📊 Distribuição por Categoria - Entregues</h2>
                <div class="bar-chart">
"""
            
            for i, (categoria, valor) in enumerate(zip(categorias, entregues_values)):
                height = (valor / max_entregues) * 100 if max_entregues > 0 else 0
                color = colors[i % len(colors)]
                
                html_content += f"""
                    <div class="bar">
                        <div class="bar-fill" style="height: {height}%; background: {color};">
                            <div class="bar-value">{valor:,.0f}</div>
                        </div>
                        <div class="bar-label">{categoria}</div>
                    </div>
"""
            
            html_content += """
                </div>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📋 Dados Detalhados</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
            
            for _, row in df.iterrows():
                html_content += f"""
                        <tr>
                            <td>{row['Categoria']}</td>
                            <td>{row['Em Aberto']}</td>
                            <td>{row['Entregues']}</td>
                            <td>{row['Total']}</td>
                        </tr>
"""
            
            html_content += f"""
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p>Relatório 347 - Sistema Brudam</p>
            <p>Dados coletados em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
    </div>
</body>
</html>
"""
            
            # Salvar arquivo HTML
            html_filename = f"relatorio_brudam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            html_filepath = os.path.join(os.getcwd(), html_filename)
            
            print(f"🔍 [TERMINAL] Salvando HTML em: {html_filepath}")
            self.log_message(f"🔍 Salvando HTML em: {html_filepath}", "INFO")
            
            with open(html_filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            # Verificar se o arquivo foi criado
            if os.path.exists(html_filepath):
                print(f"✅ [TERMINAL] HTML salvo com sucesso: {html_filepath}")
                self.log_message(f"✅ Relatório HTML salvo com sucesso: {html_filename}", "SUCCESS")
                self.log_message(f"📁 Caminho completo: {html_filepath}", "INFO")
                return html_filepath
            else:
                print(f"❌ [TERMINAL] Erro: Arquivo não foi criado")
                self.log_message(f"❌ Erro: Arquivo HTML não foi criado", "ERROR")
                return None
            
        except Exception as e:
            print(f"❌ [TERMINAL] Erro na geração do HTML: {str(e)}")
            self.log_message(f"Erro ao gerar relatório HTML: {str(e)}", "ERROR")
            return None
    
    def ask_open_html_report(self, html_filepath):
        """Pergunta se deseja abrir o relatório HTML no navegador"""
        self.log_message("🌐 Deseja abrir o relatório HTML no navegador?", "INFO")
        
        # Criar janela de confirmação
        result = messagebox.askyesno(
            "Abrir Relatório HTML", 
            f"Deseja abrir o relatório HTML no navegador?\n\nArquivo: {os.path.basename(html_filepath)}",
            icon='question'
        )
        
        if result:
            self.log_message("✅ Abrindo relatório HTML no navegador...", "SUCCESS")
            try:
                webbrowser.open(f"file://{html_filepath}")
                self.log_message("🎉 Relatório HTML aberto com sucesso!", "SUCCESS")
            except Exception as e:
                self.log_message(f"❌ Erro ao abrir relatório HTML: {str(e)}", "ERROR")
        else:
            self.log_message("❌ Abertura do relatório HTML cancelada", "WARNING")
            
    def send_whatsapp(self, filepath):
        """Envia arquivo via WhatsApp API"""
        try:
            self.update_progress(9, "Criando relatório HTML...")
            self.log_message("Preparando envio via WhatsApp...", "PROGRESS")
            
            # Aqui você precisaria configurar sua API do WhatsApp
            # Exemplo usando uma API como a do Twilio ou similar
            
            # Por enquanto, vamos simular o envio
            self.log_message(f"Arquivo {os.path.basename(filepath)} pronto para envio!", "SUCCESS")
            self.log_message("Configure sua API do WhatsApp para envio automático", "WARNING")
            
            return True
            
        except Exception as e:
            self.log_message(f"Erro ao enviar WhatsApp: {str(e)}", "ERROR")
            return False
            
    def start_complete_search(self):
        """Inicia o processo completo de busca (geral + clientes) em thread separada"""
        self.start_button.config(state="disabled")
        self.background_button.config(state="disabled")
        self.stop_button.config(state="normal")
        self.is_running = True
        self.start_time = datetime.now()
        
        # Resetar estatísticas
        self.stats = {
            'elementos_encontrados': 0,
            'dados_extraidos': 0,
            'arquivo_gerado': None,
            'dados_clientes': {},
            'dados_geral': []
        }
        
        # Resetar interface
        self.current_status_label.config(text="🚀 Iniciando busca completa...", foreground="blue")
        self.progress['value'] = 0
        self.progress_label.config(text="0% - Iniciando...")
        
        # Resetar etapas
        for i in range(len(self.step_status)):
            self.step_status[i].config(text="⏳", foreground="gray")
        
        # Limpar log
        self.log_text.delete(1.0, tk.END)
        
        # Executar em thread separada
        thread = threading.Thread(target=self.run_complete_search_process)
        thread.daemon = True
        thread.start()
    
    def start_background_search(self):
        """Inicia o processo completo de busca em segundo plano (minimizado)"""
        self.start_button.config(state="disabled")
        self.background_button.config(state="disabled")
        self.stop_button.config(state="normal")
        self.is_running = True
        self.start_time = datetime.now()
        
        # Minimizar a janela para segundo plano
        self.root.iconify()
        
        # Resetar estatísticas
        self.stats = {
            'elementos_encontrados': 0,
            'dados_extraidos': 0,
            'arquivo_gerado': None,
            'dados_clientes': {},
            'dados_geral': []
        }
        
        # Resetar interface
        self.current_status_label.config(text="🔄 Executando em segundo plano...", foreground="blue")
        self.progress['value'] = 0
        self.progress_label.config(text="0% - Iniciando em segundo plano...")
        
        # Resetar etapas
        for i in range(len(self.step_status)):
            self.step_status[i].config(text="⏳", foreground="gray")
        
        # Limpar log
        self.log_text.delete(1.0, tk.END)
        
        # Executar em thread separada
        thread = threading.Thread(target=self.run_background_search_process)
        thread.daemon = True
        thread.start()
        
    def stop_search(self):
        """Para o processo de busca"""
        self.is_running = False
        if self.driver:
            self.driver.quit()
            self.driver = None
            
        self.start_button.config(state="normal")
        self.background_button.config(state="normal")
        self.stop_button.config(state="disabled")
        self.log_message("Processo interrompido pelo usuário", "WARNING")
        
    def run_search_process(self):
        """Executa o processo completo de busca"""
        try:
            self.log_message("🚀 Iniciando processo de busca completo...", "PROGRESS")
            
            # Configurar driver
            self.log_message("🔧 Etapa 1: Configurando driver...", "PROGRESS")
            if not self.setup_driver():
                self.log_message("❌ Falha na configuração do driver", "ERROR")
                return
            self.log_message("✅ Driver configurado com sucesso", "SUCCESS")
            
            # Fechar pop-ups iniciais
            self.log_message("🔧 Etapa 1.5: Fechando pop-ups...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups verificados", "SUCCESS")
                
            # Login
            self.log_message("🔧 Etapa 2: Fazendo login...", "PROGRESS")
            if not self.login_brudam():
                self.log_message("❌ Falha no login", "ERROR")
                return
            self.log_message("✅ Login realizado com sucesso", "SUCCESS")
            
            # Fechar pop-ups após login
            self.log_message("🔧 Etapa 2.5: Fechando pop-ups pós-login...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups pós-login verificados", "SUCCESS")
                
            # Navegar para janela 376
            self.log_message("🔧 Etapa 3: Navegando para janela 376...", "PROGRESS")
            if not self.navigate_to_window_376():
                self.log_message("❌ Falha na navegação para janela 376", "ERROR")
                return
            self.log_message("✅ Navegação para janela 376 concluída", "SUCCESS")
                
            # Preencher datas e buscar
            self.log_message("🔧 Etapa 4: Preenchendo datas e buscando...", "PROGRESS")
            if not self.fill_dates_and_search():
                self.log_message("❌ Falha no preenchimento de datas ou busca", "ERROR")
                return
            self.log_message("✅ Preenchimento de datas e busca concluídos", "SUCCESS")
                
            # Extrair dados
            self.log_message("🔧 Etapa 5: Extraindo dados da tabela...", "PROGRESS")
            print("🔍 [TERMINAL] Extraindo dados da tabela")
            data = self.extract_table_data()
            print(f"🔍 [TERMINAL] Dados extraídos: {len(data) if data else 0} registros")
            if not data:
                print("❌ [TERMINAL] Nenhum dado extraído, saindo")
                self.log_message("❌ Nenhum dado extraído da tabela", "ERROR")
                return
            self.log_message(f"✅ Dados extraídos: {len(data)} registros", "SUCCESS")
                
            # Gerar Excel
            self.log_message("🔧 Etapa 6: Gerando relatório Excel...", "PROGRESS")
            filepath = self.generate_excel_report(data)
            if filepath:
                self.log_message(f"✅ Relatório Excel gerado: {os.path.basename(filepath)}", "SUCCESS")
            else:
                self.log_message("⚠️ Falha na geração do Excel, continuando...", "WARNING")
            
            # Sempre tentar gerar o HTML, independente do Excel
            self.log_message("🔧 Etapa 7: Gerando relatório HTML...", "PROGRESS")
            print("🔍 [TERMINAL] Chamando função generate_html_report...")
            self.log_message("🔍 Chamando função generate_html_report...", "INFO")
            html_filepath = self.generate_html_report(data)
            print(f"🔍 [TERMINAL] Resultado da função: {html_filepath}")
            self.log_message(f"🔍 Resultado da função: {html_filepath}", "INFO")
            if html_filepath:
                print(f"✅ [TERMINAL] HTML gerado com sucesso: {html_filepath}")
                self.log_message(f"✅ Relatório HTML gerado: {os.path.basename(html_filepath)}", "SUCCESS")
                self.root.after(0, lambda: self.ask_open_html_report(html_filepath))
            else:
                print("❌ [TERMINAL] Falha na geração do HTML")
                self.log_message("❌ Falha na geração do relatório HTML", "ERROR")
            
            # Perguntar sobre envio WhatsApp se Excel foi gerado
            if filepath:
                self.log_message("🔧 Etapa 8: Preparando envio WhatsApp...", "PROGRESS")
                self.root.after(0, lambda: self.ask_whatsapp_send(filepath))
            
            self.log_message("🎉 Processo concluído com sucesso!", "SUCCESS")
            
        except Exception as e:
            self.log_message(f"❌ Erro crítico no processo: {str(e)}", "ERROR")
            import traceback
            self.log_message(f"📋 Detalhes do erro: {traceback.format_exc()}", "ERROR")
            
        finally:
            # Limpar recursos
            self.log_message("🧹 Limpando recursos...", "PROGRESS")
            if self.driver:
                try:
                    self.driver.quit()
                    self.driver = None
                    self.log_message("✅ Driver fechado com sucesso", "SUCCESS")
                except Exception as e:
                    self.log_message(f"⚠️ Erro ao fechar driver: {str(e)}", "WARNING")
                
            # Restaurar interface
            self.log_message("🔄 Restaurando interface...", "PROGRESS")
            self.root.after(0, self.reset_ui)
    
    def run_background_search_process(self):
        """Executa o processo completo de busca em segundo plano"""
        try:
            self.log_message("🔄 Iniciando busca em segundo plano...", "PROGRESS")
            
            # Configurar driver
            self.log_message("🔧 Etapa 1: Configurando driver...", "PROGRESS")
            if not self.setup_driver():
                self.log_message("❌ Falha na configuração do driver", "ERROR")
                return
            self.log_message("✅ Driver configurado com sucesso", "SUCCESS")
            
            # Fechar pop-ups iniciais
            self.log_message("🔧 Etapa 1.5: Fechando pop-ups...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups verificados", "SUCCESS")
                
            # Login
            self.log_message("🔧 Etapa 2: Fazendo login...", "PROGRESS")
            if not self.login_brudam():
                self.log_message("❌ Falha no login", "ERROR")
                return
            self.log_message("✅ Login realizado com sucesso", "SUCCESS")
            
            # Fechar pop-ups após login
            self.log_message("🔧 Etapa 2.5: Fechando pop-ups pós-login...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups pós-login verificados", "SUCCESS")
                
            # Navegar para janela 376
            self.log_message("🔧 Etapa 3: Navegando para janela 376...", "PROGRESS")
            if not self.navigate_to_window_376():
                self.log_message("❌ Falha na navegação para janela 376", "ERROR")
                return
            self.log_message("✅ Navegação para janela 376 concluída", "SUCCESS")
                
            # Preencher datas e buscar
            self.log_message("🔧 Etapa 4: Preenchendo datas e buscando...", "PROGRESS")
            if not self.fill_dates_and_search():
                self.log_message("❌ Falha no preenchimento de datas ou busca", "ERROR")
                return
            self.log_message("✅ Preenchimento de datas e busca concluídos", "SUCCESS")
            
            # Extrair dados gerais primeiro
            self.log_message("🔧 Etapa 5: Extraindo dados gerais...", "PROGRESS")
            data_geral = self.extract_table_data()
            if data_geral:
                self.stats['dados_geral'] = data_geral
                self.log_message(f"✅ Dados gerais extraídos: {len(data_geral)} registros", "SUCCESS")
            else:
                self.log_message("⚠️ Falha na extração de dados gerais", "WARNING")
            
            # Buscar dados de cada cliente
            self.log_message("🔧 Etapa 6: Buscando dados dos clientes...", "PROGRESS")
            total_clientes = len(self.clientes)
            
            for i, cliente in enumerate(self.clientes):
                if not self.is_running:
                    break
                    
                self.log_message(f"🔍 Cliente {i+1}/{total_clientes}: {cliente}", "PROGRESS")
                data_cliente = self.search_client_data(cliente)
                
                if data_cliente:
                    self.stats['dados_clientes'][cliente] = data_cliente
                    self.log_message(f"✅ Dados do cliente {cliente} extraídos: {len(data_cliente)} registros", "SUCCESS")
                else:
                    self.log_message(f"⚠️ Falha na extração de dados do cliente {cliente}", "WARNING")
                    self.stats['dados_clientes'][cliente] = []
            
            # Gerar relatório HTML completo com abas
            self.log_message("🔧 Etapa 7: Gerando relatório HTML completo...", "PROGRESS")
            html_filepath = self.generate_complete_html_report()
            
            if html_filepath:
                self.log_message(f"✅ Relatório HTML completo gerado: {os.path.basename(html_filepath)}", "SUCCESS")
                # Restaurar janela e mostrar relatório
                self.root.after(0, lambda: self.root.deiconify())
                self.root.after(0, lambda: self.ask_open_html_report(html_filepath))
            else:
                self.log_message("❌ Falha na geração do relatório HTML", "ERROR")
                # Restaurar janela mesmo com erro
                self.root.after(0, lambda: self.root.deiconify())
            
            self.log_message("🎉 Busca em segundo plano concluída com sucesso!", "SUCCESS")
            
        except Exception as e:
            self.log_message(f"❌ Erro crítico no processo: {str(e)}", "ERROR")
            import traceback
            self.log_message(f"📋 Detalhes do erro: {traceback.format_exc()}", "ERROR")
            # Restaurar janela mesmo com erro
            self.root.after(0, lambda: self.root.deiconify())
            
        finally:
            # Limpar recursos
            self.log_message("🧹 Limpando recursos...", "PROGRESS")
            if self.driver:
                try:
                    self.driver.quit()
                    self.driver = None
                    self.log_message("✅ Driver fechado com sucesso", "SUCCESS")
                except Exception as e:
                    self.log_message(f"⚠️ Erro ao fechar driver: {str(e)}", "WARNING")
                
            # Restaurar interface
            self.log_message("🔄 Restaurando interface...", "PROGRESS")
            self.root.after(0, self.reset_ui)
            
    def run_complete_search_process(self):
        """Executa o processo completo de busca (geral + clientes)"""
        try:
            self.log_message("🚀 Iniciando busca completa (geral + clientes)...", "PROGRESS")
            
            # Configurar driver
            self.log_message("🔧 Etapa 1: Configurando driver...", "PROGRESS")
            if not self.setup_driver():
                self.log_message("❌ Falha na configuração do driver", "ERROR")
                return
            self.log_message("✅ Driver configurado com sucesso", "SUCCESS")
            
            # Fechar pop-ups iniciais
            self.log_message("🔧 Etapa 1.5: Fechando pop-ups...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups verificados", "SUCCESS")
                
            # Login
            self.log_message("🔧 Etapa 2: Fazendo login...", "PROGRESS")
            if not self.login_brudam():
                self.log_message("❌ Falha no login", "ERROR")
                return
            self.log_message("✅ Login realizado com sucesso", "SUCCESS")
            
            # Fechar pop-ups após login
            self.log_message("🔧 Etapa 2.5: Fechando pop-ups pós-login...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups pós-login verificados", "SUCCESS")
                
            # Navegar para janela 376
            self.log_message("🔧 Etapa 3: Navegando para janela 376...", "PROGRESS")
            if not self.navigate_to_window_376():
                self.log_message("❌ Falha na navegação para janela 376", "ERROR")
                return
            self.log_message("✅ Navegação para janela 376 concluída", "SUCCESS")
                
            # Preencher datas e buscar
            self.log_message("🔧 Etapa 4: Preenchendo datas e buscando...", "PROGRESS")
            if not self.fill_dates_and_search():
                self.log_message("❌ Falha no preenchimento de datas ou busca", "ERROR")
                return
            self.log_message("✅ Preenchimento de datas e busca concluídos", "SUCCESS")
            
            # Extrair dados gerais primeiro
            self.log_message("🔧 Etapa 5: Extraindo dados gerais...", "PROGRESS")
            data_geral = self.extract_table_data()
            if data_geral:
                self.stats['dados_geral'] = data_geral
                self.log_message(f"✅ Dados gerais extraídos: {len(data_geral)} registros", "SUCCESS")
            else:
                self.log_message("⚠️ Falha na extração de dados gerais", "WARNING")
            
            # Aguardar um pouco após extrair dados gerais
            time.sleep(3)
            
            # Buscar dados de cada cliente
            self.log_message("🔧 Etapa 6: Buscando dados dos clientes...", "PROGRESS")
            total_clientes = len(self.clientes)
            
            for i, cliente in enumerate(self.clientes):
                if not self.is_running:
                    break
                    
                self.log_message(f"🔍 Cliente {i+1}/{total_clientes}: {cliente}", "PROGRESS")
                
                # Buscar dados do cliente
                dados_cliente = self.search_client_data(cliente)
                
                if dados_cliente:
                    self.stats['dados_clientes'][cliente] = dados_cliente
                    self.log_message(f"✅ Dados coletados para {cliente}", "SUCCESS")
                else:
                    self.log_message(f"⚠️ Falha na coleta de dados para {cliente}", "WARNING")
                
                # Aguardar entre buscas de clientes
                time.sleep(3)
            
            # Gerar relatório HTML completo com abas
            self.log_message("🔧 Etapa 7: Gerando relatório HTML completo...", "PROGRESS")
            html_filepath = self.generate_complete_html_report()
            
            if html_filepath:
                self.log_message(f"✅ Relatório HTML completo gerado: {os.path.basename(html_filepath)}", "SUCCESS")
                self.root.after(0, lambda: self.ask_open_html_report(html_filepath))
            else:
                self.log_message("❌ Falha na geração do relatório HTML", "ERROR")
            
            self.log_message("🎉 Busca completa concluída com sucesso!", "SUCCESS")
            
        except Exception as e:
            self.log_message(f"❌ Erro crítico no processo: {str(e)}", "ERROR")
            import traceback
            self.log_message(f"📋 Detalhes do erro: {traceback.format_exc()}", "ERROR")
            
        finally:
            # Limpar recursos
            self.log_message("🧹 Limpando recursos...", "PROGRESS")
            if self.driver:
                try:
                    self.driver.quit()
                    self.driver = None
                    self.log_message("✅ Driver fechado com sucesso", "SUCCESS")
                except Exception as e:
                    self.log_message(f"⚠️ Erro ao fechar driver: {str(e)}", "WARNING")
                
            # Restaurar interface
            self.log_message("🔄 Restaurando interface...", "PROGRESS")
            self.root.after(0, self.reset_ui)
            
    def search_client_data(self, cliente):
        """Busca dados de um cliente específico usando campo de texto"""
        try:
            self.log_message(f"🔍 Buscando dados do cliente: {cliente}", "PROGRESS")
            
            # Procurar o campo de texto para digitar o nome do cliente
            cliente_input = None
            try:
                # Tentar encontrar o campo de texto para cliente
                cliente_input = self.driver.find_element(By.CSS_SELECTOR, "input.brd-input-submit.brd-upper")
                self.log_message(f"✅ Campo de texto de cliente encontrado", "SUCCESS")
            except NoSuchElementException:
                try:
                    # Tentar seletor mais específico
                    cliente_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='text'][class*='brd-input-submit']")
                    self.log_message(f"✅ Campo de texto de cliente encontrado (seletor alternativo)", "SUCCESS")
                except NoSuchElementException:
                    self.log_message(f"❌ Campo de texto de cliente não encontrado", "ERROR")
                    return None
            
            # Aguardar um pouco para garantir que o campo está carregado
            time.sleep(2)
            
            # Limpar o campo e digitar o nome do cliente
            try:
                # Limpar o campo primeiro
                cliente_input.clear()
                time.sleep(0.5)
                
                # Digitar o nome do cliente
                cliente_input.send_keys(cliente)
                self.log_message(f"✅ Nome do cliente '{cliente}' digitado no campo", "SUCCESS")
                
                # Aguardar um pouco após digitação
                time.sleep(2)
                
            except Exception as e:
                self.log_message(f"❌ Erro ao digitar nome do cliente: {str(e)}", "ERROR")
                return None
            
            # Procurar e clicar no botão de pesquisa correto
            search_button = None
            try:
                # Tentar primeiro o botão específico para busca de clientes
                search_button = self.driver.find_element(By.CSS_SELECTOR, "input[name='enviar'][value='PESQUISAR']")
                self.log_message(f"✅ Botão PESQUISAR encontrado (seletor específico)", "SUCCESS")
            except NoSuchElementException:
                try:
                    # Tentar por classe brd-button
                    search_button = self.driver.find_element(By.CSS_SELECTOR, "input.brd-button[value='PESQUISAR']")
                    self.log_message(f"✅ Botão PESQUISAR encontrado (classe brd-button)", "SUCCESS")
                except NoSuchElementException:
                    try:
                        # Tentar seletor genérico
                        search_button = self.driver.find_element(By.CSS_SELECTOR, "input[value='PESQUISAR']")
                        self.log_message(f"✅ Botão PESQUISAR encontrado (seletor genérico)", "SUCCESS")
                    except NoSuchElementException:
                        self.log_message(f"❌ Botão de pesquisa não encontrado para {cliente}", "ERROR")
                        return None
            
            # Clicar no botão de pesquisa
            if search_button:
                search_button.click()
                self.log_message(f"🔍 Busca executada para {cliente}", "SUCCESS")
            else:
                self.log_message(f"❌ Botão de pesquisa não encontrado para {cliente}", "ERROR")
                return None
            
            # Aguardar carregamento dos resultados (timeout de 30s)
            time.sleep(5)
            
            # Fechar pop-up que pode aparecer após a busca
            self.close_search_popup()
            
            # Extrair dados da tabela
            try:
                # Aguardar carregamento da tabela (timeout de 30s)
                WebDriverWait(self.driver, 30).until(
                    EC.presence_of_element_located((By.ID, "contents"))
                )
                
                # Encontrar tabela de resumo
                summary_table = self.driver.find_element(By.ID, "brdtotais")
                rows = summary_table.find_elements(By.TAG_NAME, "tr")
                
                data = []
                for row in rows[1:]:  # Pular cabeçalho
                    cells = row.find_elements(By.TAG_NAME, "td")
                    if len(cells) >= 4:
                        categoria = cells[0].text.strip()
                        em_aberto = cells[1].text.strip()
                        entregues = cells[2].text.strip()
                        total = cells[3].text.strip()
                        
                        data.append({
                            'Categoria': categoria,
                            'Em Aberto': em_aberto,
                            'Entregues': entregues,
                            'Total': total
                        })
                
                self.log_message(f"✅ Dados extraídos para {cliente}: {len(data)} registros", "SUCCESS")
                return data
                
            except Exception as e:
                self.log_message(f"❌ Erro ao extrair dados para {cliente}: {str(e)}", "ERROR")
                return None
                
        except Exception as e:
            self.log_message(f"❌ Erro geral na busca de {cliente}: {str(e)}", "ERROR")
            return None
            
    def run_clients_search_process(self):
        """Executa o processo de busca por clientes"""
        try:
            self.log_message("🚀 Iniciando busca por clientes...", "PROGRESS")
            
            # Configurar driver
            self.log_message("🔧 Etapa 1: Configurando driver...", "PROGRESS")
            if not self.setup_driver():
                self.log_message("❌ Falha na configuração do driver", "ERROR")
                return
            self.log_message("✅ Driver configurado com sucesso", "SUCCESS")
            
            # Fechar pop-ups iniciais
            self.log_message("🔧 Etapa 1.5: Fechando pop-ups...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups verificados", "SUCCESS")
                
            # Login
            self.log_message("🔧 Etapa 2: Fazendo login...", "PROGRESS")
            if not self.login_brudam():
                self.log_message("❌ Falha no login", "ERROR")
                return
            self.log_message("✅ Login realizado com sucesso", "SUCCESS")
            
            # Fechar pop-ups após login
            self.log_message("🔧 Etapa 2.5: Fechando pop-ups pós-login...", "PROGRESS")
            self.close_popups()
            self.log_message("✅ Pop-ups pós-login verificados", "SUCCESS")
                
            # Navegar para janela 376
            self.log_message("🔧 Etapa 3: Navegando para janela 376...", "PROGRESS")
            if not self.navigate_to_window_376():
                self.log_message("❌ Falha na navegação para janela 376", "ERROR")
                return
            self.log_message("✅ Navegação para janela 376 concluída", "SUCCESS")
                
            # Preencher datas e buscar
            self.log_message("🔧 Etapa 4: Preenchendo datas e buscando...", "PROGRESS")
            if not self.fill_dates_and_search():
                self.log_message("❌ Falha no preenchimento de datas ou busca", "ERROR")
                return
            self.log_message("✅ Preenchimento de datas e busca concluídos", "SUCCESS")
            
            # Buscar dados de cada cliente
            self.log_message("🔧 Etapa 5: Buscando dados dos clientes...", "PROGRESS")
            total_clientes = len(self.clientes)
            
            for i, cliente in enumerate(self.clientes):
                if not self.is_running:
                    break
                    
                self.log_message(f"🔍 Cliente {i+1}/{total_clientes}: {cliente}", "PROGRESS")
                
                # Buscar dados do cliente
                dados_cliente = self.search_client_data(cliente)
                
                if dados_cliente:
                    self.stats['dados_clientes'][cliente] = dados_cliente
                    self.log_message(f"✅ Dados coletados para {cliente}", "SUCCESS")
                else:
                    self.log_message(f"⚠️ Falha na coleta de dados para {cliente}", "WARNING")
                
                # Aguardar entre buscas
                time.sleep(2)
            
            # Gerar relatório HTML com gráfico de linha
            self.log_message("🔧 Etapa 6: Gerando relatório HTML...", "PROGRESS")
            html_filepath = self.generate_clients_html_report()
            
            if html_filepath:
                self.log_message(f"✅ Relatório HTML gerado: {os.path.basename(html_filepath)}", "SUCCESS")
                self.root.after(0, lambda: self.ask_open_html_report(html_filepath))
            else:
                self.log_message("❌ Falha na geração do relatório HTML", "ERROR")
            
            self.log_message("🎉 Busca por clientes concluída com sucesso!", "SUCCESS")
            
        except Exception as e:
            self.log_message(f"❌ Erro crítico no processo: {str(e)}", "ERROR")
            import traceback
            self.log_message(f"📋 Detalhes do erro: {traceback.format_exc()}", "ERROR")
            
        finally:
            # Limpar recursos
            self.log_message("🧹 Limpando recursos...", "PROGRESS")
            if self.driver:
                try:
                    self.driver.quit()
                    self.driver = None
                    self.log_message("✅ Driver fechado com sucesso", "SUCCESS")
                except Exception as e:
                    self.log_message(f"⚠️ Erro ao fechar driver: {str(e)}", "WARNING")
                
            # Restaurar interface
            self.log_message("🔄 Restaurando interface...", "PROGRESS")
            self.root.after(0, self.reset_ui)
            
    def generate_clients_html_report(self):
        """Gera relatório HTML com gráfico de linha comparativo dos clientes"""
        try:
            self.log_message("🔍 Gerando relatório HTML dos clientes...", "PROGRESS")
            
            # Verificar se há dados
            if not self.stats['dados_clientes']:
                self.log_message("❌ Nenhum dado de cliente encontrado", "ERROR")
                return None
            
            # Função para limpar e converter valores
            def clean_value(value):
                try:
                    clean_val = str(value).replace('.', '').replace(',', '.').replace('(', '').replace(')', '').replace('%', '')
                    clean_val = clean_val.split()[0] if clean_val.split() else '0'
                    return float(clean_val)
                except:
                    return 0.0
            
            # Preparar dados para o gráfico
            clientes_data = {}
            for cliente, dados in self.stats['dados_clientes'].items():
                if dados:
                    df = pd.DataFrame(dados)
                    total_em_aberto = df['Em Aberto'].apply(clean_value).sum()
                    total_entregues = df['Entregues'].apply(clean_value).sum()
                    total_geral = df['Total'].apply(clean_value).sum()
                    
                    clientes_data[cliente] = {
                        'em_aberto': total_em_aberto,
                        'entregues': total_entregues,
                        'total': total_geral
                    }
            
            # Gerar HTML
            html_content = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Clientes Brudam - {datetime.now().strftime('%d/%m/%Y')}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .charts-section {{
            padding: 30px;
        }}
        
        .chart-container {{
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }}
        
        .chart-title {{
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }}
        
        .data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        
        .data-table th,
        .data-table td {{
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        
        .data-table th {{
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }}
        
        .data-table tr:hover {{
            background: #f8f9fa;
        }}
        
        .footer {{
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório Clientes Brudam</h1>
            <p>Período: {self.data_inicial.get()} a {self.data_final.get()}</p>
            <p>Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
        
        <div class="charts-section">
            <div class="chart-container">
                <h2 class="chart-title">📈 Comparativo de Clientes - Em Aberto</h2>
                <canvas id="chartEmAberto" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📊 Comparativo de Clientes - Entregues</h2>
                <canvas id="chartEntregues" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📋 Dados Detalhados por Cliente</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
            
            # Adicionar dados dos clientes na tabela
            for cliente, dados in clientes_data.items():
                html_content += f"""
                        <tr>
                            <td><strong>{cliente}</strong></td>
                            <td>{dados['em_aberto']:,.0f}</td>
                            <td>{dados['entregues']:,.0f}</td>
                            <td>{dados['total']:,.0f}</td>
                        </tr>
"""
            
            html_content += f"""
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p>Relatório Clientes - Sistema Brudam</p>
            <p>Dados coletados em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
    </div>
    
    <script>
        // Dados para os gráficos
        const clientes = {list(clientes_data.keys())};
        const emAbertoData = {list(clientes_data.values())};
        const entreguesData = {list(clientes_data.values())};
        
        // Gráfico Em Aberto
        const ctxEmAberto = document.getElementById('chartEmAberto').getContext('2d');
        new Chart(ctxEmAberto, {{
            type: 'line',
            data: {{
                labels: clientes,
                datasets: [{{
                    label: 'Em Aberto',
                    data: emAbertoData.map(d => d.em_aberto),
                    borderColor: 'rgb(231, 76, 60)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.1,
                    fill: true
                }}]
            }},
            options: {{
                responsive: true,
                plugins: {{
                    legend: {{
                        position: 'top',
                    }},
                    title: {{
                        display: true,
                        text: 'Volume de Em Aberto por Cliente'
                    }}
                }},
                scales: {{
                    y: {{
                        beginAtZero: true
                    }}
                }}
            }}
        }});
        
        // Gráfico Entregues
        const ctxEntregues = document.getElementById('chartEntregues').getContext('2d');
        new Chart(ctxEntregues, {{
            type: 'line',
            data: {{
                labels: clientes,
                datasets: [{{
                    label: 'Entregues',
                    data: entreguesData.map(d => d.entregues),
                    borderColor: 'rgb(46, 204, 113)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.1,
                    fill: true
                }}]
            }},
            options: {{
                responsive: true,
                plugins: {{
                    legend: {{
                        position: 'top',
                    }},
                    title: {{
                        display: true,
                        text: 'Volume de Entregues por Cliente'
                    }}
                }},
                scales: {{
                    y: {{
                        beginAtZero: true
                    }}
                }}
            }}
        }});
    </script>
</body>
</html>
"""
            
            # Salvar arquivo HTML
            html_filename = f"relatorio_clientes_brudam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            html_filepath = os.path.join(os.getcwd(), html_filename)
            
            with open(html_filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            if os.path.exists(html_filepath):
                self.log_message(f"✅ Relatório HTML dos clientes salvo: {html_filename}", "SUCCESS")
                return html_filepath
            else:
                self.log_message(f"❌ Erro: Arquivo HTML não foi criado", "ERROR")
                return None
            
        except Exception as e:
            self.log_message(f"❌ Erro ao gerar relatório HTML dos clientes: {str(e)}", "ERROR")
            return None

    def generate_complete_html_report(self):
        """Gera relatório HTML completo com abas por cliente"""
        try:
            self.log_message("🔍 Gerando relatório HTML completo...", "PROGRESS")
            
            # Função para limpar e converter valores
            def clean_value(value):
                try:
                    clean_val = str(value).replace('.', '').replace(',', '.').replace('(', '').replace(')', '').replace('%', '')
                    clean_val = clean_val.split()[0] if clean_val.split() else '0'
                    return float(clean_val)
                except:
                    return 0.0
            
            # Preparar dados gerais
            dados_geral = self.stats.get('dados_geral', [])
            geral_data = {}
            if dados_geral:
                df_geral = pd.DataFrame(dados_geral)
                total_em_aberto_geral = df_geral['Em Aberto'].apply(clean_value).sum()
                total_entregues_geral = df_geral['Entregues'].apply(clean_value).sum()
                total_geral_geral = df_geral['Total'].apply(clean_value).sum()
                
                geral_data = {
                    'em_aberto': total_em_aberto_geral,
                    'entregues': total_entregues_geral,
                    'total': total_geral_geral
                }
            
            # Preparar dados dos clientes
            clientes_data = {}
            for cliente, dados in self.stats.get('dados_clientes', {}).items():
                if dados:
                    df = pd.DataFrame(dados)
                    total_em_aberto = df['Em Aberto'].apply(clean_value).sum()
                    total_entregues = df['Entregues'].apply(clean_value).sum()
                    total_geral = df['Total'].apply(clean_value).sum()
                    
                    clientes_data[cliente] = {
                        'em_aberto': total_em_aberto,
                        'entregues': total_entregues,
                        'total': total_geral,
                        'dados_detalhados': dados
                    }
            
            # Gerar HTML com abas
            html_content = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Completo Brudam - {datetime.now().strftime('%d/%m/%Y')}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .tabs {{
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
        }}
        
        .tab {{
            padding: 15px 25px;
            cursor: pointer;
            border: none;
            background: transparent;
            font-size: 16px;
            font-weight: 500;
            color: #666;
            transition: all 0.3s ease;
        }}
        
        .tab.active {{
            background: white;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
        }}
        
        .tab:hover {{
            background: #e9ecef;
        }}
        
        .tab-content {{
            display: none;
            padding: 30px;
        }}
        
        .tab-content.active {{
            display: block;
        }}
        
        .chart-container {{
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }}
        
        .chart-title {{
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }}
        
        .data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        
        .data-table th,
        .data-table td {{
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        
        .data-table th {{
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }}
        
        .data-table tr:hover {{
            background: #f8f9fa;
        }}
        
        .footer {{
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório Completo Brudam</h1>
            <p>Período: {self.data_inicial.get()} a {self.data_final.get()}</p>
            <p>Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('geral')">📊 Visão Geral</button>
            <button class="tab" onclick="showTab('comparativo')">📈 Comparativo</button>
"""
            
            # Adicionar abas para cada cliente
            for cliente in clientes_data.keys():
                html_content += f'<button class="tab" onclick="showTab(\'{cliente.lower().replace(" ", "_")}\')">🏢 {cliente}</button>\n'
            
            html_content += """
        </div>
        
        <!-- Aba Visão Geral -->
        <div id="geral" class="tab-content active">
            <div class="chart-container">
                <h2 class="chart-title">📊 Resumo Geral Completo</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
            
            # Adicionar dados detalhados da visão geral
            if dados_geral:
                for item in dados_geral:
                    html_content += f"""
                        <tr>
                            <td>{item['Categoria']}</td>
                            <td>{item['Em Aberto']}</td>
                            <td>{item['Entregues']}</td>
                            <td>{item['Total']}</td>
                        </tr>
"""
            
            html_content += """
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Aba Comparativo -->
        <div id="comparativo" class="tab-content">
            <div class="chart-container">
                <h2 class="chart-title">📊 Quadro Comparativo - Melhor ao Pior Resultado</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Cliente</th>
                            <th>DENTRO DO PRAZO</th>
                            <th>FORA DO PRAZO</th>
                            <th>TOTAL</th>
                            <th>% Dentro do Prazo</th>
                        </tr>
                    </thead>
                    <tbody>
"""
            
            # Calcular métricas para comparação
            comparativo_data = []
            for cliente, dados in clientes_data.items():
                if dados['dados_detalhados']:
                    dentro_prazo = 0
                    fora_prazo = 0
                    
                    for item in dados['dados_detalhados']:
                        if 'DENTRO DO PRAZO' in item['Categoria']:
                            dentro_prazo += clean_value(item['Total'])
                        elif 'FORA DO PRAZO' in item['Categoria']:
                            fora_prazo += clean_value(item['Total'])
                    
                    # Calcular TOTAL = DENTRO DO PRAZO + FORA DO PRAZO
                    total = dentro_prazo + fora_prazo
                    
                    # Calcular % Dentro do Prazo = (DENTRO DO PRAZO / TOTAL) × 100
                    if total > 0:
                        percentual_dentro = (dentro_prazo / total * 100)
                    else:
                        percentual_dentro = 0.0
                    
                    comparativo_data.append({
                        'cliente': cliente,
                        'dentro_prazo': dentro_prazo,
                        'fora_prazo': fora_prazo,
                        'total': total,
                        'percentual_dentro': percentual_dentro
                    })
            
            # Ordenar do melhor ao pior (maior % dentro do prazo)
            comparativo_data.sort(key=lambda x: x['percentual_dentro'], reverse=True)
            
            # Adicionar dados ordenados na tabela
            for i, data in enumerate(comparativo_data, 1):
                html_content += f"""
                        <tr>
                            <td><strong>{i}º</strong></td>
                            <td><strong>{data['cliente']}</strong></td>
                            <td>{data['dentro_prazo']:,.0f}</td>
                            <td>{data['fora_prazo']:,.0f}</td>
                            <td>{data['total']:,.0f}</td>
                            <td><strong>{data['percentual_dentro']:.1f}%</strong></td>
                        </tr>
"""
            
            html_content += """
                    </tbody>
                </table>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📈 Gráfico Comparativo - Dentro vs Fora do Prazo</h2>
                <canvas id="chartComparativo" width="400" height="200"></canvas>
            </div>
        </div>
"""
            
            # Adicionar abas para cada cliente
            for cliente, dados in clientes_data.items():
                tab_id = cliente.lower().replace(" ", "_")
                html_content += f"""
        <!-- Aba {cliente} -->
        <div id="{tab_id}" class="tab-content">
            <div class="chart-container">
                <h2 class="chart-title">🏢 {cliente}</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
                
                for item in dados['dados_detalhados']:
                    html_content += f"""
                        <tr>
                            <td>{item['Categoria']}</td>
                            <td>{item['Em Aberto']}</td>
                            <td>{item['Entregues']}</td>
                            <td>{item['Total']}</td>
                        </tr>
"""
                
                html_content += f"""
                    </tbody>
                </table>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📈 Gráfico de Linha - Dentro vs Fora do Prazo</h2>
                <canvas id="chart{tab_id}" width="400" height="200"></canvas>
            </div>
        </div>
"""
            
            html_content += f"""
        <div class="footer">
            <p>Relatório Completo - Sistema Brudam</p>
            <p>Dados coletados em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {{
            // Esconder todas as abas
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Remover classe active de todos os botões
            const buttons = document.querySelectorAll('.tab');
            buttons.forEach(button => button.classList.remove('active'));
            
            // Mostrar aba selecionada
            document.getElementById(tabName).classList.add('active');
            
            // Adicionar classe active ao botão clicado
            event.target.classList.add('active');
        }}
        
        // Função para criar gráficos
        function createCharts() {{
            // Dados para os gráficos
            const clientes = {json.dumps(list(clientes_data.keys()))};
            const comparativoData = {json.dumps(comparativo_data)};
            
            // Gráfico Comparativo Geral
            const ctxComparativo = document.getElementById('chartComparativo');
            if (ctxComparativo) {{
                new Chart(ctxComparativo.getContext('2d'), {{
                    type: 'bar',
                    data: {{
                        labels: comparativoData.map(d => d.cliente),
                        datasets: [{{
                            label: 'Dentro do Prazo',
                            data: comparativoData.map(d => d.dentro_prazo),
                            backgroundColor: 'rgba(46, 204, 113, 0.8)',
                            borderColor: 'rgb(46, 204, 113)',
                            borderWidth: 1
                        }}, {{
                            label: 'Fora do Prazo',
                            data: comparativoData.map(d => d.fora_prazo),
                            backgroundColor: 'rgba(231, 76, 60, 0.8)',
                            borderColor: 'rgb(231, 76, 60)',
                            borderWidth: 1
                        }}]
                    }},
                    options: {{
                        responsive: true,
                        plugins: {{
                            legend: {{
                                position: 'top',
                            }},
                            title: {{
                                display: true,
                                text: 'Comparativo: Dentro vs Fora do Prazo'
                            }}
                        }},
                        scales: {{
                            y: {{
                                beginAtZero: true
                            }}
                        }}
                    }}
                }});
            }}
            
            // Gráficos individuais para cada cliente
"""
            
            # Adicionar gráficos individuais para cada cliente
            for cliente, dados in clientes_data.items():
                tab_id = cliente.lower().replace(" ", "_")
                
                # Calcular dados para o gráfico do cliente
                dentro_prazo_data = []
                fora_prazo_data = []
                labels = []
                
                for item in dados['dados_detalhados']:
                    if 'DENTRO DO PRAZO' in item['Categoria']:
                        dentro_prazo_data.append(clean_value(item['Total']))
                        labels.append('Dentro do Prazo')
                    elif 'FORA DO PRAZO' in item['Categoria']:
                        fora_prazo_data.append(clean_value(item['Total']))
                        labels.append('Fora do Prazo')
                
                html_content += f"""
            // Gráfico para {cliente}
            const ctx{tab_id} = document.getElementById('chart{tab_id}');
            if (ctx{tab_id}) {{
                new Chart(ctx{tab_id}.getContext('2d'), {{
                    type: 'line',
                    data: {{
                        labels: ['Dentro do Prazo', 'Fora do Prazo'],
                        datasets: [{{
                            label: 'Volume',
                            data: [{sum(dentro_prazo_data) if dentro_prazo_data else 0}, {sum(fora_prazo_data) if fora_prazo_data else 0}],
                            borderColor: 'rgb(52, 152, 219)',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            tension: 0.1,
                            fill: true
                        }}]
                    }},
                    options: {{
                        responsive: true,
                        plugins: {{
                            legend: {{
                                position: 'top',
                            }},
                            title: {{
                                display: true,
                                text: '{cliente} - Dentro vs Fora do Prazo'
                            }}
                        }},
                        scales: {{
                            y: {{
                                beginAtZero: true
                            }}
                        }}
                    }}
                }});
            }}
"""
            
            html_content += """
        }
        
        // Aguardar carregamento da página e criar gráficos
        document.addEventListener('DOMContentLoaded', function() {
            createCharts();
        });
    </script>
</body>
</html>
"""
            
            # Salvar arquivo HTML
            html_filename = f"relatorio_completo_brudam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            html_filepath = os.path.join(os.getcwd(), html_filename)
            
            with open(html_filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            if os.path.exists(html_filepath):
                self.log_message(f"✅ Relatório HTML completo salvo: {html_filename}", "SUCCESS")
                return html_filepath
            else:
                self.log_message(f"❌ Erro: Arquivo HTML não foi criado", "ERROR")
                return None
            
        except Exception as e:
            self.log_message(f"❌ Erro ao gerar relatório HTML completo: {str(e)}", "ERROR")
            return None

    def generate_complete_html_report(self):
        """Gera relatório HTML completo com abas por cliente - VERSÃO ATUALIZADA"""
        try:
            self.log_message("🔍 Gerando relatório HTML completo...", "PROGRESS")
            
            # Função para limpar e converter valores
            def clean_value(value):
                try:
                    clean_val = str(value).replace('.', '').replace(',', '.').replace('(', '').replace(')', '').replace('%', '')
                    clean_val = clean_val.split()[0] if clean_val.split() else '0'
                    return float(clean_val)
                except:
                    return 0.0
            
            # Preparar dados gerais
            dados_geral = self.stats.get('dados_geral', [])
            geral_data = {}
            if dados_geral:
                df_geral = pd.DataFrame(dados_geral)
                total_em_aberto_geral = df_geral['Em Aberto'].apply(clean_value).sum()
                total_entregues_geral = df_geral['Entregues'].apply(clean_value).sum()
                total_geral_geral = df_geral['Total'].apply(clean_value).sum()
                
                geral_data = {
                    'em_aberto': total_em_aberto_geral,
                    'entregues': total_entregues_geral,
                    'total': total_geral_geral
                }
            
            # Preparar dados dos clientes
            clientes_data = {}
            for cliente, dados in self.stats.get('dados_clientes', {}).items():
                if dados:
                    df = pd.DataFrame(dados)
                    total_em_aberto = df['Em Aberto'].apply(clean_value).sum()
                    total_entregues = df['Entregues'].apply(clean_value).sum()
                    total_geral = df['Total'].apply(clean_value).sum()
                    
                    clientes_data[cliente] = {
                        'em_aberto': total_em_aberto,
                        'entregues': total_entregues,
                        'total': total_geral,
                        'dados_detalhados': dados
                    }

            # ------------------------------------------------------------
            # IMPORTANTE: normalizar IDs/variáveis JS por cliente
            # (evita HTML inválido quando o nome do cliente contém vírgula, ponto, etc.)
            # Ex.: "SKO COMERCIO, IMPORTACAO" → "sko_comercio_importacao"
            # ------------------------------------------------------------
            def _slugify(text: str) -> str:
                base = (text or "").lower()
                base = re.sub(r"[^a-z0-9]+", "_", base)
                base = re.sub(r"_+", "_", base).strip("_")
                return base or "cliente"

            slug_counts = {}
            client_slugs = {}
            for cliente in clientes_data.keys():
                base = _slugify(cliente)
                slug_counts[base] = slug_counts.get(base, 0) + 1
                suffix = slug_counts[base]
                client_slugs[cliente] = base if suffix == 1 else f"{base}_{suffix}"
            
            # Logos removidos - não há imagens disponíveis para todos os clientes
            
            # Gerar HTML com abas - NOVO TEMPLATE ATUALIZADO
            html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Completo Brudam - {datetime.now().strftime('%d/%m/%Y')}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2942 25%, #8b3a00 75%, #ff8c00 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: #1a1a2e;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 1.8em;
            margin-bottom: 8px;
            font-weight: 400;
        }}
        
        .header p {{
            font-size: 0.95em;
            opacity: 0.9;
            margin: 3px 0;
        }}
        
        .tabs {{
            display: flex;
            background: #2c3e5e;
            border-bottom: 1px solid #ff8c00;
            overflow-x: auto;
            white-space: nowrap;
        }}
        
        .tab {{
            padding: 15px 25px;
            cursor: pointer;
            border: none;
            background: transparent;
            font-size: 16px;
            font-weight: 500;
            color: #b8c1d9;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        
        .tab.active {{
            background: #1a1a2e;
            color: #ff8c00;
            border-bottom: 3px solid #ff8c00;
        }}
        
        .tab:hover {{
            background: #0f1823;
            color: #ffa726;
        }}
        
        
        .client-selector {{
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
            justify-content: center;
        }}
        
        .client-btn {{
            padding: 10px 20px;
            border: 2px solid #3a4a5e;
            background: #16213e;
            color: #b8c1d9;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        
        .client-btn:hover {{
            border-color: #ff8c00;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
        }}
        
        .client-btn.selected {{
            border-color: #ff8c00;
            background: #2a3a5a;
            color: #ff8c00;
        }}
        
        
        .modal {{
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        }}
        
        .modal-content {{
            margin: 2% auto;
            padding: 20px;
            width: 95%;
            height: 90%;
        }}
        
        .modal canvas {{
            max-width: 100%;
            max-height: 100%;
        }}
        
        .close {{
            color: white;
            float: right;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }}
        
        .close:hover {{
            color: #fd7e14;
        }}
        
        .expand-btn {{
            background: #fd7e14;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .expand-btn:hover {{
            background: #e67212;
            transform: scale(1.05);
        }}
        
        .tab-content {{
            display: none;
            padding: 30px;
            background: #1a1a2e;
        }}
        
        .tab-content.active {{
            display: block;
        }}
        
        .chart-container {{
            background: #16213e;
            margin-bottom: 30px;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            border: 1px solid #2a3a5a;
        }}
        
        .chart-title {{
            font-size: 1.5em;
            color: #ff8c00;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }}
        
        .data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        
        .data-table th,
        .data-table td {{
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #2a3a5a;
            color: #b8c1d9;
        }}
        
        .data-table th {{
            background: #0f1823;
            font-weight: 600;
            color: #ff8c00;
        }}
        
        .data-table tr:hover {{
            background: #1f2d42;
        }}
        
        .data-table td strong {{
            color: #ffa726;
        }}
        
        .footer {{
            background: #0f2027;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }}
        
        #modalTableContent {{
            overflow-x: auto;
            background: #16213e;
            padding: 20px;
            border-radius: 10px;
        }}
        
        #modalTableContent table {{
            width: 100%;
            font-size: 1.2em;
        }}
        
        #modalTableContent table th,
        #modalTableContent table td {{
            color: #b8c1d9;
        }}
        
        #modalTableContent table th {{
            color: #ff8c00;
        }}
        
        #modalTableContent table td strong {{
            color: #ffa726;
        }}
        
        .comparativo-layout {{
            position: relative;
        }}
        
        .client-selector-sidebar {{
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 180px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            background: rgba(22, 33, 62, 0.95);
            border-radius: 12px;
            border: 2px solid #ff8c00;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(10px);
        }}
        
        .client-selector-sidebar h3 {{
            color: #ff8c00;
            margin-bottom: 10px;
            font-size: 0.95em;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #ff8c00;
        }}
        
        .client-selector-sidebar .client-btn {{
            flex-direction: row;
            padding: 8px 10px;
            text-align: left;
            font-size: 0.75em;
            gap: 8px;
            min-height: auto;
            justify-content: flex-start;
        }}
        
        
        .comparativo-content {{
            width: 100%;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório Completo Brudam</h1>
            <p>Período: {self.data_inicial.get()} a {self.data_final.get()}</p>
            <p>Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('geral', this)">📊 Visão Geral</button>
            <button class="tab" onclick="showTab('comparativo', this)">📈 Comparativo</button>
"""
            
            # Adicionar abas para cada cliente
            for cliente in clientes_data.keys():
                tab_id = client_slugs.get(cliente) or _slugify(cliente)
                html_content += f'            <button class="tab" onclick="showTab(\'{tab_id}\', this)">🏢 {cliente}</button>\n'
            
            html_content += """        </div>
        
        <!-- Aba Visão Geral -->
        <div id="geral" class="tab-content active">
            <div class="chart-container">
                <h2 class="chart-title">📊 Gráfico - Total por Categoria</h2>
                <canvas id="chartGeralAbertoEntregues" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📊 Resumo Geral Completo</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
            
            # Adicionar dados detalhados da visão geral
            if dados_geral:
                for item in dados_geral:
                    html_content += f"""                        <tr>
                            <td>{item['Categoria']}</td>
                            <td>{item['Em Aberto']}</td>
                            <td>{item['Entregues']}</td>
                            <td>{item['Total']}</td>
                        </tr>
"""
            
            html_content += """                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Aba Comparativo -->
        <div id="comparativo" class="tab-content">
            <div class="comparativo-layout">
                <div class="client-selector-sidebar">
                    <h3>Selecionar Clientes</h3>
"""
            
            # Adicionar botões de seleção de clientes na sidebar
            for cliente in clientes_data.keys():
                html_content += f'                    <button class="client-btn selected" data-client="{cliente}" onclick="toggleClient(this)">🏢 {cliente}</button>\n'
            
            html_content += """                </div>
                
                <div class="comparativo-content">
                    <div class="chart-container">
                        <h2 class="chart-title">📈 Gráfico Comparativo - Dentro vs Fora do Prazo</h2>
                        <button class="expand-btn" onclick="expandChart('chartComparativo')">🔍 Expandir Gráfico</button>
                        <canvas id="chartComparativo" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📊 Quadro Comparativo - Melhor ao Pior Resultado</h2>
                <button class="expand-btn" onclick="expandTable()">🔍 Expandir Tabela</button>
                <table class="data-table" id="comparativoTable">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Cliente</th>
                            <th>DENTRO DO PRAZO</th>
                            <th>DENTRO DO PRAZO - INEF. CLIENTE</th>
                            <th>FORA DO PRAZO</th>
                            <th>FORA DO PRAZO - INEF. CLIENTE</th>
                            <th>TOTAL</th>
                            <th>% Dentro do Prazo</th>
                        </tr>
                    </thead>
                    <tbody id="comparativoTableBody">
"""
            
            # Calcular métricas para comparação
            comparativo_data = []
            for cliente, dados in clientes_data.items():
                if dados['dados_detalhados']:
                    dentro_prazo = 0
                    dentro_inef = 0
                    fora_prazo = 0
                    fora_inef = 0
                    
                    for item in dados['dados_detalhados']:
                        categoria = item['Categoria']
                        valor_total = clean_value(item['Total'])
                        
                        if categoria == 'DENTRO DO PRAZO':
                            dentro_prazo += valor_total
                        elif categoria == 'DENTRO DO PRAZO - INEFICIENCIA DO CLIENTE':
                            dentro_inef += valor_total
                        elif categoria == 'FORA DO PRAZO':
                            fora_prazo += valor_total
                        elif categoria == 'FORA DO PRAZO - INEFICIENCIA DO CLIENTE':
                            fora_inef += valor_total
                    
                    # Calcular TOTAL
                    total = dentro_prazo + dentro_inef + fora_prazo + fora_inef
                    
                    # Calcular % Dentro do Prazo
                    if total > 0:
                        percentual_dentro = ((dentro_prazo + dentro_inef) / total * 100)
                    else:
                        percentual_dentro = 0.0
                    
                    comparativo_data.append({
                        'cliente': cliente,
                        'dentro_prazo': int(dentro_prazo),
                        'dentro_inef': int(dentro_inef),
                        'fora_prazo': int(fora_prazo),
                        'fora_inef': int(fora_inef),
                        'total': int(total),
                        'percentual_dentro': percentual_dentro
                    })
            
            # Ordenar do melhor ao pior (maior % dentro do prazo)
            comparativo_data.sort(key=lambda x: x['percentual_dentro'], reverse=True)
            
            # Adicionar dados ordenados na tabela
            for i, data in enumerate(comparativo_data, 1):
                html_content += f"""                        <tr>
                            <td><strong>{i}º</strong></td>
                            <td><strong>{data['cliente']}</strong></td>
                            <td>{data['dentro_prazo']}</td>
                            <td>{data['dentro_inef']}</td>
                            <td>{data['fora_prazo']}</td>
                            <td>{data['fora_inef']}</td>
                            <td>{data['total']}</td>
                            <td><strong>{data['percentual_dentro']:.1f}%</strong></td>
                        </tr>
"""
            
            html_content += """                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Modal para expandir gráficos -->
        <div id="chartModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">×</span>
                <canvas id="modalChart"></canvas>
            </div>
        </div>
        
        <!-- Modal para expandir tabela -->
        <div id="tableModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeTableModal()">×</span>
                <div id="modalTableContent"></div>
            </div>
        </div>
"""
            
            # Adicionar abas para cada cliente
            for cliente, dados in clientes_data.items():
                tab_id = client_slugs.get(cliente) or _slugify(cliente)
                html_content += f"""
        <!-- Aba {cliente} -->
        <div id="{tab_id}" class="tab-content">
            <div class="chart-container">
                <h2 class="chart-title">📈 {cliente} - Análise Completa</h2>
                <canvas id="chart{tab_id}" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">🏢 {cliente}</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Em Aberto</th>
                            <th>Entregues</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
"""
                
                for item in dados['dados_detalhados']:
                    html_content += f"""                        <tr>
                            <td>{item['Categoria']}</td>
                            <td>{item['Em Aberto']}</td>
                            <td>{item['Entregues']}</td>
                            <td>{item['Total']}</td>
                        </tr>
"""
                
                html_content += """                    </tbody>
                </table>
            </div>
        </div>
"""
            
            html_content += f"""
        <div class="footer">
            <p>Relatório Completo - Sistema Brudam</p>
            <p>Dados coletados em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</p>
        </div>
    </div>
    
    <script>
        // Variáveis globais
        let comparativoChart = null;
        const selectedClients = new Set({json.dumps(list(clientes_data.keys()))});
        
        function showTab(tabName, btn) {{
            // Esconder todas as abas
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Remover classe active de todos os botões
            const buttons = document.querySelectorAll('.tab');
            buttons.forEach(button => button.classList.remove('active'));
            
            // Mostrar aba selecionada
            document.getElementById(tabName).classList.add('active');
            
            // Adicionar classe active ao botão clicado
            if (btn) btn.classList.add('active');
        }}
        
        function toggleClient(button) {{
            const cliente = button.getAttribute('data-client');
            
            if (selectedClients.has(cliente)) {{
                selectedClients.delete(cliente);
                button.classList.remove('selected');
            }} else {{
                selectedClients.add(cliente);
                button.classList.add('selected');
            }}
            
            updateComparativoChart();
        }}
        
        function expandChart(chartId) {{
            const modal = document.getElementById('chartModal');
            const ctx = document.getElementById('modalChart').getContext('2d');
            
            // Limpar chart anterior se existir
            if (window.modalChartInstance) {{
                window.modalChartInstance.destroy();
            }}
            
            // Obter dados filtrados
            const filteredData = comparativoData.filter(d => selectedClients.has(d.cliente));
            
            // Criar novo gráfico no modal
            window.modalChartInstance = new Chart(ctx, {{
                type: 'bar',
                data: {{
                    labels: filteredData.map(d => d.cliente),
                    datasets: [{{
                        label: 'Dentro do Prazo',
                        data: filteredData.map(d => d.dentro_prazo),
                        backgroundColor: 'rgba(46, 204, 113, 0.8)',
                        borderColor: 'rgb(46, 204, 113)',
                        borderWidth: 2
                    }}, {{
                        label: 'Dentro do Prazo - Inef. Cliente',
                        data: filteredData.map(d => d.dentro_inef),
                        backgroundColor: 'rgba(52, 152, 219, 0.8)',
                        borderColor: 'rgb(52, 152, 219)',
                        borderWidth: 2
                    }}, {{
                        label: 'Fora do Prazo',
                        data: filteredData.map(d => d.fora_prazo),
                        backgroundColor: 'rgba(231, 76, 60, 0.8)',
                        borderColor: 'rgb(231, 76, 60)',
                        borderWidth: 2
                    }}, {{
                        label: 'Fora do Prazo - Inef. Cliente',
                        data: filteredData.map(d => d.fora_inef),
                        backgroundColor: 'rgba(192, 57, 43, 0.8)',
                        borderColor: 'rgb(192, 57, 43)',
                        borderWidth: 2
                    }}, {{
                        label: 'Total',
                        data: filteredData.map(d => d.total),
                        backgroundColor: 'rgba(149, 165, 166, 0.8)',
                        borderColor: 'rgb(149, 165, 166)',
                        borderWidth: 2,
                        type: 'line'
                    }}]
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {{
                        legend: {{
                            position: 'top',
                            labels: {{
                                color: '#ffffff'
                            }}
                        }},
                        title: {{
                            display: true,
                            text: 'Comparativo Completo por Cliente',
                            color: '#ffffff',
                            font: {{
                                size: 18
                            }}
                        }}
                    }},
                    scales: {{
                        y: {{
                            beginAtZero: true,
                            ticks: {{
                                color: '#ffffff'
                            }},
                            grid: {{
                                color: 'rgba(255, 255, 255, 0.1)'
                            }}
                        }},
                        x: {{
                            ticks: {{
                                color: '#ffffff'
                            }},
                            grid: {{
                                color: 'rgba(255, 255, 255, 0.1)'
                            }}
                        }}
                    }}
                }}
            }});
            
            modal.style.display = 'block';
        }}
        
        function closeModal() {{
            document.getElementById('chartModal').style.display = 'none';
        }}
        
        function expandTable() {{
            const modal = document.getElementById('tableModal');
            const table = document.getElementById('comparativoTable').cloneNode(true);
            document.getElementById('modalTableContent').innerHTML = '';
            document.getElementById('modalTableContent').appendChild(table);
            modal.style.display = 'block';
        }}
        
        function closeTableModal() {{
            document.getElementById('tableModal').style.display = 'none';
        }}
        
        // Fechar modal ao clicar fora
        window.onclick = function(event) {{
            const chartModal = document.getElementById('chartModal');
            const tableModal = document.getElementById('tableModal');
            if (event.target == chartModal) {{
                chartModal.style.display = 'none';
            }}
            if (event.target == tableModal) {{
                tableModal.style.display = 'none';
            }}
        }}
        
        // Função para criar gráficos de barras com linha de total
        function createBarChartWithTotal(ctx, title, dentroPrazo, dentroInef, foraPrazo, foraInef, semPrevisao, prazoCongelado, total) {{
            return new Chart(ctx, {{
                type: 'bar',
                data: {{
                    labels: ['DENTRO DO PRAZO', 'DENTRO DO PRAZO - INEF.', 'FORA DO PRAZO', 'FORA DO PRAZO - INEF.', 'SEM PREVISÃO', 'PRAZO CONGELADO'],
                    datasets: [{{
                        label: 'Quantidade',
                        data: [dentroPrazo, dentroInef, foraPrazo, foraInef, semPrevisao, prazoCongelado],
                        backgroundColor: function(context) {{
                            const label = context.chart.data.labels[context.dataIndex];
                            if (label.includes('FORA DO PRAZO')) return 'rgba(231, 76, 60, 0.8)';
                            if (label.includes('DENTRO DO PRAZO')) return 'rgba(46, 204, 113, 0.8)';
                            if (label.includes('SEM PREVISÃO')) return 'rgba(149, 165, 166, 0.8)';
                            if (label.includes('PRAZO CONGELADO')) return 'rgba(52, 152, 219, 0.8)';
                            return 'rgba(149, 165, 166, 0.8)';
                        }},
                        borderColor: function(context) {{
                            const label = context.chart.data.labels[context.dataIndex];
                            if (label.includes('FORA DO PRAZO')) return 'rgb(231, 76, 60)';
                            if (label.includes('DENTRO DO PRAZO')) return 'rgb(46, 204, 113)';
                            if (label.includes('SEM PREVISÃO')) return 'rgb(149, 165, 166)';
                            if (label.includes('PRAZO CONGELADO')) return 'rgb(52, 152, 219)';
                            return 'rgb(149, 165, 166)';
                        }},
                        borderWidth: 2
                    }}, {{
                        label: 'Total',
                        data: [total, total, total, total, total, total],
                        type: 'line',
                        borderColor: 'rgb(255, 140, 0)',
                        backgroundColor: 'rgba(255, 140, 0, 0.1)',
                        borderWidth: 3,
                        pointRadius: 0,
                        borderDash: [5, 5],
                        fill: false
                    }}]
                }},
                options: {{
                    responsive: true,
                    plugins: {{
                        legend: {{
                            position: 'top',
                            labels: {{
                                color: '#ffffff'
                            }}
                        }},
                        title: {{
                            display: true,
                            text: title,
                            color: '#ffffff',
                            font: {{
                                size: 16
                            }}
                        }}
                    }},
                    scales: {{
                        y: {{
                            beginAtZero: true,
                            ticks: {{
                                color: '#ffffff'
                            }},
                            grid: {{
                                color: 'rgba(255, 255, 255, 0.1)'
                            }}
                        }},
                        x: {{
                            ticks: {{
                                maxRotation: 0,
                                minRotation: 0,
                                color: '#ffffff'
                            }},
                            grid: {{
                                color: 'rgba(255, 255, 255, 0.1)'
                            }}
                        }}
                    }}
                }}
            }});
        }}
        
        // Função para criar gráficos
        function createCharts() {{
            // Dados para os gráficos
            const comparativoData = {json.dumps(comparativo_data)};
            window.comparativoData = comparativoData;
            
            // Calcular totais para o gráfico geral
            let totalDentroPrazo = 0;
            let totalDentroInef = 0;
            let totalForaPrazo = 0;
            let totalForaInef = 0;
            let totalSemPrevisao = 0;
            let totalPrazoCongelado = 0;
            let totalGeral = 0;
"""
            
            # Calcular totais gerais para o gráfico da visão geral
            total_dentro_prazo = 0
            total_dentro_inef = 0
            total_fora_prazo = 0
            total_fora_inef = 0
            total_sem_previsao = 0
            total_prazo_congelado = 0
            total_geral_value = 0
            
            if dados_geral:
                for item in dados_geral:
                    categoria = item['Categoria']
                    valor = clean_value(item['Total'])
                    
                    if categoria == 'DENTRO DO PRAZO':
                        total_dentro_prazo = int(valor)
                    elif categoria == 'DENTRO DO PRAZO - INEFICIENCIA DO CLIENTE':
                        total_dentro_inef = int(valor)
                    elif categoria == 'FORA DO PRAZO':
                        total_fora_prazo = int(valor)
                    elif categoria == 'FORA DO PRAZO - INEFICIENCIA DO CLIENTE':
                        total_fora_inef = int(valor)
                    elif categoria == 'SEM PREVISÃO':
                        total_sem_previsao = int(valor)
                    elif categoria == 'PRAZO CONGELADO':
                        total_prazo_congelado = int(valor)
                    elif categoria == 'TOTAL':
                        total_geral_value = int(valor)
            
            html_content += f"""
            // Gráfico Resumo Geral - Total por Categoria
            const ctxGeralAbertoEntregues = document.getElementById('chartGeralAbertoEntregues');
            if (ctxGeralAbertoEntregues) {{
                createBarChartWithTotal(
                    ctxGeralAbertoEntregues.getContext('2d'),
                    'Visão Geral - Total por Categoria',
                    {total_dentro_prazo},
                    {total_dentro_inef},
                    {total_fora_prazo},
                    {total_fora_inef},
                    {total_sem_previsao},
                    {total_prazo_congelado},
                    {total_geral_value}
                );
            }}
            
            // Gráfico Comparativo Geral
            const ctxComparativo = document.getElementById('chartComparativo');
            if (ctxComparativo) {{
                comparativoChart = new Chart(ctxComparativo.getContext('2d'), {{
                    type: 'bar',
                    data: {{
                        labels: comparativoData.map(d => d.cliente),
                        datasets: [{{
                            label: 'Dentro do Prazo',
                            data: comparativoData.map(d => d.dentro_prazo),
                            backgroundColor: 'rgba(46, 204, 113, 0.8)',
                            borderColor: 'rgb(46, 204, 113)',
                            borderWidth: 2
                        }}, {{
                            label: 'Dentro do Prazo - Inef. Cliente',
                            data: comparativoData.map(d => d.dentro_inef),
                            backgroundColor: 'rgba(52, 152, 219, 0.8)',
                            borderColor: 'rgb(52, 152, 219)',
                            borderWidth: 2
                        }}, {{
                            label: 'Fora do Prazo',
                            data: comparativoData.map(d => d.fora_prazo),
                            backgroundColor: 'rgba(231, 76, 60, 0.8)',
                            borderColor: 'rgb(231, 76, 60)',
                            borderWidth: 2
                        }}, {{
                            label: 'Fora do Prazo - Inef. Cliente',
                            data: comparativoData.map(d => d.fora_inef),
                            backgroundColor: 'rgba(192, 57, 43, 0.8)',
                            borderColor: 'rgb(192, 57, 43)',
                            borderWidth: 2
                        }}, {{
                            label: 'Total',
                            data: comparativoData.map(d => d.total),
                            backgroundColor: 'rgba(149, 165, 166, 0.8)',
                            borderColor: 'rgb(149, 165, 166)',
                            borderWidth: 2,
                            type: 'line'
                        }}]
                    }},
                    options: {{
                        responsive: true,
                        plugins: {{
                            legend: {{
                                position: 'top',
                                labels: {{
                                    color: '#ffffff'
                                }}
                            }},
                            title: {{
                                display: true,
                                text: 'Comparativo Completo por Cliente',
                                color: '#ffffff'
                            }}
                        }},
                        scales: {{
                            y: {{
                                beginAtZero: true,
                                ticks: {{
                                    color: '#ffffff'
                                }},
                                grid: {{
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }}
                            }},
                            x: {{
                                ticks: {{
                                    color: '#ffffff'
                                }},
                                grid: {{
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }}
                            }}
                        }}
                    }}
                }});
            }}
            
            window.updateComparativoChart = function() {{
                if (!comparativoChart) return;
                
                const filteredData = comparativoData.filter(d => selectedClients.has(d.cliente));
                
                comparativoChart.data.labels = filteredData.map(d => d.cliente);
                comparativoChart.data.datasets[0].data = filteredData.map(d => d.dentro_prazo);
                comparativoChart.data.datasets[1].data = filteredData.map(d => d.dentro_inef);
                comparativoChart.data.datasets[2].data = filteredData.map(d => d.fora_prazo);
                comparativoChart.data.datasets[3].data = filteredData.map(d => d.fora_inef);
                comparativoChart.data.datasets[4].data = filteredData.map(d => d.total);
                comparativoChart.update();
            }}
            
            // Gráficos individuais para cada cliente
"""
            
            # Adicionar gráficos individuais para cada cliente
            for cliente, dados in clientes_data.items():
                tab_id = cliente.lower().replace(" ", "_")
                
                # Calcular dados para o gráfico do cliente
                dentro_prazo = 0
                dentro_inef = 0
                fora_prazo = 0
                fora_inef = 0
                sem_previsao = 0
                prazo_congelado = 0
                total_cliente = 0
                
                for item in dados['dados_detalhados']:
                    categoria = item['Categoria']
                    valor = clean_value(item['Total'])
                    
                    if categoria == 'DENTRO DO PRAZO':
                        dentro_prazo = int(valor)
                    elif categoria == 'DENTRO DO PRAZO - INEFICIENCIA DO CLIENTE':
                        dentro_inef = int(valor)
                    elif categoria == 'FORA DO PRAZO':
                        fora_prazo = int(valor)
                    elif categoria == 'FORA DO PRAZO - INEFICIENCIA DO CLIENTE':
                        fora_inef = int(valor)
                    elif categoria == 'SEM PREVISÃO':
                        sem_previsao = int(valor)
                    elif categoria == 'PRAZO CONGELADO':
                        prazo_congelado = int(valor)
                    elif categoria == 'TOTAL':
                        total_cliente = int(valor)
                
                html_content += f"""
            // Gráfico para {cliente}
            const ctx{tab_id} = document.getElementById('chart{tab_id}');
            if (ctx{tab_id}) {{
                createBarChartWithTotal(
                    ctx{tab_id}.getContext('2d'),
                    '{cliente} - Análise Completa',
                    {dentro_prazo}, {dentro_inef}, {fora_prazo}, {fora_inef}, {sem_previsao}, {prazo_congelado}, {total_cliente}
                );
            }}
"""
            
            html_content += """        }
        
        // Aguardar carregamento da página e criar gráficos
        document.addEventListener('DOMContentLoaded', function() {
            createCharts();
        });
    </script>
</body>
</html>
"""
            
            # Salvar arquivo HTML
            html_filename = f"relatorio_completo_brudam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            html_filepath = os.path.join(os.getcwd(), html_filename)
            
            with open(html_filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            if os.path.exists(html_filepath):
                self.stats['arquivo_html_completo'] = html_filepath
                self.log_message(f"✅ Relatório HTML completo salvo: {html_filename}", "SUCCESS")
                return html_filepath
            else:
                self.log_message(f"❌ Erro: Arquivo HTML não foi criado", "ERROR")
                return None
            
        except Exception as e:
            self.log_message(f"❌ Erro ao gerar relatório HTML completo: {str(e)}", "ERROR")
            return None


    def reset_ui(self):
        """Restaura a interface após conclusão"""
        self.is_running = False
        self.start_button.config(state="normal")
        self.background_button.config(state="normal")
        self.stop_button.config(state="disabled")
        self.progress['value'] = 0
        self.progress_label.config(text="0% - Pronto para iniciar")
        self.current_status_label.config(text="✅ Processo concluído!", foreground="green")
        
        # Resetar todas as etapas
        for i in range(len(self.step_status)):
            self.step_status[i].config(text="✅", foreground="green")
        
        # Atualizar estatísticas finais
        if self.start_time:
            elapsed = datetime.now() - self.start_time
            minutes, seconds = divmod(elapsed.total_seconds(), 60)
            self.stats_labels['tempo_decorrido'].config(
                text=f"⏱️ Tempo Total: {int(minutes):02d}:{int(seconds):02d}"
            )
        
    def run(self):
        """Inicia a aplicação"""
        self.root.mainloop()

if __name__ == "__main__":
    app = BrudamAssistant()
    app.run()
