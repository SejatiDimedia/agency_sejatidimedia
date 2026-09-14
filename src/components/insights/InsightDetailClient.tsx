"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  Clock,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Tag,
  ShieldAlert,
  CheckCircle2,
  Link2,
  BookOpen,
  Code2,
} from "lucide-react";
import { InsightArticle } from "@/lib/api/insights";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Toast } from "@/components/ui/Toast";

interface InsightDetailClientProps {
  article: InsightArticle;
  relatedArticles: InsightArticle[];
  prevArticle?: InsightArticle | null;
  nextArticle?: InsightArticle | null;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Extract H2 and H3 headings from markdown text
function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .replace(/[❌✅]/g, "")
      .trim();

    const id = rawText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (id && rawText) {
      items.push({ id, text: rawText, level });
    }
  }

  return items;
}

function getNodeText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node.props && node.props.children) return getNodeText(node.props.children);
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[❌✅]/g, "")
    .replace(/[*_`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Code Block with macOS Terminal Window Header & Interactive Copy Button
function CodeBlock({ className, children, language = "id", ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const languageName = match ? match[1].toUpperCase() : "CODE";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-7 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-left">
      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          <span className="ml-2 font-mono font-bold text-slate-400 text-[11px] tracking-wider">
            {languageName}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={language === "en" ? "Copy code snippet" : "Salin baris kode"}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 transition-all cursor-pointer border border-slate-700/50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">{language === "en" ? "Copied!" : "Tersalin!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "en" ? "Copy" : "Salin"}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13.5px] font-mono text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function InsightDetailClient({
  article,
  relatedArticles,
}: InsightDetailClientProps) {
  const { language } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const title = language === "en" ? article.titleEn : article.titleId;
  const content = language === "en" ? article.contentEn : article.contentId;
  const excerpt = language === "en" ? article.excerptEn : article.excerptId;

  // Extract TOC headings dynamically from markdown content
  const tocItems = useMemo(() => extractHeadings(content || ""), [content]);

  // Scroll listener for reading progress bar & TOC scrollspy
  useEffect(() => {
    const handleScroll = () => {
      // 1. Reading progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // 2. Active TOC spy
      if (tocItems.length === 0) return;
      const scrollPosition = window.scrollY + 140;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeadingId(item.id);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveHeadingId(tocItems[0]?.id || "");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://sejatidimedia.web.id/insights/${article.slug}`;

  const handleCopyShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setToast({
        message: language === "en" ? "Article link copied to clipboard!" : "Tautan artikel berhasil disalin ke papan klip!",
        type: "success",
      });
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title,
          text: excerpt,
          url: shareUrl,
        })
        .catch(() => { });
    } else {
      handleCopyShare();
    }
  };

  const waConsultMessage =
    language === "en"
      ? `Hello Timur/SejatiDimedia, I read your engineering article "${title}" and would like to discuss our software architecture needs.`
      : `Halo Mas Timur / SejatiDimedia, saya membaca artikel "${title}" dan tertarik berkonsultasi mengenai kebutuhan arsitektur sistem kami.`;

  const waConsultUrl = `https://wa.me/6289508436275?text=${encodeURIComponent(waConsultMessage)}`;

  // Markdown Custom Components designed for the Impeccable Read mode
  const markdownComponents = {
    h1: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h1
          id={id}
          className="group text-2xl sm:text-3xl font-sora font-extrabold text-slate-900 mt-14 mb-5 pt-4 border-b border-slate-200/80 flex items-center justify-between scroll-mt-28"
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            aria-label={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.pushState(null, "", `#${id}`);
                navigator.clipboard.writeText(window.location.href);
                setToast({
                  message: language === "en" ? "Section link copied!" : "Tautan bagian berhasil disalin!",
                  type: "success",
                });
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#2C5098] cursor-pointer"
            title={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
          >
            <Link2 className="w-4 h-4" />
          </a>
        </h1>
      );
    },
    h2: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="group text-xl sm:text-2xl font-sora font-extrabold text-slate-900 mt-12 mb-4 pt-3 border-b border-slate-200/80 flex items-center justify-between scroll-mt-28"
        >
          <span className="flex items-center gap-2">{children}</span>
          <a
            href={`#${id}`}
            aria-label={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.pushState(null, "", `#${id}`);
                navigator.clipboard.writeText(window.location.href);
                setToast({
                  message: language === "en" ? "Section link copied!" : "Tautan bagian berhasil disalin!",
                  type: "success",
                });
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#2C5098] cursor-pointer"
            title={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
          >
            <Link2 className="w-4 h-4" />
          </a>
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="group text-lg sm:text-xl font-sora font-bold text-slate-900 mt-9 mb-3 flex items-center justify-between scroll-mt-28"
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            aria-label={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.pushState(null, "", `#${id}`);
                navigator.clipboard.writeText(window.location.href);
                setToast({
                  message: language === "en" ? "Section link copied!" : "Tautan bagian berhasil disalin!",
                  type: "success",
                });
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#2C5098] cursor-pointer"
            title={language === "en" ? "Copy link to this section" : "Salin tautan ke bagian ini"}
          >
            <Link2 className="w-3.5 h-3.5" />
          </a>
        </h3>
      );
    },
    h4: ({ children }: any) => {
      const rawText = getNodeText(children);
      const cleanText = rawText.replace(/[❌✅]/g, "").trim();

      const isProblem =
        rawText.includes("❌") ||
        rawText.toLowerCase().includes("anti-pattern") ||
        rawText.toLowerCase().includes("masalah") ||
        rawText.toLowerCase().includes("pitfall") ||
        rawText.toLowerCase().includes("problem") ||
        rawText.toLowerCase().includes("buruk") ||
        rawText.toLowerCase().includes("tidak disarankan");

      const isSolution =
        rawText.includes("✅") ||
        rawText.toLowerCase().includes("best practice") ||
        rawText.toLowerCase().includes("standar kami") ||
        rawText.toLowerCase().includes("our standard") ||
        rawText.toLowerCase().includes("rekomendasi") ||
        rawText.toLowerCase().includes("solution");

      if (isProblem) {
        return (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 font-bold text-sm sm:text-[14px] mt-6 mb-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-rose-600 font-bold mb-0.5">
                {language === "en" ? "Architecture Pitfall / Anti-Pattern" : "Kelemahan Arsitektur / Anti-Pattern"}
              </span>
              <span>{cleanText}</span>
            </div>
          </div>
        );
      }

      if (isSolution) {
        return (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-[14px] mt-6 mb-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-bold mb-0.5">
                {language === "en" ? "Proven Engineering Standard / Best Practice" : "Standar Rekayasa Teruji / Best Practice"}
              </span>
              <span>{cleanText}</span>
            </div>
          </div>
        );
      }

      return (
        <h4 className="text-base font-sora font-bold text-slate-900 mt-6 mb-2">
          {cleanText}
        </h4>
      );
    },
    p: ({ children }: any) => (
      <p
        className={`mb-5 text-slate-700 font-sans ${fontSize === "large" ? "text-lg sm:text-[18.5px] leading-[1.85]" : "text-base sm:text-[16.5px] leading-[1.8]"
          }`}
      >
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside mb-6 ml-6 space-y-2 text-slate-700 text-base">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-outside mb-6 ml-6 space-y-2 text-slate-700 text-base">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed marker:font-bold marker:text-[#2C5098]">
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 px-6 py-5 rounded-2xl bg-slate-50/85 border border-slate-200/80 text-slate-700 text-[15.5px] sm:text-base leading-relaxed shadow-xs">
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 font-mono text-xs sm:text-[13px] text-[#1E315B] font-semibold"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className} language={language} {...props}>{children}</CodeBlock>;
    },
    table: ({ children }: any) => (
      <div className="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
        <table className="w-full text-left text-sm text-slate-700">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-100/80 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-slate-50/70 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="px-4 py-3 font-bold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 leading-relaxed">{children}</td>,
    hr: () => <hr className="my-10 border-slate-200" />,
  };

  return (
    <div className="min-h-screen pb-24 text-slate-900 font-sans selection:bg-[#2C5098]/15 selection:text-[#1E315B]">
      {/* 1. Sticky Reading Progress Bar at the Very Top of Viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-slate-200/50 z-[99999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#2C5098] via-blue-600 to-indigo-600 transition-all duration-75 ease-out shadow-xs shadow-blue-500/40"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Top Editorial Breadcrumb & Navigation Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pt-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-sans text-slate-500">
            <Link href="/" className="hover:text-[#2C5098] transition-colors">
              {language === "en" ? "Home" : "Beranda"}
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/insights" className="hover:text-[#2C5098] transition-colors">
              Insights
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#2C5098] font-semibold">{article.category}</span>
          </nav>

          {/* Reading Comfort & Quick Action Bar */}
          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/80 text-xs font-mono font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                aria-label={language === "en" ? "Standard font size" : "Ukuran font standar"}
                title={language === "en" ? "Standard font size" : "Ukuran font standar"}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${fontSize === "normal" ? "bg-white text-[#2C5098] shadow-xs" : "hover:text-slate-900"
                  }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                aria-label={language === "en" ? "Large font size" : "Ukuran font besar"}
                title={language === "en" ? "Large font size" : "Ukuran font besar"}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-sm ${fontSize === "large" ? "bg-white text-[#2C5098] shadow-xs" : "hover:text-slate-900"
                  }`}
              >
                A+
              </button>
            </div>

            {/* Share Native / Copy */}
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label={language === "en" ? "Share article" : "Bagikan artikel"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#2C5098] hover:border-[#2C5098]/30 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === "en" ? "Share" : "Bagikan"}</span>
            </button>
          </div>
        </div>

        {/* 3. Hero Article Header */}
        <header className="space-y-6 mb-12 w-full">
          {/* Metadata Pill Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-pulse" />
              {article.category}
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-sans">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTimeMinutes} {language === "en" ? "min read" : "menit baca"}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(article.publishedAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Main Editorial Headline - Full Width */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-sora font-extrabold tracking-tight text-slate-900 leading-[1.18] w-full">
            {title}
          </h1>

          {/* Lead-in Excerpt Paragraph - Full Width Editorial Deck */}
          <div className="w-full">
            <p className="text-lg sm:text-xl lg:text-[21px] text-slate-600 font-sans font-normal leading-[1.68] tracking-[-0.012em]">
              {excerpt}
            </p>
          </div>

          {/* Clean Author Byline Bar (Without duplicate aggressive CTA) */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5 w-full">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shadow-xs shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-sora font-bold text-slate-900">
                  {article.author.name}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 font-sans">
                {article.author.role}
              </p>
            </div>
          </div>
        </header>

        {/* 4. Featured Cover Image with Technical Frame */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200/90 bg-slate-100">
          <Image
            src={article.coverImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-6 text-white/90 text-xs font-mono font-medium hidden sm:flex items-center gap-2 drop-shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>{language === "en" ? "Software Engineering Documentation · SejatiDimedia" : "Dokumentasi Rekayasa Perangkat Lunak · SejatiDimedia"}</span>
          </div>
        </div>

        {/* 5. Main Content Grid (Two-Column: Article Body + Single Focused Sticky TOC Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Article Body (8 Columns on desktop, 65-75ch optimal measure) */}
          <main className={tocItems.length > 0 ? "lg:col-span-8 w-full min-w-0" : "lg:col-span-8 lg:col-start-3 w-full min-w-0"}>
            {/* Markdown Article Prose Body - Starts Directly without synthetic duplicate box */}
            <article className="prose prose-slate max-w-none text-left">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </article>

            {/* Article Tags Section */}
            <div className="mt-12 pt-6 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                {language === "en" ? "Related Topics:" : "Topik Terkait:"}
              </span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/insights?search=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#2C5098] bg-blue-50/80 hover:bg-[#2C5098] hover:text-white border border-blue-200/70 hover:border-[#2C5098] transition-all cursor-pointer shadow-2xs group"
                >
                  <Tag className="w-3 h-3 text-[#2C5098]/70 group-hover:text-white transition-colors" />
                  <span>{tag}</span>
                </Link>
              ))}
            </div>

            {/* Author Spotlight Bio Card (ONE authoritative place for author bio) */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start gap-5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-sora font-bold text-base text-slate-900">
                    {article.author.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-mono font-bold uppercase">
                    {language === "en" ? "Author & Lead Engineer" : "Penulis & Lead Engineer"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {language === "en"
                    ? (article.author.bioEn || "Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design, enterprise-scale backend refactoring (Laravel / Node.js), and modern web & mobile engineering.")
                    : (article.author.bioId || "Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi, refactoring backend skala enterprise (Laravel / Node.js), hingga pengembangan aplikasi mobile & web modern.")}
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-bold">
                  <Link
                    href="/#about-section"
                    className="text-[#2C5098] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{language === "en" ? "Profile & Studio Standards" : "Profil & Standar Studio"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/insights" className="text-slate-600 hover:text-slate-900">
                    {language === "en" ? "All Engineering Articles" : "Semua Artikel Rekayasa"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Lead Generation & Architecture Consultation CTA Card (ONE definitive place for CTA) */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1E315B] via-[#2C5098] to-[#23385B] text-white shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4 max-w-2xl">

                <h3 className="text-2xl sm:text-3xl font-sora font-extrabold tracking-tight text-white leading-snug">
                  {language === "en"
                    ? "Facing Architecture Bottlenecks or Building Mission-Critical Systems?"
                    : "Punya Masalah Arsitektur atau Ingin Membangun Sistem yang Benar?"}
                </h3>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
                  {language === "en"
                    ? "We audit legacy codebases, eliminate performance bottlenecks, and engineer resilient enterprise software from day one."
                    : "Kami siap membantu mengaudit kode, me-refactor arsitektur yang lemot, atau membangun aplikasi bisnis Anda dengan standar enterprise sejak awal."}
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-start">
                  <a
                    href={waConsultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1E315B] hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{language === "en" ? "Free WhatsApp Consultation" : "Konsultasi Gratis via WhatsApp"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    href="/#contact-section"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
                  >
                    <span>{language === "en" ? "Calculate Project Estimate" : "Hitung Estimasi Proyek"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </main>

          {/* Sticky Editorial Sidebar (4 Columns on Desktop: ONLY Single Focused Table of Contents) */}
          {tocItems.length > 0 && (
            <aside className="lg:col-span-4 hidden lg:block sticky top-28">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#2C5098]" />
                    <span>{language === "en" ? "Table of Contents" : "Daftar Isi Artikel"}</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {language === "en" ? `${tocItems.length} sections` : `${tocItems.length} bagian`}
                  </span>
                </div>

                <nav aria-label="Table of Contents" className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                  {tocItems.map((item) => {
                    const isActive = activeHeadingId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`group relative flex items-start gap-2.5 py-2 px-3 rounded-xl text-xs transition-all duration-200 ${
                          isActive
                            ? "bg-[#2C5098]/10 text-[#1E315B] font-bold shadow-2xs border border-[#2C5098]/25"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                        } ${item.level === 3 ? "ml-3 text-[11.5px]" : ""}`}
                      >
                        {/* Active Dot with glowing ring */}
                        <span
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                            isActive
                              ? "bg-[#2C5098] ring-4 ring-[#2C5098]/20 scale-110"
                              : "bg-slate-300 group-hover:bg-slate-400"
                          }`}
                        />
                        <span className="flex-1 leading-snug">{item.text}</span>
                        {isActive && (
                          <span className="shrink-0 text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#2C5098] bg-white px-1.5 py-0.5 rounded-md shadow-2xs border border-blue-200/60 self-center">
                            {language === "en" ? "Active" : "Aktif"}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* 6. Bottom Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C5098] block mb-1">
                  {language === "en" ? "FURTHER EXPLORATION" : "EKSPLORASI LANJUTAN"}
                </span>
                <h3 className="text-xl sm:text-2xl font-sora font-extrabold text-slate-900">
                  {language === "en" ? "Related Engineering Articles" : "Artikel Rekayasa Terkait"}
                </h3>
              </div>
              <Link
                href="/insights"
                className="text-xs font-bold text-[#2C5098] hover:underline flex items-center gap-1"
              >
                <span>{language === "en" ? "View All" : "Lihat Semua"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => {
                const relTitle = language === "en" ? rel.titleEn : rel.titleId;
                const relExcerpt = language === "en" ? rel.excerptEn : rel.excerptId;

                return (
                  <Link
                    key={rel.slug}
                    href={`/insights/${rel.slug}`}
                    className="group flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-[#2C5098]/40 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={rel.coverImage}
                        alt={relTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#2C5098] shadow-xs">
                          {rel.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans mb-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{rel.readTimeMinutes} {language === "en" ? "min read" : "menit baca"}</span>
                        </div>
                        <h4 className="font-sora font-bold text-sm text-slate-900 group-hover:text-[#2C5098] transition-colors leading-snug">
                          {relTitle}
                        </h4>
                        <p className="text-xs text-slate-500 font-sans line-clamp-3 mt-1.5 leading-relaxed">
                          {relExcerpt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2C5098]">
                        <span>{language === "en" ? "Read Article" : "Baca Artikel"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* 7. Floating Back to Top Button */}
      {scrollProgress > 15 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={language === "en" ? "Back to top" : "Kembali ke atas"}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 hover:text-[#2C5098] hover:border-[#2C5098]/40 shadow-xl transition-all hover:scale-110 cursor-pointer flex items-center justify-center group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 8. Modern Floating Toast */}
      <Toast
        isOpen={Boolean(toast)}
        message={toast?.message || ""}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

