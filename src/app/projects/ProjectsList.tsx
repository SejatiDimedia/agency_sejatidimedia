"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Project } from "../../lib/api/glio-projects";
import { motion, AnimatePresence } from "motion/react";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const CATEGORY_MAP: Record<string, string> = {
    "68fd86b3efc68bfc3fd16532": "AI",
    "68fd8688efc68bfc3fd16531": "Web",
    "68fd85f1f86ba8de6fc21c1f": "Mobile"
  };

  const getCategoryName = (id: string) => CATEGORY_MAP[id] || id;

  // Generate dynamic categories from the projects array by mapping IDs to names
  const allCategories = projects.flatMap((p) => p.categories?.map(getCategoryName) || []);
  const uniqueCategories = Array.from(new Set(allCategories)).filter(Boolean);
  const categories = ["Semua", ...uniqueCategories];

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "Semua") return true;
    const projectCategoryNames = project.categories?.map(getCategoryName) || [];
    return projectCategoryNames.includes(activeCategory);
  });

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-theme-fore-muted hover:text-theme-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
              <span className="w-6 h-[1px] bg-theme-accent" />
              <span>Portofolio</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-theme-fore text-left">
              Portofolio Perangkat Lunak
            </h1>
            <p className="text-sm text-theme-fore-muted max-w-xl leading-relaxed text-left">
              Jelajahi katalog sistem produksi, aplikasi SaaS, dan produk mobile kustom yang dibangun dengan presisi.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-theme-accent text-white shadow-md shadow-theme-accent/20"
                  : "bg-theme-surface text-theme-fore-muted hover:bg-theme-elevated hover:text-theme-fore border border-theme-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
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
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.slug}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-theme-elevated border border-theme-border hover:border-theme-border-accent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-theme-surface border border-theme-border/40">
                      <Image
                        src={displayThumbnail}
                        alt={project.name}
                        fill
                        className={
                          isDummy
                            ? "object-contain p-8 bg-theme-surface/40"
                            : "object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        }
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-2 text-left">
                      {project.categories && project.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pb-1">
                          {project.categories.map((cat) => (
                            <span key={cat} className="inline-block text-[8px] font-mono uppercase tracking-widest font-bold text-theme-accent bg-theme-accent/10 border border-theme-accent/20 px-2 py-0.5 rounded-full">
                              {getCategoryName(cat)}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-theme-fore-muted leading-relaxed line-clamp-3">
                        {project.summary || project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-theme-border/30 mt-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-theme-surface text-theme-fore-muted border border-theme-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white text-xs font-sans font-bold text-theme-fore transition-all duration-300 border border-theme-border/80 hover:border-theme-accent"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
              className="col-span-1 md:col-span-3 p-12 text-center rounded-2xl bg-theme-elevated border border-theme-border"
            >
              <span className="text-xs font-mono text-theme-fore-muted">
                Tidak ada proyek ditemukan dalam kategori ini.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
