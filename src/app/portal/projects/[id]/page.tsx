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
  Info,
  Upload,
  FileText,
  Download,
  MessageSquare,
  Eye,
  X,
  AlertTriangle,
  CreditCard,
  Clock,
  Kanban,
  List
} from 'lucide-react';

import { InvoiceDetailModal } from '@/components/portal/InvoiceDetailModal';
import { InvoiceModal } from '@/components/portal/InvoiceModal';
import { MilestoneKanbanBoard } from '@/components/portal/MilestoneKanbanBoard';
import { Invoice } from '@/types/portal';
import { ActiveNavSection, MilestoneStatus } from '@/types/portal';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [activeSection, setActiveSection] = useState<ActiveNavSection>('clients-portal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const [project, setProject] = useState<any | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'CLIENT' } | null>(null);

  // Invoice States
  const [projectInvoices, setProjectInvoices] = useState<Invoice[]>([]);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [isInvoiceCreateOpen, setIsInvoiceCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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
  const [milestoneViewMode, setMilestoneViewMode] = useState<'kanban' | 'list'>('kanban');

  // File Deliverables & Comments states
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

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
    onConfirm: () => { }
  });

  // File Preview Modal State
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string; mimeType: string } | null>(null);
  const [previewTextContent, setPreviewTextContent] = useState<string>('');
  const [loadingPreviewText, setLoadingPreviewText] = useState(false);

  // 1b. File Preview Text Content fetcher
  useEffect(() => {
    if (!previewFile) {
      setPreviewTextContent('');
      return;
    }
    const isTextFile = previewFile.mimeType.startsWith('text/') ||
      previewFile.name.endsWith('.txt') ||
      previewFile.name.endsWith('.json') ||
      previewFile.name.endsWith('.md') ||
      previewFile.name.endsWith('.js') ||
      previewFile.name.endsWith('.ts');

    if (isTextFile) {
      setLoadingPreviewText(true);
      setPreviewTextContent('');
      fetch(`/api/projects/deliverables/${previewFile.id}/download?preview=true`)
        .then(res => res.text())
        .then(text => {
          setPreviewTextContent(text);
        })
        .catch(() => {
          setPreviewTextContent('Gagal memuat konten teks.');
        })
        .finally(() => {
          setLoadingPreviewText(false);
        });
    }
  }, [previewFile]);

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

      // Fetch invoices of this project
      const invRes = await fetch(`/api/projects/invoices?projectId=${projectId}`);
      const invData = await invRes.json();
      if (invData.success) {
        setProjectInvoices(invData.invoices);
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

  // 5. Admin: File Upload / Delete Handlers
  const handleUploadFiles = async (milestoneId: string, files: File[]) => {
    if (!files || files.length === 0) return;

    // Filter file yang terlalu besar
    const oversizedFiles = files.filter(f => f.size > 25 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`File berikut terlalu besar (maks 25 MB):\n${oversizedFiles.map(f => f.name).join('\n')}`);
      return;
    }

    setIsUploading(prev => ({ ...prev, [milestoneId]: true }));

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('milestoneId', milestoneId);

        try {
          const res = await fetch('/api/admin/deliverables', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          return { name: file.name, success: data.success, error: data.error };
        } catch (err) {
          return { name: file.name, success: false, error: 'Kesalahan jaringan' };
        }
      });

      const results = await Promise.all(uploadPromises);
      const failures = results.filter(r => !r.success);

      await loadData(false);

      if (failures.length > 0) {
        alert(`Gagal mengunggah file berikut:\n${failures.map(f => `- ${f.name} (${f.error || 'Terjadi kesalahan'})`).join('\n')}`);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengunggah file.');
    } finally {
      setIsUploading(prev => ({ ...prev, [milestoneId]: false }));
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus File Deliverable',
      message: 'Apakah Anda yakin ingin menghapus file deliverable ini secara permanen dari server?',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/deliverables/${fileId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            await loadData(false);
          } else {
            alert('Gagal menghapus file: ' + data.error);
          }
        } catch {
          alert('Kesalahan jaringan.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 6. Comments: Add / Delete / Collapse Handlers
  const handleAddComment = async (milestoneId: string) => {
    const content = commentInputs[milestoneId];
    if (!content || !content.trim()) return;

    try {
      const res = await fetch('/api/projects/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, content: content.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInputs(prev => ({ ...prev, [milestoneId]: '' }));
        await loadData(false);
      } else {
        alert('Gagal mengirim komentar: ' + data.error);
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleDeleteComment = async (milestoneId: string, commentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Komentar',
      message: 'Apakah Anda yakin ingin menghapus komentar ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/projects/comments/${commentId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            await loadData(false);
          } else {
            alert('Gagal menghapus komentar: ' + data.error);
          }
        } catch {
          alert('Kesalahan jaringan.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const toggleCommentsCollapse = (milestoneId: string) => {
    setOpenComments(prev => ({ ...prev, [milestoneId]: !prev[milestoneId] }));
  };

  return (
    <div className="h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-0 lg:gap-5 font-sans antialiased w-full overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        activeSection="clients-portal"
        setActiveSection={setActiveSection}
        leadsCount={0}
        projectsCount={projectsCount}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => { }}
        userRole={userSession?.role || 'CLIENT'}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2.5rem)] overflow-y-auto pr-1">
        {/* Header */}
        <PortalHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openAddLeadModal={() => { }}
          openStyleGuideModal={() => setIsStyleGuideModalOpen(true)}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          userName={userSession?.name}
          userEmail={userSession?.email}
          onMenuClick={() => setMobileSidebarOpen(true)}
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

            {/* Invoice & Tagihan Proyek Section Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Invoice & Tagihan Proyek
                  </h3>
                  <p className="text-xs text-slate-500">Rincian faktur pembayaran, status pelunasan, dan unduh berkas PDF invoice.</p>
                </div>

                {userSession?.role === 'ADMIN' && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setSelectedInvoice(null);
                      setIsInvoiceCreateOpen(true);
                    }}
                    icon={<Plus className="w-4 h-4" />}
                    className="text-xs font-bold shrink-0"
                  >
                    Buat Invoice
                  </Button>
                )}
              </div>

              {/* Financial Summary Cards */}
              {(() => {
                const totalAmount = projectInvoices.reduce((acc, inv) => acc + inv.total, 0);
                const paidAmount = projectInvoices
                  .filter((inv) => inv.status === 'PAID')
                  .reduce((acc, inv) => acc + inv.total, 0);
                const outstandingAmount = Math.max(0, totalAmount - paidAmount);
                const paidPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Card 1: Total Tagihan */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 p-5 rounded-2xl border border-blue-200/80 shadow-sm group hover:border-blue-300 hover:shadow-md transition-all duration-300">
                        {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" /> */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-200 flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {projectInvoices.length} Faktur
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Tagihan (Nett)</span>
                          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 whitespace-nowrap tracking-tight">
                            Rp {totalAmount.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* Card 2: Sudah Dibayar */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50 p-5 rounded-2xl border border-emerald-200/80 shadow-sm group hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                        {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" /> */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {paidPercent}% Lunas
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Sudah Dibayar (Lunas)</span>
                          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 whitespace-nowrap tracking-tight">
                            Rp {paidAmount.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* Card 3: Sisa Tagihan */}
                      <div className={`relative overflow-hidden p-5 rounded-2xl border shadow-sm group transition-all duration-300 ${outstandingAmount > 0
                        ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-slate-50 border-amber-200/80 hover:border-amber-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-slate-50 via-slate-100/40 to-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                        }`}>
                        {/* <div className={`absolute top-0 left-0 right-0 h-1 ${outstandingAmount > 0
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                          : 'bg-gradient-to-r from-slate-400 to-slate-300'
                          }`} /> */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${outstandingAmount > 0
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600'
                            : 'bg-slate-200/60 border border-slate-300 text-slate-500'
                            }`}>
                            <Clock className="w-5 h-5" />
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs ${outstandingAmount > 0
                            ? 'bg-amber-500/10 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${outstandingAmount > 0 ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`} />
                            {outstandingAmount > 0 ? 'Belum Lunas' : 'Lunas Sepenuhnya'}
                          </span>
                        </div>
                        <div>
                          <span className={`text-[11px] font-black uppercase tracking-wider ${outstandingAmount > 0 ? 'text-amber-700' : 'text-slate-400'
                            }`}>Sisa Tagihan (Outstanding)</span>
                          <p className={`text-xl sm:text-2xl font-black mt-1 whitespace-nowrap tracking-tight ${outstandingAmount > 0 ? 'text-amber-700' : 'text-slate-800'
                            }`}>
                            Rp {outstandingAmount.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Total Payment Settlement */}
                    {totalAmount > 0 && (
                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-700 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Progres Pelunasan Tagihan Proyek
                          </span>
                          <span className="text-emerald-700 font-black">{paidPercent}% Terbayar</span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                          <div
                            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-xs"
                            style={{ width: `${paidPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Invoices List Table */}
              {projectInvoices.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">Belum ada invoice yang diterbitkan untuk proyek ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">No. Invoice</th>
                        <th className="py-2.5 px-3">Terbit</th>
                        <th className="py-2.5 px-3">Jatuh Tempo</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {projectInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-bold text-blue-600">{inv.invoiceNumber}</td>
                          <td className="py-3 px-3 text-slate-600">{inv.issuedDate}</td>
                          <td className="py-3 px-3 text-slate-600">{inv.dueDate}</td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">
                            Rp {inv.total.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'SENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : inv.status === 'OVERDUE'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsInvoiceDetailOpen(true);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detail & Bayar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

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
                      className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${editMode ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${editMode ? 'translate-x-4' : 'translate-x-0'
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

            {/* View Switcher: Kanban Board vs List View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setMilestoneViewMode('kanban')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${milestoneViewMode === 'kanban'
                      ? 'bg-white text-[#2C5098] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban Board</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMilestoneViewMode('list')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${milestoneViewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>

              {milestoneViewMode === 'list' && (
                /* Filter Tabs */
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200/50">
                  {(['All', 'To Do', 'In Progress', 'Done'] as const).map((status) => {
                    const count = status === 'All'
                      ? project.milestones.length
                      : project.milestones.filter((m: any) => m.status === status).length;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${statusFilter === status
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        <span>{status === 'All' ? 'Semua' : status}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${statusFilter === status ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Conditional Milestone View */}
            {milestoneViewMode === 'kanban' ? (
              <MilestoneKanbanBoard
                milestones={project.milestones}
                onToggleTask={handleToggleTask}
                onUpdateMilestoneStatus={(mId, newStatus) => handleMilestoneStatusChange(mId, newStatus)}
                onOpenAddMilestone={() => {
                  setCurrentMilestoneEdit(null);
                  setMilestoneForm({ title: '', description: '', dueDate: '', status: 'To Do' });
                  setIsMilestoneModalOpen(true);
                }}
                isAdmin={userSession?.role === 'ADMIN'}
                isDemo={false}
              />
            ) : (
              /* Milestones List */
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
                                  className={`flex items-center gap-2 cursor-pointer text-left focus:outline-none ${userSession?.role !== 'ADMIN' ? 'cursor-default' : ''
                                    }`}
                                >
                                  <CheckCircle2
                                    className={`w-4 h-4 shrink-0 transition-colors ${task.isDone
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

                        {/* File Deliverables Section */}
                        <div className="pt-3 border-t border-slate-100/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                              File Deliverables
                            </span>

                            {/* Admin Upload file action button */}
                            {editMode && (
                              <label className="text-[10px] font-bold text-blue-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                                {isUploading[ms.id] ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Mengunggah...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3 h-3" />
                                    Upload File
                                  </>
                                )}
                                <input
                                  type="file"
                                  multiple
                                  disabled={isUploading[ms.id]}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      handleUploadFiles(ms.id, Array.from(e.target.files));
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>

                          {(!ms.deliverables || ms.deliverables.length === 0) ? (
                            <p className="text-[11px] text-slate-400 italic">Belum ada file deliverable yang diunggah.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {ms.deliverables.map((file: any) => (
                                <div key={file.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100 group">
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                    <div className="flex flex-col truncate">
                                      <span className="font-bold text-slate-700 truncate">{file.name}</span>
                                      <span className="text-[10px] text-slate-400">
                                        {(file.size / 1024).toFixed(1)} KB &bull; {new Date(file.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 pl-2 shrink-0">
                                    <button
                                      onClick={() => setPreviewFile({ id: file.id, name: file.name, mimeType: file.mimeType })}
                                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                                      title="Preview File"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    <a
                                      href={`/api/projects/deliverables/${file.id}/download`}
                                      className="p-1 rounded bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all cursor-pointer"
                                      title="Download File"
                                      download
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>

                                    {editMode && (
                                      <button
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="p-1 rounded bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer"
                                        title="Hapus File"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Diskusi & Feedback Section */}
                        <div className="pt-3 border-t border-slate-100/70 space-y-2">
                          <button
                            onClick={() => toggleCommentsCollapse(ms.id)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-slate-600 uppercase font-bold tracking-wider cursor-pointer focus:outline-none"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Diskusi & Feedback ({ms.comments?.length || 0})</span>
                            <span className="text-[9px] lowercase font-normal">
                              {openComments[ms.id] ? '(klik untuk menutup)' : '(klik untuk membuka)'}
                            </span>
                          </button>

                          {openComments[ms.id] && (
                            <div className="space-y-3 mt-2">
                              {(!ms.comments || ms.comments.length === 0) ? (
                                <p className="text-[11px] text-slate-400 italic">Belum ada diskusi untuk milestone ini.</p>
                              ) : (
                                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                  {ms.comments.map((comment: any) => {
                                    const isMe = comment.userId === userSession?.id;
                                    const isAdminRole = comment.user?.role === 'ADMIN';
                                    return (
                                      <div key={comment.id} className="flex gap-2.5 text-xs">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-slate-600 shrink-0 uppercase text-[9px] shadow-sm">
                                          {comment.user?.name?.substring(0, 2) || 'KL'}
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                              <span className="font-extrabold text-slate-800 text-[11px]">{comment.user?.name}</span>
                                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${isAdminRole ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                }`}>
                                                {isAdminRole ? 'Admin' : 'Klien'}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] text-slate-400">
                                                {new Date(comment.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                              </span>
                                              {(editMode || isMe) && (
                                                <button
                                                  onClick={() => handleDeleteComment(ms.id, comment.id)}
                                                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                                  title="Hapus komentar"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-2 rounded-xl text-[11px] whitespace-pre-wrap">
                                            {comment.content}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Add Comment Input */}
                              <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <textarea
                                  rows={1}
                                  placeholder="Tulis komentar/feedback..."
                                  value={commentInputs[ms.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [ms.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddComment(ms.id);
                                    }
                                  }}
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 placeholder-slate-400 text-slate-700 resize-none"
                                />
                                <button
                                  onClick={() => handleAddComment(ms.id)}
                                  disabled={!commentInputs[ms.id] || !commentInputs[ms.id].trim()}
                                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-md shadow-blue-500/10 transition-all flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
                                >
                                  Kirim
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
              </div>
            )}
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

      {/* File Preview Modal */}
      {previewFile && (() => {
        const isImage = previewFile.mimeType.startsWith('image/');
        const isPdf = previewFile.mimeType === 'application/pdf' || previewFile.name.endsWith('.pdf');
        const isText = previewFile.mimeType.startsWith('text/') ||
          previewFile.name.endsWith('.txt') ||
          previewFile.name.endsWith('.json') ||
          previewFile.name.endsWith('.md') ||
          previewFile.name.endsWith('.js') ||
          previewFile.name.endsWith('.ts');

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 sm:p-6 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex flex-col min-w-0 pr-4 text-left">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                    Pratinjau: {previewFile.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                    Tipe: {previewFile.mimeType || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/api/projects/deliverables/${previewFile.id}/download`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all text-xs font-bold cursor-pointer"
                    download
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Panel */}
              <div className="flex-1 bg-slate-100/50 p-4 sm:p-6 overflow-auto flex items-center justify-center">
                {isImage && (
                  <img
                    src={`/api/projects/deliverables/${previewFile.id}/download?preview=true`}
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-md bg-white border border-slate-200/50"
                  />
                )}

                {isPdf && (
                  <iframe
                    src={`/api/projects/deliverables/${previewFile.id}/download?preview=true`}
                    className="w-full h-full rounded-2xl border border-slate-200 shadow-sm bg-white"
                    title={previewFile.name}
                  />
                )}

                {isText && (
                  <div className="w-full h-full bg-slate-950 rounded-2xl p-4 overflow-auto border border-slate-800 shadow-inner flex flex-col text-left">
                    {loadingPreviewText ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 font-sans">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span>Memuat konten teks...</span>
                      </div>
                    ) : (
                      <pre className="text-[11px] sm:text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                        {previewTextContent || 'File teks kosong.'}
                      </pre>
                    )}
                  </div>
                )}

                {!isImage && !isPdf && !isText && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-sm text-center space-y-4">
                    <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Pratinjau Tidak Tersedia
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Format file ini ({previewFile.name.split('.').pop()?.toUpperCase() || 'Berkas'}) tidak mendukung pratinjau langsung di peramban.
                      </p>
                    </div>
                    <a
                      href={`/api/projects/deliverables/${previewFile.id}/download`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                      download
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh File</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Invoice Modals */}
      <InvoiceDetailModal
        isOpen={isInvoiceDetailOpen}
        onClose={() => setIsInvoiceDetailOpen(false)}
        invoice={selectedInvoice}
        userRole={userSession?.role || 'CLIENT'}
        onInvoiceUpdated={() => loadData(false)}
      />

      {userSession?.role === 'ADMIN' && (
        <InvoiceModal
          isOpen={isInvoiceCreateOpen}
          onClose={() => setIsInvoiceCreateOpen(false)}
          onSuccess={() => loadData(false)}
          projects={project ? [project] : []}
          preselectedProjectId={projectId}
        />
      )}
    </div>
  );
}
