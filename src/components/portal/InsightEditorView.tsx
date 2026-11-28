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
  Trash2, Maximize2, X, BookOpen, ClipboardPaste, Copy
} from 'lucide-react';
import { Toast, Modal, Button } from '@/components/ui';
import { InsightArticleViewer } from '@/components/insights/InsightArticleViewer';
import {
  parseMarkdownArticle,
  MARKDOWN_BILINGUAL_TEMPLATE,
  ARTICLE_WRITING_PROMPT,
} from '@/lib/markdown-import';

interface InsightEditorViewProps {
  mode: 'create' | 'edit';
  initialData?: any;
  insightId?: string;
}

const CATEGORIES = ['Backend', 'Frontend', 'Architecture', 'Best Practices', 'Security', 'AI', 'Backend, AI'];

export function InsightEditorView({ mode, initialData, insightId }: InsightEditorViewProps) {
  const router = useRouter();

  // Main Tab: 'content' (Full Screen Studio) vs 'settings' (Metadata & Publication)
  const [mainTab, setMainTab] = useState<'content' | 'settings'>('content');

  // Sub Tabs for Content
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id');
  const [editorLayout, setEditorLayout] = useState<'split' | 'write' | 'preview'>('split');
  const [previewScope, setPreviewScope] = useState<'full' | 'body'>('full');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullScreenPreviewOpen, setIsFullScreenPreviewOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedMarkdown, setPastedMarkdown] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Series List
  const [availableSeries, setAvailableSeries] = useState<Array<{ id: string; titleId: string; titleEn?: string | null; slug: string; category: string; badge?: string }>>([]);

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
    authorBioId: initialData?.authorBioId || '',
    authorBioEn: initialData?.authorBioEn || '',
    seriesId: initialData?.seriesId || '',
    seriesPart: initialData?.seriesPart !== undefined && initialData?.seriesPart !== null ? String(initialData.seriesPart) : '',
  });

  // Fetch available series for selector
  useEffect(() => {
    fetch('/api/admin/insights/series')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.series)) {
          setAvailableSeries(data.series);
        }
      })
      .catch(() => {});
  }, []);

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
              authorBioId: data.profile.bioId || prev.authorBioId,
              authorBioEn: data.profile.bioEn || prev.authorBioEn,
            }));
          }
        })
        .catch(() => {});
    }
  }, [mode, initialData]);

  // Handle ESC key to close full screen preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreenPreviewOpen) {
        setIsFullScreenPreviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPreviewOpen]);

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
      uploadData.append('folder', 'insights');

      const res = await fetch('/api/admin/insights/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      if (res.ok && result.success && result.url) {
        setFormData((prev) => ({ ...prev, coverImage: result.url }));
        const savingsText = result.savingsPercent ? ` (${result.savingsPercent} lebih hemat, format WebP)` : '';
        setToast({ message: `Gambar sampul berhasil dioptimasi ke WebP & disimpan!${savingsText}`, type: 'success' });
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
          seriesId: formData.seriesId || null,
          seriesPart: formData.seriesPart ? Number(formData.seriesPart) : null,
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

  const handleApplyPastedMarkdown = () => {
    if (!pastedMarkdown.trim()) {
      setToast({
        message: 'Silakan tempel (paste) teks Markdown terlebih dahulu.',
        type: 'error',
      });
      return;
    }

    const parsed = parseMarkdownArticle(pastedMarkdown, activeLangTab);

    setFormData((prev) => ({
      ...prev,
      titleId: parsed.titleId !== undefined && parsed.titleId !== '' ? parsed.titleId : prev.titleId,
      excerptId: parsed.excerptId !== undefined && parsed.excerptId !== '' ? parsed.excerptId : prev.excerptId,
      contentId: parsed.contentId !== undefined && parsed.contentId !== '' ? parsed.contentId : prev.contentId,
      titleEn: parsed.titleEn !== undefined && parsed.titleEn !== '' ? parsed.titleEn : prev.titleEn,
      excerptEn: parsed.excerptEn !== undefined && parsed.excerptEn !== '' ? parsed.excerptEn : prev.excerptEn,
      contentEn: parsed.contentEn !== undefined && parsed.contentEn !== '' ? parsed.contentEn : prev.contentEn,
      tags: parsed.tags || prev.tags,
      slug: parsed.slug || prev.slug,
      category: !prev.seriesId && parsed.category ? parsed.category : prev.category,
      readTimeMinutes: parsed.readTimeMinutes || prev.readTimeMinutes,
    }));

    setIsPasteModalOpen(false);
    setPastedMarkdown('');
    setToast({
      message: parsed.isBilingual
        ? 'Berhasil mapping artikel (ID & EN) ke editor.'
        : `Berhasil mapping konten ${activeLangTab === 'id' ? 'Bahasa Indonesia' : 'English'} ke editor.`,
      type: 'success',
    });
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(MARKDOWN_BILINGUAL_TEMPLATE);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    } catch {
      setPastedMarkdown(MARKDOWN_BILINGUAL_TEMPLATE);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ARTICLE_WRITING_PROMPT);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      setToast({
        message: 'Gagal menyalin prompt ke clipboard.',
        type: 'error',
      });
    }
  };

  const currentContent = activeLangTab === 'id' ? formData.contentId : formData.contentEn;

  const activeSeriesObj = availableSeries.find((s) => s.id === formData.seriesId);
  const previewSeriesInfo = activeSeriesObj
    ? {
        id: activeSeriesObj.id,
        slug: activeSeriesObj.slug,
        titleId: activeSeriesObj.titleId,
        titleEn: (activeSeriesObj as any).titleEn || activeSeriesObj.titleId,
        descriptionId: (activeSeriesObj as any).descriptionId || '',
        descriptionEn: (activeSeriesObj as any).descriptionEn || '',
        badge: activeSeriesObj.badge || 'ENGINEERING PLAYBOOK',
        part: Number(formData.seriesPart) || 1,
        totalParts: Math.max(Number(formData.seriesPart) || 1, 2),
        curriculum: [
          {
            part: Number(formData.seriesPart) || 1,
            slug: formData.slug || 'artikel-ini',
            titleId: (activeLangTab === 'id' ? formData.titleId : formData.titleEn) || 'Bab Saat Ini',
            titleEn: formData.titleEn || formData.titleId,
            readTimeMinutes: formData.readTimeMinutes,
            isCurrent: true,
          },
        ],
      }
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24 text-slate-800">
      {/* 1. Sticky Top Control Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Top Row: Back + Title + Primary Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Back & Title Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/portal/insights"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              title="Kembali ke Insights CMS"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 whitespace-nowrap">
                  {mode === 'create' ? 'Tulis Baru' : 'Edit Mode'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${formData.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {formData.isPublished ? '● Published' : '○ Draft'}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline font-bold truncate">
                  {formData.category}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-sans font-extrabold text-slate-900 tracking-tight truncate mt-0.5">
                {formData.titleId || 'Artikel Tanpa Judul'}
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-end">
            {mode === 'edit' && initialData?.slug && (
              <Link
                href={`/insights/${initialData.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors whitespace-nowrap shrink-0"
                title="Lihat halaman publik artikel ini"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Buka Halaman</span>
              </Link>
            )}

            <Link
              href="/portal/insights"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors whitespace-nowrap shrink-0"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Save className="w-4 h-4 shrink-0" />
              )}
              <span>{mode === 'edit' ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Main Navigation Tabs (Content vs Settings) */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setMainTab('content')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                mainTab === 'content'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>1. Konten &amp; Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setMainTab('settings')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                mainTab === 'settings'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 shrink-0" />
              <span>2. Pengaturan &amp; Publikasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KONTEN & FULL-WIDTH EDITOR (STUDIO PENULISAN LEGA)                */}
      {/* ========================================================================= */}
      {mainTab === 'content' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Subheader Controls: Language, Import .md & Layout Switchers */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            {/* Language Switcher + Markdown Import */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 mr-1">Bahasa:</span>
              <button
                type="button"
                onClick={() => setActiveLangTab('id')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeLangTab === 'id'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ID · Bahasa Indonesia (Wajib)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeLangTab === 'en'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                EN · English Version (Opsional)
              </button>

              <div className="hidden sm:block w-[1px] h-5 bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors whitespace-nowrap cursor-pointer"
                title="Tempel teks Markdown untuk mengisi Judul, Ringkasan, dan Isi Artikel otomatis"
              >
                <ClipboardPaste className="w-3.5 h-3.5 shrink-0" />
                <span>Paste Markdown</span>
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

                    {/* Fullscreen Preview Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsFullScreenPreviewOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 text-[11px] font-bold rounded-xl border border-slate-200/80 shadow-xs transition-colors"
                      title="Buka pratinjau layar penuh (Fullscreen Modal)"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Layar Penuh</span>
                    </button>
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
                        series={previewSeriesInfo}
                        author={{
                          name: formData.authorName,
                          role: formData.authorRole,
                          avatar: formData.authorAvatar,
                          bioId: formData.authorBioId,
                          bioEn: formData.authorBioEn,
                        }}
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
                      value={activeSeriesObj ? activeSeriesObj.category : formData.category}
                      disabled={Boolean(activeSeriesObj)}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {activeSeriesObj && !CATEGORIES.includes(activeSeriesObj.category) && (
                        <option value={activeSeriesObj.category}>{activeSeriesObj.category}</option>
                      )}
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {activeSeriesObj && (
                      <p className="text-[11px] text-blue-600 font-medium mt-1">
                        Otomatis mengikuti kategori seri ({activeSeriesObj.category}).
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Estimasi Waktu Baca (Menit)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={1}
                        value={formData.readTimeMinutes}
                        onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) || 1 })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
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
                    placeholder="kesalahan-arsitektur-laravel-developer"
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

            {/* 3. Series / Playbook Track Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Pengelompokan Seri (Engineering Series)
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  Playbook
                </span>
              </div>

              <div className="space-y-4 pt-1">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gabungkan artikel ini ke dalam serial pembelajaran mendalam (misal: <em>Arsitektur Laravel Enterprise</em>) agar pembaca mendapatkan navigasi bab berurutan dan kurikulum interaktif.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Pilih Seri Pembahasan
                    </label>
                    <select
                      value={formData.seriesId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        const matchedSeries = availableSeries.find((s) => s.id === sId);
                        setFormData((prev) => ({
                          ...prev,
                          seriesId: sId,
                          seriesPart: sId && !prev.seriesPart ? '1' : prev.seriesPart,
                          category: matchedSeries ? matchedSeries.category : prev.category,
                        }));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white"
                    >
                      <option value="">— Bukan Bagian Seri (Artikel Mandiri) —</option>
                      {availableSeries.map((ser) => (
                        <option key={ser.id} value={ser.id}>
                          {ser.titleId}{ser.titleEn ? ` / ${ser.titleEn}` : ''} ({ser.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      Nomor Part / Episode
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={formData.seriesPart}
                      disabled={!formData.seriesId}
                      onChange={(e) => setFormData({ ...formData, seriesPart: e.target.value })}
                      placeholder="Contoh: 1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {formData.seriesId && (
                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70 text-blue-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span>
                        Artikel ini akan tampil sebagai <strong>Part {formData.seriesPart || 1}</strong> pada kurikulum seri terpilih.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Author Details Card */}
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
                        }}
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

      {/* Fullscreen Modal Preview Overlay */}
      {isFullScreenPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* Top Bar Controls */}
          <div className="bg-slate-900/95 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 shadow-lg shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="truncate">
                <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                  {formData.slug ? `sejatidimedia.web.id/insights/${formData.slug}` : 'Pratinjau Layar Penuh'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {previewScope === 'full' ? 'Halaman Publik Lengkap' : 'Hanya Konten'} · Bahasa {activeLangTab.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl text-xs font-bold border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('id')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLangTab === 'id' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLangTab === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Scope Switcher */}
              <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-xl text-xs border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewScope('full')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    previewScope === 'full' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Halaman Penuh
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScope('body')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    previewScope === 'body' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Konten Saja
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsFullScreenPreviewOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors ml-1"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Tutup (ESC)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Viewport Body */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
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
                series={previewSeriesInfo}
                author={{
                  name: formData.authorName,
                  role: formData.authorRole,
                  avatar: formData.authorAvatar,
                  bioId: formData.authorBioId,
                  bioEn: formData.authorBioEn,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Paste Markdown Modal */}
      <Modal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        maxWidth="2xl"
        title="Paste Markdown Artikel"
        subtitle="Tempel teks Markdown untuk mengisi Judul, Ringkasan, dan Isi Artikel secara otomatis."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Mode saat ini:{' '}
              <strong className="text-slate-900">
                {activeLangTab === 'id' ? 'Bahasa Indonesia (ID)' : 'English (EN)'}
              </strong>{' '}
              atau gunakan pemisah bilingual
            </span>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {copiedTemplate ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Template Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Contoh Template</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={pastedMarkdown}
            onChange={(e) => setPastedMarkdown(e.target.value)}
            rows={11}
            placeholder={`---\ntitleId: Judul Artikel\nexcerptId: Ringkasan singkat artikel...\ntitleEn: English Title\nexcerptEn: Short English summary...\ntags: TypeScript, Backend\n---\n\n## 1. Isi Artikel Indonesia\n\n<!-- lang:en -->\n\n## 1. English Content`}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs leading-relaxed text-slate-800 bg-white resize-y"
          />

          {/* Hint Aturan Template */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Aturan Format Template:</p>
            <ul className="list-disc list-outside ml-4 space-y-1.5 leading-relaxed">
              <li>
                <strong>Blok Frontmatter (<code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">---</code>) di baris paling atas</strong>: mendukung{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">titleId</code>,{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">excerptId</code>,{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">titleEn</code>,{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">excerptEn</code>,{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">tags</code> (atau{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">title</code> &amp;{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">excerpt</code> untuk 1 bahasa).
              </li>
              <li>
                <strong>1x Paste untuk 2 Bahasa</strong>: tambahkan{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">&lt;!-- lang:en --&gt;</code>{' '}
                pada satu baris tersendiri untuk memisahkan konten Indonesia (atas) dan English (bawah). Tanpa penanda ini, teks akan masuk ke tab bahasa yang sedang aktif.
              </li>
              <li>
                <strong>Tanpa Frontmatter</strong>: baris pertama{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]"># Judul</code>{' '}
                otomatis menjadi Judul, dan paragraf pertama otomatis menjadi Ringkasan.
              </li>
              <li>
                <strong>Subjudul Daftar Isi</strong>: gunakan{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">##</code> /{' '}
                <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">###</code>{' '}
                agar otomatis muncul di Daftar Isi halaman baca.
              </li>
            </ul>
          </div>

          {/* Prompt Penulisan Artikel Profesional */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900">
                  Prompt Artikel Profesional (Bilingual + Backlink + Struktur)
                </p>
                <p className="text-[11px] text-slate-500">
                  Salin prompt ini ke AI writer Anda agar hasil artikelnya sesuai format &amp; standar SEO/teknis.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-[#2C5098] border border-blue-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Prompt Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {ARTICLE_WRITING_PROMPT}
            </pre>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPasteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApplyPastedMarkdown}
            >
              Terapkan ke Editor
            </Button>
          </div>
        </div>
      </Modal>

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
