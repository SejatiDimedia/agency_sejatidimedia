"use client";

import React from "react";
import { Table2, ArrowRightLeft } from "lucide-react";

export interface BeautifiedTableProps {
  children?: React.ReactNode;
  language?: "id" | "en";
  title?: string;
}

export function BeautifiedTable({
  children,
  language = "id",
  title,
  ...props
}: BeautifiedTableProps & any) {
  const defaultTitle =
    language === "en"
      ? "Architecture Matrix & Technical Specification"
      : "Tabel Komparasi & Matriks Rekayasa Sistem";

  const scrollHint =
    language === "en"
      ? "Swipe horizontally if table is clipped"
      : "Geser horizontal jika kolom terpotong";

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0B0F17] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] text-left">
      {/* Top Hairline Accent Line matching Code Block */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#2C5098]/70 to-transparent opacity-80" />

      {/* Table Window Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-50/90 dark:bg-[#121722] border-b border-slate-200/90 dark:border-slate-800 text-xs font-sans select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#2C5098]/10 dark:bg-blue-500/20 text-[#2C5098] dark:text-blue-300 flex items-center justify-center shrink-0 border border-[#2C5098]/20 dark:border-blue-500/30">
            <Table2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#2C5098] dark:text-blue-300 truncate">
            {title || defaultTitle}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] font-sans text-slate-400 shrink-0">
          <ArrowRightLeft className="w-3 h-3 text-[#2C5098] dark:text-blue-400" />
          <span>{scrollHint}</span>
        </div>
      </div>

      {/* Responsive Scroll Viewport with subtle custom scrollbar */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm" {...props}>
          {children}
        </table>
      </div>

      {/* Mobile Swipe Cue Footer */}
      <div className="sm:hidden px-4 py-2 bg-slate-50/70 dark:bg-[#0E131E] border-t border-slate-100 dark:border-slate-800/80 text-[10.5px] font-sans text-slate-400 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-sans">
          <ArrowRightLeft className="w-3 h-3 text-[#2C5098] dark:text-blue-400 shrink-0" />
          {scrollHint}
        </span>
      </div>
    </div>
  );
}

export function BeautifiedThead({ children, ...props }: any) {
  return (
    <thead
      className="bg-slate-100/90 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 border-b border-slate-200/90 dark:border-slate-800"
      {...props}
    >
      {children}
    </thead>
  );
}

export function BeautifiedTbody({ children, ...props }: any) {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80" {...props}>
      {children}
    </tbody>
  );
}

export function BeautifiedTr({ children, ...props }: any) {
  return (
    <tr
      className="even:bg-slate-50/40 dark:even:bg-white/[0.015] hover:bg-[#2C5098]/[0.035] dark:hover:bg-blue-500/[0.05] transition-colors duration-150 group/row"
      {...props}
    >
      {children}
    </tr>
  );
}

export function BeautifiedTh({ children, ...props }: any) {
  return (
    <th
      className="px-5 py-3.5 text-[11px] sm:text-xs font-sans font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 whitespace-nowrap border-r border-slate-200/60 dark:border-slate-800/60 last:border-r-0 first:bg-slate-100 dark:first:bg-slate-900"
      {...props}
    >
      {children}
    </th>
  );
}

export function BeautifiedTd({ children, ...props }: any) {
  return (
    <td
      className="px-5 py-4 text-xs sm:text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed align-top border-r border-slate-100/80 dark:border-slate-800/40 last:border-r-0 font-sans group-hover/row:text-slate-900 dark:group-hover/row:text-slate-100 transition-colors first:font-semibold first:text-slate-900 dark:first:text-slate-100 first:bg-slate-50/40 dark:first:bg-white/[0.01]"
      {...props}
    >
      {children}
    </td>
  );
}
