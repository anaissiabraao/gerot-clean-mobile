/**
 * Integração TMS - Substitui todos os mockups por chamadas reais à API
 * Este arquivo deve ser incluído em todas as páginas que precisam de dados do TMS
 */

// Configuração da API
const TMS_API_BASE = window.TMS_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Cliente API TMS (usa o api-client.js se disponível, senão cria um básico)
 */
const tmsApi = window.api || {
  baseURL: TMS_API_BASE,
  token: localStorage.getItem('auth_token'),
  
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
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição TMS:', error);
      throw error;
    }
  }
};

/**
 * Carrega dados reais do banco de dados
 */
const TMSDataLoader = {
  /**
   * Carrega todos os clientes do banco
   */
  async loadClients() {
    try {
      const data = await tmsApi.request('/clients?limit=1000');
      return data.clients || [];
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  },

  /**
   * Carrega todas as cotações do banco
   */
  async loadQuotes(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await tmsApi.request(`/quotes?${params}&limit=1000`);
      return data.quotes || [];
    } catch (error) {
      console.error('Erro ao carregar cotações:', error);
      return [];
    }
  },

  /**
   * Carrega todas as notas fiscais do banco
   */
  async loadInvoices(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await tmsApi.request(`/invoices?${params}&limit=1000`);
      return data.invoices || [];
    } catch (error) {
      console.error('Erro ao carregar notas fiscais:', error);
      return [];
    }
  },

  /**
   * Carrega todos os CT-es do banco
   */
  async loadCtes(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await tmsApi.request(`/cte?${params}&limit=1000`);
      return data.ctes || [];
    } catch (error) {
      console.error('Erro ao carregar CT-es:', error);
      return [];
    }
  },

  /**
   * Carrega todos os MDF-es do banco
   */
  async loadMdfes(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await tmsApi.request(`/mdfe?${params}&limit=1000`);
      return data.mdfes || [];
    } catch (error) {
      console.error('Erro ao carregar MDF-es:', error);
      return [];
    }
  },

  /**
   * Carrega todos os boletos do banco
   */
  async loadBoletos(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await tmsApi.request(`/boletos?${params}&limit=1000`);
      return data.boletos || [];
    } catch (error) {
      console.error('Erro ao carregar boletos:', error);
      return [];
    }
  },

  /**
   * Carrega estatísticas gerais do sistema
   */
  async loadStats() {
    try {
      const [clients, quotes, invoices, ctes, mdfes, boletos] = await Promise.all([
        this.loadClients(),
        this.loadQuotes(),
        this.loadInvoices(),
        this.loadCtes(),
        this.loadMdfes(),
        this.loadBoletos()
      ]);

      return {
        totalClientes: clients.length,
        totalCotacoes: quotes.length,
        totalNotasFiscais: invoices.length,
        totalCtes: ctes.length,
        totalMdfes: mdfes.length,
        totalBoletos: boletos.length,
        ctesAutorizados: ctes.filter(c => c.statusSefaz === 'AUTORIZADO').length,
        ctesPendentes: ctes.filter(c => c.statusSefaz === 'PENDENTE').length,
        mdfesAutorizados: mdfes.filter(m => m.statusSefaz === 'AUTORIZADO').length,
        boletosPagos: boletos.filter(b => b.status === 'PAGO').length,
        boletosPendentes: boletos.filter(b => b.status === 'PENDENTE' || b.status === 'GERADO').length
      };
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return {};
    }
  }
};

// Disponibiliza globalmente
window.TMSDataLoader = TMSDataLoader;
window.tmsApi = tmsApi;

/**
 * Função helper para substituir dados mockados
 */
window.loadTMSData = async function(type, filters = {}) {
  switch(type) {
    case 'clients':
      return await TMSDataLoader.loadClients();
    case 'quotes':
      return await TMSDataLoader.loadQuotes(filters);
    case 'invoices':
      return await TMSDataLoader.loadInvoices(filters);
    case 'ctes':
      return await TMSDataLoader.loadCtes(filters);
    case 'mdfes':
      return await TMSDataLoader.loadMdfes(filters);
    case 'boletos':
      return await TMSDataLoader.loadBoletos(filters);
    case 'stats':
      return await TMSDataLoader.loadStats();
    default:
      console.warn('Tipo de dados não reconhecido:', type);
      return [];
  }
};

// Auto-inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('TMS API Integration carregado');
  });
} else {
  console.log('TMS API Integration carregado');
}
