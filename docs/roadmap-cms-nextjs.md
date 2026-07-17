# Roadmap: Rebuild Website ke Next.js + Tailwind + CMS

## 1. Ringkasan Proyek

**Kondisi sekarang:** Website statis (copywriting hardcoded di kode).
**Target:** Website baru dengan Next.js + Tailwind CSS, dilengkapi CMS supaya konten copywriting bisa diubah tanpa deploy ulang, plus fitur **Project Showcase** untuk menampilkan portfolio/case study.

---

## 2. Tech Stack yang Direkomendasikan

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSG/ISR bawaan → performa tinggi, SEO bagus, cocok untuk site company-profile/portfolio |
| Styling | **Tailwind CSS v4** | Cepat develop, konsisten, mudah maintain design system |
| CMS | **Sanity.io** (rekomendasi utama) atau **Payload CMS** (alternatif self-hosted) | Lihat perbandingan di bawah |
| Hosting Frontend | **Vercel** (free tier) | Native integration dengan Next.js, auto preview deploy |
| File/Asset Storage | Bawaan CMS (Sanity Assets / Payload + Cloudflare R2) | Tidak perlu setup storage terpisah |
| Deployment CMS Studio | Sanity Studio (embed di `/studio`) atau Payload Admin (built-in) | Gratis, satu repo |

---

## 3. Perbandingan Opsi CMS + Database (Gratis, Performa Bagus, Bisa Handle File)

### Opsi A — Sanity.io ⭐ (Rekomendasi utama)
- **Gratis tier:** 3 user, 10.000 dokumen, 5GB asset (gambar/file), CDN gambar bawaan dengan on-the-fly transform (resize, crop, format webp otomatis).
- **Kelebihan:** Studio (admin panel) di-generate otomatis dari schema code (TypeScript), realtime, sangat cepat karena pakai CDN global, integrasi resmi dengan Next.js (`next-sanity`).
- **Kekurangan:** Bukan database SQL tradisional (document-based/NoSQL), kurang cocok kalau butuh relasi data kompleks.
- **Cocok untuk:** Company profile, landing page, portfolio/project showcase — persis kebutuhan Anda.

### Opsi B — Payload CMS (self-hosted, TypeScript-native)
- **Database:** Postgres via **Neon** (free tier 0.5GB) atau MongoDB Atlas (free 512MB).
- **File storage:** Vercel Blob (free 1GB) atau Cloudflare R2 (free 10GB — paling besar & tanpa biaya egress).
- **Kelebihan:** Full-code control, admin UI otomatis dari schema, native App Router support (Payload 3 jalan langsung di dalam Next.js project — satu deploy).
- **Kekurangan:** Setup lebih teknis, perlu maintain hosting sendiri (walau bisa satu Vercel project).

### Opsi C — Strapi / Directus (open source)
- Bagus juga tapi butuh hosting server terpisah (tidak semudah Sanity/Payload untuk deploy full-gratis di serverless).

**Kesimpulan:** Kalau prioritas **paling cepat setup + gratis + performa terbaik untuk gambar/file project showcase** → **Sanity**. Kalau prioritas **full ownership data & mau semuanya dalam satu Next.js repo** → **Payload + Neon Postgres + Cloudflare R2**.

---

## 4. Struktur Content Model (Schema)

| Content Type | Field Utama |
|---|---|
| `siteSettings` | Logo, nama brand, SEO default, social links |
| `page` (Home, About, Services, dst.) | Hero title, hero subtitle, section blocks (rich text/copywriting), images |
| `project` (Showcase) | Title, slug, cover image, gallery, deskripsi, kategori/tag, client, tahun, link demo, status (draft/published) |
| `testimonial` (opsional) | Nama, jabatan, kutipan, foto |
| `seo` (per page) | Meta title, meta description, OG image |

---

## 5. Roadmap Eksekusi

### Fase 0 — Persiapan (1–2 hari)
- Audit & kumpulkan seluruh copywriting yang ada sekarang (manual copy dari site lama, karena tidak bisa di-scrape otomatis)
- Finalisasi content model / schema di atas
- Setup repo, pilih CMS (Sanity/Payload)

### Fase 1 — Setup Fondasi (2–3 hari)
- Init Next.js + Tailwind + TypeScript
- Setup design system (warna, tipografi, spacing) sesuai brand
- Setup CMS project (schema, studio route)

### Fase 2 — Integrasi CMS ↔ Frontend (3–5 hari)
- Fetch data dari CMS pakai GROQ (Sanity) atau REST/Local API (Payload)
- Implement ISR (revalidate) supaya update konten CMS langsung tampil tanpa full redeploy
- Buat komponen dinamis untuk tiap section (hero, about, services, dll.)

### Fase 3 — Fitur Project Showcase (3–5 hari)
- Halaman listing project (grid/gallery) dengan filter kategori
- Halaman detail project (gambar, deskripsi, gallery)
- Upload & optimasi gambar via CMS asset pipeline

### Fase 4 — SEO & Performa (2 hari)
- Meta tags dinamis per halaman, sitemap.xml, robots.txt
- Image optimization (`next/image` + CDN dari CMS)
- Lighthouse audit (target skor 90+)

### Fase 5 — Migrasi Konten (1–2 hari)
- Input ulang seluruh copywriting existing ke CMS (hasil audit Fase 0)
- Review & proofread bersama tim

### Fase 6 — Deployment (1 hari)
- Deploy frontend ke Vercel
- Deploy/aktifkan CMS Studio
- Setup custom domain

### Fase 7 — QA & Launch (2 hari)
- Testing cross-browser & mobile
- Testing alur update konten dari CMS (pastikan non-teknis bisa pakai)
- Go live

### Fase 8 — Handover & Training
- Buat panduan singkat cara edit konten & tambah project baru di CMS
- Training singkat ke tim yang akan maintain konten

**Estimasi total: ± 3–4 minggu** (tergantung kompleksitas desain & jumlah halaman)

---

## 6. Update Arsitektur Final (Sanity + Data Project dari Glio/Prisma)

Setelah diskusi lanjutan, berikut keputusan arsitektur final:

- **Copywriting/konten halaman** → dikelola via **Sanity CMS**
- **Data Projects (showcase)** → ditarik dari **Glio** (aplikasi agency management internal yang datanya disimpan via Prisma ORM di database)

### Kenapa Tidak Connect Prisma Langsung dari Landing Page
Landing page (repo terpisah) **tidak boleh** install Prisma Client dan connect langsung ke database Glio, karena:
- Harus share `DATABASE_URL` (connection string) ke project lain → risiko keamanan besar
- Landing page jadi tergantung struktur tabel internal Glio → gampang rusak kalau schema berubah
- Berisiko ke-expose data internal (klien, kontrak, dsb.) yang seharusnya privat

### Solusi: API Layer di Atas Prisma
Glio (backend, yang sudah pakai Prisma) menyediakan **endpoint API publik read-only**, contoh:

```
GET /api/public/projects           → list semua project (published saja)
GET /api/public/projects/[slug]    → detail 1 project
```

Endpoint ini di dalam kode Glio query database via Prisma seperti biasa, tapi **cuma return field yang memang layak publik** (title, slug, cover image, deskripsi, kategori/tag, tahun, link demo) — bukan field internal (harga, klien detail, status kontrak, dll).

```
┌─────────────────────┐        ┌──────────────────────┐
│   Landing Page        │        │        Glio            │
│  (Next.js + Tailwind) │──GET──▶│  (Next.js + Prisma)    │
│  - Fetch data Sanity  │        │  /api/public/projects  │
│  - Fetch data Glio    │        └──────────┬─────────────┘
└──────────┬─────────────┘                  ▼
           ▼                          PostgreSQL/MySQL
   ┌───────────────┐                  (data project)
   │  Sanity CMS    │
   │ (copywriting)  │
   └───────────────┘
```

### Skenario A — Kamu Punya Akses ke Backend Glio
1. Tambah route handler baru di Glio: `app/api/public/projects/route.ts`
2. Query via Prisma, `select` hanya field publik, filter `where: { status: "published" }`
3. Tambah proteksi ringan: header `x-api-key` dicek server-side (simpan key di env var kedua project)
4. Tambah `Cache-Control` header di response untuk bantu performa
5. Di landing page, fetch endpoint ini pakai **ISR** (`next: { revalidate: 60 }` atau sesuai kebutuhan update)

### Skenario B — Belum Ada Akses / Endpoint Belum Ada
1. Koordinasi dengan pemegang backend Glio, minta dibuatkan endpoint publik seperti di atas (kirimkan spek field yang dibutuhkan)
2. Sementara development frontend berjalan duluan pakai **data dummy/mock** dengan struktur sama, supaya development landing page tidak terhambat menunggu backend
3. Begitu endpoint publik siap, tinggal ganti data source dari mock → real API, tanpa ubah komponen UI

### Sumber Data: Model `Project` di Prisma Schema Glio (MongoDB)

Berdasarkan schema Prisma Glio yang sebenarnya, project showcase diambil dari model **`Project`**, difilter `isPublic: true`. Field sensitif (budget, clientId, credentials, invoices, payments, members, comments, milestones) **tidak** di-expose ke publik.

### Endpoint di Glio — List Projects

```ts
// app/api/public/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PUBLIC_PROJECT_FIELDS = {
  slug: true, name: true, summary: true, summaryId: true, summaryEn: true,
  bannerImage: true, thumbnail: true, technologies: true, categories: true,
  status: true, startDate: true, endDate: true, order: true,
} as const;

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = await prisma.project.findMany({
    where: { isPublic: true },
    select: PUBLIC_PROJECT_FIELDS,
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
```

### Endpoint di Glio — Detail Project (by slug)

```ts
// app/api/public/projects/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const project = await prisma.project.findFirst({
    where: { slug: params.slug, isPublic: true },
    select: {
      slug: true, name: true, summary: true, summaryId: true, summaryEn: true,
      description: true, descriptionId: true, descriptionEn: true,
      bannerImage: true, thumbnail: true, technologies: true, categories: true,
      status: true, startDate: true, endDate: true,
      links: { select: { title: true, url: true, icon: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json(project, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
```

Tambahkan `PUBLIC_API_KEY=<random-string-panjang>` di `.env` Glio.

> CORS tidak jadi masalah karena landing page fetch dari server (Server Component/ISR), bukan dari browser langsung.

> **Perlu ditambahkan di dashboard Glio:** toggle publish/unpublish (`isPublic`) di form edit project — kalau belum ada UI-nya, karena default value-nya `false`.

### Update: Scope ke 1 Owner (userId) — Karena Glio Multi-Tenant

Karena Glio kemungkinan dipakai banyak user/agency dalam 1 database yang sama, endpoint publik **wajib** di-scope ke `userId` akun kamu supaya project agency lain tidak ikut ke-expose ke landing page.

`userId` akun kamu (didapat dari MongoDB Atlas → collection `User`):
```
69b0a3e1b6e1f3f79e6707a4
```

Simpan sebagai env var di Glio (jangan hardcode langsung di kode, dan jangan commit `.env` ke git):
```
GLIO_OWNER_USER_ID=69b0a3e1b6e1f3f79e6707a4
```

### Endpoint di Glio — List Projects (final, scoped)

```ts
// app/api/public/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OWNER_USER_ID = process.env.GLIO_OWNER_USER_ID!;

const PUBLIC_PROJECT_FIELDS = {
  slug: true, name: true, summary: true, summaryId: true, summaryEn: true,
  bannerImage: true, thumbnail: true, technologies: true, categories: true,
  status: true, startDate: true, endDate: true, order: true,
} as const;

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { isPublic: true, userId: OWNER_USER_ID },
    select: PUBLIC_PROJECT_FIELDS,
    orderBy: { order: "asc" },
  });

  return NextResponse.json(projects, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
```

### Endpoint di Glio — Detail Project (final, scoped)

```ts
// app/api/public/projects/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OWNER_USER_ID = process.env.GLIO_OWNER_USER_ID!;

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { slug: params.slug, isPublic: true, userId: OWNER_USER_ID },
    select: {
      slug: true, name: true, summary: true, summaryId: true, summaryEn: true,
      description: true, descriptionId: true, descriptionEn: true,
      bannerImage: true, thumbnail: true, technologies: true, categories: true,
      status: true, startDate: true, endDate: true,
      links: { select: { title: true, url: true, icon: true } },
    },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  return NextResponse.json(project, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
```

> Kode fetch di landing page (`lib/api/glio-projects.ts`) **tidak perlu berubah** — scoping user cukup dilakukan di sisi Glio (server), landing page tinggal terima data yang sudah difilter.

### Contoh Kode Fetch di Landing Page (Next.js)

```ts
// lib/api/glio-projects.ts
export type Project = {
  slug: string;
  name: string;
  summary?: string;
  summaryId?: string;
  summaryEn?: string;
  description?: string;
  descriptionId?: string;
  descriptionEn?: string;
  bannerImage?: string;
  thumbnail?: string;
  technologies: string[];
  categories: string[];
  status: "COMPLETE" | "ONGOING";
  startDate: string;
  endDate?: string;
  links?: { title: string; url: string; icon?: string }[];
};

const GLIO_API_URL = process.env.GLIO_API_URL!; // https://glio.vercel.app/api/public
const GLIO_API_KEY = process.env.GLIO_API_KEY!;

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${GLIO_API_URL}/projects`, {
    headers: { "x-api-key": GLIO_API_KEY },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Gagal fetch projects dari Glio");
  return res.json();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const res = await fetch(`${GLIO_API_URL}/projects/${slug}`, {
    headers: { "x-api-key": GLIO_API_KEY },
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal fetch project detail");
  return res.json();
}
```

---

## 7. Langkah Selanjutnya
1. Cek akses ke backend Glio (lihat panduan cek di atas) → tentukan Skenario A atau B
2. Kalau Skenario A: mulai buat endpoint `/api/public/projects` di Glio sesuai contoh di atas
3. Kalau Skenario B: siapkan data mock dulu, kirim spek field ke pemegang backend Glio
4. Konfirmasi pilihan CMS konten: tetap **Sanity**
5. Kirim/paste copywriting yang ada sekarang supaya bisa direvisi
6. Kalau ada referensi desain (Figma/screenshot situs sejenis), sertakan juga
