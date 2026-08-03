'use client';

import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Rocket, 
  MessageSquare, 
  FileText, 
  Send
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types/portal';
import { Modal, Button, Badge } from '@/components/ui';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onConvertToProject: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateLead,
  onConvertToProject,
}) => {
  if (!lead) return null;

  const [notes, setNotes] = useState(lead.notes || '');
  const [isConverting, setIsConverting] = useState(false);

  const handleStatusChange = (newStatus: LeadStatus) => {
    if (newStatus === 'Won') {
      const confirmWon = window.confirm(
        'Apakah Anda yakin ingin memindahkan lead ini ke status WON? Pastikan diskusi biaya & detail project sudah selesai disepakati.'
      );
      if (!confirmWon) return;
    }
    const updated: Lead = {
      ...lead,
      status: newStatus,
      timelineHistory: [
        ...lead.timelineHistory,
        {
          id: `tl-${Date.now()}`,
          status: newStatus,
          timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          author: 'Admin',
          note: `Status diubah menjadi ${newStatus}`,
        },
      ],
    };
    onUpdateLead(updated);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Lead = {
      ...lead,
      notes: notes,
      timelineHistory: [
        ...lead.timelineHistory,
        {
          id: `tl-${Date.now()}`,
          status: lead.status,
          timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          author: 'Admin Note',
          note: 'Catatan diperbarui',
        },
      ],
    };

    onUpdateLead(updated);
  };

  const handleConvertClick = async () => {
    const confirmConvert = window.confirm(
      'Apakah Anda yakin ingin mengonversi lead ini ke Client Portal? Tindakan ini akan membuat user baru dan mengirimkan email onboarding magic link.'
    );
    if (!confirmConvert) return;

    setIsConverting(true);
    try {
      await onConvertToProject(lead);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Modal
      isOpen={!!lead}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span>{lead.name}</span>
          <Badge status={lead.status} />
        </div>
      }
      subtitle={`${lead.company} • ${lead.serviceType}`}
    >
      <div className="space-y-6 text-slate-700">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{lead.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{lead.submittedDate}</span>
          </div>
        </div>

        {/* Message */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Pesan Inquiry Client
          </h4>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-sm">
            "{lead.message}"
          </div>
        </div>

        {/* Status Transitions */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Ubah Status Lead
          </h4>
          <div className="flex flex-wrap gap-2">
            {(['New', 'Reviewing', 'Proposal', 'Won', 'Lost', 'Spam'] as LeadStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lead.status === st
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Form */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            Internal Admin Notes (Private)
          </h4>
          <form onSubmit={handleSaveNotes} className="space-y-2">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan internal mengenai lead ini..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" variant="dark" icon={<Send className="w-3.5 h-3.5" />}>
                Simpan Catatan
              </Button>
            </div>
          </form>
        </div>

        {/* Convert to Project Button */}
        {lead.status === 'Won' && (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              onClick={handleConvertClick}
              isLoading={isConverting}
              icon={<Rocket className="w-4 h-4" />}
            >
              {isConverting ? 'Mengonversi & Mengirim Email...' : 'Konversi Ke Client Portal Project'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
