'use client';

import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-slate-800 placeholder-slate-400 text-sm font-medium ${
            icon ? 'pl-11' : 'px-4'
          } py-2.5 rounded-2xl border ${
            error ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200/80 focus:border-blue-500 focus:ring-blue-500/20'
          } shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 transition-all ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-400 mt-1 font-medium">{helperText}</p>
      )}
    </div>
  );
};

export interface SearchInputProps extends Omit<InputProps, 'icon'> {
  onSearchChange?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearchChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <Input
      type="text"
      icon={<Search className="w-4 h-4 text-slate-400" />}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};
