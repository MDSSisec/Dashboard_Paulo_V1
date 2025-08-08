// Constantes para filtros do dashboard

// Categorias fixas para filtros
export const categoriasFixas = [
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
export const subcategorias: Record<string, string[]> = {
  bolsaFamilia: ["SIM", "NAO"],
  situacaoPobreza: ["SIM", "NAO"],
  setorEconomico: ["Agronegócio", "Comércio", "Construção", "Indústria", "Serviço"],
  sexo: ["Homem", "Mulher", "Não Identificado"],
  racaCor: ["Amarelo", "Branco", "Indígena", "Não Identificado", "Não Informado", "Pardo", "Preto"],
  grauInstrucao: [
    "5º completo fundamental", "6º a 9º fundamental", "Analfabeto", "Até 5º incompleto",
    "Doutorado", "Fundamental completo", "Médio completo", "Médio incompleto",
    "Mestrado", "Pós-graduação completa", "Superior completo", "Superior incompleto", "Não identificado"
  ],
  faixaEtaria: [
    "18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos",
    "60 a 64 anos", "Acima de 65 anos", "Até 17 anos", "Data de nascimento nula", "Data de nascimento inválida"
  ],
  cadUnico: ["SIM", "NAO", "NÃO"] // Incluir ambas as variações
};

// Valores padrão para cada categoria
export const valoresPadrao: Record<string, string[]> = {
  bolsaFamilia: ["SIM", "NAO"],
  situacaoPobreza: ["SIM", "NAO"],
  setorEconomico: ["Agronegócio", "Comércio", "Construção", "Indústria", "Serviço"],
  sexo: ["Homem", "Mulher", "Não Identificado"],
  racaCor: ["Amarelo", "Branco", "Indígena", "Não Identificado", "Não Informado", "Pardo", "Preto"],
  grauInstrucao: [
    "5º completo fundamental", "6º a 9º fundamental", "Analfabeto", "Até 5º incompleto",
    "Doutorado", "Fundamental completo", "Médio completo", "Médio incompleto",
    "Mestrado", "Pós-graduação completa", "Superior completo", "Superior incompleto", "Não identificado"
  ],
  faixaEtaria: [
    "18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos",
    "60 a 64 anos", "Acima de 65 anos", "Até 17 anos", "Data de nascimento nula", "Data de nascimento inválida"
  ],
  cadUnico: ["SIM", "NAO"],
  uf: [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", 
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", 
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", 
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", 
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ],
  ano: ["2021", "2022", "2023"]
};
