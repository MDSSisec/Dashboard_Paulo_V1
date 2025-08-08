// Constantes para categorias do sistema

// Categorias base para tabela
export const CATEGORIAS_BASE: string[] = ['uf', 'ano'];

// Categorias fixas para filtros
export const CATEGORIAS_FIXAS: string[] = [
  "bolsaFamilia",
  "situacaoPobreza", 
  "setorEconomico",
  "sexo",
  "racaCor",
  "grauInstrucao",
  "faixaEtaria",
  "cadUnico",
  "uf",
  "ano"
];

// ===== CATEGORIAS ESPECÍFICAS =====

// Bolsa Família
export const BOLSA_FAMILIA: string[] = ["SIM", "NAO"];

// Situação de Pobreza
export const SITUACAO_POBREZA: string[] = ["SIM", "NAO"];

// Setor Econômico
export const SETOR_ECONOMICO: string[] = [
  "Agronegócio", 
  "Comércio", 
  "Construção", 
  "Indústria", 
  "Serviço"
];

// Sexo
export const SEXO: string[] = [
  "Homem", 
  "Mulher", 
  "Não Identificado"
];

// Raça/Cor
export const RACA_COR: string[] = [
  "Amarelo", 
  "Branco", 
  "Indígena",
  "Não Identificado", 
  "Não Informado",
  "Pardo", 
  "Preto"
];

// Grau de Instrução
export const GRAU_INSTRUCAO: string[] = [
  "5º completo fundamental", 
  "6º a 9º fundamental", 
  "Analfabeto",
  "Até 5º incompleto", 
  "Doutorado", 
  "Fundamental completo",
  "Médio completo", 
  "Médio incompleto", 
  "Mestrado",
  "Pós-graduação completa", 
  "Superior completo", 
  "Superior incompleto",
  "Não identificado"
];

// Faixa Etária
export const FAIXA_ETARIA: string[] = [
  "18 a 24 anos", 
  "25 a 29 anos", 
  "30 a 39 anos", 
  "40 a 49 anos",
  "50 a 59 anos", 
  "60 a 64 anos", 
  "Acima de 65 anos", 
  "Até 17 anos",
  "Data de nascimento nula", 
  "Data de nascimento inválida"
];

// CadÚnico
export const CADUNICO: string[] = ["SIM", "NÃO"];

// ===== CONSTANTES LEGACY (mantidas para compatibilidade) =====

// Setores econômicos disponíveis (alias para SETOR_ECONOMICO)
export const SETORES_ECONOMICOS: string[] = SETOR_ECONOMICO;

// Faixas etárias disponíveis (alias para FAIXA_ETARIA)
export const FAIXAS_ETARIAS: string[] = FAIXA_ETARIA;

// Graus de instrução disponíveis (alias para GRAU_INSTRUCAO)
export const GRAUS_INSTRUCAO: string[] = GRAU_INSTRUCAO;

// Raças/Cores disponíveis (alias para RACA_COR)
export const RACAS_CORES: string[] = RACA_COR;

// Sexos disponíveis (alias para SEXO)
export const SEXOS: string[] = SEXO;

// Opções SIM/NAO (alias para BOLSA_FAMILIA)
export const OPCOES_SIM_NAO: string[] = BOLSA_FAMILIA;

// Opções SIM/NÃO (com acento) (alias para CADUNICO)
export const OPCOES_SIM_NAO_ACENTO: string[] = CADUNICO;

// Estados brasileiros
export const ESTADOS_BRASILEIROS: string[] = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins"
];

// Anos disponíveis
export const ANOS_DISPONIVEIS: string[] = ["2021", "2022", "2023"];

// Estados para dados mock (subconjunto)
export const ESTADOS_MOCK: string[] = [
  "São Paulo",
  "Rio de Janeiro", 
  "Minas Gerais",
  "Bahia",
  "Paraná",
  "Rio Grande do Sul",
  "Pernambuco",
  "Ceará",
  "Pará",
  "Santa Catarina"
];

// Graus de instrução simplificados para mock
export const GRAUS_INSTRUCAO_SIMPLES: string[] = [
  "Fundamental incompleto",
  "Fundamental completo",
  "Médio incompleto",
  "Médio completo",
  "Superior completo"
];

// Raças/Cores simplificadas para mock
export const RACAS_CORES_SIMPLES: string[] = [
  "Branco",
  "Pardo",
  "Preto",
  "Amarelo",
  "Indígena"
];
