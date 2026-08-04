'use client';

import React, { useState } from 'react';
import { X, Printer, Upload, CheckCircle2, Clock, AlertTriangle, FileText, Download, Building2, ExternalLink, Trash2 } from 'lucide-react';
import { Invoice } from '@/types/portal';
import { Button, ConfirmModal } from '@/components/ui';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  userRole?: 'ADMIN' | 'CLIENT';
  onInvoiceUpdated?: () => void;
}

export function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  userRole = 'CLIENT',
  onInvoiceUpdated,
}: InvoiceDetailModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingProof, setIsDeletingProof] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDeleteProof, setShowConfirmDeleteProof] = useState(false);
  const [showConfirmVerifyPaid, setShowConfirmVerifyPaid] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen || !invoice) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas / Paid
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran / Sent
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Jatuh Tempo / Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5" /> Draft Internal
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUploadPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatusMsg({ type: 'error', message: 'Silakan pilih file bukti pembayaran.' });
      return;
    }

    setIsUploading(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/projects/invoices/${invoice.id}/payment-proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah bukti pembayaran');
      }

      setStatusMsg({ type: 'success', message: 'Bukti pembayaran berhasil diunggah! Admin akan mengecek.' });
      setFile(null);
      if (onInvoiceUpdated) onInvoiceUpdated();
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err?.message || 'Terjadi kesalahan saat unggah.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyPaid = async () => {
    setIsVerifying(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifyPaid: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memverifikasi status pembayaran');
      }

      setStatusMsg({ type: 'success', message: 'Invoice berhasil diverifikasi sebagai LUNAS!' });
      setShowConfirmVerifyPaid(false);
      if (onInvoiceUpdated) onInvoiceUpdated();
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err?.message || 'Gagal memverifikasi pembayaran.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus invoice');
      setShowConfirmDelete(false);
      if (onInvoiceUpdated) onInvoiceUpdated();
      onClose();
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err?.message || 'Gagal menghapus invoice.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteProof = async () => {
    try {
      setIsDeletingProof(true);
      const res = await fetch(`/api/projects/invoices/${invoice.id}/payment-proof`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus bukti pembayaran');

      setStatusMsg({ type: 'success', message: 'Bukti pembayaran berhasil dihapus.' });
      setShowConfirmDeleteProof(false);
      if (onInvoiceUpdated) onInvoiceUpdated();
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err?.message || 'Gagal menghapus bukti pembayaran.' });
    } finally {
      setIsDeletingProof(false);
    }
  };

  const formatDateBilingual = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="print-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Printable CSS style injection */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        @media print {
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide no-print controls */
          .no-print,
          .no-print * {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }

          /* Reset Modal Backdrop & Wrapper for Printing */
          .print-modal-overlay {
            position: static !important;
            background: transparent !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
            height: auto !important;
            width: 100% !important;
          }

          .print-modal-card {
            position: static !important;
            max-width: 100% !important;
            width: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          #printable-invoice {
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
          }

          /* Preserve Side-by-Side Flex & Grid Layouts on Print */
          .print-flex-row {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }

          .print-grid-2 {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.5rem !important;
          }

          .print-text-right {
            text-align: right !important;
          }
        }
      `}</style>

      <div className="print-modal-card relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            {getStatusBadge(invoice.status)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" /> Cetak / Print PDF
            </button>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4 text-rose-600" /> Hapus Invoice
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMsg && (
            <div
              className={`no-print p-4 rounded-xl text-xs font-semibold ${statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
            >
              {statusMsg.message}
            </div>
          )}

          {/* Printable Invoice View Paper */}
          <div
            id="printable-invoice"
            className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm space-y-8"
          >
            {/* Header: Kop Agency + Invoice Metadata */}
            <div className="print-flex-row flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <img src="/logo.svg" alt="SejatiDimedia Logo" className="w-full h-full object-contain" />
                  </div>
                  <span
                    className="text-xl font-extrabold text-slate-900 tracking-tight uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span style={{ color: '#2E54A2' }}>Sejati</span>{' '}
                    <span style={{ color: '#23385B' }}>Dimedia</span>
                  </span>
                </div>
                <div className="space-y-0.5 text-xs text-slate-500 font-medium">
                  <p className="font-semibold text-slate-700">SejatiDimedia Agency</p>
                  <p>Digital Product Design & High-Performance Engineering</p>
                  <p className="whitespace-nowrap">
                    Email: sejatidimedia@gmail.com &nbsp;|&nbsp; Web: sejatidimedia.web.id
                  </p>
                </div>
              </div>

              <div className="print-text-right sm:text-right">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">FAKTUR / INVOICE</h1>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{invoice.invoiceNumber}</p>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <p>Tanggal Terbit / Issue Date: <strong className="text-slate-800">{formatDateBilingual(invoice.issuedDate)}</strong></p>
                  <p>Jatuh Tempo / Due Date: <strong className="text-slate-800">{formatDateBilingual(invoice.dueDate)}</strong></p>
                </div>
              </div>
            </div>

            {/* Billed To & Billed From */}
            <div className="print-grid-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DITUJUKAN KEPADA / BILLED TO:</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{invoice.clientName || 'Klien SejatiDimedia'}</h4>
                <p className="text-slate-600">{invoice.clientEmail}</p>
                <p className="text-slate-600 mt-1">Proyek / Project: <strong>{invoice.projectName}</strong></p>
              </div>

              <div className="print-text-right sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DITERBITKAN OLEH / ISSUED BY:</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Sejati Dimedia Agency</h4>
                <p className="text-slate-600">Timur Dian Radha Sejati (Founder & Lead)</p>
                <p className="text-slate-600 mt-1">Status Pembayaran / Payment: <strong className="uppercase">{invoice.status}</strong></p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Deskripsi Layanan / Description</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Qty</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Harga Satuan / Unit Price</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Jumlah / Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 px-3 text-center font-semibold">{item.quantity}</td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        Rp {item.unitPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        Rp {item.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Bank Info */}
            <div className="print-flex-row flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
              <div className="flex-1 space-y-3 text-xs">
                <div>
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" /> Informasi Rekening / Payment Details:
                  </h5>
                  <pre className="font-sans whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 text-[11px] leading-relaxed">
                    {invoice.bankInfo || 'Bank BCA: 1234-5678-90 a.n. PT SejatiDimedia Technology'}
                  </pre>
                </div>

                {invoice.notes && (
                  <div>
                    <span className="font-bold text-slate-800">Catatan / Notes:</span>
                    <p className="text-slate-600 font-medium italic mt-0.5">{invoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-80 shrink-0 space-y-2.5 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 flex flex-col justify-end">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="whitespace-nowrap font-medium">Subtotal:</span>
                  <span className="font-semibold text-slate-800 whitespace-nowrap">
                    Rp {invoice.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="whitespace-nowrap font-medium">PPN / Tax ({invoice.taxPercent}%):</span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">
                      Rp {invoice.taxAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-slate-300 flex justify-between items-center font-black text-blue-700">
                  <span className="whitespace-nowrap text-xs tracking-wider uppercase">TOTAL AMOUNT:</span>
                  <span className="text-base sm:text-lg whitespace-nowrap font-black">
                    Rp {invoice.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Actions Area for Client & Admin (Hidden on Print) */}
          <div className="no-print space-y-4">
            {/* Admin Verification Box */}
            {userRole === 'ADMIN' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Aksi Admin Verification</h4>
                  <p className="text-[11px] text-slate-500">
                    {invoice.status === 'PAID'
                      ? `Invoice ini sudah LUNAS pada ${invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('id-ID') : '-'}.`
                      : 'Periksa bukti pembayaran klien di bawah lalu klik Verifikasi Lunas jika dana sudah masuk.'}
                  </p>
                </div>
                {invoice.status !== 'PAID' && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowConfirmVerifyPaid(true)}
                    isLoading={isVerifying}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span>Verifikasi Lunas / Paid</span>
                    </div>
                  </Button>
                )}
              </div>
            )}

            {/* Payment Proof Preview / Upload Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Bukti Pembayaran / Transfer Klien
              </h4>

              {invoice.paymentProofUrl ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bukti Transfer Telah Diunggah</p>
                      <p className="text-[11px] text-slate-500">
                        Waktu Unggah:{' '}
                        {invoice.paymentUploadedAt
                          ? new Date(invoice.paymentUploadedAt).toLocaleString('id-ID')
                          : 'Baru saja'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={
                        invoice.paymentProofUrl && !invoice.paymentProofUrl.startsWith('https://pub-')
                          ? invoice.paymentProofUrl
                          : `/api/projects/invoices/${invoice.id}/payment-proof`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Lihat Bukti Bayar <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {invoice.status !== 'PAID' && (
                      <button
                        type="button"
                        onClick={() => setShowConfirmDeleteProof(true)}
                        disabled={isDeletingProof}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Bukti
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Belum ada bukti pembayaran yang diunggah.</p>
              )}

              {/* Upload Form for Clients */}
              {userRole === 'CLIENT' && invoice.status !== 'PAID' && (
                <form onSubmit={handleUploadPaymentProof} className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    {invoice.paymentProofUrl ? 'Ganti Bukti Transfer (Gambar JPG/PNG atau PDF, maks 10MB)' : 'Unggah Bukti Transfer Baru (Gambar JPG/PNG atau PDF, maks 10MB)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <Button type="submit" variant="primary" isLoading={isUploading} disabled={!file}>
                      Unggah Bukti
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Invoice Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteInvoice}
        isLoading={isDeleting}
        title="Hapus Invoice Permanen?"
        message={`Apakah Anda yakin ingin menghapus invoice ${invoice.invoiceNumber} (${invoice.projectName}) secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Ya, Hapus Invoice"
        cancelText="Batal"
        variant="danger"
      />

      {/* Delete Payment Proof Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDeleteProof}
        onClose={() => setShowConfirmDeleteProof(false)}
        onConfirm={handleDeleteProof}
        isLoading={isDeletingProof}
        title="Hapus Bukti Pembayaran?"
        message="Apakah Anda yakin ingin menghapus bukti transfer yang telah diunggah? Anda dapat mengunggah bukti pembayaran baru setelah ini."
        confirmText="Ya, Hapus Bukti"
        cancelText="Batal"
        variant="danger"
      />

      {/* Verify Payment Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmVerifyPaid}
        onClose={() => setShowConfirmVerifyPaid(false)}
        onConfirm={handleVerifyPaid}
        isLoading={isVerifying}
        title="Verifikasi Pembayaran Lunas"
        message={`Apakah Anda yakin ingin memverifikasi pembayaran invoice ${invoice.invoiceNumber} (${invoice.projectName}) ini sebagai LUNAS? Status invoice akan berubah menjadi PAID.`}
        confirmText="Ya, Verifikasi Lunas"
        cancelText="Batal"
        variant="info"
      />
    </div>
  );
}
