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
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "typescript":
      case "ts":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "javascript":
      case "js":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "sql":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "bash":
      case "shell":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "python":
      case "py":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "json":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const isTerminal = detectedLanguage === "bash" || detectedLanguage === "shell" || detectedLanguage === "terminal";

  return (
    <div className="relative my-7 rounded-2xl overflow-hidden border border-slate-800/90 bg-[#0B0F17] shadow-[0_16px_40px_rgba(0,0,0,0.45)] text-left group/code">
      {/* Top Hairline Accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#2C5098]/70 to-transparent opacity-80" />

      {/* Terminal Window Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#121722] border-b border-slate-800 text-xs font-sans select-none">
        {/* Left: Traffic Lights & Tab */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mac Traffic Lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 inline-block shadow-xs"
              title="Close"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 inline-block shadow-xs"
              title="Minimize"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 inline-block shadow-xs"
              title="Expand"
            />
          </div>

          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1a2130] border border-slate-700/60 text-slate-200 shadow-2xs min-w-0">
            {isTerminal ? (
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
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
                ? "bg-slate-800 text-blue-300 border-slate-700"
                : "bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/60"
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
                ? "bg-slate-800 text-blue-300 border-slate-700"
                : "bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/60"
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-700/60 mx-1" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={language === "en" ? "Copy code snippet" : "Salin baris kode"}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-sans font-medium transition-all cursor-pointer border shadow-2xs ${
              copied
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/70"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">
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
        className={`py-3.5 ${
          wordWrap ? "overflow-x-hidden whitespace-pre-wrap break-words" : "overflow-x-auto"
        } scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}
      >
        <div className="table w-full border-collapse">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;

            let rowBgClass = "hover:bg-white/[0.04]";
            let lineNumClass = "text-slate-500/50 group-hover/line:text-slate-400";
            let indicator = null;

            if (line.isAntiPattern) {
              rowBgClass = "bg-rose-500/10 border-l-2 border-rose-500";
              lineNumClass = "text-rose-400 font-bold";
              indicator = <span className="text-rose-400 font-bold mr-1.5 select-none">-</span>;
            } else if (line.isBestPractice) {
              rowBgClass = "bg-emerald-500/10 border-l-2 border-emerald-500";
              lineNumClass = "text-emerald-400 font-bold";
              indicator = <span className="text-emerald-400 font-bold mr-1.5 select-none">+</span>;
            }

            return (
              <div
                key={lineNum}
                className={`table-row group/line transition-colors ${rowBgClass}`}
              >
                {/* Line Number Cell (Sticky Left when horizontally scrolling) */}
                {showLineNumbers && (
                  <div
                    className={`table-cell text-right select-none pr-3.5 pl-4 font-sans text-xs w-[1%] whitespace-nowrap align-top py-0.5 sticky left-0 bg-[#0B0F17] z-10 border-r border-slate-800/80 ${lineNumClass}`}
                  >
                    {lineNum}
                  </div>
                )}

                {/* Code Token Cell */}
                <div
                  className={`table-cell pr-5 pl-4 font-sans text-xs sm:text-[13px] leading-relaxed align-top py-0.5 text-slate-200 prism-code ${
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
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#0E131E] border-t border-slate-800/80 text-[11px] font-sans text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>
            {totalLines} {language === "en" ? "lines" : "baris"}
          </span>
          <span className="text-slate-700">•</span>
          <span>{totalChars} chars</span>

          {hasAntiPattern && (
            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <ShieldAlert className="w-3 h-3" />
              Anti-Pattern
            </span>
          )}

          {hasBestPractice && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Best Practice
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-[10.5px]">
          <span>UTF-8</span>
          <span className="text-slate-700">•</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </div>
  );
}
