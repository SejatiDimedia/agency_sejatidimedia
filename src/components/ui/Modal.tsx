'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div
        className={`bg-white rounded-[2.5rem] w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative my-8 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-4 pr-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};
