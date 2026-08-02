'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  isOpen: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  type = 'success',
  message,
  onClose,
  duration = 6000,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-slate-900/95 border-emerald-500/50 text-white',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      accent: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-slate-900/95 border-amber-500/50 text-white',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      accent: 'bg-amber-500',
    },
    error: {
      bg: 'bg-slate-900/95 border-rose-500/50 text-white',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      accent: 'bg-rose-500',
    },
    info: {
      bg: 'bg-slate-900/95 border-blue-500/50 text-white',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      accent: 'bg-blue-500',
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-auto font-sans">
      <div
        className={`${style.bg} border backdrop-blur-md rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-start gap-3 relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`}
      >
        {/* Left Color Indicator Stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`} />

        <div className="pl-1 pt-0.5">{style.icon}</div>

        <div className="flex-1 pr-6 text-xs font-medium leading-relaxed">
          {message}
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
