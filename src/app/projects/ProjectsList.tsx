"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Icon } from "@iconify/react";
import { Project, isProfessionalProject } from "../../lib/api/glio-projects";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { TECH_ICONS } from "../../lib/constants";

interface ProjectsListProps {
  projects: Project[];
  initialFeaturedSlugs?: string[];
}

export default function ProjectsList({
  projects,
  initialFeaturedSlugs = [],
}: ProjectsListProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(language === 'en' ? "All" : "Semua");
  const [ndaProjectSlugs, setNdaProjectSlugs] = useState<string[]>([]);
  const [featuredProjectSlugs, setFeaturedProjectSlugs] = useState<string[]>(initialFeaturedSlugs);
  const [selectedHighlightProject, setSelectedHighlightProject] = useState<Project | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedHighlightProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedHighlightProject(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedHighlightProject]);

  useEffect(() => {
    fetch('/api/settings/nda')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.ndaProjectSlugs)) {
            setNdaProjectSlugs(data.ndaProjectSlugs);
          }
          if (Array.isArray(data.featuredProjectSlugs) && data.featuredProjectSlugs.length > 0) {
            setFeaturedProjectSlugs(data.featuredProjectSlugs);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeCategory === "Semua" || activeCategory === "All") {
      setActiveCategory(language === 'en' ? "All" : "Semua");
    }
  }, [language, activeCategory]);

  const CATEGORY_MAP: Record<string, string> = {
    "68fd86b3efc68bfc3fd16532": "AI",
    "68fd8688efc68bfc3fd16531": "Web",
    "68fd85f1f86ba8de6fc21c1f": "Mobile",
  };

  const getCategoryName = (id: string) => CATEGORY_MAP[id] || id;

  const getCategoryIcon = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower === "all" || lower === "semua") return "ph:squares-four-bold";
    if (lower.includes("ai")) return "ph:sparkle-bold";
    if (lower.includes("web")) return "ph:globe-bold";
    if (lower.includes("mobile")) return "ph:device-mobile-bold";
    return "ph:stack-bold";
  };

  // Filter out any non-public (draft/hidden) projects
  const publicProjects = useMemo(() => {
    return (projects || []).filter((p) => p.isPublic !== false);
  }, [projects]);

  // 1. Featured Projects computation (6 flagship projects)
  const featuredProjects = useMemo(() => {
    if (!publicProjects || publicProjects.length === 0) return [];
    const featured = publicProjects
      .filter((p) => featuredProjectSlugs.includes(p.slug))
      .sort((a, b) => featuredProjectSlugs.indexOf(a.slug) - featuredProjectSlugs.indexOf(b.slug));

    if (featured.length < 6) {
      const remaining = publicProjects.filter((p) => !featuredProjectSlugs.includes(p.slug));
      return [...featured, ...remaining].slice(0, 6);
    }

    return featured.slice(0, 6);
  }, [publicProjects, featuredProjectSlugs]);

  // 2. Dynamic categories for catalog
  const allCategories = publicProjects.flatMap((p) => p.categories?.map(getCategoryName) || []);
  const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
  const allCategoryLabel = language === 'en' ? "All" : "Semua";
  const categories = [allCategoryLabel, ...uniqueCategories];

  // 3. Filtered projects for general catalog
  const filteredProjects = publicProjects.filter((project) => {
    if (activeCategory === allCategoryLabel) return true;
    const projectCategoryNames = project.categories?.map(getCategoryName) || [];
    return projectCategoryNames.includes(activeCategory);
  });

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-[#2C5098] dark:text-theme-fore-muted dark:hover:text-theme-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}</span>
          </Link>

          <div className="space-y-3 text-left">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] dark:text-theme-accent font-bold">
              <span>{language === 'en' ? 'PROJECT SHOWCASE' : 'PORTOFOLIO PROYEK'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-jakarta font-sans font-extrabold tracking-tight text-slate-900 dark:text-theme-fore leading-tight">
              {language === 'en' ? (
                <>
                  Software & System{' '}
                  <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent inline-block">Portfolio</span>
                </>
              ) : (
                <>
                  Portofolio Sistem &{' '}
                  <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent inline-block">Aplikasi</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted max-w-2xl leading-relaxed font-sans">
              {language === 'en'
                ? 'Explore our production-grade systems, multi-tenant SaaS platforms, and enterprise web & mobile solutions built for real business impact.'
                : 'Koleksi sistem operasional, aplikasi SaaS, dan produk digital siap produksi yang dibangun dengan standar keandalan tinggi dan arsitektur modern.'}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: PROYEK UNGGULAN (6 FEATURED PROJECT CARDS)
          Shape identical to project card, but distinguished with refined featured accents
          ========================================================================= */}
      {featuredProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-theme-border/60 pb-4">
            <div className="space-y-1 text-left">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#2C5098] dark:text-theme-accent font-bold">
                <span>{language === 'en' ? 'FEATURED SHOWCASE' : 'PROYEK UNGGULAN'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-jakarta font-sans font-bold tracking-tight text-slate-900 dark:text-theme-fore">
                {language === 'en' ? 'Flagship Featured Projects' : 'Proyek Unggulan Pilihan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-theme-fore-muted">
                {language === 'en'
                  ? '6 highlighted systems demonstrating our architectural rigor and real-world deployment.'
                  : '6 sistem dan aplikasi pilihan yang mewakili keandalan arsitektur dan hasil kerja tim kami.'}
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-theme-fore-muted shrink-0">
              <span className="font-bold text-[#2C5098] dark:text-theme-accent">{featuredProjects.length}</span> {language === 'en' ? 'Featured Projects' : 'Proyek Unggulan'}
            </div>
          </div>

          {/* Wide Project Cards List - Featured Projects */}
          <div className="space-y-8 sm:space-y-12 text-left">
            {featuredProjects.map((project, index) => {
              const isImageLeft = index % 2 === 1;
              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;
              const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);

              const summaryText = language === 'en'
                ? (project.summaryEn || project.descriptionEn || project.summary || project.description || '')
                : (project.summaryId || project.descriptionId || project.summary || project.description || '');

              return (
                <div
                  key={`featured-${project.slug}`}
                  className="group rounded-3xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border hover:border-[#2C5098]/50 dark:hover:border-theme-border-accent hover:shadow-xl hover:shadow-[#2C5098]/10 transition-all duration-300 relative overflow-hidden p-6 sm:p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    {/* Details Column: Alternates left/right on desktop */}
                    <div className={`lg:col-span-7 space-y-4 text-left order-2 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      {/* Categories / Tags - Blue gradient badge consistent across the app */}
                      {project.categories && project.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pb-1">
                          {project.categories.map((cat) => {
                            const catName = getCategoryName(cat);
                            if (/^[0-9a-fA-F]{24}$/.test(catName)) return null;
                            return (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider font-bold text-white bg-gradient-to-r from-[#2C5098] to-[#23385B] border border-white/10 px-2.5 py-0.5 rounded-full shadow-2xs"
                              >
                                <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-white" />
                                <span>{catName}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedHighlightProject(project)}
                        className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-theme-fore group-hover:text-[#2C5098] transition-colors line-clamp-1 sm:line-clamp-2 cursor-pointer"
                      >
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-theme-fore-muted font-sans leading-relaxed line-clamp-3">
                        {summaryText || project.description}
                      </p>

                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-theme-border/30">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-50 dark:bg-theme-surface text-slate-600 dark:text-theme-fore-muted border border-slate-200/60 dark:border-theme-border/40"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5 opacity-80" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>

                      {/* View project link and Highlight Trigger */}
                      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-theme-border/30 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedHighlightProject(project)}
                          className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#2C5098] dark:text-theme-accent hover:text-[#23385B] hover:underline transition-colors cursor-pointer group/btn"
                        >
                          <Icon icon="ph:list-checks-bold" className="w-4 h-4 text-[#2C5098] dark:text-theme-accent group-hover/btn:scale-110 transition-transform" />
                          <span>{language === 'en' ? 'Highlight & Outcomes' : 'Ringkasan & Hasil Utama'}</span>
                        </button>

                        <div className="flex items-center gap-3">
                          {isProfessionalExp && (
                            <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                              NDA
                            </span>
                          )}
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-xs font-sans font-bold text-slate-700 dark:text-theme-fore hover:text-[#2C5098] hover:underline inline-flex items-center gap-1 transition-colors group/link"
                          >
                            <span>{language === 'en' ? 'View Details' : 'Lihat Detail'}</span>
                            <Icon icon="ph:arrow-right-bold" className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Image Column: Alternates left/right on desktop */}
                    <div className={`lg:col-span-5 order-1 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div
                        onClick={() => setSelectedHighlightProject(project)}
                        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 dark:bg-theme-surface border border-slate-200/80 dark:border-theme-border/40 cursor-pointer"
                      >
                        <Image
                          src={displayThumbnail}
                          alt={project.name}
                          fill
                          className={
                            isDummy
                              ? "object-contain p-8 bg-slate-50 dark:bg-theme-surface/40"
                              : "object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          }
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: ALL PROJECTS CATALOG
          ========================================================================= */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-theme-border/60 pb-4">
          <div className="space-y-1 text-left">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] dark:text-theme-accent font-bold">
              <span>{language === 'en' ? 'ALL PORTFOLIO' : 'SEMUA PORTOFOLIO'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-jakarta font-sans font-bold tracking-tight text-slate-900 dark:text-theme-fore">
              {language === 'en' ? 'Explore All Projects' : 'Eksplorasi Seluruh Proyek'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-md shadow-[#2C5098]/25 border border-transparent"
                      : "bg-white dark:bg-theme-surface text-slate-600 dark:text-theme-fore-muted hover:bg-slate-50 dark:hover:bg-theme-elevated hover:text-slate-900 dark:hover:text-theme-fore border border-slate-200 dark:border-theme-border shadow-2xs"
                  }`}
                >
                  <Icon
                    icon={getCategoryIcon(cat)}
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? "text-white"
                        : "text-[#2C5098] dark:text-theme-accent"
                    }`}
                  />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Regular Projects Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const isDummy =
                  !project.thumbnail ||
                  project.thumbnail.trim() === "" ||
                  project.thumbnail === "/thumbnail.png" ||
                  project.thumbnail === "/placeholder.png";
                const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    key={project.slug}
                    className="group flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border hover:border-[#2C5098]/50 dark:hover:border-theme-border-accent hover:shadow-xl hover:shadow-[#2C5098]/10 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Thumbnail */}
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 dark:bg-theme-surface border border-slate-200/80 dark:border-theme-border/40">
                        <Image
                          src={displayThumbnail}
                          alt={project.name}
                          fill
                          className={
                            isDummy
                              ? "object-contain p-8 bg-slate-50 dark:bg-theme-surface/40"
                              : "object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          }
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2 text-left">
                        {project.categories && project.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pb-1">
                            {project.categories.map((cat) => {
                              const catName = getCategoryName(cat);
                              return (
                                <span
                                  key={cat}
                                  className="inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider font-bold text-white bg-gradient-to-r from-[#2C5098] to-[#23385B] border border-white/10 px-2.5 py-0.5 rounded-full shadow-2xs"
                                >
                                  <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-white" />
                                  <span>{catName}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <h3 className="text-base font-jakarta font-sans font-bold text-slate-900 dark:text-theme-fore group-hover:text-[#2C5098] transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-theme-fore-muted leading-relaxed line-clamp-3 font-sans">
                          {language === 'en'
                            ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                            : (project.summaryId || project.descriptionId || project.summary || project.description)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-theme-border/30 mt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-50 dark:bg-theme-surface text-slate-600 dark:text-theme-fore-muted border border-slate-200/60 dark:border-theme-border/40"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5 opacity-80" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-50 dark:bg-theme-surface hover:bg-gradient-to-r hover:from-[#2C5098] hover:to-[#23385B] hover:text-white text-xs font-sans font-bold text-slate-700 dark:text-theme-fore transition-all duration-300 border border-slate-200 dark:border-theme-border/80 hover:border-transparent shadow-2xs hover:shadow-md hover:shadow-[#2C5098]/20 cursor-pointer"
                      >
                        <span>{language === 'en' ? 'View Details' : 'Lihat Detail'}</span>
                        <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-1 md:col-span-3 p-12 text-center rounded-3xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border shadow-xs"
              >
                <span className="text-xs font-mono text-slate-500 dark:text-theme-fore-muted">
                  {language === 'en' ? 'No projects found in this category.' : 'Tidak ada proyek ditemukan dalam kategori ini.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* =========================================================================
          MODAL HIGHLIGHT: RINGKASAN & KEY OUTCOMES ID (MOUNTED TO BODY VIA PORTAL)
          ========================================================================= */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedHighlightProject && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedHighlightProject(null)}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
              />

              {/* Modal Dialog Card - Widened to max-w-4xl lg:max-w-5xl */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl lg:max-w-5xl bg-white dark:bg-theme-elevated rounded-3xl shadow-2xl border border-slate-200 dark:border-theme-border overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-theme-border/50 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-theme-surface/30">
                  <div className="space-y-2 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedHighlightProject.categories && selectedHighlightProject.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedHighlightProject.categories.map((cat) => {
                            const catName = getCategoryName(cat);
                            if (/^[0-9a-fA-F]{24}$/.test(catName)) return null;
                            return (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider font-bold text-white bg-gradient-to-r from-[#2C5098] to-[#23385B] border border-white/10 px-2.5 py-0.5 rounded-full shadow-2xs"
                              >
                                <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-white" />
                                <span>{catName}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {ndaProjectSlugs.includes(selectedHighlightProject.slug) && (
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-semibold">
                          NDA
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-slate-900 dark:text-theme-fore tracking-tight leading-snug">
                      {selectedHighlightProject.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedHighlightProject(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-theme-fore hover:bg-slate-200/60 dark:hover:bg-theme-surface transition-colors cursor-pointer shrink-0"
                    aria-label="Tutup dialog"
                  >
                    <Icon icon="ph:x-bold" className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body - Scrollable 2-Column Responsive Layout */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Summary & Technologies */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Ringkasan Eksekutif */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#2C5098] dark:text-theme-accent">
                          <Icon icon="ph:file-text-bold" className="w-4 h-4" />
                          <span>{language === 'en' ? 'Executive Summary' : 'Ringkasan Proyek'}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted leading-relaxed font-sans">
                          {language === 'en'
                            ? (selectedHighlightProject.summaryEn || selectedHighlightProject.descriptionEn || selectedHighlightProject.summary || selectedHighlightProject.description)
                            : (selectedHighlightProject.summaryId || selectedHighlightProject.descriptionId || selectedHighlightProject.summary || selectedHighlightProject.description)}
                        </p>
                      </div>

                      {/* Core Technologies */}
                      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-theme-border/50">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-theme-fore-muted block">
                          {language === 'en' ? 'Core Technologies' : 'Teknologi Utama'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedHighlightProject.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-50 dark:bg-theme-surface text-slate-700 dark:text-theme-fore-muted border border-slate-200/70 dark:border-theme-border/40"
                            >
                              {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5" />}
                              <span>{tech}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Key Outcomes & Impact */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Icon icon="ph:trend-up-bold" className="w-4 h-4" />
                        <span>{language === 'en' ? 'Key Outcomes & Impact' : 'Hasil & Dampak Utama Sistem (Key Outcomes)'}</span>
                      </div>

                      {(() => {
                        const rawOutcomes = language === 'en'
                          ? (selectedHighlightProject.keyOutcomesEn || selectedHighlightProject.keyOutcomesId || selectedHighlightProject.keyOutcomes || "")
                          : (selectedHighlightProject.keyOutcomesId || selectedHighlightProject.keyOutcomesEn || selectedHighlightProject.keyOutcomes || "");
                        
                        const points = rawOutcomes
                          .split('\n')
                          .map((line) => line.trim().replace(/^[●•\-\*]\s*/, ''))
                          .filter(Boolean);

                        if (points.length === 0) {
                          return (
                            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-theme-surface/50 border border-slate-200/80 dark:border-theme-border/50 text-xs text-slate-500 dark:text-theme-fore-muted leading-relaxed">
                              {language === 'en'
                                ? 'Detailed performance metrics and engineering outcomes for this project are available in the full architecture case study.'
                                : 'Metrik performa dan dampak arsitektur untuk proyek ini dapat dieksplorasi secara lengkap pada halaman studi kasus arsitektur.'}
                            </div>
                          );
                        }

                        return (
                          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3">
                            <ul className="space-y-3">
                              {points.map((pt, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                  <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-theme-surface/40 border-t border-slate-100 dark:border-theme-border/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedHighlightProject(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-theme-border hover:bg-slate-100 dark:hover:bg-theme-surface text-xs sm:text-sm font-bold text-slate-700 dark:text-theme-fore transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Tutup'}
                  </button>

                  <Link
                    href={`/projects/${selectedHighlightProject.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#1b2d4b] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#2C5098]/20 hover:shadow-lg hover:shadow-[#2C5098]/30 transition-all cursor-pointer border border-white/10"
                  >
                    <span>{language === 'en' ? 'View Full Case Study' : 'Buka Studi Kasus Lengkap'}</span>
                    <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
