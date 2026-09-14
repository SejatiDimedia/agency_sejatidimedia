"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { InsightSeriesDetail } from "@/lib/api/insights";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InsightSeriesDetailClientProps {
  series: InsightSeriesDetail;
}

export default function InsightSeriesDetailClient({ series }: InsightSeriesDetailClientProps) {
  const { language } = useLanguage();

  const title = language === "en" ? (series.titleEn || series.titleId) : series.titleId;
  const description = language === "en" ? (series.descriptionEn || series.descriptionId) : series.descriptionId;

  const firstArticle = series.articles.length > 0 ? series.articles[0] : null;

  const waConsultMessage = language === "en"
    ? `Hello Timur/SejatiDimedia, I am following your engineering series "${title}" and would like to discuss our software architecture needs.`
    : `Halo Mas Timur / SejatiDimedia, saya membaca seri artikel "${title}" dan tertarik berkonsultasi mengenai kebutuhan arsitektur sistem kami.`;

  const waConsultUrl = `https://wa.me/6289508436275?text=${encodeURIComponent(waConsultMessage)}`;

  return (
    <div className="min-h-screen pb-24 text-slate-900 font-sans selection:bg-[#2C5098]/15 selection:text-[#1E315B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* 1. Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-sans text-slate-500 mb-8">
          <Link href="/" className="hover:text-[#2C5098] transition-colors">
            {language === "en" ? "Home" : "Beranda"}
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/insights" className="hover:text-[#2C5098] transition-colors">
            Insights
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{language === "en" ? "Series" : "Seri"}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#2C5098] font-semibold">{series.category}</span>
        </nav>

        {/* 2. Series Header Showcase */}
        <header className="rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/50 border border-slate-200/90 p-6 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              {/* Eyebrow in Application's Signature Tracking & Accent */}
              <div className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-[#2C5098] font-bold">
                <span>{series.badge || (language === "en" ? "ENGINEERING PLAYBOOK SERIES" : "SERI REKAYASA & PLAYBOOK")}</span>
              </div>

              {/* Standardized Category & Parts Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098]" />
                  {series.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs">
                  <Layers className="w-3 h-3 text-[#2C5098]" />
                  {series.articles.length} {language === "en" ? "Curriculum Parts" : "Part Kurikulum"}
                </span>
              </div>

              {/* Series Title - Following App's Signature Font Family & Color Accents */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {(() => {
                  const words = title.trim().split(/\s+/);
                  if (words.length <= 1) {
                    return <span className="text-[#2C5098]">{title}</span>;
                  }
                  const splitIdx = words.length > 2 ? words.length - 2 : words.length - 1;
                  const firstPart = words.slice(0, splitIdx).join(" ");
                  const highlightPart = words.slice(splitIdx).join(" ");
                  return (
                    <>
                      <span>{firstPart} </span>
                      <span className="text-[#2C5098]">{highlightPart}</span>
                    </>
                  );
                })()}
              </h1>

              {/* Series Description */}
              <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
                {description}
              </p>

              {/* Metadata Statistics */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-sans text-slate-500 pt-3 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-slate-700">
                  <BookOpen className="w-4 h-4 text-[#2C5098]" />
                  {series.articles.length} {language === "en" ? "Articles in Curriculum" : "Artikel dalam Seri"}
                </span>
                {series.totalReadTimeMinutes > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {series.totalReadTimeMinutes} {language === "en" ? "min total learning" : "menit total belajar"}
                    </span>
                  </>
                )}
                {series.updatedAt && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {language === "en" ? "Updated" : "Diperbarui"}: {new Date(series.updatedAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              {firstArticle && (
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={`/insights/${firstArticle.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2C5098] hover:bg-[#1E315B] text-white font-sans font-bold text-sm shadow-md shadow-[#2C5098]/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{language === "en" ? "Start Reading Part 1" : "Mulai Baca Part 1"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Cover Graphic Col */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100">
                <Image
                  src={series.coverImage || "/images/insights/laravel_architecture_cover.jpg"}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* 3. Series Curriculum / Syllabus Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200/80">
            <div>
              <div className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-[#2C5098] font-bold mb-1">
                <span>{language === "en" ? "CURRICULUM SYLLABUS" : "SILABUS PEMBELAJARAN"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-sans font-extrabold tracking-tight text-slate-900 leading-tight">
                {language === "en" ? (
                  <>
                    <span>All Episodes in </span>
                    <span className="text-[#2C5098]">this Series</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Episode </span>
                    <span className="text-[#2C5098]">Lengkap</span>
                  </>
                )}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
              <BookOpen className="w-3 h-3 text-[#2C5098]" />
              {series.articles.length} {language === "en" ? "Parts" : "Part"}
            </span>
          </div>

          {/* List of Series Articles */}
          {series.articles.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {language === "en"
                  ? "Articles in this series are being finalized. Check back soon!"
                  : "Episode untuk seri ini sedang dalam tahap penulisan dan review teknis."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {series.articles.map((art) => {
                const artTitle = language === "en" ? (art.titleEn || art.titleId) : art.titleId;
                const artExcerpt = language === "en" ? (art.excerptEn || art.excerptId) : art.excerptId;

                return (
                  <Link
                    key={art.slug}
                    href={`/insights/${art.slug}`}
                    className="group block p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2C5098]/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#2C5098] border border-[#2C5098]/20 flex items-center justify-center font-sans font-bold text-sm shrink-0 group-hover:bg-[#2C5098] group-hover:text-white transition-colors">
                          {art.seriesPart}
                        </span>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-sans">
                            <span className="font-sans font-bold text-[#2C5098]">
                              Part {art.seriesPart}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {art.readTimeMinutes} {language === "en" ? "min read" : "menit baca"}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 group-hover:text-[#2C5098] transition-colors leading-snug">
                            {artTitle}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
                            {artExcerpt}
                          </p>
                        </div>
                      </div>

                      <div className="self-end sm:self-center shrink-0 flex items-center gap-1 text-xs font-sans font-bold text-[#2C5098] group-hover:underline">
                        <span>{language === "en" ? "Read Article" : "Baca Part"}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Lead Generation & Architecture Consultation CTA Card (Identical to InsightDetailClient) */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1E315B] via-[#2C5098] to-[#23385B] text-white shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white leading-snug">
              {language === "en"
                ? "Facing Architecture Bottlenecks or Building Mission-Critical Systems?"
                : "Punya Masalah Arsitektur atau Ingin Membangun Sistem yang Benar?"}
            </h3>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
              {language === "en"
                ? "We audit legacy codebases, eliminate performance bottlenecks, and engineer resilient enterprise software from day one."
                : "Kami siap membantu mengaudit kode, me-refactor arsitektur yang lemot, atau membangun aplikasi bisnis Anda dengan standar enterprise sejak awal."}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-start">
              <a
                href={waConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1E315B] hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{language === "en" ? "Free WhatsApp Consultation" : "Konsultasi Gratis via WhatsApp"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href="/#contact-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <span>{language === "en" ? "Calculate Project Estimate" : "Hitung Estimasi Proyek"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
