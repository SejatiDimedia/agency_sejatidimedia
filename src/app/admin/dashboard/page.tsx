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
import { Lead, LeadStatus, ActiveNavSection, Project } from '@/types/portal';
import { Button, Toast } from '@/components/ui';
import { Plus, Kanban, List, ShieldAlert } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard-leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Admin');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeFilterMonth, setActiveFilterMonth] = useState('November 2024');
  const [showSpamAndLost, setShowSpamAndLost] = useState(true);

  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

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
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased">
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
        />

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
