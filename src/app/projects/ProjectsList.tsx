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

  // 1. Featured Projects computation (6 flagship projects)
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

  // 2. Dynamic categories for catalog
  const allCategories = projects.flatMap((p) => p.categories?.map(getCategoryName) || []);
  const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
  const allCategoryLabel = language === 'en' ? "All" : "Semua";
  const categories = [allCategoryLabel, ...uniqueCategories];

  // 3. Filtered projects for general catalog
  const filteredProjects = projects.filter((project) => {
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
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 font-bold">
                <Icon icon="ph:star-fill" className="w-3.5 h-3.5 text-amber-500" />
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

          {/* Grid of 6 Featured Cards (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project) => {
              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;
              const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);

              return (
                <div
                  key={`featured-${project.slug}`}
                  className="group flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-theme-elevated border-2 border-[#2C5098]/30 dark:border-theme-border-accent/60 hover:border-[#2C5098] dark:hover:border-theme-accent shadow-md shadow-[#2C5098]/5 hover:shadow-xl hover:shadow-[#2C5098]/15 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Thumbnail with Featured Pill */}
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

                      {/* Featured Star Badge on top-right */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-white shadow-md shadow-amber-500/30">
                        <Icon icon="ph:star-fill" className="w-3 h-3 text-white" />
                        <span>{language === 'en' ? 'Featured' : 'Unggulan'}</span>
                      </div>

                      {/* NDA indicator if applicable */}
                      {isProfessionalExp && (
                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-400/40">
                          <Icon icon="ph:shield-check-bold" className="w-2.5 h-2.5 text-amber-400" />
                          <span>NDA</span>
                        </div>
                      )}
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

                  {/* Footer: Tech Stack & Featured Primary Action Button */}
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
                        <span className="flex items-center px-1.5 py-1 rounded-lg text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-theme-surface border border-slate-200/50">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white hover:from-[#23385B] hover:to-[#1b2d4b] text-xs font-sans font-bold transition-all duration-300 shadow-md shadow-[#2C5098]/20 hover:shadow-lg hover:shadow-[#2C5098]/30 cursor-pointer"
                    >
                      <span>{language === 'en' ? 'View Details' : 'Lihat Detail'}</span>
                      <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
                    </Link>
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
                          <span className="flex items-center px-1.5 py-1 rounded-lg text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-theme-surface border border-slate-200/50">
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
