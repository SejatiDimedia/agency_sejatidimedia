'use client';

import React from 'react';

export type StatusType = 'New' | 'Reviewing' | 'Proposal' | 'Won' | 'Lost' | 'Spam' | 'Active' | 'Completed' | 'Pending';

export interface BadgeProps {
  status?: StatusType;
  label?: string;
  count?: number;
  showDot?: boolean;
  variant?: 'status' | 'custom';
  colorClass?: string;
  className?: string;
}

const statusStyles: Record<StatusType, { bg: string; text: string; border: string; dot: string }> = {
  New: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/80',
    dot: 'bg-blue-500',
  },
  Reviewing: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/80',
    dot: 'bg-amber-500',
  },
  Proposal: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80',
    dot: 'bg-indigo-500',
  },
  Won: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  Lost: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300/80',
    dot: 'bg-slate-400',
  },
  Spam: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/80',
    dot: 'bg-rose-500',
  },
  Active: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/80',
    dot: 'bg-blue-500',
  },
  Completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/80',
    dot: 'bg-amber-500',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  status = 'New',
  label,
  count,
  showDot = false,
  variant = 'status',
  colorClass = '',
  className = '',
}) => {
  if (variant === 'custom') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-colors ${colorClass} ${className}`}
      >
        {label}
        {count !== undefined && <span className="opacity-80">({count})</span>}
      </span>
    );
  }

  const currentStyle = statusStyles[status] || statusStyles.New;
  const displayLabel = label || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentStyle.dot}`} />
      )}
      <span>{displayLabel}</span>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/60">
          {count}
        </span>
      )}
    </span>
  );
};
