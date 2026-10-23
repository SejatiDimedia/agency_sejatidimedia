"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Eye,
  Workflow,
  Download,
  AlertTriangle,
} from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const uniqueId = useId().replace(/:/g, "_");
  const containerRef = useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"diagram" | "code">("diagram");
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Clean code string (strip leading/trailing whitespace)
  const cleanChart = chart.trim();

  // Render Mermaid diagram
  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!cleanChart) return;
      setIsLoading(true);
      setError(null);

      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = document.documentElement.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          fontFamily: "inherit",
          theme: isDark ? "dark" : "base",
          themeVariables: isDark
            ? {
                darkMode: true,
                background: "#0f172a",
                primaryColor: "#1e293b",
                primaryTextColor: "#f8fafc",
                primaryBorderColor: "#3b82f6",
                lineColor: "#60a5fa",
                secondaryColor: "#1e1b4b",
                tertiaryColor: "#0f172a",
                noteBkgColor: "#1e293b",
                noteTextColor: "#f8fafc",
                fontSize: "13px",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                primaryColor: "#eff6ff",
                primaryTextColor: "#0f172a",
                primaryBorderColor: "#2563eb",
                lineColor: "#2563eb",
                secondaryColor: "#f8fafc",
                tertiaryColor: "#f1f5f9",
                noteBkgColor: "#f8fafc",
                noteTextColor: "#0f172a",
                fontSize: "13px",
              },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 20,
            useMaxWidth: false,
          },
        });

        const renderId = `mermaid_${uniqueId}_${Date.now()}`;
        const { svg } = await mermaid.render(renderId, cleanChart);

        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Mermaid rendering failed:", err);
          setError(err?.message || "Gagal memproses sintaks diagram Mermaid.");
          setIsLoading(false);
        }
      }
    }

    renderChart();

    // Re-render when theme changes (light/dark mode)
    const observer = new MutationObserver(() => {
      renderChart();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [cleanChart, uniqueId]);

  // Copy code handler
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(cleanChart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Download SVG handler
  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `architecture-diagram-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => setZoom(1);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      <div className="my-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs overflow-hidden transition-all">
        {/* Header Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          {/* Title & Badge */}
          <div className="flex items-center gap-2 font-sans font-bold text-slate-800 dark:text-slate-200">
            <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Workflow className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-tight">{title || "Arsitektur Sistem (Mermaid)"}</span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-0.5 border border-slate-300/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setViewMode("diagram")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "diagram"
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "code"
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Source</span>
              </button>
            </div>

            {/* Zoom Controls (Diagram view only) */}
            {viewMode === "diagram" && !error && (
              <div className="hidden sm:flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-0.5 border border-slate-300/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Perkecil (-)"
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  title="Reset Zoom (100%)"
                  className="px-1.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Perbesar (+)"
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Download SVG */}
            {viewMode === "diagram" && svgContent && (
              <button
                type="button"
                onClick={handleDownloadSvg}
                title="Unduh SVG"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Copy Code */}
            <button
              type="button"
              onClick={handleCopyCode}
              title="Salin Kode Mermaid"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen Expand */}
            {viewMode === "diagram" && !error && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                title="Buka Layar Penuh"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body Area */}
        <div className="relative min-h-[160px] max-h-[640px] overflow-auto p-4 sm:p-6 bg-slate-50/40 dark:bg-slate-950/40">
          {viewMode === "code" ? (
            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto select-all leading-relaxed">
              <code>{cleanChart}</code>
            </pre>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2 text-slate-400">
              <Workflow className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-mono">Merender diagram arsitektur...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-amber-300/80 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Tidak dapat merender diagram secara visual</span>
              </div>
              <p className="font-mono text-[11px] opacity-80">{error}</p>
              <pre className="p-3 mt-2 rounded bg-black/5 dark:bg-black/30 font-mono text-[11px] overflow-x-auto">
                {cleanChart}
              </pre>
            </div>
          ) : (
            <div
              ref={containerRef}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
              }}
              className="w-full flex items-center justify-center overflow-auto py-2 [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:drop-shadow-xs"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>
      </div>

      {/* Fullscreen Modal View for Deep Inspection */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex-1 flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Workflow className="w-5 h-5 text-blue-600" />
                <span className="text-base">{title || "Arsitektur Sistem (Mermaid Fullscreen)"}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom controls in modal */}
                <div className="flex items-center rounded-xl bg-slate-200/80 dark:bg-slate-800 p-0.5 border border-slate-300 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="px-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Unduh SVG"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors"
                  title="Tutup (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Canvas */}
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/60">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.15s ease-out",
                }}
                className="[&>svg]:max-w-none [&>svg]:h-auto flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
