"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe, Layers } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function StatisWebView() {
  const { language } = useLanguage();

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
      </div>

      {/* Empty State */}
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
    </div>
  );
}
