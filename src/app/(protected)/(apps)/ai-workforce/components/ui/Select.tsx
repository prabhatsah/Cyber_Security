import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  fullWidth = false,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-white/60 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            appearance-none bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90
            border border-[#3c3c3e] pr-10
            focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-white/40" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}