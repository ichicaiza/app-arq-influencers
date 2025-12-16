import React from 'react';

interface SelectionGroupProps {
  label: string;
  options: string[];
  selected: string | string[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  multiSelect?: boolean;
}

export const SelectionGroup: React.FC<SelectionGroupProps> = ({ 
  label, 
  options, 
  selected, 
  onChange, 
  icon,
  multiSelect = false
}) => {
  const isSelected = (option: string) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        {icon && <span className="text-pink-500">{icon}</span>}
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all duration-200 text-left truncate
              ${isSelected(option) 
                ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/25' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};