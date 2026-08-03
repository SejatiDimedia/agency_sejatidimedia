'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { Card, Badge } from '@/components/ui';
import { 
  FolderKanban, 
  Calendar, 
  Loader2, 
  User, 
  ArrowRight,
  Plus
} from 'lucide-react';

import { ActiveNavSection } from '@/types/portal';

export default function ClientPortalDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('clients-portal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
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

  // 2. Fetch projects once session is available
  const fetchProjects = async () => {
    if (!userSession) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userSession]);

  // Calculated project progress based on completed milestones
  const calculateProgress = (project: any) => {
    if (!project || !project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter((m: any) => m.status === 'Done').length;
    return Math.round((completed / project.milestones.length) * 100);
  };
  return (
    <div className="h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased w-full overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        activeSection="clients-portal"
        setActiveSection={setActiveSection}
        leadsCount={0}
        projectsCount={projects.length}
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

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Client Portal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {userSession ? `Akun Terverifikasi: ${userSession.email}` : 'Loading session...'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {userSession?.role === 'ADMIN' ? 'Daftar Proyek Aktif Klien' : 'Daftar Proyek Anda'}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500">Memuat daftar proyek...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 bg-white rounded-[2rem] border border-slate-200/80 shadow-sm text-center py-20 space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Belum Ada Proyek Aktif</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
              Anda saat ini tidak memiliki proyek aktif di portal. Hubungi admin untuk mendaftarkan proyek Anda secara manual atau menyetujui lead proposal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const progress = calculateProgress(project);
              const nextMilestone = project.milestones.find((m: any) => m.status !== 'Done') || project.milestones[project.milestones.length - 1];
              
              return (
                <Card 
                  key={project.id} 
                  className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                  onClick={() => router.push(`/portal/projects/${project.id}`)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="custom" 
                        colorClass="bg-blue-50 text-blue-700 border-blue-200" 
                        label={project.status} 
                      />
                      <span className="text-[10px] font-bold text-slate-400">
                        Mulai: {project.startDate || 'Segera'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Klien: <strong className="text-slate-700">{project.user?.name}</strong>
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Next Milestone Info */}
                    {nextMilestone && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Milestone Terdekat:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[180px]">{nextMilestone.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-end text-xs font-bold text-blue-600 group">
                    <span>Detail Milestone & Task</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              );
            })}
          </div>
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
