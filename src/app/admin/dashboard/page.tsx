'use client';

import React, { useState } from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { LeadKanbanBoard } from '@/components/portal/LeadKanbanBoard';
import { DashboardMetrics } from '@/components/portal/DashboardMetrics';
import { LeadDetailModal } from '@/components/portal/LeadDetailModal';
import { AddLeadModal } from '@/components/portal/AddLeadModal';
import { StyleGuideModal } from '@/components/portal/StyleGuideModal';
import { INITIAL_LEADS, INITIAL_PROJECTS } from '@/lib/portalMockData';
import { Lead, LeadStatus, ActiveNavSection, Project } from '@/types/portal';
import { Button } from '@/components/ui';
import { Plus, Kanban, List } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard-leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Admin');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeFilterMonth, setActiveFilterMonth] = useState('November 2024');

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isStyleGuideModalOpen, setIsStyleGuideModalOpen] = useState(false);

  // Filter leads based on search
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.company.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.serviceType.toLowerCase().includes(term) ||
      lead.message.toLowerCase().includes(term)
    );
  });

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
              timelineHistory: [
                ...lead.timelineHistory,
                {
                  id: `tl-${Date.now()}`,
                  status: newStatus,
                  timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
                  author: 'Admin Drag/Drop',
                  note: `Status diubah menjadi ${newStatus}`,
                },
              ],
            }
          : lead
      )
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  const handleConvertToProject = (lead: Lead) => {
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
    handleUpdateLeadStatus(lead.id, 'Won');
  };

  const handleAddLead = (newLeadData: Lead) => {
    setLeads([newLeadData, ...leads]);
    setIsAddLeadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased">
      {/* 1. Left Floating Sidebar */}
      <PortalSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        leadsCount={leads.length}
        projectsCount={projects.length}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => setIsAddLeadModalOpen(true)}
      />

      {/* 2. Main Content Area */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'table'
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
          refreshData={() => {}}
        />

        {/* Kanban Board (Main Content) */}
        <div className="mt-6">
          <LeadKanbanBoard
            leads={filteredLeads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            openAddLeadModal={() => setIsAddLeadModalOpen(true)}
            updateLeadStatus={handleUpdateLeadStatus}
          />
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
    </div>
  );
}
