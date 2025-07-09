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

  const isAllSelected = options.length > 0 && selected.length === options.length;
  const isOnlyTodosSelected = selected.length === 1 && selected[0] === "Todos";

  const toggleOption = (value: string) => {
    if (value === "Todos") {
      if (isAllSelected || isOnlyTodosSelected) {
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

  console.log("MultiSelect render - selected:", selected, "options:", options);

  return (
    <div className="relative min-w-[180px] max-w-[220px] w-auto text-sm">
      <div
        className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 cursor-pointer text-white min-h-[40px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {isAllSelected || isOnlyTodosSelected ? (
              <span
                className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow"
              >
                Todos
                <button
                  className="ml-1 hover:text-purple-300 text-white font-bold text-xs"
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
                  className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow"
                >
                  {value}
                  <button
                    className="ml-1 hover:text-purple-300 text-white font-bold text-xs"
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
        <div className="absolute left-0 top-full mt-1 w-full min-w-[180px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => toggleOption(opt)}
              className={`px-3 py-2 cursor-pointer transition-colors text-white select-none text-base rounded-md mb-1 mx-1 ${
                (opt === "Todos" && isAllSelected) || (opt !== "Todos" && selected.includes(opt))
                  ? "bg-zinc-800 text-white font-bold"
                  : "hover:bg-zinc-800"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
