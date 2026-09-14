"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { Project, isProfessionalProject } from "../../lib/api/glio-projects";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { TECH_ICONS } from "../../lib/constants";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(language === 'en' ? "All" : "Semua");
  const [ndaProjectSlugs, setNdaProjectSlugs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/settings/nda')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.ndaProjectSlugs)) {
          setNdaProjectSlugs(data.ndaProjectSlugs);
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
    "68fd85f1f86ba8de6fc21c1f": "Mobile"
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

  // Generate dynamic categories from the projects array by mapping IDs to names
  const allCategories = projects.flatMap((p) => p.categories?.map(getCategoryName) || []);
  const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
  const allCategoryLabel = language === 'en' ? "All" : "Semua";
  const categories = [allCategoryLabel, ...uniqueCategories];

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === allCategoryLabel) return true;
    const projectCategoryNames = project.categories?.map(getCategoryName) || [];
    return projectCategoryNames.includes(activeCategory);
  });

  // Standard display count: 6 items for clean 3-column grid alignment
  const INITIAL_PROJECTS_COUNT = 6;
  const PROJECTS_PAGE_INCREMENT = 6;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PROJECTS_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  const filteredProjectsRef = useRef(filteredProjects);
  filteredProjectsRef.current = filteredProjects;

  const loadMore = useCallback(() => {
    if (isFetchingRef.current) return;
    if (visibleCountRef.current >= filteredProjectsRef.current.length) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + PROJECTS_PAGE_INCREMENT, filteredProjectsRef.current.length);
        visibleCountRef.current = next;
        return next;
      });
      setIsLoadingMore(false);
      isFetchingRef.current = false;

      // Check if sentinel is still in viewport (e.g. fast scrolling, large monitors, or bottom rested)
      requestAnimationFrame(() => {
        if (sentinelRef.current) {
          const rect = sentinelRef.current.getBoundingClientRect();
          if (rect.top <= window.innerHeight + 350 && visibleCountRef.current < filteredProjectsRef.current.length) {
            loadMore();
          }
        }
      });
    }, 100);
  }, []);

  // Reset pagination when active category changes
  useEffect(() => {
    setVisibleCount(INITIAL_PROJECTS_COUNT);
    visibleCountRef.current = INITIAL_PROJECTS_COUNT;
    setIsLoadingMore(false);
    isFetchingRef.current = false;
  }, [activeCategory]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;
  const totalProjectsCount = filteredProjects.length;
  const currentVisibleCount = Math.min(visibleCount, totalProjectsCount);

  // Automatic Infinite Scroll with dual trigger:
  // 1. IntersectionObserver with generous rootMargin
  // 2. Window scroll event listener fallback (guarantees fetch even if boundary transition is missed)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 450px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    const handleScroll = () => {
      if (isFetchingRef.current) return;
      if (visibleCountRef.current >= filteredProjectsRef.current.length) return;

      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      // Trigger when within 550px of page bottom
      if (scrollBottom >= docHeight - 550) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check in case content doesn't fill initial viewport
    requestAnimationFrame(() => {
      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 300) {
          loadMore();
        }
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, activeCategory]);

  return (
    <div className="space-y-12 py-6 sm:py-10">
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

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence>
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => {
              const isDummy =
                !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;
              const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);

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
                        sizes="(max-w-768px) 100vw, 33vw"
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

      {/* Infinite Scroll Sentinel & Automatic Fetch Indicator */}
      {hasMoreProjects && (
        <div
          ref={sentinelRef}
          className="w-full flex flex-col items-center justify-center py-8 min-h-[72px]"
        >
          {isLoadingMore ? (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border shadow-xs text-xs font-sans font-medium text-slate-600 dark:text-theme-fore-muted animate-pulse">
              <Loader2 className="w-4 h-4 text-[#2C5098] animate-spin" />
              <span>
                {language === "en"
                  ? `Loading more projects (${currentVisibleCount} of ${totalProjectsCount})...`
                  : `Memuat proyek berikutnya (${currentVisibleCount} dari ${totalProjectsCount})...`}
              </span>
            </div>
          ) : (
            <div className="h-4 w-full" />
          )}
        </div>
      )}

      {/* Finished State Indicator - Styled like the Explore All Portfolio button on Beranda */}
      {!hasMoreProjects && filteredProjects.length > 0 && (
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white text-xs sm:text-sm font-sans font-bold shadow-md shadow-[#2C5098]/20 border border-white/10 select-none">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>
              {language === "en"
                ? `All ${totalProjectsCount} projects loaded`
                : `Semua ${totalProjectsCount} proyek telah ditampilkan`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
