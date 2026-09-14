'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  isOpen: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const positionClasses: Record<string, { container: string; motionY: number }> = {
  'top-right': {
    container: 'top-5 right-5 sm:top-6 sm:right-6',
    motionY: -20,
  },
  'top-center': {
    container: 'top-5 left-1/2 -translate-x-1/2 sm:top-6',
    motionY: -20,
  },
  'top-left': {
    container: 'top-5 left-5 sm:top-6 sm:left-6',
    motionY: -20,
  },
  'bottom-right': {
    container: 'bottom-5 right-5 sm:bottom-6 sm:right-6',
    motionY: 20,
  },
  'bottom-center': {
    container: 'bottom-5 left-1/2 -translate-x-1/2 sm:bottom-6',
    motionY: 20,
  },
  'bottom-left': {
    container: 'bottom-5 left-5 sm:bottom-6 sm:left-6',
    motionY: 20,
  },
};

const typeStyles = {
  success: {
    border: 'border-emerald-200/85',
    iconBadge: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 ring-4 ring-emerald-500/10 shadow-xs',
    pillBadge: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/70',
    icon: <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />,
    defaultTitle: 'Berhasil',
    progressBar: 'from-emerald-500 via-teal-500 to-emerald-400',
    glow: 'shadow-[0_20px_45px_-12px_rgba(16,185,129,0.18),0_4px_16px_rgba(15,23,42,0.06)]',
  },
  warning: {
    border: 'border-amber-200/85',
    iconBadge: 'bg-amber-50 text-amber-600 border border-amber-200/80 ring-4 ring-amber-500/10 shadow-xs',
    pillBadge: 'bg-amber-100/70 text-amber-800 border border-amber-200/70',
    icon: <AlertTriangle className="w-5 h-5 stroke-[2.2]" />,
    defaultTitle: 'Perhatian',
    progressBar: 'from-amber-500 via-orange-500 to-amber-400',
    glow: 'shadow-[0_20px_45px_-12px_rgba(245,158,11,0.18),0_4px_16px_rgba(15,23,42,0.06)]',
  },
  error: {
    border: 'border-rose-200/85',
    iconBadge: 'bg-rose-50 text-rose-600 border border-rose-200/80 ring-4 ring-rose-500/10 shadow-xs',
    pillBadge: 'bg-rose-100/70 text-rose-800 border border-rose-200/70',
    icon: <AlertCircle className="w-5 h-5 stroke-[2.2]" />,
    defaultTitle: 'Terjadi Kesalahan',
    progressBar: 'from-rose-500 via-pink-500 to-rose-400',
    glow: 'shadow-[0_20px_45px_-12px_rgba(244,63,94,0.18),0_4px_16px_rgba(15,23,42,0.06)]',
  },
  info: {
    border: 'border-blue-200/85',
    iconBadge: 'bg-blue-50 text-[#2C5098] border border-blue-200/80 ring-4 ring-blue-500/10 shadow-xs',
    pillBadge: 'bg-blue-100/70 text-blue-800 border border-blue-200/70',
    icon: <Info className="w-5 h-5 stroke-[2.2]" />,
    defaultTitle: 'Informasi',
    progressBar: 'from-[#2C5098] via-blue-600 to-indigo-500',
    glow: 'shadow-[0_20px_45px_-12px_rgba(44,80,152,0.18),0_4px_16px_rgba(15,23,42,0.06)]',
  },
};

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  type = 'success',
  title,
  message,
  onClose,
  duration = 5000,
  position = 'top-right',
  action,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [currentType, setCurrentType] = useState<'success' | 'warning' | 'error' | 'info'>(type);
  const [currentTitle, setCurrentTitle] = useState<string | undefined>(title);
  const [remaining, setRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Sync state when toast opens
  useEffect(() => {
    if (isOpen) {
      if (message) setCurrentMessage(message);
      if (type) setCurrentType(type);
      setCurrentTitle(title);
      setRemaining(duration);
      setIsExiting(false);
      setIsPaused(false);
    }
  }, [isOpen, message, type, title, duration]);

  const handleClose = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 220);
  };

  // Interval countdown for progress bar & auto-dismiss
  useEffect(() => {
    if (!isOpen || isPaused || isExiting || duration <= 0) return;

    const intervalTime = 50;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= intervalTime) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - intervalTime;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, isExiting, duration]);

  const pos = positionClasses[position] || positionClasses['top-right'];
  const style = typeStyles[currentType] || typeStyles.info;
  const progressPercent = duration > 0 ? Math.max(0, Math.min(100, (remaining / duration) * 100)) : 0;

  return (
    <div
      className={`fixed ${pos.container} z-[99999] pointer-events-none w-[calc(100vw-2.5rem)] sm:w-[390px] max-w-md font-sans`}
    >
      <AnimatePresence>
        {isOpen && !isExiting && (
          <motion.div
            initial={{ opacity: 0, y: pos.motionY, scale: 0.94, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: pos.motionY * 0.7, scale: 0.94, filter: 'blur(2px)' }}
            transition={{ type: 'spring', stiffness: 460, damping: 32 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`pointer-events-auto bg-white/98 backdrop-blur-xl border ${style.border} ${style.glow} rounded-2xl overflow-hidden text-left relative transition-all duration-200`}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3.5 p-4 sm:p-4.5">
              {/* Icon Container */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBadge}`}>
                {style.icon}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-sans font-bold text-xs sm:text-[13px] text-slate-900 tracking-tight">
                    {currentTitle || style.defaultTitle}
                  </h4>
                  <span
                    className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.pillBadge}`}
                  >
                    {currentType}
                  </span>
                </div>
                <p className="text-slate-600 font-sans text-xs sm:text-[12.5px] leading-relaxed break-words">
                  {currentMessage}
                </p>

                {action && (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-2.5 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {action.label} &rarr;
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Tutup notifikasi"
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Progress Bar */}
            {duration > 0 && (
              <div className="h-1 w-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${style.progressBar} transition-all duration-75 ease-linear`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

