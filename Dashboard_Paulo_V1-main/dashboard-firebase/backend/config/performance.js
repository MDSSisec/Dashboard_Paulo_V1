// Configurações de performance para otimização das matrizes

// Parâmetros de performance do PostgreSQL
export const DB_PERFORMANCE_CONFIG = {
  // Pool de conexões
  pool: {
    max: 20, // Máximo de conexões
    idleTimeoutMillis: 30000, // 30 segundos
    connectionTimeoutMillis: 2000, // 2 segundos
  },
  
  // Timeouts
  timeouts: {
    statement: 30000, // 30 segundos para statements
    query: 30000, // 30 segundos para queries
    idle: 30000, // 30 segundos para conexões ociosas
  },
  
  // Cache
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutos
    maxSize: 1000, // Máximo 1000 itens no cache
  }
};

// Parâmetros de otimização das consultas
export const QUERY_OPTIMIZATION = {
  // Limite de registros por consulta
  maxResults: 1000,
  
  // Tamanho da página para paginação
  pageSize: 100,
  
  // Timeout para consultas complexas
  complexQueryTimeout: 60000, // 60 segundos
  
  // Configurações de agrupamento
  grouping: {
    maxGroups: 100, // Máximo de grupos por consulta
    enableIndexes: true, // Usar índices quando disponíveis
  },
  
  // Configurações de filtros
  filters: {
    maxFilters: 10, // Máximo de filtros simultâneos
    enableOptimization: true, // Otimizar consultas com filtros
    cacheResults: true, // Cachear resultados de filtros
  }
};

// Parâmetros de performance do servidor
export const SERVER_PERFORMANCE = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requisições por janela
  },
  
  // Compressão
  compression: {
    enabled: true,
    threshold: 1024, // Comprimir respostas > 1KB
  },
  
  // CORS
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
  
  // Logging
  logging: {
    enabled: true,
    level: 'info', // info, warn, error
    includeQueryTime: true, // Incluir tempo de consulta nos logs
  }
};

// Parâmetros de otimização das matrizes de dados
export const MATRIX_OPTIMIZATION = {
  // Tamanho das matrizes
  matrixSize: {
    maxRows: 1000, // Máximo de linhas por matriz
    maxColumns: 20, // Máximo de colunas por matriz
    chunkSize: 100, // Tamanho do chunk para processamento
  },
  
  // Cache de matrizes
  matrixCache: {
    enabled: true,
    ttl: 300000, // 5 minutos
    maxMatrices: 50, // Máximo de matrizes em cache
  },
  
  // Otimização de consultas de matriz
  matrixQueries: {
    useIndexes: true, // Usar índices para consultas de matriz
    enablePartitioning: true, // Habilitar particionamento
    optimizeJoins: true, // Otimizar JOINs
  },
  
  // Configurações de agregação
  aggregation: {
    enableParallel: true, // Processamento paralelo
    maxWorkers: 4, // Máximo de workers
    chunkProcessing: true, // Processamento em chunks
  }
};

// Parâmetros específicos para filtros que funcionam 7 de 10
export const FILTER_OPTIMIZATION = {
  // Filtros que funcionam bem (7 de 10)
  workingFilters: [
    'cadUnico', // ✅ Funciona
    'uf', // ✅ Funciona
    'ano', // ✅ Funciona
    'setorEconomico', // ⚠️ Funciona parcialmente
    'sexo', // ⚠️ Funciona parcialmente
    'bolsaFamilia', // ⚠️ Funciona parcialmente
    'situacaoPobreza' // ⚠️ Funciona parcialmente
  ],
  
  // Filtros que precisam de otimização
  needsOptimization: [
    'racaCor', // ❌ Precisa otimização
    'grauInstrucao', // ❌ Precisa otimização
    'faixaEtaria' // ❌ Precisa otimização
  ],
  
  // Configurações de otimização por filtro
  filterConfig: {
    cadUnico: {
      useIndex: true,
      cacheResults: true,
      timeout: 5000, // 5 segundos
    },
    uf: {
      useIndex: true,
      cacheResults: true,
      timeout: 5000,
    },
    ano: {
      useIndex: true,
      cacheResults: true,
      timeout: 5000,
    },
    setorEconomico: {
      useIndex: false, // Não tem índice
      cacheResults: true,
      timeout: 10000, // 10 segundos
    },
    sexo: {
      useIndex: false,
      cacheResults: true,
      timeout: 10000,
    },
    bolsaFamilia: {
      useIndex: false,
      cacheResults: true,
      timeout: 10000,
    },
    situacaoPobreza: {
      useIndex: false,
      cacheResults: true,
      timeout: 10000,
    }
  }
};

module.exports = {
  DB_PERFORMANCE_CONFIG,
  QUERY_OPTIMIZATION,
  SERVER_PERFORMANCE,
  MATRIX_OPTIMIZATION,
  FILTER_OPTIMIZATION
};
