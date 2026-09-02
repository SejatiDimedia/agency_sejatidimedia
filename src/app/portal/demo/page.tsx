'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { InvoiceDetailModal } from '@/components/portal/InvoiceDetailModal';
import { Card, Badge, Button } from '@/components/ui';
import { Icon } from '@iconify/react';
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Eye,
  X,
  CreditCard,
  MessageSquare,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  User,
  AlertCircle
} from 'lucide-react';
import { Project, Milestone, Invoice, ActiveNavSection, MilestoneComment } from '@/types/portal';

// ============================================================================
// REALISTIC MOCK DATA FOR GUEST DEMO
// ============================================================================
const INITIAL_DEMO_PROJECT: Project = {
  id: 'demo-proj-001',
  projectName: 'Fintech Pay — Modern E-Wallet & QRIS SaaS',
  clientName: 'Ir. Hendra Pratama',
  clientCompany: 'PT Karya Digital Nusantara',
  clientEmail: 'hendra@karyadigital.id',
  status: 'In Progress',
  progress: 72,
  startDate: '12 Mei 2026',
  targetCompletion: '28 Juni 2026',
  budget: 'Rp 28.500.000',
  lastUpdated: 'Baru saja',
  nextMilestoneTitle: 'Sprint 2: Core Payment Engine & Admin Dashboard',
  milestonesCount: {
    total: 3,
    completed: 1,
  },
  assignees: [
    {
      name: 'Timur Dian Radha Sejati',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack & AI Engineer',
    },
    {
      name: 'Sarah Amanda',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      role: 'UI/UX & Design Systems',
    }
  ],
  milestones: [
    {
      id: 'm-1',
      title: 'Sprint 1: System Architecture, Database Schema & Scaffolding',
      description: 'Perancangan arsitektur Next.js 15, skema database PostgreSQL, setup Redis caching, dan konfigurasi CI/CD cloud.',
      dueDate: '22 Mei 2026',
      status: 'Done',
      tasks: [
        { id: 't-1-1', title: 'High-Level Architecture & ERD Database Design', completed: true },
        { id: 't-1-2', title: 'Supabase PostgreSQL & Redis Cluster Provisioning', completed: true },
        { id: 't-1-3', title: 'Next.js 15 App Router Scaffolding & CI/CD Pipeline', completed: true },
      ],
      deliverables: [
        {
          id: 'f-1',
          fileName: 'System_Architecture_Blueprint_v1.0.pdf',
          fileSize: '3.4 MB',
          fileType: 'PDF Document',
          uploadDate: '22 Mei 2026',
          downloadUrl: '#'
        },
        {
          id: 'f-2',
          fileName: 'PostgreSQL_ERD_Diagram.png',
          fileSize: '1.8 MB',
          fileType: 'Image',
          uploadDate: '22 Mei 2026',
          downloadUrl: '#'
        }
      ],
      comments: [
        {
          id: 'c-1',
          authorName: 'Timur Dian Radha Sejati',
          authorRole: 'Admin',
          timestamp: '22 Mei 2026, 16:30',
          content: 'Sprint 1 selesai 100%. Struktur database dan environment staging cloud sudah siap digunakan untuk integrasi payment engine.'
        },
        {
          id: 'c-2',
          authorName: 'Ir. Hendra Pratama (Client)',
          authorRole: 'Client',
          timestamp: '22 Mei 2026, 17:15',
          content: 'Terima kasih Mas Timur, dokumentasi arsitekturnya sangat rapi dan komprehensif. Siap lanjut ke Sprint 2.'
        }
      ]
    },
    {
      id: 'm-2',
      title: 'Sprint 2: Core Payment Engine, RBAC & Admin Dashboard',
      description: 'Implementasi pembayaran dinamis QRIS & Virtual Account, autentikasi multi-role (RBAC), serta dashboard transaksi realtime.',
      dueDate: '10 Juni 2026',
      status: 'In Progress',
      tasks: [
        { id: 't-2-1', title: 'Integrasi Payment Gateway (Dynamic QRIS & Bank VA)', completed: true },
        { id: 't-2-2', title: 'Autentikasi Multi-Role & Session Guard JWT', completed: true },
        { id: 't-2-3', title: 'Dashboard Analitik Transaksi & Laporan Keuangan', completed: true },
        { id: 't-2-4', title: 'Otomasi Webhook Notifikasi WhatsApp & Email Struk', completed: false },
      ],
      deliverables: [
        {
          id: 'f-3',
          fileName: 'OpenAPI_Swagger_Specification_v2.json',
          fileSize: '420 KB',
          fileType: 'JSON Spec',
          uploadDate: '02 Juni 2026',
          downloadUrl: '#'
        },
        {
          id: 'f-4',
          fileName: 'Figma_Design_Tokens_Handoff.fig',
          fileSize: '14.2 MB',
          fileType: 'Design File',
          uploadDate: '01 Juni 2026',
          downloadUrl: '#'
        }
      ],
      comments: [
        {
          id: 'c-3',
          authorName: 'Timur Dian Radha Sejati',
          authorRole: 'Admin',
          timestamp: '02 Juni 2026, 11:20',
          content: 'Progres QRIS dan dashboard analitik sudah aktif di staging. Saat ini kami sedang menyempurnakan webhook struk WhatsApp.'
        }
      ]
    },
    {
      id: 'm-3',
      title: 'Sprint 3: Security Hardening, QA Stress Test & Cloud Cutover',
      description: 'Audit keamanan OWASP, pengujian beban 10.000 req/sec, konfigurasi domain production SSL, serta serah terima 100% source code.',
      dueDate: '28 Juni 2026',
      status: 'To Do',
      tasks: [
        { id: 't-3-1', title: 'Penetration Testing & Security Audit OWASP Top 10', completed: false },
        { id: 't-3-2', title: 'Load & Stress Testing (K6 Simulation)', completed: false },
        { id: 't-3-3', title: 'Production Domain DNS Cutover & Zero-Downtime Migration', completed: false },
        { id: 't-3-4', title: 'Serah Terima 100% Hak Cipta, Source Code & Garansi 30 Hari', completed: false },
      ],
      deliverables: [],
      comments: []
    }
  ]
};

const INITIAL_DEMO_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-202605-001',
    status: 'PAID',
    issuedDate: '12 Mei 2026',
    dueDate: '16 Mei 2026',
    subtotal: 14250000,
    taxPercent: 0,
    taxAmount: 0,
    total: 14250000,
    notes: 'Pembayaran Uang Muka (Down Payment 50%) untuk Kickoff Proyek Fintech Pay.',
    bankInfo: 'Bank Central Asia (BCA) — 037-xxxx-xxx a/n Timur Dian Radha Sejati',
    paidAt: '14 Mei 2026, 10:15 WIB',
    projectId: 'demo-proj-001',
    projectName: 'Fintech Pay — Modern E-Wallet & QRIS SaaS',
    clientName: 'Ir. Hendra Pratama',
    clientEmail: 'hendra@karyadigital.id',
    items: [
      {
        id: 'item-1',
        description: 'Termin 1: Down Payment (50%) — System Architecture, DB Schema & Project Kickoff',
        quantity: 1,
        unitPrice: 14250000,
        amount: 14250000,
      }
    ]
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-202606-002',
    status: 'SENT',
    issuedDate: '01 Juni 2026',
    dueDate: '10 Juni 2026',
    subtotal: 8550000,
    taxPercent: 0,
    taxAmount: 0,
    total: 8550000,
    notes: 'Pembayaran Termin 2 (30%) — Penyelesaian Core Payment Engine & Admin Dashboard.',
    bankInfo: 'Bank Central Asia (BCA) — 037-xxxx-xxx a/n Timur Dian Radha Sejati',
    paidAt: null,
    projectId: 'demo-proj-001',
    projectName: 'Fintech Pay — Modern E-Wallet & QRIS SaaS',
    clientName: 'Ir. Hendra Pratama',
    clientEmail: 'hendra@karyadigital.id',
    items: [
      {
        id: 'item-2',
        description: 'Termin 2: Milestone Progress (30%) — Core Payment Engine & Admin Dashboard',
        quantity: 1,
        unitPrice: 8550000,
        amount: 8550000,
      }
    ]
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-202606-003',
    status: 'DRAFT',
    issuedDate: '24 Juni 2026',
    dueDate: '30 Juni 2026',
    subtotal: 5700000,
    taxPercent: 0,
    taxAmount: 0,
    total: 5700000,
    notes: 'Pembayaran Pelunasan Akhir (20%) — Serah Terima Source Code, Deployment & Garansi.',
    bankInfo: 'Bank Central Asia (BCA) — 037-xxxx-xxx a/n Timur Dian Radha Sejati',
    paidAt: null,
    projectId: 'demo-proj-001',
    projectName: 'Fintech Pay — Modern E-Wallet & QRIS SaaS',
    clientName: 'Ir. Hendra Pratama',
    clientEmail: 'hendra@karyadigital.id',
    items: [
      {
        id: 'item-3',
        description: 'Termin 3: Final Handover (20%) — Production Deployment, 100% Source Code & Warranty',
        quantity: 1,
        unitPrice: 5700000,
        amount: 5700000,
      }
    ]
  }
];

const INITIAL_DEMO_COMMENTS: MilestoneComment[] = [
  {
    id: 'c-1',
    authorName: 'Timur Dian Radha Sejati',
    authorRole: 'Admin',
    timestamp: '22 Mei 2026, 16:30',
    content: 'Sprint 1 selesai 100%. Struktur database dan environment staging cloud sudah siap digunakan untuk integrasi payment engine.'
  },
  {
    id: 'c-2',
    authorName: 'Ir. Hendra Pratama (Client)',
    authorRole: 'Client',
    timestamp: '22 Mei 2026, 17:15',
    content: 'Terima kasih Mas Timur, dokumentasi arsitekturnya sangat rapi dan komprehensif. Siap lanjut ke Sprint 2.'
  },
  {
    id: 'c-3',
    authorName: 'Timur Dian Radha Sejati',
    authorRole: 'Admin',
    timestamp: '02 Juni 2026, 11:20',
    content: 'Progres QRIS dan dashboard analitik sudah aktif di staging. Saat ini kami sedang menyempurnakan webhook struk WhatsApp.'
  }
];

export default function GuestDemoClientPortal() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('clients-portal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Client');
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  // Active Project Tab
  const [activeTab, setActiveTab] = useState<'milestones' | 'invoices' | 'deliverables' | 'comments'>('milestones');

  // Reactive Project State (allows interactive task toggling!)
  const [project, setProject] = useState<Project>(INITIAL_DEMO_PROJECT);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_DEMO_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Comments state (dedicated immutable array)
  const [demoComments, setDemoComments] = useState<MilestoneComment[]>(INITIAL_DEMO_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  // Interactive Task Toggle Handler
  const handleToggleTask = (milestoneId: string, taskId: string) => {
    setProject(prev => {
      const updatedMilestones = prev.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        const updatedTasks = m.tasks.map(t => {
          if (t.id !== taskId) return t;
          return { ...t, completed: !t.completed };
        });
        const allDone = updatedTasks.every(t => t.completed);
        const anyDone = updatedTasks.some(t => t.completed);
        const status = allDone ? 'Done' : (anyDone ? 'In Progress' : 'To Do');
        return { ...m, tasks: updatedTasks, status: status as any };
      });

      // Recalculate overall progress
      let totalTasks = 0;
      let completedTasks = 0;
      updatedMilestones.forEach(m => {
        totalTasks += m.tasks.length;
        completedTasks += m.tasks.filter(t => t.completed).length;
      });
      const progress = Math.round((completedTasks / totalTasks) * 100);

      return {
        ...prev,
        milestones: updatedMilestones,
        progress
      };
    });
  };

  // Add Demo Comment (Strictly immutable to prevent duplicate renders in React StrictMode)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentText.trim();
    if (!text) return;

    const newComment: MilestoneComment = {
      id: `c-guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      authorName: currentRole === 'Client' ? 'Anda (Demo Client)' : 'Timur Dian Radha Sejati',
      authorRole: currentRole,
      timestamp: 'Baru saja',
      content: text
    };

    setDemoComments(prev => [...prev, newComment]);
    setNewCommentText('');
  };

  const openInvoiceDetail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 flex flex-col font-sans antialiased w-full overflow-x-hidden">
      {/* =====================================================================
          TOP PERSISTENT GUEST DEMO ANNOUNCEMENT BAR
          ===================================================================== */}
      <div className="no-print sticky top-0 z-50 bg-gradient-to-r from-[#1E315B] via-[#2C5098] to-[#1E315B] text-white px-3 sm:px-6 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-bold tracking-wide">Mode Tamu (Guest Demo):</span>{' '}
            <span className="text-blue-100 hidden sm:inline">
              Anda sedang mencoba simulasi interaktif Client Portal SejatiDimedia.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/6289508436275?text=Halo%20SejatiDimedia,%20saya%20baru%20saja%20mencoba%20Demo%20Client%20Portal%20di%20website%20Anda.%20Saya%20tertarik%20untuk%20memulai%20proyek%20bersama%20Anda."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs hover:scale-105 transition-all cursor-pointer"
          >
            <Icon icon="ic:baseline-whatsapp" className="w-4 h-4" />
            <span>Mulai Proyek Serupa</span>
          </a>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali ke Web</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          MAIN PORTAL LAYOUT
          ===================================================================== */}
      <div className="no-print flex-1 p-3 sm:p-5 flex gap-0 lg:gap-5 w-full overflow-hidden">
        {/* Sidebar (Dedicated Demo Mode) */}
        <PortalSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          leadsCount={0}
          projectsCount={1}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          openAddLeadModal={() => { }}
          userRole="CLIENT"
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          isDemoMode={true}
          demoActiveTab={activeTab}
          onSelectDemoTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-6.5rem)] overflow-y-auto pr-1">
          {/* Header */}
          <PortalHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openAddLeadModal={() => { }}
            openStyleGuideModal={() => setIsStyleGuideModalOpen(true)}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            userName="Ir. Hendra Pratama (Demo Client)"
            userEmail="hendra@karyadigital.id"
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          {/* Project Details Workspace */}
          <div className="space-y-6 pt-4 pb-12">
            {/* Project Hero Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20">
                      PROJECT ID: DEMO-2026-001
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      In Progress (Sprint 2)
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
                    {project.projectName}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.clientCompany}</span>
                    <span>•</span>
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>PIC: {project.clientName}</span>
                  </p>
                </div>

                {/* Lead Engineer Badge */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C5098] to-[#23385B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    TD
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Lead Engineer</div>
                    <div className="text-xs font-bold text-slate-900">{project.assignees[0].name}</div>
                    <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online & Managing Sprint
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Quick Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {/* Metric 1: Overall Progress */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Overall Progress</span>
                    <span className="font-mono font-bold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2C5098] to-[#23385B] rounded-full"
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {project.milestones.filter(m => m.status === 'Done').length} of {project.milestones.length} Sprints Complete
                  </span>
                </div>

                {/* Metric 2: Timeline */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Target Timeline</span>
                  <div className="text-sm font-bold text-slate-900">{project.startDate} – {project.targetCompletion}</div>
                  <span className="text-[11px] text-[#2C5098] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    On Schedule (Sprint 2 of 3)
                  </span>
                </div>

                {/* Metric 3: Budget & Invoicing */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Total Nilai Proyek</span>
                  <div className="text-sm font-bold text-slate-900">{project.budget}</div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Termin 1 (50%) Terverifikasi
                  </span>
                </div>

                {/* Metric 4: Direct Assurance */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2C5098] font-bold">Garansi & Source Code</span>
                  <div className="text-sm font-bold text-slate-900">100% Client Ownership</div>
                  <span className="text-[11px] text-[#2C5098] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Official Bug Warranty Active
                  </span>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('milestones')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'milestones'
                    ? 'bg-[#2C5098] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Sprint & Milestones ({project.milestones.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'invoices'
                    ? 'bg-[#2C5098] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Invoices & Billing ({invoices.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('deliverables')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'deliverables'
                    ? 'bg-[#2C5098] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>File Deliverables (4)</span>
                </button>

                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'comments'
                    ? 'bg-[#2C5098] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Log Diskusi & Revisi</span>
                </button>
              </div>
            </div>

            {/* ===============================================================
                TAB 1: SPRINT & MILESTONES (Interactive Tasks)
                =============================================================== */}
            {activeTab === 'milestones' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-[#23385B] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2C5098] shrink-0" />
                    <span>
                      <strong>Coba Interaksi:</strong> Anda dapat mengklik centang pada kotak tugas (checklist) di bawah untuk melihat bar progres bergerak secara langsung!
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Live State Simulation</span>
                </div>

                <div className="space-y-4">
                  {project.milestones.map((milestone, mIdx) => {
                    const completedTasksCount = milestone.tasks.filter(t => t.completed).length;
                    const mProgress = milestone.tasks.length > 0
                      ? Math.round((completedTasksCount / milestone.tasks.length) * 100)
                      : (milestone.status === 'Done' ? 100 : 0);

                    return (
                      <div
                        key={milestone.id}
                        className={`p-6 rounded-3xl bg-white border transition-all ${milestone.status === 'In Progress'
                          ? 'border-[#2C5098] shadow-md shadow-[#2C5098]/5'
                          : 'border-slate-200 shadow-xs'
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                SPRINT {mIdx + 1}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${milestone.status === 'Done'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : milestone.status === 'In Progress'
                                  ? 'bg-blue-50 text-[#2C5098] border border-blue-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {milestone.status === 'Done' ? 'Completed' : milestone.status === 'In Progress' ? 'In Progress' : 'Pending'}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">{milestone.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">{milestone.description}</p>
                          </div>

                          <div className="text-right sm:shrink-0 space-y-1">
                            <span className="text-[11px] font-mono text-slate-400 block">Due Date</span>
                            <span className="text-xs font-bold text-slate-900 font-mono">{milestone.dueDate}</span>
                            <div className="text-[11px] font-mono font-bold text-[#2C5098]">{mProgress}% Done</div>
                          </div>
                        </div>

                        {/* Task Checklist Items */}
                        <div className="pt-4 space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Sprint Tasks & Deliverables ({completedTasksCount}/{milestone.tasks.length}):
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {milestone.tasks.map(task => (
                              <button
                                key={task.id}
                                onClick={() => handleToggleTask(milestone.id, task.id)}
                                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${task.completed
                                  ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-700'
                                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                                  }`}
                              >
                                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${task.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 bg-white'
                                  }`}>
                                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                                <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                                  {task.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===============================================================
                TAB 2: INVOICES & BILLING
                =============================================================== */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#2C5098]" />
                    <span>
                      Klik pada salah satu invoice untuk membuka <strong>Invoice Digital Resmi</strong> lengkap dengan breakdown termin dan status pembayaran.
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="py-3 px-5">No. Invoice</th>
                          <th className="py-3 px-5">Rincian Termin</th>
                          <th className="py-3 px-5">Jatuh Tempo</th>
                          <th className="py-3 px-5">Jumlah</th>
                          <th className="py-3 px-5">Status</th>
                          <th className="py-3 px-5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-5 font-mono font-bold text-[#2C5098]">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-4 px-5 font-medium text-slate-800">
                              {inv.items[0]?.description || 'Termin Pembayaran'}
                            </td>
                            <td className="py-4 px-5 font-mono text-slate-600">
                              {inv.dueDate}
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-slate-900">
                              Rp {inv.total.toLocaleString('id-ID')}
                            </td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${inv.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'SENT'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {inv.status === 'PAID' ? 'LUNAS (PAID)' : inv.status === 'SENT' ? 'MENUNGGU PEMBAYARAN' : 'DRAFT'}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => openInvoiceDetail(inv)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#2C5098] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Invoice</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                TAB 3: DELIVERABLES & DOCUMENT CENTER
                =============================================================== */}
            {activeTab === 'deliverables' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* File 1 */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        System_Architecture_Blueprint_v1.0.pdf
                      </h4>
                      <p className="text-[11px] text-slate-500">Spesifikasi arsitektur cloud, database, dan security hardening.</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>3.4 MB • PDF</span>
                      <button
                        onClick={() => alert('Demo Mode: Ini adalah simulasi file arsitektur SejatiDimedia.')}
                        className="text-[#2C5098] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unduh
                      </button>
                    </div>
                  </div>

                  {/* File 2 */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        PostgreSQL_ERD_Diagram.png
                      </h4>
                      <p className="text-[11px] text-slate-500">Diagram relasi tabel dan indexing query database.</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>1.8 MB • PNG</span>
                      <button
                        onClick={() => alert('Demo Mode: Ini adalah simulasi diagram ERD SejatiDimedia.')}
                        className="text-[#2C5098] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unduh
                      </button>
                    </div>
                  </div>

                  {/* File 3 */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        OpenAPI_Swagger_Specification_v2.json
                      </h4>
                      <p className="text-[11px] text-slate-500">Dokumentasi API endpoint lengkap untuk integrasi.</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>420 KB • JSON</span>
                      <button
                        onClick={() => alert('Demo Mode: Ini adalah simulasi OpenAPI spec SejatiDimedia.')}
                        className="text-[#2C5098] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unduh
                      </button>
                    </div>
                  </div>

                  {/* File 4 */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        Figma_Design_Tokens_Handoff.fig
                      </h4>
                      <p className="text-[11px] text-slate-500">Design token, komponen UI, dan prototype alur pengguna.</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>14.2 MB • FIG</span>
                      <button
                        onClick={() => alert('Demo Mode: Ini adalah simulasi file Figma SejatiDimedia.')}
                        className="text-[#2C5098] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unduh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                TAB 4: LOG DISKUSI & REVISI
                =============================================================== */}
            {activeTab === 'comments' && (
              <div className="space-y-4 max-w-3xl">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#2C5098]" />
                      <span>Log Komunikasi & Catatan Sprint</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Tersinkronisasi Realtime</span>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-4">
                    {demoComments.map(comm => (
                      <div
                        key={comm.id}
                        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${comm.authorRole === 'Admin'
                          ? 'bg-blue-50/50 border-blue-200/60 ml-0 sm:mr-8'
                          : 'bg-slate-50 border-slate-200 ml-0 sm:ml-8'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{comm.authorName}</span>
                            <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${comm.authorRole === 'Admin' ? 'bg-[#2C5098] text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                              {comm.authorRole === 'Admin' ? 'Lead Engineer' : 'Client'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{comm.timestamp}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{comm.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Test Comment Form */}
                  <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Coba Tulis Catatan / Pertanyaan Simulasi:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        placeholder="Ketik catatan revisi atau pertanyaan sprint di sini..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2C5098] focus:bg-white transition-all"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#2C5098] hover:bg-[#23385B] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
        userRole="CLIENT"
      />

      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />
    </div>
  );
}
