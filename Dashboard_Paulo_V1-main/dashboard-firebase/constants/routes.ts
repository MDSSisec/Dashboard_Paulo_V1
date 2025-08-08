// Constantes para rotas e URLs do projeto

// URLs da API
export const API_URLS = {
  // Base URL da API
  BASE_URL: "http://localhost:3001",
  
  // Endpoints de dados
  DADOS_INICIAIS: "/dados",
  DADOS_AGRUPADOS: "/dados-agrupados",
  
  // Endpoints de filtros
  FILTROS: "/filtros",
  OPCOES_FILTROS: "/opcoes-filtros",
  
  // Endpoints de exportação
  EXPORTAR_EXCEL: "/exportar-excel",
  EXPORTAR_CSV: "/exportar-csv"
} as const;

// URLs completas
export const URLS_COMPLETAS = {
  DADOS_INICIAIS: `${API_URLS.BASE_URL}${API_URLS.DADOS_INICIAIS}`,
  DADOS_AGRUPADOS: `${API_URLS.BASE_URL}${API_URLS.DADOS_AGRUPADOS}`,
  FILTROS: `${API_URLS.BASE_URL}${API_URLS.FILTROS}`,
  OPCOES_FILTROS: `${API_URLS.BASE_URL}${API_URLS.OPCOES_FILTROS}`,
  EXPORTAR_EXCEL: `${API_URLS.BASE_URL}${API_URLS.EXPORTAR_EXCEL}`,
  EXPORTAR_CSV: `${API_URLS.BASE_URL}${API_URLS.EXPORTAR_CSV}`
} as const;

// Rotas do frontend (se houver roteamento)
export const ROTAS_FRONTEND = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  FILTROS: "/filtros",
  RELATORIOS: "/relatorios",
  CONFIGURACOES: "/configuracoes"
} as const;

// Rotas nomeadas para navegação e controle de acesso
export const ROTAS_NAVEGACAO = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  USUARIOS: "/usuarios",
  AJUDA: "/ajuda"
} as const;

// Configurações de timeout
export const TIMEOUT_CONFIG = {
  REQUISICAO_PADRAO: 30000, // 30 segundos
  REQUISICAO_RAPIDA: 5000,  // 5 segundos
  REQUISICAO_LENTA: 60000   // 1 minuto
} as const;

// Headers padrão para requisições
export const HEADERS_PADRAO = {
  "Content-Type": "application/json",
  "Accept": "application/json"
} as const;

// Parâmetros padrão para queries
export const PARAMETROS_PADRAO = {
  LIMITE_PADRAO: 100,
  LIMITE_MAXIMO: 1000,
  PAGINA_PADRAO: 1
} as const;
