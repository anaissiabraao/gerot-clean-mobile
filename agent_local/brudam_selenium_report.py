from __future__ import annotations

import os
import json
import time
from datetime import datetime
from typing import Callable, Any
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException


def _to_ddmmyyyy(yyyy_mm_dd: str) -> str:
    # YYYY-MM-DD -> DD/MM/YYYY
    try:
        dt = datetime.strptime(yyyy_mm_dd.strip(), "%Y-%m-%d")
        return dt.strftime("%d/%m/%Y")
    except Exception:
        return yyyy_mm_dd


class BrudamSeleniumReportRunner:
    """
    Runner "core" do relatório completo do Brudam.

    Objetivo: ser executável via agent_local (sem Tkinter), mas seguindo o fluxo do automate/ia.py:
    login -> atalho 376 -> selecionar serviços -> preencher datas -> extrair tabela (brdtotais)
    + (opcional) loop por cliente -> gerar HTML completo no mesmo modelo do ia.py.
    """

    def __init__(
        self,
        *,
        url: str,
        usuario: str,
        senha: str,
        atalho: str = "376",
        headless: bool = True,
        log: Callable[[str], None] | None = None,
        progress: Callable[[int, str], None] | None = None,
        timeout_s: int = 20,
        artifacts_dir: str | None = None,
        run_tag: str | None = None,
    ):
        self.url = url
        self.usuario = usuario
        self.senha = senha
        self.atalho = atalho
        self.headless = headless
        self.timeout_s = timeout_s
        self.run_tag = run_tag or datetime.now().strftime("%Y%m%d_%H%M%S")
        base = Path(artifacts_dir) if artifacts_dir else (Path(__file__).parent / "artifacts")
        self.artifacts_dir = (base / f"selenium_{self.run_tag}").resolve()
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)
        self._profile_dir = (self.artifacts_dir / "chrome_profile").resolve()
        self._cache_dir = (self.artifacts_dir / "chrome_cache").resolve()

        self._log = log or (lambda _msg: None)
        self._progress = progress or (lambda _pct, _txt: None)

        self.driver: webdriver.Chrome | None = None

    def _setup_driver(self) -> None:
        self._progress(5, "Configurando Chrome...")
        chrome_options = Options()
        # Carregar só o necessário: reduz tempo em navegação/render (sem afetar carregamento do que é essencial).
        chrome_options.page_load_strategy = "eager"
        if self.headless:
            # Chrome moderno: new headless
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1600,1000")
        chrome_options.add_argument("--disable-notifications")
        chrome_options.add_argument("--lang=pt-BR")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-popup-blocking")
        chrome_options.add_argument("--disable-background-networking")
        chrome_options.add_argument("--disable-sync")
        chrome_options.add_argument("--metrics-recording-only")
        chrome_options.add_argument("--disable-features=Translate,OptimizationHints,MediaRouter")
        # Isolamento por execução: evita cookies/cache compartilhados entre usuários/jobs
        chrome_options.add_argument(f"--user-data-dir={str(self._profile_dir)}")
        chrome_options.add_argument(f"--disk-cache-dir={str(self._cache_dir)}")

        # Desabilitar imagens (ganho grande em páginas pesadas)
        chrome_options.add_experimental_option(
            "prefs",
            {
                "profile.managed_default_content_settings.images": 2,
                "profile.default_content_setting_values.notifications": 2,
            },
        )

        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.set_page_load_timeout(60)

    def _save_debug_artifacts(self, prefix: str) -> None:
        """Salva screenshot + HTML para diagnóstico (somente no agente local)."""
        if not self.driver:
            return
        try:
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe = "".join([c if c.isalnum() or c in ("-", "_") else "_" for c in (prefix or "debug")])[:60]
            png_path = self.artifacts_dir / f"{safe}_{ts}.png"
            html_path = self.artifacts_dir / f"{safe}_{ts}.html"
            try:
                self.driver.save_screenshot(str(png_path))
                self._log(f"🧩 Artifact: screenshot salvo em {png_path}")
            except Exception:
                pass
            try:
                src = self.driver.page_source or ""
                html_path.write_text(src, encoding="utf-8", errors="ignore")
                self._log(f"🧩 Artifact: HTML salvo em {html_path}")
            except Exception:
                pass
            try:
                url = self.driver.current_url
                (self.artifacts_dir / f"{safe}_{ts}.url.txt").write_text(url, encoding="utf-8", errors="ignore")
            except Exception:
                pass
        except Exception:
            return

    def _is_visible(self, by: By, value: str) -> bool:
        if not self.driver:
            return False
        try:
            el = self.driver.find_element(by, value)
            return bool(el.is_displayed())
        except Exception:
            return False

    def _maybe_handle_auth_dialogs(self) -> bool:
        """
        Alguns logins exigem autorização/2FA após clicar em "Acessar Sistema".
        Se houver código via env, tenta preencher automaticamente.

        Env suportadas:
        - BRUDAM_AUTH_CODE  (dialog #authorization / input#code / button#authorize)
        - BRUDAM_2FA_CODE   (dialog #auth_2fa_dialog / input#auth_2fa_code / button#auth_2fa_confirm)
        """
        if not self.driver:
            return False

        try:
            self.driver.switch_to.default_content()
        except Exception:
            pass

        auth_code = (os.getenv("BRUDAM_AUTH_CODE") or "").strip()
        twofa_code = (os.getenv("BRUDAM_2FA_CODE") or "").strip()

        # Dialog "authorization"
        try:
            if self._is_visible(By.ID, "authorization"):
                self._log("🔐 Dialogo de autorização detectado.")
                if not auth_code:
                    self._log("⚠️ BRUDAM_AUTH_CODE não configurado; não consigo avançar automaticamente.")
                    return True
                try:
                    inp = self.driver.find_element(By.ID, "code")
                    btn = self.driver.find_element(By.ID, "authorize")
                    inp.clear()
                    inp.send_keys(auth_code)
                    btn.click()
                    self._log("✅ Código de autorização enviado.")
                    return True
                except Exception:
                    return True
        except Exception:
            pass

        # Dialog "2FA"
        try:
            if self._is_visible(By.ID, "auth_2fa_dialog"):
                self._log("🔐 Dialogo 2FA detectado.")
                if not twofa_code:
                    self._log("⚠️ BRUDAM_2FA_CODE não configurado; não consigo avançar automaticamente.")
                    return True
                try:
                    inp = self.driver.find_element(By.ID, "auth_2fa_code")
                    btn = self.driver.find_element(By.ID, "auth_2fa_confirm")
                    inp.clear()
                    inp.send_keys(twofa_code)
                    btn.click()
                    self._log("✅ Código 2FA enviado.")
                    return True
                except Exception:
                    return True
        except Exception:
            pass

        return False
        try:
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            out_dir = os.path.join(os.getcwd(), "artifacts")
            os.makedirs(out_dir, exist_ok=True)
            png_path = os.path.join(out_dir, f"{prefix}_{ts}.png")
            html_path = os.path.join(out_dir, f"{prefix}_{ts}.html")
            try:
                self.driver.save_screenshot(png_path)
            except Exception:
                png_path = ""
            try:
                with open(html_path, "w", encoding="utf-8") as f:
                    f.write(self.driver.page_source or "")
            except Exception:
                html_path = ""
            if png_path:
                self._log(f"🧾 Debug screenshot salvo: {png_path}")
            if html_path:
                self._log(f"🧾 Debug HTML salvo: {html_path}")
        except Exception:
            return

    def _close_search_popup(self) -> None:
        if not self.driver:
            return
        try:
            self._log("🔍 Verificando pop-up de busca...")
            # Evitar sleep fixo: tenta fechar rápido (quando existir)
            time.sleep(0.2)
            popup_selectors = [
                "button.ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close",
                "button[title='Close']",
                ".ui-dialog-titlebar-close",
                ".ui-icon-closethick",
                "button.ui-button[title='Close']",
                "span.ui-icon-closethick",
            ]
            for selector in popup_selectors:
                try:
                    popup_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for el in popup_elements:
                        try:
                            if el.is_displayed() and el.is_enabled():
                                el.click()
                                self._log(f"✅ Pop-up fechado: {selector}")
                                time.sleep(0.2)
                                return
                        except Exception:
                            continue
                except Exception:
                    continue
            # fallback: ESC
            try:
                from selenium.webdriver.common.keys import Keys

                body = self.driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.ESCAPE)
            except Exception:
                pass
        except Exception:
            return

    def login(self) -> bool:
        assert self.driver
        self._progress(10, "Acessando Brudam / login...")
        self._log(f"🌐 Abrindo URL: {self.url}")
        self.driver.get(self.url)

        try:
            WebDriverWait(self.driver, 15).until(EC.presence_of_element_located((By.ID, "user")))
        except TimeoutException:
            self._log("⚠️ Timeout no carregamento do login, tentando novamente...")
            time.sleep(5)
            try:
                WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "user")))
            except TimeoutException:
                self._log("❌ Falha no carregamento do login")
                return False

        self._progress(15, "Preenchendo credenciais...")
        user_field = self.driver.find_element(By.ID, "user")
        user_field.clear()
        user_field.send_keys(self.usuario)

        password_field = self.driver.find_element(By.ID, "password")
        password_field.clear()
        password_field.send_keys(self.senha)
        # Primeiro, tenta enter (alguns setups submetem aqui)
        try:
            password_field.send_keys(Keys.ENTER)
        except Exception:
            password_field.send_keys("\n")

        # Algumas instâncias do Brudam exigem um clique em "Acessar Sistema" após autenticar.
        # (Caso contrário, o campo de atalho não aparece.)
        self._progress(18, "Validando acesso ao sistema...")
        # "Login strong": tenta múltiplas formas de submissão/click
        self._ensure_logged_in_or_advance()
        self._maybe_handle_auth_dialogs()

        # Evitar sleep longo: espera o "home" após login (campo de atalho ou similar)
        try:
            WebDriverWait(self.driver, 25, poll_frequency=0.2).until(
                EC.any_of(
                    EC.presence_of_element_located((By.ID, "codigo_opcao")),
                    EC.presence_of_element_located((By.CLASS_NAME, "classIMPUT2")),
                    EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Atalho']")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "a#acessar")),
                    EC.visibility_of_element_located((By.ID, "authorization")),
                    EC.visibility_of_element_located((By.ID, "auth_2fa_dialog")),
                )
            )
        except Exception:
            # mantém compatibilidade: alguns ambientes não expõem o campo de atalho imediatamente
            time.sleep(0.6)

        # Se ainda estiver na tela do botão/campos, tenta novamente
        self._ensure_logged_in_or_advance()
        self._maybe_handle_auth_dialogs()
        self._log(f"📍 URL após login: {self.driver.current_url}")
        self._progress(20, "Login concluído (ou em validação)...")
        return True

    def _maybe_click_acessar_sistema(self) -> bool:
        """Clica no botão/link 'Acessar Sistema' se ele estiver presente."""
        if not self.driver:
            return False
        try:
            self.driver.switch_to.default_content()
        except Exception:
            pass

        # Se ainda estiver no formulário de login, o botão existe e precisa ser clicado
        try:
            if self.driver.find_elements(By.ID, "user") or self.driver.find_elements(By.ID, "password"):
                pass
        except Exception:
            pass

        # Esperar o botão existir (sem sleep fixo)
        try:
            el = WebDriverWait(self.driver, 8, poll_frequency=0.2).until(
                EC.any_of(
                    EC.presence_of_element_located((By.ID, "acessar")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "a#acessar")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "a.btn-acessar")),
                    EC.presence_of_element_located((By.XPATH, "//a[@id='acessar' or @name='acessar' or contains(., 'Acessar Sistema')]")),
                )
            )
            candidates = [el]
        except Exception:
            candidates = []

        for el in candidates[:3]:
            try:
                if not el.is_displayed() or not el.is_enabled():
                    continue
            except Exception:
                continue

            try:
                self._log("➡️ Clicando em 'Acessar Sistema'...")
                try:
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
                except Exception:
                    pass
                try:
                    el.click()
                except Exception:
                    # fallback JS click
                    self.driver.execute_script("arguments[0].click();", el)

                # "Strong click": dispatch event + jQuery trigger (se existir)
                try:
                    self.driver.execute_script(
                        """
                        const el = arguments[0];
                        try {
                          el.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, view:window}));
                        } catch(e) {}
                        try {
                          if (window.$) { window.$(el).trigger('click'); window.$(el).click(); }
                        } catch(e) {}
                        """,
                        el,
                    )
                except Exception:
                    pass

                # Aguarda curto pós-clique (a espera longa fica centralizada no _ensure_logged_in_or_advance)
                try:
                    WebDriverWait(self.driver, 5, poll_frequency=0.2).until(
                        EC.any_of(
                            EC.presence_of_element_located((By.ID, "codigo_opcao")),
                            EC.presence_of_element_located((By.CLASS_NAME, "classIMPUT2")),
                            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Atalho']")),
                            EC.invisibility_of_element(el),
                            EC.visibility_of_element_located((By.ID, "authorization")),
                            EC.visibility_of_element_located((By.ID, "auth_2fa_dialog")),
                            EC.invisibility_of_element_located((By.ID, "user")),
                        )
                    )
                except Exception:
                    pass

                self._log("✅ 'Acessar Sistema' acionado.")
                return True
            except Exception:
                continue

        return False

    def _ensure_logged_in_or_advance(self) -> None:
        """
        Garante tentativa de avançar da tela de login para o sistema.
        Se ficar preso na tela (campo #user visível), tenta múltiplas estratégias.
        """
        if not self.driver:
            return

        # Loop curto: tenta avançar algumas vezes (sem duplicar waits longos)
        for attempt in range(1, 4):
            try:
                if not self._is_visible(By.ID, "user"):
                    return
            except Exception:
                pass

            self._log(f"🔄 Tentativa {attempt}/3 para sair do login (clicar/submeter)...")

            # 1) clicar no "Acessar Sistema"
            self._maybe_click_acessar_sistema()
            self._maybe_handle_auth_dialogs()

            # 2) submit do formulário (se existir)
            try:
                self.driver.execute_script(
                    """
                    const f = document.querySelector('form');
                    if (f && typeof f.submit === 'function') { f.submit(); return true; }
                    return false;
                    """
                )
            except Exception:
                pass

            # 3) Enter no campo senha, de novo (às vezes o JS só liga após click)
            try:
                pwd = self.driver.find_element(By.ID, "password")
                pwd.send_keys(Keys.ENTER)
            except Exception:
                pass

            # Espera longa controlada (handoff pode levar ~15s em alguns ambientes)
            try:
                self._progress(19, "Aguardando carregamento pós-login…")
            except Exception:
                pass
            try:
                # Esse "handoff" pode levar ~15s em alguns ambientes do Brudam
                WebDriverWait(self.driver, 18, poll_frequency=0.2).until(
                    EC.any_of(
                        EC.invisibility_of_element_located((By.ID, "user")),
                        EC.presence_of_element_located((By.ID, "codigo_opcao")),
                        EC.presence_of_element_located((By.CLASS_NAME, "classIMPUT2")),
                        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Atalho']")),
                        EC.visibility_of_element_located((By.ID, "authorization")),
                        EC.visibility_of_element_located((By.ID, "auth_2fa_dialog")),
                    )
                )
            except Exception:
                pass

        # Se ainda assim ficou preso no login, gerar debug explícito
        try:
            if self._is_visible(By.ID, "user"):
                self._log("❌ Ainda preso na tela de login após múltiplas tentativas.")
                self._save_debug_artifacts("brudam_stuck_login")
        except Exception:
            pass

    def _find_atalho_field(self):
        """Tenta localizar o campo de atalho no documento ou em iframes (mais robusto)."""
        assert self.driver
        self.driver.switch_to.default_content()

        def _matches_input(el) -> bool:
            try:
                _id = (el.get_attribute("id") or "").lower()
                _name = (el.get_attribute("name") or "").lower()
                _ph = (el.get_attribute("placeholder") or "").lower()
                _cls = (el.get_attribute("class") or "").lower()
                return (
                    "codigo_opcao" in _id
                    or "codigo_opcao" in _name
                    or "atalho" in _ph
                    or "classimput2" in _cls
                )
            except Exception:
                return False

        def _try_find_in_current():
            try:
                return self.driver.find_element(By.ID, "codigo_opcao")
            except Exception:
                pass
            for finder in (
                lambda: self.driver.find_element(By.CLASS_NAME, "classIMPUT2"),
                lambda: self.driver.find_element(By.XPATH, "//input[@placeholder='Atalho']"),
                lambda: self.driver.find_element(By.NAME, "codigo_opcao"),
            ):
                try:
                    return finder()
                except Exception:
                    continue
            # fallback: varrer inputs e tentar achar por atributos
            try:
                inputs = self.driver.find_elements(By.CSS_SELECTOR, "input")
                for el in inputs[:200]:
                    if _matches_input(el):
                        return el
            except Exception:
                pass
            # fallback JS: querySelector por placeholder/atributos
            try:
                el = self.driver.execute_script(
                    """
                    const candidates = Array.from(document.querySelectorAll('input'));
                    function m(i){
                      const id=(i.id||'').toLowerCase();
                      const nm=(i.name||'').toLowerCase();
                      const ph=(i.placeholder||'').toLowerCase();
                      const cls=(i.className||'').toLowerCase();
                      return id.includes('codigo_opcao') || nm.includes('codigo_opcao') || ph.includes('atalho') || cls.includes('classimput2');
                    }
                    return candidates.find(m) || null;
                    """
                )
                if el:
                    return el
            except Exception:
                pass
            return None

        el = _try_find_in_current()
        if el:
            return el

        # tenta em iframes
        try:
            frames = self.driver.find_elements(By.TAG_NAME, "iframe")
        except Exception:
            frames = []
        for fr in frames[:8]:
            try:
                self.driver.switch_to.default_content()
                self.driver.switch_to.frame(fr)
                el = _try_find_in_current()
                if el:
                    return el
            except Exception:
                continue
        self.driver.switch_to.default_content()
        return None

    def navigate_to_atalho(self) -> bool:
        assert self.driver
        self._progress(25, f"Navegando para atalho {self.atalho}...")
        current_url = self.driver.current_url

        # Diagnóstico rápido: estamos ainda na tela de login?
        try:
            if self.driver.find_elements(By.ID, "user"):
                self._log("⚠️ Ainda parece estar na tela de login (campo #user presente).")
        except Exception:
            pass
        try:
            self._log(f"🧭 Página atual: url={self.driver.current_url} title={self.driver.title}")
        except Exception:
            pass

        atalho_field = None
        # espera curta + busca robusta (documento + iframes)
        t0 = time.time()
        while time.time() - t0 < 12:
            # Se ainda estivermos na tela de login, tenta clicar novamente em "Acessar Sistema"
            try:
                if self.driver.find_elements(By.ID, "acessar"):
                    self._maybe_click_acessar_sistema()
                    self._maybe_handle_auth_dialogs()
            except Exception:
                pass
            atalho_field = self._find_atalho_field()
            if atalho_field:
                break
            time.sleep(0.2)

        if not atalho_field:
            self._log("❌ Campo de atalho não encontrado")
            self._save_debug_artifacts("brudam_atalho_not_found")
            return False

        # Preencher mais rápido (JS) + Enter
        try:
            atalho_field.click()
            self.driver.execute_script("arguments[0].value = '';", atalho_field)
            self.driver.execute_script("arguments[0].value = arguments[1];", atalho_field, self.atalho)
            atalho_field.send_keys("\n")
        except Exception:
            atalho_field.click()
            atalho_field.clear()
            atalho_field.send_keys(self.atalho)
            atalho_field.send_keys("\n")

        try:
            WebDriverWait(self.driver, 8).until(
                EC.any_of(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input.brd-data")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[value='PESQUISAR']")),
                    EC.presence_of_element_located((By.ID, "contents")),
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input.brd-input-submit-required")),
                )
            )
            self._progress(30, "Janela carregada")
            return True
        except TimeoutException:
            if self.driver.current_url != current_url:
                self._progress(30, "Janela carregada (URL mudou)")
                return True
            self._log("⚠️ Janela pode não ter carregado completamente")
            return True

    def fill_dates_and_search(self, data_ini_ddmmyyyy: str, data_fim_ddmmyyyy: str) -> bool:
        assert self.driver
        self._progress(35, "Selecionando serviços + preenchendo datas...")
        time.sleep(0.2)

        # Abrir seleção de serviços (se existir)
        try:
            servicos_btn = WebDriverWait(self.driver, 8).until(EC.element_to_be_clickable((By.ID, "selecionaServico")))
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", servicos_btn)
            time.sleep(0.2)
            servicos_btn.click()
            time.sleep(0.2)
        except Exception:
            pass

        servicos_alvos = [
            {"id": "servicos_0", "text": "EXPRESSO_250"},
            {"id": "servicos_2", "text": "ECONOMICO_250"},
            {"id": "servicos_6", "text": "SUBCONTRATO_ECONOMICO"},
            {"id": "servicos_7", "text": "SUBCONTRATO_EXPRESSO"},
            {"id": "servicos_8", "text": "SUBCONTRATO_PERSONALIZADO"},
            {"id": "servicos_9", "text": "PERSONALIZADO"},
            {"id": "servicos_10", "text": "EXPRESSO_200"},
        ]
        for item in servicos_alvos:
            try:
                checkbox = self.driver.find_element(By.ID, item["id"])
                if not checkbox.is_selected():
                    try:
                        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox)
                        time.sleep(0.05)
                        checkbox.click()
                    except Exception:
                        try:
                            label_el = self.driver.find_element(By.XPATH, f"//label[@for='{item['id']}']")
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", label_el)
                            time.sleep(0.05)
                            label_el.click()
                        except Exception:
                            pass
                time.sleep(0.03)
            except Exception:
                continue

        # Campos de data
        data_fields = []
        try:
            data_fields = self.driver.find_elements(By.CSS_SELECTOR, "input.brd-data")
        except Exception:
            data_fields = []

        if len(data_fields) < 2:
            # fallback por name
            try:
                data_fields = self.driver.find_elements(By.XPATH, "//input[contains(@name,'data')]")
            except Exception:
                data_fields = []

        if len(data_fields) >= 2:
            ini_field = data_fields[0]
            fim_field = data_fields[1]
            for field, val in ((ini_field, data_ini_ddmmyyyy), (fim_field, data_fim_ddmmyyyy)):
                try:
                    field.click()
                    # set via JS é mais rápido e evita máscara/latência
                    self.driver.execute_script("arguments[0].value = arguments[1];", field, val)
                    time.sleep(0.03)
                except Exception:
                    pass

        # Botão pesquisar
        self._progress(45, "Executando pesquisa...")
        search_btn = None
        for selector in (
            (By.CSS_SELECTOR, "input[value='PESQUISAR']"),
            (By.CSS_SELECTOR, "input.brd-input-submit-required"),
            (By.XPATH, "//input[contains(@value,'PESQUISAR')]"),
        ):
            try:
                search_btn = WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable(selector))
                break
            except Exception:
                continue
        if not search_btn:
            self._log("❌ Botão PESQUISAR não encontrado")
            return False

        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", search_btn)
        time.sleep(0.1)
        search_btn.click()
        # Esperar a tabela realmente aparecer/atualizar (sem sleep fixo)
        try:
            WebDriverWait(self.driver, 20, poll_frequency=0.2).until(EC.presence_of_element_located((By.ID, "brdtotais")))
        except Exception:
            pass
        self._close_search_popup()
        return True

    def extract_table_data(self) -> list[dict[str, str]]:
        assert self.driver
        self._progress(55, "Extraindo tabela (brdtotais)...")
        WebDriverWait(self.driver, 15, poll_frequency=0.2).until(EC.presence_of_element_located((By.ID, "contents")))
        self._close_search_popup()
        
        # Diagnóstico: verificar se há mensagens de "sem resultados" ou "vazio"
        try:
            page_text = self.driver.find_element(By.TAG_NAME, "body").text.lower()
            empty_indicators = ["nenhum", "sem resultados", "não há", "vazio", "sem registros", "0 registros"]
            for indicator in empty_indicators:
                if indicator in page_text:
                    self._log(f"⚠️ Indicador de página vazia encontrado: '{indicator}' no texto da página")
        except Exception:
            pass
        
        # Diagnóstico: verificar se a tabela existe
        tbl = None
        try:
            tbl = self.driver.find_element(By.ID, "brdtotais")
            self._log(f"✓ Tabela #brdtotais encontrada")
        except Exception as e:
            self._log(f"❌ Tabela #brdtotais NÃO encontrada: {e}")
            # Tentar encontrar tabelas alternativas
            try:
                all_tables = self.driver.find_elements(By.TAG_NAME, "table")
                self._log(f"📊 Total de tabelas encontradas na página: {len(all_tables)}")
                for i, t in enumerate(all_tables[:5]):
                    try:
                        tbl_id = t.get_attribute("id") or "(sem id)"
                        tbl_class = t.get_attribute("class") or "(sem class)"
                        self._log(f"  Tabela {i+1}: id={tbl_id}, class={tbl_class[:50]}")
                    except Exception:
                        pass
            except Exception:
                pass
            # Salvar artifacts para debug
            self._save_debug_artifacts("brudam_table_not_found")
            return []
        
        # Espera ativa: garante que a tabela tenha linhas (evita ler "vazio" cedo demais)
        def _rows_ready(_driver):
            try:
                if not tbl:
                    tbl2 = _driver.find_element(By.ID, "brdtotais")
                else:
                    tbl2 = tbl
                rows = tbl2.find_elements(By.TAG_NAME, "tr")
                count = len(rows) if rows else 0
                if count >= 2:
                    return rows
                return False
            except Exception as e:
                return False

        try:
            rows = WebDriverWait(self.driver, 20, poll_frequency=0.2).until(_rows_ready)
            self._log(f"✓ Linhas da tabela encontradas: {len(rows)} linhas")
        except TimeoutException:
            self._log("❌ Timeout: Tabela não possui linhas suficientes (esperava >= 2 linhas)")
            # Tentar pegar o que há mesmo assim
            try:
                if not tbl:
                    tbl = self.driver.find_element(By.ID, "brdtotais")
                rows = tbl.find_elements(By.TAG_NAME, "tr")
                self._log(f"⚠️ Linhas encontradas mesmo após timeout: {len(rows)} linhas")
                if len(rows) < 2:
                    self._save_debug_artifacts("brudam_table_empty")
                    return []
            except Exception as e:
                self._log(f"❌ Erro ao tentar recuperar linhas: {e}")
                self._save_debug_artifacts("brudam_table_error")
                return []

        data: list[dict[str, str]] = []
        for idx, row in enumerate(rows[1:], start=2):  # Pula header (linha 1)
            try:
                cells = row.find_elements(By.TAG_NAME, "td")
                cell_count = len(cells)
                if cell_count >= 4:
                    row_data = {
                        "Categoria": cells[0].text.strip(),
                        "Em Aberto": cells[1].text.strip(),
                        "Entregues": cells[2].text.strip(),
                        "Total": cells[3].text.strip(),
                    }
                    data.append(row_data)
                    # Log das primeiras 3 linhas para diagnóstico
                    if len(data) <= 3:
                        self._log(f"  Linha {idx}: {row_data}")
                else:
                    self._log(f"⚠️ Linha {idx} tem apenas {cell_count} células (esperava >= 4)")
            except Exception as e:
                self._log(f"❌ Erro ao processar linha {idx}: {e}")
                continue
        
        self._log(f"✓ Total de registros extraídos: {len(data)}")
        if len(data) == 0:
            self._log("⚠️ ATENÇÃO: Nenhum registro foi extraído da tabela")
            # Tentar diagnosticar por que está vazio
            try:
                if not tbl:
                    tbl = self.driver.find_element(By.ID, "brdtotais")
                table_html = tbl.get_attribute("outerHTML")[:500]
                self._log(f"📄 Primeiros 500 chars do HTML da tabela: {table_html}")
            except Exception:
                pass
        
        return data

    def search_client_data(self, cliente: str) -> list[dict[str, str]] | None:
        assert self.driver
        self._progress(65, f"Buscando cliente: {cliente}")
        try:
            # Campo texto do cliente (varia, mas o ia.py usa "cliente" e buscas por input)
            # Tentativas de seletores: name/id/class comuns
            input_el = None
            for sel in (
                (By.ID, "cliente"),
                (By.NAME, "cliente"),
                (By.CSS_SELECTOR, "input[name='cliente']"),
                (By.XPATH, "//input[contains(@name,'cliente') or contains(@id,'cliente')]"),
            ):
                try:
                    input_el = WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable(sel))
                    break
                except Exception:
                    continue

            if not input_el:
                self._log("⚠️ Campo de cliente não encontrado; pulando clientes.")
                return None

            input_el.click()
            input_el.clear()
            input_el.send_keys(cliente)
            time.sleep(0.05)

            # Botão pesquisar (reusa mesmo botão)
            btn = None
            for selector in (
                (By.CSS_SELECTOR, "input[value='PESQUISAR']"),
                (By.CSS_SELECTOR, "input.brd-input-submit-required"),
                (By.XPATH, "//input[contains(@value,'PESQUISAR')]"),
            ):
                try:
                    btn = WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable(selector))
                    break
                except Exception:
                    continue
            if btn:
                btn.click()
            # Espera ativa para a tabela atualizar (bem mais rápido que sleep fixo)
            WebDriverWait(self.driver, 30, poll_frequency=0.2).until(EC.presence_of_element_located((By.ID, "contents")))
            self._close_search_popup()

            def _rows_ready(_driver):
                try:
                    tbl = _driver.find_element(By.ID, "brdtotais")
                    rows = tbl.find_elements(By.TAG_NAME, "tr")
                    return rows if rows and len(rows) >= 2 else False
                except Exception:
                    return False

            rows = WebDriverWait(self.driver, 30, poll_frequency=0.2).until(_rows_ready)

            data: list[dict[str, str]] = []
            for row in rows[1:]:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 4:
                    data.append(
                        {
                            "Categoria": cells[0].text.strip(),
                            "Em Aberto": cells[1].text.strip(),
                            "Entregues": cells[2].text.strip(),
                            "Total": cells[3].text.strip(),
                        }
                    )
            return data
        except Exception as e:
            self._log(f"❌ Erro ao buscar dados do cliente {cliente}: {e}")
            return None

    def close(self) -> None:
        try:
            if self.driver:
                self.driver.quit()
        finally:
            self.driver = None


def run_brudam_selenium_complete_report(
    *,
    data_inicio: str,
    data_fim: str,
    modo: str,
    headless: bool,
    clientes: list[str],
    credentials: dict[str, str],
    log: Callable[[str], None] | None = None,
    progress: Callable[[int, str], None] | None = None,
    run_tag: str | None = None,
) -> dict[str, Any]:
    log = log or (lambda _msg: None)
    progress = progress or (lambda _pct, _txt: None)

    url = credentials.get("url") or os.getenv("BRUDAM_URL", "https://azportoex.brudam.com.br/index.php")
    # IMPORTANTE: não manter credenciais hardcoded no repo.
    usuario = credentials.get("usuario") or os.getenv("BRUDAM_USUARIO", "")
    senha = credentials.get("senha") or os.getenv("BRUDAM_SENHA", "")

    runner = BrudamSeleniumReportRunner(
        url=url,
        usuario=usuario,
        senha=senha,
        atalho="376",
        headless=headless,
        log=log,
        progress=progress,
        run_tag=run_tag,
    )

    ini_ddmmyyyy = _to_ddmmyyyy(data_inicio)
    fim_ddmmyyyy = _to_ddmmyyyy(data_fim)

    try:
        runner._setup_driver()
        if not runner.login():
            raise RuntimeError("Falha no login")
        if not runner.navigate_to_atalho():
            raise RuntimeError("Falha ao navegar para a janela 376")
        if not runner.fill_dates_and_search(ini_ddmmyyyy, fim_ddmmyyyy):
            raise RuntimeError("Falha ao preencher datas/pesquisar")

        dados_geral = runner.extract_table_data()
        dados_clientes: dict[str, list[dict[str, str]]] = {}

        # Fail-fast: se não houver dados relevantes, gerar artifacts e falhar explicitamente
        def _parse_int(s: str) -> int:
            try:
                ss = (s or "").strip()
                ss = ss.split(" ")[0]  # remove "(xx%)"
                ss = ss.replace(".", "").replace(",", "")
                return int(ss) if ss else 0
            except Exception:
                return 0

        runner._log(f"📊 Registros brutos extraídos: {len(dados_geral or [])}")
        if dados_geral:
            runner._log(f"📋 Primeiros registros: {json.dumps(dados_geral[:3], ensure_ascii=False, indent=2)}")
        
        total_sum = 0
        for idx, row in enumerate(dados_geral or [], start=1):
            total_val = str(row.get("Total") or "0")
            parsed = _parse_int(total_val)
            total_sum += parsed
            runner._log(f"  Linha {idx}: Total='{total_val}' → parsed={parsed}")
        
        runner._log(f"🔢 Soma total de todos os registros: {total_sum}")
        
        if total_sum <= 0:
            runner._log("⚠️ Nenhum dado encontrado na tabela (totais=0). Diagnóstico:")
            runner._log(f"   - Registros extraídos: {len(dados_geral or [])}")
            runner._log(f"   - Soma dos totais: {total_sum}")
            if dados_geral:
                runner._log(f"   - Exemplo de registro: {dados_geral[0] if dados_geral else 'N/A'}")
            
            # Verificar se há mensagens de erro na página
            try:
                page_source_snippet = runner.driver.page_source[:2000].lower()
                error_keywords = ["erro", "error", "sem resultados", "nenhum", "não encontrado"]
                found_errors = [kw for kw in error_keywords if kw in page_source_snippet]
                if found_errors:
                    runner._log(f"   - Palavras-chave de erro encontradas na página: {found_errors}")
            except Exception:
                pass
            
            runner._log("💾 Salvando artifacts para debug...")
            runner._save_debug_artifacts("brudam_zero_data")
            raise RuntimeError(f"Nenhum dado retornado pelo Brudam para o período/filtros (totais=0, registros={len(dados_geral or [])})")

        if modo == "completo":
            for idx, cliente in enumerate(clientes, start=1):
                pct = 65 + int((idx / max(len(clientes), 1)) * 25)
                progress(pct, f"Cliente {idx}/{len(clientes)}: {cliente}")
                data_cliente = runner.search_client_data(cliente)
                if data_cliente:
                    dados_clientes[cliente] = data_cliente

        progress(92, "Gerando HTML completo...")
        return {
            "data_inicio_ddmmyyyy": ini_ddmmyyyy,
            "data_fim_ddmmyyyy": fim_ddmmyyyy,
            "dados_geral": dados_geral,
            "dados_clientes": dados_clientes,
        }
    finally:
        runner.close()

