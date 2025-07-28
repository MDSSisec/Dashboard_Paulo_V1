// src/components/MultiSelect.tsx
import { useState } from "react";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper para adicionar opção 'Todos'
  const addTodos = (arr: string[]) => arr.filter((v) => v !== "Todos");

  const isAllSelected = options.length > 0 && selected.length === options.length;

  const toggleOption = (value: string) => {
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
  };

  const removeOption = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="relative w-full text-sm">
      <div
        className={`bg-zinc-800 border rounded px-3 py-2 cursor-pointer text-white min-h-[40px] transition-all duration-200 ${
          selected.length > 0 
            ? 'border-purple-500 bg-zinc-800/90' 
            : 'border-zinc-600 hover:border-zinc-500'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400 flex items-center">
            {placeholder}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1">
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
              selected.map((value) => (
                <span
                  key={value}
                  className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg"
                >
                  {value}
                  <button
                    className="ml-1 hover:text-purple-300 text-white font-bold text-xs transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(value);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
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
