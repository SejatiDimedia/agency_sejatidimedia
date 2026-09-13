'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Edit2, Trash2, ExternalLink, Eye, CheckCircle2,
  Clock, Calendar, Tag, BookOpen, AlertCircle, Sparkles, Loader2,
  FileText, Star
} from 'lucide-react';
import { Toast, ConfirmModal } from '@/components/ui';

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

        <Link
          href="/portal/insights/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Link>
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
