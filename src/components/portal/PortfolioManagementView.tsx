'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Toast } from '@/components/ui';
import {
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Check,
  Layers,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  Star
} from 'lucide-react';
import Image from 'next/image';
import { Project, isProfessionalProject } from '@/lib/api/glio-projects';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const PortfolioManagementView: React.FC = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [ndaProjectSlugs, setNdaProjectSlugs] = useState<string[]>([]);
  const [featuredProjectSlugs, setFeaturedProjectSlugs] = useState<string[]>([]);
  const [ndaBlurEnabled, setNdaBlurEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savingFeaturedSlug, setSavingFeaturedSlug] = useState<string | null>(null);
  const [masterLoading, setMasterLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'featured' | 'nda' | 'public'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load NDA settings and portfolio projects from API
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/nda');
      const data = await res.json();
      if (data.success) {
        setNdaBlurEnabled(data.ndaBlurEnabled);
        const projectsList = data.projects || [];
        setProjects(projectsList);
        setNdaProjectSlugs(data.ndaProjectSlugs || []);

        // Sanitize: only retain featured slugs that actually exist in projectsList!
        const validSlugs = (data.featuredProjectSlugs || []).filter((slug: string) =>
          projectsList.some((p: Project) => p.slug === slug)
        );
        setFeaturedProjectSlugs(validSlugs);

        // If data.featuredProjectSlugs contained phantom slugs, auto-sync back to server
        if (data.featuredProjectSlugs && data.featuredProjectSlugs.length !== validSlugs.length) {
          fetch('/api/settings/nda', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featuredProjectSlugs: validSlugs }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio NDA settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle Master Global NDA Blur
  const handleToggleMasterNda = async () => {
    const nextVal = !ndaBlurEnabled;
    setNdaBlurEnabled(nextVal);
    setMasterLoading(true);

    try {
      const res = await fetch('/api/settings/nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ndaBlurEnabled: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: nextVal
            ? 'Proteksi NDA Global DIAKTIFKAN: Seluruh proyek berstatus Pengalaman Profesional kini disamarkan.'
            : 'Proteksi NDA Global DINONAKTIFKAN: Seluruh rincian proyek kini terbuka penuh untuk publik.',
          type: 'success',
        });
      } else {
        setToast({
          message: 'Gagal memperbarui pengaturan Master NDA.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        message: 'Pengaturan berhasil disimpan secara lokal.',
        type: 'success',
      });
    } finally {
      setMasterLoading(false);
    }
  };

  // Toggle NDA status for a specific project
  const handleToggleProjectNda = async (project: Project) => {
    setSavingSlug(project.slug);
    const currentlyNda = ndaProjectSlugs.includes(project.slug);
    let nextSlugs: string[];

    if (currentlyNda) {
      // Remove slug
      nextSlugs = ndaProjectSlugs.filter((s) => s !== project.slug);
    } else {
      // Add slug
      nextSlugs = Array.from(new Set([...ndaProjectSlugs, project.slug]));
    }

    setNdaProjectSlugs(nextSlugs);

    try {
      const res = await fetch('/api/settings/nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ndaProjectSlugs: nextSlugs }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: currentlyNda
            ? `${project.name} diubah menjadi Karya Publik Reguler.`
            : `${project.name} kini ditandai sebagai Pengalaman Profesional (Terikat NDA)!`,
          type: 'success',
        });
      } else {
        setToast({
          message: 'Gagal memperbarui status proyek ke server.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        message: 'Status proyek disimpan secara lokal.',
        type: 'success',
      });
    } finally {
      setSavingSlug(null);
    }
  };

  // Toggle Proyek Unggulan status (Max 3 projects for Landing Page)
  const handleToggleFeaturedProject = async (project: Project) => {
    setSavingFeaturedSlug(project.slug);

    // Sanitize current featured list against actual projects loaded
    const currentValidSlugs = featuredProjectSlugs.filter((s) =>
      projects.some((p) => p.slug === s)
    );
    const isCurrentlyFeatured = currentValidSlugs.includes(project.slug);
    let nextFeatured: string[];

    if (isCurrentlyFeatured) {
      // Remove from featured
      nextFeatured = currentValidSlugs.filter((s) => s !== project.slug);
    } else {
      // Check limit of 3 based ONLY on valid existing projects!
      if (currentValidSlugs.length >= 3) {
        const activeNames = projects
          .filter((p) => currentValidSlugs.includes(p.slug))
          .map((p) => p.name)
          .slice(0, 3);
        setToast({
          message: `Maksimal 3 Proyek Unggulan! Proyek aktif saat ini: ${activeNames.join(', ')}. Nonaktifkan salah satu terlebih dahulu jika ingin menggantinya.`,
          type: 'error',
        });
        setSavingFeaturedSlug(null);
        return;
      }
      nextFeatured = [...currentValidSlugs, project.slug];
    }

    setFeaturedProjectSlugs(nextFeatured);

    try {
      const res = await fetch('/api/settings/nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredProjectSlugs: nextFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: isCurrentlyFeatured
            ? `${project.name} dihapus dari Proyek Unggulan Landing Page (${nextFeatured.length}/3 dipilih).`
            : `⭐ ${project.name} ditandai sebagai Proyek Unggulan Landing Page (${nextFeatured.length}/3 dipilih)!`,
          type: 'success',
        });
      } else {
        setToast({
          message: 'Gagal memperbarui status proyek unggulan ke server.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        message: 'Status proyek unggulan disimpan secara lokal.',
        type: 'success',
      });
    } finally {
      setSavingFeaturedSlug(null);
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const isNda = ndaProjectSlugs.includes(p.slug);
      const isFeatured = featuredProjectSlugs.includes(p.slug);
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.categories && p.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      if (filterTab === 'featured') return isFeatured;
      if (filterTab === 'nda') return isNda;
      if (filterTab === 'public') return !isNda;
      return true;
    });
  }, [projects, ndaProjectSlugs, featuredProjectSlugs, searchQuery, filterTab]);

  const featuredCount = useMemo(() => {
    return projects.filter((p) => featuredProjectSlugs.includes(p.slug)).length;
  }, [projects, featuredProjectSlugs]);

  const ndaCount = useMemo(() => {
    return projects.filter((p) => ndaProjectSlugs.includes(p.slug)).length;
  }, [projects, ndaProjectSlugs]);

  const publicCount = projects.length - ndaCount;

  return (
    <div className="space-y-8 w-full pb-12">
      {toast && (
        <Toast
          isOpen={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-600/20 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Manajemen Portofolio & Proyek Unggulan
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih 3 Proyek Unggulan untuk ditampilkan di Landing Page serta kelola proteksi kerahasiaan NDA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Muat Ulang
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Preview Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Semua Galeri</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Portofolio</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{projects.length}</span>
            <Layers className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Proyek Unggulan</span>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              Landing Page
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-600">{featuredCount}</span>
              <span className="text-xs font-bold text-amber-500">/ 3 Dipilih</span>
            </div>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Terikat NDA</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-800">{ndaCount}</span>
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Karya Publik</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">{publicCount}</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Master Global NDA Switch Card */}
      <Card className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Master Sakelar Sensor NDA Global
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    ndaBlurEnabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {ndaBlurEnabled ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Menyala (Blur Aktif)
                    </>
                  ) : (
                    'Mati (Publik Terbuka)'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Saat sakelar ini aktif, seluruh proyek bertanda NDA otomatis menyamarkan rincian teknis mendalam dan tangkapan layar galeri.
              </p>
            </div>
          </div>

          {/* Master Toggle Switch Button */}
          <button
            type="button"
            onClick={handleToggleMasterNda}
            disabled={masterLoading}
            title={ndaBlurEnabled ? 'Klik untuk mematikan sensor NDA global' : 'Klik untuk menyalakan sensor NDA global'}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              ndaBlurEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                ndaBlurEnabled ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Informative Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Bagian yang Tetap Terbaca Publik:</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ringkasan awal/overview proyek, metrik pencapaian umum, teknologi yang digunakan, serta peran & durasi pengerjaan.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>Bagian yang Disamarkan (Sensor Aktif):</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Rincian arsitektur mendalam, diagram alur data internal, proprietary logic, serta tangkapan layar antarmuka sistem.
            </p>
          </div>
        </div>
      </Card>

      {/* Projects Selection Workspace */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Daftar Portofolio & Pengaturan Tampilan
            </h3>
            <p className="text-xs text-slate-500">
              Tandai hingga <strong>3 Proyek Unggulan</strong> untuk ditampilkan di Landing Page, dan tentukan status proteksi NDA masing-masing proyek.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / teknologi proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-60 shadow-2xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-slate-200/70 p-1 text-[11px] font-bold text-slate-600">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semua ({projects.length})
              </button>
              <button
                onClick={() => setFilterTab('featured')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  filterTab === 'featured' ? 'bg-amber-500 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Star className={`w-3 h-3 ${filterTab === 'featured' ? 'fill-white text-white' : 'text-amber-500'}`} />
                Unggulan ({featuredCount}/3)
              </button>
              <button
                onClick={() => setFilterTab('nda')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterTab === 'nda' ? 'bg-white text-amber-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                NDA ({ndaCount})
              </button>
              <button
                onClick={() => setFilterTab('public')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterTab === 'public' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Publik ({publicCount})
              </button>
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500">Memuat data portofolio...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Tidak ada proyek yang sesuai dengan kriteria pencarian.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterTab('all');
              }}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            {filteredProjects.map((project) => {
              const isNda = ndaProjectSlugs.includes(project.slug);
              const isFeatured = featuredProjectSlugs.includes(project.slug);
              const isSavingNda = savingSlug === project.slug;
              const isSavingFeatured = savingFeaturedSlug === project.slug;

              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === '' ||
                project.thumbnail === '/thumbnail.png' ||
                project.thumbnail === '/placeholder.png';
              const thumbnailSrc = isDummy ? '/logo.svg' : project.thumbnail;

              return (
                <div
                  key={project.slug}
                  className={`relative rounded-3xl p-5 bg-white border-2 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md overflow-hidden ${
                    isFeatured
                      ? 'border-amber-400 bg-gradient-to-br from-amber-50/20 via-white to-white ring-2 ring-amber-400/20'
                      : isNda
                      ? 'border-amber-200 bg-gradient-to-br from-white via-amber-50/10 to-white'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Thumbnail + Title + Live Preview Link */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
                        <Image
                          src={thumbnailSrc as string}
                          alt={project.name}
                          fill
                          className={isDummy ? 'object-contain p-2.5' : 'object-cover'}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug truncate flex items-center gap-1.5">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Star Quick Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleFeaturedProject(project)}
                              disabled={isSavingFeatured}
                              title={isFeatured ? "Klik untuk membatalkan status Unggulan" : "Klik untuk jadikan Proyek Unggulan"}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                isFeatured
                                  ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-2xs'
                                  : 'bg-slate-100 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>

                            <a
                              href={`/projects/${project.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka Halaman Detail Proyek"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          {isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                              <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                              Unggulan Landing Page
                            </span>
                          )}

                          {isNda ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/25">
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              Pengalaman Profesional (NDA)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              Karya SejatiDimedia (Publik)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.summaryId || project.summary || project.summaryEn || 'Tidak ada deskripsi singkat.'}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Controls Bar */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    {/* Featured Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeaturedProject(project)}
                      disabled={isSavingFeatured}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isFeatured
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-white text-white' : 'text-slate-400'}`} />
                      <span>{isFeatured ? 'Proyek Unggulan' : 'Jadikan Unggulan'}</span>
                    </button>

                    {/* NDA Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-600">
                        {isNda ? 'NDA Disensor' : 'Publik'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleProjectNda(project)}
                        disabled={isSavingNda}
                        title={isNda ? "Proteksi NDA aktif (klik untuk buka)" : "Publik terbuka (klik untuk sensor NDA)"}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isNda ? 'bg-amber-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isNda ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
