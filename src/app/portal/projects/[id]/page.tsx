'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { Card, Badge, Button } from '@/components/ui';
import { 
  FolderKanban, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  User, 
  ArrowLeft,
  Info
} from 'lucide-react';

import { ActiveNavSection } from '@/types/portal';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [activeSection, setActiveSection] = useState<ActiveNavSection>('clients-portal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const [project, setProject] = useState<any | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'CLIENT' } | null>(null);

  // Admin Editing State
  const [editMode, setEditMode] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [currentMilestoneEdit, setCurrentMilestoneEdit] = useState<any | null>(null); // null means "Create"
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do'
  });
  
  // Task form state per milestone id
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});

  // Tab filter status state
  const [statusFilter, setStatusFilter] = useState<'All' | 'To Do' | 'In Progress' | 'Done'>('All');

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

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

  // 2. Fetch project details and total projects count
  const loadData = async (showSpinner = true) => {
    if (!userSession || !projectId) return;
    try {
      if (showSpinner) setIsLoading(true);
      
      // Fetch details of this project
      const detailRes = await fetch(`/api/projects/${projectId}`);
      const detailData = await detailRes.json();
      
      if (detailData.success) {
        setProject(detailData.project);
      } else {
        alert('Gagal memuat proyek atau Anda tidak memiliki akses.');
        router.push('/portal');
        return;
      }

      // Fetch all projects just to get the total count for the sidebar badge
      const listRes = await fetch('/api/projects');
      const listData = await listRes.json();
      if (listData.success) {
        setProjectsCount(listData.projects.length);
      }
    } catch (err) {
      console.error('Failed to load project detail:', err);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [userSession, projectId]);

  // Calculated project progress based on completed milestones
  const calculateProgress = (proj: any) => {
    if (!proj || !proj.milestones || proj.milestones.length === 0) return 0;
    const completed = proj.milestones.filter((m: any) => m.status === 'Done').length;
    return Math.round((completed / proj.milestones.length) * 100);
  };

  // Helper to format YYYY-MM-DD string into beautiful human-readable format
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Segera';
    const reg = /^\d{4}-\d{2}-\d{2}$/;
    if (reg.test(dateStr)) {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch {
        return dateStr;
      }
    }
    return dateStr;
  };

  // Calculated milestone progress based on completed tasks
  const calculateMilestoneProgress = (milestone: any) => {
    if (!milestone.tasks || milestone.tasks.length === 0) {
      return milestone.status === 'Done' ? 100 : 0;
    }
    const completed = milestone.tasks.filter((t: any) => t.isDone).length;
    return Math.round((completed / milestone.tasks.length) * 100);
  };

  // 3. Admin: Milestone Create / Edit Handler
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !milestoneForm.title.trim()) return;

    try {
      const isEdit = !!currentMilestoneEdit;
      const url = isEdit 
        ? `/api/admin/milestones/${currentMilestoneEdit.id}`
        : '/api/admin/milestones';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: milestoneForm.title,
          description: milestoneForm.description,
          dueDate: milestoneForm.dueDate,
          status: milestoneForm.status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsMilestoneModalOpen(false);
        setCurrentMilestoneEdit(null);
        setMilestoneForm({ title: '', description: '', dueDate: '', status: 'To Do' });
        await loadData(false);
      } else {
        alert('Gagal menyimpan milestone: ' + data.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleOpenMilestoneEdit = (milestone: any) => {
    setCurrentMilestoneEdit(milestone);
    setMilestoneForm({
      title: milestone.title || '',
      description: milestone.description || '',
      dueDate: milestone.dueDate || '',
      status: milestone.status || 'To Do'
    });
    setIsMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Milestone',
      message: 'Apakah Anda yakin ingin menghapus milestone ini beserta seluruh task di dalamnya secara permanen?',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/milestones/${milestoneId}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            await loadData(false);
          } else {
            alert('Gagal menghapus: ' + data.error);
          }
        } catch (err) {
          alert('Kesalahan jaringan.');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 4. Admin: Task Add / Delete / Toggle Handlers
  const handleAddTask = async (milestoneId: string) => {
    const title = newTaskTitles[milestoneId];
    if (!title || !title.trim()) return;

    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, title }),
      });
      const data = await res.json();
      if (data.success) {
        setNewTaskTitles(prev => ({ ...prev, [milestoneId]: '' }));
        await loadData(false);
      }
    } catch (err) {
      alert('Gagal menambahkan task.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Task Checklist',
      message: 'Apakah Anda yakin ingin menghapus task checklist ini?',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/tasks/${taskId}`, { method: 'DELETE' });
          if (res.ok) await loadData(false);
        } catch {
          alert('Gagal menghapus task.');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleTask = async (task: any) => {
    // Both Admin and Client can toggle, but let's allow Admin for control
    // According to PRD, Client is Read-Only for tasks checklist. Let's enforce that!
    if (userSession?.role !== 'ADMIN') {
      return; // Read-Only for Client
    }

    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: !task.isDone }),
      });
      if (res.ok) await loadData(false);
    } catch {
      console.error('Failed to toggle task');
    }
  };

  // Quick milestone status toggle for Admin
  const handleMilestoneStatusChange = async (milestoneId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await loadData(false);
      }
    } catch (err) {
      console.error('Failed to change milestone status');
    }
  };

  return (
    <div className="h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased w-full overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        activeSection="clients-portal"
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
            <span className="text-xs font-bold text-slate-500">Memuat detail proyek...</span>
          </div>
        ) : !project ? (
          <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm text-center py-20 space-y-4">
            <h3 className="text-lg font-bold text-slate-700">Proyek Tidak Ditemukan</h3>
            <Button onClick={() => router.push('/portal')}>Kembali ke Portal</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back to Portal List Button */}
            <button
              onClick={() => router.push('/portal')}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Proyek</span>
            </button>

            {/* Overview Banner Card */}
            <Card className="bg-gradient-to-r from-slate-900 to-blue-950 text-white border-none shadow-xl relative overflow-hidden p-6 rounded-[2rem]">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="custom" 
                    colorClass="bg-blue-500/20 text-blue-300 border-blue-400/30" 
                    label={project.status} 
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Mulai: {project.startDate || 'Segera'}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{project.name}</h2>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Klien: <strong className="text-white">{project.user?.name}</strong> ({project.user?.email})
                  </p>
                </div>

                {/* Progress Bar */}
                {(() => {
                  const progress = calculateProgress(project);
                  return (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Overall Project Progress</span>
                        <span className="text-blue-400">{progress}% Selesai</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>

            {/* Title & Admin Editing Switch */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                Milestone & Task Tracking
              </h3>

              <div className="flex items-center gap-3">
                {userSession?.role === 'ADMIN' && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-600">Mode Edit Admin</span>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${
                        editMode ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          editMode ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {editMode && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setCurrentMilestoneEdit(null);
                      setMilestoneForm({ title: '', description: '', dueDate: '', status: 'To Do' });
                      setIsMilestoneModalOpen(true);
                    }}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Tambah Milestone
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit mb-4 border border-slate-200/50">
              {(['All', 'To Do', 'In Progress', 'Done'] as const).map((status) => {
                const count = status === 'All' 
                  ? project.milestones.length 
                  : project.milestones.filter((m: any) => m.status === status).length;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{status === 'All' ? 'Semua' : status}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      statusFilter === status ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
              {project.milestones.length === 0 && (
                <div className="p-10 bg-white border border-dashed border-slate-300 rounded-[1.8rem] text-center text-slate-500 text-xs font-medium">
                  Belum ada milestone yang terdaftar untuk proyek ini.
                </div>
              )}

              {project.milestones.length > 0 && project.milestones.filter((m: any) => statusFilter === 'All' ? true : m.status === statusFilter).length === 0 && (
                <div className="p-10 bg-white border border-dashed border-slate-300 rounded-[1.8rem] text-center text-slate-500 text-xs font-medium">
                  Tidak ada milestone dengan status "{statusFilter === 'All' ? 'Semua' : statusFilter}".
                </div>
              )}
              
              {project.milestones
                .filter((m: any) => statusFilter === 'All' ? true : m.status === statusFilter)
                .map((ms: any) => {
                  const msProgress = calculateMilestoneProgress(ms);
                  return (
                    <Card key={ms.id} variant="default" className="space-y-4 p-5 bg-white border border-slate-200/80 rounded-[1.8rem] shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{ms.title}</h4>
                          
                          {editMode ? (
                            <select
                              value={ms.status}
                              onChange={(e) => handleMilestoneStatusChange(ms.id, e.target.value)}
                              className="text-xs font-bold border border-slate-300 rounded-lg px-2 py-0.5 bg-slate-50 focus:outline-none focus:border-blue-500"
                            >
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                          ) : (
                            <Badge
                              status={ms.status === 'Done' ? 'Won' : ms.status === 'In Progress' ? 'Reviewing' : 'New'}
                              label={ms.status}
                            />
                          )}

                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 shadow-sm">
                            {msProgress}% Selesai
                          </span>
                        </div>
                        {ms.description && (
                          <p className="text-xs text-slate-500 mt-1">{ms.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {formatDate(ms.dueDate)}</span>
                        </div>

                      {editMode && (
                        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                          <button
                            onClick={() => handleOpenMilestoneEdit(ms)}
                            className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors"
                            title="Edit Milestone"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(ms.id)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                            title="Hapus Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      <span>Tasks Checklist</span>
                      {userSession?.role !== 'ADMIN' && (
                        <span className="normal-case font-normal text-slate-400/80 flex items-center gap-0.5 ml-1">
                          <Info className="w-3 h-3 text-slate-300" />
                          read-only
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ms.tasks.map((task: any) => (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between gap-2 text-xs p-2 rounded-xl bg-slate-50 border border-slate-100 group"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task)}
                            disabled={userSession?.role !== 'ADMIN'}
                            className={`flex items-center gap-2 cursor-pointer text-left focus:outline-none ${
                              userSession?.role !== 'ADMIN' ? 'cursor-default' : ''
                            }`}
                          >
                            <CheckCircle2 
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                task.isDone 
                                  ? 'text-emerald-500' 
                                  : 'text-slate-300 group-hover:text-slate-400'
                              }`} 
                            />
                            <span className={task.isDone ? 'line-through text-slate-400' : 'font-medium text-slate-700'}>
                              {task.title}
                            </span>
                          </button>

                          {editMode && (
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Hapus Task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Admin Add Task Input */}
                      {editMode && (
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                          <input
                            type="text"
                            placeholder="Tambah task baru..."
                            value={newTaskTitles[ms.id] || ''}
                            onChange={(e) => setNewTaskTitles({ ...newTaskTitles, [ms.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTask(ms.id);
                            }}
                            className="w-full bg-transparent px-2 py-1 text-xs focus:outline-none placeholder-slate-400 text-slate-700"
                          />
                          <button
                            onClick={() => handleAddTask(ms.id)}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        )}
      </main>

      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />

      {/* Admin Milestone Create / Edit Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-xl space-y-4"
          >
            <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              {currentMilestoneEdit ? 'Edit Milestone' : 'Tambah Milestone Baru'}
            </h3>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Judul Milestone
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fase 1: Wireframing & UI"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Deskripsi / Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan singkat mengenai milestone..."
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={milestoneForm.dueDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    Status
                  </label>
                  <select
                    value={milestoneForm.status}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                >
                  Simpan Milestone
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4 text-center"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {confirmDialog.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {confirmDialog.message}
              </p>
            </div>

            <div className="pt-3 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition-all cursor-pointer"
              >
                {confirmDialog.cancelText || 'Batal'}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                {confirmDialog.confirmText || 'Konfirmasi'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
