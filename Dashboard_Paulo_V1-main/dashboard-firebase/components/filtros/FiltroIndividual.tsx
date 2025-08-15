import React, { memo } from "react";
import MultiSelect from "./MultiSelect";

type FiltroIndividualProps = {
  campo: string;
  placeholder: string;
  descricao: string;
  opcoes: string[];
  valoresSelecionados: string[];
  tipoJuncao: 'AND' | 'OR';
  ativo: boolean;
  onFiltroChange: (campo: string, valores: string[]) => void;
  onTipoJuncaoChange: (campo: string, tipo: 'AND' | 'OR') => void;
};

const FiltroIndividual = memo(({
  campo,
  placeholder,
  descricao,
  opcoes,
  valoresSelecionados,
  tipoJuncao,
  ativo,
  onFiltroChange,
  onTipoJuncaoChange
}: FiltroIndividualProps) => {
  
  const addTodos = (arr: string[]) => ["Todos", ...arr.filter((v) => v !== "Todos")];

  return (
    <div className={`relative group flex flex-col items-center max-w-[220px] w-full ${
      ativo ? 'scale-105' : ''
    }`}>
      <div className="mb-2 text-center w-full">
        <label className={`text-[10px] font-medium block ${
          ativo ? 'text-purple-300 font-bold' : 'text-gray-300'
        }`}>
          {ativo && <span className="mr-1">🎯</span>}
          {placeholder}
          {ativo && <span className="ml-1 text-xs bg-purple-600 text-white px-1 rounded">ATIVO</span>}
        </label>
        <div className={`text-[8px] ${
          ativo ? 'text-purple-200 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
        }`}>
          {descricao}
        </div>
      </div>
      
      {/* Seletor de tipo de junção */}
      <div className="mb-2 w-full">
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-gray-400">Junção:</span>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                tipoJuncao === 'AND' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => onTipoJuncaoChange(campo, 'AND')}
              title="AND - Todos os valores devem ser atendidos (INNER JOIN)"
            >
              AND
            </button>
            <button
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                tipoJuncao === 'OR' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => onTipoJuncaoChange(campo, 'OR')}
              title="OR - Qualquer valor pode ser atendido (UNION)"
            >
              OR
            </button>
          </div>
        </div>
      </div>
      
      <div className={`w-full ${
        ativo ? 'ring-2 ring-purple-500 ring-opacity-50 rounded-lg' : ''
      }`}>
        <MultiSelect
          key={`multiselect-${campo}`}
          options={addTodos(opcoes)}
          selected={valoresSelecionados}
          onChange={(valores) => onFiltroChange(campo, valores)}
          placeholder=""
        />
      </div>
      
      {/* Indicador de tipo de junção */}
      {ativo && (
        <div className="absolute -top-1 -right-1 w-6 h-4 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {tipoJuncao === 'AND' ? '∩' : '∪'}
          </span>
        </div>
      )}
    </div>
  );
});

FiltroIndividual.displayName = 'FiltroIndividual';

export default FiltroIndividual;
