'use client';

import React from 'react';
import { RefreshCw, Calendar as CalendarIcon, Download, Users, CheckCircle2, Clock } from 'lucide-react';
import { Lead, Project } from '@/types/portal';

interface DashboardMetricsProps {
  leads: Lead[];
  projects: Project[];
  activeFilterMonth: string;
  setActiveFilterMonth: (month: string) => void;
  refreshData: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  leads,
  projects,
  activeFilterMonth,
  setActiveFilterMonth,
  refreshData,
}) => {
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const reviewingLeadsCount = leads.filter(l => l.status === 'Reviewing').length;
  const wonLeadsCount = leads.filter(l => l.status === 'Won').length;
  const activeProjectsCount = projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-slate-200/70 mb-6 transition-all">
      {/* Top Title & Month Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
              Ringkasan Performa & Metric Agency
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200/80">
              Live Realtime
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pantau arus lead masuk, konversi deal, dan status proyek berjalan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs font-bold text-slate-700">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={activeFilterMonth}
              onChange={(e) => setActiveFilterMonth(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="November 2024">November 2024</option>
              <option value="Oktober 2024">Oktober 2024</option>
              <option value="September 2024">September 2024</option>
            </select>
          </div>

          <button
            onClick={refreshData}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Refresh metric data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-900/70 uppercase tracking-wider">Inquiry Baru</span>
            <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            {newLeadsCount} <span className="text-xs font-semibold text-slate-500">Lead</span>
          </div>
          <p className="text-[11px] text-blue-700/80 font-medium mt-1">Perlu direspons dalam 24 jam</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900/70 uppercase tracking-wider">Dalam Diskusi</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
            {reviewingLeadsCount} <span className="text-xs font-semibold text-slate-500">Prospek</span>
          </div>
          <p className="text-[11px] text-amber-700/80 font-medium mt-1">Tahap proposal & meeting</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900/70 uppercase tracking-wider">Deal Disepakati</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
            {wonLeadsCount} <span className="text-xs font-semibold text-slate-500">Won</span>
          </div>
          <p className="text-[11px] text-emerald-700/80 font-medium mt-1">DP telah diterima & aktif</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900/70 uppercase tracking-wider">Active Projects</span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            {activeProjectsCount} <span className="text-xs font-semibold text-slate-500">Proyek</span>
          </div>
          <p className="text-[11px] text-purple-700/80 font-medium mt-1">Monitoring di Client Portal</p>
        </div>
      </div>
    </div>
  );
};
