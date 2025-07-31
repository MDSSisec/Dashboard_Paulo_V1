// src/components/Filtros.tsx
import { useFiltrosLogic, FiltroState } from "@/lib/filtrosLogic";
import MultiSelect from "./MultiSelect";

export type FiltrosProps = {
  onChange: (valores: FiltroState) => void;
  opcoesDinamicas: Record<string, string[]>;
  camposDisponiveis?: string[];
  dados?: any[];
};

export default function Filtros({ 
  onChange, 
  opcoesDinamicas, 
  camposDisponiveis = [],
  dados = []
}: FiltrosProps) {
  
  const {
    filtros,
    resetarFiltros,
    alterarFiltro,
    getOpcoesCampo,
    adicionarOpcaoTodos
  } = useFiltrosLogic({ dados });

  // Notificar o componente pai quando filtros mudarem
  const handleFiltroChange = (campo: string, valores: string[]) => {
    alterarFiltro(campo, valores);
    // Notificar o pai com o novo estado
    const novosFiltros = { ...filtros, [campo]: valores };
    onChange(novosFiltros);
  };

  const handleReset = () => {
    resetarFiltros();
    // Notificar o pai com filtros vazios
    const filtrosVazios: FiltroState = {};
    onChange(filtrosVazios);
  };

  // Função para renderizar um filtro usando dados dinâmicos
  const renderFiltro = (campo: string, placeholder: string, descricao: string) => {
    const opcoes = getOpcoesCampo(campo, opcoesDinamicas);
    
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
            options={adicionarOpcaoTodos(opcoes)}
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
          onClick={handleReset}
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
