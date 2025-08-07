// src/components/Filtros.tsx
import { useState, useEffect } from "react";
import MultiSelect from "./MultiSelect";

export type FiltrosProps = {
  onChange: (valores: any) => void;
  opcoesDinamicas: Record<string, string[]>; // Simplificar o tipo
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
    console.log("Filtros resetados");
  };

  const handleFiltroChange = (campo: string, valores: string[]) => {
    console.log(`Filtro alterado: ${campo} = [${valores.join(', ')}]`);
    setFiltros(prev => ({
      ...prev,
      [campo]: valores
    }));
  };

  useEffect(() => {
    const filtrosAtivos = Object.keys(filtros).filter(k => filtros[k].length > 0);
    if (filtrosAtivos.length > 0) {
      console.log(`Filtros ativos: ${filtrosAtivos.map(k => `${k}: [${filtros[k].join(', ')}]`).join(' | ')}`);
    }
    onChange(filtros);
  }, [filtros, onChange]);

  // Helper para adicionar opção 'Todos'
  const addTodos = (arr: string[]) => ["Todos", ...arr.filter((v) => v !== "Todos")];

  // Função para renderizar um filtro usando dados dinâmicos
  const renderFiltro = (campo: string, placeholder: string, descricao: string) => {
    // Usar dados dinâmicos do Firebase se disponíveis, senão usar valores padrão
    let opcoes: string[] = [];
    
    if (opcoesDinamicas[campo] && opcoesDinamicas[campo].length > 0) {
      opcoes = opcoesDinamicas[campo];
      console.log(`Opções dinâmicas para ${campo}:`, opcoes);
    } else {
              // Valores padrão caso não haja dados dinâmicos
        const valoresPadrao: Record<string, string[]> = {
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
            "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
          ],
          ano: ["2021", "2022", "2023"]
        };
      opcoes = valoresPadrao[campo] || [];
    }
    
    if (!opcoes || opcoes.length === 0) {
      console.log(`Nenhuma opção disponível para ${campo}`);
      return null;
    }
    
    const valoresSelecionados = filtros[campo] || [];
    
    return (
      <div key={campo} className="relative group flex flex-col items-center max-w-[200px] w-full">
        <div className="mb-2 text-center w-full">
          <label className="text-[10px] font-medium text-gray-300 block">{placeholder}</label>
          <div className="text-[8px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {descricao}
          </div>
        </div>
        <div className="w-full">
          <MultiSelect
            options={addTodos(opcoes)}
            selected={valoresSelecionados}
            onChange={(valores) => handleFiltroChange(campo, valores)}
            placeholder=""
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors shadow-lg"
          onClick={resetar}
        >
          RESETAR FILTROS
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 w-full max-w-7xl mx-auto">
        {renderFiltro('bolsaFamilia', "Bolsa Família", "Filtrar por beneficiários do programa")}
        {renderFiltro('situacaoPobreza', "Situação de Pobreza", "Filtrar por situação socioeconômica")}
        {renderFiltro('setorEconomico', "Setor Econômico", "Filtrar por área de atuação")}
        {renderFiltro('sexo', "Sexo", "Filtrar por gênero")}
        {renderFiltro('racaCor', "Raça/Cor", "Filtrar por raça/cor")}
        {renderFiltro('grauInstrucao', "Grau de Instrução", "Filtrar por nível educacional")}
        {renderFiltro('faixaEtaria', "Faixa Etária", "Filtrar por idade")}
        {renderFiltro('cadUnico', "CadÚnico", "Filtrar por cadastro único")}
        {renderFiltro('uf', "UF", "Filtrar por estado")}
        {renderFiltro('ano', "Ano", "Filtrar por período")}
      </div>
    </div>
  );
}
