const storageKeys = {
  apiBaseUrl: "api_base_url",
  accessToken: "auth_token",
  refreshToken: "refresh_token",
};

function getDefaultApiBaseUrl() {
  const fromConfig = window.APP_CONFIG && window.APP_CONFIG.apiBaseUrl;
  if (fromConfig) return fromConfig.replace(/\/$/, "");
  const fromQuery = new URLSearchParams(window.location.search).get("api");
  if (fromQuery) return fromQuery.replace(/\/$/, "");
  return "http://localhost:3000/api";
}

function getApiBaseUrl() {
  return (localStorage.getItem(storageKeys.apiBaseUrl) || getDefaultApiBaseUrl()).replace(/\/$/, "");
}

function setApiBaseUrl(value) {
  localStorage.setItem(storageKeys.apiBaseUrl, value.replace(/\/$/, ""));
}

function setSession(accessToken, refreshToken) {
  localStorage.setItem(storageKeys.accessToken, accessToken);
  localStorage.setItem(storageKeys.refreshToken, refreshToken);
}

function clearSession() {
  localStorage.removeItem(storageKeys.accessToken);
  localStorage.removeItem(storageKeys.refreshToken);
}

function accessToken() {
  return localStorage.getItem(storageKeys.accessToken);
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken() ? { Authorization: `Bearer ${accessToken()}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

function renderResult(targetId, payload) {
  document.getElementById(targetId).textContent =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
}

document.getElementById("apiBaseUrl").value = getApiBaseUrl();

document.getElementById("saveApiUrl").addEventListener("click", () => {
  const value = document.getElementById("apiBaseUrl").value.trim();
  if (!value) return;
  setApiBaseUrl(value);
  renderResult("healthResult", { ok: true, apiBaseUrl: getApiBaseUrl() });
});

document.getElementById("checkHealth").addEventListener("click", async () => {
  try {
    const baseWithoutApi = getApiBaseUrl().replace(/\/api$/, "");
    const response = await fetch(`${baseWithoutApi}/health`);
    const payload = await response.json();
    renderResult("healthResult", payload);
  } catch (error) {
    renderResult("healthResult", { ok: false, error: error.message });
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (payload.accessToken && payload.refreshToken) {
      setSession(payload.accessToken, payload.refreshToken);
    }
    renderResult("authResult", payload);
  } catch (error) {
    renderResult("authResult", { ok: false, error: error.message });
  }
});

document.getElementById("profileBtn").addEventListener("click", async () => {
  try {
    const payload = await apiRequest("/auth/profile");
    renderResult("authResult", payload);
  } catch (error) {
    renderResult("authResult", { ok: false, error: error.message });
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const refreshToken = localStorage.getItem(storageKeys.refreshToken);
    if (refreshToken) {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    // Falha no logout remoto não deve impedir limpeza local.
    console.warn("Falha ao efetuar logout remoto:", error.message);
  } finally {
    clearSession();
    renderResult("authResult", { ok: true, message: "Sessão encerrada" });
  }
});
