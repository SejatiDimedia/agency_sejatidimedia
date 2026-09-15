'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Edit2, Trash2, ExternalLink, Eye, CheckCircle2,
  Clock, Calendar, Tag, BookOpen, AlertCircle, Sparkles, Loader2,
  FileText, Star, Layers, X, UploadCloud, Image as ImageIcon, Link2, Check
} from 'lucide-react';
import { Toast, ConfirmModal, Checkbox } from '@/components/ui';

interface SeriesItem {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  coverImage?: string | null;
  category: string;
  badge?: string | null;
  isPublished: boolean;
  order: number;
  insights?: Array<{
    id: string;
    slug: string;
    titleId: string;
    seriesPart?: number | null;
  }>;
}

interface InsightItem {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  excerptId: string;
  excerptEn?: string | null;
  contentId: string;
  contentEn?: string | null;
  category: string;
  tags: string[];
  coverImage: string;
  readTimeMinutes: number;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  isPublished: boolean;
  featured: boolean;
  seriesId?: string | null;
  seriesPart?: number | null;
  series?: {
    id: string;
    titleId: string;
    slug: string;
  } | null;
  publishedAt: string;
  updatedAt: string;
}

const CATEGORIES = ['Backend', 'Frontend', 'Architecture', 'Best Practices', 'Security'];

export function InsightsManagementView() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Series State
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [seriesModalView, setSeriesModalView] = useState<'list' | 'form'>('list');
  const [editingSeries, setEditingSeries] = useState<SeriesItem | null>(null);
  const [isSavingSeries, setIsSavingSeries] = useState(false);
  const [seriesForm, setSeriesForm] = useState({
    titleId: '',
    titleEn: '',
    slug: '',
    descriptionId: '',
    descriptionEn: '',
    category: 'Backend',
    badge: 'ENGINEERING PLAYBOOK',
    coverImage: '/images/insights/laravel_architecture_cover.jpg',
    isPublished: true,
  });

  // Categories management (Multi-category & Custom category addition)
  const [availableCategories, setAvailableCategories] = useState<string[]>(CATEGORIES);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Synchronize available categories with existing series and articles
  useEffect(() => {
    const set = new Set<string>(CATEGORIES);
    insights.forEach((i) => {
      if (i.category) set.add(i.category.trim());
    });
    seriesList.forEach((s) => {
      if (s.category) {
        s.category.split(',').forEach((c) => {
          const trimmed = c.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    setAvailableCategories(Array.from(set));
  }, [insights, seriesList]);

  // Selected categories for the series being created/edited
  const selectedSeriesCategories = React.useMemo(() => {
    return seriesForm.category
      ? seriesForm.category.split(',').map((c) => c.trim()).filter(Boolean)
      : [];
  }, [seriesForm.category]);

  const handleToggleSeriesCategory = (cat: string) => {
    let updated: string[];
    if (selectedSeriesCategories.includes(cat)) {
      if (selectedSeriesCategories.length <= 1) {
        setToast({ message: 'Seri harus memiliki minimal 1 kategori', type: 'error' });
        return;
      }
      updated = selectedSeriesCategories.filter((c) => c !== cat);
    } else {
      updated = [...selectedSeriesCategories, cat];
    }
    setSeriesForm((prev) => ({ ...prev, category: updated.join(', ') }));
  };

  const handleAddNewCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    if (!availableCategories.includes(formatted)) {
      setAvailableCategories((prev) => [...prev, formatted]);
    }

    if (!selectedSeriesCategories.includes(formatted)) {
      const updated = [...selectedSeriesCategories, formatted].join(', ');
      setSeriesForm((prev) => ({ ...prev, category: updated }));
    }

    setNewCategoryInput('');
    setToast({ message: `Kategori "${formatted}" berhasil ditambahkan & dipilih!`, type: 'success' });
  };

  // Series Cover Upload State
  const [seriesCoverMode, setSeriesCoverMode] = useState<'upload' | 'link'>('upload');
  const [isUploadingSeriesCover, setIsUploadingSeriesCover] = useState(false);
  const [seriesCoverDragOver, setSeriesCoverDragOver] = useState(false);
  const seriesFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSeriesCoverUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Harap pilih file gambar (JPG, PNG, WEBP, AVIF, GIF)', type: 'error' });
      return;
    }

    setIsUploadingSeriesCover(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'series');

      const res = await fetch('/api/admin/insights/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      if (res.ok && result.success && result.url) {
        setSeriesForm((prev) => ({ ...prev, coverImage: result.url }));
        const savingsMsg = result.savingsPercent ? ` (${result.savingsPercent} lebih hemat, format WebP)` : '';
        setToast({ message: `Cover seri berhasil dioptimasi ke WebP & disimpan!${savingsMsg}`, type: 'success' });
      } else {
        setToast({ message: result.error || 'Gagal mengunggah cover seri', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan jaringan saat mengunggah cover seri', type: 'error' });
    } finally {
      setIsUploadingSeriesCover(false);
      if (seriesFileInputRef.current) {
        seriesFileInputRef.current.value = '';
      }
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<InsightItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch insights
  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/insights');
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      } else {
        setToast({ message: data.error || 'Gagal mengambil data artikel', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Series
  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/admin/insights/series');
      const data = await res.json();
      if (data.success && Array.isArray(data.series)) {
        setSeriesList(data.series);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchSeries();
  }, []);

  // 2. Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/insights/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: 'Artikel berhasil dihapus', type: 'success' });
        setDeleteTarget(null);
        fetchInsights();
      } else {
        setToast({ message: data.error || 'Gagal menghapus artikel', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan saat menghapus', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Series Handlers
  const openCreateSeries = () => {
    setEditingSeries(null);
    setSeriesForm({
      titleId: '',
      titleEn: '',
      slug: '',
      descriptionId: '',
      descriptionEn: '',
      category: 'Backend',
      badge: 'ENGINEERING PLAYBOOK',
      coverImage: '/images/insights/laravel_architecture_cover.jpg',
      isPublished: true,
    });
    setSeriesCoverMode('upload');
    setIsUploadingSeriesCover(false);
    setSeriesCoverDragOver(false);
    setSeriesModalView('form');
  };

  const openEditSeries = (s: SeriesItem) => {
    setEditingSeries(s);
    setSeriesForm({
      titleId: s.titleId,
      titleEn: s.titleEn || '',
      slug: s.slug,
      descriptionId: s.descriptionId,
      descriptionEn: s.descriptionEn || '',
      category: s.category,
      badge: s.badge || 'ENGINEERING PLAYBOOK',
      coverImage: s.coverImage || '/images/insights/laravel_architecture_cover.jpg',
      isPublished: s.isPublished,
    });
    setSeriesCoverMode('upload');
    setIsUploadingSeriesCover(false);
    setSeriesCoverDragOver(false);
    setSeriesModalView('form');
  };

  const handleSaveSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesForm.titleId || !seriesForm.descriptionId) {
      setToast({ message: 'Judul dan deskripsi seri wajib diisi', type: 'error' });
      return;
    }

    setIsSavingSeries(true);
    try {
      const url = editingSeries ? `/api/admin/insights/series/${editingSeries.id}` : '/api/admin/insights/series';
      const method = editingSeries ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seriesForm),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: editingSeries ? 'Seri berhasil diperbarui!' : 'Seri baru berhasil dibuat!',
          type: 'success',
        });
        setSeriesModalView('list');
        fetchSeries();
      } else {
        setToast({ message: data.error || 'Gagal menyimpan seri', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsSavingSeries(false);
    }
  };

  const handleDeleteSeries = async (seriesId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus seri ini? Artikel di dalamnya akan tetap aman dan menjadi artikel mandiri.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/insights/series/${seriesId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: 'Seri berhasil dihapus', type: 'success' });
        fetchSeries();
        fetchInsights();
      } else {
        setToast({ message: data.error || 'Gagal menghapus seri', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan saat menghapus', type: 'error' });
    }
  };

  // Filtered insights
  const filteredInsights = insights.filter((item) => {
    const matchesSearch =
      item.titleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && item.isPublished) ||
      (statusFilter === 'DRAFT' && !item.isPublished);

    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalCount = insights.length;
  const publishedCount = insights.filter((i) => i.isPublished).length;
  const draftCount = totalCount - publishedCount;

  // Multiple Selection & Bulk Status Update
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Clear selections when filter or search changes
  useEffect(() => {
    setSelectedIds([]);
  }, [searchTerm, selectedCategory, statusFilter]);

  const isAllSelected =
    filteredInsights.length > 0 &&
    filteredInsights.every((item) => selectedIds.includes(item.id));

  const isSomeSelected =
    filteredInsights.some((item) => selectedIds.includes(item.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredInsights.map((i) => i.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredInsights.map((i) => i.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (targetPublishStatus: boolean) => {
    if (selectedIds.length === 0) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/insights/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          isPublished: targetPublishStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: data.message || `Status ${selectedIds.length} artikel berhasil diubah!`,
          type: 'success',
        });
        setSelectedIds([]);
        fetchInsights();
      } else {
        setToast({
          message: data.error || 'Gagal mengubah status artikel',
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: 'Terjadi kesalahan saat memproses perubahan status massal',
        type: 'error',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSingleStatusToggle = async (item: InsightItem) => {
    try {
      const res = await fetch(`/api/admin/insights/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !item.isPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: `Status artikel diubah menjadi ${!item.isPublished ? 'Published' : 'Draft'}`,
          type: 'success',
        });
        fetchInsights();
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: 'Gagal mengubah status artikel',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* 1. Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Content Management System</span>
          </div>
          <h1 className="text-2xl font-sans font-black text-slate-900 tracking-tight">
            Insights & Technical Articles CMS
          </h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            Kelola publikasi artikel teknis, rekayasa arsitektur, dan tutorial tanpa perlu ubah source code.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSeriesModalView('list');
              setIsSeriesModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-bold text-sm border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Kelola Seri ({seriesList.length})</span>
          </button>

          <Link
            href="/portal/insights/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Total Artikel</p>
          <p className="text-2xl font-sans font-black text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold">Terpublikasi</p>
          <p className="text-2xl font-sans font-black text-emerald-600 mt-1">{publishedCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Draf / Disimpan</p>
          <p className="text-2xl font-sans font-black text-amber-600 mt-1">{draftCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">Live Portal Link</p>
          <Link
            href="/insights"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline mt-2"
          >
            <span>Buka /insights</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Controls: Search, Category, Status Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari artikel atau tag..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Published Saja</option>
            <option value="DRAFT">Draft Saja</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Articles Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border-b border-blue-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-600 text-white shadow-xs">
                {selectedIds.length} artikel dipilih
              </span>
              <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                Pilih tindakan status massal:
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Button: Ubah ke Draft (Main Request) */}
              <button
                type="button"
                onClick={() => handleBulkStatusChange(false)}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                title="Ubah semua artikel terpilih menjadi Draft"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>Ubah Jadi Draft</span>
              </button>

              {/* Button: Publikasikan */}
              <button
                type="button"
                onClick={() => handleBulkStatusChange(true)}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                title="Publikasikan semua artikel terpilih"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Publikasikan</span>
              </button>

              {/* Button: Batal Pilih */}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500 font-mono">Memuat artikel...</span>
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center py-16 px-6 max-w-lg mx-auto space-y-4">
            <div className="relative w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                {insights.length === 0
                  ? "Database Artikel Masih Kosong"
                  : "Tidak Ada Artikel yang Cocok"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {insights.length === 0
                  ? "Belum ada artikel insight yang dibuat di sistem. Mulai tulis artikel perdana Anda sekarang."
                  : "Tidak ditemukan artikel dengan kombinasi pencarian, status, atau kategori yang dipilih saat ini."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              {(searchTerm.trim() !== "" || selectedCategory !== "ALL" || statusFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("ALL");
                    setStatusFilter("ALL");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
              )}
              <Link
                href="/portal/insights/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Artikel Baru</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3.5 pl-6 pr-2 w-12 text-center">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={toggleSelectAll}
                        title={isAllSelected ? "Batal pilih semua" : "Pilih semua artikel"}
                        aria-label="Pilih semua artikel"
                      />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Artikel</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Waktu Baca</th>
                  <th className="py-3.5 px-4">Tanggal Rilis</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInsights.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-6 pr-2 w-12 text-center">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleSelectOne(item.id)}
                            title={isSelected ? "Batal pilih artikel ini" : "Pilih artikel ini"}
                            aria-label={`Pilih artikel ${item.titleId}`}
                          />
                        </div>
                      </td>

                      {/* Artikel & Cover */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5 max-w-md">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                            <Image
                              src={item.coverImage}
                              alt={item.titleId}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/portal/insights/${item.id}/edit`}
                              className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors"
                            >
                              {item.titleId}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-slate-400 font-mono truncate">
                                /insights/{item.slug}
                              </span>
                              {item.series && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                                  <Layers className="w-2.5 h-2.5 text-blue-600" />
                                  Seri: {item.series.titleId} · Part {item.seriesPart || 1}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kategori & Tags */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSingleStatusToggle(item)}
                          title={`Klik untuk cepat ubah status ke ${item.isPublished ? 'Draft' : 'Published'}`}
                          className="cursor-pointer transition-transform hover:scale-105 active:scale-95 text-left"
                        >
                          {item.isPublished ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100/80 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Draft
                            </span>
                          )}
                        </button>
                      </td>

                    {/* Waktu Baca */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.readTimeMinutes} min
                      </span>
                    </td>

                    {/* Tanggal Rilis */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/insights/${item.slug}`}
                          target="_blank"
                          title="Buka halaman baca publik"
                          className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/portal/insights/${item.id}/edit`}
                          title="Edit artikel di halaman editor"
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Hapus artikel"
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Artikel Insight?"
        message={`Apakah Anda yakin ingin menghapus artikel "${deleteTarget?.titleId}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* 6. SERIES MANAGEMENT MODAL */}
      {isSeriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-slate-900">
                    {seriesModalView === 'list' ? 'Kelola Seri Artikel' : (editingSeries ? 'Edit Seri Artikel' : 'Tambah Seri Baru')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {seriesModalView === 'list' ? 'Daftar kurikulum topik rekayasa terstruktur SejatiDimedia' : 'Lengkapi metadata & cover seri pembelajaran'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSeriesModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {seriesModalView === 'list' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">
                      Total {seriesList.length} Seri Terdaftar
                    </span>
                    <button
                      type="button"
                      onClick={openCreateSeries}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Seri Baru</span>
                    </button>
                  </div>

                  {seriesList.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl p-6 space-y-2">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">Belum ada seri artikel</p>
                      <p className="text-[11px] text-slate-400">Buat seri pertama Anda (misal: "Arsitektur Laravel Enterprise") untuk mengelompokkan artikel menjadi kurikulum terpadu.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {seriesList.map((s) => (
                        <div key={s.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            {s.coverImage && (
                              <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                <Image
                                  src={s.coverImage}
                                  alt={s.titleId}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-slate-900 truncate">{s.titleId}</h4>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {s.category.split(',').map((cat) => cat.trim()).filter(Boolean).map((cat) => (
                                    <span key={cat} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">{s.descriptionId}</p>
                              <span className="text-[11px] font-mono text-slate-400 block">
                                {s.insights?.length || 0} artikel terhubung · slug: <code>{s.slug}</code>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditSeries(s)}
                              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Seri & Cover"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSeries(s.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Seri"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveSeries} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                      Judul Seri (Bahasa Indonesia) *
                    </label>
                    <input
                      type="text"
                      required
                      value={seriesForm.titleId}
                      onChange={(e) => setSeriesForm({ ...seriesForm, titleId: e.target.value })}
                      placeholder="Contoh: Arsitektur Laravel Enterprise"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                      Judul Seri (English)
                    </label>
                    <input
                      type="text"
                      value={seriesForm.titleEn}
                      onChange={(e) => setSeriesForm({ ...seriesForm, titleEn: e.target.value })}
                      placeholder="Contoh: Enterprise Laravel Architecture"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  {/* Multi-Category Selector & Custom Category Creation */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase text-slate-700">
                        Kategori Seri <span className="text-blue-600 font-bold">({selectedSeriesCategories.length} Dipilih)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">Bisa memilih lebih dari 1 kategori</span>
                    </div>

                    {/* Selected Category Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {selectedSeriesCategories.length === 0 ? (
                        <span className="text-xs text-slate-400 italic px-1">Pilih minimal satu kategori di bawah</span>
                      ) : (
                        selectedSeriesCategories.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-sans bg-blue-600 text-white shadow-2xs animate-in fade-in zoom-in-95 duration-150"
                          >
                            <span>{cat}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleSeriesCategory(cat)}
                              className="hover:bg-blue-700 rounded p-0.5 transition-colors cursor-pointer"
                              title={`Hapus kategori ${cat}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Available Categories Toggle Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                        Pilihan Kategori Tersedia:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {availableCategories.map((cat) => {
                          const isSelected = selectedSeriesCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleToggleSeriesCategory(cat)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs ring-1 ring-blue-400/40'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <span>{cat}</span>
                              {isSelected ? <Check className="w-3 h-3 text-blue-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Custom Category Input */}
                    <div className="pt-2 border-t border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewCategory();
                            }
                          }}
                          placeholder="Tambah kategori baru (misal: DevOps, AI, Mobile)..."
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-sans bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNewCategory()}
                          disabled={!newCategoryInput.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Kategori</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                      Deskripsi Ringkas Seri (Bahasa Indonesia) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={seriesForm.descriptionId}
                      onChange={(e) => setSeriesForm({ ...seriesForm, descriptionId: e.target.value })}
                      placeholder="Ringkasan apa saja yang dipelajari dan diselesaikan pada rangkaian seri ini..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                      Deskripsi Ringkas Seri (English)
                    </label>
                    <textarea
                      rows={2}
                      value={seriesForm.descriptionEn}
                      onChange={(e) => setSeriesForm({ ...seriesForm, descriptionEn: e.target.value })}
                      placeholder="Brief overview of curriculum topics, architectural patterns, and production outcomes in this series..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  {/* Fitur Unggah & Konfigurasi Cover Series */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <label className="text-xs font-mono font-bold uppercase text-slate-700">
                          Gambar Sampul Seri (Cover Image)
                        </label>
                      </div>
                      {/* Mode Switcher: Upload vs URL */}
                      <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setSeriesCoverMode('upload')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            seriesCoverMode === 'upload'
                              ? 'bg-blue-600 text-white shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" />
                            Upload (WebP)
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeriesCoverMode('link')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            seriesCoverMode === 'link'
                              ? 'bg-blue-600 text-white shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5" />
                            Tautan URL
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={seriesFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSeriesCoverUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {/* Live Preview Card if Cover Image exists */}
                    {seriesForm.coverImage ? (
                      <div className="space-y-2">
                        <div className="relative aspect-[16/8] w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner group">
                          <Image
                            src={seriesForm.coverImage}
                            alt={seriesForm.titleId || 'Cover Seri'}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

                          {/* Live Preview Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[90%]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-white/95 text-[#2C5098] backdrop-blur-md shadow-xs">
                              <Layers className="w-2.5 h-2.5 text-[#2C5098]" />
                              {seriesForm.badge || 'SERI'}
                            </span>
                            {selectedSeriesCategories.map((cat) => (
                              <span key={cat} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white/90 backdrop-blur-md">
                                {cat}
                              </span>
                            ))}
                          </div>

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                            <button
                              type="button"
                              onClick={() => seriesFileInputRef.current?.click()}
                              className="px-3.5 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                              <span>Ganti Cover</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSeriesForm({ ...seriesForm, coverImage: '' })}
                              className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                          <span className="truncate max-w-sm">File: <span className="text-blue-600">{seriesForm.coverImage}</span></span>
                          <span className="text-emerald-600 font-bold shrink-0">✓ Siap ditampilkan</span>
                        </div>
                      </div>
                    ) : null}

                    {/* Mode Upload: Dropzone when empty */}
                    {seriesCoverMode === 'upload' && !seriesForm.coverImage && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setSeriesCoverDragOver(true);
                        }}
                        onDragLeave={() => setSeriesCoverDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setSeriesCoverDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleSeriesCoverUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => !isUploadingSeriesCover && seriesFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                          seriesCoverDragOver
                            ? 'border-blue-500 bg-blue-50/60'
                            : 'border-slate-300 hover:border-blue-400 hover:bg-white bg-white/60'
                        } ${isUploadingSeriesCover ? 'opacity-60 pointer-events-none' : ''}`}
                      >
                        {isUploadingSeriesCover ? (
                          <>
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              Mengompres & Mengunggah ke WebP...
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-800">
                                Klik untuk unggah cover seri atau seret file ke sini
                              </p>
                              <p className="text-[11px] text-slate-400">
                                JPG, PNG, WEBP — Otomatis dikompres ke format WebP (16:9 disarankan)
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Mode Link: Input URL */}
                    {seriesCoverMode === 'link' && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={seriesForm.coverImage}
                          onChange={(e) => setSeriesForm({ ...seriesForm, coverImage: e.target.value })}
                          placeholder="https://images.unsplash.com/... atau /images/insights/client_portal_cover.jpg"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono bg-white"
                        />
                        <p className="text-[10px] text-slate-400">
                          Masukkan URL gambar cover langsung (atau beralih ke mode Upload di atas).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                        Label Badge Seri
                      </label>
                      <input
                        type="text"
                        value={seriesForm.badge}
                        onChange={(e) => setSeriesForm({ ...seriesForm, badge: e.target.value })}
                        placeholder="ENGINEERING PLAYBOOK"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                        Custom Slug (Opsional)
                      </label>
                      <input
                        type="text"
                        value={seriesForm.slug}
                        onChange={(e) => setSeriesForm({ ...seriesForm, slug: e.target.value })}
                        placeholder="arsitektur-laravel-skala-bisnis"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSeriesModalView('list')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSeries}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingSeries ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>{editingSeries ? 'Perbarui Seri' : 'Simpan Seri Baru'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        isOpen={Boolean(toast)}
        message={toast?.message || ''}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
