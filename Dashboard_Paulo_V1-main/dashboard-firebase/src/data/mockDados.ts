import { Dado } from "@/types/Dado";

// Dados mock para desenvolvimento e testes
export const mockDados: Dado[] = [
  {
    estado: "São Paulo",
    categoria: "Indústria",
    admissoes: 1500,
    desligamentos: 1200,
    saldo: 300,
    faixaEtaria: "25 a 29 anos",
    grauInstrucao: "Médio completo",
    racaCor: "Branco",
    setorEconomico: "Indústria",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "São Paulo",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Rio de Janeiro",
    categoria: "Serviço",
    admissoes: 800,
    desligamentos: 600,
    saldo: 200,
    faixaEtaria: "30 a 39 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Pardo",
    setorEconomico: "Serviço",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Rio de Janeiro",
    sexo: "Mulher",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Minas Gerais",
    categoria: "Comércio",
    admissoes: 1200,
    desligamentos: 1000,
    saldo: 200,
    faixaEtaria: "18 a 24 anos",
    grauInstrucao: "Médio incompleto",
    racaCor: "Preto",
    setorEconomico: "Comércio",
    situacaoPobreza: "SIM",
    ano: "2023",
    uf: "Minas Gerais",
    sexo: "Homem",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Bahia",
    categoria: "Construção",
    admissoes: 900,
    desligamentos: 750,
    saldo: 150,
    faixaEtaria: "40 a 49 anos",
    grauInstrucao: "Fundamental completo",
    racaCor: "Pardo",
    setorEconomico: "Construção",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Bahia",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Paraná",
    categoria: "Agronegócio",
    admissoes: 600,
    desligamentos: 450,
    saldo: 150,
    faixaEtaria: "50 a 59 anos",
    grauInstrucao: "Fundamental incompleto",
    racaCor: "Branco",
    setorEconomico: "Agronegócio",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Paraná",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  }
];

// Função para gerar dados mock aleatórios
export const gerarDadosMock = (quantidade: number = 50): Dado[] => {
  const estados = [
    "São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná",
    "Rio Grande do Sul", "Pernambuco", "Ceará", "Pará", "Santa Catarina"
  ];
  
  const setores = ["Indústria", "Serviço", "Comércio", "Construção", "Agronegócio"];
  const faixasEtarias = [
    "18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos"
  ];
  const grausInstrucao = [
    "Fundamental incompleto", "Fundamental completo", "Médio incompleto", "Médio completo", "Superior completo"
  ];
  const racasCores = ["Branco", "Pardo", "Preto", "Amarelo", "Indígena"];
  const sexos = ["Homem", "Mulher"];
  const anos = ["2021", "2022", "2023"];
  const bolsaFamilia = ["SIM", "NAO"];
  const cadUnico = ["SIM", "NAO"];

  const dados: Dado[] = [];

  for (let i = 0; i < quantidade; i++) {
    const admissoes = Math.floor(Math.random() * 2000) + 100;
    const desligamentos = Math.floor(Math.random() * admissoes) + 50;
    const saldo = admissoes - desligamentos;

    dados.push({
      estado: estados[Math.floor(Math.random() * estados.length)],
      categoria: setores[Math.floor(Math.random() * setores.length)],
      admissoes,
      desligamentos,
      saldo,
      faixaEtaria: faixasEtarias[Math.floor(Math.random() * faixasEtarias.length)],
      grauInstrucao: grausInstrucao[Math.floor(Math.random() * grausInstrucao.length)],
      racaCor: racasCores[Math.floor(Math.random() * racasCores.length)],
      setorEconomico: setores[Math.floor(Math.random() * setores.length)],
      situacaoPobreza: bolsaFamilia[Math.floor(Math.random() * bolsaFamilia.length)],
      ano: anos[Math.floor(Math.random() * anos.length)],
      uf: estados[Math.floor(Math.random() * estados.length)],
      sexo: sexos[Math.floor(Math.random() * sexos.length)],
      bolsaFamilia: bolsaFamilia[Math.floor(Math.random() * bolsaFamilia.length)],
      cadUnico: cadUnico[Math.floor(Math.random() * cadUnico.length)]
    });
  }

  return dados;
};
