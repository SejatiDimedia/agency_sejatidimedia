"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  const [activeCategory, setActiveCategory] = useState(language === 'en' ? "All" : "Semua");
  const [ndaProjectSlugs, setNdaProjectSlugs] = useState<string[]>([]);
  const [featuredProjectSlugs, setFeaturedProjectSlugs] = useState<string[]>(initialFeaturedSlugs);

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

  // 1. Featured Projects computation (up to 6 curated flagship projects)
  const featuredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const featured = projects
      .filter((p) => featuredProjectSlugs.includes(p.slug))
      .sort((a, b) => featuredProjectSlugs.indexOf(a.slug) - featuredProjectSlugs.indexOf(b.slug));

    if (featured.length < 6) {
      const remaining = projects.filter((p) => !featuredProjectSlugs.includes(p.slug));
      return [...featured, ...remaining].slice(0, 6);
    }

    return featured.slice(0, 6);
  }, [projects, featuredProjectSlugs]);

  // 2. Dynamic categories from all projects
  const allCategories = projects.flatMap((p) => p.categories?.map(getCategoryName) || []);
  const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
  const allCategoryLabel = language === 'en' ? "All" : "Semua";
  const categories = [allCategoryLabel, ...uniqueCategories];

  // 3. Filtered projects for the general catalog
  const filteredProjects = projects.filter((project) => {
    if (activeCategory === allCategoryLabel) return true;
    const projectCategoryNames = project.categories?.map(getCategoryName) || [];
    return projectCategoryNames.includes(activeCategory);
  });

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Page Header Section */}
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-[#2C5098] dark:text-theme-fore-muted dark:hover:text-theme-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}</span>
        </Link>

        <div className="space-y-3 text-left">
          {/* Section Eyebrow matching the landing page theme */}
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

      {/* =========================================================================
          SECTION 1: FEATURED PROJECTS / PROYEK UNGGULAN (NEW DISTINCT SHOWCASE)
          ========================================================================= */}
      {featuredProjects.length > 0 && (
        <section className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-theme-border/60 pb-5">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Icon icon="ph:star-fill" className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'en' ? 'FEATURED SHOWCASE' : 'PROYEK UNGGULAN'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-jakarta font-sans font-bold tracking-tight text-slate-900 dark:text-theme-fore">
                {language === 'en' ? 'Flagship Software & Systems' : 'Pilihan Sistem & Solusi Unggulan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted max-w-2xl">
                {language === 'en'
                  ? 'High-impact solutions with proven engineering, scalable backend architecture, and real business outcomes.'
                  : 'Sistem terkurasi dengan arsitektur tangguh, integrasi menyeluruh, dan hasil nyata di lingkungan produksi.'}
              </p>
            </div>

            <div className="text-xs font-mono font-semibold text-slate-500 dark:text-theme-fore-muted bg-slate-100 dark:bg-theme-surface px-3 py-1.5 rounded-xl border border-slate-200 dark:border-theme-border/60 self-start sm:self-auto shrink-0">
              <span className="text-[#2C5098] dark:text-blue-400 font-bold">{featuredProjects.length}</span> {language === 'en' ? 'Flagship Projects' : 'Proyek Terpilih'}
            </div>
          </div>

          {/* Featured Cards Grid: 2 Columns with Wide Spotlight Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {featuredProjects.map((project, idx) => {
              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;
              const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);

              return (
                <motion.article
                  key={`featured-${project.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-theme-elevated dark:to-theme-surface border-2 border-slate-200/90 dark:border-theme-border hover:border-[#2C5098]/70 dark:hover:border-blue-500/70 shadow-md hover:shadow-2xl hover:shadow-[#2C5098]/12 transition-all duration-300 overflow-hidden"
                >
                  {/* Top Ambient Highlight Ribbon */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#2C5098] via-indigo-500 to-amber-500" />

                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Featured Header Pill Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs">
                        <Icon icon="ph:star-fill" className="w-3 h-3 text-amber-500" />
                        <span>{language === 'en' ? 'Flagship' : 'Unggulan'} #{idx + 1}</span>
                      </span>

                      {isProfessionalExp ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          <Icon icon="ph:shield-check-bold" className="w-3 h-3 text-amber-600" />
                          <span>NDA Protected</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{project.status === "COMPLETE" ? (language === 'en' ? 'Production Ready' : 'Siap Produksi') : 'Ongoing'}</span>
                        </span>
                      )}
                    </div>

                    {/* Cinematic Media Preview */}
                    <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-theme-surface border border-slate-200/80 dark:border-theme-border/60">
                      <Image
                        src={displayThumbnail}
                        alt={project.name}
                        fill
                        className={
                          isDummy
                            ? "object-contain p-8 bg-slate-50 dark:bg-theme-surface/40"
                            : "object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        }
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />

                      {/* Ambient bottom scrim overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                      {/* Floating Category Pills on Media */}
                      {project.categories && project.categories.length > 0 && (
                        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
                          {project.categories.map((cat) => {
                            const catName = getCategoryName(cat);
                            return (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-xs"
                              >
                                <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-amber-400" />
                                <span>{catName}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Title & Rich Summary */}
                    <div className="space-y-2.5 text-left">
                      <h3 className="text-xl sm:text-2xl font-jakarta font-sans font-bold text-slate-900 dark:text-theme-fore group-hover:text-[#2C5098] dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {project.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted leading-relaxed line-clamp-3 font-sans">
                        {language === 'en'
                          ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                          : (project.summaryId || project.descriptionId || project.summary || project.description)}
                      </p>
                    </div>

                    {/* Technology Stack Badges */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-100 dark:bg-theme-surface text-slate-700 dark:text-theme-fore-muted border border-slate-200/80 dark:border-theme-border/60"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5 text-[#2C5098] dark:text-theme-accent" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 dark:text-theme-fore-muted bg-slate-50 dark:bg-theme-surface border border-slate-200/60 dark:border-theme-border/40">
                            +{project.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button Bar */}
                  <div className="p-6 sm:p-7 pt-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white hover:from-[#23385B] hover:to-[#1a2c47] text-xs sm:text-sm font-sans font-bold shadow-md shadow-[#2C5098]/20 hover:shadow-xl hover:shadow-[#2C5098]/30 transition-all duration-300 group/cta cursor-pointer"
                    >
                      <span>{language === 'en' ? 'Explore Case Study & Architecture' : 'Pelajari Studi Kasus & Arsitektur'}</span>
                      <span className="p-1 rounded-lg bg-white/15 group-hover/cta:bg-white/25 group-hover/cta:translate-x-1 transition-all">
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-white" />
                      </span>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: ALL PROJECTS / SELURUH PORTOFOLIO (CATALOG & CATEGORY FILTER)
          ========================================================================= */}
      <section className="space-y-8 pt-4">
        {/* Section Header & Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200/80 dark:border-theme-border/60 pb-6">
          <div className="space-y-2 text-left">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] dark:text-theme-accent font-bold">
              <span>{language === 'en' ? 'FULL CATALOG' : 'SEMUA PORTOFOLIO'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-jakarta font-sans font-bold tracking-tight text-slate-900 dark:text-theme-fore">
              {language === 'en' ? 'Explore All Projects' : 'Eksplorasi Seluruh Karya & Proyek'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted max-w-xl">
              {language === 'en'
                ? 'Filter through our complete repository by technical domain or specialized stack.'
                : 'Saring seluruh repositori proyek berdasarkan kategori domain atau kebutuhan teknologi Anda.'}
            </p>
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
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-50 dark:bg-theme-surface text-slate-600 dark:text-theme-fore-muted border border-slate-200/60 dark:border-theme-border/40"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5 opacity-80" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="flex items-center px-2 py-1 rounded-lg text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-theme-surface border border-slate-200/50">
                            +{project.technologies.length - 4}
                          </span>
                        )}
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
    </div>
  );
}
