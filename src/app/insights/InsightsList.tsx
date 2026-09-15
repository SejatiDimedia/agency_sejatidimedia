"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Calendar, ArrowRight, Tag, BookOpen, Layers, ChevronRight, ChevronLeft, RotateCcw, HelpCircle } from "lucide-react";
import { InsightArticle, InsightSeriesSummary } from "@/lib/api/insights";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InsightsListProps {
  articles: InsightArticle[];
  categories: string[];
  seriesList?: InsightSeriesSummary[];
}

export default function InsightsList({ articles, categories, seriesList = [] }: InsightsListProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pageT = t.insightsPage || {
    badge: "INSIGHTS & TEKNOLOGI",
    title: "Catatan Arsitektur & Standar Rekayasa Perangkat Lunak",
    subtitle: "Ulasan mendalam seputar arsitektur web, optimasi performa, keamanan sistem, dan praktik terbaik engineering.",
    searchPlaceholder: "Cari topik artikel...",
    allCategories: "Semua Kategori",
    readTime: "menit baca",
    publishedOn: "Diterbitkan pada"
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      const title = language === "en" ? article.titleEn : article.titleId;
      const excerpt = language === "en" ? article.excerptEn : article.excerptId;
      const searchTarget = `${title} ${excerpt} ${article.tags.join(" ")} ${article.category}`.toLowerCase();
      const matchesSearch = searchQuery.trim() === "" || searchTarget.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery, language]);

  // Standard display count: 6 items per page for clean 3-column grid alignment
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 on category filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const isDefaultView = selectedCategory === "All" && !searchQuery.trim();

  // In default view, the 1st article is showcased in the Featured Lead Story Card,
  // so the archive grid presents the remaining articles.
  // In filtered / search view, all matching articles are displayed in the grid.
  const archiveArticles = useMemo(() => {
    return isDefaultView ? filteredArticles.slice(1) : filteredArticles;
  }, [filteredArticles, isDefaultView]);

  const totalPages = Math.max(1, Math.ceil(archiveArticles.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const displayedArchiveArticles = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return archiveArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [archiveArticles, activePage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const archiveAnchor = document.getElementById("insights-archive-section");
    if (archiveAnchor) {
      archiveAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* 1. Standard Section Header - Matching Beranda Section Style */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
        {/* Eyebrow / Section Label */}
        <div className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-[#2C5098] font-bold">
          <span>{pageT.badge || (language === 'en' ? 'ENGINEERING INSIGHTS' : 'INSIGHTS & TEKNOLOGI')}</span>
        </div>

        {/* Section Headline */}
        <h1 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
          {language === 'en' ? 'System Architecture &' : 'Catatan Arsitektur &'}{' '}
          <span className="text-[#2C5098] font-extrabold">
            {language === 'en' ? 'Engineering Standards' : 'Standar Rekayasa Software'}
          </span>
        </h1>

        {/* Section Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
          {pageT.subtitle}
        </p>
      </div>

      {/* 2. Controls: Search & Category Filter Pills */}
      <div className="mb-10 sm:mb-12 space-y-5 max-w-4xl mx-auto relative z-10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={pageT.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2C5098] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills - Matching Beranda Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                  ? "bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-md shadow-[#2C5098]/20 border border-white/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs"
                  }`}
              >
                {cat === "All" ? pageT.allCategories : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Articles Display: Featured Lead Card + Archive Grid */}
      {filteredArticles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 px-6 sm:px-10 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] max-w-2xl mx-auto relative overflow-hidden my-8"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Architectural Layered Graphic (Clean, professional, no stars/sparkles) */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-slate-100/80 border border-slate-200/80 -rotate-6 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 to-[#2C5098]/10 border border-[#2C5098]/25 rotate-3 shadow-md" />
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
              <Search className="w-7 h-7 text-[#2C5098]" />
            </div>
          </div>

          {/* Title & Description (No badge pill) */}
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 tracking-tight">
            {articles.length === 0
              ? (language === "en" ? "Articles Are Under Engineering Curation" : "Katalog Artikel Sedang Disiapkan")
              : searchQuery.trim()
              ? (language === "en" ? `No Articles Found for "${searchQuery}"` : `Tidak Ada Artikel untuk "${searchQuery}"`)
              : (language === "en" ? `No Articles in "${selectedCategory}" Yet` : `Belum Ada Artikel di Kategori ${selectedCategory}`)}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mt-2 font-sans">
            {articles.length === 0
              ? (language === "en"
                ? "Our engineering team is preparing deep-dive whitepapers and architecture teardowns. Please check back shortly!"
                : "Tim software engineer kami sedang menyusun dokumentasi arsitektur dan panduan teknis mendalam. Silakan kunjungi kembali nanti!")
              : searchQuery.trim()
              ? (language === "en"
                ? "We couldn't find any architectural teardown matching this search. Try a different term or reset filters."
                : "Tidak ditemukan ulasan atau panduan sistem yang cocok dengan kata kunci tersebut. Coba gunakan istilah lain atau reset filter.")
              : (language === "en"
                ? `Articles under "${selectedCategory}" are currently in drafting. Explore our other engineering disciplines below.`
                : `Pembahasan seputar topik "${selectedCategory}" sedang dalam tahap penulisan. Jelajahi disiplin rekayasa lainnya di bawah ini.`)}
          </p>

          {/* Action Buttons (1 line labels) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            {(searchQuery.trim() !== "" || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white text-xs sm:text-sm font-sans font-bold shadow-md shadow-[#2C5098]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{language === "en" ? "Reset Filters" : "Reset Pencarian & Filter"}</span>
              </button>
            )}

            <Link
              href="/#contact-section"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-sans font-bold border border-slate-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#2C5098] shrink-0" />
              <span>{language === "en" ? "Request a Topic" : "Request Topik Rekayasa"}</span>
            </Link>
          </div>

          {/* Quick Category Suggestions */}
          {categories.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                {language === "en" ? "Or explore other disciplines:" : "Atau jelajahi topik rekayasa lainnya:"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {categories.filter(c => c !== selectedCategory && c !== "All").map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#2C5098] border border-slate-200/80 hover:border-[#2C5098]/30 transition-colors cursor-pointer"
                  >
                    <span>{cat}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="space-y-10">
          {/* Featured Lead Story (shown on default view: All category & no search query) */}
          {selectedCategory === "All" && !searchQuery.trim() && filteredArticles.length > 0 && (
            (() => {
              const featured = filteredArticles[0];
              const fTitle = language === "en" ? featured.titleEn : featured.titleId;
              const fExcerpt = language === "en" ? featured.excerptEn : featured.excerptId;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/insights/${featured.slug}`} className="group block">
                    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_50px_-12px_rgba(44,80,152,0.18)] hover:border-[#2C5098]/50 transition-all duration-300 overflow-hidden relative">
                      {/* Top hover accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#2C5098] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        {/* Media Col */}
                        <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] overflow-hidden bg-slate-100">
                          <Image
                            src={featured.coverImage}
                            alt={fTitle}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 flex items-center gap-2 z-10 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-white/95 text-[#2C5098] border border-[#2C5098]/20 shadow-xs backdrop-blur-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098]" />
                              {featured.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#2C5098] text-white border border-[#2C5098] shadow-xs">
                              {language === "en" ? "FEATURED" : "UTAMA"}
                            </span>
                            {featured.series && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#1E315B] text-white border border-white/20 shadow-xs">
                                <Layers className="w-3 h-3 text-blue-200" />
                                Part {featured.seriesPart || featured.series.part}
                              </span>
                            )}
                          </div>

                          {/* Bottom-left Read Time */}
                          <div className="absolute bottom-4 left-4 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-medium bg-black/60 text-white/95 backdrop-blur-md border border-white/15">
                              <Clock className="w-3 h-3 text-white/80" />
                              {featured.readTimeMinutes} {pageT.readTime}
                            </span>
                          </div>
                        </div>

                        {/* Content Col */}
                        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white via-white to-slate-50/50">
                          <div className="space-y-4">
                            {/* Eyebrow & Published Date */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#2C5098]">
                                {language === "en" ? "FEATURED ARTICLE" : "PILIHAN REDAKSI"}
                              </span>
                              <span className="text-slate-400 font-sans text-xs">
                                {new Date(featured.publishedAt).toLocaleDateString(
                                  language === "en" ? "en-US" : "id-ID",
                                  { month: "short", day: "numeric", year: "numeric" }
                                )}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-slate-900 group-hover:text-[#2C5098] transition-colors leading-[1.22] tracking-tight">
                              {fTitle}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-4">
                              {fExcerpt}
                            </p>
                          </div>

                          {/* Author Byline & Action */}
                          <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                <Image
                                  src={featured.author.avatar}
                                  alt={featured.author.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {featured.author.name}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate font-sans">
                                  {featured.author.role}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {featured.tags.slice(0, 3).map((tag) => (
                                  <Link
                                    key={tag}
                                    href={`/insights?search=${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold text-[#2C5098] bg-blue-50/80 hover:bg-[#2C5098] hover:text-white border border-blue-200/70 hover:border-[#2C5098] transition-all cursor-pointer shadow-2xs group"
                                  >
                                    <span>{tag}</span>
                                  </Link>
                                ))}
                              </div>

                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C5098] text-white text-xs font-sans font-bold uppercase tracking-wider shadow-sm group-hover:bg-[#23385B] transition-colors shrink-0">
                                <span>{language === "en" ? "Read Story" : "Baca Artikel"}</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })()
          )}

          {/* Series Showcase Shelf: Engineering Curriculum Tracks (Card Silabus - NO top border) */}
          {selectedCategory === "All" && !searchQuery.trim() && seriesList && seriesList.length > 0 && (
            <section className="pt-2 pb-6 my-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
                <div>
                  <div className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-[#2C5098] font-bold mb-1.5">
                    <span>{language === "en" ? "STRUCTURED CURRICULUM" : "KURIKULUM TERSTRUKTUR"}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight">
                    {language === "en" ? (
                      <>
                        <span>Engineering Series & </span>
                        <span className="text-[#2C5098]">Playbooks</span>
                      </>
                    ) : (
                      <>
                        <span>Seri Rekayasa & </span>
                        <span className="text-[#2C5098]">Engineering Playbooks</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1.5 max-w-2xl leading-relaxed">
                    {language === "en"
                      ? "Deep multi-part technical playbooks covering architecture, performance, anti-patterns, and scalable production standards."
                      : "Kumpulan artikel bertahap (multi-part) yang membahas arsitektur mendalam, bedah masalah developer, hingga standar produksi skala bisnis."}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80 shrink-0 self-start sm:self-end shadow-2xs">
                  <BookOpen className="w-3 h-3 text-[#2C5098]" />
                  {seriesList.length} {language === "en" ? (seriesList.length > 1 ? "Playbooks" : "Playbook") : "Seri"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seriesList.map((series) => {
                  const sTitle = (language === "en" ? (series.titleEn || series.titleId) : series.titleId) || "";
                  const sDesc = (language === "en" ? (series.descriptionEn || series.descriptionId) : series.descriptionId) || "";

                  return (
                    <Link
                      key={series.id}
                      href={`/insights/series/${series.slug}`}
                      className="group flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-[#2C5098]/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                    >
                      {/* NO top border/line indicator */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                        <Image
                          src={series.coverImage ?? "/images/insights/laravel_architecture_cover.jpg"}
                          alt={sTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#2C5098] border border-[#2C5098]/20 shadow-xs">
                            <Layers className="w-3 h-3 text-[#2C5098]" />
                            {series.badge || (language === "en" ? "SERIES" : "SERI")}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-medium bg-black/60 backdrop-blur-md text-white/95 border border-white/15">
                            <BookOpen className="w-3 h-3 text-blue-300" />
                            {series.totalArticles} {language === "en" ? "Parts" : "Bagian"}
                          </span>
                          {series.totalReadTimeMinutes > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-medium bg-black/60 backdrop-blur-md text-white/95 border border-white/15">
                              <Clock className="w-3 h-3 text-white/80" />
                              {series.totalReadTimeMinutes}m
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="text-[10px] font-sans font-bold text-[#2C5098] uppercase tracking-wider">
                            {series.category}
                          </div>
                          <h4 className="text-base sm:text-lg font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors leading-snug line-clamp-2">
                            {sTitle}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
                            {sDesc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2C5098]">
                          <span>{language === "en" ? "Explore Syllabus" : "Pelajari Silabus"}</span>
                          <div className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-[#2C5098] group-hover:text-white flex items-center justify-center transition-all duration-300">
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section Divider when Featured Card is shown */}
          <div id="insights-archive-section" className="scroll-mt-24">
            {selectedCategory === "All" && !searchQuery.trim() && filteredArticles.length > 1 && (
              <div className="flex items-center gap-3 pt-4 pb-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-slate-400">
                  {language === "en" ? "ARCHIVE & ALL ARTICLES" : "ARSIP SEMUA ARTIKEL"}
                </span>
                <div className="flex-1 h-[1px] bg-slate-200/80" />
              </div>
            )}
          </div>

          {/* Regular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {displayedArchiveArticles.map((article, idx) => {
                const title = language === "en" ? article.titleEn : article.titleId;
                const excerpt = language === "en" ? article.excerptEn : article.excerptId;

                return (
                  <motion.article
                    key={article.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="group relative flex flex-col h-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(44,80,152,0.16)] hover:border-[#2C5098]/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Subtle top accent line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#2C5098] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                    <Link href={`/insights/${article.slug}`} className="flex flex-col h-full">
                      {/* Cover Thumbnail Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                        <Image
                          src={article.coverImage}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

                        {/* Floating Category & Series Pill */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap max-w-[90%]">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-white/95 text-[#2C5098] border border-[#2C5098]/20 shadow-xs backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098]" />
                            {article.category}
                          </span>
                          {article.series && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#1E315B] text-white border border-white/20 shadow-xs">
                              <Layers className="w-3 h-3 text-blue-200" />
                              Part {article.seriesPart || article.series.part}
                            </span>
                          )}
                        </div>

                        {/* Floating Read Time Pill */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-medium bg-black/60 text-white/95 backdrop-blur-md border border-white/15">
                            <Clock className="w-3 h-3 text-white/80" />
                            {article.readTimeMinutes} {pageT.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Author Mini Byline & Date */}
                          <div className="flex items-center justify-between gap-2 pb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                <Image
                                  src={article.author.avatar}
                                  alt={article.author.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-700 truncate">
                                {article.author.name}
                              </span>
                            </div>

                            <span className="text-[11px] font-sans text-slate-400 shrink-0">
                              {new Date(article.publishedAt).toLocaleDateString(
                                language === "en" ? "en-US" : "id-ID",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-lg sm:text-xl font-sans font-bold text-slate-900 group-hover:text-[#2C5098] transition-colors line-clamp-2 leading-snug tracking-tight">
                            {title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-sans">
                            {excerpt}
                          </p>
                        </div>

                        {/* Footer: Tags & Read CTA */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {article.tags.slice(0, 2).map((tag) => (
                              <Link
                                key={tag}
                                href={`/insights?search=${encodeURIComponent(tag)}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold text-[#2C5098] bg-blue-50/80 hover:bg-[#2C5098] hover:text-white border border-blue-200/70 hover:border-[#2C5098] transition-all cursor-pointer shadow-2xs group"
                              >
                                <span>{tag}</span>
                              </Link>
                            ))}
                          </div>

                          <div className="inline-flex items-center gap-2 group/btn shrink-0">
                            <span className="text-xs font-sans uppercase tracking-wider font-bold text-[#2C5098]">
                              {language === "en" ? "Read" : "Baca"}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#2C5098] text-slate-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:shadow-[#2C5098]/20 group-hover:translate-x-0.5">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Numbered Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 sm:pt-10 pb-4 border-t border-slate-200/80 mt-8">
              {/* Pagination Info */}
              <div className="text-xs font-sans text-slate-500">
                {language === "en"
                  ? `Showing ${(activePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(activePage * ITEMS_PER_PAGE, archiveArticles.length)} of ${archiveArticles.length} articles`
                  : `Menampilkan ${(activePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(activePage * ITEMS_PER_PAGE, archiveArticles.length)} dari ${archiveArticles.length} artikel`}
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-sans font-bold border transition-all ${
                    activePage === 1
                      ? "bg-slate-50 border-slate-200/60 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs cursor-pointer"
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === "en" ? "Prev" : "Sebelumnya"}</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === activePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-sans font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-md shadow-[#2C5098]/20 border border-transparent"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-sans font-bold border transition-all ${
                    activePage === totalPages
                      ? "bg-slate-50 border-slate-200/60 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs cursor-pointer"
                  }`}
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">{language === "en" ? "Next" : "Selanjutnya"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
