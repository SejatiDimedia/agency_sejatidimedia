'use client';

import React, { useState } from 'react';
import { Bell, Share2, UserPlus, Check, Sparkles, ChevronDown, Menu } from 'lucide-react';
import { SearchInput, Button, AvatarGroup, Avatar } from '@/components/ui';

interface PortalHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  openAddLeadModal: () => void;
  openStyleGuideModal: () => void;
  currentRole: 'Admin' | 'Client';
  setCurrentRole: (role: 'Admin' | 'Client') => void;
  userName?: string;
  userEmail?: string;
  onMenuClick?: () => void;
}

const TEAM_MEMBERS = [
  { name: 'Sarah', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
  { name: 'Alex', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
  { name: 'David', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
  { name: 'Team Member 4' },
  { name: 'Team Member 5' },
  { name: 'Team Member 6' },
];

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  openAddLeadModal,
  openStyleGuideModal,
  currentRole,
  setCurrentRole,
  userName,
  userEmail,
  onMenuClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="no-print w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Search & Hamburger Menu Row */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition-all shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 md:w-80 shrink-0">
          <SearchInput
            value={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search leads, projects, client email..."
          />
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                <span>Notifikasi SejatiDimedia</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">3 Baru</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                  <p className="font-semibold text-slate-900">Inquiry Lead Baru: Budi Santoso</p>
                  <p className="text-slate-500 text-[11px]">Nusantara Logistics • Rp 45M - 65M</p>
                  <p className="text-blue-600 text-[10px] font-medium mt-1">5 menit yang lalu</p>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-800">DP Project Awe Design Diterima</p>
                  <p className="text-slate-500 text-[11px]">Status berubah menjadi Active Project</p>
                  <p className="text-slate-400 text-[10px]">1 jam yang lalu</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80 shrink-0">
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            name={userName || (currentRole === 'Admin' ? 'Takiya Baksh' : 'Client User')}
            size="sm"
            className="ring-2 ring-blue-500/30"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-bold text-xs text-slate-900 leading-tight">
              {userName || (currentRole === 'Admin' ? 'Takiya Baksh' : 'Client User')}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {userEmail || (currentRole === 'Admin' ? 'UI/UX Lead & Admin' : 'Client Portal Access')}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
