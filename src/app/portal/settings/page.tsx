'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { ClientSettingsView } from '@/components/portal/ClientSettingsView';
import { Loader2 } from 'lucide-react';

import { ActiveNavSection } from '@/types/portal';

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('settings');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const [projectsCount, setProjectsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'CLIENT' } | null>(null);

  // 1. Fetch user session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserSession({
            id: data.user.id,
            name: data.user.name || 'Client User',
            email: data.user.email,
            role: data.user.role || 'CLIENT',
          });
          setCurrentRole(data.user.role === 'ADMIN' ? 'Admin' : 'Client');
        } else {
          router.replace('/auth/login');
        }
      })
      .catch(() => {
        router.replace('/auth/login');
      });
  }, [router]);

  // 2. Fetch projects count
  const loadData = async () => {
    if (!userSession) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjectsCount(data.projects.length);
      }
    } catch (err) {
      console.error('Failed to load projects count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userSession]);

  return (
    <div className="h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased w-full overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        activeSection="settings"
        setActiveSection={setActiveSection}
        leadsCount={0}
        projectsCount={projectsCount}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => {}}
        userRole={userSession?.role || 'CLIENT'}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2.5rem)] overflow-y-auto pr-1">
        {/* Header */}
        <PortalHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openAddLeadModal={() => {}}
          openStyleGuideModal={() => setIsStyleGuideModalOpen(true)}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          userName={userSession?.name}
          userEmail={userSession?.email}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500">Memuat pengaturan...</span>
          </div>
        ) : (
          <ClientSettingsView
            userName={userSession?.name}
            userEmail={userSession?.email}
          />
        )}
      </main>

      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />
    </div>
  );
}
