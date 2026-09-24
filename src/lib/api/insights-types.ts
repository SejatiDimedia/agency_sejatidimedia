export interface InsightAuthor {
  name: string;
  role: string;
  avatar: string;
  bioId?: string;
  bioEn?: string;
}

export interface SeriesCurriculumItem {
  part: number;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  readTimeMinutes: number;
  isCurrent: boolean;
}

export interface SeriesAdjacentPart {
  part: number;
  slug: string;
  titleId: string;
  titleEn?: string | null;
}

export interface InsightSeriesInfo {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  badge?: string | null;
  category?: string | null;
  part: number;
  totalParts: number;
  curriculum: SeriesCurriculumItem[];
  prevPart?: SeriesAdjacentPart | null;
  nextPart?: SeriesAdjacentPart | null;
}

export interface InsightSeriesSummary {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  badge?: string | null;
  category: string;
  coverImage?: string | null;
  totalArticles: number;
  totalReadTimeMinutes: number;
  updatedAt: string;
}

export interface InsightSeriesDetail extends InsightSeriesSummary {
  articles: Array<{
    slug: string;
    titleId: string;
    titleEn?: string | null;
    excerptId: string;
    excerptEn?: string | null;
    readTimeMinutes: number;
    seriesPart: number;
    publishedAt: string;
  }>;
}

export interface InsightArticle {
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTimeMinutes: number;
  author: InsightAuthor;
  coverImage: string;
  featured?: boolean;
  seriesId?: string | null;
  seriesPart?: number | null;
  series?: InsightSeriesInfo | null;
  isPublished?: boolean;
}

export const DEFAULT_AUTHOR: InsightAuthor = {
  name: "Timur Dian Radha Sejati",
  role: "Lead Software Engineer · SejatiDimedia",
  avatar: "/images/author_timur_dian.jpg",
  bioId: "Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi, refactoring backend skala enterprise (Laravel / Node.js), hingga pengembangan aplikasi mobile & web modern.",
  bioEn: "Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design, enterprise-scale backend refactoring (Laravel / Node.js), and modern web & mobile engineering.",
};

export const FALLBACK_INSIGHTS: InsightArticle[] = [
  {
    slug: "kesalahan-arsitektur-laravel-developer",
    titleId: "5 Kesalahan Arsitektur yang Sering Dilakukan Laravel Developer (Dan Cara Kami Mencegahnya di Skala Bisnis)",
    titleEn: "5 Architectural Pitfalls in Laravel Applications & How We Prevent Them at Scale",
    excerptId: "Banyak aplikasi Laravel berjalan lancar di tahap awal, namun tiba-tiba lemot dan sering crash saat pengguna bertambah. Mengapa ini terjadi dan bagaimana standar arsitektur SejatiDimedia mengatasinya?",
    excerptEn: "Many Laravel apps run smoothly initially, but become sluggish and prone to crashes as user traffic scales. Why does this happen and how does SejatiDimedia's architecture prevent it?",
    contentId: "",
    contentEn: "",
    category: "Backend",
    tags: ["Laravel", "PHP", "Database", "Architecture", "Performance"],
    publishedAt: "2026-09-13",
    readTimeMinutes: 7,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/laravel_architecture_cover.jpg",
    featured: true,
  },
  {
    slug: "nextjs-typescript-production-checklist",
    titleId: "Checklist Next.js App Router untuk Production: Menghindari Memory Leak dan State Inconsistency",
    titleEn: "Next.js App Router Production Checklist: Avoiding Memory Leaks and State Inconsistency",
    excerptId: "Panduan teknis migrasi dan hardening Next.js untuk aplikasi bisnis: penanganan caching, revalidasi dinamis, dan pemisahan state server vs klien.",
    excerptEn: "Technical guide for hardening Next.js business applications: handling caching, dynamic revalidation, and server vs client state separation.",
    contentId: "",
    contentEn: "",
    category: "Frontend",
    tags: ["Next.js", "TypeScript", "React", "State Management", "Performance"],
    publishedAt: "2026-09-10",
    readTimeMinutes: 6,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/nextjs_typescript_cover.jpg",
    featured: false,
  },
  {
    slug: "merancang-portal-klien-transparansi",
    titleId: "Mengapa Kami Membangun Portal Klien Khusus untuk Setiap Proyek (Bukan Sekadar Kirim Update WhatsApp)",
    titleEn: "Why We Built a Dedicated Client Portal for Every Project (Beyond Generic WhatsApp Updates)",
    excerptId: "Transparansi bukan sekadar janji sales. Lihat bagaimana portal klien SejatiDimedia menyajikan live kanban, sprint deliverable, invoice resmi, dan audit log secara real-time.",
    excerptEn: "Transparency is more than a sales pitch. Discover how SejatiDimedia's client portal provides real-time kanban tracking, sprint deliverables, verified invoicing, and audit logs.",
    contentId: "",
    contentEn: "",
    category: "Architecture",
    tags: ["Client Portal", "Product Management", "Transparency", "Agile"],
    publishedAt: "2026-09-08",
    readTimeMinutes: 5,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/client_portal_cover.jpg",
    featured: false,
  },
];
