"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2, Clock, ShieldAlert, Briefcase, Lock, ShieldCheck } from "lucide-react";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";
import ShowcaseGallery from "./ShowcaseGallery";
import { Project, isProfessionalProject } from "../lib/api/glio-projects";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { TECH_ICONS } from "../lib/constants";

const formatDate = (dateStr?: string, lang: string = 'id') => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(lang === 'en' ? "en-US" : "id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const splitDescriptionForNda = (content: string) => {
  const blocks = content.split(/\n\n+/);
  if (blocks.length <= 2) {
    const firstBlock = blocks[0] || '';
    const rest = blocks.slice(1).join('\n\n');
    return { intro: firstBlock, confidential: rest };
  }
  // Take first 2 blocks as intro, rest as confidential
  const intro = blocks.slice(0, 2).join('\n\n');
  const confidential = blocks.slice(2).join('\n\n');
  return { intro, confidential };
};

export default function ProjectDetailClient({
  project,
  relatedProjects,
  initialNdaBlurEnabled = true,
  initialNdaProjectSlugs = [],
}: {
  project: Project;
  relatedProjects: Project[];
  initialNdaBlurEnabled?: boolean;
  initialNdaProjectSlugs?: string[];
}) {
  const { t, language } = useLanguage();
  const [ndaBlur, setNdaBlur] = useState<boolean>(initialNdaBlurEnabled);
  const [ndaProjectSlugs, setNdaProjectSlugs] = useState<string[]>(initialNdaProjectSlugs);

  useEffect(() => {
    fetch('/api/settings/nda')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (typeof data.ndaBlurEnabled === 'boolean') {
            setNdaBlur(data.ndaBlurEnabled);
          }
          if (Array.isArray(data.ndaProjectSlugs)) {
            setNdaProjectSlugs(data.ndaProjectSlugs);
          }
        }
      })
      .catch(() => {});
  }, []);

  const isDummy = !project.thumbnail ||
    project.thumbnail.trim() === "" ||
    project.thumbnail === "/thumbnail.png" ||
    project.thumbnail === "/placeholder.png";
  const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

  const showcaseImages = project.documents?.filter((doc) => doc.type.startsWith("image/")) || [];

  const displayDescription = language === 'en'
    ? (project.descriptionEn || project.summaryEn || project.description || project.summary || "")
    : (project.descriptionId || project.summaryId || project.description || project.summary || "");

  const isProfessionalExp = isProfessionalProject(project, ndaProjectSlugs);
  const isNdaActive = isProfessionalExp && ndaBlur;
  const { intro, confidential } = splitDescriptionForNda(displayDescription);

  const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-2xl font-sans font-bold text-slate-900 dark:text-theme-fore mt-6 mb-3 border-b border-slate-100 dark:border-theme-border/20 pb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-sans font-bold text-slate-900 dark:text-theme-fore mt-5 mb-2.5 border-b border-slate-100 dark:border-theme-border/20 pb-1.5">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-theme-fore mt-4 mb-2">{children}</h3>,
    p: ({ children }: any) => <p className="mb-4 text-slate-600 dark:text-theme-fore-muted leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-outside mb-6 ml-5 space-y-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-outside mb-6 ml-5 space-y-2">{children}</ol>,
    li: ({ children }: any) => <li className="text-slate-600 dark:text-theme-fore-muted marker:font-bold marker:text-slate-800 [&>p]:m-0">{children}</li>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900 dark:text-theme-fore">{children}</strong>,
    code: ({ children }: any) => <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-theme-surface border border-slate-200 dark:border-theme-border font-mono text-xs text-[#2C5098]">{children}</code>,
  };

  return (
    <div className="space-y-10 py-8">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#2C5098] dark:text-theme-fore-muted dark:hover:text-[#2C5098] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.projectDetail?.back || (language === 'en' ? 'Back to Portfolio' : 'Kembali ke Portofolio')}</span>
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-theme-border/60 shadow-2xl">
        <Image
          src={displayThumbnail}
          alt={project.name}
          fill
          priority
          className={isDummy ? "object-contain p-16 bg-slate-50 dark:bg-theme-surface/40" : "object-cover"}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
          <div className="space-y-2 text-left">
            {isProfessionalExp && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 text-slate-800 border border-white/40 shadow-sm backdrop-blur-md">
                <Briefcase className="w-3.5 h-3.5 text-[#2C5098]" />
                <span>{language === 'en' ? 'Professional Career Experience' : 'Pengalaman Profesional Perusahaan'}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-white">
              {project.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Project Meta Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Project Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border shadow-md text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-theme-border/40 pb-2">
              <h2 className="text-xl font-sans font-bold text-slate-900 dark:text-theme-fore">
                {t.projectDetail?.detail || (language === 'en' ? 'Project Details' : 'Detail Proyek')}
              </h2>
              {isNdaActive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  <span>NDA Mode Active</span>
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base text-slate-600 dark:text-theme-fore-muted leading-relaxed text-left">
              {isNdaActive ? (
                <>
                  {/* Readable Intro Portion */}
                  <ReactMarkdown components={markdownComponents}>
                    {intro}
                  </ReactMarkdown>

                  {/* Blurred Confidential Portion with Overlay */}
                  {confidential && (
                    <div className="relative mt-6 pt-2 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                      {/* Blurred Text Body */}
                      <div className="filter blur-md opacity-25 select-none pointer-events-none p-4 max-h-[340px] overflow-hidden">
                        <ReactMarkdown components={markdownComponents}>
                          {confidential}
                        </ReactMarkdown>
                      </div>

                      {/* Gradient Mask */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-theme-elevated/85 dark:to-theme-elevated flex items-center justify-center p-4" />

                      {/* NDA Protection Card */}
                      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                        <div className="w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
                            <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                              {t.projectDetail?.ndaCardBadge || "Protected under NDA"}
                            </span>
                            <h4 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white">
                              {t.projectDetail?.ndaCardTitle || "Rincian Teknis Disamarkan (NDA Restricted)"}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                            {t.projectDetail?.ndaCardDesc || "Rincian arsitektur sistem mendalam, diagram alur data internal, dan proprietary logic disamarkan untuk mematuhi regulasi kerahasiaan perusahaan (NDA). Informasi pengantar di atas disajikan sebagai portofolio pengalaman profesional."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <ReactMarkdown components={markdownComponents}>
                  {displayDescription}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Project Details Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border shadow-md space-y-6 text-left">
            <h2 className="text-sm font-sans font-bold text-slate-900 dark:text-theme-fore uppercase tracking-wider border-b border-slate-100 dark:border-theme-border/40 pb-2">
              {t.projectDetail?.spec || (language === 'en' ? 'Project Specifications' : 'Spesifikasi Proyek')}
            </h2>

            {/* Status & Date & Classification */}
            <div className="space-y-4 text-xs">

              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400 dark:text-theme-fore-subtle">{t.projectDetail?.status || 'Status'}</span>
                <span className="flex items-center gap-1.5 font-sans font-bold text-slate-900 dark:text-theme-fore">
                  {project.status === "COMPLETE" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.projectDetail?.statusComplete || (language === 'en' ? 'Completed' : 'Selesai')}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.projectDetail?.statusOngoing || (language === 'en' ? 'Ongoing' : 'Sedang Berjalan')}</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400 dark:text-theme-fore-subtle">{t.projectDetail?.timeline || 'Timeline'}</span>
                <span className="flex items-center gap-1.5 font-sans font-bold text-slate-900 dark:text-theme-fore">
                  <Calendar className="w-3.5 h-3.5 text-[#2C5098]" />
                  <span>
                    {formatDate(project.startDate, language)} {project.endDate ? `— ${formatDate(project.endDate, language)}` : ""}
                  </span>
                </span>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 dark:text-theme-fore-subtle block">{t.projectDetail?.tech || (language === 'en' ? 'Technologies Used' : 'Teknologi yang Digunakan')}</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono bg-slate-50 dark:bg-theme-surface text-slate-700 dark:text-theme-fore border border-slate-200/80 dark:border-theme-border/60"
                  >
                    {TECH_ICONS[tech] && <Icon icon={TECH_ICONS[tech]} className="w-3 h-3 opacity-90" />}
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            {project.links && project.links.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-slate-400 dark:text-theme-fore-subtle block">{t.projectDetail?.links || (language === 'en' ? 'Project Links' : 'Tautan Proyek')}</span>
                <div className="space-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-theme-surface hover:bg-gradient-to-r hover:from-[#2C5098] hover:to-[#23385B] hover:text-white text-xs font-sans font-bold text-slate-800 dark:text-theme-fore border border-slate-200 dark:border-theme-border transition-all duration-300 group"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Showcase Gallery */}
          <ShowcaseGallery images={showcaseImages} isNdaBlurred={isNdaActive} />
        </div>
      </div>

      {/* Related Showcase */}
      {relatedProjects && relatedProjects.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200/80 dark:border-theme-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-theme-fore">{t.projectDetail?.related || (language === 'en' ? 'Other Projects' : 'Proyek Lainnya')}</h3>
              <p className="text-xs text-slate-600 dark:text-theme-fore-muted">{t.projectDetail?.relatedDesc || (language === 'en' ? 'Explore other software engineering works.' : 'Jelajahi karya rekayasa perangkat lunak lainnya.')}</p>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#2C5098] hover:text-[#23385B] transition-colors"
            >
              <span>{t.projectDetail?.viewAll || (language === 'en' ? 'View All Projects' : 'Lihat Semua Proyek')}</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((relProject) => {
              const relIsDummy = !relProject.thumbnail ||
                relProject.thumbnail.trim() === "" ||
                relProject.thumbnail === "/thumbnail.png" ||
                relProject.thumbnail === "/placeholder.png";
              const relDisplayThumbnail = (relIsDummy ? "/logo.svg" : relProject.thumbnail) as string;
              const relIsProfessional = isProfessionalProject(relProject, ndaProjectSlugs);

              const relDisplaySummary = language === 'en'
                ? (relProject.summaryEn || relProject.descriptionEn || relProject.summary || relProject.description)
                : (relProject.summaryId || relProject.descriptionId || relProject.summary || relProject.description);

              return (
                <div
                  key={relProject.slug}
                  className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-theme-elevated border border-slate-200 dark:border-theme-border hover:border-[#2C5098]/50 hover:shadow-xl hover:shadow-[#2C5098]/10 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-50 dark:bg-theme-surface border border-slate-200/80 dark:border-theme-border/40">
                      <Image
                        src={relDisplayThumbnail}
                        alt={relProject.name}
                        fill
                        className={relIsDummy ? "object-contain p-6 bg-slate-50 dark:bg-theme-surface/40" : "object-cover group-hover:scale-[1.02] transition-transform duration-500"}
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                      {relIsProfessional && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs">
                            <Briefcase className="w-3 h-3 text-[#2C5098]" />
                            <span>{language === 'en' ? 'Professional' : 'Pengalaman'}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-sm font-sans font-bold text-slate-900 dark:text-theme-fore group-hover:text-[#2C5098] transition-colors line-clamp-1">
                        {relProject.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-theme-fore-muted leading-relaxed line-clamp-2">
                        {relDisplaySummary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-theme-border/20 mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-theme-fore-subtle">
                      {formatDate(relProject.startDate, language)}
                    </span>
                    <Link
                      href={`/projects/${relProject.slug}`}
                      className="group inline-flex items-center gap-1 text-[11px] font-sans font-bold text-slate-700 dark:text-theme-fore hover:text-[#2C5098] transition-colors"
                    >
                      <span>{t.projectDetail?.detailLink || (language === 'en' ? 'View Detail' : 'Detail')}</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
