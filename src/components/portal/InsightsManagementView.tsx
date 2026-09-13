'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Plus, Search, Edit2, Trash2, ExternalLink, Eye, CheckCircle2,
  Clock, Calendar, Tag, BookOpen, AlertCircle, Sparkles, Loader2,
  FileText, Star, X, Check, Globe
} from 'lucide-react';
import { Button, Toast, ConfirmModal } from '@/components/ui';

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Form Fields
  const [formData, setFormData] = useState({
    titleId: '',
    titleEn: '',
    slug: '',
    excerptId: '',
    excerptEn: '',
    contentId: '',
    contentEn: '',
    category: 'Backend',
    tags: '',
    coverImage: '',
    readTimeMinutes: 5,
    isPublished: true,
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    fetchInsights();
  }, []);

  // 2. Open Add Modal
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      titleId: '',
      titleEn: '',
      slug: '',
      excerptId: '',
      excerptEn: '',
      contentId: '',
      contentEn: '',
      category: 'Backend',
      tags: 'Laravel, Architecture',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      readTimeMinutes: 5,
      isPublished: true,
      featured: false,
    });
    setActiveLangTab('id');
    setEditorTab('write');
    setIsModalOpen(true);
  };

  // 3. Open Edit Modal
  const handleOpenEditModal = (item: InsightItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      titleId: item.titleId,
      titleEn: item.titleEn || '',
      slug: item.slug,
      excerptId: item.excerptId,
      excerptEn: item.excerptEn || '',
      contentId: item.contentId,
      contentEn: item.contentEn || '',
      category: item.category,
      tags: item.tags.join(', '),
      coverImage: item.coverImage,
      readTimeMinutes: item.readTimeMinutes,
      isPublished: item.isPublished,
      featured: item.featured,
    });
    setActiveLangTab('id');
    setEditorTab('write');
    setIsModalOpen(true);
  };

  // 4. Save (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleId || !formData.excerptId || !formData.contentId || !formData.coverImage) {
      setToast({ message: 'Mohon lengkapi Judul, Excerpt, Konten (ID), dan Cover Image', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isEditing && editingId ? `/api/admin/insights/${editingId}` : '/api/admin/insights';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: isEditing ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil diterbitkan!',
          type: 'success',
        });
        setIsModalOpen(false);
        fetchInsights();
      } else {
        setToast({ message: data.error || 'Gagal menyimpan artikel', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan saat menyimpan', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete
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

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
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
            <p className="text-xs text-slate-400">Klik tombol "Tulis Artikel Baru" di atas untuk mulai membuat tulisan.</p>
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
                          <p className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors">
                            {item.titleId}
                          </p>
                          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                            /insights/{item.slug}
                          </p>
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
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/insights/${item.slug}`}
                          target="_blank"
                          title="Buka halaman publik"
                          className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit artikel"
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
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

      {/* 5. MODAL FORM: CREATE & EDIT ARTICLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-sans font-bold text-slate-900">
                  {isEditing ? 'Edit Artikel Insight' : 'Tulis Artikel Insight Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase font-mono mr-1">Bahasa Konten:</span>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('id')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      activeLangTab === 'id'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🇮🇩 Bahasa Indonesia (Wajib)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      activeLangTab === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🇬🇧 English Version (Opsional)
                  </button>
                </div>

                {/* Published & Featured Toggles */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">Publikasikan (Live)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">Featured (Highlight)</span>
                  </label>
                </div>
              </div>

              {/* TAB 1: INDONESIA */}
              {activeLangTab === 'id' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                      Judul Artikel (ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titleId}
                      onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                      placeholder="Contoh: 5 Kesalahan Arsitektur yang Sering Dilakukan Laravel Developer..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                      Ringkasan Singkat / Excerpt (ID) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerptId}
                      onChange={(e) => setFormData({ ...formData, excerptId: e.target.value })}
                      placeholder="Ringkasan 1-2 kalimat yang menarik untuk kartu katalog dan Google SEO..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  {/* Markdown Editor / Preview Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono font-bold uppercase text-slate-600">
                        Isi Artikel Markdown (ID) *
                      </label>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setEditorTab('write')}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            editorTab === 'write' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                          }`}
                        >
                          Tulis Markdown
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorTab('preview')}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            editorTab === 'preview' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {editorTab === 'write' ? (
                      <div className="space-y-2">
                        {/* Markdown Helper Shortcuts */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Sisipkan:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, contentId: formData.contentId + '\n\n### Judul Poin Baru\nPenjelasan...' })}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
                          >
                            ### Subjudul
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, contentId: formData.contentId + '\n\n#### ❌ Contoh Buruk:\n```php\n// kode buruk disini\n```' })}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-[11px]"
                          >
                            ❌ Contoh Buruk
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, contentId: formData.contentId + '\n\n#### ✅ Solusi Standar Kami:\n```php\n// kode solusi disini\n```' })}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-[11px]"
                          >
                            ✅ Solusi Standar
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, contentId: formData.contentId + '\n\n```php\n// code snippet\n```' })}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
                          >
                            ``` Code Block
                          </button>
                        </div>
                        <textarea
                          required
                          rows={14}
                          value={formData.contentId}
                          onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
                          placeholder="Tulis artikel menggunakan format Markdown lengkap dengan kode, bullet points, dan subjudul..."
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs sm:text-sm leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 max-h-[380px] overflow-y-auto prose prose-sm max-w-none text-left">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.contentId || '*Belum ada konten ditulis.*'}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ENGLISH */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                      Article Title (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Title in English..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                      Short Excerpt (EN)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerptEn}
                      onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                      placeholder="1-2 sentences summary in English..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                      Article Content Markdown (EN)
                    </label>
                    <textarea
                      rows={14}
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      placeholder="Markdown content in English..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs sm:text-sm leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-bold bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                    Waktu Baca (Menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-bold"
                  />
                </div>

                {/* Slug */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                    Custom Slug URL (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Kosongkan untuk generate otomatis dari judul"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                    Cover Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
                    Tags (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Laravel, PHP, Database, Architecture..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          isOpen={Boolean(toast)}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
