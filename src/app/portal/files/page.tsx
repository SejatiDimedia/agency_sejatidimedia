'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { Card, Badge } from '@/components/ui';
import {
  FileText,
  Download,
  Trash2,
  Search,
  FolderOpen,
  Loader2,
  ExternalLink,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';
import { ActiveNavSection } from '@/types/portal';

export default function PortalFilesPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('file-management');
  const [userSession, setUserSession] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'CLIENT' } | null>(null);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  // Deliverables states
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics states
  const [leadsCount, setLeadsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

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

  // File Preview Text Content fetcher
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

  // Fetch sidebar metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/sidebar-metrics');
      const data = await res.json();
      if (data.success) {
        setLeadsCount(data.leadsCount || 0);
        setProjectsCount(data.projectsCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch sidebar metrics:', err);
    }
  }, []);

  // Load deliverables
  const loadDeliverables = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects/deliverables');
      const data = await res.json();
      if (data.success) {
        setDeliverables(data.deliverables || []);
      }
    } catch (err) {
      console.error('Failed to load deliverables:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user session & initialize
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserSession({
            id: data.user.id,
            name: data.user.name || 'Client User',
            email: data.user.email,
            role: (data.user.role || 'CLIENT') as 'ADMIN' | 'CLIENT',
          });
          setCurrentRole(data.user.role === 'ADMIN' ? 'Admin' : 'Client');
        } else {
          router.replace('/auth/login');
        }
      })
      .catch(() => router.replace('/auth/login'));

    loadDeliverables();
    fetchMetrics();
  }, [router, loadDeliverables, fetchMetrics]);

  // Handle delete file deliverable
  const handleDeleteFile = (fileId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Berkas Deliverable',
      message: 'Apakah Anda yakin ingin menghapus berkas ini secara permanen dari server penyimpanan R2?',
      confirmText: 'Hapus Permanen',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/deliverables/${fileId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            await loadDeliverables();
            await fetchMetrics();
          } else {
            alert('Gagal menghapus berkas: ' + data.error);
          }
        } catch {
          alert('Terjadi kesalahan jaringan.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Filter deliverables based on search term
  const filteredDeliverables = deliverables.filter((file) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = file.name.toLowerCase().includes(searchLower);
    const projectMatch = file.milestone?.project?.name?.toLowerCase().includes(searchLower) || false;
    const clientMatch = file.milestone?.project?.user?.name?.toLowerCase().includes(searchLower) || false;
    return nameMatch || projectMatch || clientMatch;
  });

  return (
    <div className="h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-0 lg:gap-5 font-sans antialiased w-full overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        leadsCount={leadsCount}
        projectsCount={projectsCount}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => { }}
        userRole={userSession?.role || 'CLIENT'}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 rounded-[2.5rem] border border-slate-200/60 p-4 sm:p-6 shadow-xl relative overflow-hidden h-full">
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

        {/* Inner Scroll container */}
        <div className="h-[calc(100vh-2.5rem)] overflow-y-auto pr-1 space-y-6 mt-4">

          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Penyimpanan Awan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Semua Berkas Deliverables
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftar seluruh berkas dan hasil pekerjaan terdokumentasi yang diunggah oleh tim untuk proyek Anda.
            </p>
          </div>

          {/* Search bar & Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berkas berdasarkan nama berkas, proyek, atau klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm placeholder-slate-400 text-slate-700 transition-all"
            />
          </div>

          {/* Deliverables Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-xs font-bold text-slate-500">Memuat berkas-berkas...</span>
            </div>
          ) : filteredDeliverables.length === 0 ? (
            <div className="p-8 bg-white rounded-[2rem] border border-slate-200/80 shadow-sm text-center py-20 space-y-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Berkas Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
                {searchTerm ? 'Tidak ada berkas yang cocok dengan pencarian Anda.' : 'Belum ada berkas deliverable yang diunggah untuk proyek Anda saat ini.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
              {filteredDeliverables.map((file) => (
                <Card
                  key={file.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="custom"
                        colorClass="bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                        label={(file.size / 1024 / 1024).toFixed(2) + ' MB'}
                      />
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(file.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug break-all line-clamp-2" title={file.name}>
                          {file.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wide">
                          Mime: {file.mimeType}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-500">
                      <div className="flex justify-between">
                        <span>Proyek:</span>
                        <strong className="text-slate-700 truncate max-w-[70%]">{file.milestone?.project?.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Milestone:</span>
                        <span className="text-slate-600 truncate max-w-[65%] italic">{file.milestone?.title}</span>
                      </div>
                      {userSession?.role === 'ADMIN' && file.milestone?.project?.user?.name && (
                        <div className="flex justify-between">
                          <span>Klien:</span>
                          <span className="text-slate-600 font-medium">{file.milestone?.project?.user?.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => setPreviewFile({ id: file.id, name: file.name, mimeType: file.mimeType })}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Pratinjau
                    </button>

                    <a
                      href={`/api/projects/deliverables/${file.id}/download`}
                      className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      download
                    >
                      <Download className="w-4 h-4" />
                      Unduh
                    </a>

                    <button
                      onClick={() => router.push(`/portal/projects/${file.milestone?.projectId}`)}
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Lihat Detail Proyek"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {userSession?.role === 'ADMIN' && (
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all cursor-pointer"
                        title="Hapus Berkas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />

      {/* Custom Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-sm">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">{confirmDialog.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{confirmDialog.message}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {confirmDialog.cancelText || 'Batal'}
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/10 transition-colors cursor-pointer"
              >
                {confirmDialog.confirmText || 'Ya, Hapus'}
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
    </div>
  );
}
