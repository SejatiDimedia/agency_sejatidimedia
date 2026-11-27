"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Globe, Layers } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export interface PublicStaticWebItem {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  thumbnailUrl?: string | null;
}

export default function StatisWebView({
  items = [],
}: {
  items: PublicStaticWebItem[];
}) {
  const { language } = useLanguage();
  const allLabel = language === "en" ? "All" : "Semua";
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return ["ALL", ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "ALL") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const formatDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\//, "");
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 py-6 sm:py-10">
      {/* Header Section */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-[#2C5098] dark:text-theme-fore-muted dark:hover:text-theme-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === "en" ? "Back to Home" : "Kembali ke Beranda"}</span>
        </Link>

        <div className="space-y-3 text-left">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] dark:text-theme-accent font-bold">
            <span>{language === "en" ? "WEB & LANDING PAGE" : "PORTOFOLIO WEB & LANDING PAGE"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-jakarta font-sans font-extrabold tracking-tight text-slate-900 dark:text-theme-fore leading-tight">
            {language === "en" ? (
              <>
                Web &amp; Landing Page{" "}
                <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent inline-block">
                  Showcase
                </span>
              </>
            ) : (
              <>
                Portofolio Web &amp;{" "}
                <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent inline-block">
                  Landing Page
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-theme-fore-muted max-w-2xl leading-relaxed font-sans">
            {language === "en"
              ? "Curated collection of company profile websites, high-converting landing pages, and fast static web experiences."
              : "Koleksi website company profile, landing page berkonversi tinggi, dan situs web statis berkecepatan tinggi."}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <section
          aria-label={language === "en" ? "Empty portfolio state" : "Daftar portofolio kosong"}
          className="rounded-3xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border p-8 sm:p-14 text-center shadow-2xs"
        >
          <div className="max-w-md mx-auto space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2C5098]/8 dark:bg-theme-accent/10 border border-[#2C5098]/15 dark:border-theme-accent/20 flex items-center justify-center text-[#2C5098] dark:text-theme-accent">
              <Globe className="w-6 h-6" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-sans font-bold text-slate-900 dark:text-theme-fore tracking-tight">
                {language === "en"
                  ? "No Web & Landing Page Items Yet"
                  : "Belum Ada Portofolio Web & Landing Page"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-theme-fore-muted leading-relaxed font-sans">
                {language === "en"
                  ? "We are currently preparing our web & landing page showcases for this section. In the meantime, explore our systems and applications."
                  : "Etalase web statis dan landing page sedang disiapkan untuk halaman ini. Sambil menunggu, Anda dapat melihat portofolio sistem & aplikasi kami."}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2C5098] hover:bg-[#23385B] text-white text-xs font-sans font-semibold transition-colors shadow-2xs w-full sm:w-auto"
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === "en" ? "Explore Systems & Apps" : "Lihat Sistem & Aplikasi"}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-theme-surface dark:hover:bg-theme-surface/80 text-slate-700 dark:text-theme-fore text-xs font-sans font-semibold border border-slate-200/80 dark:border-theme-border transition-colors w-full sm:w-auto"
              >
                <span>{language === "en" ? "Back to Home" : "Kembali ke Beranda"}</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          {/* Category Filter Bar */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-theme-border/60 pb-4">
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter kategori">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#2C5098] text-white shadow-2xs"
                          : "bg-white dark:bg-theme-elevated text-slate-600 dark:text-theme-fore-muted hover:text-slate-900 dark:hover:text-theme-fore border border-slate-200/80 dark:border-theme-border"
                      }`}
                    >
                      {cat === "ALL" ? allLabel : cat}
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-theme-fore-muted">
                {filteredItems.length} {language === "en" ? "Websites" : "Website"}
              </span>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredItems.map((item) => {
              const showFallback = !item.thumbnailUrl || failedImages[item.id];
              return (
                <a
                  key={item.id}
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-white dark:bg-theme-elevated border border-slate-200/90 dark:border-theme-border hover:border-[#2C5098]/50 dark:hover:border-theme-accent/50 hover:shadow-lg hover:shadow-[#2C5098]/8 transition-all duration-200 overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5098] focus-visible:ring-offset-2"
                >
                  {/* Live Website Screenshot Thumbnail */}
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-theme-surface border-b border-slate-100 dark:border-theme-border/60 overflow-hidden">
                    {!showFallback ? (
                      <img
                        src={item.thumbnailUrl!}
                        alt={`${item.name} preview`}
                        loading="lazy"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-theme-fore-subtle p-4 text-center">
                        <Globe className="w-7 h-7 opacity-60" aria-hidden="true" />
                        <span className="text-xs font-mono truncate max-w-full">
                          {formatDomain(item.liveUrl)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C5098] dark:text-theme-accent bg-[#2C5098]/8 dark:bg-theme-accent/10 border border-[#2C5098]/15 dark:border-theme-accent/20 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <h2 className="text-base font-sans font-bold text-slate-900 dark:text-theme-fore group-hover:text-[#2C5098] dark:group-hover:text-theme-accent transition-colors line-clamp-1">
                        {item.name}
                      </h2>
                      <p className="text-xs font-mono text-slate-500 dark:text-theme-fore-muted truncate">
                        {formatDomain(item.liveUrl)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-theme-border/50 flex items-center justify-between text-xs font-sans font-semibold text-[#2C5098] dark:text-theme-accent">
                      <span>{language === "en" ? "Visit Live Website" : "Kunjungi Website"}</span>
                      <ExternalLink
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
