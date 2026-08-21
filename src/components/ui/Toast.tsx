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
      border: 'border-emerald-200/80',
      iconBox: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      icon: <CheckCircle2 className="w-4 h-4" />,
      accent: 'bg-emerald-500',
      title: 'Berhasil',
    },
    warning: {
      border: 'border-amber-200/80',
      iconBox: 'bg-amber-50 border-amber-100 text-amber-600',
      icon: <AlertTriangle className="w-4 h-4" />,
      accent: 'bg-amber-500',
      title: 'Perhatian',
    },
    error: {
      border: 'border-rose-200/80',
      iconBox: 'bg-rose-50 border-rose-100 text-rose-600',
      icon: <AlertCircle className="w-4 h-4" />,
      accent: 'bg-rose-500',
      title: 'Terjadi Kesalahan',
    },
    info: {
      border: 'border-blue-200/80',
      iconBox: 'bg-blue-50 border-blue-100 text-blue-600',
      icon: <Info className="w-4 h-4" />,
      accent: 'bg-blue-600',
      title: 'Informasi',
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-auto font-sans animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`bg-white/98 backdrop-blur-md border ${style.border} rounded-2xl p-4 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_5px_15px_rgba(15,23,42,0.06)] flex items-start gap-3.5 relative overflow-hidden text-left`}
      >
        {/* Left Color Indicator Stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`} />

        {/* Icon Container */}
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBox} shadow-2xs`}>
          {style.icon}
        </div>

        {/* Message Content */}
        <div className="flex-1 pr-3 text-xs font-semibold text-slate-800 leading-relaxed pt-0.5">
          {message}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer p-1 rounded-lg shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

