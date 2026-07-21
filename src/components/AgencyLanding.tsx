"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../lib/api/glio-projects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Laptop,
  RefreshCcw,
  Copyright,
  Wallet,
  Factory,
  ShieldCheck,
  ExternalLink,
  Layout,
  Server,
  Smartphone,
  Cpu,
  ArrowRight,
  Sparkles,
  Check,
  Send,
  CheckCircle,
  ChevronRight,
  Terminal,
  Zap,
  Database,
  Layers,
  Code2,
  Lock,
  Workflow,
  Plus,
  Minus,
  Crown,
  Trophy,
  HelpCircle,
  Atom,
  Wind,
  Boxes,
  Flame,
  Cloud,
  Github,
  Network,
  HardDrive,
  Droplet,
  CreditCard
} from 'lucide-react';

const GlintStar = ({ className }: { className?: string }) => (
  <div className={`absolute pointer-events-none select-none ${className}`}>
    {/* Center core glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-theme-accent/25 blur-[4px]" />
    {/* Horizontal ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    {/* Vertical ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent" />
  </div>
);

const TECH_ITEMS = [
  { name: 'React', icon: Atom, color: 'text-[#61DAFB] bg-[#61DAFB]/5 border-[#61DAFB]/20' },
  { name: 'Vite', icon: Zap, color: 'text-[#646CFF] bg-[#646CFF]/5 border-[#646CFF]/20' },
  { name: 'TypeScript', icon: Code2, color: 'text-[#3178C6] bg-[#3178C6]/5 border-[#3178C6]/20' },
  { name: 'Next.js', icon: Layers, color: 'text-[#EDEDED] bg-white/5 border-white/20' },
  { name: 'Tailwind CSS', icon: Wind, color: 'text-[#38BDF8] bg-[#38BDF8]/5 border-[#38BDF8]/20' },
  { name: 'Node.js', icon: Cpu, color: 'text-[#339933] bg-[#339933]/5 border-[#339933]/20' },
  { name: 'Go Lang', icon: Terminal, color: 'text-[#00ADD8] bg-[#00ADD8]/5 border-[#00ADD8]/20' },
  { name: 'Python', icon: Terminal, color: 'text-[#3776AB] bg-[#3776AB]/5 border-[#3776AB]/20' },
  { name: 'PostgreSQL', icon: Database, color: 'text-[#4169E1] bg-[#4169E1]/5 border-[#4169E1]/20' },
  { name: 'Docker', icon: Boxes, color: 'text-[#2496ED] bg-[#2496ED]/5 border-[#2496ED]/20' },
  { name: 'Firebase', icon: Flame, color: 'text-[#FFCA28] bg-[#FFCA28]/5 border-[#FFCA28]/20' },
  { name: 'SwiftUI', icon: Smartphone, color: 'text-[#F05138] bg-[#F05138]/5 border-[#F05138]/20' },
  { name: 'Kotlin', icon: Code2, color: 'text-[#7F52FF] bg-[#7F52FF]/5 border-[#7F52FF]/20' },
  { name: 'AWS', icon: Cloud, color: 'text-[#FF9900] bg-[#FF9900]/5 border-[#FF9900]/20' },
  { name: 'Google Cloud', icon: Cloud, color: 'text-[#4285F4] bg-[#4285F4]/5 border-[#4285F4]/20' },
  { name: 'GitHub', icon: Github, color: 'text-[#EDEDED] bg-white/5 border-white/20' },
  { name: 'GraphQL', icon: Network, color: 'text-[#E10098] bg-[#E10098]/5 border-[#E10098]/20' },
  { name: 'Redis', icon: HardDrive, color: 'text-[#DC382D] bg-[#DC382D]/5 border-[#DC382D]/20' },
  { name: 'Drizzle ORM', icon: Droplet, color: 'text-[#C5F74F] bg-[#C5F74F]/5 border-[#C5F74F]/20' },
  { name: 'Stripe API', icon: CreditCard, color: 'text-[#635BFF] bg-[#635BFF]/5 border-[#635BFF]/20' },
];

const FEATURE_ITEMS = [
  {
    num: '01',
    title: 'Kode 100% Milik Anda',
    description: 'Setelah proyek selesai dan lunas, seluruh source code, hak cipta, dan aset digital diserahkan sepenuhnya kepada Anda — tanpa lisensi berulang, tanpa vendor lock-in.'
  },
  {
    num: '02',
    title: 'Komunikasi Langsung Tanpa Perantara',
    description: 'Anda berkomunikasi langsung dengan developer yang menulis kode, bukan dengan manajer proyek atau tim sales. Setiap keputusan teknis dibahas transparan dan cepat.'
  },
  {
    num: '03',
    title: 'Kode Bersih & Terstruktur',
    description: 'Setiap baris kode ditulis manual dengan konvensi industri — mudah dibaca, mudah di-debug, dan siap dikembangkan oleh tim Anda di masa depan.'
  },
  {
    num: '04',
    title: 'Harga Transparan, Tanpa Biaya Tersembunyi',
    description: 'Estimasi biaya diberikan di awal berdasarkan scope yang disepakati. Tidak ada invoice dadakan atau biaya tambahan yang muncul tiba-tiba di tengah pengerjaan.'
  },
  {
    num: '05',
    title: 'Pendampingan Pasca-Launch',
    description: 'Proyek tidak berhenti di deployment. Saya menyediakan masa maintenance dan perbaikan bug setelah peluncuran, memastikan sistem Anda berjalan stabil di dunia nyata.'
  }
];

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

export default function AgencyLanding({ copy, projects }: { copy?: any; projects?: Project[] }) {
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Web App',
    scope: 'Medium Scale',
    details: '',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      // Simulate reset after short duration
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        service: 'Full-Stack Web App',
        scope: 'Medium Scale',
        details: '',
      });
    }, 4000);
  };

  const getQuickPrice = () => {
    let base = quickService === 'web' ? 4500 : quickService === 'mobile' ? 6000 : 3200;
    if (quickComplexity === 'complex') base *= 1.8;
    return base.toLocaleString();
  };

  return (
    <div className="space-y-24">
      {/* SECTION 1: BESPOKE SLICED HERO STAGE (AS PER REFERENCE IMAGE) */}
      <section className="relative py-8 md:py-16 min-h-[85vh] flex flex-col justify-center overflow-visible">
        {/* Cinematic Glint Star lens-flares from reference image */}
        <GlintStar className="top-[10%] left-[2%] opacity-60 scale-125 select-none" />
        <GlintStar className="bottom-[22%] right-[12%] opacity-50 scale-150 select-none" />
        <GlintStar className="top-[45%] left-[45%] opacity-35 scale-90 select-none" />

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
                {copy?.heroTitle && copy.heroTitle !== "Embrace the future of digital engineering with our high-fidelity product software craftsmanship." ? (
                  copy.heroTitle
                ) : (
                  <>
                    Software Developer Independen untuk Bisnis yang Butuh Sistem, Bukan Sekadar <span className="font-serif italic font-normal text-theme-accent relative inline-block">Website</span>.
                  </>
                )}
              </h1>
            </motion.div>

            {/* Bottom Left Card: Pengalaman Industri */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300"
              id="hero-stats-card-left"
            >
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <div className="text-xl sm:text-2xl font-sans font-black tracking-tight text-theme-accent">
                  Pengalaman Industri
                </div>
                <div className="text-xs font-bold text-theme-fore">
                  Sistem Manufaktur Nyata
                </div>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Terbiasa membangun sistem yang menangani transaksi, inventori, dan proses kerja harian — bukan sekadar landing page.
                </p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Intro Text, Middle Stats Card, Conclusion & Orange CTA Button (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12 lg:space-y-0 min-h-full lg:py-4">

            {/* Top Right Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:text-right"
            >
              <p className="text-sm text-theme-fore-muted font-medium leading-relaxed max-w-sm lg:ml-auto">
                {copy?.heroSubtitle && copy.heroSubtitle !== "Providing Comprehensive Solutions Tailored to Your Needs." ? (
                  copy.heroSubtitle
                ) : (
                  "Dari latar belakang industri manufaktur ke proyek independen — saya membangun aplikasi web, mobile, dan backend dengan standar yang sama seperti sistem yang menangani operasional bisnis nyata setiap hari."
                )}
              </p>
            </motion.div>

            {/* Middle Right Card: Dynamic Proyek Independen */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300 lg:ml-auto lg:my-6"
              id="hero-stats-card-right"
            >
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <div className="text-xl sm:text-2xl font-sans font-black tracking-tight text-theme-fore">
                  {projects?.length || 3} Proyek Independen
                </div>
                <div className="text-xs font-bold text-theme-fore">
                  Bisa Diuji Langsung
                </div>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Kode dapat diaudit di GitHub, aplikasi aktif dan bisa dicoba langsung — tidak hanya screenshot portofolio.
                </p>
              </div>
            </motion.div>

            {/* Bottom Right Description & CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-sm lg:ml-auto"
            >
              <p className="text-xs text-theme-fore-muted leading-relaxed">
                Setiap baris kode dirancang untuk stabilitas, kecepatan, dan pertumbuhan bisnis Anda secara jangka panjang.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => scrollToId('contact-section')}
                  className="px-6 py-3.5 rounded-full text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/10 hover:shadow-theme-accent/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
                  id="hero-btn-book-call"
                >
                  <span>Diskusikan Proyek Anda</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToId('projects-section')}
                  className="px-6 py-3.5 rounded-full text-xs font-bold border border-theme-border hover:border-theme-accent text-theme-fore hover:bg-theme-surface/50 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
                  id="hero-btn-view-projects"
                >
                  <span>Cek Portofolio & Live Demo</span>
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

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
            <span>Layanan</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">
                Layanan{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-[#9BC2FA] bg-clip-text text-transparent font-black">
                  Pengembangan Perangkat Lunak
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed text-left">
                Setiap proyek dimulai dari kebutuhan bisnis Anda, bukan dari template siap pakai. Arsitektur, keamanan, dan performa dirancang agar sistem tetap relevan seiring bisnis Anda berkembang.
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
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              01
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Web Application Development
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Website company profile, dashboard admin, hingga platform SaaS custom — dibangun dengan arsitektur yang scalable dan performa tinggi.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block text-left">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['React / Vite', 'Next.js', "Vue", "Angular", 'TypeScript', "Laravel", 'Node.js', 'Golang', "MySQL", 'PostgreSQL', "MongoDB", "Docker"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Mobile App Development */}
          <motion.div
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              02
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Mobile App Development
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Aplikasi iOS & Android, native maupun cross-platform, dengan pengalaman pengguna yang mulus dan performa setara aplikasi native.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block text-left">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Flutter', 'React Native', 'SQLite', "Firebase", "Push Notification", "Geolocation", "Local Database", "Rest API Integration"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: REST API & Cloud Integration */}
          <motion.div
            className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]"
            variants={cardSlideUp}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />

            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              03
            </div>

            <div className="space-y-6 relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  REST API & Cloud Integration
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Backend API yang aman, terstruktur, dan siap menangani skala — lengkap dengan autentikasi, integrasi pembayaran, dan sistem real-time.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block text-left">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Rest API", "GraphQL", "Google Cloud Platform", "Midtrans"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
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
                Teknologi yang{' '}
                <span className="bg-gradient-to-r from-theme-accent to-theme-accent-bright bg-clip-text text-transparent font-black">
                  Digunakan
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed text-left">
                Tools dipilih berdasarkan kebutuhan proyek, bukan sekadar tren — memastikan performa, keamanan, dan kemudahan maintenance jangka panjang.
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
                <Layout className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Frontend</h3>
                <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed">Untuk antarmuka yang cepat, responsif, dan interaktif.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
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
                <Server className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Backend & API</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">Logika bisnis & manajemen server.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["Node.js", "Go Lang", "Python", "Express", "GraphQL"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
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
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Database</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">Penyimpanan terstruktur & ORM.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
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
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Mobile</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">Aplikasi iOS & Android native/hybrid.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["React Native", "Flutter"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
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
                <Cloud className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Infrastructure</h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">Virtualisasi & integrasi cloud.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-theme-border/40 relative z-10">
              {["Docker", "AWS", "Google Cloud", "Firebase"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
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
                  <Network className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Integrasi Pihak Ketiga</h3>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">Penghubungan dengan layanan eksternal untuk modul pembayaran aman, autentikasi terpusat, dan layanan berbasis API lainnya.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-start md:justify-end flex-grow w-full md:max-w-md">
                {["Rest API", "Payment Integration", "Cloud Storage", "OAuth Providers", "Stripe / Midtrans"].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium bg-theme-surface border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/50 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>



      {/* SECTION 3: CREDIBILITY SECTION (LATAR BELAKANG & KEMAMPUAN) */}
      <motion.section
        id="preview-section"
        className="space-y-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Kredibilitas</span>
            <span className="w-6 h-[1px] bg-theme-accent" />
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
            Latar Belakang & Kemampuan
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-3xl mx-auto">
            Sebelum menekuni proyek independen, saya bekerja sebagai Software Developer di industri manufaktur — menangani sistem yang harus akurat dan diandalkan untuk proses operasional sehari-hari. Pengalaman itu saya bawa ke setiap proyek: kode yang bukan sekadar jalan, tapi juga stabil dan mudah dirawat jangka panjang.
          </p>
        </div>

        {/* High-fidelity grid showing three concrete proofs */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Pengalaman Manufaktur */}
          <motion.div
            className="group flex flex-col justify-between space-y-6 p-8 rounded-3xl bg-theme-elevated/40 border border-theme-border hover:border-theme-border-accent/50 hover:shadow-2xl hover:shadow-theme-accent/5 transition-all duration-500 relative overflow-hidden text-left"
            variants={cardSlideUp}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent/20 transition-colors duration-700" />
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-fore-muted group-hover:text-theme-accent group-hover:border-theme-accent/40 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <Factory className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Pengalaman Manufaktur
                </h3>
                <p className="text-sm text-theme-fore-muted leading-relaxed">
                  Berpengalaman mengembangkan & memelihara sistem internal (seperti ERP, inventori, dan HCM) di perusahaan manufaktur nyata yang menuntut keandalan tinggi.
                </p>
              </div>
            </div>
            <button
              onClick={() => scrollToId('capabilities-section')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-theme-fore-muted group-hover:text-theme-accent transition-colors duration-300 relative z-10 w-fit"
            >
              <span className="border-b border-transparent group-hover:border-theme-accent/30 pb-0.5 uppercase tracking-wide">Lihat Kompetensi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Card 2: 30 Proyek, Beragam Kompleksitas */}
          <motion.div
            className="group flex flex-col justify-between space-y-6 p-8 rounded-3xl bg-theme-elevated/40 border border-theme-border hover:border-theme-border-accent/50 hover:shadow-2xl hover:shadow-theme-accent/5 transition-all duration-500 relative overflow-hidden text-left md:-translate-y-4"
            variants={cardSlideUp}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-theme-accent/10 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-fore-muted group-hover:text-theme-accent group-hover:border-theme-accent/40 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors duration-300 leading-tight">
                  {projects?.length || 3} Proyek, Beragam Kompleksitas
                </h3>
                <p className="text-sm text-theme-fore-muted leading-relaxed">
                  Mulai dari MVP validasi ide hingga sistem ERP multi-tenant untuk kebutuhan enterprise. Setiap proyek didokumentasikan dan dapat ditelusuri riwayat pengerjaannya.
                </p>
              </div>
            </div>
            <button
              onClick={() => scrollToId('projects-section')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-theme-fore-muted group-hover:text-theme-accent transition-colors duration-300 relative z-10 w-fit"
            >
              <span className="border-b border-transparent group-hover:border-theme-accent/30 pb-0.5 uppercase tracking-wide">Lihat Portofolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Card 3: Verifikasi Terbuka */}
          <motion.div
            className="group flex flex-col justify-between space-y-6 p-8 rounded-3xl bg-theme-elevated/40 border border-theme-border hover:border-theme-border-accent/50 hover:shadow-2xl hover:shadow-theme-accent/5 transition-all duration-500 relative overflow-hidden text-left"
            variants={cardSlideUp}
          >
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent/20 transition-colors duration-700" />
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-fore-muted group-hover:text-theme-accent group-hover:border-theme-accent/40 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Verifikasi Terbuka
                </h3>
                <p className="text-sm text-theme-fore-muted leading-relaxed">
                  Transparansi kode melalui GitHub dan riwayat profesional yang bisa diverifikasi secara terbuka di LinkedIn, memberikan rasa aman 100%.
                </p>
              </div>
            </div>
            <button
              onClick={() => scrollToId('contact-section')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-theme-fore-muted group-hover:text-theme-accent transition-colors duration-300 relative z-10 w-fit"
            >
              <span className="border-b border-transparent group-hover:border-theme-accent/30 pb-0.5 uppercase tracking-wide">Hubungi Kontak</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
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
            <span>Harga</span>
            <span className="w-6 h-[1px] bg-theme-accent" />
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-center">
            Paket Harga Proyek
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-2xl mx-auto text-center">
            Pilih paket sesuai skala proyek Anda. Butuh sistem custom di luar paket ini? Diskusikan langsung untuk penawaran khusus.
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
            className="p-7 rounded-3xl bg-theme-elevated/75 border border-theme-border hover:border-theme-border-accent/35 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-8 relative group text-left"
            variants={cardSlideUp}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">Untuk Validasi Ide</span>
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore">Starter — MVP Prototype</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/5 border border-theme-border flex items-center justify-center text-theme-accent">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                Cocok untuk validasi ide atau produk tahap awal sebelum meluncurkannya ke pasar secara luas.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-sans font-black text-theme-fore tracking-tight">Rp 3 - 7 Jt+</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ proyek</span>
              </div>
              <button
                onClick={() => selectPlan('Full-Stack Web App', 'SaaS MVP (Fast Turnaround)')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-theme-border hover:border-theme-border-accent hover:bg-theme-accent-glow text-theme-accent transition-all duration-200 cursor-pointer text-center select-none"
              >
                Mulai dari Sini
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-theme-border/50">
              <span className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  '1 Platform (Web / Mobile)',
                  'Fitur Inti & Core Logic',
                  'Estimasi 2–4 Minggu Pengerjaan',
                  '1x Revisi Besar',
                  'Kode Bersih & Siap Skala'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-theme-fore-muted">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Growth - Production Ready (Most Popular) */}
          <motion.div
            className="p-7 rounded-3xl bg-[#0F1115] dark:bg-[#0A0C10] text-white border-2 border-theme-accent hover:shadow-[0_0_50px_-10px_rgba(74,133,217,0.35)] transition-all duration-300 flex flex-col justify-between space-y-8 relative lg:scale-105 z-10 overflow-hidden text-left"
            variants={cardSlideUp}
          >
            {/* Luminous dynamic glow mesh background for highlighted premium feel */}
            <div className="absolute inset-0 bg-[radial-gradient(350px_circle_at_top_right,rgba(74,133,217,0.18),transparent_80%)] pointer-events-none" />
            <div className="absolute top-2 right-2.5 bg-theme-accent/25 border border-theme-accent/40 text-theme-accent text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Paling Populer
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">Untuk Rilis ke Publik</span>
                  <h3 className="text-lg font-sans font-extrabold text-white">Growth — Production Ready</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/20 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Cocok untuk bisnis yang siap merilis produk secara resmi ke pengguna umum dengan fitur lengkap dan integrasi backend.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-sans font-black text-white tracking-tight">Rp 10 Jt+</span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">/ proyek</span>
              </div>
              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/20 transition-all duration-200 cursor-pointer text-center select-none"
              >
                Diskusikan Proyek Anda
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-zinc-800 relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  'Web Application + API Backend',
                  'Integrasi Pembayaran & Autentikasi',
                  'Dashboard Admin & Manajemen',
                  'Pendampingan 30 Hari Pasca-Launch',
                  '100% Hak Cipta & Source Code'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Custom - Sistem Kompleks */}
          <motion.div
            className="p-7 rounded-3xl bg-theme-elevated/75 border border-theme-border hover:border-theme-border-accent/35 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-8 relative group text-left"
            variants={cardSlideUp}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">Skala Enterprise</span>
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore">Custom — Sistem Kompleks</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/5 border border-theme-border flex items-center justify-center text-theme-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                Cocok untuk kebutuhan sistem skala besar, arsitektur rumit, dan terintegrasi dengan banyak proses bisnis operasional.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-sans font-black text-theme-fore tracking-tight">Custom</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ scope</span>
              </div>
              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-theme-border hover:border-theme-border-accent hover:bg-theme-accent-glow text-theme-accent transition-all duration-200 cursor-pointer text-center select-none"
              >
                Ceritakan Kebutuhan Anda
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-theme-border/50">
              <span className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  'Arsitektur Multi-Platform',
                  'Timeline & Scope Kustom',
                  'Dukungan Lanjutan Sesuai Kesepakatan',
                  'Dokumentasi API & Arsitektur Lengkap',
                  'Pemeliharaan Server Berkala'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-theme-fore-muted">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </motion.div>
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
                Pertanyaan Umum
              </h2>
            </div>

            {/* Any Question Form widget */}
            <div className="p-6 sm:p-7 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border space-y-5 shadow-xl relative overflow-hidden text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-sans font-bold text-theme-fore">Ada Pertanyaan?</h4>
                <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                  Tanyakan apa saja terkait kebutuhan pengembangan software, revisi, atau penawaran khusus.
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
                      Tulis pertanyaan Anda.
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="custom-q-input"
                        type="text"
                        required
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Tulis di sini..."
                        className="w-full pr-12 pl-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 p-2 bg-theme-accent hover:bg-theme-accent-bright text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-md active:scale-95"
                        aria-label="Submit question"
                      >
                        <Send className="w-3 h-3" />
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
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
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
            {[
              {
                q: "Bagaimana sistem pembayarannya?",
                a: "Pembayaran dilakukan bertahap sesuai milestone proyek (biasanya 3 tahap: DP, progress, pelunasan), via transfer bank atau metode lain sesuai kesepakatan."
              },
              {
                q: "Apakah source code jadi milik saya sepenuhnya?",
                a: "Ya. Setelah proyek selesai dan pembayaran lunas, seluruh source code dan hak cipta sepenuhnya diserahkan ke Anda."
              },
              {
                q: "Berapa lama waktu pengerjaan?",
                a: "Tergantung skala proyek — MVP sederhana bisa 2–4 minggu, sistem enterprise bisa 2–3 bulan. Timeline pasti diberikan setelah tahap Discovery."
              },
              {
                q: "Apakah ada dukungan setelah peluncuran?",
                a: "Ya, saya menyediakan masa maintenance pasca-launch, dan paket support lanjutan jika dibutuhkan."
              },
              {
                q: "Apakah bisa request revisi di tengah pengerjaan?",
                a: "Bisa. Setiap paket sudah termasuk jumlah revisi tertentu; revisi tambahan di luar itu akan diinformasikan estimasi biaya & waktunya terlebih dahulu."
              },
              {
                q: "Industri apa saja yang pernah Anda tangani?",
                a: "Sejauh ini saya sudah membangun beberapa proyek independen di berbagai domain — HR/HCM (ERP), rekrutmen (AI Resume Analyzer), hingga layanan reservasi (Antreey untuk barbershop & arena olahraga) — sekaligus punya pengalaman kerja langsung di industri manufaktur. Lihat detailnya di halaman Projects."
              }
            ].map((faq, idx) => {
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
                    <span>{faq.q}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isExpanded ? 'bg-theme-accent text-white' : 'bg-theme-surface text-theme-fore-muted'
                      }`}>
                      {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
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
            <span>Proses Kerja</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-2xl">
            {copy?.processesTitle && copy.processesTitle !== "Providing Comprehensive Solutions Tailored to Your Needs." ? (
              copy.processesTitle
            ) : (
              <>
                Proses Kerja Terstruktur{' '}
                <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">
                  untuk Hasil Terbaik
                </span>
              </>
            )}
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
                    {milestone.title}
                  </span>
                  <span className={`text-xs font-mono font-bold transition-colors ${isActive ? 'text-theme-accent' : 'text-theme-fore-subtle'
                    }`}>
                    {milestone.step}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Giant display digits details (6 cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
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
                      {MILESTONES[activeMilestone].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-lg">
                      {MILESTONES[activeMilestone].description}
                    </p>
                  </div>
                </div>

                {/* White/Dark Solid Rectangle Button 'GET STARTED' */}
                <div>
                  <button
                    onClick={() => scrollToId('contact-section')}
                    className="px-6 py-3 bg-theme-fore text-theme-base dark:bg-white dark:text-black hover:bg-theme-accent hover:text-white dark:hover:bg-theme-accent dark:hover:text-white rounded-lg text-xs font-sans font-extrabold tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2 group/btn"
                    id={`processes-get-started-${MILESTONES[activeMilestone].step}`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
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
              <span>Portofolio</span>
            </div>
            <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-2xl text-left">
              Karya Rekayasa{' '}
              <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">
                Perangkat Lunak
              </span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-theme-surface border border-theme-border/80 hover:border-theme-accent text-xs font-sans font-bold text-theme-fore cursor-pointer transition-all duration-300"
          >
            <span>Lihat Semua Proyek</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
            projects.slice(0, 3).map((project) => {
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
                        {project.summary || project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-theme-border/30 mt-4">
                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1 text-left">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-theme-surface text-theme-fore-muted border border-theme-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Explore button */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white text-xs font-sans font-bold text-theme-fore transition-all duration-300 border border-theme-border/80 hover:border-theme-accent"
                    >
                      <span>Lihat Proyek</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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

      {/* SECTION 4.5: THE FEATURES SECTION (KENAPA BEKERJA SAMA DENGAN SAYA) */}
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
            <span>Keunggulan</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-3xl text-left">
            Yang Membedakan{' '}
            <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">
              Cara Saya Bekerja
            </span>
          </h2>
        </div>

        {/* 2-Column Bento Grid styled precisely like Section 3 of the uploaded reference */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {FEATURE_ITEMS.map((item, idx) => {
            const isFullWidth = idx === FEATURE_ITEMS.length - 1;
            return (
              <motion.div
                key={item.num}
                className={`p-6 rounded-2xl bg-theme-elevated border border-theme-border flex flex-col sm:flex-row gap-5 items-start group hover:border-theme-border-accent hover:shadow-xl transition-all duration-300 ${isFullWidth ? 'md:col-span-2' : ''
                  } text-left`}
                variants={cardSlideUp}
              >
                {/* Number digit leading */}
                <div className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tighter text-theme-accent/60 dark:text-theme-accent/40 select-none flex-shrink-0">
                  {item.num}
                </div>

                {/* Text Block */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* SECTION: RISK REVERSAL / JAMINAN KERJA SAMA */}
      <motion.section
        id="guarantee-section"
        className="pt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="relative p-8 md:p-12 rounded-3xl bg-theme-elevated/40 border border-theme-border/60 shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Subtle glowing shield/secure background */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-theme-accent-glow/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start text-center md:text-left">
            <div className="md:w-1/3 space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
                <span className="w-6 h-[1px] bg-theme-accent" />
                <span>Jaminan Klien</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-theme-fore leading-[1.2]">
                Kenapa Aman Berinvestasi di Sini?
              </h3>
              <p className="text-xs text-theme-fore-muted leading-relaxed">
                Setiap kerja sama didasari oleh transparansi, profesionalisme, dan komitmen untuk meminimalkan risiko di pihak Anda.
              </p>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div className="space-y-4 p-6 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-border-accent/50 hover:shadow-xl transition-all duration-300 group" variants={cardSlideUp}>
                <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300 shadow-sm">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-sans font-bold text-theme-fore">Revisi Terstruktur</h4>
                  <p className="text-[11px] text-theme-fore-muted leading-relaxed">Setiap paket sudah mencakup alokasi revisi. Anda tidak akan terjebak dengan hasil akhir yang tidak sesuai ekspektasi.</p>
                </div>
              </motion.div>

              <motion.div className="space-y-4 p-6 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-border-accent/50 hover:shadow-xl transition-all duration-300 group" variants={cardSlideUp}>
                <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300 shadow-sm">
                  <Copyright className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-sans font-bold text-theme-fore">100% Hak Cipta Anda</h4>
                  <p className="text-[11px] text-theme-fore-muted leading-relaxed">Source code, desain, dan seluruh aset digital sepenuhnya milik Anda setelah proyek lunas — tanpa lisensi berulang.</p>
                </div>
              </motion.div>

              <motion.div className="sm:col-span-2 space-y-4 p-6 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-border-accent/50 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center group" variants={cardSlideUp}>
                <div className="w-10 h-10 shrink-0 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:scale-110 group-hover:border-theme-accent/50 transition-all duration-300 shadow-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-sans font-bold text-theme-fore">Pembayaran Bertahap</h4>
                  <p className="text-[11px] text-theme-fore-muted leading-relaxed">Pembayaran dilakukan per milestone, sehingga Anda bisa mengevaluasi progress sebelum melanjutkan ke tahap berikutnya secara aman.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 5: FORMULIR KONTAK */}
      <motion.section
        id="contact-section"
        className="p-8 md:p-14 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl space-y-8 relative overflow-hidden"
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
                <span className="text-[9px] font-mono bg-theme-accent-glow text-theme-accent border border-theme-border-accent/40 px-3 py-1 rounded-full uppercase font-bold tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Kapasitas Terbatas Setiap Kuartal</span>
                </span>
              </div>

              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
                Mari Bangun Sistem yang{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-[#9BC2FA] bg-clip-text text-transparent font-black italic">
                  Benar-Benar Anda Butuhkan
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-md">
                Saya membatasi jumlah proyek yang diterima setiap kuartal agar setiap klien mendapat perhatian penuh — bukan dikerjakan sambil lalu di antara proyek lain.
              </p>

              <div className="space-y-4 pt-6 border-t border-theme-border/50 max-w-sm">
                <div className="flex items-start gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:border-theme-border-accent transition-colors duration-300 shadow-md">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-sans font-bold text-theme-fore">Preview Mingguan</h4>
                    <p className="text-[11px] text-theme-fore-muted leading-relaxed">Update progress build langsung ke staging Anda setiap minggu.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:border-theme-border-accent transition-colors duration-300 shadow-md">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-sans font-bold text-theme-fore">Serah Terima Kode Penuh</h4>
                    <p className="text-[11px] text-theme-fore-muted leading-relaxed">100% hak cipta, commit history bersih, dan panduan deployment lengkap.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick tech tagline metadata at bottom of left column */}
            <div className="pt-6 border-t border-theme-border/30 hidden lg:block text-[10px] font-mono text-theme-fore-subtle flex items-center gap-1.5">
              <span>RESPON &lt; 12 JAM • PIPELINE AMAN SHA-256</span>
            </div>
          </div>

          {/* Right Block: High-Fidelity Interactive Form Widget */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border/80 shadow-2xl relative">
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

                  {/* Name and Email Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-name">
                        Nama Anda
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        placeholder="cth. Raden"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-email">
                        Alamat Email
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        placeholder="cth. kontak@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* HIGH-FIDELITY: INTERACTIVE SERVICE SELECTOR CARDS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider block">
                      Layanan yang Dibutuhkan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'Full-Stack Web App', label: 'Web Application', desc: 'Platform SaaS & Dashboard' },
                        { id: 'Native iOS/Android App', label: 'Aplikasi Mobile', desc: 'SwiftUI, Kotlin, Flutter' },
                        { id: 'API Gateway & Cloud Integration', label: 'Cloud API & Integrasi', desc: 'Express, Go, Database & OAuth' },
                        { id: 'Comprehensive Hybrid Pipeline', label: 'Paket Enterprise Penuh', desc: 'Desain sistem end-to-end' }
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
                      Skala Proyek
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'SaaS MVP (Fast Turnaround)', label: 'MVP Prototype', desc: 'Pengerjaan cepat' },
                        { id: 'Medium Scale Production', label: 'Produksi Growth', desc: 'Aplikasi standar scalable' },
                        { id: 'High-Scale Custom Architecture', label: 'Enterprise Elite', desc: 'Sistem skala besar kustom' }
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
                      Detail & Tujuan Proyek
                    </label>
                    <textarea
                      id="form-details"
                      rows={3}
                      placeholder="Jelaskan secara singkat fitur, batasan teknis, atau tujuan proyek Anda..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 resize-none shadow-sm"
                    />
                  </div>

                  {/* Dispatch CTA Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-bright text-white text-xs font-sans font-extrabold tracking-widest uppercase shadow-lg shadow-theme-accent/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group/submit"
                    id="btn-submit-contact"
                  >
                    <Send className="w-4 h-4 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-0.5 transition-transform" />
                    <span>Kirim Konsultasi Proyek</span>
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
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-sans font-bold text-theme-fore">Konsultasi Berhasil Dikirim!</h4>
                    <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed mx-auto">
                      Detail proyek Anda telah diterima. Saya akan mempelajari kebutuhan teknis Anda dan menghubungi dalam waktu 12 jam.
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
