'use client';

import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { sizeClass: string; textClass: string }> = {
  xs: { sizeClass: 'w-6 h-6', textClass: 'text-[10px]' },
  sm: { sizeClass: 'w-8 h-8', textClass: 'text-xs' },
  md: { sizeClass: 'w-10 h-10', textClass: 'text-sm' },
  lg: { sizeClass: 'w-12 h-12', textClass: 'text-base' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'sm',
  className = '',
}) => {
  const { sizeClass, textClass } = sizeStyles[size];
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full border-2 border-white object-cover shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm ${textClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export interface AvatarGroupProps {
  avatars: { src?: string; name: string }[];
  maxDisplay?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  maxDisplay = 3,
  size = 'sm',
  className = '',
}) => {
  const visible = avatars.slice(0, maxDisplay);
  const extraCount = avatars.length - maxDisplay;

  return (
    <div className={`flex items-center -space-x-2 shrink-0 ${className}`}>
      {visible.map((item, index) => (
        <Avatar key={index} src={item.src} name={item.name} size={size} />
      ))}
      {extraCount > 0 && (
        <div
          className={`${sizeStyles[size].sizeClass} rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-sm`}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};
