"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, MOCK_PROJECTS } from '../lib/api/glio-projects';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { TECH_ICONS } from '../lib/constants';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Icon } from '@iconify/react';

const SERVICE_IMAGES = [
  '/service_web_app.jpg',
  '/service_mobile_app.jpg',
  '/service_saas_app.jpg',
  '/service_ai_llm.jpg',
];

function ClientPortalMockup3D({ t }: { t: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex justify-center items-center py-8 sm:py-10 select-none overflow-visible"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Floating Canvas Wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full max-w-[680px]"
      >
        {/* Ambient 3D Dynamic Shadow Base */}
        <div
          className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-2xl transform translate-y-8 scale-95 pointer-events-none -z-10"
        />

        {/* Floating Badge #1 (Top Right) - High Z-Depth Layer */}
        <div
          style={{ transform: "translateZ(65px)", transformStyle: "preserve-3d" }}
          className="absolute -top-6 right-2 sm:right-6 z-50 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="px-4 py-2 rounded-2xl bg-white border border-blue-200 shadow-2xl flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <Icon icon="ph:clock-clockwise-bold" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-none">24/7 Live Tracking</p>
              <p className="text-[8px] font-medium text-blue-600 mt-0.5 hidden sm:block">Real-Time Development Status</p>
            </div>
          </motion.div>
        </div>

        {/* Floating Badge #2 (Bottom Left) - High Z-Depth Layer */}
        <div
          style={{ transform: "translateZ(55px)", transformStyle: "preserve-3d" }}
          className="absolute -bottom-6 left-2 sm:left-6 z-50 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xl flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
              <Icon icon="ph:shield-check-fill" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-none">Automated Milestone Sync</p>
              <p className="text-[8px] font-medium text-emerald-600 mt-0.5 hidden sm:block">Verified Client Deliverables</p>
            </div>
          </motion.div>
        </div>

        {/* Clean Portal Window Container with Layered Z-Depth */}
        <div
          style={{
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
          }}
          className="w-full p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl hover:border-blue-300 transition-colors duration-300 space-y-3.5 relative overflow-hidden text-left"
        >
          {/* Moving Laser Shimmer Light Line along top border */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] w-48 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-30 pointer-events-none"
            animate={{ x: ['-100%', '350%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Window Header Bar */}
          <div className="space-y-2.5 border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 ml-2">
                  <img src="/logo.svg" alt="SejatiDimedia Logo" className="h-3.5 w-auto object-contain" />
                  <span className="text-[10px] sm:text-xs font-mono text-slate-700 flex items-center gap-1 truncate max-w-[200px] sm:max-w-none">
                    <Icon icon="ph:lock-key-duotone" className="w-3 h-3 text-blue-600 shrink-0" />
                    sejatidimedia.id/portal/projects
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Tab Pills */}
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Icon icon="ph:squares-four-duotone" className="w-3 h-3 text-blue-600" />
                Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
                <Icon icon="ph:folder-duotone" className="w-3 h-3" />
                Deliverables
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
                <Icon icon="ph:receipt-duotone" className="w-3 h-3" />
                Invoices
              </span>
            </div>
          </div>

          {/* Active Project Progress Box */}
          <div
            style={{ transform: "translateZ(10px)" }}
            className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-left shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <Icon icon="ph:kanban-duotone" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {t.clientPortal?.mockupTitle || "Dashboard Klien — Proyek Aktif"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <p className="text-[9px] text-slate-500 font-medium">Client: Timur Dian • Live Status</p>
                  </div>
                </div>
              </div>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 shrink-0 shadow-xs"
              >
                88% Completed
              </motion.span>
            </div>

            {/* Milestone Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9px] font-bold">
              <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Phase 1-3: UI/UX & DB Architecture</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50/80 p-2 rounded-xl border border-blue-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span>Phase 4: QA & Production Release</span>
              </div>
            </div>

            {/* Animated Breathing Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full"
                animate={{ width: ['78%', '88%', '78%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Invoices Box */}
          <div
            style={{ transform: "translateZ(10px)" }}
            className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2.5 text-left shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Icon icon="ph:receipt-duotone" className="w-3.5 h-3.5 text-blue-600" />
                Project Billing & Invoices
              </span>
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"
              >
                <Icon icon="ph:check-circle-fill" className="w-2.5 h-2.5 text-emerald-600" />
                100% Settled
              </motion.span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">Total Billed</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Rp 37.2M</p>
              </div>
              <div className="bg-blue-50/80 p-2 sm:p-2.5 rounded-xl border border-blue-200 shadow-xs relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none"
                  animate={{ x: ['-100%', '150%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-[8px] sm:text-[9px] font-bold text-blue-700 uppercase">Amount Paid</p>
                <p className="text-xs sm:text-sm font-bold text-blue-700 mt-0.5">Rp 37.2M</p>
              </div>
              <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">Balance Due</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Rp 0</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{ transform: "translateZ(8px)" }}
            className="bg-slate-100 p-2 sm:p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-[10px] text-slate-700"
          >
            <div className="flex items-center gap-1.5">
              <Icon icon="ph:seal-check-duotone" className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>INV-202607-001: <strong className="text-slate-900">Paid & Verified</strong></span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[9px] font-bold text-slate-700 flex items-center gap-1 shadow-xs">
              <Icon icon="ph:download-simple-bold" className="w-3 h-3 text-blue-600" />
              PDF Invoice
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const sectionFadeIn = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: "blur(2px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const cardSlideUp = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18
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

export default function AgencyLandingV2({ copy, projects }: { copy?: any; projects?: Project[] }) {
  const { t, language } = useLanguage();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Stepper & Accordion states
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(0);

  // FAQ interactive states
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
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
      tag: language === 'en' ? 'Phase 1: Analysis & Requirements' : 'Fase 1: Analisis & Kebutuhan',
      description: language === 'en'
        ? 'Deeply understanding your business goals, target audience, and system requirements before writing a single line of code.'
        : 'Memahami kebutuhan bisnis, target pengguna, dan tujuan proyek Anda secara mendalam sebelum menulis satu baris kode pun.',
      deliverables: language === 'en'
        ? ['Technical Specs Document', 'Business Logic Schema', 'Timeline & Cost Estimate']
        : ['Dokumen Spesifikasi Teknis', 'Skema Logika Bisnis', 'Estimasi Timeline & Biaya'],
      codePreview: `{\n  "phase": "DISCOVERY",\n  "status": "COMPLETED",\n  "objectives": ["BUSINESS_AUDIT", "WORKFLOW_MAPPING"],\n  "parameters": "DEFINED"\n}`
    },
    {
      step: '02',
      title: 'Design',
      tag: language === 'en' ? 'Phase 2: UI/UX & Architecture' : 'Fase 2: Arsitektur UI/UX',
      description: language === 'en'
        ? 'Crafting high-fidelity UI/UX and database architectures to ensure intuitive user flows and peak system performance.'
        : 'Merancang rancangan UI/UX dan memetakan arsitektur sistem (database & API) agar alur navigasi produk terasa natural dan performa terjamin.',
      deliverables: language === 'en'
        ? ['Interactive Figma Mockups', 'Database ERD Schema', 'API Route Flowchart']
        : ['Desain Figma Interaktif', 'Skema Struktur Database', 'Peta Alur Kerja Data'],
      codePreview: `{\n  "phase": "DESIGN",\n  "architecture": {\n    "ui": "Figma Prototypes",\n    "database": "PostgreSQL Relational",\n    "orm": "Drizzle / Prisma Schema"\n  }\n}`
    },
    {
      step: '03',
      title: 'Development',
      tag: language === 'en' ? 'Phase 3: Custom Engineering' : 'Fase 3: Pemrograman Kustom',
      description: language === 'en'
        ? 'Writing clean, structured, modular code tailored to your exact operational workflows. No generic templates.'
        : 'Membangun produk menggunakan kode yang bersih, terstruktur, aman, dan mudah dikembangkan lebih lanjut. Menghindari template drag-and-drop.',
      deliverables: language === 'en'
        ? ['Modular Clean Code', 'Secure Auth & RBAC', 'Third-Party API Integrations']
        : ['Kode Sumber Terstruktur', 'Sistem Autentikasi Keamanan', 'Integrasi Layanan Pihak Ketiga'],
      codePreview: `const Project = () => {\n  return (\n    <ProductionApp cleanCode={true}>\n      <CustomLogic engine="NextJS_15" />\n    </ProductionApp>\n  );\n}`
    },
    {
      step: '04',
      title: language === 'en' ? 'Testing & QA' : 'Testing & Iterasi',
      tag: language === 'en' ? 'Phase 4: QA & Optimization' : 'Fase 4: Uji Coba & Perbaikan',
      description: language === 'en'
        ? 'Rigorous testing across multiple devices, performance benchmarking (Lighthouse 95+), and iterative feedback refinements.'
        : 'Melakukan pengujian menyeluruh di berbagai perangkat dan skenario penggunaan sebelum produk dirilis, termasuk revisi berdasarkan feedback Anda.',
      deliverables: language === 'en'
        ? ['Bug Audit Report', 'Lighthouse 95+ Optimization', 'Client Feedback Revisions']
        : ['Laporan Pengujian Bug', 'Optimasi Kecepatan (Lighthouse)', 'Revisi Sesuai Feedback'],
      codePreview: `describe("Performance Suite", () => {\n  it("ensures sub-1.5s load times", () => {\n    expect(pageLoadTime).toBeLessThan(1500);\n  });\n});`
    },
    {
      step: '05',
      title: 'Deployment',
      tag: language === 'en' ? 'Phase 5: Production Launch' : 'Fase 5: Peluncuran Sistem',
      description: language === 'en'
        ? 'Zero-downtime deployment to secure cloud production servers (Vercel, AWS, Cloudflare, or VPS Cloud) with automated SSL.'
        : 'Meluncurkan produk digital Anda ke server produksi yang aman dan terkonfigurasi dengan baik (seperti Vercel, AWS, atau VPS Cloud).',
      deliverables: language === 'en'
        ? ['Live Production Server', 'Domain & SSL Setup', 'Automated Backup Strategy']
        : ['Aplikasi Live di Produksi', 'Konfigurasi Domain & SSL', 'Backup Database Awal'],
      codePreview: `pnpm run build\n# Target: Production Cloud Cluster\n# SSL & Custom Domain Connected\n# Status: 100% Live & Available`
    },
    {
      step: '06',
      title: 'Maintenance',
      tag: language === 'en' ? 'Phase 6: Support & Warranty' : 'Fase 6: Pendampingan & Pemeliharaan',
      description: language === 'en'
        ? 'Continuous support, server health monitoring, bug-fixing warranty, and periodic technical patches.'
        : 'Memberikan pendampingan berkelanjutan pasca-peluncuran berupa pemeliharaan server, perbaikan bug jika ada, dan pembaruan sistem berkala.',
      deliverables: language === 'en'
        ? ['24/7 Uptime Monitoring', 'Security Patches', 'Dedicated Tech Support']
        : ['Pemantauan Server Rutin', 'Pembaruan Patch Keamanan', 'Bantuan Teknis Berkala'],
      codePreview: `{\n  "phase": "MAINTENANCE",\n  "status": "ACTIVE",\n  "uptime": "99.98%",\n  "security": "LATEST_PATCHES"\n}`
    }
  ];

  // Contact form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Web App',
    scope: 'medium',
    details: '',
    honeypot: '',
  });

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('timurdian.business@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
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

  const projectList = (projects && projects.length > 0) ? projects : MOCK_PROJECTS;

  return (
    <div className="space-y-24 sm:space-y-32 text-slate-900 font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">

      {/* =========================================================================
          SECTION 1: HERO SECTION (#hero-section) - FULLHEIGHT 1 SECTION
          ========================================================================= */}
      <section
        id="hero-section"
        className="relative min-h-[calc(100vh-7.5rem)] flex flex-col items-center justify-between text-center max-w-4xl mx-auto py-8 sm:py-12 overflow-visible"
      >
        {/* Main Center Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 w-full">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight leading-[1.12] text-slate-900">
              {t.hero.title}{' '}
              <span className="text-blue-600 inline-block">
                {t.hero.titleHighlight}
              </span>.
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              {t.hero.subtitle}
            </p>
          </motion.div>

          {/* Hero CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto"
          >
            <button
              onClick={() => scrollToId('contact-section')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              id="hero-btn-book-call"
            >
              <span>{t.hero.btnPrimary}</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToId('projects-section')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              id="hero-btn-view-projects"
            >
              <span>{t.hero.btnSecondary}</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Bottom Anchor / Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="pt-6 flex flex-col items-center gap-1.5 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors select-none"
          onClick={() => scrollToId('client-portal-section')}
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-slate-400">
            {language === 'en' ? 'Scroll to explore' : 'Scroll ke bawah'}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon icon="ph:caret-down-bold" className="w-3.5 h-3.5 text-blue-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: CLIENT PORTAL SHOWCASE (#client-portal-section)
          ========================================================================= */}
      <motion.section
        id="client-portal-section"
        className="space-y-12 pt-4 pb-12 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.clientPortal?.eyebrow || "FITUR UNGGULAN"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.clientPortal?.title || "Pantau Progress Proyek Anda, Kapan Saja"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            {t.clientPortal?.subtitle || "Setiap klien mendapat akses ke portal khusus untuk memantau progress pengerjaan, milestone, hingga invoice — tanpa perlu menunggu update manual atau bertanya 'sampai mana progressnya?'"}
          </p>
        </div>

        {/* 3D Perspective Client Portal Window Mockup */}
        <ClientPortalMockup3D t={t} />

        {/* 3 Interactive Portal Value Proposition Cards with Live Micro-UI Previews */}
        <div className="pt-4 text-left max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Feature Card 1: Progress Real-Time */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      01
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                      Live Tracking
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon icon="ph:chart-line-up-duotone" className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-sans font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {t.clientPortal?.point1Title || "Progress Real-Time"}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {t.clientPortal?.point1Desc || "Lihat status setiap fase pengerjaan — dari planning, development, hingga testing."}
                </p>
              </div>

              {/* Micro-UI Preview: Mini Interactive Milestone Stepper */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[10px]">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] font-bold">
                  <span>PHASE STATUS</span>
                  <span className="text-blue-600 font-bold">88% ACTIVE</span>
                </div>
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      UI/UX & DB Setup
                    </span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Done</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                    <span className="text-blue-900 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                      Frontend & API
                    </span>
                    <span className="text-[9px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold">In Progress</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Card 2: Invoice & Pembayaran Transparan */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      02
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                      Billing & Invoices
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon icon="ph:receipt-duotone" className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-sans font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {t.clientPortal?.point2Title || "Invoice & Pembayaran Transparan"}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {t.clientPortal?.point2Desc || "Riwayat billing dan status pembayaran tercatat jelas, tidak ada biaya tersembunyi."}
                </p>
              </div>

              {/* Micro-UI Preview: Mini Invoice Digital Receipt */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[10px]">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] font-bold">
                  <span>LAST INVOICE</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Icon icon="ph:shield-check-fill" className="w-3 h-3" />
                    PAID 100%
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-900">INV-202607-001</p>
                    <p className="text-[9px] text-slate-500 font-mono">Termin 1 • Verified</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[9px] flex items-center gap-1">
                    <Icon icon="ph:download-simple-bold" className="w-2.5 h-2.5" />
                    PDF
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Feature Card 3: Update Tanpa Perlu Bertanya */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      03
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                      Instant Alerts
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon icon="ph:bell-simple-ringing-duotone" className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-sans font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {t.clientPortal?.point3Title || "Update Tanpa Perlu Bertanya"}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {t.clientPortal?.point3Desc || "Setiap milestone selesai, Anda mendapat notifikasi — bukan Anda yang harus mengejar update."}
                </p>
              </div>

              {/* Micro-UI Preview: Mini Push Notification Toast */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[10px]">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] font-bold">
                  <span>DISPATCH CHANNELS</span>
                  <span className="text-slate-600 flex items-center gap-1 font-mono">WA • Email</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:check-circle-duotone" className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-900 truncate">Milestone 2 Completed</p>
                    <p className="text-[8px] text-slate-500">Staging URL ready for preview</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 3: ABOUT / NARRATIVE SECTION (#about-section) - CARDLESS EDITORIAL
          ========================================================================= */}
      <motion.section
        id="about-section"
        className="space-y-10 pt-6 pb-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        {/* Standard Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.about?.eyebrow || "TENTANG SAYA"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.about?.title || (language === 'en' ? 'Background & Work Approach' : 'Latar Belakang & Cara Kerja')}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            {t.about?.subtitle ||
              (language === 'en'
                ? '5 years of managing operational systems taught me to build neat, stable, and user-friendly software tailored to your business needs.'
                : '5 tahun menangani sistem operasional membuat saya terbiasa membangun software yang rapi, stabil, dan mudah digunakan untuk kebutuhan bisnis Anda.')}
          </p>
        </div>

        {/* Cardless Narrative Flow (3 Editorial Rows separated by thin baseline rules) */}
        <div className="space-y-0 divide-y divide-slate-200 text-left pt-2">
          {/* Narrative Item 01: Manufacturing Heritage */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                {t.about?.phase1Label || (language === 'en' ? '01 / BACKGROUND' : '01 / LATAR BELAKANG')}
              </span>
              <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900">
                {t.about?.phase1Title || (language === 'en' ? '5 Years in Operations & ERP Systems' : '5 Tahun di Sistem Operasional & ERP')}
              </h3>
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className="text-sm sm:text-base text-slate-700 font-sans leading-relaxed">
                {t.about?.p1 || (language === 'en'
                  ? 'During my 5 years as a software developer in manufacturing, I regularly managed ERP, inventory, and production workflows used daily by operational teams.'
                  : 'Selama 5 tahun sebagai software developer di industri manufaktur, saya terbiasa mengelola sistem seperti ERP, inventori, dan alur produksi yang digunakan setiap hari oleh tim operasional.')}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-500 pt-1">
                {(t.about?.phase1Tags || (language === 'en'
                  ? ['Well-Organized Data', 'Stable & Minimal Errors', 'Familiar with Operations']
                  : ['Data Tertata Rapi', 'Sistem Stabil & Minim Kendala', 'Terbiasa dengan Kebutuhan Operasional']
                )).map((tag: string, idx: number) => (
                  <span key={idx}>• {tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Narrative Item 02: Core Philosophy */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
                {t.about?.phase2Label || (language === 'en' ? '02 / CORE PRINCIPLE' : '02 / PRINSIP UTAMA')}
              </span>
              <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900">
                {t.about?.phase2Title || (language === 'en' ? 'Practical & Purpose-Built Systems' : 'Sistem yang Praktis & Tepat Guna')}
              </h3>
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className="text-sm sm:text-base text-slate-700 font-sans leading-relaxed">
                {t.about?.p2 || (language === 'en'
                  ? 'From that experience I learned: the best systems aren\'t the most complex, but the ones that are easy to understand, pleasant to use, and truly helpful in daily work.'
                  : 'Dari pengalaman itu saya belajar: sistem terbaik bukan yang paling rumit, tetapi yang mudah dipahami, nyaman digunakan, dan benar-benar membantu pekerjaan harian.')}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-500 pt-1">
                {(t.about?.phase2Tags || (language === 'en'
                  ? ['Focus on Real Solutions', 'Easy Long-Term Maintenance', 'Pleasant for Your Team']
                  : ['Fokus Solusi Nyata', 'Mudah Dirawat ke Depan', 'Nyaman Digunakan Tim']
                )).map((tag: string, idx: number) => (
                  <span key={idx}>• {tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Narrative Item 03: Modern Studio Delivery */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                {t.about?.phase3Label || (language === 'en' ? '03 / HOW I WORK' : '03 / CARA KERJA')}
              </span>
              <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900">
                {t.about?.phase3Title || (language === 'en' ? 'Approach at SejatiDimedia' : 'Pendekatan di SejatiDimedia')}
              </h3>
            </div>
            <div className="md:col-span-8 space-y-3">
              <p className="text-sm sm:text-base text-slate-700 font-sans leading-relaxed">
                {t.about?.p3 || (language === 'en'
                  ? 'At SejatiDimedia, I apply the same principles: clean code, direct developer communication, and clear, transparent progress updates.'
                  : 'Di SejatiDimedia, saya menerapkan prinsip yang sama: penulisan kode yang rapi, komunikasi langsung tanpa perantara, dan laporan progres yang jelas dan terbuka.')}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-500 pt-1">
                {(t.about?.phase3Tags || (language === 'en'
                  ? ['100% Code Ownership', 'Direct Developer Discussion', 'Client Portal Tracking']
                  : ['Kode Sepenuhnya Milik Anda', 'Diskusi Langsung dengan Developer', 'Pantau Progres di Portal Klien']
                )).map((tag: string, idx: number) => (
                  <span key={idx}>• {tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 4: SERVICES GRID (#capabilities-section / #services-section)
          ========================================================================= */}
      <motion.section
        id="capabilities-section"
        className="space-y-12 pt-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.nav.services}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.nav.services}{' '}
            <span className="text-blue-600">
              {t.services.mainHeadingHighlight}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.services.desc}
          </p>
        </div>

        {/* Interactive Accordion Services List */}
        <div className="max-w-5xl mx-auto space-y-4 pt-2">
          {(t.services.items || []).map((item: any, idx: number) => {
            const isOpen = openServiceIndex === idx;
            const itemNum = `(${String(idx + 1).padStart(2, '0')})`;
            const imageSrc = SERVICE_IMAGES[idx] || '/service_web_app.jpg';

            return (
              <div
                key={idx}
                onClick={() => setOpenServiceIndex(isOpen ? null : idx)}
                className={`rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer ${isOpen
                  ? 'bg-white border-2 border-blue-500/60 shadow-md p-6 sm:p-8 text-slate-900 relative'
                  : 'bg-white border border-slate-200 hover:border-blue-300 p-5 sm:p-6 hover:bg-slate-50/80 shadow-xs'
                  }`}
              >
                {isOpen ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Left: Number & Title (4 cols) */}
                      <div className="lg:col-span-4 space-y-2 text-left">
                        <span className="font-mono text-xs sm:text-sm font-bold text-blue-600">
                          {itemNum}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {/* Center: Image Mockup (5 cols) */}
                      <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="w-full h-44 sm:h-52 object-cover object-center"
                        />
                      </div>

                      {/* Right: Description & CTA (3 cols) */}
                      <div className="lg:col-span-3 space-y-4 text-left flex flex-col justify-between h-full">
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToId('contact-section');
                            }}
                            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                          >
                            <span>{language === 'en' ? 'Contact Us' : 'Hubungi Kami'}</span>
                            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Collapse Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenServiceIndex(null);
                      }}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                      title="Collapse"
                    >
                      <Icon icon="ph:minus-bold" className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 text-left">
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-400">
                        {itemNum}
                      </span>
                      <h3 className="text-lg sm:text-xl font-sans font-bold text-slate-800">
                        {item.title}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-blue-600 bg-blue-50 shrink-0 shadow-xs">
                      <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 5: TECH STACK RADIAL HUB (#technology-section)
          ========================================================================= */}
      <motion.section
        id="technology-section"
        className="space-y-12 pt-6 relative overflow-hidden max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        {/* Mobile Header (Below MD) */}
        <div className="space-y-3 block md:hidden text-left">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.tech.badge || "Teknologi"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 leading-tight">
            {t.tech.mainHeading}{' '}
            <span className="text-blue-600">
              {t.tech.mainHeadingHighlight}
            </span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            {t.tech.desc}
          </p>
        </div>

        {/* Desktop Circular Radial Hub Layout (MD & Up) */}
        <div className="hidden md:block relative max-w-6xl mx-auto py-6 px-2 sm:px-4">
          <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column: 3 Category Cards */}
            <div className="col-span-4 space-y-5 text-left">
              {/* Frontend Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    Frontend
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:layout-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.frontendDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    {t.tech.database}
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:database-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.databaseDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    {t.tech.infra}
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:cloud-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.infraDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["Docker", "AWS", "Google Cloud", "Firebase"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Hub Stage */}
            <div className="col-span-4 flex flex-col items-center justify-center relative py-6 px-4">
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 200 400" preserveAspectRatio="none">
                <line x1="0" y1="60" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="200" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="340" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="60" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="340" x2="100" y2="200" stroke="rgba(74, 133, 217, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>

              <div className="w-44 h-44 lg:w-48 lg:h-48 rounded-full bg-white border-2 border-blue-400 shadow-lg flex flex-col items-center justify-center text-center p-5 relative z-20 group">
                <div className="absolute -inset-5 rounded-full border border-dashed border-blue-400/40 animate-[spin_20s_linear_infinite] pointer-events-none flex items-center justify-center">
                  <div className="absolute -top-1.5 w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
                  <div className="absolute -bottom-1.5 w-3 h-3 rounded-full bg-blue-400 shadow-xs" />
                </div>

                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold mb-1.5 shadow-xs">
                  <Icon icon="ph:cpu-duotone" className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600 mb-0.5">
                  Tech Stack
                </span>
                <h3 className="text-sm lg:text-base font-sans font-bold text-slate-900 leading-tight">
                  Stack Of<br />Technology
                </h3>
              </div>
            </div>

            {/* Right Column: 3 Category Cards */}
            <div className="col-span-4 space-y-5 text-left">
              {/* Backend & API Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    {t.tech.backend}
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:hard-drives-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.backendDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["Laravel", "Node.js", "Golang", "Python", "Express", "GraphQL"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    {t.tech.mobile}
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:device-mobile-speaker-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.mobileDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["React Native", "Flutter"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Third-Party Integration Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-sans font-bold text-slate-900">
                    {t.tech.integrationTitle}
                  </h3>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:share-network-duotone" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 font-sans leading-relaxed">{t.tech.integrationDesc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {["Rest API", "Payment Integration", "Cloud Storage", "OAuth Providers"].map((tech) => (
                    <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Responsive Fallback Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 block md:hidden text-left pt-2">
          {/* Frontend */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-bold text-slate-900">Frontend</h3>
              <Icon icon="ph:layout-duotone" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.frontendDesc}</p>
            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
              {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-bold text-slate-900">{t.tech.backend}</h3>
              <Icon icon="ph:hard-drives-duotone" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.backendDesc}</p>
            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
              {["Laravel", "Node.js", "Golang", "Python", "Express", "GraphQL"].map((tech) => (
                <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Database */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-bold text-slate-900">{t.tech.database}</h3>
              <Icon icon="ph:database-duotone" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.databaseDesc}</p>
            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
              {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-bold text-slate-900">{t.tech.mobile}</h3>
              <Icon icon="ph:device-mobile-speaker-duotone" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.mobileDesc}</p>
            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
              {["React Native", "Flutter"].map((tech) => (
                <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                  <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 6: FEATURED PROJECTS / PORTFOLIO (#projects-section)
          ========================================================================= */}
      <motion.section
        id="projects-section"
        className="space-y-12 pt-12 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
          <div className="space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
              <span>{t.nav.portfolio}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.portfolio.mainHeading}{' '}
              <span className="text-blue-600">
                {t.portfolio.mainHeadingHighlight}
              </span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-sans font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
          >
            <span>{t.portfolio.viewAll}</span>
            <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {projectList.slice(0, 6).map((project) => {
            const isDummy = !project.thumbnail ||
              project.thumbnail.trim() === "" ||
              project.thumbnail === "/thumbnail.png" ||
              project.thumbnail === "/placeholder.png";
            const displayThumbnail = (isDummy || !project.thumbnail ? "/logo.svg" : project.thumbnail) as string;

            return (
              <div
                key={project.slug}
                className="group flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <Image
                      src={displayThumbnail}
                      alt={project.name}
                      fill
                      className={isDummy ? "object-contain p-8" : "object-cover group-hover:scale-105 transition-transform duration-500"}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
                        {project.status === 'COMPLETE' ? 'Completed' : 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-sans font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-sans">
                      {language === 'en'
                        ? (project.summaryEn || project.descriptionEn || project.summary || project.description)
                        : (project.summaryId || project.descriptionId || project.summary || project.description)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-slate-100 mt-4">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <div key={tech} className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>

                  {/* View details button */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-xs font-bold text-slate-800 transition-all border border-slate-200 hover:border-blue-600"
                  >
                    <span>{t.portfolio.viewProject}</span>
                    <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 7: PRICING & GUARANTEE (#pricing-section)
          ========================================================================= */}
      <motion.section
        id="pricing-section"
        className="space-y-16 pt-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold text-center">
            <span>{t.pricing.label}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.pricing.badge}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.pricing.desc}
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto pt-2 text-left">
          {/* Card 1: Starter */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    {t.pricingCards.starterTag}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-slate-900">
                    {t.pricingCards.starterTitle}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Icon icon="ph:trophy-duotone" className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pricingCards.starterDesc}
              </p>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-sans font-bold text-slate-900">Rp 3–7 Jt</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">/ proyek</span>
              </div>

              <button
                onClick={() => selectPlan('Full-Stack Web App', 'SaaS MVP (Fast Turnaround)')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-800 transition-all cursor-pointer text-center"
              >
                {t.pricing.starterBtn || "Mulai dari Sini"}
              </button>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {t.pricingCards.starterIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Growth (Featured) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-lg flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Icon icon="ph:crown-duotone" className="w-3 h-3" />
              {language === 'en' ? 'Most Popular' : 'Paling Populer'}
            </div>

            <div className="space-y-5">
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                  {t.pricingCards.growthTag}
                </span>
                <h3 className="text-lg font-sans font-bold text-slate-900">
                  {t.pricingCards.growthTitle}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pricingCards.growthDesc}
              </p>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-sans font-bold text-slate-900">Rp 10 Jt+</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">/ proyek</span>
              </div>

              <button
                onClick={() => selectPlan('Full-Stack Web App', 'Medium Scale Production')}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 cursor-pointer text-center"
              >
                {t.pricing.growthBtn || "Diskusikan Proyek Anda"}
              </button>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {t.pricingCards.growthIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Custom */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    {t.pricingCards.customTag}
                  </span>
                  <h3 className="text-lg font-sans font-bold text-slate-900">
                    {t.pricingCards.customTitle}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Icon icon="hugeicons:customize" className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pricingCards.customDesc}
              </p>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-sans font-bold text-slate-900">Custom</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">/ scope</span>
              </div>

              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-800 transition-all cursor-pointer text-center"
              >
                {t.pricing.customBtn || "Ceritakan Kebutuhan Anda"}
              </button>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {t.pricingCards.customIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 8: TRUST & VALUE PROPS (#features-section)
          ========================================================================= */}
      <motion.section
        id="features-section"
        className="space-y-12 pt-12 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="text-left space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.trust?.badge || "Kenapa Klien Percaya"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.trust?.mainHeading || "Kenapa Klien Percaya"}{' '}
            <span className="text-blue-600">
              {t.trust?.mainHeadingHighlight || "Bekerja Sama Dengan Saya"}
            </span>
          </h2>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {(t.trust?.items || []).map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <Icon icon={TRUST_ICONS[idx]} className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-sans font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 9: THE PROCESSES / METHODOLOGY STEPPER (#methodology-section)
          ========================================================================= */}
      <motion.section
        id="methodology-section"
        className="space-y-12 pt-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="space-y-4 text-left">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.process.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-bold tracking-tight leading-[1.15] text-slate-900 max-w-2xl">
            {t.process.mainHeading}
          </h2>
        </div>

        {/* Dynamic Split Layout matching reference layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Clean vertical list with line delimiters (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            {MILESTONES.map((milestone, idx) => {
              const isActive = activeMilestone === idx;
              return (
                <button
                  key={milestone.step}
                  onClick={() => setActiveMilestone(idx)}
                  className={`w-full py-4 text-left cursor-pointer border-b transition-all duration-300 flex items-center justify-between group ${isActive ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  id={`processes-step-${milestone.step}`}
                >
                  <span
                    className={`text-base font-sans font-bold transition-all duration-300 ${isActive
                      ? 'text-blue-600 translate-x-1.5'
                      : 'text-slate-600 group-hover:text-slate-900 group-hover:translate-x-1'
                      }`}
                  >
                    {t.milestones[idx].title}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold transition-colors flex items-center gap-2 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                  >
                    <Icon icon={MILESTONE_ICONS[idx]} className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Giant display digits details (6 cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex-grow flex flex-col justify-between relative z-10 text-left"
              >
                <div className="space-y-6">
                  {/* Giant floating number digits in primary color */}
                  <div className="text-8xl sm:text-9xl font-sans font-bold tracking-tighter leading-none bg-gradient-to-b from-blue-600 to-transparent bg-clip-text text-transparent select-none opacity-85">
                    {MILESTONES[activeMilestone].step}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-sans font-bold text-slate-900">
                      {t.milestones[activeMilestone].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg font-sans">
                      {t.milestones[activeMilestone].description}
                    </p>
                  </div>
                </div>

                {/* Solid Rectangle Button 'GET STARTED' */}
                <div>
                  <button
                    onClick={() => scrollToId('contact-section')}
                    className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 group/btn"
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

      {/* =========================================================================
          SECTION 10: FAQ SECTION (#faq-section)
          ========================================================================= */}
      <motion.section
        id="faq-section"
        className="space-y-16 pt-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto text-left">
          {/* Left Column: Ask Box */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-3">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
                <span>FAQ</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
                {t.faq.mainHeading}
              </h2>
            </div>

            {/* Any Question Form */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-sans font-bold text-slate-900">{t.faq.askTitle}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.faq.askDesc}
                </p>
              </div>

              {!questionSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customQuestion.trim()) return;
                    setQuestionSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <label htmlFor="custom-q-input" className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
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
                      className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                      aria-label="Submit question"
                    >
                      <Icon icon="ph:paper-plane-tilt-fill" className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <Icon icon="ph:check-circle-fill" className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-900">Pertanyaan Terkirim!</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Terima kasih. Pertanyaan Anda akan direspons dalam waktu <span className="font-semibold text-blue-600">12 jam</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuestionSubmitted(false);
                      setCustomQuestion('');
                    }}
                    className="text-[10px] font-mono uppercase tracking-wider text-blue-600 hover:underline cursor-pointer"
                  >
                    Kirim pertanyaan lain
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {t.faq.items.map((faq, idx) => {
              const isExpanded = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded
                    ? 'bg-white border-blue-500/60 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <button
                    onClick={() => setActiveFaq(isExpanded ? null : idx)}
                    className="w-full px-5 py-4 text-left font-sans font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer select-none"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.q}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
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
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
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

      {/* =========================================================================
          SECTION 11: CONSULTATION / CONTACT FORM (#contact-section)
          ========================================================================= */}
      <motion.section
        id="contact-section"
        className="space-y-10 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        {/* Standard Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-blue-600 font-bold">
            <span>{t.contact.badge || "KONTAK & KONSULTASI"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
            {t.contact.mainHeading}{' '}
            <span className="text-blue-600">
              {t.contact.mainHeadingHighlight}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            {t.contact.desc}
          </p>
        </div>

        {/* Master Card Wrapper */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10 md:p-12 relative overflow-hidden">
          {/* 2-Column Luxury Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 text-left items-start">
            {/* Left Column: Direct Communication Channels & Value Commitments (4.5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 mt-18">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-slate-900 leading-snug">
                  {language === 'en' ? 'Need a quick answer or consultation?' : 'Perlu konsultasi atau respons lebih cepat?'}
                </h3>
              </div>

              {/* Direct Channel Tiles */}
              <div className="space-y-3.5">
                {/* WhatsApp Fast-Track */}
                <a
                  href="https://wa.me/6289508436275?text=Halo%20SejatiDimedia,%20saya%20ingin%20berkonsultasi%20mengenai%20proyek%20aplikasi."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-500/80 hover:bg-emerald-50/20 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                      <Icon icon="ic:baseline-whatsapp" className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">WhatsApp Direct</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold">Fast Response</span>
                      </div>
                      <div className="text-sm font-sans font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">+62 895-0843-6275</div>
                    </div>
                  </div>
                  <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* Email Direct with 1-Click Copy */}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-500/80 hover:bg-blue-50/20 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:envelope-simple-fill" className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Email Kontak</div>
                      <div className="text-xs sm:text-sm font-sans font-bold text-slate-900 truncate">
                        sejatidimedia@gmail.com
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-200"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="ph:copy-bold" className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Freelance Platform Direct Badges */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  <span>{language === 'en' ? 'FREELANCE PLATFORMS' : 'SALURAN PLATFORM LAIN'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Upwork Capsule */}
                  <a
                    href="https://www.upwork.com/freelancers/~017698b392e21b4b6c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-500/70 hover:shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-100/70 text-[#14A800] flex items-center justify-center shrink-0 group-hover:bg-[#14A800] group-hover:text-white transition-all">
                        <Icon icon="simple-icons:upwork" className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-sans font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                        Upwork
                      </span>
                    </div>
                    <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>

                  {/* Fastwork Capsule */}
                  <a
                    href="https://fastwork.id/en/user/timurradhadian?source=web_marketplace_profile-menu_profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-500/70 hover:shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-sans font-bold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                        Fastwork
                      </span>
                    </div>
                    <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Form (7.5 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <form
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                    id="contact-form-element"
                  >
                    {/* Honeypot */}
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
                      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                        <Icon icon="ph:warning-circle-fill" className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Section 01: Name and Email in Luxury Modular Surfaces */}
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        01 // IDENTITAS & KONTAK
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-2xs space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block" htmlFor="form-name">
                            {t.contact.formNameLabel} <span className="text-blue-600">*</span>
                          </label>
                          <div className="flex items-center gap-2.5">
                            <Icon icon="ph:user-bold" className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              id="form-name"
                              type="text"
                              required
                              placeholder={t.contact.formNamePlaceholder}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-2xs space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block" htmlFor="form-email">
                            {t.contact.formEmailLabel} <span className="text-blue-600">*</span>
                          </label>
                          <div className="flex items-center gap-2.5">
                            <Icon icon="ph:envelope-simple-bold" className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              id="form-email"
                              type="email"
                              required
                              placeholder={t.contact.formEmailPlaceholder}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 02: Service Selection (Rich Interactive Vector Chips) */}
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        02 // PILIH JENIS LAYANAN
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          {
                            id: 'Full-Stack Web App',
                            label: t.contact.formService1Title || 'Web Application',
                            desc: t.contact.formService1Desc || 'SaaS & Dashboard',
                            icon: 'ph:browsers-duotone'
                          },
                          {
                            id: 'Native iOS/Android App',
                            label: t.contact.formService2Title || 'Mobile App',
                            desc: t.contact.formService2Desc || 'iOS & Android',
                            icon: 'ph:device-mobile-camera-duotone'
                          },
                          {
                            id: 'API Gateway & Cloud Integration',
                            label: t.contact.formService3Title || 'REST API & Cloud',
                            desc: t.contact.formService3Desc || 'Backend & Database',
                            icon: 'ph:cloud-arrow-up-duotone'
                          },
                          {
                            id: 'AI & LLM Integration',
                            label: t.contact.formService4Title || 'Integrasi AI / LLM',
                            desc: t.contact.formService4Desc || 'Custom AI Agent & Automasi',
                            icon: 'ph:sparkle-duotone'
                          }
                        ].map((svc) => {
                          const isSelected = formData.service === svc.id;
                          return (
                            <button
                              type="button"
                              key={svc.id}
                              onClick={() => setFormData({ ...formData, service: svc.id })}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected
                                ? 'bg-blue-50/90 border-2 border-blue-600 text-blue-950 shadow-2xs'
                                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                                }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                                  }`}>
                                  <Icon icon={svc.icon} className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-sans font-bold truncate">{svc.label}</div>
                                  <div className="text-[10px] text-slate-500 truncate">{svc.desc}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <Icon icon="ph:check-bold" className="w-3 h-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 03: Project Scale (Interactive 3-Pill Switcher) */}
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        03 // ESTIMASI SKALA PROYEK
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'MVP / Starter',
                            label: t.contact.formScope1Title || 'MVP / Starter',
                            desc: t.contact.formScope1Desc || 'Validasi Cepat',
                            icon: 'ph:rocket-launch-duotone'
                          },
                          {
                            id: 'Medium Scale Production',
                            label: t.contact.formScope2Title || 'Skala Menengah',
                            desc: t.contact.formScope2Desc || 'Sistem Bisnis',
                            icon: 'ph:chart-line-up-duotone'
                          },
                          {
                            id: 'High-Scale Custom Architecture',
                            label: t.contact.formScope3Title || 'Custom / Enterprise',
                            desc: t.contact.formScope3Desc || 'Arsitektur Besar',
                            icon: 'ph:buildings-duotone'
                          }
                        ].map((sc) => {
                          const isSelected = formData.scope === sc.id;
                          return (
                            <button
                              type="button"
                              key={sc.id}
                              onClick={() => setFormData({ ...formData, scope: sc.id })}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${isSelected
                                ? 'bg-slate-900 border-2 border-slate-900 text-white shadow-2xs'
                                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-sans font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{sc.label}</span>
                                <Icon icon={sc.icon} className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`} />
                              </div>
                              <span className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{sc.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 04: Project Details Textarea */}
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        04 // DETAIL & KEBUTUHAN KHUSUS
                      </span>
                      <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-2xs space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block" htmlFor="form-details">
                          {t.contact.formDetailsLabel}
                        </label>
                        <textarea
                          id="form-details"
                          rows={3}
                          placeholder={t.contact.formDetailsPlaceholder}
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Submit Button & Guarantees */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-sans font-bold tracking-wider shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                        id="btn-submit-contact"
                      >
                        {formSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Mengirim Pesan...</span>
                          </span>
                        ) : (
                          <>
                            <span>{t.contact.formSubmit}</span>
                            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="py-14 px-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                      <Icon icon="ph:check-circle-fill" className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-sans font-bold text-slate-900">{t.contact.formSubmitSuccess}</h4>
                      <p className="text-xs text-slate-600 max-w-sm leading-relaxed mx-auto">
                        {t.contact.formSubmitSuccessDesc}
                      </p>
                    </div>

                    <div className="pt-3 flex flex-col items-center gap-3">
                      <a
                        href={`https://wa.me/6289508436275?text=Halo%20SejatiDimedia,%20saya%20${encodeURIComponent(formData.name || 'Klien')}%20ingin%20berdiskusi%20tentang%20project%20${encodeURIComponent(formData.service || 'Web App')}%20yang%20baru%20saya%20ajukan.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <Icon icon="ic:baseline-whatsapp" className="w-4 h-4" />
                        <span>Hubungi Langsung via WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setFormSubmitted(false)}
                        className="text-[10px] font-mono text-slate-500 hover:text-blue-600 underline cursor-pointer"
                      >
                        Kirim Pesan Lain / Reset Form
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
