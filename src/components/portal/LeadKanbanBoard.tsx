'use client';

import React from 'react';
import {
  Plus,
  Calendar,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types/portal';
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Badge, Button } from '@/components/ui';

interface LeadKanbanBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  openAddLeadModal: () => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
}

const KANBAN_COLUMNS: { key: LeadStatus; title: string; color: string; badgeStatus: LeadStatus }[] = [
  { key: 'New', title: 'New Leads', color: 'bg-blue-500', badgeStatus: 'New' },
  { key: 'Reviewing', title: 'Reviewing', color: 'bg-amber-500', badgeStatus: 'Reviewing' },
  { key: 'Proposal', title: 'Proposal / Negosiasi', color: 'bg-indigo-500', badgeStatus: 'Proposal' },
  { key: 'Won', title: 'Won (Converted)', color: 'bg-emerald-500', badgeStatus: 'Won' },
  { key: 'Lost', title: 'Lost', color: 'bg-slate-400', badgeStatus: 'Lost' },
  { key: 'Spam', title: 'Spam', color: 'bg-rose-500', badgeStatus: 'Spam' },
];

export const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({
  leads,
  onSelectLead,
  openAddLeadModal,
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 -mb-3">
      {KANBAN_COLUMNS.map((column) => {
        const columnLeads = leads.filter((lead) => lead.status === column.key);

        return (
          <div
            key={column.key}
            className="bg-slate-50/70 rounded-[1.8rem] p-4 border border-slate-200/60 flex flex-col min-h-[500px] min-w-[400px] flex-1"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                <h3 className="font-bold text-slate-800 text-sm">{column.title}</h3>
                <Badge status={column.badgeStatus} count={columnLeads.length} />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={openAddLeadModal}
                icon={<Plus className="w-3.5 h-3.5" />}
                className="w-7 h-7 p-0 bg-white hover:bg-slate-200/60 border border-slate-200/60 shadow-sm"
                title="Add new lead to this status"
              />
            </div>

            {/* Cards List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              {columnLeads.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                  <span>Tidak ada lead di status ini</span>
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    hoverEffect
                    clickable
                    onClick={() => onSelectLead(lead)}
                    className="group relative"
                  >
                    {/* Header Card: Name & Company */}
                    <CardHeader className="mb-2">
                      <div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          {lead.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-0.5">
                          <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      </div>

                      <Badge
                        variant="custom"
                        colorClass="bg-slate-100 text-slate-500 border-slate-200/60"
                        label={lead.source}
                      />
                    </CardHeader>

                    {/* Inquiry Message Preview */}
                    <CardBody>
                      <p className="text-slate-600 text-xs line-clamp-2 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        "{lead.message}"
                      </p>

                      {/* Service Type Tag & Budget */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Badge
                          variant="custom"
                          colorClass="bg-blue-50 text-blue-700 border-blue-100/80"
                          label={lead.serviceType}
                        />
                        <Badge
                          variant="custom"
                          colorClass="bg-slate-100 text-slate-700 border-slate-200/60"
                          label={lead.budgetEstimate}
                        />
                      </div>
                    </CardBody>

                    {/* Footer Card: Date & Action Trigger */}
                    <CardFooter className="pt-2 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{lead.submittedDate}</span>
                      </div>

                      <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>Detail</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
