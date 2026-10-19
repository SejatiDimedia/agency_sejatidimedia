# Panduan Integrasi Data: Personal Portfolio Software Engineer di GitHub Pages

Dokumen spesifikasi teknis lengkap mengenai arsitektur data, kontrak endpoint API, TypeScript Interfaces, payload response aktual, dan data service layer untuk website portofolio personal yang di-hosting di **GitHub Pages (`github.io`)**.

---

## 1. Arsitektur & Daftar Endpoint

Website personal Anda mengonsumsi data dari dua sumber:
1. **Glio Headless CMS** &rarr; Master konten personal (*Experiences*, *Certificates*, *Skills*, dan *Projects*).
2. **SejatiDimedia API** &rarr; State Provider untuk 6 Proyek Unggulan (*Featured Projects*) yang disinkronkan secara realtime dari dashboard portal agency.

```
┌────────────────────────────────────────────────────────┐
│                       GLIO CMS                         │
│  (Master Konten: Experiences, Certs, Skills, Projects) │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
 (Tarik Proyek & NDA)             (Tarik Master Data: Exp,
            │                      Certs, Skills, Projects)
            ▼                                │
┌───────────────────────┐                    │
│     SejatiDimedia     │                    │
│  (Admin Portal & KV)  │                    │
│   - Mark Unggulan (⭐)│                    │
└───────────┬───────────┘                    │
            │                                │
(Endpoint Ringan CORS:                       │
 6 Proyek Unggulan Terpilih)                 ▼
            │                    ┌─────────────────────────┐
            └───────────────────►│      WEB PERSONAL       │
                                 │  (username.github.io)   │
                                 └─────────────────────────┘
```

### Ringkasan Endpoint

| No | Sumber | Endpoint URL | Method | Auth / Header | Fungsi |
|---|---|---|---|---|---|
| 1 | **Glio** | `https://glio.vercel.app/api/public/experiences` | `GET` | `x-api-key: <KEY>` | Riwayat pengalaman kerja |
| 2 | **Glio** | `https://glio.vercel.app/api/public/certificates` | `GET` | `x-api-key: <KEY>` | Daftar sertifikasi & lisensi |
| 3 | **Glio** | `https://glio.vercel.app/api/public/skills` | `GET` | `x-api-key: <KEY>` | Daftar keahlian & kategori skill |
| 4 | **Glio** | `https://glio.vercel.app/api/public/projects` | `GET` | `x-api-key: <KEY>` | Seluruh master proyek portofolio |
| 5 | **SejatiDimedia** | `https://sejatidimedia.com/api/public/featured-projects` | `GET` | *None (Public + CORS)* | 6 Proyek Unggulan sinkron dari portal |

---

## 2. Environment Variables

Buat file `.env` pada root project website personal Anda:

```env
# Glio Headless CMS Configuration
VITE_GLIO_API_URL=https://glio.vercel.app/api/public
VITE_GLIO_API_KEY=your_glio_api_key_here

# SejatiDimedia Featured Projects Sync API (CORS Enabled)
VITE_SEJATIDIMEDIA_API=https://sejatidimedia.com/api/public/featured-projects
```

---

## 3. Kontrak Data & TypeScript Interfaces

Buat file definisi tipe data di `src/types/portfolio.ts`:

```ts
// src/types/portfolio.ts

// ==========================================
// 1. WORK EXPERIENCES
// ==========================================
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
  descriptionId?: string;
  descriptionEn?: string;
  location?: string;
  locationId?: string;
  locationEn?: string;
}

// ==========================================
// 2. CERTIFICATES & LICENSES
// ==========================================
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  order: number;
}

// ==========================================
// 3. SKILLS & TECH STACK
// ==========================================
export interface Skill {
  id: string;
  name: string;
  nameId?: string | null;
  nameEn?: string | null;
  category: string; // e.g. "Programming Languages", "Frameworks & Libraries", "Tools & Platforms"
  level: number;    // Nilai skala 0 - 100
  order: number;
}

// ==========================================
// 4. PROJECTS (PORTFOLIO & FEATURED)
// ==========================================
export interface ProjectLink {
  title: string;
  url: string;
  icon?: string | null;
}

export interface ProjectDocument {
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
  status: "COMPLETE" | "ONGOING";
  startDate: string;
  endDate?: string | null;
  order: number;
  description?: string | null;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  links?: ProjectLink[];
  documents?: ProjectDocument[];
  isProfessional?: boolean;
  isNda?: boolean;
}

// ==========================================
// 5. SEJATIDIMEDIA FEATURED API RESPONSE
// ==========================================
export interface FeaturedProjectsResponse {
  success: boolean;
  count: number;
  featuredSlugs: string[];
  featuredProjects: Project[];
  updatedAt: string;
}
```

---

## 4. Contoh Response Data Aktual (Live Payloads)

### A. Endpoint Experience (`GET /api/public/experiences`)
```json
[
  {
    "id": "69b180de2f58d4552a7d8b5a",
    "company": "Sejati Dimedia · Part-time",
    "position": "Independent Software Engineer",
    "startDate": "Desember 2025",
    "endDate": "",
    "description": "",
    "descriptionId": "● Mengelola siklus pengembangan software (SDLC) secara mandiri dari perancangan arsitektur, penyusunan roadmap produk, hingga penentuan tech stack.\n● Merancang dan membangun platform berbasis web SaaS multi-tenant...\n● Mengintegrasikan pipeline LLM/AI API ke dalam aplikasi web...",
    "descriptionEn": "● Independently managed the full software development lifecycle (SDLC)...\n● Architected and integrated LLM/AI API pipelines into web applications...",
    "location": "Balikpapan",
    "locationId": "",
    "locationEn": ""
  }
]
```

### B. Endpoint Certificate (`GET /api/public/certificates`)
```json
[
  {
    "id": "6a05c8aad3f744a52c4763f9",
    "title": "Fullstack Javascript Developer",
    "issuer": "BuildWithAngga",
    "issueDate": "May 2020",
    "credentialUrl": null,
    "fileUrl": "https://utfs.io/f/f2a699b9-b2a5-49d6-a874-a1fb3f35a8d4-5vgcsg.pdf",
    "fileName": "full-stack-javascript-developer-timur-dian-radha-sejati.pdf",
    "fileType": "application/pdf",
    "descriptionId": null,
    "descriptionEn": null,
    "order": 1
  }
]
```

### C. Endpoint Skills (`GET /api/public/skills`)
```json
[
  {
    "id": "69b0a4c78daa4c9b10b00d20",
    "name": "PHP",
    "nameId": null,
    "nameEn": null,
    "category": "Programming Languages",
    "level": 85,
    "order": 0
  },
  {
    "id": "69b0a4d58daa4c9b10b00d21",
    "name": "TypeScript",
    "category": "Programming Languages",
    "level": 90,
    "order": 1
  }
]
```

### D. Endpoint Featured Projects (`GET https://sejatidimedia.com/api/public/featured-projects`)
```json
{
  "success": true,
  "count": 6,
  "featuredSlugs": [
    "absensi-hris-app-face-recognition--gps",
    "supportsense-ai",
    "routeforce",
    "flash-sale--event-ticketing-platform",
    "telemedhub---telemedicine--smart-pharmacy",
    "katsira-point-of-sales"
  ],
  "featuredProjects": [
    {
      "slug": "routeforce",
      "name": "RouteForce",
      "summary": "Platform orkestrasi armada logistik cerdas berbasis AI routing.",
      "bannerImage": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200",
      "thumbnail": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
      "technologies": ["Next.js", "TypeScript", "RabbitMQ", "PostgreSQL"],
      "categories": ["Enterprise", "Logistics"],
      "status": "COMPLETE",
      "startDate": "2025-06-01",
      "order": 1
    }
  ],
  "updatedAt": "2026-10-19T02:08:24.123Z"
}
```

---

## 5. Implementasi Data Service Layer

Buat file client data service di `src/services/portfolioService.ts`:

```ts
// src/services/portfolioService.ts
import {
  WorkExperience,
  Certificate,
  Skill,
  Project,
  FeaturedProjectsResponse,
} from "../types/portfolio";

const GLIO_URL = import.meta.env.VITE_GLIO_API_URL || "https://glio.vercel.app/api/public";
const GLIO_KEY = import.meta.env.VITE_GLIO_API_KEY || "";
const FEATURED_API =
  import.meta.env.VITE_SEJATIDIMEDIA_API ||
  "https://sejatidimedia.com/api/public/featured-projects";

const glioHeaders = {
  "x-api-key": GLIO_KEY,
  "Content-Type": "application/json",
};

/**
 * 1. Mengambil 6 Proyek Unggulan yang disinkronkan dari SejatiDimedia.
 * Otomatis mengembalikan data Project lengkap siap pakai.
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(FEATURED_API);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data: FeaturedProjectsResponse = await res.json();
    return data.featuredProjects || [];
  } catch (error) {
    console.warn("Fallback: Gagal memuat featured projects dari SejatiDimedia:", error);
    return [];
  }
}

/**
 * 2. Mengambil seluruh proyek portofolio master dari Glio CMS.
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${GLIO_URL}/projects`, { headers: glioHeaders });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Gagal memuat master projects dari Glio:", error);
    return [];
  }
}

/**
 * 3. Mengambil seluruh riwayat pengalaman kerja dari Glio CMS.
 */
export async function getWorkExperiences(): Promise<WorkExperience[]> {
  try {
    const res = await fetch(`${GLIO_URL}/experiences`, { headers: glioHeaders });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Gagal memuat experiences dari Glio:", error);
    return [];
  }
}

/**
 * 4. Mengambil seluruh sertifikat dari Glio CMS (diurutkan berdasarkan 'order').
 */
export async function getCertificates(): Promise<Certificate[]> {
  try {
    const res = await fetch(`${GLIO_URL}/certificates`, { headers: glioHeaders });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data: Certificate[] = await res.json();
    return data.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Gagal memuat certificates dari Glio:", error);
    return [];
  }
}

/**
 * 5. Mengambil seluruh skills dari Glio CMS dan mengelompokkannya per kategori.
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${GLIO_URL}/skills`, { headers: glioHeaders });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data: Skill[] = await res.json();
    return data.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Gagal memuat skills dari Glio:", error);
    return [];
  }
}

/**
 * Helper: Mengelompokkan skill array menjadi Record kategori
 * Output: { "Programming Languages": [Skill, Skill], "Frameworks": [Skill] }
 */
export function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

/**
 * 6. Master Aggregator: Mengambil seluruh data secara paralel (Promise.all).
 */
export async function getCompletePortfolioData() {
  const [featuredProjects, allProjects, experiences, certificates, skills] =
    await Promise.all([
      getFeaturedProjects(),
      getAllProjects(),
      getWorkExperiences(),
      getCertificates(),
      getSkills(),
    ]);

  // Pisahkan proyek reguler (selain yang masuk ke featured)
  const featuredSlugSet = new Set(featuredProjects.map((p) => p.slug));
  const regularProjects = allProjects.filter((p) => !featuredSlugSet.has(p.slug));

  return {
    featuredProjects,
    regularProjects,
    allProjects,
    experiences,
    certificates,
    skills,
    groupedSkills: groupSkillsByCategory(skills),
  };
}
```

---

## 6. Contoh Pemakaian di State Management / Custom Hook

Anda bisa menggunakan custom hook sederhana untuk mengambil data di komponen Anda:

```ts
// src/hooks/usePortfolioData.ts
import { useState, useEffect } from "react";
import { getCompletePortfolioData } from "../services/portfolioService";

export function usePortfolioData() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCompletePortfolioData>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCompletePortfolioData()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load data");
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
}
```

---

## 7. Konfigurasi Hosting GitHub Pages (`github.io`)

### 1. `vite.config.ts`
Sesuaikan nama subpath base repository:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Gunakan '/' jika nama repo adalah: username.github.io
  // Gunakan '/nama-repo/' jika nama repo adalah repository proyek biasa
  base: '/',
  plugins: [react()],
});
```

### 2. Workflow GitHub Actions (`.github/workflows/deploy.yml`)
Workflow otomatis yang melakukan instalasi dependensi, build, dan publish ke GitHub Pages setiap ada commit di branch `main`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Project
        run: npm run build
        env:
          VITE_GLIO_API_URL: ${{ secrets.GLIO_API_URL }}
          VITE_GLIO_API_KEY: ${{ secrets.GLIO_API_KEY }}
          VITE_SEJATIDIMEDIA_API: "https://sejatidimedia.com/api/public/featured-projects"

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Setup Secrets di GitHub
1. Masuk ke **Settings** repository &rarr; **Secrets and variables** &rarr; **Actions**.
2. Tambahkan Repository Secrets:
   - `GLIO_API_URL` : `https://glio.vercel.app/api/public`
   - `GLIO_API_KEY` : *(API Key Glio Anda)*
3. Masuk ke **Settings** repository &rarr; **Pages** &rarr; Ubah Source menjadi **GitHub Actions**.
