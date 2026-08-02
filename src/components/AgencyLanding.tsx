"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          service: 'Full-Stack Web App',
          scope: 'medium',
          details: '',
          honeypot: '',
        });
      }, 5000);
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

  return (
    <div className="space-y-24">
      {/* SECTION 1: BESPOKE SLICED HERO STAGE (AS PER REFERENCE IMAGE) */}
      <section className="relative py-8 md:py-16 min-h-[85vh] flex flex-col justify-center overflow-visible z-0">

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch text-left">

          {/* LEFT COLUMN: Main Typography & Bottom Left Stats Card (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-12 min-h-full">

            {/* Huge Display Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="text-[40px] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6.5xl font-sans font-extrabold tracking-tight leading-[1.08] text-theme-fore">
                <>
                  {t.hero.title} <motion.span
                    animate={{ textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 25px var(--theme-accent)", "0px 0px 0px rgba(0,0,0,0)"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="font-serif italic font-normal text-theme-accent relative inline-block"
                  >{t.hero.titleHighlight}</motion.span>.
                </>
              </h1>
            </motion.div>

            {/* Bottom Left Cards */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 lg:mt-auto flex flex-col sm:flex-row gap-4"
              id="hero-stats-cards"
            >
              {/* Card 1: 6+ Years Experience */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 1, -1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex-1 max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300"
              >
                {/* Soft decorative glow */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <div className="text-xl sm:text-2xl font-sans font-black tracking-tight text-theme-accent">
                    {language === 'en' ? 'Industry Experience' : 'Pengalaman Industri'}
                  </div>
                  <div className="text-xs font-bold text-theme-fore">
                    {t.hero.card1Title}
                  </div>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">
                    {t.hero.card1Desc}
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Independent Projects */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -1, 1, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="flex-1 max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300"
              >
                {/* Soft decorative glow */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <div className="text-xl sm:text-2xl font-sans font-black tracking-tight text-theme-fore">
                    {projects?.length || 31} {language === 'en' ? 'Independent Projects' : 'Proyek Independen'}
                  </div>
                  <div className="text-xs font-bold text-theme-fore">
                    {t.hero.card2Title}
                  </div>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">
                    {t.hero.card2Desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Intro Text, Middle Stats Card, Conclusion & Orange CTA Button (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12 lg:space-y-0 min-h-full lg:py-4">

            {/* Middle Right Card: Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative lg:ml-auto lg:my-4 flex justify-end"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-theme-border/50 group"
              >
                <div className="absolute inset-0 bg-theme-accent/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src="/hero-illustration.jpg"
                  alt="Modern Tech Workspace"
                  fill
                  priority
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-w-768px) 100vw, 400px"
                />
              </motion.div>

              {/* Floating AI GIF Top Right - Transparent */}
              <motion.div 
                className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 w-24 h-24 sm:w-36 sm:h-36 z-30 drop-shadow-2xl pointer-events-none"
                animate={{ y: [-15, 5, -15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src="/ai-gif2.gif" alt="AI Assistant" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>

            {/* Bottom Right Description & CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-sm lg:ml-auto"
            >
              <p className="text-xs text-theme-fore-muted leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => scrollToId('contact-section')}
                  className="relative px-6 py-3.5 rounded-full text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/10 hover:shadow-theme-accent/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
                  id="hero-btn-book-call"
                >
                  {/* Subtle pulse ring behind button */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-theme-accent -z-10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span>{t.hero.btnPrimary}</span>
                  <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToId('projects-section')}
                  className="px-6 py-3.5 rounded-full text-xs font-bold border border-theme-border hover:border-theme-accent text-theme-fore hover:bg-theme-surface/50 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
                  id="hero-btn-view-projects"
                >
                  <span>{t.hero.btnSecondary}</span>
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 1.5: AVAILABLE ON FREELANCE PLATFORMS BANNER */}
      <motion.section
        className="w-full max-w-4xl mx-auto pt-6 pb-10 sm:pb-20 px-4 sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative group overflow-hidden rounded-3xl bg-theme-surface/30 backdrop-blur-xl border border-theme-border/50 shadow-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 hover:border-theme-border-accent/30 transition-all duration-500">
          {/* Subtle moving glow inside the banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-theme-accent/5 via-transparent to-theme-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10">
            <span className="text-[10px] font-mono text-theme-accent font-bold uppercase tracking-[0.3em] mb-1.5">
              {t.platforms?.secure || "Transaksi aman & terjamin"}
            </span>
            <h3 className="text-sm sm:text-base font-sans font-semibold text-theme-fore">
              {t.platforms?.availableOn || "Tersedia juga di:"}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full sm:w-auto z-10">
            {/* Upwork */}
            <a
              href="https://www.upwork.com/freelancers/~017698b392e21b4b6c"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#14A800]/10 dark:bg-[#14A800]/5 border border-[#14A800]/20 hover:bg-[#14A800]/20 dark:hover:bg-[#14A800]/15 hover:border-[#14A800]/40 transition-all duration-300 group/btn"
            >
              <div className="w-8 h-8 rounded-full bg-[#14A800] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#14A800]/30 group-hover/btn:scale-110 transition-transform duration-300">
                <Icon icon="simple-icons:upwork" className="w-4 h-4" />
              </div>
              <span className="font-sans font-bold text-sm text-theme-fore">Upwork</span>
            </a>

            {/* Fastwork */}
            <a
              href="https://fastwork.id/en/user/timurradhadian?source=web_marketplace_profile-menu_profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#1D4ED8]/10 dark:bg-[#1D4ED8]/5 border border-[#1D4ED8]/20 hover:bg-[#1D4ED8]/20 dark:hover:bg-[#1D4ED8]/15 hover:border-[#1D4ED8]/40 transition-all duration-300 group/btn"
            >
              <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#1D4ED8]/30 group-hover/btn:scale-110 transition-transform duration-300">
                <Icon icon="ph:lightning-fill" className="w-4 h-4" />
              </div>
              <span className="font-sans font-bold text-sm text-theme-fore">Fastwork</span>
            </a>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>{t.nav.services}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">
                {t.nav.services}{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-theme-accent-bright dark:to-[#9BC2FA] bg-clip-text text-transparent font-black">
                  {t.services.mainHeadingHighlight}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed text-left">
                {t.services.desc}
              </p>
            </div>
          </div>
        </div>

        {/* High-Fidelity Eye-Catching Modern Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >

          {/* Card 1: Web App Development */}
          <motion.div
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[250px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              01
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-theme-base group-hover:scale-105 transition-all duration-350 shadow-md">
                <Icon icon="ph:laptop-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  {t.services.items[0].title}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  {t.services.items[0].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Mobile App Development */}
          <motion.div
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[250px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              02
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-theme-base group-hover:scale-105 transition-all duration-350 shadow-md">
                <Icon icon="ph:device-mobile-speaker-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  {t.services.items[1].title}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  {t.services.items[1].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: {t.services.items[2].title} */}
          <motion.div
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[250px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              03
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-theme-base group-hover:scale-105 transition-all duration-350 shadow-md">
                <Icon icon="ph:cpu-duotone" className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  {t.services.items[2].title}
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  {t.services.items[2].desc}
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
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
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Teknologi</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">
                {t.tech.mainHeading}{' '}
                <span className="bg-gradient-to-r from-theme-accent to-theme-accent-bright bg-clip-text text-transparent font-black">
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
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
              <span className="w-6 h-[1px] bg-theme-accent" />
              <span>{t.nav.portfolio}</span>
            </div>
            <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-2xl text-left">
              {t.portfolio.mainHeading}{' '}
              <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright dark:via-[#6AA0F2] to-theme-accent-bright dark:to-[#9BC2FA] bg-clip-text text-transparent font-black">
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
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>{t.pricing.label}</span>
            <span className="w-6 h-[1px] bg-theme-accent" />
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-center">
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
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>{t.trust?.badge || "Kenapa Klien Percaya"}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-3xl text-left">
            {t.trust?.mainHeading || "Kenapa Klien Percaya"} <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright dark:via-[#6AA0F2] to-theme-accent-bright dark:to-[#9BC2FA] bg-clip-text text-transparent font-black">{t.trust?.mainHeadingHighlight || "Bekerja Sama Dengan Saya"}</span>
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
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>{t.process.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-2xl">
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
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
                <span className="w-6 h-[1px] bg-theme-accent" />
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">
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

              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
                {t.contact.mainHeading}{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-theme-accent-bright dark:to-[#9BC2FA] bg-clip-text text-transparent font-black italic">
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
                  <div className="space-y-2">
                    <h4 className="text-lg font-sans font-bold text-theme-fore">{t.contact.formSubmitSuccess}</h4>
                    <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed mx-auto">
                      {t.contact.formSubmitSuccessDesc}
                    </p>
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

    </div>
  );
}
