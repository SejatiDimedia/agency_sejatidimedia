'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Save, Eye, Sparkles, Check, Globe, Tag, Clock,
  Calendar, AlertCircle, FileText, ExternalLink, Image as ImageIcon,
  Columns, Edit3, Loader2, CheckCircle2, ShieldAlert, Settings2,
  Sliders, Layout, Hash, Monitor, Smartphone, UploadCloud, Link2,
  Trash2
} from 'lucide-react';
import { Toast } from '@/components/ui';
import { InsightArticleViewer } from '@/components/insights/InsightArticleViewer';

interface InsightEditorViewProps {
  mode: 'create' | 'edit';
  initialData?: any;
  insightId?: string;
}

const CATEGORIES = ['Backend', 'Frontend', 'Architecture', 'Best Practices', 'Security'];

export function InsightEditorView({ mode, initialData, insightId }: InsightEditorViewProps) {
  const router = useRouter();

  // Main Tab: 'content' (Full Screen Studio) vs 'settings' (Metadata & Publication)
  const [mainTab, setMainTab] = useState<'content' | 'settings'>('content');

  // Sub Tabs for Content
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id');
  const [editorLayout, setEditorLayout] = useState<'split' | 'write' | 'preview'>('split');
  const [previewScope, setPreviewScope] = useState<'full' | 'body'>('full');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Cover Image Type: 'link' vs 'upload'
  const [coverImageType, setCoverImageType] = useState<'link' | 'upload'>(
    initialData?.coverImage && (initialData.coverImage.includes('r2.') || initialData.coverImage.includes('/api/media/') || initialData.coverImage.includes('/uploads/')) ? 'upload' : 'link'
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleId: initialData?.titleId || '',
    titleEn: initialData?.titleEn || '',
    slug: initialData?.slug || '',
    excerptId: initialData?.excerptId || '',
    excerptEn: initialData?.excerptEn || '',
    contentId: initialData?.contentId || '',
    contentEn: initialData?.contentEn || '',
    category: initialData?.category || 'Backend',
    tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : 'Laravel, Architecture',
    coverImage: initialData?.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    readTimeMinutes: initialData?.readTimeMinutes || 5,
    isPublished: initialData?.isPublished !== undefined ? initialData.isPublished : true,
    featured: initialData?.featured || false,
    authorName: initialData?.authorName || 'Timur Dian Radha Sejati',
    authorRole: initialData?.authorRole || 'Lead Software Engineer · SejatiDimedia',
    authorAvatar: initialData?.authorAvatar || '/images/author_timur_dian.jpg',
  });

  // Fetch author profile if creating new article
  useEffect(() => {
    if (mode === 'create' && !initialData) {
      fetch('/api/admin/author-profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setFormData((prev) => ({
              ...prev,
              authorName: data.profile.name || prev.authorName,
              authorRole: data.profile.role || prev.authorRole,
              authorAvatar: data.profile.avatar || prev.authorAvatar,
            }));
          }
        })
        .catch(() => {});
    }
  }, [mode, initialData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'Ukuran file terlalu besar (maksimal 10MB)', type: 'error' });
      return;
    }

    // Validate format
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Harap pilih file gambar (JPG, PNG, WEBP, AVIF, GIF)', type: 'error' });
      return;
    }

    setIsUploadingImage(true);
    setUploadProgressText(`Mengunggah ${file.name}...`);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/admin/insights/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      if (res.ok && result.success && result.url) {
        setFormData((prev) => ({ ...prev, coverImage: result.url }));
        setToast({ message: 'Gambar sampul berhasil diunggah ke Cloud Storage!', type: 'success' });
      } else {
        setToast({ message: result.error || 'Gagal mengunggah gambar ke cloud storage', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan jaringan saat mengunggah gambar', type: 'error' });
    } finally {
      setIsUploadingImage(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Auto-calculate read time based on word count
  useEffect(() => {
    const text = activeLangTab === 'id' ? formData.contentId : formData.contentEn;
    if (text && mode === 'create') {
      const words = text.trim().split(/\s+/).length;
      const calculated = Math.max(1, Math.ceil(words / 180));
      setFormData((prev) => ({ ...prev, readTimeMinutes: calculated }));
    }
  }, [formData.contentId, formData.contentEn, activeLangTab, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleId || !formData.excerptId || !formData.contentId) {
      setToast({ message: 'Mohon lengkapi Judul, Excerpt, dan Konten (ID)', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = mode === 'edit' && insightId ? `/api/admin/insights/${insightId}` : '/api/admin/insights';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage: formData.coverImage.trim() || '/images/insights/client_portal_cover.jpg',
          tags: Array.isArray(formData.tags)
            ? formData.tags
            : typeof formData.tags === 'string'
            ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: mode === 'edit' ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil diterbitkan!',
          type: 'success',
        });
        setTimeout(() => {
          router.push('/portal/insights');
        }, 1000);
      } else {
        setToast({ message: data.error || 'Gagal menyimpan artikel', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    if (activeLangTab === 'id') {
      setFormData({ ...formData, contentId: formData.contentId + snippet });
    } else {
      setFormData({ ...formData, contentEn: formData.contentEn + snippet });
    }
  };

  const currentContent = activeLangTab === 'id' ? formData.contentId : formData.contentEn;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24 text-slate-800">
      {/* 1. Sticky Top Control Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back & Title Info */}
        <div className="flex items-center gap-3">
          <Link
            href="/portal/insights"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            title="Kembali ke Insights CMS"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                {mode === 'create' ? 'Tulis Baru' : 'Edit Mode'}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${formData.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {formData.isPublished ? '● Published' : '○ Draft'}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline font-bold">
                {formData.category}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-sans font-black text-slate-900 tracking-tight truncate mt-0.5 max-w-md sm:max-w-xl">
              {formData.titleId || 'Artikel Tanpa Judul'}
            </h1>
          </div>
        </div>

        {/* Center: Main Navigation Tabs (Content vs Settings) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60 self-center md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setMainTab('content')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'content'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Konten & Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab('settings')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'settings'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>2. Pengaturan & Publikasi</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {mode === 'edit' && initialData?.slug && (
            <Link
              href={`/insights/${initialData.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all"
              title="Lihat halaman publik artikel ini"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Buka Halaman</span>
            </Link>
          )}

          <Link
            href="/portal/insights"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{mode === 'edit' ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KONTEN & FULL-WIDTH EDITOR (STUDIO PENULISAN LEGA)                */}
      {/* ========================================================================= */}
      {mainTab === 'content' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Subheader Controls: Language & Layout Switchers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 mr-1">Bahasa:</span>
              <button
                type="button"
                onClick={() => setActiveLangTab('id')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeLangTab === 'id'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ID · Bahasa Indonesia (Wajib)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeLangTab === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                EN · English Version (Opsional)
              </button>
            </div>

            {/* Layout Mode: Split vs Full Write vs Full Preview */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setEditorLayout('split')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  editorLayout === 'split' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilkan Editor dan Live Preview berdampingan secara penuh"
              >
                <Columns className="w-4 h-4" />
                <span>Split Screen (50:50)</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorLayout('write')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  editorLayout === 'write' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Hanya tampilkan editor teks penuh"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editor Penuh</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorLayout('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  editorLayout === 'preview' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Hanya tampilkan preview pembaca"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Penuh</span>
              </button>
            </div>
          </div>

          {/* Title & Excerpt Inputs */}
          {activeLangTab === 'id' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  Judul Utama Artikel (ID) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleId}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                  placeholder="Contoh: 5 Kesalahan Arsitektur yang Sering Dilakukan Laravel Developer..."
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg sm:text-xl font-bold text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  Ringkasan Singkat / Excerpt (ID) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerptId}
                  onChange={(e) => setFormData({ ...formData, excerptId: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk preview kartu katalog dan deskripsi SEO Google..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  Article Title (EN)
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="English title for international visitors..."
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg sm:text-xl font-bold text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                  Short Excerpt (EN)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  placeholder="1-2 sentences summary in English..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Formatting Shortcuts Toolbar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 mr-1">Toolbar:</span>
              <button
                type="button"
                onClick={() => insertSnippet('\n\n### Subjudul Poin Baru\n')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold"
              >
                H3 Subjudul
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('**teks tebal**')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
              >
                B Bold
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('*teks miring*')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 italic text-[11px]"
              >
                I Italic
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n- Poin list satu\n- Poin list dua')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n\n```php\n// Tulis kode di sini\n```\n')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
              >
                ``` Code Block
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n\n#### [Anti-Pattern] Contoh Implementasi Kurang Tepat:\n```php\n// tulis contoh kode yang perlu dihindari di sini\n```\n')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                title="Sisipkan blok Anti-Pattern / Contoh yang perlu dihindari"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Anti-Pattern</span>
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n\n#### [Best Practice] Standar Rekayasa Kami:\n```php\n// tulis kode solusi arsitektur yang direkomendasikan di sini\n```\n')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px]"
                title="Sisipkan blok Best Practice / Standar Solusi Rekomendasi"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Best Practice</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {currentContent.trim().split(/\s+/).filter(Boolean).length} kata · Estimasi {formData.readTimeMinutes} menit
            </div>
          </div>

          {/* Full Screen Editor & Live Preview Containers */}
          <div className={`grid gap-5 ${editorLayout === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Editor Pane */}
            {(editorLayout === 'write' || editorLayout === 'split') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    Editor Markdown ({activeLangTab.toUpperCase()})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Dukungan format GFM & Kode</span>
                </div>
                <textarea
                  required={activeLangTab === 'id'}
                  value={activeLangTab === 'id' ? formData.contentId : formData.contentEn}
                  onChange={(e) => {
                    if (activeLangTab === 'id') {
                      setFormData({ ...formData, contentId: e.target.value });
                    } else {
                      setFormData({ ...formData, contentEn: e.target.value });
                    }
                  }}
                  placeholder="Tulis artikel teknis Anda di sini secara leluasa..."
                  className="w-full h-[680px] p-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs sm:text-sm leading-relaxed resize-y bg-slate-50/40 focus:bg-white transition-colors"
                />
              </div>
            )}

            {/* Live Frontend Reader Preview Pane */}
            {(editorLayout === 'preview' || editorLayout === 'split') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-700">
                      Live Frontend Reader ({activeLangTab.toUpperCase()})
                    </span>
                  </div>

                  {/* Preview Toolbar Controls */}
                  <div className="flex items-center gap-2">
                    {/* View Scope Toggle: Full Page vs Markdown Body only */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold border border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setPreviewScope('full')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          previewScope === 'full'
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Tampilkan halaman publik lengkap (Header, Cover, Author, Body, Tags, CTA)"
                      >
                        Halaman Lengkap
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewScope('body')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          previewScope === 'body'
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Hanya tampilkan isi markdown artikel"
                      >
                        Hanya Konten
                      </button>
                    </div>

                    {/* Responsive Device Toggle: Desktop vs Mobile */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] border border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1.5 rounded-lg transition-all ${
                          previewDevice === 'desktop'
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Tampilan Desktop (100%)"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1.5 rounded-lg transition-all ${
                          previewDevice === 'mobile'
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Tampilan Smartphone (420px)"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Browser Mockup Shell */}
                <div className="w-full h-[680px] rounded-2xl border border-slate-200 bg-slate-100/70 overflow-hidden flex flex-col shadow-xs">
                  {/* Browser Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-200/70 border-b border-slate-300/60 text-xs shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      </div>
                      <div className="bg-white/90 px-3 py-1 rounded-md text-[11px] font-mono text-slate-500 border border-slate-200 truncate max-w-[260px] sm:max-w-xs">
                        sejatidimedia.web.id/insights/{formData.slug || 'pratinjau'}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold shrink-0">
                      {previewDevice === 'mobile' ? 'Mobile View (420px)' : 'Desktop View (100%)'}
                    </span>
                  </div>

                  {/* Scrollable Viewport */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100/40">
                    <div className={`transition-all duration-200 mx-auto ${
                      previewDevice === 'mobile'
                        ? 'max-w-[420px] bg-white rounded-3xl shadow-xl border-4 border-slate-800 overflow-hidden'
                        : 'w-full'
                    }`}>
                      <InsightArticleViewer
                        title={activeLangTab === 'id' ? formData.titleId : formData.titleEn}
                        excerpt={activeLangTab === 'id' ? formData.excerptId : formData.excerptEn}
                        content={currentContent}
                        category={formData.category}
                        coverImage={formData.coverImage}
                        tags={formData.tags}
                        readTimeMinutes={formData.readTimeMinutes}
                        language={activeLangTab}
                        contentOnly={previewScope === 'body'}
                        isEditorPreview={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENGATURAN META, PUBLIKASI & GAMBAR (SEPARATE TAB)                 */}
      {/* ========================================================================= */}
      {mainTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Publication Status & Metadata Settings (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Status Publikasi Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Status Publikasi & Visibilitas
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Publikasikan Artikel (Live)</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Jika dicentang, artikel akan langsung tampil di halaman publik <code>/insights</code> dan dapat dibaca pengunjung.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Featured (Artikel Sorotan)</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tandai artikel ini sebagai rekomendasi utama di katalog.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 2. Metadata Settings Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Taksonomi & SEO URL
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                {/* Category & Read Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Kategori Artikel *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Estimasi Waktu Baca (Menit)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={formData.readTimeMinutes}
                        onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Custom Slug */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                    Custom Slug URL (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Kosongkan untuk generate otomatis dari judul artikel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Tautan Publik: <span className="text-blue-600">sejatidimedia.web.id/insights/{formData.slug || 'slug-otomatis'}</span>
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                    Tags Topik (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Laravel, PHP, Database, Architecture, Performance"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. Author Details Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Profil Penulis Artikel
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200">
                    {formData.authorAvatar ? (
                      <Image
                        src={formData.authorAvatar}
                        alt={formData.authorName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 block truncate">{formData.authorName}</span>
                    <span className="text-[11px] text-slate-500 font-mono block truncate">{formData.authorRole}</span>
                    <span className="text-[10px] text-blue-600 font-bold block">
                      Foto default dikelola di Menu Settings Portal
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Nama Penulis
                    </label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="Timur Dian Radha Sejati"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Jabatan / Peran
                    </label>
                    <input
                      type="text"
                      value={formData.authorRole}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      placeholder="Lead Software Engineer · SejatiDimedia"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                    URL Foto Avatar Penulis
                  </label>
                  <input
                    type="text"
                    value={formData.authorAvatar}
                    onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                    placeholder="/images/author_timur_dian.jpg atau URL gambar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cover Image & Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Gambar Sampul (Cover Image)
                  </h3>
                </div>
                {formData.coverImage && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors"
                    title="Hapus gambar sampul"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {/* Source Mode Switcher: Link vs Cloud Storage */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => setCoverImageType('link')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    coverImageType === 'link'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Tautan URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverImageType('upload')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    coverImageType === 'upload'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Cloud Storage (R2)</span>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {/* Mode 1: Tautan URL */}
                {coverImageType === 'link' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500">
                      URL Gambar (Unsplash / CDN Eksternal)
                    </label>
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-... (Opsional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                    />
                    <p className="text-[11px] text-slate-400">
                      Masukkan URL gambar beresolusi tinggi langsung (rasio 16:9 direkomendasikan).
                    </p>
                  </div>
                )}

                {/* Mode 2: Upload ke Cloud Storage */}
                {coverImageType === 'upload' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDropFile}
                      onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragOver
                          ? 'border-blue-500 bg-blue-50/50'
                          : isUploadingImage
                          ? 'border-slate-300 bg-slate-50 cursor-wait'
                          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40'
                      }`}
                    >
                      {isUploadingImage ? (
                        <div className="py-3 flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {uploadProgressText || 'Mengunggah gambar ke Cloud Storage...'}
                          </span>
                          <span className="text-[11px] text-slate-400">Mohon tunggu sebentar</span>
                        </div>
                      ) : (
                        <div className="py-2 flex flex-col items-center gap-1.5">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            Klik untuk memilih gambar atau tarik ke sini
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            PNG, JPG, WEBP, AVIF (Maksimal 10MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {formData.coverImage && (formData.coverImage.includes('r2.') || formData.coverImage.includes('cloudflarestorage') || formData.coverImage.includes('/api/media/') || formData.coverImage.includes('/uploads/')) && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate font-mono text-[11px]">Tersimpan di Cloud Storage R2</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="text-xs font-bold text-emerald-700 hover:underline shrink-0 ml-2"
                        >
                          Ganti File
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Cover Preview */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block mb-2">
                    Pratinjau Cover (16:9)
                  </span>
                  {formData.coverImage ? (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
                      <Image
                        src={formData.coverImage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/90 text-blue-700 shadow-xs">
                        {formData.category}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs py-8">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                      <span>Belum ada gambar sampul yang dipilih</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      <Toast
        isOpen={Boolean(toast)}
        message={toast?.message || ''}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </form>
  );
}
