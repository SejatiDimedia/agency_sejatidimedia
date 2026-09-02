'use client';

import React, { useState, useEffect } from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { LeadKanbanBoard } from '@/components/portal/LeadKanbanBoard';
import { DashboardMetrics } from '@/components/portal/DashboardMetrics';
import { LeadDetailModal } from '@/components/portal/LeadDetailModal';
import { AddLeadModal } from '@/components/portal/AddLeadModal';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { INITIAL_LEADS, INITIAL_PROJECTS } from '@/lib/portalMockData';
import { InvoiceModal } from '@/components/portal/InvoiceModal';
import { InvoiceDetailModal } from '@/components/portal/InvoiceDetailModal';
import { Lead, LeadStatus, ActiveNavSection, Project, Invoice } from '@/types/portal';
import { Button, Toast, ConfirmModal } from '@/components/ui';
import {
  Plus, Kanban, List, ShieldAlert, BarChart3, History, Search, RefreshCw, Filter, User, ArrowRight,
  TrendingUp, Clock, CheckSquare, FileText, DollarSign, CheckCircle2, AlertTriangle, Eye, Edit2, Trash2,
  Users, Mail, UserCheck, Shield, Copy, Check, Send, KeyRound, ExternalLink, Building2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard-leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Admin');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeFilterMonth, setActiveFilterMonth] = useState('November 2024');
  const [showSpamAndLost, setShowSpamAndLost] = useState(true);

  // Tabs: Leads, Analytics, Audit, Invoices, Team
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics' | 'audit' | 'invoices' | 'team'>('leads');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterAction, setAuditFilterAction] = useState('');

  // Team & Clients States
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'ADMIN' | 'CLIENT'>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [generatingLinkUserId, setGeneratingLinkUserId] = useState<string | null>(null);

  // Invoice States
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceFilterStatus, setInvoiceFilterStatus] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmInvoice, setDeleteConfirmInvoice] = useState<{ id: string; number: string; projectName?: string } | null>(null);
  const [isDeletingInvoice, setIsDeletingInvoice] = useState(false);

  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingAudit(true);
    try {
      const query = new URLSearchParams({
        search: auditSearch,
        action: auditFilterAction,
      }).toString();
      const res = await fetch(`/api/admin/audit-logs?${query}`);
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const query = new URLSearchParams({
        search: invoiceSearch,
        status: invoiceFilterStatus,
      }).toString();
      const res = await fetch(`/api/admin/invoices?${query}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleGenerateMagicLink = async (user: any) => {
    try {
      setGeneratingLinkUserId(user.id);
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success && data.activationUrl) {
        navigator.clipboard.writeText(data.activationUrl);
        setToastNotification({
          type: 'success',
          message: `Link Aktivasi untuk ${user.name} berhasil disalin ke clipboard!`,
        });
      } else {
        alert(data.error || 'Gagal membuat magic link');
      }
    } catch {
      alert('Terjadi kesalahan saat memproses link aktivasi');
    } finally {
      setGeneratingLinkUserId(null);
    }
  };

  // Sync activeTab with sidebar activeSection or URL query params
  useEffect(() => {
    if (activeSection === 'team') {
      setActiveTab('team');
    }
  }, [activeSection]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'team' || tab === 'leads' || tab === 'analytics' || tab === 'audit' || tab === 'invoices') {
        setActiveTab(tab as any);
        if (tab === 'team') {
          setActiveSection('team');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    } else if (activeTab === 'invoices') {
      fetchInvoices();
    } else if (activeTab === 'team') {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'audit') {
      const delayDebounce = setTimeout(() => {
        fetchAuditLogs();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [auditSearch, auditFilterAction]);

  useEffect(() => {
    if (activeTab === 'invoices') {
      const delayDebounce = setTimeout(() => {
        fetchInvoices();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [invoiceSearch, invoiceFilterStatus]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch leads from API with loading state
  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
        const formatted: Lead[] = data.leads.map((item: any) => ({
          id: item.id,
          name: item.name,
          company: item.company || 'Inquiry Website',
          email: item.email,
          phone: item.phone || '-',
          serviceType: item.service || 'Web Development',
          budgetEstimate: item.scale ? `Skala ${item.scale}` : 'Rp 20M - 40M',
          submittedDate: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
            : 'Hari ini',
          status:
            item.status === 'NEW'
              ? 'New'
              : item.status === 'REVIEWING'
                ? 'Reviewing'
                : item.status === 'PROPOSAL'
                  ? 'Proposal'
                  : item.status === 'WON'
                    ? 'Won'
                    : item.status === 'LOST'
                      ? 'Lost'
                      : item.status === 'SPAM'
                        ? 'Spam'
                        : 'New',
          notes: item.notes || '',
          source: 'Website Form',
          message: item.message,
          timelineHistory: item.timelineHistory || [],
        }));
        setLeads(formatted);
      } else {
        setLeads(INITIAL_LEADS);
      }
    } catch {
      setLeads(INITIAL_LEADS);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads: hide SPAM / LOST by default from main dashboard
  const filteredLeads = leads.filter((lead) => {
    if (!showSpamAndLost && (lead.status === 'Lost' || lead.status === 'Spam')) {
      return false;
    }

    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.company.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.serviceType.toLowerCase().includes(term) ||
      lead.message.toLowerCase().includes(term)
    );
  });

  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? {
            ...lead,
            status: newStatus,
          }
          : lead
      )
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Ignore API failure
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);

    try {
      await fetch(`/api/admin/leads/${updatedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updatedLead.status,
          notes: updatedLead.notes,
        }),
      });
    } catch {
      // Ignore API failure
    }
  };

  const handleConvertToProject = async (lead: Lead) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      projectName: `${lead.company} - ${lead.serviceType}`,
      clientName: lead.name,
      clientCompany: lead.company,
      clientEmail: lead.email,
      status: 'Active',
      progress: 10,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      targetCompletion: '30 Hari Kedepan',
      budget: lead.budgetEstimate,
      lastUpdated: 'Baru Saja',
      nextMilestoneTitle: 'Kickoff & Discovery',
      milestonesCount: { total: 4, completed: 0 },
      assignees: [
        { name: 'Takiya Baksh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80', role: 'UI/UX' },
      ],
      milestones: [],
    };

    setProjects((prev) => [newProject, ...prev]);

    // Update status to WON in local state
    setLeads((prevLeads) =>
      prevLeads.map((item) => (item.id === lead.id ? { ...item, status: 'Won' } : item))
    );
    if (selectedLead) {
      setSelectedLead((prev) => (prev ? { ...prev, status: 'Won' } : null));
    }

    // Trigger API backend with sendEmail: true ONLY on explicit conversion click!
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Won',
          email: lead.email,
          name: lead.name,
          service: lead.serviceType,
          sendEmail: true,
        }),
      });

      const data = await res.json();

      if (data.onboarding?.emailSent) {
        setToastNotification({
          type: 'success',
          message: `🚀 Lead ${lead.name} berhasil dikonversi & Email Magic Link Onboarding sukses terkirim ke ${lead.email}!`,
        });
      } else {
        const errorDetail = data.onboarding?.emailError || 'Resend Free Tier Testing Domain Policy (Pengiriman gratis terbatas ke email pemilik akun Resend)';
        setToastNotification({
          type: 'warning',
          message: `⚠️ Project berhasil dibuat, namun pengiriman email ke ${lead.email} mengalami kendala: ${errorDetail}`,
        });
      }

      setTimeout(() => setToastNotification(null), 9000);
    } catch {
      setToastNotification({
        type: 'warning',
        message: `⚠️ Project berhasil dibuat di portal, namun koneksi pengiriman email mengalami masalah.`,
      });
      setTimeout(() => setToastNotification(null), 9000);
    }
  };

  const handleAddLead = (newLeadData: Lead) => {
    setLeads([newLeadData, ...leads]);
    setIsAddLeadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-0 lg:gap-5 font-sans antialiased">
      {/* Left Floating Sidebar */}
      <PortalSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        leadsCount={leads.length}
        projectsCount={projects.length}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => setIsAddLeadModalOpen(true)}
        userRole="ADMIN"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <PortalHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openAddLeadModal={() => setIsAddLeadModalOpen(true)}
          openStyleGuideModal={() => setIsStyleGuideModalOpen(true)}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            <Kanban className="w-4 h-4" />
            Leads Pipeline
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analitik & Insight
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            <History className="w-4 h-4" />
            Log Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoice & Billing
          </button>
          <button
            onClick={() => {
              setActiveTab('team');
              setActiveSection('team');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'team'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Team & Clients
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'leads' && (
          <>
            {/* Dashboard Title & Top Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    SejatiDimedia Management
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Next.js App Router Admin
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Dashboard Leads & Inquiry
                </h1>
              </div>

              {/* Action Buttons & Filter Toggle */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end flex-wrap">
                <button
                  onClick={() => setShowSpamAndLost(!showSpamAndLost)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${showSpamAndLost
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{showSpamAndLost ? 'Sembunyikan Spam/Lost' : 'Tampilkan Spam/Lost'}</span>
                </button>

                <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center text-xs font-bold">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${viewMode === 'kanban'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    <span>Kanban Board</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table List</span>
                  </button>
                </div>

                <Button
                  variant="primary"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Tambah Lead
                </Button>
              </div>
            </div>

            {/* Metrics Summary Bar */}
            <DashboardMetrics
              leads={leads}
              projects={projects}
              activeFilterMonth={activeFilterMonth}
              setActiveFilterMonth={setActiveFilterMonth}
              refreshData={fetchLeads}
            />

            {/* Kanban Board / Skeleton Loading State */}
            <div className="mt-6">
              {isLoadingLeads ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map((col) => (
                    <div key={col} className="bg-slate-100/60 rounded-[1.8rem] p-4 border border-slate-200/60 h-96 animate-pulse space-y-4">
                      <div className="h-6 bg-slate-200 rounded-xl w-1/2"></div>
                      <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
                      <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <LeadKanbanBoard
                  leads={filteredLeads}
                  onSelectLead={(lead) => setSelectedLead(lead)}
                  openAddLeadModal={() => setIsAddLeadModalOpen(true)}
                  updateLeadStatus={handleUpdateLeadStatus}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Title & Refresh */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Analitik & Insights
                </h1>
                <p className="text-slate-500 text-xs mt-1">Metrik konversi, tren bulanan, dan waktu pemrosesan lead</p>
              </div>
              <button 
                onClick={fetchAnalytics}
                disabled={isLoadingAnalytics}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                Segarkan
              </button>
            </div>

            {isLoadingAnalytics || !analyticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 h-32"></div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 h-32"></div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 h-32"></div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 h-64 md:col-span-3"></div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Conversion Rate */}
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-4 top-4 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rasio Konversi</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1">{analyticsData.conversionRate}%</h2>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${analyticsData.conversionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {analyticsData.wonLeads} dari {analyticsData.totalLeads} lead diubah menjadi project
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Average Conversion Time */}
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-4 top-4 w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rata-rata Waktu Konversi</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1">
                        {analyticsData.averageConversionDays} <span className="text-base font-bold text-slate-500">Hari</span>
                      </h2>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-slate-500 font-medium">
                        Waktu rata-rata dari status Baru (New) ke Menang (Won/Project)
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Summary Leads */}
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-4 top-4 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads Aktif</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1">{analyticsData.totalLeads}</h2>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>Won: {analyticsData.wonLeads}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span>Pending: {analyticsData.totalLeads - analyticsData.wonLeads}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Tren Lead Masuk (6 Bulan Terakhir)</h3>
                  
                  <div className="h-64 flex items-end justify-around gap-2 px-2 sm:px-6 border-b border-slate-100 pb-2">
                    {analyticsData.leadsPerMonth.map((item: any, idx: number) => {
                      const maxVal = Math.max(...analyticsData.leadsPerMonth.map((x: any) => x.count), 1);
                      const heightPct = Math.max(10, (item.count / maxVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group max-w-[60px]">
                          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                            {item.count} Leads
                          </span>
                          <div 
                            style={{ height: `${heightPct}%` }}
                            className="w-full bg-blue-100 group-hover:bg-blue-600 transition-all duration-300 rounded-t-xl relative flex justify-center items-end"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 mt-3 whitespace-nowrap">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Title & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Audit Trail Aktivitas
                </h1>
                <p className="text-slate-500 text-xs mt-1">Catatan riwayat perubahan status sistem secara real-time</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari entitas, proyek, user..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-56"
                  />
                </div>

                {/* Filter Action */}
                <div className="relative flex items-center bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <select
                    value={auditFilterAction}
                    onChange={(e) => setAuditFilterAction(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="">Semua Aktivitas</option>
                    <option value="LEAD_STATUS_CHANGE">Perubahan Status Lead</option>
                    <option value="MILESTONE_STATUS_CHANGE">Perubahan Status Milestone</option>
                    <option value="TASK_STATUS_CHANGE">Perubahan Status Task</option>
                  </select>
                </div>

                {/* Refresh */}
                <button
                  onClick={fetchAuditLogs}
                  disabled={isLoadingAudit}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition-all"
                  title="Segarkan data log"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingAudit ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Audit Trail List */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)]">
              {isLoadingAudit ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 h-12 bg-slate-100/80 rounded-xl"></div>
                  ))}
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Belum ada log aktivitas tercatat.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-6">
                  {auditLogs.map((log) => {
                    // Action formatting
                    let actionLabel = '';
                    let actionColor = 'bg-blue-50 text-blue-600 border-blue-100';
                    let entityTypeLabel = '';

                    if (log.action === 'LEAD_STATUS_CHANGE') {
                      actionLabel = 'Lead Status';
                      actionColor = 'bg-blue-50 text-blue-700 border-blue-100';
                      entityTypeLabel = 'Lead';
                    } else if (log.action === 'MILESTONE_STATUS_CHANGE') {
                      actionLabel = 'Milestone Status';
                      actionColor = 'bg-purple-50 text-purple-700 border-purple-100';
                      entityTypeLabel = 'Milestone';
                    } else if (log.action === 'TASK_STATUS_CHANGE') {
                      actionLabel = 'Task Status';
                      actionColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      entityTypeLabel = 'Task';
                    }

                    return (
                      <div key={log.id} className="relative group">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm ${
                          log.action === 'LEAD_STATUS_CHANGE' ? 'bg-blue-500 border-blue-600 text-white' :
                          log.action === 'MILESTONE_STATUS_CHANGE' ? 'bg-purple-500 border-purple-600 text-white' :
                          'bg-emerald-500 border-emerald-600 text-white'
                        }`}>
                          <span className="text-[10px] font-bold">L</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-slate-50/50 hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${actionColor}`}>
                                {actionLabel}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {new Date(log.createdAt).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-slate-800 mt-2">
                              {entityTypeLabel} <span className="text-slate-900 font-extrabold">{log.entityName}</span>
                              {log.projectName && (
                                <>
                                  {' '}di Proyek <span className="text-slate-900 font-extrabold">{log.projectName}</span>
                                </>
                              )}
                            </p>

                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                              <span className="bg-slate-200/60 px-2 py-0.5 rounded-md line-through text-slate-400">
                                {log.oldValue || 'Kosong'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
                                {log.newValue}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium md:self-end">
                            <span className="text-[11px] text-slate-400">Dipicu oleh:</span>
                            <span className="bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg text-slate-700 font-bold flex items-center gap-1.5 shadow-sm">
                              <User className="w-3 h-3 text-slate-400" />
                              {log.userName}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Invoice & Billing Management */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Manajemen Invoice & Billing</h3>
                <p className="text-xs text-slate-500">Kelola faktur tagihan proyek, status pembayaran, dan verifikasi bukti transfer klien.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={fetchInvoices}
                  variant="secondary"
                  className="flex items-center gap-1.5 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInvoices ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button
                  onClick={() => {
                    setSelectedInvoice(null);
                    setIsInvoiceModalOpen(true);
                  }}
                  variant="primary"
                  className="flex items-center gap-1.5 text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Buat Invoice Baru
                </Button>
              </div>
            </div>

            {/* Invoices Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nomor invoice, nama proyek, atau nama klien..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={invoiceFilterStatus}
                  onChange={(e) => setInvoiceFilterStatus(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Semua Status Invoice</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent (Terbit)</option>
                  <option value="PAID">Paid (Lunas)</option>
                  <option value="OVERDUE">Overdue (Jatuh Tempo)</option>
                </select>
              </div>
            </div>

            {/* Invoices Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {isLoadingInvoices ? (
                <div className="p-12 text-center text-xs font-bold text-slate-400 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span>Memuat data invoice...</span>
                </div>
              ) : invoices.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Belum Ada Invoice</p>
                  <p className="text-xs text-slate-500">Klik "Buat Invoice Baru" untuk menerbitkan faktur tagihan proyek pertama Anda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">No. Invoice</th>
                        <th className="py-3 px-4">Proyek & Klien</th>
                        <th className="py-3 px-4">Tgl Terbit</th>
                        <th className="py-3 px-4">Jatuh Tempo</th>
                        <th className="py-3 px-4 text-right">Total Tagihan</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Bukti Bayar</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-blue-600">{inv.invoiceNumber}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{inv.projectName}</div>
                            <div className="text-[11px] text-slate-500">{inv.clientName} ({inv.clientEmail})</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{inv.issuedDate}</td>
                          <td className="py-3.5 px-4 text-slate-600">{inv.dueDate}</td>
                          <td className="py-3.5 px-4 text-right font-black text-slate-900">
                            Rp {inv.total.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'SENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : inv.status === 'OVERDUE'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {inv.paymentProofUrl ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3" /> Ada Bukti
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Belum Ada</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                title="Lihat Preview & PDF"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setIsInvoiceDetailOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                title="Edit Invoice"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setIsInvoiceModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                title="Hapus Invoice"
                                onClick={() => setDeleteConfirmInvoice({
                                  id: inv.id,
                                  number: inv.invoiceNumber,
                                  projectName: inv.projectName || (inv as any).name || 'Proyek',
                                })}
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Team & Clients Management */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    User Access & Roles
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Users className="w-3 h-3" />
                    {users.length} Terdaftar
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-sora">
                  Manajemen Tim & Klien Portal
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Daftar seluruh pengguna yang memiliki akses ke Client Portal SejatiDimedia beserta status aktivasi dan proyek terkait.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={fetchUsers}
                  icon={<RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />}
                >
                  Segarkan
                </Button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengguna</span>
                <div className="text-2xl font-bold font-sora text-slate-900">{users.length}</div>
                <div className="text-xs text-slate-500">Semua role terdaftar</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Klien Aktif</span>
                <div className="text-2xl font-bold font-sora text-emerald-600">
                  {users.filter(u => u.role === 'CLIENT' && u.activatedAt).length}
                </div>
                <div className="text-xs text-slate-500">Password sudah diatur</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu Aktivasi</span>
                <div className="text-2xl font-bold font-sora text-amber-600">
                  {users.filter(u => u.role === 'CLIENT' && !u.activatedAt).length}
                </div>
                <div className="text-xs text-slate-500">Belum aktivasi password</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Administrator</span>
                <div className="text-2xl font-bold font-sora text-purple-600">
                  {users.filter(u => u.role === 'ADMIN').length}
                </div>
                <div className="text-xs text-slate-500">Akses penuh sistem</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pengguna berdasarkan nama atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
                  <span className="text-slate-400 px-2 font-medium">Role:</span>
                  {(['ALL', 'CLIENT', 'ADMIN'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        userRoleFilter === role
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {role === 'ALL' ? 'Semua' : role === 'CLIENT' ? 'Klien' : 'Admin'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
                  <span className="text-slate-400 px-2 font-medium">Status:</span>
                  {(['ALL', 'ACTIVE', 'PENDING'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setUserStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        userStatusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st === 'ALL' ? 'Semua' : st === 'ACTIVE' ? 'Aktif' : 'Pending'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              {isLoadingUsers ? (
                <div className="p-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-medium">Memuat data pengguna...</span>
                </div>
              ) : (
                (() => {
                  const filteredUsers = users.filter(u => {
                    const matchesSearch = !userSearch ||
                      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.email?.toLowerCase().includes(userSearch.toLowerCase());
                    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
                    const matchesStatus = userStatusFilter === 'ALL' ||
                      (userStatusFilter === 'ACTIVE' ? Boolean(u.activatedAt) : !u.activatedAt);
                    return matchesSearch && matchesRole && matchesStatus;
                  });

                  if (filteredUsers.length === 0) {
                    return (
                      <div className="p-16 text-center text-slate-400 space-y-2">
                        <User className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                        <h4 className="text-sm font-bold text-slate-700">Tidak ada pengguna ditemukan</h4>
                        <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter role.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          <tr>
                            <th className="py-3.5 px-5">Nama & Profil</th>
                            <th className="py-3.5 px-5">Email & Kontak</th>
                            <th className="py-3.5 px-5">Role</th>
                            <th className="py-3.5 px-5">Status Aktivasi</th>
                            <th className="py-3.5 px-5">Total Proyek</th>
                            <th className="py-3.5 px-5">Terdaftar</th>
                            <th className="py-3.5 px-5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.map((usr: any) => {
                            const initials = (usr.name || 'U')
                              .split(' ')
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase();

                            return (
                              <tr key={usr.id} className="hover:bg-slate-50/60 transition-colors">
                                {/* Profil / Nama */}
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                                      usr.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                        : 'bg-blue-100 text-[#2C5098] border border-blue-200'
                                    }`}>
                                      {initials}
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900 font-sans text-sm">{usr.name}</div>
                                      <div className="text-[10px] font-mono text-slate-400">ID: {usr.id.slice(0, 10)}...</div>
                                    </div>
                                  </div>
                                </td>

                                {/* Email */}
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-slate-700">{usr.email}</span>
                                    <button
                                      onClick={() => handleCopyEmail(usr.email)}
                                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                      title="Salin Email"
                                    >
                                      {copiedEmail === usr.email ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>

                                {/* Role */}
                                <td className="py-4 px-5">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                                    usr.role === 'ADMIN'
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : 'bg-blue-50 text-[#2C5098] border-blue-200'
                                  }`}>
                                    {usr.role === 'ADMIN' ? (
                                      <>
                                        <Shield className="w-3 h-3" />
                                        Admin
                                      </>
                                    ) : (
                                      <>
                                        <User className="w-3 h-3" />
                                        Klien
                                      </>
                                    )}
                                  </span>
                                </td>

                                {/* Status Aktivasi */}
                                <td className="py-4 px-5">
                                  {usr.activatedAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      <span>Aktif</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                                      <Clock className="w-4 h-4 text-amber-500" />
                                      <span>Menunggu Aktivasi</span>
                                    </span>
                                  )}
                                </td>

                                {/* Projects */}
                                <td className="py-4 px-5 font-mono font-bold text-slate-800">
                                  {usr._count?.projects || 0} Proyek
                                </td>

                                {/* Terdaftar */}
                                <td className="py-4 px-5 font-mono text-slate-500 text-[11px]">
                                  {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  }) : '-'}
                                </td>

                                {/* Aksi */}
                                <td className="py-4 px-5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleGenerateMagicLink(usr)}
                                      disabled={generatingLinkUserId === usr.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 text-[11px] font-bold transition-all cursor-pointer"
                                      title="Buat & Salin Magic Link Aktivasi"
                                    >
                                      <KeyRound className="w-3.5 h-3.5 text-[#2C5098]" />
                                      <span>{generatingLinkUserId === usr.id ? 'Membuat...' : 'Magic Link'}</span>
                                    </button>

                                    <a
                                      href={`mailto:${usr.email}`}
                                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                      title="Kirim Email"
                                    >
                                      <Mail className="w-4 h-4" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          onConvertToProject={handleConvertToProject}
        />
      )}

      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      <StyleGuideModal
        isOpen={isStyleGuideModalOpen}
        onClose={() => setIsStyleGuideModalOpen(false)}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={() => fetchInvoices()}
        initialInvoice={selectedInvoice}
        projects={projects}
      />

      <InvoiceDetailModal
        isOpen={isInvoiceDetailOpen}
        onClose={() => setIsInvoiceDetailOpen(false)}
        invoice={selectedInvoice}
        userRole="ADMIN"
        onInvoiceUpdated={() => fetchInvoices()}
      />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmInvoice)}
        onClose={() => setDeleteConfirmInvoice(null)}
        onConfirm={async () => {
          if (!deleteConfirmInvoice) return;
          try {
            setIsDeletingInvoice(true);
            const res = await fetch(`/api/admin/invoices/${deleteConfirmInvoice.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal menghapus invoice');
            setDeleteConfirmInvoice(null);
            fetchInvoices();
          } catch (err: any) {
            alert(err.message || 'Gagal menghapus invoice');
          } finally {
            setIsDeletingInvoice(false);
          }
        }}
        isLoading={isDeletingInvoice}
        title="Hapus Invoice Permanen?"
        message={`Apakah Anda yakin ingin menghapus invoice ${deleteConfirmInvoice?.number} (${deleteConfirmInvoice?.projectName}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Ya, Hapus Invoice"
        cancelText="Batal"
        variant="danger"
      />

      {/* Floating Toast Notification */}
      <Toast
        isOpen={!!toastNotification}
        type={toastNotification?.type}
        message={toastNotification?.message || ''}
        onClose={() => setToastNotification(null)}
      />
    </div>
  );
}
