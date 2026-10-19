# Panduan Lengkap: Membangun Personal Portfolio Software Engineer di GitHub Pages

Dokumen panduan arsitektur dan langkah implementasi (*vibe coding*) untuk membangun website portofolio personal yang di-hosting di **GitHub Pages (`github.io`)**, dengan integrasi data master dari **Glio CMS** dan sinkronisasi status **Proyek Unggulan (Featured Projects)** dari dashboard **SejatiDimedia**.

---

## 1. Arsitektur & Alur Data

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
 Daftar Slug / Detail Unggulan)              ▼
            │                    ┌─────────────────────────┐
            └───────────────────►│      WEB PERSONAL       │
                                 │  (username.github.io)   │
                                 └─────────────────────────┘
```

### Keuntungan Arsitektur:
1. **Decoupled**: Website personal tetap berjalan mandiri langsung dari Glio.
2. **Single Control**: Mengganti 6 Proyek Unggulan cukup lewat dashboard `/portal/portfolio` di SejatiDimedia, kedua website langsung tersinkronisasi otomatis.
3. **CORS Enabled**: Endpoint SejatiDimedia sudah mendukung browser fetch dari domain luar (`Access-Control-Allow-Origin: *`).

---

## 2. Spesifikasi Endpoint SejatiDimedia

Endpoint ini sudah aktif di server SejatiDimedia:

- **URL:** `https://sejatidimedia.com/api/public/featured-projects`
- **Method:** `GET` (Mendukung preflight `OPTIONS`)
- **Query Params (Opsional):**
  - `?includeProjects=true` *(default)*: Mengembalikan daftar slug sekaligus data lengkap 6 proyek unggulan.
  - `?includeProjects=false`: Hanya mengembalikan array string slug.
- **Contoh Response JSON:**
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
      "summary": "Platform orkestrasi armada logistik cerdas...",
      "bannerImage": "https://...",
      "thumbnail": "https://...",
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

## 3. Step-by-Step Vibe Coding

### Langkah 1: Setup Proyek (Vite + React + TypeScript + Tailwind)
Jalankan di terminal Anda:

```bash
# 1. Inisialisasi proyek
npm create vite@latest personal-portfolio -- --template react-ts
cd personal-portfolio

# 2. Install dependensi UI & Icon
npm install
npm install lucide-react clsx tailwindcss @tailwindcss/vite
```

---

### Langkah 2: Setup Environment Variables
Buat file `.env` di root proyek personal:

```env
VITE_GLIO_API_URL=https://api.glio.id/v1
VITE_GLIO_API_KEY=your_glio_api_key_here
VITE_SEJATIDIMEDIA_API=https://sejatidimedia.com/api/public/featured-projects
```

---

### Langkah 3: Buat Data Fetcher Service
Buat file `src/services/portfolioService.ts`:

```ts
// src/services/portfolioService.ts

const GLIO_URL = import.meta.env.VITE_GLIO_API_URL;
const GLIO_KEY = import.meta.env.VITE_GLIO_API_KEY;
const FEATURED_API = import.meta.env.VITE_SEJATIDIMEDIA_API || "https://sejatidimedia.com/api/public/featured-projects";

const glioHeaders = {
  "x-api-key": GLIO_KEY,
  "Content-Type": "application/json",
};

// 1. Ambil 6 Proyek Unggulan dari SejatiDimedia
export async function getFeaturedProjects() {
  try {
    const res = await fetch(FEATURED_API);
    const data = await res.json();
    return data.featuredProjects || [];
  } catch (error) {
    console.error("Gagal memuat featured projects dari SejatiDimedia:", error);
    return [];
  }
}

// 2. Ambil Semua Riwayat Pengalaman Kerja dari Glio
export async function getExperiences() {
  try {
    const res = await fetch(`${GLIO_URL}/experiences`, { headers: glioHeaders });
    return res.json();
  } catch (error) {
    console.error("Gagal memuat experiences dari Glio:", error);
    return [];
  }
}

// 3. Ambil Semua Sertifikat dari Glio
export async function getCertificates() {
  try {
    const res = await fetch(`${GLIO_URL}/certificates`, { headers: glioHeaders });
    return res.json();
  } catch (error) {
    console.error("Gagal memuat certificates dari Glio:", error);
    return [];
  }
}

// 4. Ambil Daftar Keahlian / Skills dari Glio
export async function getSkills() {
  try {
    const res = await fetch(`${GLIO_URL}/skills`, { headers: glioHeaders });
    return res.json();
  } catch (error) {
    console.error("Gagal memuat skills dari Glio:", error);
    return [];
  }
}
```

---

### Langkah 4: Susun Komponen UI Utama (`src/App.tsx`)
Struktur satu halaman (*single-page portfolio*):

```tsx
// src/App.tsx
import React, { useEffect, useState } from "react";
import { getFeaturedProjects, getExperiences, getCertificates, getSkills } from "./services/portfolioService";
import { Briefcase, Award, Code2, Star, ExternalLink, Github, Linkedin, Mail } from "lucide-react";

export default function App() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      const [feat, exp, cert, skl] = await Promise.all([
        getFeaturedProjects(),
        getExperiences(),
        getCertificates(),
        getSkills(),
      ]);
      setFeaturedProjects(feat);
      setExperiences(exp);
      setCertificates(cert);
      setSkills(skl);
      setLoading(false);
    }
    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="animate-pulse text-sm font-mono text-slate-400">Loading portfolio data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <header className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-mono mb-4">
          Available for Engineering Opportunities
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
          Timur Dian Radha Sejati
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
          Software Engineer & Systems Consultant spesialis arsitektur backend berkinerja tinggi,
          multi-tenant SaaS, integrasi AI/LLM, dan aplikasi web modern.
        </p>
        <div className="flex gap-4">
          <a href="https://github.com/..." target="_blank" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/..." target="_blank" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:your-email@example.com" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* 2. FEATURED PROJECTS (SINKRON DARI SEJATIDIMEDIA) */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Proyek Unggulan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div key={project.slug} className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img src={project.bannerImage || project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-white text-lg mb-2">{project.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{project.summary}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                  {project.technologies?.slice(0, 4).map((tech: string) => (
                    <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WORK EXPERIENCES */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-8">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Pengalaman Kerja</h2>
        </div>
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h3 className="font-bold text-white text-lg">{exp.role || exp.title}</h3>
                <span className="text-xs font-mono text-slate-400">{exp.period || exp.duration}</span>
              </div>
              <p className="text-sm text-blue-400 font-medium mb-3">{exp.company}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SKILLS & TECHNOLOGIES */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-8">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Keahlian & Teknologi</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill, idx) => (
            <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium">
              {skill.name || skill}
            </span>
          ))}
        </div>
      </section>

      {/* 5. CERTIFICATES & AWARDS */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-8">
          <Award className="w-5 h-5 text-violet-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Sertifikasi & Lisensi</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">{cert.name || cert.title}</h3>
                <p className="text-xs text-slate-400">{cert.issuer} • {cert.year || cert.date}</p>
              </div>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" className="text-slate-400 hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} Timur Dian Radha Sejati. Hosted on GitHub Pages.
      </footer>
    </div>
  );
}
```

---

## 4. Setup Deploy GitHub Pages (`github.io`)

### 1. Konfigurasi `vite.config.ts`
Pastikan properti `base` sudah sesuai:
- Jika repo bernama `username.github.io`: gunakan `base: '/'`
- Jika repo bernama `portfolio`: gunakan `base: '/portfolio/'`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
});
```

### 2. Buat Workflow GitHub Actions
Buat file di `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio to GitHub Pages

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

### 3. Masukkan Secrets di Repositori GitHub
1. Buka Repositori GitHub Anda &rarr; **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
2. Klik **New repository secret**:
   - Name: `GLIO_API_URL` &rarr; Value: URL API Glio Anda.
   - Name: `GLIO_API_KEY` &rarr; Value: API Key Glio Anda.
3. Buka **Settings** &rarr; **Pages** &rarr; Pada bagian **Build and deployment**, ubah **Source** menjadi **GitHub Actions**.

---

## 5. Checklist Verifikasi Akhir

- [ ] Push kode web personal ke branch `main`.
- [ ] Buka tab **Actions** di GitHub dan pastikan workflow deploy berstatus hijau (sukses).
- [ ] Kunjungi `https://username.github.io` &rarr; Verifikasi data Glio dan 6 Proyek Unggulan muncul.
- [ ] Buka `/portal/portfolio` di SejatiDimedia, ganti salah satu bintang (⭐) proyek unggulan.
- [ ] Refresh website personal Anda di `github.io` &rarr; Proyek unggulan otomatis terupdate secara instan!
