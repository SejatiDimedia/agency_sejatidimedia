'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  id?: string;
  'aria-label'?: string;
}

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  className = '',
  title,
  id,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const isCheckedOrIndeterminate = checked || indeterminate;

  return (
    <label
      id={id}
      title={title}
      aria-label={ariaLabel || title}
      className={`group relative inline-flex items-center justify-center p-1 cursor-pointer select-none transition-transform active:scale-90 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-checked={indeterminate ? 'mixed' : checked}
      />

      <div
        className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-150 ease-out ${
          isCheckedOrIndeterminate
            ? 'bg-gradient-to-br from-blue-600 to-[#23385B] border-[1.5px] border-blue-600 text-white shadow-xs shadow-blue-600/30'
            : 'bg-white border-[1.5px] border-slate-300 hover:border-blue-500 group-hover:border-slate-400 shadow-2xs'
        } group-focus-within:ring-2 group-focus-within:ring-blue-500/40 group-focus-within:ring-offset-1`}
      >
        {indeterminate ? (
          <Minus className="w-3 h-3 stroke-[3.5] text-white transition-transform duration-150 scale-100" />
        ) : checked ? (
          <Check className="w-3.5 h-3.5 stroke-[3.5] text-white transition-transform duration-150 scale-100 animate-in zoom-in-75 duration-100" />
        ) : null}
      </div>
    </label>
  );
}
