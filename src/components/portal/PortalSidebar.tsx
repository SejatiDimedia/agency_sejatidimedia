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
import { color } from 'framer-motion';

interface PortalSidebarProps {
  activeSection?: ActiveNavSection;
  setActiveSection?: (section: ActiveNavSection) => void;
  leadsCount?: number;
  projectsCount?: number;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  openAddLeadModal?: () => void;
  userRole?: 'ADMIN' | 'CLIENT';
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeSection = 'dashboard-leads',
  setActiveSection,
  leadsCount: propLeadsCount,
  projectsCount: propProjectsCount,
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed,
  openAddLeadModal = () => { },
  userRole: propUserRole = 'CLIENT',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Internalized state for metrics and collapse state to prevent flashing/blinking
  const [isCollapsed, setIsCollapsed] = React.useState(propCollapsed ?? false);
  const [userRole, setUserRole] = React.useState<'ADMIN' | 'CLIENT'>(propUserRole);
  const [metrics, setMetrics] = React.useState({ leadsCount: 0, projectsCount: 0 });

  // Sync role & collapse prop changes if any
  React.useEffect(() => {
    if (propCollapsed !== undefined) {
      setIsCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  React.useEffect(() => {
    if (propUserRole) {
      setUserRole(propUserRole);
    }
  }, [propUserRole]);

  // Load collapse state and fetch metrics
  React.useEffect(() => {
    // Load saved collapse state synchronously
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    }

    // Fetch user session first to determine the role accurately
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserRole(data.user.role);
        }
      })
      .catch(() => { });

    // Fetch real-time metric counts
    fetch('/api/sidebar-metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics({
            leadsCount: data.leadsCount,
            projectsCount: data.projectsCount,
          });
        }
      })
      .catch((err) => console.error('Failed to load metrics:', err));
  }, [pathname]);

  const toggleCollapse = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(nextCollapsed));
    }
    if (propSetCollapsed) {
      propSetCollapsed(nextCollapsed);
    }
  };

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
  const isPortalActive = pathname === '/portal' || pathname.startsWith('/portal/projects');
  const isDesignSystemActive = pathname === '/design-system' || pathname === '/admin/components';
  const isAdmin = userRole === 'ADMIN';

  // Use prop counts as fallback if dynamic metrics are not yet loaded
  const finalLeadsCount = metrics.leadsCount || propLeadsCount || 0;
  const finalProjectsCount = metrics.projectsCount || propProjectsCount || 0;

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-72'
        } bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-slate-200/70 flex flex-col shrink-0 transition-all duration-300 relative z-20 h-[calc(100vh-2.5rem)] sticky top-5`}
    >
      {/* Top Header & Logo - Fixed */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="SejatiDimedia Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span
                  className="font-bold text-slate-900 text-base leading-snug tracking-tight uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span style={{ color: '#2E54A2' }}>Sejati</span> <span style={{ color: '#23385B' }}>Dimedia</span>
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        {/* Navigation Group 1: GENERAL / CLIENT MENU */}
        <div className="mb-6">
          {!isCollapsed && (
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
                count={finalLeadsCount}
                collapsed={isCollapsed}
              />
            )}

            {/* CLIENT & ADMIN: Client Portal / Projects */}
            <SidebarItem
              icon={<FolderKanban className="w-5 h-5" />}
              label={isAdmin ? "Client Portal View" : "My Projects & Milestones"}
              isActive={isPortalActive && activeSection !== 'settings'}
              onClick={() => handleNavigate('/portal', 'clients-portal')}
              count={finalProjectsCount}
              collapsed={isCollapsed}
            />

            {/* CLIENT & ADMIN: Deliverables & Files */}
            <SidebarItem
              icon={<FolderOpen className="w-5 h-5" />}
              label="File Deliverables"
              isActive={false}
              onClick={() => handleNavigate('/portal', 'file-management')}
              collapsed={isCollapsed}
            />

            {/* ADMIN ONLY MENU ITEMS */}
            {isAdmin && (
              <>
                <SidebarItem
                  icon={<Sparkles className="w-5 h-5" />}
                  label="UI Design Showcase"
                  isActive={isDesignSystemActive}
                  onClick={() => handleNavigate('/admin/components')}
                  collapsed={isCollapsed}
                />

                <SidebarItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Calendar"
                  isActive={false}
                  onClick={() => handleNavigate('/admin/dashboard', 'calendar')}
                  collapsed={isCollapsed}
                />

                <SidebarItem
                  icon={<Contact className="w-5 h-5" />}
                  label="Team & Clients"
                  isActive={false}
                  onClick={() => handleNavigate('/admin/dashboard', 'team')}
                  collapsed={isCollapsed}
                />
              </>
            )}
          </nav>
        </div>

        {/* Navigation Group 2: MY WORKSPACE (ADMIN ONLY) */}
        {isAdmin && (
          <div>
            {!isCollapsed && (
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
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                {!isCollapsed && <span className="ml-3 truncate">Leads Pipeline</span>}
              </div>
              <div
                onClick={() => handleNavigate('/portal')}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                {!isCollapsed && <span className="ml-3 truncate">Active Client Projects</span>}
              </div>
              <div
                onClick={() => handleNavigate('/design-system')}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100/80 rounded-2xl cursor-pointer transition-colors`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                {!isCollapsed && <span className="ml-3 truncate">Design System & UI</span>}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Area: Settings & Logout - Fixed */}
      <div className="shrink-0 pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => handleNavigate('/portal/settings', 'settings')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
            } py-2 rounded-2xl text-xs font-semibold ${activeSection === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80'
            } transition-colors cursor-pointer`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="ml-3 truncate">Settings & Password</span>}
        </button>

        <button
          onClick={() => router.push('/')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
            } py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer`}
        >
          <Globe className="w-4 h-4 shrink-0 text-slate-500" />
          {!isCollapsed && <span className="ml-3 truncate">Ke Landing Page</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
            } py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer`}
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          {!isCollapsed && <span className="ml-3 truncate">Log out</span>}
        </button>
      </div>
    </aside>
  );
};
