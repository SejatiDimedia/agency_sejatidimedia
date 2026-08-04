'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, FileText, CheckCircle2, DollarSign, Calculator } from 'lucide-react';
import { Invoice, InvoiceItem, Project } from '@/types/portal';
import { Button } from '@/components/ui';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialInvoice?: Invoice | null;
  projects: Project[];
  preselectedProjectId?: string;
}

export function InvoiceModal({
  isOpen,
  onClose,
  onSuccess,
  initialInvoice,
  projects,
  preselectedProjectId,
}: InvoiceModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [issuedDate, setIssuedDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [bankInfo, setBankInfo] = useState<string>(
    'Bank BCA: 1234-5678-90 a.n. SejatiDimedia Agency\nBank Mandiri: 987-00-1234567-8 a.n. Timur Dian Radha Sejati'
  );
  const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'PAID'>('DRAFT');

  const [items, setItems] = useState<Array<{ id?: string; description: string; quantity: number; unitPrice: number }>>([
    { description: 'Jasa Pengembangan Web & Sistem Agency', quantity: 1, unitPrice: 15000000 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (initialInvoice) {
        setSelectedProjectId(initialInvoice.projectId);
        setIssuedDate(initialInvoice.issuedDate || new Date().toISOString().split('T')[0]);
        setDueDate(initialInvoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
        setTaxPercent(initialInvoice.taxPercent || 0);
        setNotes(initialInvoice.notes || '');
        setBankInfo(initialInvoice.bankInfo || 'Bank BCA: 1234-5678-90 a.n. SejatiDimedia Agency');
        setStatus((initialInvoice.status as any) || 'DRAFT');
        setItems(
          initialInvoice.items.length > 0
            ? initialInvoice.items.map((i) => ({
              id: i.id,
              description: i.description,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            }))
            : [{ description: 'Jasa Pengembangan Web', quantity: 1, unitPrice: 10000000 }]
        );
      } else {
        setSelectedProjectId(preselectedProjectId || (projects.length > 0 ? projects[0].id : ''));
        const today = new Date().toISOString().split('T')[0];
        const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
        setIssuedDate(today);
        setDueDate(twoWeeks);
        setTaxPercent(0);
        setNotes('Terima kasih atas kerja sama Anda dengan SejatiDimedia.');
        setStatus('DRAFT');

        // Default hybrid item populate
        const targetProj = projects.find((p) => p.id === (preselectedProjectId || projects[0]?.id));
        if (targetProj) {
          populateFromProject(targetProj);
        } else {
          setItems([{ description: 'Jasa Pengembangan Web & Aplikasi', quantity: 1, unitPrice: 15000000 }]);
        }
      }
    }
  }, [isOpen, initialInvoice, preselectedProjectId, projects]);

  const getProjectName = (p: any) => p?.projectName || p?.name || 'Proyek SejatiDimedia';
  const getClientName = (p: any) => p?.clientName || p?.user?.name || p?.clientCompany || p?.user?.email || 'Klien';

  const populateFromProject = (project: any) => {
    const newItems: Array<{ description: string; quantity: number; unitPrice: number }> = [];
    const projName = getProjectName(project);

    // Main project scope item
    newItems.push({
      description: `Jasa Development: ${projName}`,
      quantity: 1,
      unitPrice: 15000000,
    });

    // Milestone line items if available
    if (project.milestones && project.milestones.length > 0) {
      project.milestones.forEach((m: any) => {
        if (m.status === 'Done' || m.status === 'In Progress') {
          newItems.push({
            description: `Milestone: ${m.title}`,
            quantity: 1,
            unitPrice: 5000000,
          });
        }
      });
    }

    setItems(newItems);
  };

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const targetProj = projects.find((p) => p.id === projId);
    if (targetProj && !initialInvoice) {
      populateFromProject(targetProj);
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Subtotal & Tax Calculations
  const subtotal = items.reduce((acc, curr) => acc + (curr.quantity || 0) * (curr.unitPrice || 0), 0);
  const taxAmount = (subtotal * (taxPercent || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setErrorMsg('Silakan pilih proyek terlebih dahulu.');
      return;
    }
    if (items.some((i) => !i.description.trim())) {
      setErrorMsg('Semua line item wajib memiliki deskripsi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialInvoice ? `/api/admin/invoices/${initialInvoice.id}` : '/api/admin/invoices';
      const method = initialInvoice ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          issuedDate,
          dueDate,
          taxPercent,
          notes,
          bankInfo,
          status,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan invoice');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menyimpan invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {initialInvoice ? `Edit Invoice (${initialInvoice.invoiceNumber})` : 'Buat Invoice Proyek Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialInvoice ? 'Perbarui line item, status, atau instruksi pembayaran' : 'Hybrid Builder: Auto-populate dari project & edit item bebas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Project & Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Proyek Klien <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                disabled={Boolean(initialInvoice)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                {projects.map((p: any) => {
                  const pName = getProjectName(p);
                  const cName = getClientName(p);
                  return (
                    <option key={p.id} value={p.id}>
                      {pName} — {cName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Terbit <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jatuh Tempo <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-0.5">Status Publikasi Invoice</label>
              <p className="text-[11px] text-slate-500">
                Pilih DRAFT jika masih diproses, atau SENT untuk menerbitkan dan mengirim notifikasi email ke klien.
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DRAFT">DRAFT (Internal Admin)</option>
              <option value="SENT">SENT (Terbitkan & Kirim Email)</option>
              <option value="PAID">PAID (Verifikasi Lunas)</option>
            </select>
          </div>

          {/* Line Items Table Builder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" /> Line Items / Rincian Pekerjaan
                </h4>
                <p className="text-xs text-slate-500">
                  Ubah deskripsi, jumlah, atau harga satuan. Klik tombol di kanan bawah untuk menambah baris baru.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const targetProj = projects.find((p) => p.id === selectedProjectId);
                  if (targetProj) populateFromProject(targetProj);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                🔄 Pre-fill Ulang dari Milestone
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Deskripsi Item / Layanan</th>
                    <th className="py-3 px-4 w-20 text-center">Qty</th>
                    <th className="py-3 px-4 w-36">Harga Satuan (Rp)</th>
                    <th className="py-3 px-4 w-36">Jumlah (Rp)</th>
                    <th className="py-3 px-4 w-12 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const lineAmount = (item.quantity || 0) * (item.unitPrice || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="Deskripsi layanan/item..."
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            min="0"
                            step="50000"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          Rp {lineAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length === 1}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris Item
                </button>
              </div>
            </div>
          </div>

          {/* Subtotal, Tax, and Grand Total Calculation Box */}
          <div className="flex flex-col md:flex-row justify-between gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instruksi Rekening Pembayaran (Bank Info)
                </label>
                <textarea
                  rows={2}
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Detail rekening bank..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan untuk Klien (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Keterangan termin / ketentuan pelunasan..."
                />
              </div>
            </div>

            <div className="w-full md:w-72 space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 flex flex-col justify-center">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  Pajak (PPN %):
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-14 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-center font-bold"
                  />
                </span>
                <span className="font-semibold text-slate-800">Rp {taxAmount.toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-black text-blue-700">
                <span>Grand Total:</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {initialInvoice ? 'Simpan Perubahan Invoice' : 'Terbitkan Invoice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
