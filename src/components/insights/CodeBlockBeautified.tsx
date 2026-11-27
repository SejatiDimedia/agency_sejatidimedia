"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Terminal,
  Code2,
  FileCode,
  Hash,
  WrapText,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { highlightCode } from "@/lib/syntaxHighlighter";
import { MermaidDiagram } from "@/components/ui/MermaidDiagram";

export interface CodeBlockBeautifiedProps {
  className?: string;
  children?: React.ReactNode;
  language?: "id" | "en";
  title?: string;
  initialWrap?: boolean;
  initialLineNumbers?: boolean;
}

export default function CodeBlockBeautified({
  className = "",
  children,
  language = "id",
  title,
  initialWrap = false,
  initialLineNumbers = true,
}: CodeBlockBeautifiedProps) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(initialLineNumbers);
  const [wordWrap, setWordWrap] = useState(initialWrap);

  // Extract raw string content
  const rawCode = useMemo(() => {
    return String(children || "").replace(/\n$/, "");
  }, [children]);

  // Extract language from className (e.g., "language-php" -> "php")
  const langMatch = /language-([a-zA-Z0-9_-]+)/.exec(className || "");
  const extractedLang = langMatch ? langMatch[1] : "";

  // If it is a Mermaid diagram, render it visually with MermaidDiagram
  const isMermaid =
    extractedLang === "mermaid" ||
    rawCode.trim().startsWith("graph ") ||
    rawCode.trim().startsWith("flowchart ") ||
    rawCode.trim().startsWith("sequenceDiagram") ||
    rawCode.trim().startsWith("classDiagram") ||
    rawCode.trim().startsWith("stateDiagram") ||
    rawCode.trim().startsWith("erDiagram");

  if (isMermaid) {
    return <MermaidDiagram chart={rawCode} title={title} />;
  }

  // Highlight code and extract metadata
  const {
    lines,
    detectedLanguage,
    detectedFileName,
    totalLines,
    totalChars,
  } = useMemo(() => {
    return highlightCode(rawCode, extractedLang);
  }, [rawCode, extractedLang]);

  const displayTitle = title || detectedFileName || `${detectedLanguage.toUpperCase()} Snippet`;

  // Count callout lines
  const hasAntiPattern = useMemo(() => lines.some((l) => l.isAntiPattern), [lines]);
  const hasBestPractice = useMemo(() => lines.some((l) => l.isBestPractice), [lines]);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Fallback
      }
    }
  };

  const getLanguageBadgeColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "php":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
      case "typescript":
      case "ts":
        return "bg-blue-50 text-[#2C5098] border-blue-200/80";
      case "javascript":
      case "js":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "sql":
        return "bg-cyan-50 text-cyan-800 border-cyan-200/80";
      case "bash":
      case "shell":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "python":
      case "py":
        return "bg-yellow-50 text-yellow-800 border-yellow-200/80";
      case "json":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200/80";
    }
  };

  const isTerminal = detectedLanguage === "bash" || detectedLanguage === "shell" || detectedLanguage === "terminal";

  return (
    <div className="relative my-7 rounded-2xl overflow-hidden border border-slate-200/90 bg-[#F8FAFC] shadow-xs text-left group/code">
      {/* Terminal Window Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F1F5F9]/85 border-b border-slate-200/80 text-xs font-sans select-none">
        {/* Left: Traffic Lights & Tab */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mac Traffic Lights */}
          <div className="flex items-center gap-1.5 shrink-0 opacity-85">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 inline-block"
              title="Close"
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 inline-block"
              title="Minimize"
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40 inline-block"
              title="Expand"
            />
          </div>

          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 text-slate-700 shadow-2xs min-w-0">
            {isTerminal ? (
              <Terminal className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-[#2C5098] shrink-0" />
            )}
            <span className="text-[11.5px] font-sans font-medium truncate max-w-[180px] sm:max-w-[280px]">
              {displayTitle}
            </span>
            <span
              className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border shrink-0 ${getLanguageBadgeColor(
                detectedLanguage
              )}`}
            >
              {detectedLanguage}
            </span>
          </div>
        </div>

        {/* Right: Controls & Copy Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Line Numbers Toggle */}
          <button
            type="button"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            title={
              showLineNumbers
                ? language === "en"
                  ? "Hide line numbers"
                  : "Sembunyikan nomor baris"
                : language === "en"
                ? "Show line numbers"
                : "Tampilkan nomor baris"
            }
            aria-label="Toggle line numbers"
            className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
              showLineNumbers
                ? "bg-white text-[#2C5098] border-slate-200 shadow-2xs"
                : "bg-transparent text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-200/60"
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
          </button>

          {/* Word Wrap Toggle */}
          <button
            type="button"
            onClick={() => setWordWrap(!wordWrap)}
            title={
              wordWrap
                ? language === "en"
                  ? "Disable word wrap"
                  : "Matikan pembungkus teks"
                : language === "en"
                ? "Enable word wrap"
                : "Aktifkan pembungkus teks"
            }
            aria-label="Toggle word wrap"
            className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
              wordWrap
                ? "bg-white text-[#2C5098] border-slate-200 shadow-2xs"
                : "bg-transparent text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-200/60"
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300/70 mx-1" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={language === "en" ? "Copy code snippet" : "Salin baris kode"}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-sans font-medium transition-all cursor-pointer border shadow-2xs ${
              copied
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">
                  {language === "en" ? "Copied!" : "Tersalin!"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{language === "en" ? "Copy" : "Salin"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div
        className={`py-3.5 bg-[#FAFBFD] ${
          wordWrap ? "overflow-x-hidden whitespace-pre-wrap break-words" : "overflow-x-auto"
        } scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent`}
      >
        <div className="table w-full border-collapse">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;

            let rowBgClass = "hover:bg-slate-200/40";
            let lineNumClass = "text-slate-400 group-hover/line:text-slate-600";
            let indicator = null;

            if (line.isAntiPattern) {
              rowBgClass = "bg-rose-50/90 border-l-2 border-rose-500";
              lineNumClass = "text-rose-600 font-bold";
              indicator = <span className="text-rose-600 font-bold mr-1.5 select-none">-</span>;
            } else if (line.isBestPractice) {
              rowBgClass = "bg-emerald-50/90 border-l-2 border-emerald-500";
              lineNumClass = "text-emerald-600 font-bold";
              indicator = <span className="text-emerald-600 font-bold mr-1.5 select-none">+</span>;
            }

            return (
              <div
                key={lineNum}
                className={`table-row group/line transition-colors ${rowBgClass}`}
              >
                {/* Line Number Cell (Sticky Left when horizontally scrolling) */}
                {showLineNumbers && (
                  <div
                    className={`table-cell text-right select-none pr-3.5 pl-4 font-sans text-xs w-[1%] whitespace-nowrap align-top py-0.5 sticky left-0 bg-[#FAFBFD] z-10 border-r border-slate-200/70 ${lineNumClass}`}
                  >
                    {lineNum}
                  </div>
                )}

                {/* Code Token Cell */}
                <div
                  className={`table-cell pr-5 pl-4 font-sans text-xs sm:text-[13px] leading-relaxed align-top py-0.5 text-slate-700 prism-code ${
                    wordWrap ? "break-words" : "whitespace-pre"
                  }`}
                >
                  {indicator}
                  <span dangerouslySetInnerHTML={{ __html: line.html }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Window Footer / Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#F1F5F9]/75 border-t border-slate-200/80 text-[11px] font-sans text-slate-500 select-none">
        <div className="flex items-center gap-3">
          <span>
            {totalLines} {language === "en" ? "lines" : "baris"}
          </span>
          <span className="text-slate-300">•</span>
          <span>{totalChars} chars</span>

          {hasAntiPattern && (
            <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <ShieldAlert className="w-3 h-3" />
              Anti-Pattern
            </span>
          )}

          {hasBestPractice && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Best Practice
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[10.5px]">
          <span>UTF-8</span>
          <span className="text-slate-300">•</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </div>
  );
}
