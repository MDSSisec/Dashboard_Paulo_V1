// Constantes para filtros do dashboard
import { 
  CATEGORIAS_FIXAS,
  BOLSA_FAMILIA,
  SITUACAO_POBREZA,
  SETOR_ECONOMICO,
  SEXO,
  RACA_COR,
  GRAU_INSTRUCAO,
  FAIXA_ETARIA,
  CADUNICO,
  ESTADOS_BRASILEIROS,
  ANOS_DISPONIVEIS
} from "./categories";

// Categorias fixas para filtros
export const CATEGORIAS_FIXAS_FILTROS = CATEGORIAS_FIXAS;

// Mapeamento de nomes amigáveis para os filtros
export const nomesFiltros: Record<string, string> = {
  bolsaFamilia: "Bolsa Família",
  situacaoPobreza: "Situação de Pobreza",
  setorEconomico: "Setor Econômico",
  sexo: "Sexo",
  racaCor: "Raça/Cor",
  grauInstrucao: "Grau de Instrução",
  faixaEtaria: "Faixa Etária",
  cadUnico: "CadÚnico",
  uf: "UF",
  ano: "Ano"
};

// Mapeamento das subcategorias para cada categoria
export const SUBCATEGORIAS: Record<string, string[]> = {
  bolsaFamilia: BOLSA_FAMILIA,
  situacaoPobreza: SITUACAO_POBREZA,
  setorEconomico: SETOR_ECONOMICO,
  sexo: SEXO,
  racaCor: RACA_COR,
  grauInstrucao: GRAU_INSTRUCAO,
  faixaEtaria: FAIXA_ETARIA,
  cadUnico: CADUNICO // Incluir ambas as variações
};

// Valores padrão para cada categoria
export const VALORES_PADRAO: Record<string, string[]> = {
  bolsaFamilia: BOLSA_FAMILIA,
  situacaoPobreza: SITUACAO_POBREZA,
  setorEconomico: SETOR_ECONOMICO,
  sexo: SEXO,
  racaCor: RACA_COR,
  grauInstrucao: GRAU_INSTRUCAO,
  faixaEtaria: FAIXA_ETARIA,
  cadUnico: BOLSA_FAMILIA, // Usando BOLSA_FAMILIA para SIM/NAO
  uf: ESTADOS_BRASILEIROS,
  ano: ANOS_DISPONIVEIS
};
