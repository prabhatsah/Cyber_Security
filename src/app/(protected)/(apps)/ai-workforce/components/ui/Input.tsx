import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  icon: Icon,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-white/60 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-white/40" />
          </div>
        )}
        <input
          className={`
            bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90
            border border-[#3c3c3e]
            focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}