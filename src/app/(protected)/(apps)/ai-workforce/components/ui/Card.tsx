import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  onClick
}: CardProps) {
  return (
    <div
      className={`
        bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] p-6
        ${onClick ? 'cursor-pointer hover:border-[#4c4c4e] transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-[#3c3c3e] rounded-xl">
              <Icon className="w-5 h-5 text-white/60" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-medium text-white/90">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-white/60">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}