// Constantes para cores do projeto
import { COLORS, COLOR_CLASSES } from './ui';

// Cores principais do tema (integradas com a paleta de cores)
export const CORES_PRINCIPAIS = {
  // Cores de fundo
  FUNDO_PRINCIPAL: COLOR_CLASSES.BG_BACKGROUND,
  FUNDO_CARD_FILTROS: "bg-zinc-900",
  FUNDO_CARD_TABELA: "bg-purple-700",
  FUNDO_BOTAO_EXPORTAR: COLOR_CLASSES.BG_SUCCESS,
  FUNDO_BOTAO_TESTE: COLOR_CLASSES.BG_PRIMARY,
  FUNDO_BOTAO_RESETAR: "bg-purple-600",
  
  // Cores de texto
  TEXTO_PRINCIPAL: COLOR_CLASSES.TEXT_PRIMARY,
  TEXTO_SECUNDARIO: COLOR_CLASSES.TEXT_SECONDARY,
  TEXTO_TABELA: "text-black",
  TEXTO_TABELA_SECUNDARIO: "text-black/70",
  
  // Cores de destaque
  DESTAQUE_FILTRO_ATIVO: "bg-purple-600",
  DESTAQUE_COLUNA_FILTRO: "bg-purple-200",
  DESTAQUE_LINHA_FILTRO: "bg-purple-50",
  BORDA_FILTRO: "border-purple-300",
  
  // Cores de estado
  ESTADO_DESABILITADO: "bg-gray-400",
  ESTADO_HOVER: "hover:bg-green-600",
  ESTADO_HOVER_BOTAO: "hover:bg-purple-700",
  ESTADO_HOVER_TESTE: "hover:bg-blue-600",
  
  // Cores de loading e erro
  LOADING: "text-black/70",
  ERRO: COLOR_CLASSES.TEXT_ERROR,
  SUCESSO: COLOR_CLASSES.TEXT_SUCCESS
} as const;

// Classes CSS para cores
export const CLASSES_CORES = {
  // Botões
  BOTAO_PRIMARIO: "px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
  BOTAO_SECUNDARIO: "px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
  BOTAO_RESETAR: "bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors shadow-lg",
  BOTAO_DESABILITADO: "px-6 py-2 bg-gray-400 text-white rounded transition disabled:cursor-not-allowed",
  
  // Cards
  CARD_FILTROS: "bg-zinc-900 p-6 rounded-md shadow-lg text-white w-full max-w-4xl mx-auto mt-12",
  CARD_TABELA: "bg-purple-700 rounded-3xl p-8 shadow-2xl min-w-0 min-h-[150px] w-full flex flex-col items-center justify-center",
  
  // Tabela
  CABECALHO_TABELA: "px-4 text-black",
  CABECALHO_FILTRO: "px-4 text-black bg-purple-200 font-bold",
  CELULA_TABELA: "px-4 py-2 text-black font-medium",
  CELULA_FILTRO: "px-4 py-2 text-black font-medium bg-purple-50 border-l-2 border-purple-300",
  
  // Tags e badges
  TAG_FILTRO_ATIVO: "bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center",
  BADGE_FILTRO: "ml-1 text-xs bg-purple-600 text-white px-1 rounded"
} as const;

// Cores para diferentes tipos de dados
export const CORES_DADOS = {
  ADMISSOES: "text-green-600",
  DESLIGAMENTOS: "text-red-600",
  SALDO_POSITIVO: "text-green-600",
  SALDO_NEGATIVO: "text-red-600",
  SALDO_NEUTRO: "text-gray-600"
} as const;

// Cores para estados de filtro
export const CORES_FILTROS = {
  ATIVO: "bg-purple-600",
  INATIVO: "bg-gray-500",
  SELECIONADO: "bg-blue-500",
  PENDENTE: "bg-yellow-500"
} as const;
