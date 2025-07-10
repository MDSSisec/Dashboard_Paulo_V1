// src/components/Filtros.tsx
import { useState, useEffect } from "react";
import MultiSelect from "./MultiSelect";

// Valores fixos para campos conhecidos
const opcoesBolsaFamilia = ["Sim", "Não", "Não informado"];
const opcoesSexo = ["Feminino", "Masculino", "Não informado"];
const opcoesCadUnico = ["Sim", "Não", "Não informado"];

// Slicers fixos conforme condicoes_arquivos
const condicoesArquivos = {
  bolsaFamilia: ['SIM', 'NAO'],
  situacaoPobreza: ['SIM', 'NAO'],
  setorEconomico: ['Agronegócio', 'Comércio', 'Construção', 'Indústria', 'Serviço'],
  sexo: ['Homem', 'Mulher', 'Não Identificado'],
  racaCor: ['Amarelo', 'Branco', 'Indígena', 'Não Identificado', 'Não Informado', 'Pardo', 'Preto'],
  grauInstrucao: [
    '5º completo fundamental',
    '6º a 9º fundamental',
    'Analfabeto',
    'Até 5º incompleto',
    'Doutorado',
    'Fundamental completo',
    'Médio completo',
    'Médio incompleto',
    'Mestrado',
    'Pós-graduação completa',
    'Superior completo',
    'Superior incompleto',
    'Não identificado'
  ],
  faixaEtaria: [
    '18 a 24 anos',
    '25 a 29 anos',
    '30 a 39 anos',
    '40 a 49 anos',
    '50 a 59 anos',
    '60 a 64 anos',
    'Acima de 65 anos',
    'Até 17 anos',
    'Data de nascimento nula',
    'Data de nascimento inválida'
  ],
  cadUnico: ['SIM', 'NÃO'],
  uf: [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
    'Não informado'
  ],
  ano: [
    '2021',
    '2022',
    '2023',
    '2024',
    '2025'
  ]
};

export type FiltrosProps = {
  onChange: (valores: any) => void;
  opcoesDinamicas: {
    faixaEtaria: string[];
    grauInstrucao: string[];
    racaCor: string[];
    setorEconomico: string[];
    situacaoPobreza: string[];
    ano: string[];
    uf: string[];
    [key: string]: string[]; // Para campos dinâmicos adicionais
  };
  camposDisponiveis?: string[]; // Campos reais do banco
};

export default function Filtros({ onChange, opcoesDinamicas, camposDisponiveis = [] }: FiltrosProps) {
  const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});

  const resetar = () => {
    const novosFiltros: { [key: string]: string[] } = {};
    // Resetar todos os filtros conhecidos
    const todosCampos = [
      'bolsaFamilia', 'faixaEtaria', 'grauInstrucao', 'racaCor', 
      'setorEconomico', 'sexo', 'cadUnico', 'situacaoPobreza', 
      'ano', 'uf', ...camposDisponiveis
    ];
    todosCampos.forEach(campo => {
      novosFiltros[campo] = [];
    });
    setFiltros(novosFiltros);
  };

  const handleFiltroChange = (campo: string, valores: string[]) => {
    console.log(`🎛️ Filtro alterado: ${campo} = [${valores.join(', ')}]`);
    setFiltros(prev => ({
      ...prev,
      [campo]: valores
    }));
  };

  useEffect(() => {
    const filtrosAtivos = Object.keys(filtros).filter(k => filtros[k].length > 0);
    if (filtrosAtivos.length > 0) {
      console.log(`🔧 Filtros ativos: ${filtrosAtivos.map(k => `${k}: [${filtros[k].join(', ')}]`).join(' | ')}`);
    }
    onChange(filtros);
  }, [filtros, onChange]);

  // Helper para adicionar opção 'Todos'
  const addTodos = (arr: string[]) => ["Todos", ...arr.filter((v) => v !== "Todos")];

  // Função para renderizar um filtro
  const renderFiltro = (campo: string, opcoes: string[], placeholder: string) => {
    if (!opcoes || opcoes.length === 0) return null;
    
    const valoresSelecionados = filtros[campo] || [];
    
    return (
      <MultiSelect
        key={campo}
        options={addTodos(opcoes)}
        selected={valoresSelecionados}
        onChange={(valores) => handleFiltroChange(campo, valores)}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold"
          onClick={resetar}
        >
          RESETAR
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        <div className="relative w-full">{renderFiltro('bolsaFamilia', condicoesArquivos.bolsaFamilia, "Bolsa Família")}</div>
        <div className="relative w-full">{renderFiltro('situacaoPobreza', condicoesArquivos.situacaoPobreza, "Situação de Pobreza")}</div>
        <div className="relative w-full">{renderFiltro('setorEconomico', condicoesArquivos.setorEconomico, "Setor Econômico")}</div>
        <div className="relative w-full">{renderFiltro('sexo', condicoesArquivos.sexo, "Sexo")}</div>
        <div className="relative w-full">{renderFiltro('racaCor', condicoesArquivos.racaCor, "Raça/Cor")}</div>
        <div className="relative w-full">{renderFiltro('grauInstrucao', condicoesArquivos.grauInstrucao, "Grau de Instrução")}</div>
        <div className="relative w-full">{renderFiltro('faixaEtaria', condicoesArquivos.faixaEtaria, "Faixa Etária")}</div>
        <div className="relative w-full">{renderFiltro('cadUnico', condicoesArquivos.cadUnico, "CadÚnico")}</div>
        <div className="relative w-full">{renderFiltro('uf', condicoesArquivos.uf, "UF")}</div>
        <div className="relative w-full">{renderFiltro('ano', condicoesArquivos.ano, "Ano")}</div>
      </div>
    </div>
  );
}
