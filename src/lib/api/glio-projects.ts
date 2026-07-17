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
