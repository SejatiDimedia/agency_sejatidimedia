import Link from "next/link";
import Image from "next/image";
import { getProjects } from "../../lib/api/glio-projects";
import { ChevronRight, ArrowLeft, Terminal } from "lucide-react";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-theme-fore-muted hover:text-theme-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Portofolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-theme-fore text-left">
            Portofolio Perangkat Lunak
          </h1>
          <p className="text-sm text-theme-fore-muted max-w-xl leading-relaxed text-left">
            Jelajahi katalog sistem produksi, aplikasi SaaS, dan produk mobile kustom yang dibangun dengan presisi.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length > 0 ? (
          projects.map((project) => {
            const isDummy = !project.thumbnail || 
              project.thumbnail.trim() === "" || 
              project.thumbnail === "/thumbnail.png" || 
              project.thumbnail === "/placeholder.png";
            const displayThumbnail = (isDummy ? "/logo.svg" : project.thumbnail) as string;

            return (
              <div
                key={project.slug}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-theme-elevated border border-theme-border hover:border-theme-border-accent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-theme-surface border border-theme-border/40">
                  <Image
                    src={displayThumbnail}
                    alt={project.name}
                    fill
                    className={isDummy ? "object-contain p-8 bg-theme-surface/40" : "object-cover group-hover:scale-[1.03] transition-transform duration-500"}
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                </div>

                {/* Title & Desc */}
                <div className="space-y-2 text-left">
                  <span className="inline-block text-[8px] font-mono uppercase tracking-widest font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Proyek Independen
                  </span>
                  <h3 className="text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-theme-fore-muted leading-relaxed line-clamp-3">
                    {project.summary || project.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-theme-border/30 mt-4">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-theme-surface text-theme-fore-muted border border-theme-border/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white text-xs font-sans font-bold text-theme-fore transition-all duration-300 border border-theme-border/80 hover:border-theme-accent"
                >
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-3 p-12 text-center rounded-2xl bg-theme-elevated border border-theme-border">
            <span className="text-xs font-mono text-theme-fore-muted">Tidak ada proyek ditemukan dalam portofolio.</span>
          </div>
        )}
      </div>
    </div>
  );
}
