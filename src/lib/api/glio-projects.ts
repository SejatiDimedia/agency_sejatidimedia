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
    slug: "aegis-pay-fintech-gateway",
    name: "Aegis Pay Portal",
    summary: "Konsol pemrosesan pembayaran dengan throughput tinggi dilengkapi analisis fraud real-time.",
    summaryId: "Konsol pemrosesan pembayaran dengan throughput tinggi dilengkapi analisis fraud real-time.",
    summaryEn: "A high-throughput payment gateway console featuring real-time fraud analysis dashboard.",
    description: "Aegis Pay adalah sistem pemrosesan transaksi keuangan berskala besar. Dibangun untuk memberikan latensi minimal dan tingkat keberhasilan transaksi maksimal bagi merchant enterprise. Proyek ini mengintegrasikan pemantauan keamanan real-time menggunakan kecerdasan buatan untuk mendeteksi transaksi mencurigakan dalam hitungan milidetik.",
    descriptionId: "Aegis Pay adalah sistem pemrosesan transaksi keuangan berskala besar. Dibangun untuk memberikan latensi minimal dan tingkat keberhasilan transaksi maksimal bagi merchant enterprise. Proyek ini mengintegrasikan pemantauan keamanan real-time menggunakan kecerdasan buatan untuk mendeteksi transaksi mencurigakan dalam hitungan milidetik.",
    descriptionEn: "Aegis Pay is a high-volume financial transaction processing engine built to deliver sub-second latency and maximum transaction success rates for enterprise merchants. It integrates intelligent real-time fraud prevention systems.",
    bannerImage: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=600&auto=format&fit=crop&q=80",
    technologies: ["React", "TypeScript", "Go Lang", "PostgreSQL", "Tailwind CSS", "Redis"],
    categories: ["Web App", "Fintech", "Dashboard"],
    status: "COMPLETE",
    startDate: "2025-01-10",
    endDate: "2025-06-15",
    order: 1,
    links: [
      { title: "Live Site", url: "https://aegispay.example.com", icon: null },
      { title: "Case Study", url: "/projects/aegis-pay-fintech-gateway", icon: null }
    ],
    documents: []
  },
  {
    slug: "nova-crm-saas-platform",
    name: "Nova Intelligent CRM",
    summary: "Platform CRM bertenaga AI untuk otomatisasi alur kerja sales dan perkiraan transaksi cerdas.",
    summaryId: "Platform CRM bertenaga AI untuk otomatisasi alur kerja sales dan perkiraan transaksi cerdas.",
    summaryEn: "AI-powered CRM platform for sales workflow automation and predictive deal forecasting.",
    description: "Nova CRM merevolusi cara tim penjualan berinteraksi dengan pelanggan. Dengan asisten AI terintegrasi, platform ini secara otomatis merangkum riwayat percakapan email, memprediksi probabilitas kesuksesan kesepakatan, dan mengotomatiskan tugas administrasi rutin sehingga tim Anda dapat fokus pada penjualan.",
    descriptionId: "Nova CRM merevolusi cara tim penjualan berinteraksi dengan pelanggan. Dengan asisten AI terintegrasi, platform ini secara otomatis merangkum riwayat percakapan email, memprediksi probabilitas kesuksesan kesepakatan, dan mengotomatiskan tugas administrasi rutin sehingga tim Anda dapat fokus pada penjualan.",
    descriptionEn: "Nova CRM revolutionizes sales pipelines. Built with custom LLM integrations, it automatically distills email exchanges, predicts deal success scores, and automates mundane administrative follow-ups.",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    technologies: ["Next.js", "FastAPI", "Python", "Docker", "Tailwind CSS", "PostgreSQL"],
    categories: ["SaaS", "Artificial Intelligence", "Web App"],
    status: "COMPLETE",
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    order: 2,
    links: [
      { title: "Demo App", url: "https://novacrm.example.com", icon: null }
    ],
    documents: []
  },
  {
    slug: "aura-space-productivity-ios",
    name: "Aura Space iOS App",
    summary: "Aplikasi kolaborasi spasial dan kanvas catatan interaktif yang dioptimalkan untuk iOS & VisionOS.",
    summaryId: "Aplikasi kolaborasi spasial dan kanvas catatan interaktif yang dioptimalkan untuk iOS & VisionOS.",
    summaryEn: "Spatial collaboration and interactive notes canvas app optimized for iOS and VisionOS.",
    description: "Aura Space dirancang sebagai kanvas kolaboratif tanpa batas. Aplikasi ini memungkinkan tim memetakan ide secara spasial di iOS dan headset Apple Vision Pro secara real-time menggunakan sinkronisasi WebSockets berlatensi sangat rendah.",
    descriptionId: "Aura Space dirancang sebagai kanvas kolaboratif tanpa batas. Aplikasi ini memungkinkan tim memetakan ide secara spasial di iOS dan headset Apple Vision Pro secara real-time menggunakan sinkronisasi WebSockets berlatensi sangat rendah.",
    descriptionEn: "Aura Space is a boundless collaborative canvas. It allows distributed teams to map out visual ideas on iPadOS and Apple Vision Pro in real-time, backed by sub-10ms WebSockets state synchronization.",
    bannerImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    technologies: ["SwiftUI", "Swift", "Go Lang", "Redis", "WebSockets"],
    categories: ["Mobile App", "Productivity", "VisionOS"],
    status: "ONGOING",
    startDate: "2025-11-01",
    order: 3,
    links: [],
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
