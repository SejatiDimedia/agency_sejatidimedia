'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-2xl gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#4A85D9] hover:bg-[#3b74c8] text-white shadow-md shadow-blue-500/25 active:scale-[0.98]',
    secondary:
      'bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 active:scale-[0.98]',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900',
    outline:
      'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
