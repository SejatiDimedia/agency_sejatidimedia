'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Calendar,
  Clock,
  Share2,
  Check,
  Copy,
  MessageSquare,
  Tag,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

// Code Block with Mac OS Terminal Header & Interactive Copy Button
export function ArticleCodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const languageName = match ? match[1].toUpperCase() : 'CODE';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-left">
      {/* Terminal Window Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-bold text-slate-400 text-[11px] tracking-wider">{languageName}</span>
        </div>
        <button
          type="button"
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

// Markdown Custom Components for Authentic Frontend Rendering
export const articleMarkdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 mt-10 mb-4 border-b border-slate-200 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 mt-10 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg sm:text-xl font-sans font-bold text-slate-900 mt-8 mb-3">
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
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-sm mt-6 mb-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{cleanText}</span>
        </div>
      );
    }

    if (isSolution) {
      return (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm mt-6 mb-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{cleanText}</span>
        </div>
      );
    }

    return (
      <h4 className="text-base font-sans font-bold text-slate-900 mt-6 mb-2">
        {cleanText}
      </h4>
    );
  },
  p: ({ children }: any) => (
    <p className="mb-5 text-slate-700 leading-relaxed text-base sm:text-[17px]">
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
    <li className="leading-relaxed marker:font-bold marker:text-slate-900">
      {children}
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-6 pl-4 border-l-4 border-[#2C5098] italic text-slate-600 bg-[#2C5098]/5 py-3 pr-4 rounded-r-xl">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80 font-mono text-xs sm:text-sm text-[#2C5098] font-medium" {...props}>
          {children}
        </code>
      );
    }
    return <ArticleCodeBlock className={className} {...props}>{children}</ArticleCodeBlock>;
  },
  hr: () => <hr className="my-10 border-slate-200" />,
};

export interface InsightArticleViewerProps {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  tags?: string[] | string;
  readTimeMinutes?: number;
  publishedAt?: string;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
  language?: 'id' | 'en';
  contentOnly?: boolean;
  isEditorPreview?: boolean;
}

export function InsightArticleViewer({
  title,
  excerpt,
  content,
  category = 'Backend',
  coverImage,
  tags = [],
  readTimeMinutes = 5,
  publishedAt,
  author = {
    name: 'Timur Dian',
    role: 'Lead Software Engineer · SejatiDimedia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  language = 'id',
  contentOnly = false,
  isEditorPreview = false,
}: InsightArticleViewerProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Normalize tags into array
  const tagsList: string[] = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const displayDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const displayTitle = title || (language === 'en' ? 'Untitled Article' : 'Judul Artikel Anda');
  const displayExcerpt = excerpt || (language === 'en' ? 'Short article summary will appear here...' : 'Ringkasan singkat artikel akan ditampilkan di bagian ini...');

  const waConsultMessage = language === 'en'
    ? `Hello Timur/SejatiDimedia, I read your article "${displayTitle}" and would like to discuss our software architecture needs.`
    : `Halo Mas Timur / SejatiDimedia, saya membaca artikel "${displayTitle}" dan tertarik berkonsultasi mengenai kebutuhan arsitektur sistem kami.`;

  const waConsultUrl = `https://wa.me/6289508436275?text=${encodeURIComponent(waConsultMessage)}`;

  // If contentOnly is requested, render just the markdown body
  if (contentOnly) {
    return (
      <article className="prose prose-slate max-w-none text-left p-6 sm:p-8 bg-white rounded-2xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={articleMarkdownComponents}>
          {content || '*Ketik di kolom editor untuk melihat pratinjau langsung...*'}
        </ReactMarkdown>
      </article>
    );
  }

  return (
    <div className="w-full bg-white text-slate-800 p-6 sm:p-10 rounded-2xl max-w-4xl mx-auto shadow-xs border border-slate-200/80">
      {/* 1. Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098] animate-pulse" />
            {category}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTimeMinutes} {language === 'en' ? 'min read' : 'menit baca'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {displayDate}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight text-slate-900 leading-[1.25]">
          {displayTitle}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
          {displayExcerpt}
        </p>

        {/* Author Byline */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {author.name}
              </p>
              <p className="text-xs text-slate-500">
                {author.role}
              </p>
            </div>
          </div>

          {/* Social Share Mockup */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              {language === 'en' ? 'Share Article:' : 'Bagikan Artikel:'}
            </span>
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={() => {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Featured Cover Image */}
      {coverImage && (
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-10 shadow-lg border border-slate-200/80 bg-slate-100">
          <Image
            src={coverImage}
            alt={displayTitle}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* 3. Article Content Body */}
      <article className="prose prose-slate max-w-none text-left">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={articleMarkdownComponents}>
          {content || '*Ketik di kolom editor untuk melihat pratinjau langsung...*'}
        </ReactMarkdown>
      </article>

      {/* 4. Tags Section */}
      {tagsList.length > 0 && (
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-2">Tags:</span>
          {tagsList.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200"
            >
              <Tag className="w-3 h-3 opacity-60" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 5. Consultation CTA Card */}
      <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#23385B] via-[#2C5098] to-[#1E315B] text-white shadow-xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {language === 'en' ? 'SYSTEM CONSULTATION' : 'KONSULTASI SISTEM'}
          </span>
          <h3 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-white leading-snug">
            {language === 'en'
              ? 'Having Architecture Challenges or Need High-Performance Systems?'
              : 'Punya Masalah Arsitektur atau Ingin Membangun Sistem yang Benar?'}
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {language === 'en'
              ? 'We audit legacy codebases, eliminate bottlenecks, and build reliable enterprise software architectures.'
              : 'Kami siap membantu mengaudit kode, me-refactor arsitektur yang lemot, atau membangun aplikasi bisnis Anda dengan standar enterprise sejak awal.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-start">
            <a
              href={waConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'en' ? 'Free Consultation via WhatsApp' : 'Konsultasi Gratis via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
