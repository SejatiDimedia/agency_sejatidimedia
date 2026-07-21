"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ShowcaseGallery from "./ShowcaseGallery";
import { Project } from "../lib/api/glio-projects";
import { useLanguage } from "../lib/i18n/LanguageContext";

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

export default function ProjectDetailClient({ project, relatedProjects }: { project: Project, relatedProjects: Project[] }) {
  const { t, language } = useLanguage();

  const isDummy = !project.thumbnail || 
    project.thumbnail.trim() === "" || 
    project.thumbnail === "/thumbnail.png" || 
    project.thumbnail === "/placeholder.png";
  const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

  const showcaseImages = project.documents?.filter((doc) => doc.type.startsWith("image/")) || [];

  const displayDescription = language === 'en' 
    ? (project.descriptionEn || project.summaryEn || project.description || project.summary || "")
    : (project.descriptionId || project.summaryId || project.description || project.summary || "");

  return (
    <div className="space-y-10 py-8">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-theme-fore-muted hover:text-theme-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.projectDetail?.back || (language === 'en' ? 'Back to Portfolio' : 'Kembali ke Portofolio')}</span>
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden border border-theme-border/60 shadow-2xl">
        <Image
          src={displayThumbnail}
          alt={project.name}
          fill
          priority
          className={isDummy ? "object-contain p-16 bg-theme-surface/40" : "object-cover"}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
          <div className="space-y-2">
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
          <div className="p-6 sm:p-8 rounded-2xl bg-theme-elevated border border-theme-border shadow-md text-left space-y-4">
            <h2 className="text-xl font-sans font-bold text-theme-fore border-b border-theme-border/40 pb-2">
              {t.projectDetail?.detail || (language === 'en' ? 'Project Details' : 'Detail Proyek')}
            </h2>
            <div className="text-sm sm:text-base text-theme-fore-muted leading-relaxed text-left">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-sans font-bold text-theme-fore mt-6 mb-3 border-b border-theme-border/20 pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-sans font-bold text-theme-fore mt-5 mb-2.5 border-b border-theme-border/20 pb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-sans font-bold text-theme-fore mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-theme-fore-muted leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-6 ml-5 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-6 ml-5 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-theme-fore-muted marker:font-bold marker:text-theme-fore [&>p]:m-0">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-theme-fore">{children}</strong>,
                  code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-theme-surface border border-theme-border font-mono text-xs text-theme-accent">{children}</code>,
                }}
              >
                {displayDescription}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right Column: Project Details Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
          <div className="p-6 rounded-2xl bg-theme-elevated border border-theme-border shadow-md space-y-6 text-left">
            <h2 className="text-sm font-sans font-bold text-theme-fore uppercase tracking-wider border-b border-theme-border/40 pb-2">
              {t.projectDetail?.spec || (language === 'en' ? 'Project Specifications' : 'Spesifikasi Proyek')}
            </h2>

            {/* Status & Date */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-theme-fore-subtle">{t.projectDetail?.status || 'Status'}</span>
                <span className="flex items-center gap-1.5 font-sans font-bold text-theme-fore">
                  {project.status === "COMPLETE" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
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
                <span className="font-mono text-theme-fore-subtle">{t.projectDetail?.timeline || 'Timeline'}</span>
                <span className="flex items-center gap-1.5 font-sans font-bold text-theme-fore">
                  <Calendar className="w-3.5 h-3.5 text-theme-accent" />
                  <span>
                    {formatDate(project.startDate, language)} {project.endDate ? `— ${formatDate(project.endDate, language)}` : ""}
                  </span>
                </span>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-theme-fore-subtle block">{t.projectDetail?.tech || (language === 'en' ? 'Technologies Used' : 'Teknologi yang Digunakan')}</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded-md text-[10px] font-mono bg-theme-surface text-theme-fore border border-theme-border/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            {project.links && project.links.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-theme-fore-subtle block">{t.projectDetail?.links || (language === 'en' ? 'Project Links' : 'Tautan Proyek')}</span>
                <div className="space-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white text-xs font-sans font-bold text-theme-fore border border-theme-border transition-all duration-300 group"
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
          <ShowcaseGallery images={showcaseImages} />
        </div>
      </div>

      {/* Related Showcase */}
      {relatedProjects && relatedProjects.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-theme-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-xl font-sans font-bold text-theme-fore">{t.projectDetail?.related || (language === 'en' ? 'Other Projects' : 'Proyek Lainnya')}</h3>
              <p className="text-xs text-theme-fore-muted">{t.projectDetail?.relatedDesc || (language === 'en' ? 'Explore other software engineering works.' : 'Jelajahi karya rekayasa perangkat lunak lainnya.')}</p>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-xs font-sans font-bold text-theme-accent hover:text-theme-accent-bright transition-colors"
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

              const relDisplaySummary = language === 'en'
                ? (relProject.summaryEn || relProject.descriptionEn || relProject.summary || relProject.description)
                : (relProject.summaryId || relProject.descriptionId || relProject.summary || relProject.description);

              return (
                <div
                  key={relProject.slug}
                  className="group flex flex-col justify-between p-4 rounded-xl bg-theme-elevated border border-theme-border hover:border-theme-border-accent hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-theme-surface border border-theme-border/40">
                      <Image
                        src={relDisplayThumbnail}
                        alt={relProject.name}
                        fill
                        className={relIsDummy ? "object-contain p-6 bg-theme-surface/40" : "object-cover group-hover:scale-[1.02] transition-transform duration-500"}
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                    </div>
                    {/* Info */}
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-sm font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors line-clamp-1">
                        {relProject.name}
                      </h4>
                      <p className="text-[11px] text-theme-fore-muted leading-relaxed line-clamp-2">
                        {relDisplaySummary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-theme-border/20 mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-theme-fore-subtle">
                      {formatDate(relProject.startDate, language)}
                    </span>
                    <Link
                      href={`/projects/${relProject.slug}`}
                      className="group inline-flex items-center gap-1 text-[11px] font-sans font-bold text-theme-fore hover:text-theme-accent transition-colors"
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
