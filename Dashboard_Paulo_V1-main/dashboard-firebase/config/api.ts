// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Endpoints da API
export const API_ENDPOINTS = {
  DADOS_INICIAIS: '/dados',
  DADOS_AGRUPADOS: '/dados-agrupados',
  FILTROS: '/filtros',
  OPCOES_FILTROS: '/opcoes-filtros',
  EXPORTAR_EXCEL: '/exportar-excel',
  EXPORTAR_CSV: '/exportar-csv'
} as const;

// URLs completas
export const API_URLS = {
  DADOS_INICIAIS: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DADOS_INICIAIS}`,
  DADOS_AGRUPADOS: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DADOS_AGRUPADOS}`,
  FILTROS: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.FILTROS}`,
  OPCOES_FILTROS: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.OPCOES_FILTROS}`,
  EXPORTAR_EXCEL: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.EXPORTAR_EXCEL}`,
  EXPORTAR_CSV: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.EXPORTAR_CSV}`
} as const;
