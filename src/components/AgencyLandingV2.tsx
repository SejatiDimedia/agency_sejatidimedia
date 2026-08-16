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
  '/service_web_app.webp',
  '/service_mobile_app.webp',
  '/service_saas_app.webp',
  '/service_ai_llm.webp',
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
          className="absolute inset-0 bg-[#2C5098]/10 rounded-3xl blur-2xl transform translate-y-8 scale-95 pointer-events-none -z-10"
        />

        {/* Floating Badge #1 (Top Right) - High Z-Depth Layer */}
        <div
          style={{ transform: "translateZ(65px)", transformStyle: "preserve-3d" }}
          className="absolute -top-6 right-2 sm:right-6 z-50 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="px-4 py-2 rounded-2xl bg-white border border-[#2C5098]/20 shadow-2xl flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center shrink-0 shadow-xs">
              <Icon icon="ph:clock-clockwise-bold" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-none">24/7 Live Tracking</p>
              <p className="text-[8px] font-medium text-[#2C5098] mt-0.5 hidden sm:block">Real-Time Development Status</p>
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
          className="w-full p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl hover:border-[#2C5098]/40 transition-colors duration-300 space-y-3.5 relative overflow-hidden text-left"
        >
          {/* Moving Laser Shimmer Light Line along top border */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] w-48 bg-gradient-to-r from-transparent via-[#2C5098] to-transparent z-30 pointer-events-none"
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
                    <Icon icon="ph:lock-key-duotone" className="w-3 h-3 text-[#2C5098] shrink-0" />
                    sejatidimedia.web.id/portal/projects
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Tab Pills */}
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 flex items-center gap-1">
                <Icon icon="ph:squares-four-duotone" className="w-3 h-3 text-[#2C5098]" />
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
                <div className="w-8 h-8 rounded-xl bg-[#2C5098]/10 border border-[#2C5098]/20 flex items-center justify-center text-[#2C5098] shrink-0">
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
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white border border-white/20 shrink-0 shadow-xs"
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
              <div className="flex items-center gap-1.5 text-[#23385B] bg-[#2C5098]/10 p-2 rounded-xl border border-[#2C5098]/20 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#2C5098] animate-pulse shrink-0" />
                <span>Phase 4: QA & Production Release</span>
              </div>
            </div>

            {/* Animated Breathing Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2C5098] via-[#284478] to-[#23385B] rounded-full"
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
                <Icon icon="ph:receipt-duotone" className="w-3.5 h-3.5 text-[#2C5098]" />
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
              <div className="bg-[#2C5098]/8 p-2 sm:p-2.5 rounded-xl border border-[#2C5098]/20 shadow-xs relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2C5098]/15 to-transparent pointer-events-none"
                  animate={{ x: ['-100%', '150%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-[8px] sm:text-[9px] font-bold text-[#23385B] uppercase">Amount Paid</p>
                <p className="text-xs sm:text-sm font-bold text-[#23385B] mt-0.5">Rp 37.2M</p>
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
              <Icon icon="ph:seal-check-duotone" className="w-3.5 h-3.5 text-[#2C5098] shrink-0" />
              <span>INV-202607-001: <strong className="text-slate-900">Paid & Verified</strong></span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[9px] font-bold text-slate-700 flex items-center gap-1 shadow-xs">
              <Icon icon="ph:download-simple-bold" className="w-3 h-3 text-[#2C5098]" />
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
  const [portalActiveTab, setPortalActiveTab] = useState<number>(0);
  const [testAlertSent, setTestAlertSent] = useState<boolean>(false);

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
    <div className="w-full text-slate-900 font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">

      {/* =========================================================================
          SECTION 1: HERO SECTION (#hero-section) - AMBIENT 3D CORE & PURE WHITE
          ========================================================================= */}
      <section
        id="hero-section"
        className="w-full relative overflow-hidden bg-white pt-10 sm:pt-14 pb-16 sm:pb-24 lg:pb-28"
      >
        {/* Minimalist Serene Horizon Background */}
        <div className="absolute inset-x-0 top-0 h-[480px] sm:h-[600px] lg:h-[680px] overflow-hidden pointer-events-none -z-0">
          <img
            src="/hero_minimal_horizon.webp"
            alt="SejatiDimedia Serene Horizon"
            className="w-full h-full object-cover object-top opacity-80"
            fetchPriority="high"
            decoding="async"
          />
          {/* Top Navbar Soft Light Blend */}
          <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-white/80 via-white/30 to-transparent" />
          {/* Bottom Smooth Fade-to-White Transition */}
          <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 lg:h-96 bg-gradient-to-t from-white via-white/90 to-transparent" />
          {/* Soft Side Falloff */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-white/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-white/50 to-transparent" />
        </div>

        {/* Ambient Brand Glow behind Headline */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[280px] bg-gradient-to-br from-[#2C5098]/8 to-[#23385B]/5 rounded-full blur-[100px] pointer-events-none -z-0" />

        <div className="relative z-10 min-h-[calc(100vh-14rem)] flex flex-col items-center justify-between text-center max-w-4xl mx-auto px-4 sm:px-6">
          {/* Main Center Content Container */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 w-full pt-16 sm:pt-24 lg:pt-28">

            {/* Main Headline */}
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight leading-[1.12] text-slate-900 drop-shadow-2xs">
                {t.hero.title}{' '}
                <span className="bg-gradient-to-br from-[#2C5098] via-[#284478] to-[#23385B] bg-clip-text text-transparent inline-block font-extrabold pb-0.5">
                  {t.hero.titleHighlight}
                </span>.
              </h1>
            </div>

            {/* Subheadline */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans font-medium">
                {t.hero.subtitle}
              </p>
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
              <button
                onClick={() => scrollToId('contact-section')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white shadow-lg shadow-[#2C5098]/25 hover:shadow-xl hover:shadow-[#2C5098]/35 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                id="hero-btn-book-call"
              >
                <span>{t.hero.btnPrimary}</span>
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToId('projects-section')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-[#2C5098]/40 shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                id="hero-btn-view-projects"
              >
                <span>{t.hero.btnSecondary}</span>
              </button>
            </div>
          </div>

          {/* Hero Bottom Anchor / Scroll Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="pt-6 flex flex-col items-center gap-1.5 cursor-pointer text-slate-400 hover:text-[#2C5098] transition-colors select-none"
            onClick={() => scrollToId('client-portal-section')}
          >
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-slate-400">
              {language === 'en' ? 'Scroll to explore' : 'Scroll ke bawah'}
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon icon="ph:caret-down-bold" className="w-3.5 h-3.5 text-[#2C5098]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CLIENT PORTAL SHOWCASE (#client-portal-section) - SOFT GRAY (#F8FAFC)
          ========================================================================= */}
      <motion.section
        id="client-portal-section"
        className="w-full bg-[#F8FAFC] border-y border-slate-200/70 py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
          {/* 1. Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
              <span>{t.clientPortal?.eyebrow || "FITUR UNGGULAN"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.clientPortal?.title || (language === 'en' ? 'Every Project Includes a' : 'Setiap Proyek Dilengkapi')}{' '}
              <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent font-extrabold">
                {language === 'en' ? 'Dedicated Client Portal' : 'Portal Klien Khusus'}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
              {t.clientPortal?.subtitle || (language === 'en' ? 'No need to constantly ask for updates. Monitor live progress anytime directly from your browser.' : 'Transparansi total dari hari pertama. Pantau sprint development, tagihan, dan notifikasi instan langsung dari browser Anda.')}
            </p>
          </div>

          {/* 2. Interactive Feature Switcher Tabs (01, 02, 03) */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-4xl mx-auto pt-1">
            {[
              {
                idx: 0,
                num: '01',
                label: t.clientPortal?.point1Title || 'Milestone & Sprint Board',
                shortLabel: 'Milestone Board',
                icon: 'ph:kanban-duotone'
              },
              {
                idx: 1,
                num: '02',
                label: t.clientPortal?.point2Title || 'Invoice & Billing Transparan',
                shortLabel: 'Billing & Invoice',
                icon: 'ph:receipt-duotone'
              },
              {
                idx: 2,
                num: '03',
                label: language === 'en' ? 'Email & In-Portal Alerts' : 'Notifikasi Email & Portal',
                shortLabel: 'Email & Portal',
                icon: 'ph:bell-simple-ringing-duotone'
              }
            ].map((tab) => {
              const isActive = portalActiveTab === tab.idx;
              return (
                <button
                  key={tab.idx}
                  onClick={() => setPortalActiveTab(tab.idx)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-sans text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 sm:gap-2.5 cursor-pointer relative ${isActive
                    ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-md shadow-[#2C5098]/30 scale-[1.02]'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-[#2C5098]/40 hover:bg-slate-50 shadow-2xs'
                    }`}
                >
                  <span className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {tab.num}
                  </span>
                  <Icon icon={tab.icon} className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2C5098]'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Main Interactive Live Showcase Window */}
          <div className="relative flex justify-center items-center py-2 max-w-4xl mx-auto w-full">
            {/* Ambient Background Soft Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-tr from-[#2C5098]/12 via-indigo-50/40 to-[#23385B]/10 rounded-full blur-[90px] pointer-events-none -z-10" />

            {/* Clean macOS Client Portal Window */}
            <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/8 overflow-hidden relative group hover:border-[#2C5098]/50 transition-all duration-300">
              {/* Laser Moving Shimmer Accent */}
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-48 bg-gradient-to-r from-transparent via-[#2C5098] to-transparent z-30"
                animate={{ x: ['-100%', '350%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />

              {/* macOS Browser Header Bar */}
              <div className="px-4 sm:px-6 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-3 sm:gap-4">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-2xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-2xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-2xs" />
                </div>

                {/* Full-width URL address bar */}
                <div className="flex-1 flex items-center gap-2 bg-white px-3 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-mono shadow-2xs min-w-0">
                  <Icon icon="ph:lock-key-duotone" className="w-3.5 h-3.5 text-[#2C5098] shrink-0" />
                  <span className="truncate text-slate-700 font-medium">sejatidimedia.web.id/portal/projects/saas-dashboard</span>
                </div>

                {/* Live 24/7 status badge */}
                <div className="flex items-center shrink-0">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold font-mono shadow-2xs">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Live 24/7
                  </span>
                </div>
              </div>

              {/* Dynamic Viewport based on portalActiveTab (English Illustration Content) */}
              <div className="p-5 sm:p-7 md:p-8 min-h-[380px] flex flex-col justify-between">
                {/* TAB 0: Milestone & Sprint Board */}
                {portalActiveTab === 0 && (
                  <motion.div
                    key="tab-0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    {/* Progress Summary Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 flex items-center justify-center shrink-0 shadow-2xs">
                          <Icon icon="ph:kanban-duotone" className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                            Active Sprint 2: Core Architecture & API Integration
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Client: Timur Dian • Target Release: August 24, 2026
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-3.5 py-1 rounded-xl text-xs font-mono font-black tracking-wide bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white shadow-sm shadow-[#2C5098]/25 border border-white/20 flex items-center gap-1.5">
                          88% Completed
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#2C5098] via-[#284478] to-[#23385B] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '88%' }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>

                    {/* 3 Live Kanban Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {/* Column 1: Completed */}
                      <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase px-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-1 font-mono font-bold">
                            COMPLETED (3)
                          </span>
                          <Icon icon="ph:check-circle-duotone" className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-800 font-medium flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                              <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                            </span>
                            <span>Database ERD & PostgreSQL Schema</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-800 font-medium flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                              <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                            </span>
                            <span>Next.js 15 App Layout Setup</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-800 font-medium flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                              <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                            </span>
                            <span>Figma UI/UX Design Sign-off</span>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: In Progress */}
                      <div className="space-y-2 bg-[#2C5098]/5 p-3 rounded-2xl border border-[#2C5098]/20">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#2C5098] uppercase px-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#2C5098]/10 border border-[#2C5098]/20 text-[#2C5098] flex items-center gap-1 font-mono font-bold">
                            IN PROGRESS (2)
                          </span>
                          <span className="relative flex h-2 w-2 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C5098] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2C5098]" />
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-[#2C5098]/20 shadow-2xs text-[#23385B] font-semibold flex items-center gap-2">
                            <span className="relative flex h-3 w-3 items-center justify-center shrink-0 ml-0.5 mr-0.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C5098] opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2C5098]" />
                            </span>
                            <span>Payment Gateway & Webhook Setup</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-[#2C5098]/20 shadow-2xs text-[#23385B] font-semibold flex items-center gap-2">
                            <span className="relative flex h-3 w-3 items-center justify-center shrink-0 ml-0.5 mr-0.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C5098] opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2C5098]" />
                            </span>
                            <span>REST API & Multi-Tenant Endpoints</span>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Up Next */}
                      <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase px-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-300 text-slate-700 flex items-center gap-1 font-mono font-bold">
                            UP NEXT (2)
                          </span>
                          <Icon icon="ph:clock-duotone" className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-600 font-medium flex items-center gap-2">
                            <Icon icon="ph:circle-dashed" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>QA Stress & Security Test</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-600 font-medium flex items-center gap-2">
                            <Icon icon="ph:circle-dashed" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Production Cutover & SSL</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Commit Status Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Icon icon="ph:git-commit-bold" className="w-3.5 h-3.5 text-[#2C5098]" />
                        Latest: <strong className="text-slate-800">feat(auth): integrate multi-tenant JWT session</strong>
                      </span>
                      <span className="text-slate-400">12 mins ago</span>
                    </div>
                  </motion.div>
                )}

                {/* TAB 1: Billing & Invoices */}
                {portalActiveTab === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">TOTAL CONTRACT</p>
                        <p className="text-lg sm:text-xl font-sans font-extrabold text-slate-900 mt-1">Rp 37,200,000</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Fixed Price • No Hidden Fees</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 relative overflow-hidden">
                        <p className="text-[10px] font-mono font-bold text-emerald-700 uppercase">AMOUNT PAID</p>
                        <p className="text-lg sm:text-xl font-sans font-extrabold text-emerald-800 mt-1">Rp 37,200,000</p>
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                          <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5" />
                          100% Settled & Verified
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">BALANCE DUE</p>
                        <p className="text-lg sm:text-xl font-sans font-extrabold text-slate-900 mt-1">Rp 0</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">All Milestones Settled</p>
                      </div>
                    </div>

                    {/* Invoices Breakdown Table */}
                    <div className="space-y-2.5">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase px-1">
                        OFFICIAL INVOICES & DIGITAL RECEIPTS
                      </div>
                      <div className="space-y-2">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#2C5098]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                              <Icon icon="ph:receipt-duotone" className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-900">INV-202607-001</span>
                                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black tracking-wide bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                                  <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                                  PAID
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Milestone 1: Down Payment (50%) • Rp 18,600,000</p>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#2C5098]/10 text-[#2C5098] border border-slate-200 hover:border-[#2C5098]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-auto">
                            <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#2C5098]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                              <Icon icon="ph:receipt-duotone" className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-900">INV-202608-002</span>
                                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black tracking-wide bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                                  <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                                  PAID
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Milestone 2: Final Handover (50%) • Rp 18,600,000</p>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#2C5098]/10 text-[#2C5098] border border-slate-200 hover:border-[#2C5098]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-auto">
                            <Icon icon="ph:download-simple-bold" className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Guarantee & Verification Seal */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <Icon icon="ph:shield-check-fill" className="w-4 h-4 text-emerald-600" />
                        Protected by 30-Day Bug-Free Guarantee & Digital Encryption
                      </span>
                      <span className="font-mono text-slate-400">Escrow / Direct Transfer Verified</span>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: Real-Time Dispatch & Alerts (Email & In-Portal Feed) */}
                {portalActiveTab === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    {/* Channel Header */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 flex items-center justify-center shrink-0">
                          <Icon icon="ph:bell-simple-ringing-duotone" className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                            Automated Email & In-Portal Updates
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Official email alerts & real-time in-app activity tracking
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 flex items-center gap-1.5 font-mono shadow-2xs">
                        <span className="relative flex h-2 w-2 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        Live Sync Active
                      </span>
                    </div>

                    {/* Live Previews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* In-Portal Activity Feed Card */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Icon icon="ph:broadcast-duotone" className="w-4 h-4 text-[#2C5098]" />
                            In-Portal Live Activity
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            Real-Time
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-wider bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20">
                                MILESTONE COMPLETED
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">10m ago</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900">Sprint 2 Backend & Database Ready</p>
                            <p className="text-[11px] text-slate-500">Staging URL deployed & ready for live preview testing.</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                INVOICE SETTLED
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">1h ago</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900">INV-202607-001 Payment Verified</p>
                            <p className="text-[11px] text-slate-500">Official digital receipt available in Invoices tab.</p>
                          </div>
                        </div>
                      </div>

                      {/* Email Notification Card */}
                      <div className="p-4 rounded-2xl bg-[#2C5098]/5 border border-[#2C5098]/20 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#2C5098]/20">
                          <span className="text-xs font-bold text-[#23385B] flex items-center gap-1.5">
                            <Icon icon="ph:envelope-simple-duotone" className="w-4 h-4 text-[#2C5098]" />
                            Email Notification Digest
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#2C5098]/10 text-[#23385B] border border-[#2C5098]/20">
                            Auto-Dispatch
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-2 text-xs text-slate-800">
                          <div>
                            <p className="text-[10px] font-mono text-slate-400">To: timur@example.com</p>
                            <p className="font-semibold text-slate-900 mt-0.5">[SejatiDimedia] Milestone 2 Completed — Preview Ready</p>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Hello Timur, all Sprint 2 deliverables have passed QA testing. You can review the live staging build at:
                          </p>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] text-[#2C5098] font-bold break-all">
                            https://staging.sejatidimedia.web.id/demo
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Minimalist Inline Key Value Footnote (Bilingual Support) */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 text-xs sm:text-sm font-sans pt-2">
            <div className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Lifetime portal access with zero subscription fees'
                  : 'Akses seumur hidup tanpa biaya langganan'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Automated progress updates upon milestone completion'
                  : 'Update otomatis setiap milestone selesai'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'en'
                  ? '100% transparent billing with no hidden costs'
                  : 'Transparansi 100% tanpa biaya tersembunyi'}
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 3: ABOUT / NARRATIVE SECTION (#about-section) - PURE WHITE (#FFFFFF)
          ========================================================================= */}
      <motion.section
        id="about-section"
        className="w-full bg-white py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          {/* Standard Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
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
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C5098]">
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
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 4: SERVICES GRID (#capabilities-section / #services-section) - SOFT GRAY (#F8FAFC)
          ========================================================================= */}
      <motion.section
        id="capabilities-section"
        className="w-full bg-[#F8FAFC] border-y border-slate-200/70 py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
              <span>{t.nav.services}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.nav.services}{' '}
              <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent">
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
                    ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white shadow-xl shadow-[#2C5098]/25 border border-white/10 p-6 sm:p-8 relative'
                    : 'bg-white border border-slate-200 hover:border-[#2C5098]/40 p-5 sm:p-6 hover:bg-slate-50/80 shadow-xs'
                    }`}
                >
                  {isOpen ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Left: Number & Title (4 cols) */}
                        <div className="lg:col-span-4 space-y-2 text-left">
                          <span className="font-mono text-xs sm:text-sm font-bold text-white/80">
                            {itemNum}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-sans font-bold text-white leading-snug">
                            {item.title}
                          </h3>
                        </div>

                        {/* Center: Image Mockup (5 cols) */}
                        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/20 shadow-md bg-white/10">
                          <img
                            src={imageSrc}
                            alt={item.title}
                            className="w-full h-44 sm:h-52 object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* Right: Description & CTA (3 cols) */}
                        <div className="lg:col-span-3 space-y-4 text-left flex flex-col justify-between h-full">
                          <p className="text-xs text-white/90 leading-relaxed font-sans">
                            {item.desc}
                          </p>
                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToId('contact-section');
                              }}
                              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#23385B] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto hover:text-[#2C5098]"
                            >
                              <span>{language === 'en' ? 'Contact Us' : 'Hubungi Kami'}</span>
                              <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-[#2C5098]" />
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
                        className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all cursor-pointer shadow-xs"
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
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#2C5098] bg-[#2C5098]/10 shrink-0 shadow-xs">
                        <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 5: TECH STACK RADIAL HUB (#technology-section) - PURE WHITE (#FFFFFF)
          ========================================================================= */}
      <motion.section
        id="technology-section"
        className="w-full bg-white py-20 sm:py-28 lg:py-32 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* MOBILE & TABLET HEADER (Below MD) */}
          <div className="space-y-3 block md:hidden text-left">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
              <span>{t.tech.badge || "Teknologi"}</span>
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-sans font-bold tracking-tight leading-[1.12] text-slate-900">
              {t.tech.mainHeading}{' '}
              <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent">
                {t.tech.mainHeadingHighlight}
              </span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-sans">
              {t.tech.desc}
            </p>
          </div>

          {/* DESKTOP CIRCULAR RADIAL HUB LAYOUT (MD & UP) */}
          <div className="hidden md:block relative max-w-6xl mx-auto py-8 px-2 sm:px-4">
            {/* Ambient Radial Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

            {/* Hub Stage: 3 Columns Grid (Left 4 Cols - Center Spaced Hub 4 Cols - Right 4 Cols) */}
            <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
              {/* LEFT COLUMN: 3 Category Cards (col-span-4) */}
              <div className="col-span-4 space-y-6 text-left">
                {/* Card 1: Frontend */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      Frontend
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:layout-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.frontendDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card 3: Database */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      {t.tech.database}
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:database-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.databaseDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card 5: Infrastructure */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      {t.tech.infra}
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:cloud-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.infraDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {["Docker", "AWS", "Google Cloud", "Firebase"].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* CENTER HUB STAGE (col-span-4 with Generous Distance & SVG Connectors) */}
              <div className="col-span-4 flex flex-col items-center justify-center relative py-6 px-4">
                {/* SVG Connecting Spoke Lines linking Cards to Central Hub */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 200 400" preserveAspectRatio="none">
                  <line x1="0" y1="60" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="0" y1="200" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="0" y1="340" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="60" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="200" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="340" x2="100" y2="200" stroke="rgba(44, 80, 152, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                {/* Spaced Central Hub Window with Rotating Orbital Rings (Light & Airy Style) */}
                <div className="w-44 h-44 lg:w-48 lg:h-48 rounded-full bg-gradient-to-b from-white via-white to-[#2C5098]/5 border border-[#2C5098]/30 shadow-xl shadow-[#2C5098]/8 flex flex-col items-center justify-center text-center p-5 relative z-20 group hover:border-[#2C5098]/60 hover:scale-105 transition-all duration-500">

                  {/* 1. OUTER ROTATING DASHED ORBITAL RING (CLOCKWISE SPIN 20s) */}
                  <div className="absolute -inset-5 rounded-full border border-dashed border-[#2C5098]/20 animate-[spin_20s_linear_infinite] pointer-events-none flex items-center justify-center">
                    {/* Orbiting Satellite Glowing Dot (Top) */}
                    <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-[#2C5098] shadow-[0_0_8px_rgba(44,80,152,0.6)]" />
                    {/* Orbiting Satellite Glowing Dot (Bottom) */}
                    <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-[#2C5098]/60 shadow-[0_0_8px_rgba(44,80,152,0.4)]" />
                  </div>

                  {/* 2. INNER COUNTER-ROTATING RING (REVERSE SPIN 12s) */}
                  <div className="absolute -inset-2 rounded-full border border-[#2C5098]/25 border-t-transparent border-b-transparent animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />

                  {/* 3. GLOWING PULSE RING */}
                  <div className="absolute -inset-0.5 rounded-full border border-[#2C5098]/15 animate-pulse pointer-events-none" />

                  {/* Center Content */}
                  <div className="w-9 h-9 rounded-xl bg-[#2C5098]/8 text-[#2C5098] flex items-center justify-center font-bold mb-1.5 shadow-2xs group-hover:rotate-12 transition-transform duration-300">
                    <Icon icon="ph:cpu-duotone" className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2C5098] mb-0.5">
                    Tech Stack
                  </span>
                  <h3 className="text-sm lg:text-base font-sans font-bold text-slate-800 leading-tight">
                    Stack Of<br />Technology
                  </h3>
                </div>
              </div>

              {/* RIGHT COLUMN: 3 Category Cards (col-span-4) */}
              <div className="col-span-4 space-y-6 text-left">
                {/* Card 2: Backend & API */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      {t.tech.backend}
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:hard-drives-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.backendDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {["Laravel", "Node.js", "Golang", "Python", "Express", "GraphQL"].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card 4: Mobile */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      {t.tech.mobile}
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:device-mobile-speaker-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.mobileDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {["React Native", "Flutter"].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card 6: AI & LLM Engineering */}
                <motion.div
                  variants={cardSlideUp}
                  className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/50 hover:shadow-[0_10px_40px_-10px_rgba(44,80,152,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-sans font-extrabold text-slate-900 group-hover:text-[#2C5098] transition-colors">
                      {t.tech.integrationTitle}
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
                      <Icon icon="ph:sparkle-duotone" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">{t.tech.integrationDesc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {[
                      "Python",
                      "N8N",
                      "LangChain",
                      "LlamaIndex",
                      "RAG Architecture",
                      "QLoRA / Fine-Tuning",
                      "Autonomous Agents",
                      "Vector DB",
                      "OpenAI",
                      "Claude",
                      "Hugging Face",
                      "Ollama"
                    ].map((tech) => (
                      <div key={tech} className="px-2 py-1 rounded-xl text-[10px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#2C5098]/50 hover:bg-[#2C5098]/10 transition-all duration-300 cursor-default flex items-center gap-1.5 shadow-2xs">
                        <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* MOBILE RESPONSIVE FALLBACK: STANDARD GRID (BELOW MD) */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 block md:hidden text-left pt-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {/* Card 1: Frontend */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  Frontend
                </h3>
                <Icon icon="ph:layout-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.frontendDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {["React", "Vue", "Angular", "Next.js", "Vite", "TypeScript", "Tailwind CSS"].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Backend */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  {t.tech.backend}
                </h3>
                <Icon icon="ph:hard-drives-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.backendDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {["Laravel", "Node.js", "Golang", "Python", "Express", "GraphQL"].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Database */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  {t.tech.database}
                </h3>
                <Icon icon="ph:database-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.databaseDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {["MySQL", "PostgreSQL", "MongoDB", "Firestore", "Redis"].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 4: Mobile */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  {t.tech.mobile}
                </h3>
                <Icon icon="ph:device-mobile-speaker-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.mobileDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {["React Native", "Flutter"].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 5: Infrastructure */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  {t.tech.infra}
                </h3>
                <Icon icon="ph:cloud-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.infraDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {["Docker", "AWS", "Google Cloud", "Firebase"].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 6: AI & LLM Engineering */}
            <motion.div
              variants={cardSlideUp}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 sm:col-span-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-extrabold text-slate-900">
                  {t.tech.integrationTitle}
                </h3>
                <Icon icon="ph:sparkle-duotone" className="w-4 h-4 text-[#2C5098]" />
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{t.tech.integrationDesc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {[
                  "Python",
                  "N8N",
                  "LangChain",
                  "LlamaIndex",
                  "RAG Architecture",
                  "QLoRA / Fine-Tuning",
                  "Autonomous Agents",
                  "Vector DB",
                  "OpenAI",
                  "Claude",
                  "Hugging Face",
                  "Ollama"
                ].map((tech) => (
                  <div key={tech} className="px-2 py-1 rounded-lg text-[9px] font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1">
                    <Icon icon={TECH_ICONS[tech] || 'ph:code-duotone'} className="w-3 h-3 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 6: FEATURED PROJECTS / PORTFOLIO (#projects-section) - SOFT GRAY (#F8FAFC)
          ========================================================================= */}
      <motion.section
        id="projects-section"
        className="w-full bg-[#F8FAFC] border-y border-slate-200/70 py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
            <div className="space-y-3">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
                <span>{t.nav.portfolio}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
                {t.portfolio.mainHeading}{' '}
                <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent">
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
            {projects && projects.length > 0 ? (
              projects.slice(0, 6).map((project) => {
                const isDummy = !project.thumbnail ||
                  project.thumbnail.trim() === "" ||
                  project.thumbnail === "/thumbnail.png" ||
                  project.thumbnail === "/placeholder.png";

                const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

                return (
                  <div
                    key={project.slug}
                    className="group flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#2C5098]/40 hover:shadow-md transition-all duration-300 relative overflow-hidden"
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
                        <h3 className="text-base font-sans font-bold text-slate-900 group-hover:text-[#2C5098] transition-colors">
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
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-[#2C5098] hover:to-[#23385B] hover:text-white text-xs font-bold text-slate-800 transition-all border border-slate-200 hover:border-transparent"
                      >
                        <span>{t.portfolio.viewProject}</span>
                        <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-3 p-12 text-center rounded-3xl bg-white border border-slate-200">
                <span className="text-xs font-mono text-slate-500">No projects found.</span>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 7: PRICING & GUARANTEE (#pricing-section) - PURE WHITE WITH PROMINENT CARD WRAPPER
          ========================================================================= */}
      <motion.section
        id="pricing-section"
        className="w-full bg-white py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold text-center">
              <span>{t.pricing.label}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.pricing.badge}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t.pricing.desc}
            </p>
          </div>

          {/* Master Card Wrapper for Pricing */}
          <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-10 md:p-12 relative overflow-hidden">
            {/* 3 Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto text-left">
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
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-[#2C5098] hover:text-white hover:border-[#2C5098] text-slate-800 transition-all cursor-pointer text-center"
                  >
                    {t.pricing.starterBtn || "Mulai dari Sini"}
                  </button>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {t.pricingCards.starterIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center shrink-0">
                          <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2: Growth (Featured) */}
              <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-[#2C5098] shadow-lg shadow-[#2C5098]/10 flex flex-col justify-between space-y-6 relative">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#2C5098] to-[#23385B] text-white text-[9px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Icon icon="ph:crown-duotone" className="w-3 h-3" />
                  {language === 'en' ? 'Most Popular' : 'Paling Populer'}
                </div>

                <div className="space-y-5">
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#2C5098] font-bold">
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
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white transition-all shadow-md shadow-[#2C5098]/25 cursor-pointer text-center"
                  >
                    {t.pricing.growthBtn || "Diskusikan Proyek Anda"}
                  </button>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {t.pricingCards.growthIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white flex items-center justify-center shrink-0">
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
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-[#2C5098] hover:text-white hover:border-[#2C5098] text-slate-800 transition-all cursor-pointer text-center"
                  >
                    {t.pricing.customBtn || "Ceritakan Kebutuhan Anda"}
                  </button>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Termasuk:</span>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {t.pricingCards.customIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center shrink-0">
                          <Icon icon="ph:check-bold" className="w-2.5 h-2.5" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 8: TRUST & VALUE PROPS (#features-section) - SOFT GRAY (#F8FAFC)
          ========================================================================= */}
      <motion.section
        id="features-section"
        className="w-full bg-[#F8FAFC] border-y border-slate-200/70 py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-left space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
              <span>{t.trust?.badge || "Kenapa Klien Percaya"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.trust?.mainHeading || "Kenapa Klien Percaya"}{' '}
              <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent">
                {t.trust?.mainHeadingHighlight || "Bekerja Sama Dengan Saya"}
              </span>
            </h2>
          </div>

          {/* 2-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {(t.trust?.items || []).map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2C5098]/40 transition-all flex flex-col sm:flex-row gap-4 items-start"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 flex items-center justify-center">
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
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 9: THE PROCESSES / METHODOLOGY STEPPER (#methodology-section) - PURE WHITE (#FFFFFF)
          ========================================================================= */}
      <motion.section
        id="methodology-section"
        className="w-full bg-white py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="space-y-4 text-left">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
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
                    className={`w-full py-4 text-left cursor-pointer border-b transition-all duration-300 flex items-center justify-between group ${isActive ? 'border-[#2C5098]' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    id={`processes-step-${milestone.step}`}
                  >
                    <span
                      className={`text-base font-sans font-bold transition-all duration-300 ${isActive
                        ? 'text-[#2C5098] translate-x-1.5'
                        : 'text-slate-600 group-hover:text-slate-900 group-hover:translate-x-1'
                        }`}
                    >
                      {t.milestones[idx].title}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold transition-colors flex items-center gap-2 ${isActive ? 'text-[#2C5098]' : 'text-slate-400 group-hover:text-slate-600'
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
                    <div className="text-8xl sm:text-9xl font-sans font-bold tracking-tighter leading-none bg-gradient-to-b from-[#2C5098] to-transparent bg-clip-text text-transparent select-none opacity-85">
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
                      className="px-6 py-3 bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white rounded-lg text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 shadow-md shadow-[#2C5098]/25 cursor-pointer flex items-center gap-2 group/btn"
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
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 10: FAQ SECTION (#faq-section) - SOFT GRAY (#F8FAFC)
          ========================================================================= */}
      <motion.section
        id="faq-section"
        className="w-full bg-[#F8FAFC] border-y border-slate-200/70 py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto text-left">
            {/* Left Column: Ask Box */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-3">
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
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
                        className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2C5098] focus:ring-1 focus:ring-[#2C5098] transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white transition-colors cursor-pointer shadow-xs"
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
                        Terima kasih. Pertanyaan Anda akan direspons dalam waktu <span className="font-semibold text-[#2C5098]">12 jam</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setQuestionSubmitted(false);
                        setCustomQuestion('');
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider text-[#2C5098] hover:underline cursor-pointer"
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
                      ? 'bg-white border-[#2C5098]/60 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <button
                      onClick={() => setActiveFaq(isExpanded ? null : idx)}
                      className="w-full px-5 py-4 text-left font-sans font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer select-none"
                      aria-expanded={isExpanded}
                    >
                      <span>{faq.q}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${isExpanded ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white' : 'bg-slate-100 text-slate-600'
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
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 11: CONSULTATION / CONTACT FORM (#contact-section) - PURE WHITE WITH PROMINENT CARD WRAPPER
          ========================================================================= */}
      <motion.section
        id="contact-section"
        className="w-full bg-white py-20 sm:py-28 lg:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionFadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          {/* Standard Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#2C5098] font-bold">
              <span>{t.contact.badge || "KONTAK & KONSULTASI"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
              {t.contact.mainHeading}{' '}
              <span className="bg-gradient-to-r from-[#2C5098] to-[#23385B] bg-clip-text text-transparent">
                {t.contact.mainHeadingHighlight}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
              {t.contact.desc}
            </p>
          </div>

          {/* Master Card Wrapper with elevated container styling */}
          <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-10 md:p-12 relative overflow-hidden">
            {/* 2-Column Luxury Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 text-left items-start">
              {/* Left Column: Direct Communication Channels & Value Commitments (4.5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2 mt-4 lg:mt-18">
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
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/80 hover:bg-emerald-50/20 hover:shadow-sm transition-all"
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
                  <div className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#2C5098]/80 hover:bg-[#2C5098]/10 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center font-bold shrink-0">
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
                      className="shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-[#2C5098]/10 hover:text-[#2C5098] text-slate-600 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-200"
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
                <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    <span>{language === 'en' ? 'FREELANCE PLATFORMS' : 'SALURAN PLATFORM LAIN'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Upwork Capsule */}
                    <a
                      href="https://www.upwork.com/freelancers/~017698b392e21b4b6c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-500/70 hover:shadow-2xs transition-all cursor-pointer"
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
                      className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-white hover:bg-[#2C5098]/10 border border-slate-200/80 hover:border-[#2C5098]/70 hover:shadow-2xs transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-[#2C5098]/10 text-[#2C5098] flex items-center justify-center shrink-0 group-hover:bg-[#2C5098] group-hover:text-white transition-all">
                          <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-sans font-bold text-slate-800 group-hover:text-[#2C5098] transition-colors truncate">
                          Fastwork
                        </span>
                      </div>
                      <Icon icon="ph:arrow-up-right-bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2C5098] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
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
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-[#2C5098] focus-within:ring-4 focus-within:ring-[#2C5098]/15 transition-all shadow-2xs space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block" htmlFor="form-name">
                              {t.contact.formNameLabel} <span className="text-[#2C5098]">*</span>
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
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-[#2C5098] focus-within:ring-4 focus-within:ring-[#2C5098]/15 transition-all shadow-2xs space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block" htmlFor="form-email">
                              {t.contact.formEmailLabel} <span className="text-[#2C5098]">*</span>
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
                                  ? 'bg-[#2C5098]/10 border-2 border-[#2C5098] text-slate-900 shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                  }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white' : 'bg-slate-50 border border-slate-200 text-slate-600'
                                    }`}>
                                    <Icon icon={svc.icon} className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-sans font-bold truncate">{svc.label}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{svc.desc}</div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#2C5098] text-white flex items-center justify-center shrink-0">
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
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-xs font-sans font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{sc.label}</span>
                                  <Icon icon={sc.icon} className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#93B4ED]' : 'text-slate-400'}`} />
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
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 focus-within:bg-white focus-within:border-[#2C5098] focus-within:ring-4 focus-within:ring-[#2C5098]/15 transition-all shadow-2xs space-y-1">
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
                          className="w-full py-4 rounded-full bg-gradient-to-br from-[#2C5098] to-[#23385B] hover:from-[#23385B] hover:to-[#2C5098] text-white text-xs sm:text-sm font-sans font-bold tracking-wider shadow-lg shadow-[#2C5098]/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
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
                    <div className="py-14 px-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
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
                          className="text-[10px] font-mono text-slate-500 hover:text-[#2C5098] underline cursor-pointer"
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
        </div>
      </motion.section>

    </div>
  );
}
