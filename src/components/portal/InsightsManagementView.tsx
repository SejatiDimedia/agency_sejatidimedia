'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Edit2, Trash2, ExternalLink, Eye, CheckCircle2,
  Clock, Calendar, Tag, BookOpen, AlertCircle, Sparkles, Loader2,
  FileText, Star, Layers, X
} from 'lucide-react';
import { Toast, ConfirmModal } from '@/components/ui';

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500 font-mono">Memuat artikel...</span>
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Belum ada artikel yang sesuai</p>
            <p className="text-xs text-slate-400">Klik tombol "Tulis Artikel Baru" di atas untuk mulai membuat tulisan di halaman editor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3.5 px-6">Artikel</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Waktu Baca</th>
                  <th className="py-3.5 px-4">Tanggal Rilis</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInsights.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Artikel & Cover */}
                    <td className="py-4 px-6">
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
                      {item.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
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
                ))}
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                    {seriesModalView === 'list' ? 'Daftar kurikulum topik rekayasa terstruktur SejatiDimedia' : 'Lengkapi metadata seri pembelajaran'}
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
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{s.titleId}</h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                {s.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{s.descriptionId}</p>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              {s.insights?.length || 0} artikel terhubung · slug: <code>{s.slug}</code>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditSeries(s)}
                              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Seri"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                        Kategori Seri
                      </label>
                      <select
                        value={seriesForm.category}
                        onChange={(e) => setSeriesForm({ ...seriesForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                      Deskripsi Ringkas Seri (ID) *
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
