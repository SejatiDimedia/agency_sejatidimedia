'use client';

import React, { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Lead } from '@/types/portal';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: 'Web Development' as Lead['serviceType'],
    budgetEstimate: 'Rp 20M - 40M',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      company: formData.company || 'Personal/Company',
      email: formData.email,
      phone: formData.phone || '-',
      serviceType: formData.serviceType,
      budgetEstimate: formData.budgetEstimate,
      submittedDate: 'Hari ini',
      status: 'New',
      notes: '',
      source: 'Website Form',
      message: formData.message || 'Inquiry baru via manual admin.',
      timelineHistory: [
        {
          id: `tl-${Date.now()}`,
          status: 'New',
          timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          author: 'Admin Manual Add',
        },
      ],
    };

    onAddLead(newLead);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      serviceType: 'Web Development',
      budgetEstimate: 'Rp 20M - 40M',
      message: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Lead Baru Manual"
      subtitle="Inputkan data calon klien secara langsung ke sistem."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Budi Santoso"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Nama Perusahaan"
            placeholder="Contoh: Nusantara Tech"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Client"
            type="email"
            placeholder="client@email.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Nomor Telepon / WhatsApp"
            placeholder="+62 812-..."
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Jenis Layanan
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value as Lead['serviceType'] })
              }
              className="w-full bg-white text-slate-800 text-sm font-medium px-4 py-2.5 rounded-2xl border border-slate-200/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Custom Software">Custom Software</option>
            </select>
          </div>

          <Input
            label="Estimasi Budget"
            placeholder="Contoh: Rp 30M - 50M"
            value={formData.budgetEstimate}
            onChange={(e) => setFormData({ ...formData, budgetEstimate: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pesan / Detail Kebutuhan
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Jelaskan kebutuhan proyek..."
            className="w-full bg-white text-slate-800 text-sm font-medium p-4 rounded-2xl border border-slate-200/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
