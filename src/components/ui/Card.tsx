'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'muted' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  clickable = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200/80 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.03)]',
    muted: 'bg-slate-50/70 border-slate-200/60',
    outlined: 'bg-transparent border-slate-200',
  };

  const hoverStyles = hoverEffect
    ? 'hover:border-blue-300 hover:shadow-md transition-all duration-200'
    : '';

  const cursorStyles = clickable ? 'cursor-pointer select-none' : '';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border ${variantStyles[variant]} ${hoverStyles} ${cursorStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex items-start justify-between gap-3 mb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`font-bold text-slate-900 text-sm sm:text-base leading-snug ${className}`} {...props}>
    {children}
  </h3>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs ${className}`}
    {...props}
  >
    {children}
  </div>
);
