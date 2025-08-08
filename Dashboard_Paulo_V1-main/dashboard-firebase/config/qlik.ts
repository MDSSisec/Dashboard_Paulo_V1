// Configurações do Qlik
export const QLIK_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_QLIK_URL || 'https://qlik.example.com',
  APP_ID: process.env.NEXT_PUBLIC_QLIK_APP_ID || 'default-app',
  WEB_INTEGRATION_ID: process.env.NEXT_PUBLIC_QLIK_WEB_INTEGRATION_ID,
  TIMEOUT: 30000
} as const;

// Endpoints do Qlik
export const QLIK_ENDPOINTS = {
  AUTH: '/api/v1/auth',
  APPS: '/api/v1/apps',
  DATA: '/api/v1/data',
  SHEETS: '/api/v1/sheets'
} as const;

// URLs completas do Qlik
export const QLIK_URLS = {
  AUTH: `${QLIK_CONFIG.BASE_URL}${QLIK_ENDPOINTS.AUTH}`,
  APPS: `${QLIK_CONFIG.BASE_URL}${QLIK_ENDPOINTS.APPS}`,
  DATA: `${QLIK_CONFIG.BASE_URL}${QLIK_ENDPOINTS.DATA}`,
  SHEETS: `${QLIK_CONFIG.BASE_URL}${QLIK_ENDPOINTS.SHEETS}`
} as const;
