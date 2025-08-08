// Constantes para interface do usuário

// 🌐 Rotas nomeadas (útil para navegação e controle de acesso)
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  USUARIOS: "/usuarios",
  AJUDA: "/ajuda"
} as const;

// 🎨 Paleta de cores usada no projeto
export const COLORS = {
  PRIMARY: "#0B82E6",
  SECONDARY: "#54B1C9",
  BACKGROUND: "#0A0A0A",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#A1A1A1",
  SUCCESS: "#22C55E",
  ERROR: "#EF4444",
  WARNING: "#F59E0B"
} as const;

// 🏷️ Labels de interface fixos (para manter padronização de textos)
export const LABELS = {
  FILTRAR: "Aplicar Filtros",
  EXPORTAR: "Exportar Excel",
  SELECIONE_UF: "Selecione uma UF",
  NAO_INFORMADO: "Não informado",
  TODOS: "Todos"
} as const;

// 📊 Status de resposta, exibição ou processamento
export const STATUS = {
  CARREGANDO: "Carregando dados...",
  SEM_DADOS: "Nenhum dado encontrado",
  ERRO_CARREGAMENTO: "Erro ao carregar os dados.",
  DADOS_CARREGADOS: "Dados carregados com sucesso"
} as const;

// 🔧 Classes CSS baseadas nas cores
export const COLOR_CLASSES = {
  // Cores de fundo
  BG_PRIMARY: "bg-[#0B82E6]",
  BG_SECONDARY: "bg-[#54B1C9]",
  BG_BACKGROUND: "bg-[#0A0A0A]",
  BG_SUCCESS: "bg-[#22C55E]",
  BG_ERROR: "bg-[#EF4444]",
  BG_WARNING: "bg-[#F59E0B]",
  
  // Cores de texto
  TEXT_PRIMARY: "text-[#FFFFFF]",
  TEXT_SECONDARY: "text-[#A1A1A1]",
  TEXT_SUCCESS: "text-[#22C55E]",
  TEXT_ERROR: "text-[#EF4444]",
  TEXT_WARNING: "text-[#F59E0B]",
  
  // Bordas
  BORDER_PRIMARY: "border-[#0B82E6]",
  BORDER_SECONDARY: "border-[#54B1C9]",
  BORDER_SUCCESS: "border-[#22C55E]",
  BORDER_ERROR: "border-[#EF4444]",
  BORDER_WARNING: "border-[#F59E0B]"
} as const;

// 🎯 Estados de botões
export const BUTTON_STATES = {
  // Estados visuais
  DISABLED: "opacity-50 cursor-not-allowed",
  LOADING: "animate-pulse",
  ACTIVE: "ring-2 ring-offset-2",
  
  // Estados de hover
  HOVER_PRIMARY: "hover:bg-[#0B82E6]/90",
  HOVER_SECONDARY: "hover:bg-[#54B1C9]/90",
  HOVER_SUCCESS: "hover:bg-[#22C55E]/90",
  HOVER_ERROR: "hover:bg-[#EF4444]/90",
  HOVER_WARNING: "hover:bg-[#F59E0B]/90"
} as const;

// 📱 Breakpoints responsivos
export const BREAKPOINTS = {
  MOBILE: "max-width: 640px",
  TABLET: "min-width: 641px and max-width: 1024px",
  DESKTOP: "min-width: 1025px"
} as const;

// ⏱️ Timeouts e delays
export const TIMING = {
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
  DEBOUNCE_DELAY: 300,
  TOOLTIP_DELAY: 1000
} as const;
