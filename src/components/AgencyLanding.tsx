"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../lib/api/glio-projects';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { TECH_ICONS } from '../lib/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';


const GlintStar = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none select-none ${className}`}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.3, 0.8],
      rotate: [0, 15, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {/* Center core glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-theme-accent/30 blur-[4px]" />
    {/* Horizontal ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-theme-accent-bright/90 to-transparent" />
    {/* Vertical ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent via-theme-accent-bright/90 to-transparent" />
  </motion.div>
);

const SERVICE_IMAGES = ['/service_web_app.jpg', '/service_mobile_app.jpg', '/service_saas_app.jpg'];

const sectionFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15
    }
  }
};

const TRUST_ICONS = [
  "ph:chats-teardrop-duotone",
  "ph:code-block-duotone",
  "ph:lifebuoy-duotone",
  "ph:arrows-clockwise-duotone",
  "ph:wallet-duotone",
  "ph:copyright-duotone"
];

const MILESTONE_ICONS = [
  "ph:magnifying-glass-duotone",
  "ph:pen-nib-duotone",
  "ph:code-duotone",
  "ph:bug-beetle-duotone",
  "ph:rocket-launch-duotone",
  "icons8:support"
];

export default function AgencyLanding({ copy, projects }: { copy?: any; projects?: Project[] }) {
  const { t, language } = useLanguage();

  {/* FEATURE_ITEMS removed to eliminate redundancy */ }

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Spotlight tracking state for the featured service banner
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Quick Estimate simple state
  const [quickService, setQuickService] = useState<'web' | 'mobile' | 'api'>('web');
  const [quickComplexity, setQuickComplexity] = useState<'standard' | 'complex'>('standard');
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(0);

  // FAQ interactive states
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First item expanded by default
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Interactive plan selector and scroll helper
  const selectPlan = (serviceId: string, scopeId: string) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId,
      scope: scopeId
    }));
    scrollToId('contact-section');
  };

  const MILESTONES = [
    {
      step: '01',
      title: 'Discovery',
      tag: 'Fase 1: Analisis & Kebutuhan',
      description: 'Memahami kebutuhan bisnis, target pengguna, dan tujuan proyek Anda secara mendalam sebelum menulis satu baris kode pun.',
      deliverables: ['Dokumen Spesifikasi Teknis', 'Skema Logika Bisnis', 'Estimasi Timeline & Biaya'],
      codePreview: `{\n  "tahap": "DISCOVERY",\n  "status": "SELESAI",\n  "tujuan": ["KONSULTASI_BISNIS", "PEMETAAN_ALUR"],\n  "parameter": "DITETAPKAN"\n}`
    },
    {
      step: '02',
      title: 'Design',
      tag: 'Fase 2: Arsitektur UI/UX',
      description: 'Merancang rancangan UI/UX dan memetakan arsitektur sistem (database & API) agar alur navigasi produk terasa natural dan performa terjamin.',
      deliverables: ['Desain Figma Interaktif', 'Skema Struktur Database', 'Peta Alur Kerja Data'],
      codePreview: `{\n  "tahap": "DESIGN",\n  "arsitektur": {\n    "desain": "Figma Wireframes",\n    "database": "PostgreSQL relational",\n    "skema": "Drizzle Schema"\n  }\n}`
    },
    {
      step: '03',
      title: 'Development',
      tag: 'Fase 3: Pemrograman Kustom',
      description: 'Membangun produk menggunakan kode yang bersih, terstruktur, aman, dan mudah dikembangkan lebih lanjut. Menghindari template drag-and-drop.',
      deliverables: ['Kode Sumber Terstruktur', 'Sistem Autentikasi Keamanan', 'Integrasi Layanan Pihak Ketiga'],
      codePreview: `const Project = () => {\n  return (\n    <ProductionApp cleanCode={true}>\n      <CustomLogic engine="NextJS_15" />\n    </ProductionApp>\n  );\n}`
    },
    {
      step: '04',
      title: 'Testing & Iterasi',
      tag: 'Fase 4: Uji Coba & Perbaikan',
      description: 'Melakukan pengujian menyeluruh di berbagai perangkat dan skenario penggunaan sebelum produk dirilis, termasuk revisi berdasarkan feedback Anda.',
      deliverables: ['Laporan Pengujian Bug', 'Optimasi Kecepatan (Lighthouse)', 'Revisi Sesuai Feedback'],
      codePreview: `describe("Uji Performa", () => {\n  it("load time di bawah 1.5 detik", () => {\n    expect(pageLoadTime).toBeLessThan(1500);\n  });\n});`
    },
    {
      step: '05',
      title: 'Deployment',
      tag: 'Fase 5: Peluncuran Sistem',
      description: 'Meluncurkan produk digital Anda ke server produksi yang aman dan terkonfigurasi dengan baik (seperti Vercel, AWS, atau VPS Cloud).',
      deliverables: ['Aplikasi Live di Produksi', 'Konfigurasi Domain & SSL', 'Backup Database Awal'],
      codePreview: `npm run build\n# Server Produksi Terbuka...\n# Domain terhubung dengan sertifikat SSL aktif.\n# Aplikasi live dan siap diakses publik.`
    },
    {
      step: '06',
      title: 'Maintenance & Support',
      tag: 'Fase 6: Pendampingan & Pemeliharaan',
      description: 'Memberikan pendampingan berkelanjutan pasca-peluncuran berupa pemeliharaan server, perbaikan bug jika ada, dan pembaruan sistem berkala.',
      deliverables: ['Pemantauan Server Rutin', 'Pembaruan Patch Keamanan', 'Bantuan Teknis Berkala'],
      codePreview: `{\n  "tahap": "MAINTENANCE",\n  "status": "AKTIF",\n  "kondisiServer": "100%_AKTIF",\n  "keamanan": "TERBARU"\n}`
    }
  ];

  // Contact form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Web App',
    scope: 'medium',
    details: '',
    honeypot: '',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting || !formData.name || !formData.email) return;
    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          scale: formData.scope || 'medium',
          message: formData.details || `Inquiry layanan ${formData.service} dari ${formData.name}`,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan');
      }

      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        service: 'Full-Stack Web App',
        scope: 'medium',
        details: '',
        honeypot: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat mengantarkan pesan.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getQuickPrice = () => {
    let base = quickService === 'web' ? 4500 : quickService === 'mobile' ? 6000 : 3200;
    if (quickComplexity === 'complex') base *= 1.8;
    return base.toLocaleString();
  };

  function AnimatedCounter({ from = 0, to, duration = 2, suffix = '' }: { from?: number; to: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(from);

    useEffect(() => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easedProgress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [from, to, duration]);

    return <span>{count}{suffix}</span>;
  }

  return (
    <div className="space-y-24">
      {/* SECTION 1: HERO (SIMPLE TEXT-CENTERED LAYOUT) */}
      <section id="hero-section" className="relative py-8 md:py-16 min-h-[70vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 overflow-visible z-0">

        {/* Animated Background Orb */}
        <motion.div
          className="absolute top-[20%] left-[20%] w-72 h-72 sm:w-96 sm:h-96 bg-theme-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none"
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 30, -30, 0],
            scale: [1, 1.2, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-64 h-64 sm:w-80 sm:h-80 bg-[#1D4ED8]/15 rounded-full blur-[100px] -z-10 pointer-events-none"
          animate={{
            x: [0, -50, 0, 50, 0],
            y: [0, 40, -40, 40, 0],
            scale: [1, 1.1, 0.8, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Cinematic Glint Star lens-flares from reference image */}
        <GlintStar className="top-[10%] left-[2%] opacity-60 scale-125 select-none" delay={0} />
        <GlintStar className="bottom-[22%] right-[12%] opacity-50 scale-150 select-none" delay={1.5} />
        <GlintStar className="top-[45%] left-[45%] opacity-35 scale-90 select-none" delay={3} />

        {/* a) Social Proof Row (Above headline, centered) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-theme-surface/60 border border-theme-border/60 shadow-sm backdrop-blur-md"
        >
          {/* 5 Yellow/Gold Stars */}
          <div className="flex items-center gap-0.5 text-amber-400">
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-theme-fore-muted">
            {t.hero.socialProof || "5 Tahun Pengalaman · 32 Proyek Diselesaikan"}
          </span>
        </motion.div>

        {/* b) Headline (Large, bold, centered) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[38px] sm:text-5xl md:text-6xl lg:text-6.5xl font-display font-bold tracking-tight leading-[1.08] text-theme-fore">
            {t.hero.title}{' '}
            <span className="text-theme-accent inline-block">
              {t.hero.titleHighlight}
            </span>.
          </h1>
        </motion.div>

        {/* c) Subheadline (Centered, smaller, muted text) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-sm sm:text-base text-theme-fore-muted leading-relaxed font-sans">
            {t.hero.subtitle}
          </p>
        </motion.div>

        {/* d) CTA Row (Two buttons side-by-side, centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
        >
          <button
            onClick={() => scrollToId('contact-section')}
            className="relative w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-xl shadow-theme-accent/25 hover:shadow-theme-accent/35 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            id="hero-btn-book-call"
          >
            <span>{t.hero.btnPrimary}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToId('projects-section')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold border border-theme-border hover:border-theme-accent text-theme-fore hover:bg-theme-surface/50 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            id="hero-btn-view-projects"
          >
            <span>{t.hero.btnSecondary}</span>
          </button>
        </motion.div>

      </section>
      {/* SECTION 2: CLIENT PORTAL & TRANSPARANSI (CENTERED FEATURE SHOWCASE LAYOUT) */}
      <motion.section
        id="client-portal-section"
        className="space-y-10 pt-4 pb-12 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        {/* 1. Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
            <span>{t.clientPortal?.eyebrow || "FITUR UNGGULAN"}</span>
          </div>

          <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore">
            {t.clientPortal?.title || "Pantau Progress Proyek Anda, Kapan Saja"}
          </h2>

          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed font-sans max-w-2xl mx-auto">
            {t.clientPortal?.subtitle || "Setiap klien mendapat akses ke portal khusus untuk memantau progress pengerjaan, milestone, hingga invoice — tanpa perlu menunggu update manual atau bertanya 'sampai mana progressnya?'"}
          </p>
        </div>

        {/* 2. Main Dashboard Mockup Showcase (Clean Level Showcase Window) */}
        <div className="relative flex justify-center items-center py-4">
          {/* Ambient Background Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Floating Micro Badge #1 (Top Right Live Badge) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3 right-2 sm:right-8 z-30 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-500/40 shadow-xl backdrop-blur-2xl flex items-center gap-2.5 pointer-events-none"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Icon icon="ph:clock-clockwise-bold" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-none">24/7 Live Tracking & Milestones</p>
              <p className="text-[8px] font-medium text-blue-600 dark:text-blue-300 mt-0.5 hidden sm:block">Real-Time Development Status</p>
            </div>
          </motion.div>

          {/* Clean Level Client Portal Window */}
          <div className="w-full max-w-[640px] p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl space-y-3 sm:space-y-4 relative group overflow-hidden z-20 hover:border-blue-500/60 transition-all duration-300">
            {/* Laser Moving Shimmer Accent */}
            <motion.div
              className="absolute top-0 left-0 h-[2px] w-44 bg-gradient-to-r from-transparent via-blue-500 dark:via-cyan-400 to-transparent z-30"
              animate={{ x: ['-100%', '350%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />

            {/* macOS Browser Header Bar */}
            <div className="space-y-2.5 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5 sm:pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-2.5 sm:px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60 ml-1 sm:ml-2">
                    <img src="/logo.svg" alt="SejatiDimedia Logo" className="h-3.5 sm:h-4 w-auto object-contain" />
                    <span className="text-[9px] sm:text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate max-w-[180px] sm:max-w-none">
                      <Icon icon="ph:lock-key-duotone" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      sejatidimedia.id/portal/projects
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Tab Pills */}
              <div className="flex items-center justify-between gap-2 pt-0.5 sm:pt-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-400/30 dark:border-blue-400/40 flex items-center gap-1">
                    <Icon icon="ph:squares-four-duotone" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />
                    Dashboard
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <Icon icon="ph:folder-duotone" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Deliverables
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                    <Icon icon="ph:receipt-duotone" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Invoices
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Active Project Progress & Milestone Tasks Section */}
            <div className="space-y-2.5 sm:space-y-3 bg-slate-50/80 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/60 relative overflow-hidden text-left shadow-inner">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon icon="ph:kanban-duotone" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {t.clientPortal?.mockupTitle || "Dashboard Klien — Proyek Aktif"}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-medium">Client: Timur Dian • Live Status</p>
                  </div>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-400/30 shrink-0 shadow-sm"
                >
                  88% Completed
                </motion.span>
              </div>

              {/* Milestone Task Checklist Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9px] font-extrabold pt-0.5">
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <Icon icon="ph:check-circle-fill" className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Phase 1-3: UI/UX & DB Architecture</span>
                </div>
                <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-1.5 rounded-lg border border-blue-200 dark:border-blue-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse shrink-0" />
                  <span>Phase 4: QA & Production Release</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-200/80 dark:bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full"
                  animate={{ width: ['70%', '88%', '70%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* 2. Invoice & Financial Settlement Row */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-500/30 dark:border-blue-500/40 space-y-2 sm:space-y-2.5 relative text-left shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-1.5 sm:pb-2">
                <span className="text-[9px] sm:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <Icon icon="ph:receipt-duotone" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  Project Billing & Invoices
                </span>
                <motion.span
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-400/30 flex items-center gap-1 shadow-sm"
                >
                  <Icon icon="ph:check-circle-fill" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />
                  100% Settled
                </motion.span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                <div className="bg-white dark:bg-slate-900/90 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                  <p className="text-[7px] sm:text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase">Total Billed</p>
                  <p className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">Rp 37.2M</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-500/40 relative overflow-hidden shadow-sm">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-500/10 pointer-events-none"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <p className="text-[7px] sm:text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Amount Paid</p>
                  <p className="text-[11px] sm:text-sm font-black text-blue-700 dark:text-blue-300 mt-0.5">Rp 37.2M</p>
                </div>
                <div className="bg-white dark:bg-slate-900/90 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                  <p className="text-[7px] sm:text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase">Balance Due</p>
                  <p className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">Rp 0</p>
                </div>
              </div>
            </div>

            {/* 3. Real-Time Activity Feed & Digital Signature Download Bar */}
            <div className="bg-slate-100/80 dark:bg-slate-800/40 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-0 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon icon="ph:seal-check-duotone" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>INV-202607-001: <strong className="text-slate-900 dark:text-white">Draft</strong></span>
              </div>
              <button className="px-2 sm:px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-700 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 dark:text-blue-300 border border-blue-400/30 dark:border-blue-400/40 text-[8px] sm:text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer">
                <Icon icon="ph:download-simple-bold" className="w-3 h-3" />
                PDF Invoice
              </button>
            </div>
          </div>
        </div>

        {/* 3. Horizontal Connected Stepper Pipeline (01, 02, 03) */}
        <div className="relative pt-6 pb-2 text-left max-w-5xl mx-auto">
          {/* Glowing Laser Connector Rail Line (Desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full z-0 overflow-hidden" />
          <motion.div
            className="hidden md:block absolute top-[52px] left-[16%] right-[50%] h-[3px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full z-0 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Step 01 */}
            <div className="group/step p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-lg hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
              {/* Stepper Node Header Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-mono font-black text-sm flex items-center justify-center border-2 border-blue-500/40 shrink-0 shadow-md group-hover/step:border-blue-500 group-hover/step:scale-105 transition-all">
                    01
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:chart-line-up-duotone" className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 pt-3">
                <h3 className="text-sm sm:text-base font-bold text-theme-fore group-hover/step:text-blue-600 dark:group-hover/step:text-blue-400 transition-colors">
                  {t.clientPortal?.point1Title || "Progress Real-Time"}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed font-sans">
                  {t.clientPortal?.point1Desc || "Lihat status setiap fase pengerjaan — dari planning, development, hingga testing."}
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="group/step p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-lg hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
              {/* Stepper Node Header Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-mono font-black text-sm flex items-center justify-center border-2 border-blue-500/40 shrink-0 shadow-md group-hover/step:border-blue-500 group-hover/step:scale-105 transition-all">
                    02
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:receipt-duotone" className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 pt-3">
                <h3 className="text-sm sm:text-base font-bold text-theme-fore group-hover/step:text-blue-600 dark:group-hover/step:text-blue-400 transition-colors">
                  {t.clientPortal?.point2Title || "Invoice & Pembayaran Transparan"}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed font-sans">
                  {t.clientPortal?.point2Desc || "Riwayat billing dan status pembayaran tercatat jelas, tidak ada biaya tersembunyi."}
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="group/step p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-lg hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
              {/* Stepper Node Header Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-mono font-black text-sm flex items-center justify-center border-2 border-blue-500/40 shrink-0 shadow-md group-hover/step:border-blue-500 group-hover/step:scale-105 transition-all">
                    03
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:bell-simple-ringing-duotone" className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 pt-3">
                <h3 className="text-sm sm:text-base font-bold text-theme-fore group-hover/step:text-blue-600 dark:group-hover/step:text-blue-400 transition-colors">
                  {t.clientPortal?.point3Title || "Update Tanpa Perlu Bertanya"}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed font-sans">
                  {t.clientPortal?.point3Desc || "Setiap milestone selesai, Anda mendapat notifikasi — bukan Anda yang harus mengejar update."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION: TENTANG SAYA (FROM FACTORY FLOOR TO LINES OF CODE) */}
      <motion.section
        id="about-section"
        className="space-y-8 pt-4 pb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto rounded-3xl bg-theme-elevated/70 border border-theme-border/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Ambient Glow Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
            {/* Left Column: Copy & Story (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
                <span>{t.about?.eyebrow || "TENTANG SAYA"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore">
                {t.about?.title || "Dari Lantai Produksi ke Baris Kode"}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-theme-fore-muted leading-relaxed font-sans">
                <p>{t.about?.p1}</p>
                <p>{t.about?.p2}</p>
                {t.about?.p3 && <p>{t.about?.p3}</p>}
              </div>
            </div>

            {/* Right Column: Visual Accent Card / Illustration (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/80 p-6 shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:factory-duotone" className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-theme-fore">
                      {t.about?.card1Title || "5+ Tahun Pengalaman Manufaktur"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-theme-fore-muted">
                      {t.about?.card1Desc || "ERP, Production, Inventory & Operational Workflow"}
                    </p>
                  </div>
                </div>
                <div className="h-[1px] bg-theme-border/60" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:cpu-duotone" className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-theme-fore">
                      {t.about?.card2Title || "Sistem Digital Terintegrasi"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-theme-fore-muted">
                      {t.about?.card2Desc || "Bukan sekadar website, tapi sistem operasional nyata"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2: THREE CORE PILOT SERVICES (MODERNIZED & PLACED IMMEDIATELY AFTER HERO) */}
      <motion.section
        id="capabilities-section"
        className="space-y-12 pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
            <span>{t.nav.services}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore">
            {t.nav.services}{' '}
            <span className="text-theme-accent">
              {t.services.mainHeadingHighlight}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-2xl mx-auto">
            {t.services.desc}
          </p>
        </div>

        {/* Reference Image Style Accordion Services List */}
        <div className="max-w-5xl mx-auto space-y-4 pt-4">
          {(t.services.items || []).map((item: any, idx: number) => {
            const isOpen = openServiceIndex === idx;
            const itemNum = `(${String(idx + 1).padStart(2, '0')})`;
            const imageSrc = SERVICE_IMAGES[idx] || '/service_web_app.jpg';

            return (
              <motion.div
                key={idx}
                layout
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setOpenServiceIndex(idx)}
                className={`rounded-3xl transition-all duration-300 overflow-hidden ${isOpen
                  ? 'bg-white/95 dark:bg-slate-900/95 border border-blue-500/30 dark:border-blue-500/40 shadow-[0_20px_50px_rgba(43,84,149,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl p-6 sm:p-8 text-slate-900 dark:text-white relative'
                  : 'bg-white/70 dark:bg-theme-elevated/70 border border-slate-200/80 dark:border-theme-border/80 hover:border-blue-500/40 p-5 sm:p-7 cursor-pointer group hover:bg-white dark:hover:bg-theme-elevated shadow-sm hover:shadow-md'
                  }`}
              >
                {isOpen ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Left: Number & Title (4 cols) */}
                      <div className="lg:col-span-4 space-y-3 text-left">
                        <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                          {itemNum}
                        </span>
                        <h3 className="text-2xl sm:text-3.5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Center: High-End UI Mockup Image (5 cols) */}
                      <div className="lg:col-span-5 relative group/img overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xl bg-slate-950">
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="w-full h-44 sm:h-52 object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 dark:from-slate-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>

                      {/* Right: Description & CTA Button (3 cols) */}
                      <div className="lg:col-span-3 space-y-4 text-left flex flex-col justify-between h-full">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToId('contact-section');
                            }}
                            className="px-5 py-2.5 rounded-full bg-theme-accent hover:bg-theme-accent-bright text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-theme-accent/25 hover:shadow-theme-accent/40 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                          >
                            <span>{language === 'en' ? 'Contact Us' : 'Hubungi Kami'}</span>
                            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Top Right Collapse Minus Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenServiceIndex(null);
                      }}
                      className="absolute top-6 right-6 w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-blue-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm"
                      title="Collapse"
                    >
                      <Icon icon="ph:minus-bold" className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 text-left">
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-400 dark:text-theme-fore-subtle">
                        {itemNum}
                      </span>
                      <h3 className="text-xl sm:text-2.5xl font-display font-bold text-slate-800 dark:text-theme-fore group-hover:text-blue-600 dark:group-hover:text-theme-accent transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-theme-border flex items-center justify-center text-blue-600 dark:text-theme-accent bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shrink-0 shadow-sm">
                      <Icon icon="ph:plus-bold" className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* SECTION 9: TECHNOLOGY (REVISED TO CATEGORIES) */}
      <motion.section
        id="technology-section"
        className="space-y-12 pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="space-y-4">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
            <span>Teknologi</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore text-left">
                {t.tech.mainHeading}{' '}
                <span className="text-theme-accent">
                  {t.tech.mainHeadingHighlight}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed text-left">
                {t.tech.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Category Cards Grid - Modern Bento Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Frontend - Wide Card */}
          <motion.div
            className="group md:col-span-2 p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-theme-accent-glow/20 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/40 transition-colors duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                <Icon icon="ph:layout-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Frontend</h3>
                <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed">{t.tech.frontendDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                  <span>{tech}</span>
                </div>))}
            </div>
          </motion.div>

          {/* Backend - Square Card */}
          <motion.div
            className="group p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-theme-accent-glow/20 rounded-full blur-2xl pointer-events-none group-hover:bg-theme-accent-glow/40 transition-colors duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                <Icon icon="ph:hard-drives-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.backend}</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.backendDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["Laravel", "Node.js", "Golang", "Python", "Express", "GraphQL"].map((tech) => (
                <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                  <span>{tech}</span>
                </div>))}
            </div>
          </motion.div>

          {/* Database - Square Card */}
          <motion.div
            className="group p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/10 rounded-full blur-2xl pointer-events-none group-hover:bg-theme-accent-glow/30 transition-colors duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                <Icon icon="ph:database-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.database}</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.databaseDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                  <span>{tech}</span>
                </div>))}
            </div>
          </motion.div>

          {/* Mobile - Square Card */}
          <motion.div
            className="group p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute top-1/2 right-1/2 w-32 h-32 bg-theme-accent-glow/10 rounded-full blur-2xl pointer-events-none group-hover:bg-theme-accent-glow/30 transition-colors duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                <Icon icon="ph:device-mobile-speaker-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.mobile}</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.mobileDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["React Native", "Flutter"].map((tech) => (
                <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                  <span>{tech}</span>
                </div>))}
            </div>
          </motion.div>

          {/* Infrastructure - Square Card */}
          <motion.div
            className="group p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-theme-accent-glow/10 rounded-full blur-2xl pointer-events-none group-hover:bg-theme-accent-glow/30 transition-colors duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                <Icon icon="ph:cloud-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.infra}</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.infraDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["Docker", "AWS", "Google Cloud", "Firebase"].map((tech) => (
                <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                  <span>{tech}</span>
                </div>))}
            </div>
          </motion.div>

          {/* Integrasi - Super Wide Card */}
          <motion.div
            className="group md:col-span-2 lg:col-span-3 p-6 md:p-8 rounded-3xl bg-theme-elevated/60 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            variants={cardSlideUp}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-theme-accent-glow/5 via-transparent to-theme-accent-glow/5 pointer-events-none group-hover:from-theme-accent-glow/10 group-hover:to-theme-accent-glow/10 transition-colors duration-500" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="space-y-4 max-w-lg">
                <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent shadow-sm group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300">
                  <Icon icon="ph:share-network-duotone" className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.integrationTitle}</h3>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.integrationDesc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-start md:justify-end flex-grow w-full md:max-w-md">
                {["Rest API", "Payment Integration", "Cloud Storage", "OAuth Providers"].map((tech) => (
                  <div key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-black dark:text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent dark:hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default flex items-center gap-1.5 group/tech shadow-sm">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                    <span>{tech}</span>
                  </div>))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>



      {/* SECTION 4.25: FEATURED PROJECTS SHOWCASE */}
      <motion.section
        id="projects-section"
        className="space-y-12 pt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
              <span>{t.nav.portfolio}</span>
            </div>
            <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.15] text-theme-fore max-w-2xl text-left">
              {t.portfolio.mainHeading}{' '}
              <span className="text-theme-accent">
                {t.portfolio.mainHeadingHighlight}
              </span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-theme-surface border border-theme-border/80 hover:border-theme-accent text-xs font-sans font-bold text-theme-fore cursor-pointer transition-all duration-300"
          >
            <span>{t.portfolio.viewAll}</span>
            <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects && projects.length > 0 ? (
            projects.slice(0, 6).map((project) => {
              const isDummy = !project.thumbnail ||
                project.thumbnail.trim() === "" ||
                project.thumbnail === "/thumbnail.png" ||
                project.thumbnail === "/placeholder.png";
              const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

              return (
                <motion.div
                  key={project.slug}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-theme-elevated border border-theme-border hover:border-theme-border-accent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  variants={cardSlideUp}
                >
                  <div className="space-y-4">
                    {/* Thumbnail Container */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-theme-surface border border-theme-border/40">
                      <Image
                        src={displayThumbnail}
                        alt={project.name}
                        fill
                        className={isDummy ? "object-contain p-8 bg-theme-surface/40" : "object-cover group-hover:scale-[1.03] transition-transform duration-500"}
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Info Block */}
                    <div className="space-y-2 text-left">
                      <h3 className="text-sm sm:text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-theme-fore-muted leading-relaxed line-clamp-3">
                        {language === 'en'
                          ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                          : (project.summaryId || project.descriptionId || project.summary || project.description)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-theme-border/30 mt-4">
                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1 text-left">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <div key={tech} className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-theme-surface text-black dark:text-theme-fore-muted border border-theme-border/40 flex items-center gap-1 group/tech shadow-sm">
                          <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 grayscale opacity-70 group-hover/tech:grayscale-0 group-hover/tech:opacity-100 transition-all duration-300" />
                          <span>{tech}</span>
                        </div>))}
                    </div>

                    {/* Explore button */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white text-xs font-sans font-bold text-theme-fore transition-all duration-300 border border-theme-border/80 hover:border-theme-accent"
                    >
                      <span>{t.portfolio.viewProject}</span>
                      <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 p-12 text-center rounded-2xl bg-theme-elevated border border-theme-border">
              <span className="text-xs font-mono text-theme-fore-muted">No projects found.</span>
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* SECTION 3.5: FLEXIBLE PRICING PLANS */}
      <motion.section
        id="pricing-section"
        className="space-y-16 pt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold text-center">
            <span>{t.pricing.label}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore text-center">
            {t.pricing.badge}
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-2xl mx-auto text-center">
            {t.pricing.desc}
          </p>
        </div>

        {/* 3-Column Beautiful Pricing Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto pt-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >

          {/* Card 1: Starter - MVP Prototype */}
          <motion.div
            className="p-8 rounded-[2rem] bg-white shadow-xl dark:shadow-none dark:bg-theme-surface/40 backdrop-blur-xl border border-theme-border/80 dark:border-white/15 hover:border-theme-accent/50 hover:bg-gray-50 dark:hover:bg-theme-surface/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between space-y-8 relative group text-left"
            variants={cardSlideUp}
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold group-hover:text-theme-fore transition-colors">{t.pricingCards.starterTag}</span>
                  <h3 className="text-xl font-sans font-extrabold text-theme-fore">{t.pricingCards.starterTitle}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-theme-elevated border border-theme-border flex items-center justify-center text-theme-fore-muted group-hover:text-theme-accent group-hover:border-theme-accent/30 transition-all duration-300 shadow-sm">
                  <Icon icon="ph:trophy-duotone" className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                {t.pricingCards.starterDesc}
              </p>
              <div className="flex items-baseline gap-1.5 pt-2">
                <span className="text-3xl sm:text-4xl font-sans font-black text-theme-fore tracking-tighter">Rp 3–7 Jt</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ proyek</span>
              </div>
              <button
                onClick={() => selectPlan('Full-Stack Web App', 'SaaS MVP (Fast Turnaround)')}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-theme-border bg-theme-surface hover:border-theme-accent hover:bg-theme-accent hover:text-white text-theme-fore transition-all duration-300 cursor-pointer text-center select-none shadow-sm"
              >
                {t.pricing.starterBtn || "Mulai dari Sini"}
              </button>
            </div>
            <div className="space-y-4 pt-6 border-t border-theme-border/50 relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-widest text-theme-fore-subtle block font-bold">Termasuk:</span>
              <ul className="space-y-3 text-xs">
                {t.pricingCards.starterIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-theme-fore-muted group/item hover:text-theme-fore transition-colors">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-theme-accent/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-theme-accent group-hover/item:text-white transition-colors text-theme-accent">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Growth - Production Ready (Most Popular) */}
          <motion.div
            className="p-8 md:p-9 rounded-[2.5rem] bg-gradient-to-b from-theme-surface to-theme-base text-theme-fore border-2 border-theme-accent/70 dark:border-theme-accent hover:border-theme-accent hover:shadow-[0_0_60px_-15px_rgba(74,133,217,0.4)] transition-all duration-500 flex flex-col justify-between space-y-8 relative lg:-mt-4 lg:mb-4 z-20 overflow-hidden text-left group shadow-2xl shadow-theme-accent/15 dark:shadow-theme-accent/20"
            variants={cardSlideUp}
          >
            {/* Premium Glow Overlay (Dark Mode Only) */}
            <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,rgba(74,133,217,0.25),transparent_70%)] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
            <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-theme-accent to-transparent opacity-100 dark:opacity-80" />

            <div className="absolute top-0 right-0 bg-gradient-to-r from-theme-accent via-theme-accent-bright to-theme-accent text-theme-base text-[9px] font-mono font-bold px-5 py-2 rounded-bl-2xl rounded-tr-[2.5rem] uppercase tracking-widest shadow-lg shadow-theme-accent/30 flex items-center gap-1.5">
              <Icon icon="ph:crown-duotone" className="w-3 h-3" />
              {language === 'en' ? 'Most Popular' : 'Paling Populer'}
            </div>

            <div className="space-y-6 relative z-10 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">{t.pricingCards.growthTag}</span>
                  <h3 className="text-xl font-sans font-extrabold text-theme-fore">{t.pricingCards.growthTitle}</h3>
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted dark:text-blue-100/80 leading-relaxed">
                {t.pricingCards.growthDesc}
              </p>
              <div className="flex items-baseline gap-1.5 pt-2">
                <span className="text-3xl sm:text-4xl font-sans font-black text-theme-fore tracking-tighter">Rp 10 Jt+</span>
                <span className="text-[10px] font-mono text-theme-fore-subtle dark:text-blue-200/50 uppercase">/ proyek</span>
              </div>
              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-theme-accent text-theme-base hover:bg-theme-accent-bright dark:bg-white dark:text-[#0A0C10] dark:hover:bg-theme-accent dark:hover:text-white shadow-lg shadow-theme-accent/20 hover:shadow-[0_0_20px_rgba(74,133,217,0.4)] transition-all duration-300 cursor-pointer text-center select-none"
              >
                {t.pricing.growthBtn || "Diskusikan Proyek Anda"}
              </button>
            </div>
            <div className="space-y-4 pt-6 border-t border-theme-border/50 dark:border-white/10 relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-widest text-theme-fore-subtle dark:text-blue-200/50 block font-bold">Termasuk:</span>
              <ul className="space-y-3 text-xs">
                {t.pricingCards.growthIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-theme-fore-muted dark:text-blue-50/80 group/item hover:text-theme-fore dark:hover:text-white transition-colors">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-theme-accent flex items-center justify-center flex-shrink-0 text-white shadow-sm shadow-theme-accent/50">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Custom - Sistem Kompleks */}
          <motion.div
            className="p-8 rounded-[2rem] bg-white shadow-xl dark:shadow-none dark:bg-theme-surface/40 backdrop-blur-xl border border-theme-border/80 dark:border-white/15 hover:border-theme-accent/50 hover:bg-gray-50 dark:hover:bg-theme-surface/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between space-y-8 relative group text-left"
            variants={cardSlideUp}
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold group-hover:text-theme-fore transition-colors">{t.pricingCards.customTag}</span>
                  <h3 className="text-xl font-sans font-extrabold text-theme-fore">{t.pricingCards.customTitle}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-theme-elevated border border-theme-border flex items-center justify-center text-theme-fore-muted group-hover:text-theme-accent group-hover:border-theme-accent/30 transition-all duration-300 shadow-sm">
                  <Icon icon="hugeicons:customize" className="w-4.5 h-4.5" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                {t.pricingCards.customDesc}
              </p>
              <div className="flex items-baseline gap-1.5 pt-2">
                <span className="text-3xl sm:text-4xl font-sans font-black text-theme-fore tracking-tighter">Custom</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ Scope</span>
              </div>
              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-theme-border bg-theme-surface hover:border-theme-accent hover:bg-theme-accent hover:text-white text-theme-fore transition-all duration-300 cursor-pointer text-center select-none shadow-sm"
              >
                {t.pricing.customBtn || "Ceritakan Kebutuhan Anda"}
              </button>
            </div>
            <div className="space-y-4 pt-6 border-t border-theme-border/50 relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-widest text-theme-fore-subtle block font-bold">Termasuk:</span>
              <ul className="space-y-3 text-xs">
                {t.pricingCards.customIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-theme-fore-muted group/item hover:text-theme-fore transition-colors">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-theme-accent/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-theme-accent group-hover/item:text-white transition-colors text-theme-accent">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </motion.div>
      </motion.section>

      {/* SECTION 4.5: KENAPA KLIEN PERCAYA BEKERJA SAMA DENGAN SAYA */}
      <motion.section
        id="features-section"
        className="space-y-12 pt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="space-y-4">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
            <span>{t.trust?.badge || "Kenapa Klien Percaya"}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.15] text-theme-fore max-w-3xl text-left">
            {t.trust?.mainHeading || "Kenapa Klien Percaya"}{' '}
            <span className="text-theme-accent">
              {t.trust?.mainHeadingHighlight || "Bekerja Sama Dengan Saya"}
            </span>
          </h2>
        </div>

        {/* 2-Column Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {(t.trust?.items || []).map((item: any, idx: number) => (
            <motion.div
              key={idx}
              className="p-6 rounded-2xl bg-theme-elevated border border-theme-border flex flex-col sm:flex-row gap-5 items-start group hover:border-theme-border-accent hover:shadow-xl transition-all duration-300 text-left"
              variants={cardSlideUp}
            >
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-theme-accent/5 flex items-center justify-center border border-theme-accent/20 group-hover:scale-110 group-hover:bg-theme-accent/10 transition-all duration-300">
                <Icon icon={TRUST_ICONS[idx]} className="w-6 sm:w-7 h-6 sm:h-7 text-theme-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      {/* SECTION 4: THE PROCESSES LOOP (FROM UPLOADED REFERENCE) */}
      <motion.section
        id="methodology-section"
        className="space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="space-y-4">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
            <span>{t.process.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.15] text-theme-fore max-w-2xl">
            {t.process.mainHeading}
          </h2>
        </div>

        {/* Dynamic Split Layout matching reference block 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Clean vertical list with line delimiters (5 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            {MILESTONES.map((milestone, idx) => {
              const isActive = activeMilestone === idx;
              return (
                <button
                  key={milestone.step}
                  onClick={() => setActiveMilestone(idx)}
                  className={`w-full py-4 text-left cursor-pointer border-b border-theme-border/60 transition-all duration-300 flex items-center justify-between group ${isActive ? 'border-theme-accent' : 'hover:border-theme-border-hover'
                    }`}
                  id={`processes-step-${milestone.step}`}
                >
                  <span className={`text-base font-sans font-bold transition-all duration-300 ${isActive
                    ? 'text-theme-accent translate-x-1.5'
                    : 'text-theme-fore/60 group-hover:text-theme-fore group-hover:translate-x-1'
                    }`}>
                    {t.milestones[idx].title}
                  </span>
                  <span className={`text-xs font-mono font-bold transition-colors flex items-center gap-2 ${isActive ? 'text-theme-accent' : 'text-theme-fore-subtle group-hover:text-theme-fore'
                    }`}>
                    <Icon icon={MILESTONE_ICONS[idx]} className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Giant display digits details (6 cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-theme-accent-glow rounded-full blur-3xl pointer-events-none opacity-40" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex-grow flex flex-col justify-between relative z-10"
              >
                <div className="space-y-6">
                  {/* Giant floating number digits */}
                  <div className="text-8xl sm:text-9xl font-sans font-black tracking-tighter text-gradient leading-none bg-gradient-to-b from-theme-accent to-transparent bg-clip-text text-transparent select-none opacity-70">
                    {MILESTONES[activeMilestone].step}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-sans font-bold text-theme-fore">
                      {t.milestones[activeMilestone].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-lg">
                      {t.milestones[activeMilestone].description}
                    </p>
                  </div>
                </div>

                {/* White/Dark Solid Rectangle Button 'GET STARTED' */}
                <div>
                  <button
                    onClick={() => scrollToId('contact-section')}
                    className="px-6 py-3 bg-theme-accent text-white hover:bg-theme-accent-bright rounded-lg text-xs font-sans font-extrabold tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2 group/btn"
                    id={`processes-get-started-${MILESTONES[activeMilestone].step}`}
                  >
                    <span>Get Started</span>
                    <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </motion.section>

      {/* SECTION 3.8: FREQUENTLY ASKED QUESTIONS */}
      <motion.section
        id="faq-section"
        className="space-y-16 pt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">

          {/* Left Column: Any Question Box */}
          <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-theme-accent font-bold">
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore text-left">
                {t.faq.mainHeading}
              </h2>
            </div>

            {/* Any Question Form widget */}
            <div className="p-6 sm:p-7 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border space-y-5 shadow-xl relative overflow-hidden text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-sans font-bold text-theme-fore">{t.faq.askTitle}</h4>
                <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                  {t.faq.askDesc}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!questionSubmitted ? (
                  <motion.form
                    key="faq-input-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!customQuestion.trim()) return;
                      setQuestionSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <label htmlFor="custom-q-input" className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle font-bold">
                      {t.faq.askLabel}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="custom-q-input"
                        type="text"
                        required
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder={t.faq.askPlaceholder}
                        className="w-full pr-12 pl-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-theme-accent hover:bg-theme-accent-bright text-theme-base transition-colors cursor-pointer"
                        aria-label="Submit question"
                      >
                        <Icon icon="ph:paper-plane-tilt-fill" className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="faq-success-state"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3"
                  >
                    <Icon icon="ph:check-circle-fill" className="w-6 h-6 text-emerald-600 dark:text-emerald-500 mx-auto" />
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-theme-fore">Pertanyaan Terkirim!</h5>
                      <p className="text-[10px] text-theme-fore-muted leading-relaxed">
                        Terima kasih. Saya akan mempelajari pertanyaan Anda dan merespons dalam waktu <span className="font-semibold text-theme-accent">12 jam</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setQuestionSubmitted(false);
                        setCustomQuestion('');
                      }}
                      className="text-[9px] font-mono uppercase tracking-wider text-theme-accent hover:underline cursor-pointer"
                    >
                      Kirim pertanyaan lain
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative floating help graphics */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Custom Stateful Interactive Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {t.faq.items.map((faq, idx) => {
              const isExpanded = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${isExpanded
                    ? 'bg-theme-elevated border-theme-border-accent shadow-lg shadow-theme-accent-glow/5'
                    : 'bg-theme-elevated/40 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated/70'
                    }`}
                >
                  <button
                    onClick={() => setActiveFaq(isExpanded ? null : idx)}
                    className="w-full px-5 py-4 text-left font-sans font-extrabold text-xs sm:text-sm text-theme-fore flex items-center justify-between gap-4 cursor-pointer select-none"
                    aria-expanded={isExpanded}
                  >
                    <span className="text-theme-fore">{faq.q}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isExpanded ? 'bg-theme-accent text-theme-base' : 'bg-theme-surface text-theme-fore-muted dark:text-white/70'
                      }`}>
                      {isExpanded ? <Icon icon="ph:minus-bold" className="w-3 h-3" /> : <Icon icon="ph:plus-bold" className="w-3 h-3" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-[11px] sm:text-xs text-theme-fore-muted leading-relaxed border-t border-theme-border/50 text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </motion.section>

      {/* SECTION 5: FORMULIR KONTAK */}
      <motion.section
        id="contact-section"
        className="p-4 sm:p-8 md:p-14 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl space-y-8 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        {/* Supporting decorative premium ambient background spotlight */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-theme-accent-glow/50 rounded-full blur-[130px] pointer-events-none opacity-40 dark:opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-theme-accent-glow/25 rounded-full blur-[100px] pointer-events-none opacity-30" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

          {/* Left Block: Information, Value Prop, Active Slots Indicator */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                &nbsp;
              </div>

              <h2 className="text-3xl sm:text-4.5xl font-display font-bold tracking-tight leading-[1.12] text-theme-fore">
                {t.contact.mainHeading}{' '}
                <span className="text-theme-accent">
                  {t.contact.mainHeadingHighlight}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-md">
                {t.contact.desc}
              </p>

              {/* Duplicate value props and platform badges removed for brevity */}
            </div>

            {/* Computer SVG Illustration */}
            <div className="hidden lg:block relative w-full max-w-[400px] mt-8 opacity-90 drop-shadow-2xl">
              <img src="/computer.svg" alt="Computer Tech Setup" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Right Block: High-Fidelity Interactive Form Widget */}
          <div className="lg:col-span-7 p-3 sm:p-8 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border/80 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                  id="contact-form-element"
                >
                  {/* Honeypot field for bot spam detection */}
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_check"
                      tabIndex={-1}
                      value={formData.honeypot || ''}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      autoComplete="off"
                    />
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* Name and {t.contact.formEmail} Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-name">
                        {t.contact.formNameLabel}
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        placeholder={t.contact.formNamePlaceholder}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-4 sm:py-3 text-sm sm:text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-email">
                        {t.contact.formEmailLabel}
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        placeholder={t.contact.formEmailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-4 sm:py-3 text-sm sm:text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* HIGH-FIDELITY: INTERACTIVE SERVICE SELECTOR CARDS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider block">
                      {t.contact.formServiceLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'Full-Stack Web App', label: t.contact.formService1Title, desc: t.contact.formService1Desc },
                        { id: 'Native iOS/Android App', label: t.contact.formService2Title, desc: t.contact.formService2Desc },
                        { id: 'API Gateway & Cloud Integration', label: t.contact.formService3Title, desc: t.contact.formService3Desc },
                        { id: 'Comprehensive Hybrid Pipeline', label: t.contact.formService4Title, desc: t.contact.formService4Desc }
                      ].map((svc) => {
                        const isSelected = formData.service === svc.id;
                        return (
                          <button
                            type="button"
                            key={svc.id}
                            onClick={() => setFormData({ ...formData, service: svc.id })}
                            className={`p-3 text-left rounded-xl border text-xs transition-all duration-300 cursor-pointer flex flex-col justify-between h-[85px] relative overflow-hidden group select-none ${isSelected
                              ? 'bg-theme-accent-glow/55 border-theme-border-accent shadow-md shadow-theme-accent/5'
                              : 'bg-theme-elevated/60 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated'
                              }`}
                          >
                            <span className={`font-sans font-bold transition-colors duration-200 block ${isSelected ? 'text-theme-accent' : 'text-theme-fore'
                              }`}>
                              {svc.label}
                            </span>
                            <span className="text-[10px] text-theme-fore-muted block truncate">
                              {svc.desc}
                            </span>

                            {/* Selected Active Indicator Dot */}
                            {isSelected && (
                              <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* HIGH-FIDELITY: INTERACTIVE SCOPE SELECTOR TABS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider block">
                      {t.contact.formScopeLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'SaaS MVP (Fast Turnaround)', label: t.contact.formScope1Title, desc: t.contact.formScope1Desc },
                        { id: 'Medium Scale Production', label: t.contact.formScope2Title, desc: t.contact.formScope2Desc },
                        { id: 'High-Scale Custom Architecture', label: t.contact.formScope3Title, desc: t.contact.formScope3Desc }
                      ].map((sc) => {
                        const isSelected = formData.scope === sc.id;
                        return (
                          <button
                            type="button"
                            key={sc.id}
                            onClick={() => setFormData({ ...formData, scope: sc.id })}
                            className={`p-3 text-left rounded-xl border text-xs transition-all duration-300 cursor-pointer flex flex-col justify-between h-[75px] select-none ${isSelected
                              ? 'bg-theme-accent-glow/55 border-theme-border-accent shadow-md shadow-theme-accent/5'
                              : 'bg-theme-elevated/60 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated'
                              }`}
                          >
                            <span className={`font-sans font-bold transition-colors duration-200 block ${isSelected ? 'text-theme-accent' : 'text-theme-fore'
                              }`}>
                              {sc.label}
                            </span>
                            <span className="text-[9px] text-theme-fore-muted block truncate">
                              {sc.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-details">
                      {t.contact.formDetailsLabel}
                    </label>
                    <textarea
                      id="form-details"
                      rows={3}
                      placeholder={t.contact.formDetailsPlaceholder}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-4 py-4 sm:py-3 text-sm sm:text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 resize-none shadow-sm"
                    />
                  </div>

                  {/* Dispatch CTA Button */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-bright text-white text-[11px] sm:text-xs font-sans font-extrabold tracking-widest uppercase shadow-lg shadow-theme-accent/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group/submit mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    id="btn-submit-contact"
                  >
                    {formSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Pesan...</span>
                      </span>
                    ) : (
                      <>
                        <Icon icon="ph:paper-plane-tilt-fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-0.5 transition-transform" />
                        <span>{t.contact.formSubmit}</span>
                      </>
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <Icon icon="ph:check-circle-fill" className="w-7 h-7" />
                  </div>
                  <div className="space-y-2.5">
                    <h4 className="text-lg font-sans font-bold text-theme-fore">{t.contact.formSubmitSuccess}</h4>
                    <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed mx-auto">
                      {t.contact.formSubmitSuccessDesc}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      📬 Kami juga telah mengirimkan ringkasan detail pengajuan ke email Anda.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col items-center gap-3">
                    <a
                      href={`https://wa.me/6289508436275?text=Halo%20SejatiDimedia,%20saya%20${encodeURIComponent(formData.name || 'Klien')}%20ingin%20berdiskusi%20tentang%20project%20${encodeURIComponent(formData.service || 'Web App')}%20yang%20baru%20saya%20ajukan.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-sans font-extrabold tracking-wider uppercase shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
                    >
                      <Icon icon="ic:baseline-whatsapp" className="w-4.5 h-4.5" />
                      <span>Hubungi via WhatsApp (Negosiasi Cepat)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-[10px] font-mono text-theme-fore-muted hover:text-theme-accent transition-colors underline decoration-dotted underline-offset-4 cursor-pointer mt-1"
                    >
                      Kirim Pesan Lain / Reset Form
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-theme-fore-subtle bg-theme-elevated/80 border border-theme-border px-3.5 py-2 rounded-lg">
                    REF: {Math.random().toString(36).substring(2, 9).toUpperCase()} • STATUS: PRIORITAS_TINGGI
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.section>

      {/* SECTION: FREELANCE PLATFORMS TRUST BADGE (PROPORTIONED & CLEAN) */}
      <motion.section
        className="w-full max-w-4xl mx-auto pt-6 pb-6 px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionFadeIn}
      >
        <div className="relative group overflow-hidden rounded-2xl bg-theme-elevated/80 backdrop-blur-xl border border-theme-border/80 p-4.5 sm:p-5.5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-theme-border-accent/40 transition-all duration-300">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 text-center md:text-left z-10">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-theme-accent font-bold">
              {t.platforms?.secure || "TRANSAKSI AMAN & TERJAMIN"}
            </span>
            <h3 className="text-xs sm:text-base font-semibold text-theme-fore leading-snug">
              {t.platforms?.availableOn || "Rekam jejak proyek saya juga dapat dilihat di Upwork & Fastwork"}
            </h3>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2.5 sm:gap-3 shrink-0 z-10 w-full sm:w-auto">
            <a
              href="https://www.upwork.com/freelancers/~017698b392e21b4b6c"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14A800]/10 dark:bg-[#14A800]/15 border border-[#14A800]/30 hover:bg-[#14A800]/20 hover:border-[#14A800]/50 transition-all text-xs sm:text-sm font-bold text-theme-fore shadow-sm group/upwork"
            >
              <div className="w-5.5 h-5.5 rounded-lg bg-[#14A800] text-white flex items-center justify-center group-hover/upwork:scale-110 transition-transform shadow-sm">
                <Icon icon="simple-icons:upwork" className="w-3.5 h-3.5" />
              </div>
              <span>Upwork</span>
            </a>
            <a
              href="https://fastwork.id/en/user/timurradhadian?source=web_marketplace_profile-menu_profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1D4ED8]/10 dark:bg-[#1D4ED8]/15 border border-[#1D4ED8]/30 hover:bg-[#1D4ED8]/20 hover:border-[#1D4ED8]/50 transition-all text-xs sm:text-sm font-bold text-theme-fore shadow-sm group/fastwork"
            >
              <div className="w-5.5 h-5.5 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center group-hover/fastwork:scale-110 transition-transform shadow-sm">
                <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
              </div>
              <span>Fastwork</span>
            </a>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
