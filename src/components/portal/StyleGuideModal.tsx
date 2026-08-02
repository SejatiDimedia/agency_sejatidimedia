'use client';

import React from 'react';
import { Sparkles, Palette, Layout, Type } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StyleGuideModal: React.FC<StyleGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>SejatiDimedia Design Guide</span>
        </div>
      }
      subtitle="Panduan styling presisi sesuai dengan referensi visual untuk pengerjaan seluruh halaman portal."
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Section 1: Color Tokens */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" />
            1. Skema Warna (Light Mode SaaS Aesthetic)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-[#f0f4f8] border border-slate-300/60">
              <span className="block font-bold text-slate-900">#f0f4f8</span>
              <span className="text-[10px] text-slate-500">Page Canvas BG</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="block font-bold text-slate-900">#ffffff</span>
              <span className="text-[10px] text-slate-500">Floating Card BG</span>
            </div>
            <div className="p-3 rounded-xl bg-[#4A85D9] text-white">
              <span className="block font-bold">#4A85D9</span>
              <span className="text-[10px] text-blue-100">Primary Blue Fill</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-white">
              <span className="block font-bold">#0f172a</span>
              <span className="text-[10px] text-slate-300">Dark Text / Mark</span>
            </div>
          </div>
        </div>

        {/* Section 2: Sidebar Specification */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-600" />
            2. Spesifikasi Floating Sidebar
          </h3>
          <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-medium">
            <li><strong>Border Radius:</strong> Floating container rounded-3xl (`rounded-[2rem]`).</li>
            <li><strong>Active Nav Pill:</strong> Warna biru terang `#4A85D9` dengan text putih, rounded-2xl, dan bayangan lembut `shadow-md shadow-blue-500/25`.</li>
            <li><strong>Inactive Item:</strong> Text slate-600, hover background `bg-slate-100/80`, rounded-2xl.</li>
            <li><strong>Category Labels:</strong> Text uppercase `text-[11px] font-bold text-slate-400 tracking-wider`.</li>
          </ul>
        </div>

        {/* Section 3: Typography */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            3. Typografi & Form Factor
          </h3>
          <p className="font-medium text-slate-600 leading-relaxed">
            Menggunakan <strong>Plus Jakarta Sans</strong> untuk keterbacaan tinggi di layar monitor. Sudut elemen input dan modal dibuat konsisten menggunakan `rounded-2xl` dan `rounded-[2.5rem]`.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <Button variant="dark" size="sm" onClick={onClose}>
          Mengerti & Tutup
        </Button>
      </div>
    </Modal>
  );
};
