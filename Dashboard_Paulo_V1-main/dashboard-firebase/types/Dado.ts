// Tipagem dos dados do dashboard
export interface Dado {
  estado: string;
  categoria: string;
  admissoes: number;
  desligamentos: number;
  saldo: number;
  faixaEtaria?: string;
  grauInstrucao?: string;
  racaCor?: string;
  setorEconomico?: string;
  situacaoPobreza?: string;
  ano?: string;
  uf?: string;
  sexo?: string;
  bolsaFamilia?: string;
  cadUnico?: string;
  [key: string]: any; // Para campos dinâmicos adicionais
}
