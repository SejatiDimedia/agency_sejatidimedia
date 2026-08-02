'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Contact,
  Settings,
  LogOut,
  ChevronsLeft,
  Plus,
  Globe,
  Sparkles,
  FolderKanban
} from 'lucide-react';
import { ActiveNavSection } from '@/types/portal';
import { SidebarItem } from '@/components/ui';

interface PortalSidebarProps {
  activeSection?: ActiveNavSection;
  setActiveSection?: (section: ActiveNavSection) => void;
  leadsCount: number;
  projectsCount: number;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  openAddLeadModal: () => void;
  userRole?: 'ADMIN' | 'CLIENT';
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeSection = 'dashboard-leads',
  setActiveSection,
  leadsCount,
  projectsCount,
  collapsed,
  setCollapsed,
  openAddLeadModal,
  userRole = 'CLIENT',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (path: string, sectionKey?: ActiveNavSection) => {
    if (setActiveSection && sectionKey) {
      setActiveSection(sectionKey);
    }
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/auth/login');
    }
  };

  const isDashboardActive = pathname === '/admin/dashboard';
  const isPortalActive = pathname === '/portal';
  const isDesignSystemActive = pathname === '/design-system' || pathname === '/admin/components';
  const isAdmin = userRole === 'ADMIN';

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-slate-200/70 flex flex-col justify-between shrink-0 transition-all duration-300 relative z-20`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="SejatiDimedia Logo" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-slate-900 text-base leading-snug tracking-tight">
                  SejatiDimedia
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                  {isAdmin ? 'Admin Control Center' : 'Client Portal'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Group 1: GENERAL / CLIENT MENU */}
        <div className="mb-6">
          {!collapsed && (
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
              {isAdmin ? 'ADMIN MENU' : 'CLIENT WORKSPACE'}
            </p>
          )}

          <nav className="space-y-1.5">
            {/* ADMIN ONLY: Dashboard Leads */}
            {isAdmin && (
              <SidebarItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Dashboard Leads"
                isActive={isDashboardActive}
                onClick={() => handleNavigate('/admin/dashboard', 'dashboard-leads')}
                count={leadsCount}
                collapsed={collapsed}
              />
            )}

            {/* CLIENT & ADMIN: Client Portal / Projects */}
            <SidebarItem
              icon={<FolderKanban className="w-5 h-5 text-blue-600" />}
              label={isAdmin ? "Client Portal View" : "My Projects & Milestones"}
              isActive={isPortalActive && activeSection !== 'settings'}
              onClick={() => handleNavigate('/portal', 'clients-portal')}
              count={projectsCount}
              collapsed={collapsed}
            />

            {/* CLIENT & ADMIN: Deliverables & Files */}
            <SidebarItem
              icon={<FolderOpen className="w-5 h-5" />}
              label="File Deliverables"
              isActive={false}
              onClick={() => handleNavigate('/portal', 'file-management')}
              collapsed={collapsed}
            />

            {/* ADMIN ONLY MENU ITEMS */}
            {isAdmin && (
              <>
                <SidebarItem
                  icon={<Sparkles className="w-5 h-5 text-amber-500" />}
                  label="UI Design Showcase"
                  isActive={isDesignSystemActive}
                  onClick={() => handleNavigate('/admin/components')}
                  collapsed={collapsed}
                />

                <SidebarItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Calendar"
                  isActive={false}
                  onClick={() => handleNavigate('/admin/dashboard', 'calendar')}
                  collapsed={collapsed}
                />

                <SidebarItem
                  icon={<Contact className="w-5 h-5" />}
                  label="Team & Clients"
                  isActive={false}
                  onClick={() => handleNavigate('/admin/dashboard', 'team')}
                  collapsed={collapsed}
                />
              </>
            )}
          </nav>
        </div>

        {/* Navigation Group 2: MY WORKSPACE (ADMIN ONLY) */}
        {isAdmin && (
          <div>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  LEAD WORKSPACE
                </p>
                <button
                  onClick={openAddLeadModal}
                  className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Tambah Item Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <nav className="space-y-1">
              <div
                onClick={() => handleNavigate('/admin/dashboard')}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                {!collapsed && <span className="ml-3 truncate">Leads Pipeline</span>}
              </div>
              <div
                onClick={() => handleNavigate('/portal')}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                {!collapsed && <span className="ml-3 truncate">Active Client Projects</span>}
              </div>
              <div
                onClick={() => handleNavigate('/design-system')}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                {!collapsed && <span className="ml-3 truncate">Design System & UI</span>}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Area: Settings & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => handleNavigate('/portal', 'settings')}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2 rounded-2xl text-xs font-semibold ${
            activeSection === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80'
          } transition-colors cursor-pointer`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-3 truncate">Settings & Password</span>}
        </button>

        <button
          onClick={() => router.push('/')}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer`}
        >
          <Globe className="w-4 h-4 shrink-0 text-slate-500" />
          {!collapsed && <span className="ml-3 truncate">Ke Landing Page</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer`}
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          {!collapsed && <span className="ml-3 truncate">Log out</span>}
        </button>
      </div>
    </aside>
  );
};
