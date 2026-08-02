'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { ClientSettingsView } from '@/components/portal/ClientSettingsView';
import { INITIAL_LEADS, INITIAL_PROJECTS } from '@/lib/portalMockData';
import { Project, ActiveNavSection } from '@/types/portal';
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Badge, Button } from '@/components/ui';
import { FolderKanban, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ClientPortalPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('clients-portal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [userSession, setUserSession] = useState<{ name: string; email: string; role: 'ADMIN' | 'CLIENT' } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserSession({
            name: data.user.name || 'Client User',
            email: data.user.email,
            role: data.user.role || 'CLIENT',
          });
        } else {
          router.replace('/auth/login');
        }
      })
      .catch(() => {
        router.replace('/auth/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased">
      {/* Sidebar */}
      <PortalSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        leadsCount={INITIAL_LEADS.length}
        projectsCount={projects.length}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => {}}
        userRole={userSession?.role || 'CLIENT'}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
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

        {/* Settings View */}
        {activeSection === 'settings' ? (
          <ClientSettingsView
            userName={userSession?.name}
            userEmail={userSession?.email}
          />
        ) : (
          <>
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Client Portal
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {userSession ? `Akun Terverifikasi: ${userSession.email}` : 'Authenticated View'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Project Transparency & Milestone Tracking
                </h1>
              </div>
            </div>

        {/* Active Project Highlight */}
        {selectedProject && (
          <div className="space-y-6">
            {/* Overview Banner Card */}
            <Card className="bg-gradient-to-r from-slate-900 to-blue-950 text-white border-none shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="custom" colorClass="bg-blue-500/20 text-blue-300 border-blue-400/30" label={selectedProject.status} />
                  <span className="text-xs font-medium text-slate-300">Terakhir Diperbarui: {selectedProject.lastUpdated}</span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedProject.projectName}</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Klien: <strong className="text-white">{userSession?.name || selectedProject.clientName}</strong> ({userSession?.email || selectedProject.clientEmail})
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Overall Project Progress</span>
                    <span className="text-blue-400">{selectedProject.progress}% Selesai</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Milestones List */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                Daftar Milestone Proyek
              </h3>

              <div className="space-y-4">
                {selectedProject.milestones.map((ms) => (
                  <Card key={ms.id} variant="default" className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{ms.title}</h4>
                          <Badge
                            status={ms.status === 'Done' ? 'Won' : ms.status === 'In Progress' ? 'Reviewing' : 'New'}
                            label={ms.status}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{ms.description}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Deadline: {ms.dueDate}</span>
                      </div>
                    </div>

                    {/* Tasks Checklist */}
                    {ms.tasks.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tasks Checklist (Read-Only):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ms.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                              <span className={task.completed ? 'line-through text-slate-400' : 'font-medium text-slate-700'}>{task.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />
    </div>
  );
}
