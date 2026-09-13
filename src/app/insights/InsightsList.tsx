"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Calendar, ArrowRight, Tag, BookOpen } from "lucide-react";
import { InsightArticle } from "@/lib/api/insights";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InsightsListProps {
  articles: InsightArticle[];
  categories: string[];
}

export default function InsightsList({ articles, categories }: InsightsListProps) {
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

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Standard Section Header - Matching Beranda Section Style */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
        {/* Eyebrow / Section Label */}
        <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
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
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
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

      {/* 3. Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            {language === "en" ? "No articles found" : "Tidak ada artikel yang cocok"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {language === "en"
              ? "Try searching for a different keyword or category."
              : "Coba cari dengan kata kunci atau kategori yang berbeda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article, idx) => {
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
                  className="group flex flex-col h-full rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 shadow-xs hover:shadow-xl hover:shadow-[#2C5098]/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <Link href={`/insights/${article.slug}`} className="flex flex-col h-full">
                    {/* Cover Thumbnail Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                      <Image
                        src={article.coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-white/95 text-[#2C5098] border border-[#2C5098]/20 shadow-xs backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098]" />
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Meta: Read time & Date */}
                        <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {article.readTimeMinutes} {pageT.readTime}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(article.publishedAt).toLocaleDateString(
                              language === "en" ? "en-US" : "id-ID",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-sans font-bold text-slate-900 group-hover:text-[#2C5098] transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-sans">
                          {excerpt}
                        </p>
                      </div>

                      {/* Footer: Tags & Read more CTA */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/60"
                            >
                              <Tag className="w-2.5 h-2.5 opacity-60 text-slate-500" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#2C5098] group-hover:translate-x-1 transition-transform">
                          <span>{language === "en" ? "Read Article" : "Baca Artikel"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
