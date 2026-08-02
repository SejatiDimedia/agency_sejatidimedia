'use client';

import React from 'react';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  count?: number;
  collapsed?: boolean;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  count,
  collapsed = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center ${
        collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
      } py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-[#4A85D9] text-white shadow-md shadow-blue-500/25'
          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
      } ${className}`}
    >
      <div className="flex items-center gap-3 truncate">
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
      {!collapsed && count !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
