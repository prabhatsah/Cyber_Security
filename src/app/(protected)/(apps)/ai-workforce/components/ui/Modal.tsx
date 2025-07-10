import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function Modal({
  title,
  children,
  open,
  onClose,
  className = ''
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className={`
            relative bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e]
            max-h-[90vh] overflow-y-auto
            ${className}
          `}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-[#2c2c2e]">
              <h2 className="text-xl font-semibold text-white/90">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}