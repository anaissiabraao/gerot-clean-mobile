/**
 * Cliente API para integração com backend Node.js
 * Sistema TMS VCI TRANSPORTES
 */

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  /**
   * Faz requisição HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Se token expirado, tentar renovar
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Tentar novamente com novo token
            config.headers.Authorization = `Bearer ${this.token}`;
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        }
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  /**
   * Renova token de acesso
   */
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      const data = await response.json();
      
      if (response.ok && data.accessToken) {
        this.token = data.accessToken;
        localStorage.setItem('auth_token', data.accessToken);
        return true;
      }

      // Se refresh falhou, limpar sessão local sem redirecionar imediato
      this.clearSession(false);
      return false;
    } catch (error) {
      this.clearSession(false);
      return false;
    }
  }

  /**
   * Salva tokens
   */
  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Remove tokens
   */
  clearSession(redirectToLogin = true) {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  }

  // ============================================
  // AUTENTICAÇÃO
  // ============================================

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async logout() {
    if (this.refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken })
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
    this.clearSession();
  }

  // ============================================
  // CLIENTES
  // ============================================

  async getClients(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/clients${query ? `?${query}` : ''}`);
  }

  async getClient(id) {
    return await this.request(`/clients/${id}`);
  }

  async createClient(clientData) {
    return await this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  }

  async updateClient(id, clientData) {
    return await this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData)
    });
  }

  async deleteClient(id) {
    return await this.request(`/clients/${id}`, {
      method: 'DELETE'
    });
  }

  // ============================================
  // COTAÇÕES
  // ============================================

  async getQuotes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/quotes${query ? `?${query}` : ''}`);
  }

  async getQuote(id) {
    return await this.request(`/quotes/${id}`);
  }

  async createQuote(quoteData) {
    return await this.request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
  }

  async updateQuote(id, quoteData) {
    return await this.request(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData)
    });
  }

  async deleteQuote(id) {
    return await this.request(`/quotes/${id}`, {
      method: 'DELETE'
    });
  }

  // ============================================
  // NOTAS FISCAIS
  // ============================================

  async getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/invoices${query ? `?${query}` : ''}`);
  }

  async getInvoice(id) {
    return await this.request(`/invoices/${id}`);
  }

  async createInvoice(invoiceData) {
    return await this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });
  }

  async updateInvoice(id, invoiceData) {
    return await this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData)
    });
  }

  // ============================================
  // CT-e
  // ============================================

  async emitirCte(cteData) {
    return await this.request('/cte/emitir', {
      method: 'POST',
      body: JSON.stringify(cteData)
    });
  }

  async consultarStatusCte(chave) {
    return await this.request(`/cte/status/${chave}`);
  }

  async getCtes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/cte${query ? `?${query}` : ''}`);
  }

  async getCte(id) {
    return await this.request(`/cte/${id}`);
  }

  // ============================================
  // MDF-e
  // ============================================

  async emitirMdfe(mdfeData) {
    return await this.request('/mdfe/emitir', {
      method: 'POST',
      body: JSON.stringify(mdfeData)
    });
  }

  async encerrarMdfe(id, codigoEncerramento) {
    return await this.request(`/mdfe/encerrar/${id}`, {
      method: 'POST',
      body: JSON.stringify({ codigoEncerramento })
    });
  }

  async consultarStatusMdfe(chave) {
    return await this.request(`/mdfe/status/${chave}`);
  }

  async getMdfes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/mdfe${query ? `?${query}` : ''}`);
  }

  async getMdfe(id) {
    return await this.request(`/mdfe/${id}`);
  }

  // ============================================
  // BOLETOS
  // ============================================

  async getBoletos(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/boletos${query ? `?${query}` : ''}`);
  }

  async getBoleto(id) {
    return await this.request(`/boletos/${id}`);
  }

  async createBoleto(boletoData) {
    return await this.request('/boletos', {
      method: 'POST',
      body: JSON.stringify(boletoData)
    });
  }

  async updateBoletoStatus(id, status) {
    return await this.request(`/boletos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}

// Instância global
const api = new ApiClient();

// Exemplo de uso:
// 
// // Login
// await api.login('admin@vcitransportes.com.br', 'admin123');
//
// // Listar clientes
// const { clients } = await api.getClients({ page: 1, limit: 10 });
//
// // Criar cotação
// const quote = await api.createQuote({
//   clientId: '...',
//   origem: 'São Paulo',
//   destino: 'Rio de Janeiro',
//   peso: 1000,
//   cubagem: 5.5,
//   valor: 1500.00
// });
//
// // Emitir CT-e
// const cte = await api.emitirCte({
//   quoteId: quote.id,
//   numeroCte: '12345678'
// });
