import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  name, 
  value, 
  placeholder, 
  onChange, 
  icon,
  isTextArea = false
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        {icon && <span className="text-pink-500">{icon}</span>}
        {label}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        />
      )}
    </div>
  );
};