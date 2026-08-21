export interface GlioProjectLink {
  title: string;
  url: string;
  icon?: string | null;
}

export interface GlioProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Project {
  slug: string;
  name: string;
  summary?: string | null;
  summaryId?: string | null;
  summaryEn?: string | null;
  bannerImage?: string | null;
  thumbnail?: string | null;
  technologies: string[];
  categories: string[];
  status: "ONGOING" | "COMPLETE";
  startDate: string;
  endDate?: string | null;
  order: number;
  description?: string | null;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  links?: GlioProjectLink[];
  documents?: GlioProjectDocument[];
  isProfessional?: boolean;
  isNda?: boolean;
}

/**
 * Central utility function to determine if a project should be treated as
 * "Pengalaman Profesional Perusahaan" (Professional Career Experience / NDA-protected).
 */
export function isProfessionalProject(
  project: {
    slug?: string;
    name?: string;
    categories?: string[];
    isProfessional?: boolean;
    isNda?: boolean;
  },
  ndaProjectSlugs?: string[]
): boolean {
  if (!project) return false;

  // 1. Explicit boolean flag on project object (e.g. from database)
  if (project.isProfessional === true || project.isNda === true) {
    return true;
  }

  // 2. If ndaProjectSlugs is provided by Admin / Server API, it is the DEFINITIVE SOURCE OF TRUTH!
  if (Array.isArray(ndaProjectSlugs)) {
    if (project.slug && ndaProjectSlugs.includes(project.slug)) {
      return true;
    }
    // If not in the admin's active NDA list, it is NOT an NDA project!
    return false;
  }

  // 3. Fallback when ndaProjectSlugs has not been loaded yet:
  // Check categories / tags
  if (project.categories && Array.isArray(project.categories)) {
    const isCategoryMatched = project.categories.some((cat) => {
      const c = cat.toLowerCase().trim();
      return (
        c === 'pengalaman profesional' ||
        c === 'pengalaman perusahaan' ||
        c === 'professional experience' ||
        c === 'corporate' ||
        c === 'enterprise' ||
        c === 'nda' ||
        c === 'confidential' ||
        c === 'manufaktur' ||
        c === 'manufacturing'
      );
    });
    if (isCategoryMatched) return true;
  }

  // Check fallback keywords in project name
  if (project.name) {
    const nameLower = project.name.toLowerCase();
    if (
      nameLower.includes('manufaktur') ||
      nameLower.includes('manufactur') ||
      nameLower.includes('nda restricted')
    ) {
      return true;
    }
  }

  return false;
}

// Safe abstract placeholder SVG for blurred NDA screenshot thumbnails (100% leak-proof in DOM & Network tab)
export const NDA_PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='50%25' stop-color='%231e293b'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='16'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ccircle cx='180' cy='140' r='110' fill='%233b82f6' opacity='0.25' filter='url(%23b)'/%3E%3Ccircle cx='420' cy='260' r='130' fill='%23f59e0b' opacity='0.2' filter='url(%23b)'/%3E%3Ccircle cx='300' cy='200' r='90' fill='%2310b981' opacity='0.15' filter='url(%23b)'/%3E%3Crect x='60' y='50' width='480' height='300' rx='20' fill='%23ffffff' fill-opacity='0.03' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E";

export const NDA_REDACTED_TEXT_ID = `### Arsitektur Sistem Internal [DATA DISENSOR DI BAWAH NDA]

Implementasi modul proprietary meliputi integrasi pipeline sensor data real-time, sinkronisasi gateway industri dengan protokol standar, pengolahan metrik telemetri, serta orkestrasi microservices backend terdistribusi.

- Pipeline data internal terenkripsi end-to-end
- Optimasi alur antrian pesan asynchronous dan caching
- Algoritma pemrosesan telemetri internal sistem
- Integrasi database relasional dan in-memory data store

Seluruh rincian konfigurasi server riil, skema database proprietary, dan diagram topologi internal disamarkan untuk mematuhi regulasi kerahasiaan perusahaan (Non-Disclosure Agreement).`;

export const NDA_REDACTED_TEXT_EN = `### Internal System Architecture [REDACTED UNDER NDA]

Proprietary implementation encompasses real-time telemetry processing pipelines, industrial gateway protocol synchronization, internal messaging queues, and distributed backend service orchestration.

- End-to-end encrypted internal data transport
- High-throughput asynchronous message queue optimization
- Internal business logic and telemetry calculation algorithms
- Resilient database clustering and in-memory cache architecture

All sensitive server connection strings, internal database schemas, and proprietary network topology diagrams are fully redacted to ensure compliance with corporate Non-Disclosure Agreements (NDA).`;

/**
 * Military-grade server & client sanitizer:
 * Strips raw confidential text and replaces real screenshot URLs with safe abstract SVG graphics.
 */
export function sanitizeProjectForNda(project: Project, isNdaActive: boolean): Project {
  if (!isNdaActive) return project;

  const getIntroOnly = (content?: string | null) => {
    if (!content) return "";
    const blocks = content.split(/\n\n+/);
    if (blocks.length <= 2) {
      return blocks[0] || "";
    }
    return blocks.slice(0, 2).join("\n\n");
  };

  const rawId = project.descriptionId || project.description || "";
  const rawEn = project.descriptionEn || project.description || "";

  const introId = getIntroOnly(rawId);
  const introEn = getIntroOnly(rawEn);

  // Redacted description: safe intro + generic dummy redacted text
  const sanitizedDescId = `${introId}\n\n${NDA_REDACTED_TEXT_ID}`;
  const sanitizedDescEn = `${introEn}\n\n${NDA_REDACTED_TEXT_EN}`;

  // Redact screenshot image documents: Replace real image URLs with safe abstract SVG data
  const sanitizedDocuments = (project.documents || []).map((doc, idx) => {
    if (doc.type && doc.type.startsWith("image/")) {
      return {
        ...doc,
        id: `nda-doc-${idx}`,
        name: `Redacted Screenshot ${idx + 1}`,
        url: NDA_PLACEHOLDER_IMAGE,
      };
    }
    return doc;
  });

  return {
    ...project,
    description: sanitizedDescId,
    descriptionId: sanitizedDescId,
    descriptionEn: sanitizedDescEn,
    documents: sanitizedDocuments,
  };
}

const GLIO_API_URL = process.env.GLIO_API_URL || "";
const GLIO_API_KEY = process.env.GLIO_API_KEY || "";

// High-fidelity mock projects that serve as a default fallback when the database on Glio is empty
export const MOCK_PROJECTS: Project[] = [
  {
    slug: "nexus-erp-suite",
    name: "Nexus ERP Suite",
    summary: "Platform ERP multi-tenant untuk manajemen proses internal perusahaan dengan fokus pada Human Capital Management (HCM).",
    summaryId: "Platform ERP multi-tenant untuk manajemen proses internal perusahaan dengan fokus pada Human Capital Management (HCM).",
    summaryEn: "Multi-tenant ERP platform for internal company processes focusing on Human Capital Management (HCM).",
    description: "Platform ERP multi-tenant untuk manajemen proses internal perusahaan, dengan fokus pada Human Capital Management (HCM), dikembangkan sebagai proyek independen. Dirancang agar proses HR yang biasanya tersebar di banyak file/tools bisa terpusat dalam satu sistem.",
    descriptionId: "Platform ERP multi-tenant untuk manajemen proses internal perusahaan, dengan fokus pada Human Capital Management (HCM), dikembangkan sebagai proyek independen. Dirancang agar proses HR yang biasanya tersebar di banyak file/tools bisa terpusat dalam satu sistem.",
    descriptionEn: "A multi-tenant ERP platform for managing internal company workflows with a strong focus on Human Capital Management (HCM), developed as an independent project. Designed to centralize HR processes usually scattered across tools.",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    technologies: ["Next.js", "TypeScript", "Drizzle ORM", "PostgreSQL", "Tailwind CSS"],
    categories: ["ERP", "HCM", "Web App"],
    status: "COMPLETE",
    startDate: "2025-01-15",
    endDate: "2025-03-31",
    order: 1,
    links: [
      { title: "Case Study", url: "/projects/nexus-erp-suite", icon: null }
    ],
    documents: []
  },
  {
    slug: "antreey-reservation-system",
    name: "Antreey",
    summary: "Sistem antrean & reservasi berbasis web untuk bisnis jasa seperti arena olahraga dan barbershop.",
    summaryId: "Sistem antrean & reservasi berbasis web untuk bisnis jasa seperti arena olahraga dan barbershop.",
    summaryEn: "Web-based queue and reservation system for service businesses like sports arenas and barbershops.",
    description: "Antreey adalah sistem antrean & reservasi berbasis web untuk bisnis jasa seperti arena olahraga dan barbershop, dikembangkan sebagai proyek independen. Dirancang untuk mengurangi waktu tunggu pelanggan dan menghilangkan pencatatan manual di lokasi.",
    descriptionId: "Antreey adalah sistem antrean & reservasi berbasis web untuk bisnis jasa seperti arena olahraga dan barbershop, dikembangkan sebagai proyek independen. Dirancang untuk mengurangi waktu tunggu pelanggan dan menghilangkan pencatatan manual di lokasi.",
    descriptionEn: "Antreey is a web-based queue & reservation platform for service businesses like sports arenas and barbershops, developed as an independent project. Designed to reduce client waiting times and eliminate manual logs.",
    bannerImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    technologies: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "WebSockets"],
    categories: ["Booking System", "Web App"],
    status: "COMPLETE",
    startDate: "2025-04-01",
    endDate: "2025-05-15",
    order: 2,
    links: [
      { title: "Case Study", url: "/projects/antreey-reservation-system", icon: null }
    ],
    documents: []
  },
  {
    slug: "ai-resume-analyzer",
    name: "AI Resume Analyzer",
    summary: "Platform berbasis Google Gemini AI untuk optimasi resume, analisis ATS, dan pembuatan cover letter otomatis.",
    summaryId: "Platform berbasis Google Gemini AI untuk optimasi resume, analisis ATS, dan pembuatan cover letter otomatis.",
    summaryEn: "Google Gemini AI-powered platform for resume optimization, ATS analysis, and cover letter generation.",
    description: "Platform berbasis Google Gemini AI untuk mengoptimalkan resume, mendeteksi keyword gap, menghitung ATS score, dan membuat cover letter otomatis — dikembangkan sebagai proyek independen untuk eksplorasi integrasi AI dalam produk nyata.",
    descriptionId: "Platform berbasis Google Gemini AI untuk mengoptimalkan resume, mendeteksi keyword gap, menghitung ATS score, dan membuat cover letter otomatis — dikembangkan sebagai proyek independen untuk eksplorasi integrasi AI dalam produk nyata.",
    descriptionEn: "A platform powered by Google Gemini AI to optimize resumes, detect keyword gaps, compute ATS compatibility scores, and generate automated cover letters, developed as an independent project to explore AI integration.",
    bannerImage: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=600&auto=format&fit=crop&q=80",
    technologies: ["Next.js", "Google Gemini API", "Tailwind CSS", "TypeScript", "Node.js"],
    categories: ["AI Integration", "Web App"],
    status: "COMPLETE",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    order: 3,
    links: [
      { title: "Case Study", url: "/projects/ai-resume-analyzer", icon: null }
    ],
    documents: []
  }
];

export async function getProjects(): Promise<Project[]> {
  if (!GLIO_API_URL || !GLIO_API_KEY) {
    console.warn("Glio API configuration is missing. Falling back to mock projects.");
    return [...MOCK_PROJECTS].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  const url = `${GLIO_API_URL}/projects`;
  try {
    const res = await fetch(url, {
      headers: {
        "x-api-key": GLIO_API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Glio API: Failed to fetch projects list. Status code: ${res.status}`);
    }

    const data = (await res.json()) as Project[];
    const list = (!data || data.length === 0) ? MOCK_PROJECTS : data;

    // Sort projects by startDate descending (newest first)
    return [...list].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  } catch (error) {
    console.warn("Glio API request failed, falling back to mock projects:", error);
    return [...MOCK_PROJECTS].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!GLIO_API_URL || !GLIO_API_KEY) {
    console.warn("Glio API configuration is missing. Falling back to mock projects.");
    return MOCK_PROJECTS.find((p) => p.slug === slug) || null;
  }

  const url = `${GLIO_API_URL}/projects/${slug}`;
  try {
    const res = await fetch(url, {
      headers: {
        "x-api-key": GLIO_API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (res.status === 404) {
      // Check local fallback first
      const localProject = MOCK_PROJECTS.find((p) => p.slug === slug);
      return localProject || null;
    }

    if (!res.ok) {
      throw new Error(`Glio API: Failed to fetch project detail for slug "${slug}". Status code: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.warn(`Glio API detail request failed for "${slug}", trying fallback:`, error);
    const localProject = MOCK_PROJECTS.find((p) => p.slug === slug);
    return localProject || null;
  }
}
