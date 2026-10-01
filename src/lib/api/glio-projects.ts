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
  order?: number;
}

export interface Project {
  slug: string;
  name: string;
  summary?: string | null;
  summaryId?: string | null;
  summaryEn?: string | null;
  clientSummaryId?: string | null;
  clientSummaryEn?: string | null;
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
  showcaseOrder?: string[];
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

/**
 * Curated showcase sequences for specific projects (e.g. ticketing user journey flow).
 */
export const PROJECT_SHOWCASE_ORDER_MAP: Record<string, string[]> = {
  "flash-sale--event-ticketing-platform": [
    "Cover Flash Sale Ticket Event.webp",
    "HomePage.webp",
    "WaitingRoomPage.webp",
    "TicketPage.webp",
    "CheckoutPage.webp",
    "MyTicketsPage.webp",
    "ProfilePage.webp",
    "AdminManagementPage.webp",
    "architecture_diagram.webp",
  ],
  "absensi-hris-app-face-recognition--gps": [
    "Cover Absensi GeoFace.webp",
    "HomePage.jpeg",
    "CheckInPage.jpeg",
    "SuccessCheckIn.jpeg",
    "RejectCheckOutPage.jpeg",
    "HistoryAttendance.jpeg",
    "LeaveRequestPage.jpeg",
    "ApplyLeaveRequestPage.jpeg",
    "EditProfilePage.jpeg",
    "AdminAttendancePage.webp",
    "AdminReportAbsensiPage.webp",
    "AdminSettingCompanyPage.webp",
    "Screenshot 2025-10-26 at 20.30.19.png",
  ],
  "self-order-resto-app": [
    "Cover SelfOrder App.webp",
    "KasirPage.png",
    "TableAdminPage.png",
    "ProductAdminPage.webp",
    "OrderPage.webp",
    "CheckoutPage.png",
    "PaymentPage.png",
    "QrisPaymentPage.png",
    "CompleteOrderPage.png",
    "CompleteOrderDetailPage.png",
    "DashboardProcessPage.png",
    "OrderAdminPage.webp",
    "SettingPrinterPage.png",
  ],
  "ayosehat-app": [
    "OnBoardingPage.png",
    "TelemedisNewFiturePage.png",
    "DocterListChatPage.png",
    "ListChatPage.png",
    "DoctorChatPage.webp",
    "RoomChatPage.png",
    "HistoryOrderChatPage.png",
    "ProfilePage.png",
    "EditProfilePage.png",
    "ManagementDoktorPage.webp",
    "ManagementSpesialisPage.webp",
    "ManagementOrderPage.webp",
  ],
  "inventory-system-tablet-screen": [
    "Cover Inventory System Tablet.webp",
    "LoginPage.webp",
    "DashboardPage.png",
    "DashboardPage2.png",
    "ProductsPage.png",
    "WarehousePage.png",
    "WarehouseStockPage.png",
    "StockopnamePage.png",
    "PurchasePage.png",
    "SupplierPage.png",
    "BrandPage.png",
  ],
};

function normalizeDocName(name: string): string {
  return name.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[_\-\s]+/g, " ").trim();
}

function getScreenLifecycleWeight(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("cover") || n.includes("hero") || n.includes("banner") || n.includes("mockup")) return 10;
  if (n.includes("login") || n.includes("auth") || n.includes("signin") || n.includes("onboarding") || n.includes("welcome")) return 20;
  if (n.includes("home") || n.includes("dashboard") || n.includes("main") || n.includes("overview")) return 30;
  if (n.includes("waiting") || n.includes("queue") || n.includes("radar")) return 35;
  if (n.includes("ticket") || n.includes("product") || n.includes("catalog") || n.includes("list") || n.includes("browse")) return 40;
  if (n.includes("detail") || n.includes("view") || n.includes("room") || n.includes("chat")) return 50;
  if (n.includes("checkin") || n.includes("entry") || n.includes("form") || n.includes("request") || n.includes("apply")) return 60;
  if (n.includes("checkout") || n.includes("payment") || n.includes("qris") || n.includes("kasir") || n.includes("pay")) return 70;
  if (n.includes("myticket") || n.includes("success") || n.includes("complete") || n.includes("slip") || n.includes("receipt")) return 80;
  if (n.includes("history") || n.includes("report") || n.includes("rekap") || n.includes("monitoring") || n.includes("tracking")) return 90;
  if (n.includes("profile") || n.includes("account") || n.includes("setting") || n.includes("printer")) return 100;
  if (n.includes("admin") || n.includes("management") || n.includes("master") || n.includes("company")) return 110;
  if (n.includes("architecture") || n.includes("diagram") || n.includes("schema") || n.includes("topology")) return 120;
  return 65;
}

/**
 * Sorts showcase images logically:
 * 1. Honors explicit showcaseOrder array (by document id, name, or url) if provided by CMS.
 * 2. Honors explicit non-zero document order if set on documents.
 * 3. Checks explicit project-specific ordering maps.
 * 4. Applies user-journey lifecycle heuristics with natural numeric ordering.
 */
export function sortShowcaseImages(
  images: GlioProjectDocument[],
  slug?: string,
  showcaseOrder?: string[]
): GlioProjectDocument[] {
  if (!images || images.length <= 1) return images || [];

  // 1. Check if CMS/Glio provided explicit showcaseOrder array
  if (showcaseOrder && Array.isArray(showcaseOrder) && showcaseOrder.length > 0) {
    const normalizedOrders = showcaseOrder.map(normalizeDocName);
    return [...images].sort((a, b) => {
      const getPos = (doc: GlioProjectDocument) => {
        const idPos = showcaseOrder.indexOf(doc.id);
        if (idPos !== -1) return idPos;
        const normPos = normalizedOrders.indexOf(normalizeDocName(doc.name));
        if (normPos !== -1) return normPos;
        const urlPos = showcaseOrder.indexOf(doc.url);
        if (urlPos !== -1) return urlPos;
        return -1;
      };

      const posA = getPos(a);
      const posB = getPos(b);

      if (posA !== -1 && posB !== -1) return posA - posB;
      if (posA !== -1) return -1;
      if (posB !== -1) return 1;

      return (a.order ?? 0) - (b.order ?? 0);
    });
  }

  // 2. Honors explicit non-zero document order if set
  const hasExplicitOrders = images.some((img) => typeof img.order === "number" && img.order > 0);
  if (hasExplicitOrders) {
    return [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  // 3. Project-specific explicit order map
  if (slug && PROJECT_SHOWCASE_ORDER_MAP[slug]) {
    const targetMap = PROJECT_SHOWCASE_ORDER_MAP[slug];
    const normalizedTargets = targetMap.map(normalizeDocName);

    return [...images].sort((a, b) => {
      const normA = normalizeDocName(a.name);
      const normB = normalizeDocName(b.name);

      const idxA = normalizedTargets.indexOf(normA);
      const idxB = normalizedTargets.indexOf(normB);

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;

      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
    });
  }

  return [...images].sort((a, b) => {
    const weightA = getScreenLifecycleWeight(a.name);
    const weightB = getScreenLifecycleWeight(b.name);

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });
}

/**
 * Cleans up raw file names into human-readable display titles:
 * e.g., "WaitingRoomPage.webp" -> "Waiting Room Page"
 * "architecture_diagram.webp" -> "Architecture Diagram"
 */
export function cleanImageTitle(rawName: string): string {
  if (!rawName) return "";
  let title = rawName.replace(/\.[a-zA-Z0-9]+$/, "");
  title = title.replace(/[_-]+/g, " ");
  title = title.replace(/([a-z])([A-Z])/g, "$1 $2");
  title = title.replace(/\s+/g, " ").trim();
  title = title.replace(/\b\w/g, (c) => c.toUpperCase());
  return title;
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
    clientSummaryId: "# Nexus ERP Suite\n### Solusi Sentralisasi Manajemen SDM & Operasional Bisnis\n\n## Ringkasan Proyek\nNexus ERP Suite dirancang untuk menyederhanakan pengelolaan Human Capital Management (HCM) perusahaan, mulai dari struktur organisasi, kehadiran karyawan, hingga evaluasi performa dalam satu portal terpadu.\n\n## Manfaat Utama\n- Sentralisasi data karyawan tanpa tercecer di lembar kerja terpisah\n- Akses mandiri (employee self-service) untuk pengajuan izin dan cuti\n- Efisiensi audit data dan laporan berkala untuk manajemen",
    clientSummaryEn: "# Nexus ERP Suite\n### Centralized HR & Operational Business Management Solution\n\n## Project Overview\nNexus ERP Suite is designed to streamline Human Capital Management (HCM) operations, centralizing organizational structures, employee attendance, and performance evaluations into a unified portal.\n\n## Key Benefits\n- Centralized employee records eliminating fragmented spreadsheets\n- Employee self-service for leave requests and attendance logs\n- Streamlined auditing and real-time operational reports for leadership",
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
    description: "Platform berbasis Google Gemini AI untuk mengoptimalkan resume, mendeteksi keyword gap, menghitung ATS score, dan membuat cover letter otomatis, dikembangkan sebagai proyek independen untuk eksplorasi integrasi AI dalam produk nyata.",
    descriptionId: "Platform berbasis Google Gemini AI untuk mengoptimalkan resume, mendeteksi keyword gap, menghitung ATS score, dan membuat cover letter otomatis, dikembangkan sebagai proyek independen untuk eksplorasi integrasi AI dalam produk nyata.",
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
      cache: "no-store",
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
      cache: "no-store",
    });

    if (res.status === 404) {
      // Check local fallback first
      const localProject = MOCK_PROJECTS.find((p) => p.slug === slug);
      return localProject || null;
    }

    if (!res.ok) {
      throw new Error(`Glio API: Failed to fetch project detail for slug "${slug}". Status code: ${res.status}`);
    }

    const project = (await res.json()) as Project;
    if (project && project.documents) {
      project.documents = sortShowcaseImages(project.documents, slug, project.showcaseOrder);
    }
    return project;
  } catch (error) {
    console.warn(`Glio API detail request failed for "${slug}", trying fallback:`, error);
    const localProject = MOCK_PROJECTS.find((p) => p.slug === slug);
    return localProject || null;
  }
}
