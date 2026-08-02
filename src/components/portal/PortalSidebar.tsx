'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FolderOpen, 
  Calendar, 
  Contact, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronsLeft, 
  Plus, 
  Globe 
} from 'lucide-react';
import { ActiveNavSection } from '@/types/portal';
import { SidebarItem } from '@/components/ui';

interface PortalSidebarProps {
  activeSection: ActiveNavSection;
  setActiveSection: (section: ActiveNavSection) => void;
  leadsCount: number;
  projectsCount: number;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  openAddLeadModal: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeSection,
  setActiveSection,
  leadsCount,
  projectsCount,
  collapsed,
  setCollapsed,
  openAddLeadModal,
}) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-slate-200/70 flex flex-col justify-between shrink-0 transition-all duration-300 relative z-20`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
              <span className="bg-gradient-to-tr from-blue-500 to-cyan-400 bg-clip-text text-transparent">S</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-slate-900 text-base leading-snug tracking-tight">
                  SejatiDimedia
                </span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                  Client Portal & Admin
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

        {/* Navigation Group 1: GENERAL */}
        <div className="mb-6">
          {!collapsed && (
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
              GENERAL
            </p>
          )}

          <nav className="space-y-1.5">
            <SidebarItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard Leads"
              isActive={activeSection === 'dashboard-leads'}
              onClick={() => setActiveSection('dashboard-leads')}
              count={leadsCount}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<FolderKanban className="w-5 h-5" />}
              label="Daftar Project"
              isActive={activeSection === 'projects'}
              onClick={() => setActiveSection('projects')}
              count={projectsCount}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<Globe className="w-5 h-5" />}
              label="Client Portal"
              isActive={activeSection === 'clients-portal'}
              onClick={() => setActiveSection('clients-portal')}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<FolderOpen className="w-5 h-5" />}
              label="File Deliverables"
              isActive={activeSection === 'file-management'}
              onClick={() => setActiveSection('file-management')}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<Calendar className="w-5 h-5" />}
              label="Calendar"
              isActive={activeSection === 'calendar'}
              onClick={() => setActiveSection('calendar')}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<Contact className="w-5 h-5" />}
              label="Team & Clients"
              isActive={activeSection === 'team'}
              onClick={() => setActiveSection('team')}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="Message"
              isActive={false}
              onClick={() => setActiveSection('dashboard-leads')}
              count={10}
              collapsed={collapsed}
            />
          </nav>
        </div>

        {/* Navigation Group 2: MY WORKSPACE */}
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                MY WORKSPACE
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
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              {!collapsed && <span className="ml-3 truncate">Shot Dribbble Showcase</span>}
            </div>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              {!collapsed && <span className="ml-3 truncate">Personal Projects</span>}
            </div>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              {!collapsed && <span className="ml-3 truncate">Team Projects</span>}
            </div>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
              {!collapsed && <span className="ml-3 truncate">Agency SOP & Guidelines</span>}
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Area: Settings, Help & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer`}
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-500" />
          {!collapsed && <span className="ml-3 truncate">Settings</span>}
        </button>

        <button
          className={`w-full flex items-center ${
            collapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer`}
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-500" />
          {!collapsed && <span className="ml-3 truncate">Help Center</span>}
        </button>

        <button
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
