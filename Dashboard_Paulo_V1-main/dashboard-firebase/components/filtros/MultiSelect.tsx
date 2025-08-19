// src/components/MultiSelect.tsx
import React, { useState, useEffect, useCallback, memo } from "react";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.multi-select-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  




  // Helper para adicionar opção 'Todos'
  const addTodos = (arr: string[]) => arr.filter((v) => v !== "Todos");

  const isAllSelected = options.length > 0 && selected.length === options.length;

  const toggleOption = useCallback((value: string) => {
    if (value === "Todos") {
      if (isAllSelected) {
        onChange([]); // Desmarca tudo
      } else {
        onChange(options); // Seleciona tudo
      }
      return;
    }
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }, [isAllSelected, onChange, options, selected]);

  const removeOption = useCallback((value: string) => {
    onChange(selected.filter((v) => v !== value));
  }, [onChange, selected]);

  return (
    <div className="relative w-full text-sm multi-select-container">
                       <div
          className={`bg-zinc-800 border rounded px-3 py-2 cursor-pointer text-white h-[40px] flex items-center transition-all duration-200 ${
            selected.length > 0 
              ? 'border-purple-500 bg-zinc-800/90' 
              : 'border-zinc-600 hover:border-zinc-500'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
        {selected.length === 0 ? (
          <span className="text-gray-400">
            {placeholder}
          </span>
        ) : (
          <div className="flex items-center gap-1 w-full">
            {isAllSelected ? (
              <span
                className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg"
              >
                Todos
                <button
                  className="ml-1 hover:text-purple-300 text-white font-bold text-xs transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  ×
                </button>
              </span>
            ) : (
              // SEMPRE mostrar 3 elementos: 2 tags + contador ou espaços vazios
              <>
                <span
                  className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg"
                >
                  {selected[0] || ''}
                  {selected[0] && (
                    <button
                      className="ml-1 hover:text-purple-300 text-white font-bold text-xs transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(selected[0]);
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
                <span
                  className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg"
                >
                  {selected[1] || ''}
                  {selected[1] && (
                    <button
                      className="ml-1 hover:text-purple-300 text-white font-bold text-xs transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(selected[1]);
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg">
                  {selected.length > 2 ? `+${selected.length - 2}` : ''}
                </span>
              </>
            )}
          </div>
        )}
      </div>

                          {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-[9999] max-h-64 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => toggleOption(opt)}
              className={`px-3 py-2 cursor-pointer transition-colors text-white select-none text-base rounded-md mb-1 mx-1 ${
                (opt === "Todos" && isAllSelected) || (opt !== "Todos" && selected.includes(opt))
                  ? "bg-purple-600 text-white font-bold shadow-lg"
                  : "hover:bg-zinc-800 hover:bg-opacity-80"
              }`}
            >
              <div className="flex items-center">
                {opt}
              </div>
            </div>
          ))}
        </div>
      )}
         </div>
   );
 }

export default memo(MultiSelect);
