import React, { useState, useEffect } from 'react';

type MatrizFiltroProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
};

export default function MatrizFiltro({ options, selected, onChange, placeholder }: MatrizFiltroProps) {
  const handleSelect = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]); // Desmarca tudo
    } else {
      onChange([...options]); // Seleciona tudo
    }
  };

  const isAllSelected = options.length > 0 && selected.length === options.length;

  return (
    <div className="bg-zinc-900 p-4 rounded-lg shadow-inner">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-300">{placeholder}</h3>
        <button
          onClick={handleSelectAll}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            isAllSelected
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
          }`}
        >
          {isAllSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`px-3 py-2 text-xs rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 ${
              selected.includes(option)
                ? 'bg-purple-600 text-white font-bold shadow-lg'
                : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-700">
          <div className="text-xs text-gray-400">
            Selecionados: {selected.length} de {options.length}
          </div>
        </div>
      )}
    </div>
  );
}
