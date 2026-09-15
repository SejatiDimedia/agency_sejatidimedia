"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Home, Briefcase, BookOpen, ArrowRight, Compass } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-tr from-blue-500/10 via-[#2C5098]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-xl w-full text-center space-y-6 relative z-10"
      >
        {/* Big 404 Hero Display */}
        <div className="relative select-none">
          <h1 className="text-8xl sm:text-9xl md:text-[10.5rem] font-sans font-black tracking-tighter leading-none bg-gradient-to-b from-[#1E315B] via-[#2C5098] to-[#2C5098]/25 dark:from-white dark:via-slate-200 dark:to-slate-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-center rotate-6">
              <Compass className="w-8 h-8 sm:w-11 sm:h-11 text-[#2C5098] dark:text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          </div>
        </div>

        {/* Heading & Friendly Subtitle */}
        <div className="space-y-2.5 px-4">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
            {isEn ? "Page Not Found" : "Halaman Tidak Ditemukan"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
            {isEn
              ? "The link you followed may be broken, mistyped, or the page has been relocated."
              : "Alamat URL yang Anda tuju mungkin salah ketik, telah dipindahkan, atau tidak lagi tersedia."}
          </p>
        </div>

        {/* Primary Action Buttons (Single line labels) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white text-xs sm:text-sm font-sans font-bold shadow-md shadow-[#2C5098]/25 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{isEn ? "Back to Home" : "Kembali ke Beranda"}</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#2C5098] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-[#2C5098]/40 text-xs sm:text-sm font-sans font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Briefcase className="w-4 h-4 text-[#2C5098] dark:text-blue-400 shrink-0" />
            <span>{isEn ? "View Portfolio" : "Lihat Portofolio"}</span>
          </Link>

          <Link
            href="/insights"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#2C5098] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-[#2C5098]/40 text-xs sm:text-sm font-sans font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-[#2C5098] dark:text-blue-400 shrink-0" />
            <span>{isEn ? "Read Insights" : "Baca Insights"}</span>
          </Link>
        </div>

        {/* Quick Nav Chips */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 max-w-md mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: isEn ? "Services" : "Layanan", href: "/#capabilities-section" },
              { label: isEn ? "Methodology" : "Metodologi", href: "/#methodology-section" },
              { label: isEn ? "Pricing" : "Paket Biaya", href: "/#pricing-section" },
              { label: isEn ? "FAQ" : "Tanya Jawab", href: "/#faq-section" },
              { label: isEn ? "Contact" : "Kontak", href: "/#contact-section" },
            ].map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#2C5098] dark:hover:text-blue-300 border border-slate-200/70 dark:border-slate-700/60 transition-colors whitespace-nowrap"
              >
                <span>{chip.label}</span>
                <ArrowRight className="w-3 h-3 opacity-50 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
