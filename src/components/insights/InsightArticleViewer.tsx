'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  BookOpen,
  Layers,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { InsightSeriesInfo } from '@/lib/api/insights';
import CodeBlockBeautified from './CodeBlockBeautified';
import {
  BeautifiedTable,
  BeautifiedThead,
  BeautifiedTbody,
  BeautifiedTr,
  BeautifiedTh,
  BeautifiedTd,
} from './TableBeautified';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Extract H2 and H3 headings from markdown text for Table of Contents
function extractHeadings(markdown: string): TocItem[] {
  if (!markdown) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/[❌✅]/g, '')
      .trim();

    const id = rawText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (id && rawText) {
      items.push({ id, text: rawText, level });
    }
  }

  return items;
}

function getNodeText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (node.props && node.props.children) return getNodeText(node.props.children);
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[❌✅]/g, '')
    .replace(/[*_`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Beautified Code Block with macOS Window Header, Line Numbers, Syntax Highlighting & Copy
export function ArticleCodeBlock(props: any) {
  return <CodeBlockBeautified {...props} />;
}

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
    bioId?: string;
    bioEn?: string;
  };
  language?: 'id' | 'en';
  contentOnly?: boolean;
  isEditorPreview?: boolean;
  series?: InsightSeriesInfo | null;
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
  series = null,
  author = {
    name: 'Timur Dian Radha Sejati',
    role: 'Lead Software Engineer · SejatiDimedia',
    avatar: '/images/author_timur_dian.jpg',
    bioId: 'Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi, refactoring backend skala enterprise (Laravel / Node.js), hingga pengembangan aplikasi mobile & web modern.',
    bioEn: 'Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design, enterprise-scale backend refactoring (Laravel / Node.js), and modern web & mobile engineering.',
  },
  language = 'id',
  contentOnly = false,
  isEditorPreview = false,
}: InsightArticleViewerProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

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

  const displayTitle = title?.trim() || (language === 'en' ? 'Your Article Headline Appears Here' : 'Judul Artikel Anda Akan Tampil di Sini');
  const displayExcerpt = excerpt?.trim() || (language === 'en' ? 'A concise editorial lead summary of your article will appear here to introduce the core insight to readers before the body text.' : 'Ringkasan pengantar editorial artikel akan ditampilkan di sini untuk memperkenalkan poin inti kepada pembaca sebelum masuk ke badan tulisan.');

  const samplePlaceholderContent = language === 'en'
    ? `## Introduction to the Challenge\n\nStart writing your technical article in the editor on the left. This live preview will automatically update in real-time.\n\n#### ❌ Common Anti-Patterns\nDetail common architectural mistakes or technical debt that developers or companies encounter.\n\n#### ✅ Recommended Engineering Standard\nProvide verified solutions, clean design patterns, and practical implementation guidelines.\n\n\`\`\`typescript\n// Example code snippet\nexport async function getOptimizedArchitecture() {\n  return await db.system.benchmark();\n}\n\`\`\``
    : `## Pengantar Masalah\n\nMulai tulis artikel teknis Anda di editor sebelah kiri. Live preview ini akan otomatis memperbarui tampilan secara langsung.\n\n#### ❌ Kesalahan Arsitektur / Anti-Pattern\nJelaskan masalah umum atau technical debt yang sering dihadapi oleh developer dan perusahaan.\n\n#### ✅ Standar Rekayasa / Best Practice\nBerikan solusi yang teruji, clean architecture, dan langkah implementasi yang solutif.\n\n\`\`\`typescript\n// Contoh potongan kode\nexport async function getOptimizedArchitecture() {\n  return await db.system.benchmark();\n}\n\`\`\``;

  const actualContent = content?.trim() || samplePlaceholderContent;

  // Extract headings for Table of Contents
  const tocItems = useMemo(() => extractHeadings(actualContent), [actualContent]);

  const waConsultMessage = language === 'en'
    ? `Hello Timur/SejatiDimedia, I read your article "${displayTitle}" and would like to discuss our software architecture needs.`
    : `Halo Mas Timur / SejatiDimedia, saya membaca artikel "${displayTitle}" dan tertarik berkonsultasi mengenai kebutuhan arsitektur sistem kami.`;

  const waConsultUrl = `https://wa.me/6289508436275?text=${encodeURIComponent(waConsultMessage)}`;

  // Custom markdown components matching InsightDetailClient
  const markdownComponents = {
    h1: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h1 id={id} className="text-2xl sm:text-3xl font-sans font-extrabold text-slate-900 mt-12 mb-4 pt-3 border-b border-slate-200/80 pb-2 scroll-mt-24">
          {children}
        </h1>
      );
    },
    h2: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h2 id={id} className="text-xl sm:text-2xl font-sans font-extrabold text-slate-900 mt-10 mb-4 pt-2 border-b border-slate-200/80 pb-2 flex items-center gap-2 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const text = getNodeText(children);
      const id = slugify(text);
      return (
        <h3 id={id} className="text-lg sm:text-xl font-sans font-bold text-slate-900 mt-8 mb-3 scroll-mt-24">
          {children}
        </h3>
      );
    },
    h4: ({ children }: any) => {
      const rawText = String(children);
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
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 font-bold text-sm sm:text-[14px] mt-6 mb-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="block text-[11px] font-sans uppercase tracking-wider text-rose-600 font-bold mb-0.5">
                Kelemahan Arsitektur / Anti-Pattern
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
              <span className="block text-[11px] font-sans uppercase tracking-wider text-emerald-600 font-bold mb-0.5">
                Standar Rekayasa Teruji / Best Practice
              </span>
              <span>{cleanText}</span>
            </div>
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
      <p className={`mb-5 text-slate-700 font-sans leading-[1.8] ${fontSize === 'large' ? 'text-lg sm:text-[18.5px]' : 'text-base sm:text-[16.5px]'}`}>
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
    pre: ({ children }: any) => <>{children}</>,
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 font-sans text-xs sm:text-[12.5px] text-[#1E315B] dark:text-blue-300 font-semibold"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <ArticleCodeBlock className={className} language={language} {...props}>{children}</ArticleCodeBlock>;
    },
    table: ({ children, ...props }: any) => (
      <BeautifiedTable language={language} {...props}>
        {children}
      </BeautifiedTable>
    ),
    thead: BeautifiedThead,
    tbody: BeautifiedTbody,
    tr: BeautifiedTr,
    th: BeautifiedTh,
    td: BeautifiedTd,
    hr: () => <hr className="my-10 border-slate-200 dark:border-slate-800" />,
  };

  // If contentOnly is requested, render just the markdown body
  if (contentOnly) {
    return (
      <article className="prose prose-slate max-w-none text-left p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {actualContent}
        </ReactMarkdown>
      </article>
    );
  }

  return (
    <div className="w-full bg-white text-slate-800 p-6 sm:p-10 rounded-2xl max-w-5xl mx-auto shadow-xs border border-slate-200/80">
      {/* 1. Article Header */}
      <header className="space-y-5 mb-10 w-full">
        {/* Eyebrow / Context: Clean Series Pill or Category Badge */}
        <div>
          {series ? (
            <Link
              href={`/insights/series/${series.slug}`}
              className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#2C5098] hover:text-[#1E315B] transition-colors group"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[10px] font-sans font-bold text-[#2C5098] uppercase tracking-wider shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-[#2C5098] group-hover:rotate-12 transition-transform" />
                <span>{language === 'en' ? 'Series' : 'Seri'}</span>
                {series.part && (
                  <span className="font-extrabold text-[#1E315B]">
                    · Part {series.part}/{series.totalParts}
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-700 group-hover:text-[#2C5098] flex items-center gap-1">
                {language === 'en' ? (series.titleEn || series.titleId) : series.titleId}
                <ChevronRight className="w-3.5 h-3.5 text-[#2C5098]/60 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C5098]/10 text-[#2C5098] border border-[#2C5098]/20 text-[10px] font-sans font-bold uppercase tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C5098]" />
              {category}
            </span>
          )}
        </div>

        {/* Headline: Plus Jakarta Sans typography */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-sans font-extrabold tracking-tight text-slate-900 leading-[1.2] w-full">
          {displayTitle}
        </h1>

        {/* Editorial Deck Excerpt: Non-italic, full-width, harmonized with content text size */}
        <div className="w-full">
          <p className={`font-sans text-slate-600 leading-[1.8] ${
            fontSize === 'large' ? 'text-lg sm:text-[18.5px]' : 'text-base sm:text-[16.5px]'
          }`}>
            {displayExcerpt}
          </p>
        </div>

        {/* Author Byline Bar & Reading Font Controls */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4 w-full">
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-slate-100">
              <img
                src={author.avatar || '/images/author_timur_dian.jpg'}
                alt={author.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/author_timur_dian.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-sans font-bold text-slate-900">
                  {author.name}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500 font-sans mt-0.5">
                <span>{author.role}</span>
                <span className="text-slate-300">•</span>
                <span>{displayDate}</span>
                <span className="text-slate-300">•</span>
                <span>{readTimeMinutes} {language === 'en' ? 'min read' : 'menit baca'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-sans font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white text-[#2C5098] shadow-xs' : 'hover:text-slate-900'
                }`}
                title="Ukuran font normal"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-sm ${
                  fontSize === 'large' ? 'bg-white text-[#2C5098] shadow-xs' : 'hover:text-slate-900'
                }`}
                title="Ukuran font besar"
              >
                A+
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={() => {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#2C5098] hover:border-[#2C5098]/30 shadow-xs transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Series Curriculum Box */}
      {series && series.curriculum && series.curriculum.length > 0 && (
        <div className="mb-10 rounded-3xl border border-blue-100/90 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-blue-700 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{language === 'en' ? 'Curriculum Track / Series' : 'Silabus Seri Rekayasa'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-sans font-extrabold text-slate-900 mt-1">
                {language === 'en' ? (series.titleEn || series.titleId) : series.titleId}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
                {language === 'en' ? (series.descriptionEn || series.descriptionId) : series.descriptionId}
              </p>
            </div>
            <Link
              href={`/insights/series/${series.slug}`}
              className="inline-flex items-center gap-1 text-xs font-sans font-bold text-blue-600 hover:text-blue-700 shrink-0"
            >
              <span>{language === 'en' ? 'View Series Hub' : 'Lihat Silabus Lengkap'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Curriculum items list */}
          <div className="mt-4 space-y-2">
            {series.curriculum.map((item) => {
              const isCurrent = item.isCurrent;
              const itemTitle = language === 'en' ? item.titleEn : item.titleId;
              return (
                <div
                  key={item.part}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-[#2C5098] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/70 hover:border-blue-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-sans text-xs font-bold shrink-0 ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.part}
                    </span>
                    <div className="min-w-0">
                      {isCurrent ? (
                        <p className="text-xs sm:text-sm font-sans font-bold truncate">
                          {itemTitle}
                        </p>
                      ) : (
                        <Link
                          href={`/insights/${item.slug}`}
                          className="text-xs sm:text-sm font-sans font-semibold hover:underline truncate block"
                        >
                          {itemTitle}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-sans ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.readTimeMinutes}m
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-sans font-bold uppercase tracking-wider">
                        {language === 'en' ? 'Reading' : 'Sedang Dibaca'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Featured Cover Image (Safe Image rendering) */}
      {coverImage && (
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200/90 bg-slate-100">
          <img
            src={coverImage}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to studio cover on error
              (e.target as HTMLImageElement).src = '/images/insights/client_portal_cover.jpg';
            }}
          />
        </div>
      )}

      {/* 3. Main Content Grid: Body + Table of Contents Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Main Article Body (8 cols if TOC exists, else 12 cols) */}
        <main className={tocItems.length > 0 ? 'lg:col-span-8 w-full min-w-0' : 'lg:col-span-12 w-full min-w-0'}>
          <article className="prose prose-slate max-w-none text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {actualContent}
            </ReactMarkdown>
          </article>

          {/* Tags Section with Blue Badges */}
          {tagsList.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider mr-1">
                {language === 'en' ? 'Related Topics:' : 'Topik Terkait:'}
              </span>
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium text-slate-600 bg-slate-100 border border-slate-200/70 hover:bg-[#2C5098] hover:text-white hover:border-[#2C5098] transition-colors shadow-2xs"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Series Stepper Navigation */}
          {series && (series.prevPart || series.nextPart) && (
            <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-2xs">
              {series.prevPart ? (
                <Link
                  href={`/insights/${series.prevPart.slug}`}
                  className="flex flex-col p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all group text-left"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#2C5098]">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    {language === 'en' ? `PREVIOUS PART · ${series.prevPart.part}` : `PART SEBELUMNYA · ${series.prevPart.part}`}
                  </span>
                  <span className="mt-1.5 text-sm font-sans font-bold text-slate-800 group-hover:text-[#2C5098] line-clamp-2">
                    {language === 'en' ? (series.prevPart.titleEn || series.prevPart.titleId) : series.prevPart.titleId}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {series.nextPart ? (
                <Link
                  href={`/insights/${series.nextPart.slug}`}
                  className="flex flex-col p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all group sm:text-right"
                >
                  <span className="inline-flex items-center gap-1.5 sm:justify-end text-[11px] font-sans font-bold text-[#2C5098] uppercase tracking-wider">
                    {language === 'en' ? `NEXT PART · ${series.nextPart.part}` : `PART SELANJUTNYA · ${series.nextPart.part}`}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="mt-1.5 text-sm font-sans font-bold text-slate-800 group-hover:text-[#2C5098] line-clamp-2">
                    {language === 'en' ? (series.nextPart.titleEn || series.nextPart.titleId) : series.nextPart.titleId}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>
          )}

          {/* 4. Author Spotlight Bio Card (Authoritative Bio box) */}
          <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
              <img
                src={author.avatar || '/images/author_timur_dian.jpg'}
                alt={author.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/author_timur_dian.jpg';
                }}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-sans font-bold text-slate-900">
                  {author.name}
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-blue-50 text-[#2C5098] border border-[#2C5098]/20 shadow-xs">
                  Penulis Resmi
                </span>
              </div>
              <p className="text-xs font-sans font-medium text-slate-500">
                {author.role}
              </p>
              <p className="text-xs sm:text-[13px] font-sans text-slate-600 leading-relaxed pt-1">
                {language === 'en'
                  ? (author.bioEn || 'Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design, enterprise-scale backend refactoring (Laravel / Node.js), and modern web & mobile engineering.')
                  : (author.bioId || 'Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi, refactoring backend skala enterprise (Laravel / Node.js), hingga pengembangan aplikasi mobile & web modern.')}
              </p>
            </div>
          </div>

          {/* 5. Consultation CTA Card */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1E315B] via-[#2C5098] to-[#23385B] text-white shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white leading-snug">
                {language === 'en'
                  ? 'Facing Architecture Bottlenecks or Building Mission-Critical Systems?'
                  : 'Punya Masalah Arsitektur atau Ingin Membangun Sistem yang Benar?'}
              </h3>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
                {language === 'en'
                  ? 'We audit legacy codebases, eliminate performance bottlenecks, and engineer resilient enterprise software from day one.'
                  : 'Kami siap membantu mengaudit kode, me-refactor arsitektur yang lemot, atau membangun aplikasi bisnis Anda dengan standar enterprise sejak awal.'}
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-start">
                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1E315B] hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>{language === 'en' ? 'Free WhatsApp Consultation' : 'Konsultasi Gratis via WhatsApp'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href="/#contact-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <span>{language === 'en' ? 'Calculate Project Estimate' : 'Hitung Estimasi Proyek'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Table of Contents Sidebar */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-6 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200/80">
                <BookOpen className="w-4 h-4 text-[#2C5098]" />
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">
                  {language === 'en' ? 'Table of Contents' : 'Daftar Isi'}
                </h3>
              </div>
              <nav className="space-y-1.5 text-xs font-sans">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 transition-colors ${
                      item.level === 3 ? 'pl-6 text-[11.5px]' : 'font-medium'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
