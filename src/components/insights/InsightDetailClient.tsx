"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Copy,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Tag,
  Sparkles,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { InsightArticle } from "@/lib/api/insights";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InsightDetailClientProps {
  article: InsightArticle;
  relatedArticles: InsightArticle[];
}

// Code Block with Language Tag and Copy Button
function CodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const languageName = match ? match[1].toUpperCase() : "CODE";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-left">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-bold text-slate-400 text-[11px] tracking-wider">{languageName}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function InsightDetailClient({ article, relatedArticles }: InsightDetailClientProps) {
  const { language, t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);

  const title = language === "en" ? article.titleEn : article.titleId;
  const content = language === "en" ? article.contentEn : article.contentId;
  const excerpt = language === "en" ? article.excerptEn : article.excerptId;

  const pageT = t.insightsPage || {
    readTime: "menit baca",
    publishedOn: "Diterbitkan pada",
    backToList: "Kembali ke Semua Insights",
    shareArticle: "Bagikan Artikel:",
    copied: "Tautan Tersalin!",
    copyLink: "Salin Tautan",
    writtenBy: "Ditulis oleh",
    relatedTitle: "Artikel Rekayasa Terkait",
    ctaCard: {
      badge: "KONSULTASI SISTEM",
      title: "Punya Masalah Arsitektur atau Ingin Membangun Sistem yang Benar?",
      description: "Kami siap membantu mengaudit kode, me-refactor arsitektur yang lemot, atau membangun aplikasi bisnis Anda dengan standar enterprise sejak awal.",
      buttonPrimary: "Konsultasi Gratis via WhatsApp",
      buttonSecondary: "Hitung Estimasi Proyek"
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://sejatidimedia.web.id/insights/${article.slug}`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const waConsultMessage = language === "en"
    ? `Hello Timur/SejatiDimedia, I read your article "${title}" and would like to discuss our software architecture needs.`
    : `Halo Mas Timur / SejatiDimedia, saya membaca artikel "${title}" dan tertarik berkonsultasi mengenai kebutuhan arsitektur sistem kami.`;

  const waConsultUrl = `https://wa.me/6289508436275?text=${encodeURIComponent(waConsultMessage)}`;

  // Custom Markdown Components
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg sm:text-xl font-sans font-bold text-slate-900 dark:text-white mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => {
      const rawText = String(children);
      // Strip emojis like ❌ and ✅ so they NEVER appear in UI
      const cleanText = rawText.replace(/[❌✅]/g, '').trim();

      const isProblem =
        rawText.includes('❌') ||
        rawText.toLowerCase().includes('anti-pattern') ||
        rawText.toLowerCase().includes('masalah') ||
        rawText.toLowerCase().includes('buruk') ||
        rawText.toLowerCase().includes('tidak disarankan');

      const isSolution =
        rawText.includes('✅') ||
        rawText.toLowerCase().includes('best practice') ||
        rawText.toLowerCase().includes('standar kami') ||
        rawText.toLowerCase().includes('rekomendasi') ||
        rawText.toLowerCase().includes('our standard');

      if (isProblem) {
        return (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 font-bold text-sm mt-6 mb-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{cleanText}</span>
          </div>
        );
      }

      if (isSolution) {
        return (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-sm mt-6 mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{cleanText}</span>
          </div>
        );
      }

      return (
        <h4 className="text-base font-sans font-bold text-slate-900 dark:text-white mt-6 mb-2">
          {cleanText}
        </h4>
      );
    },
    p: ({ children }: any) => (
      <p className="mb-5 text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-[17px]">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside mb-6 ml-6 space-y-2 text-slate-700 dark:text-slate-300 text-base">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-outside mb-6 ml-6 space-y-2 text-slate-700 dark:text-slate-300 text-base">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed marker:font-bold marker:text-slate-900 dark:marker:text-slate-100">
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 pl-4 border-l-4 border-[#2C5098] dark:border-[#38BDF8] italic text-slate-600 dark:text-slate-400 bg-[#2C5098]/5 dark:bg-[#38BDF8]/5 py-3 pr-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 font-mono text-xs sm:text-sm text-[#2C5098] dark:text-[#38BDF8] font-medium" {...props}>
            {children}
          </code>
        );
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    },
    hr: () => <hr className="my-10 border-slate-200 dark:border-slate-800" />,
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* 1. Back to All Insights */}
      <div className="mb-8">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#2C5098] dark:hover:text-[#38BDF8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{pageT.backToList}</span>
        </Link>
      </div>

      {/* 2. Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-pulse" />
            {article.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} {pageT.readTime}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleDateString(
                language === "en" ? "en-US" : "id-ID",
                { month: "long", day: "numeric", year: "numeric" }
              )}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
          {excerpt}
        </p>

        {/* Author Byline */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {article.author.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {article.author.role}
              </p>
            </div>
          </div>

          {/* Social Share Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">{pageT.shareArticle}</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
              title="Share to WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">{pageT.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{pageT.copyLink}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Featured Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200/80 dark:border-slate-800">
        <Image
          src={article.coverImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      {/* 4. Article Content Body */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-left">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </article>

      {/* 5. Tags Section */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-400 mr-2">Tags:</span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <Tag className="w-3 h-3 opacity-60" />
            {tag}
          </span>
        ))}
      </div>

      {/* 6. Lead Generation & Consultation CTA Card */}
      <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#23385B] via-[#2C5098] to-[#1E315B] text-white shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white leading-snug">
            {pageT.ctaCard.title}
          </h3>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {pageT.ctaCard.description}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-start">
            <a
              href={waConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#23385B] hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>{pageT.ctaCard.buttonPrimary}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/#contact-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>{pageT.ctaCard.buttonSecondary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 7. Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white mb-6">
            {pageT.relatedTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => {
              const relTitle = language === "en" ? rel.titleEn : rel.titleId;
              const relExcerpt = language === "en" ? rel.excerptEn : rel.excerptId;

              return (
                <Link
                  key={rel.slug}
                  href={`/insights/${rel.slug}`}
                  className="group block p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#2C5098]/40 dark:hover:border-[#38BDF8]/40 shadow-xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C5098] dark:text-[#38BDF8]">
                    {rel.category}
                  </span>
                  <h4 className="text-base font-sans font-bold text-slate-900 dark:text-white group-hover:text-[#2C5098] dark:group-hover:text-[#38BDF8] transition-colors mt-2 mb-2 line-clamp-2">
                    {relTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {relExcerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
