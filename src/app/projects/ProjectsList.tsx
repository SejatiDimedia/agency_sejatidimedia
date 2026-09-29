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

  // 1. Featured Flagship Projects (Exactly 6 projects)
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

  // 2. Categories for the catalog
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
    <div className="space-y-20 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Editorial Header Section */}
      <header className="space-y-6 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Back to Overview' : 'Kembali ke Beranda'}</span>
        </Link>

        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#2C5098] dark:text-blue-400 font-bold block">
            {language === 'en' ? 'Selected Work & Systems' : 'Portofolio Sistem & Rekayasa'}
          </span>

          <h1 className="text-3xl sm:text-5xl font-jakarta font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {language === 'en'
              ? 'Production systems built with architectural rigor.'
              : 'Sistem operasional dan aplikasi siap produksi dengan standar rekayasa teruji.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
            {language === 'en'
              ? 'Explore our multi-tenant SaaS platforms, enterprise ERP & WMS integrations, and mobile solutions deployed for real business operations.'
              : 'Koleksi platform SaaS multi-tenant, digitalisasi ERP & logistik pergudangan, hingga aplikasi mobile berkinerja tinggi yang kami rancang dan bangun langsung.'}
          </p>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1: FEATURED PROJECTS (6 CARDS, 2 CARDS PER ROW)
          Crafted with Impeccable Design: Editorial, High Contrast, Authentic
          ========================================================================= */}
      {featuredProjects.length > 0 && (
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-jakarta font-bold tracking-tight text-slate-900 dark:text-white">
                {language === 'en' ? 'Flagship Implementations' : 'Proyek Unggulan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'en'
                  ? 'Six highlighted systems demonstrating our core engineering principles and domain depth.'
                  : 'Enam sistem terpilih yang merepresentasikan kapabilitas arsitektur dan keandalan sistem kami.'}
              </p>
            </div>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
              [ 06 {language === 'en' ? 'Featured Systems' : 'Sistem Pilihan'} ]
            </span>
          </div>

          {/* Grid: Exactly 2 Cards Per Row on tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {featuredProjects.map((project, idx) => {
              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;
              const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);

              return (
                <article
                  key={`featured-${project.slug}`}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40 overflow-hidden"
                >
                  {/* Media Viewport with Framed Aspect Ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={displayThumbnail}
                      alt={project.name}
                      fill
                      className={
                        isDummy
                          ? "object-contain p-12 bg-slate-50 dark:bg-slate-900"
                          : "object-cover object-top group-hover:scale-[1.025] transition-transform duration-700 ease-out"
                      }
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Subtle top metadata pills overlay */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                      <span className="font-mono text-[11px] font-bold tracking-widest text-slate-800 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                        {String(idx + 1).padStart(2, "0")} / 06
                      </span>

                      {isProfessionalExp ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-200 bg-amber-50/95 dark:bg-amber-950/85 backdrop-blur-md border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
                          <Icon icon="ph:lock-key-bold" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>NDA Protocol</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50/95 dark:bg-emerald-950/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{project.status === "COMPLETE" ? (language === 'en' ? 'Live System' : 'Sistem Aktif') : 'Development'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6">
                    <div className="space-y-3.5">
                      {/* Categories */}
                      {project.categories && project.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.categories.map((cat) => {
                            const catName = getCategoryName(cat);
                            return (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                              >
                                <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                <span>{catName}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Project Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-jakarta text-slate-900 dark:text-white group-hover:text-[#2C5098] dark:group-hover:text-blue-400 transition-colors tracking-tight leading-snug">
                        <Link href={`/projects/${project.slug}`} className="hover:underline decoration-1 underline-offset-4">
                          {project.name}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-sans">
                        {language === 'en'
                          ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                          : (project.summaryId || project.descriptionId || project.summary || project.description)}
                      </p>
                    </div>

                    {/* Footer: Technologies & Direct CTA */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                      {/* Technologies */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/50"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="text-[11px] font-mono text-slate-400 px-1.5 py-1">
                            +{project.technologies.length - 5}
                          </span>
                        )}
                      </div>

                      {/* Case Study Link */}
                      <div className="pt-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-sans font-bold text-slate-900 dark:text-white hover:text-[#2C5098] dark:hover:text-blue-400 transition-colors group/link"
                        >
                          <span>{language === 'en' ? 'Review Architecture & Case Study' : 'Pelajari Arsitektur & Studi Kasus'}</span>
                          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: ALL PROJECTS CATALOG
          ========================================================================= */}
      <section className="space-y-10 pt-4">
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-jakarta font-bold tracking-tight text-slate-900 dark:text-white">
              {language === 'en' ? 'All Portfolio Repositories' : 'Seluruh Repositori Portofolio'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'en'
                ? 'Browse our complete catalog across technical specializations.'
                : 'Telusuri seluruh katalog proyek berdasarkan spesialisasi teknologi dan domain aplikasi.'}
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
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon
                    icon={getCategoryIcon(cat)}
                    className="w-3.5 h-3.5"
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
                    className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Thumbnail */}
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <Image
                          src={displayThumbnail}
                          alt={project.name}
                          fill
                          className={
                            isDummy
                              ? "object-contain p-8 bg-slate-50 dark:bg-slate-950"
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
                                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                                >
                                  <Icon icon={getCategoryIcon(catName)} className="w-3 h-3 text-slate-500" />
                                  <span>{catName}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <h3 className="text-base font-jakarta font-bold text-slate-900 dark:text-white group-hover:text-[#2C5098] dark:group-hover:text-blue-400 transition-colors">
                          <Link href={`/projects/${project.slug}`}>
                            {project.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-sans">
                          {language === 'en'
                            ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                            : (project.summaryId || project.descriptionId || project.summary || project.description)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/40"
                          >
                            {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3 h-3 opacity-80" />}
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono text-slate-400">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-xs font-sans font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 border border-slate-200 dark:border-slate-700 cursor-pointer group/btn"
                      >
                        <span>{language === 'en' ? 'View Details' : 'Lihat Detail'}</span>
                        <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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
                className="col-span-1 md:col-span-3 p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
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
