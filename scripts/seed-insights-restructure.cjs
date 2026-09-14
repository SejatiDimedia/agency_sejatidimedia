// scripts/seed-insights-restructure.js
// Restrukturisasi Konten Insights SejatiDimedia
// - Refactor artikel Kenapa Laravel (hapus duplikat, masukkan ke seri)
// - Publish & perkaya artikel Next.js dan Client Portal
// - Buat 3 seri baru
// - Buat 2 artikel baru (SaaS, Security)
// - Set featured article

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SCRATCH = path.join(
  process.env.HOME,
  '.gemini/antigravity/brain/aad94f18-935e-4de4-bb95-545fa9e61e80/scratch'
);

function readContent(filename) {
  return fs.readFileSync(path.join(SCRATCH, filename), 'utf-8').trim();
}

async function main() {
  console.log('🚀 Starting Insights Restructuring...\n');

  // ============================================================
  // PHASE 1: Create 3 new series
  // ============================================================
  console.log('📚 Phase 1: Creating new series...');

  const seriesNextjs = await prisma.insightSeries.upsert({
    where: { slug: 'fullstack-modern-nextjs' },
    update: {},
    create: {
      slug: 'fullstack-modern-nextjs',
      titleId: 'Fullstack Modern dengan Next.js & React',
      titleEn: 'Modern Fullstack with Next.js & React',
      descriptionId: 'Panduan membangun aplikasi web enterprise menggunakan Next.js App Router, React Server Components, dan TypeScript — dari fondasi arsitektur hingga optimasi performa production.',
      descriptionEn: 'A comprehensive guide to building enterprise web applications with Next.js App Router, React Server Components, and TypeScript — from architecture foundations to production performance optimization.',
      category: 'Architecture',
      badge: 'ENGINEERING PLAYBOOK',
      isPublished: true,
      order: 1,
    },
  });
  console.log(`  ✅ Series: ${seriesNextjs.titleId} (${seriesNextjs.id})`);

  const seriesSaas = await prisma.insightSeries.upsert({
    where: { slug: 'membangun-saas-produk-first' },
    update: {},
    create: {
      slug: 'membangun-saas-produk-first',
      titleId: 'Panduan Membangun SaaS Produk-First',
      titleEn: 'Product-First SaaS Building Guide',
      descriptionId: 'Seri playbook komprehensif tentang strategi, arsitektur, dan operasi membangun produk SaaS — dari validasi ide, desain multi-tenant, billing & subscription, hingga growth di pasar Indonesia.',
      descriptionEn: 'A comprehensive playbook series on strategy, architecture, and operations for building SaaS products — from idea validation, multi-tenant design, billing & subscription, to growth in the Indonesian market.',
      category: 'Best Practices',
      badge: 'PRODUCT PLAYBOOK',
      isPublished: true,
      order: 2,
    },
  });
  console.log(`  ✅ Series: ${seriesSaas.titleId} (${seriesSaas.id})`);

  const seriesSecurity = await prisma.insightSeries.upsert({
    where: { slug: 'keamanan-hardening-aplikasi-web' },
    update: {},
    create: {
      slug: 'keamanan-hardening-aplikasi-web',
      titleId: 'Keamanan & Hardening Aplikasi Web',
      titleEn: 'Web Application Security & Hardening',
      descriptionId: 'Seri mendalam tentang ancaman keamanan nyata pada aplikasi web bisnis — dari injeksi SQL, XSS, CSRF, IDOR, hingga audit keamanan dan secure deployment checklist.',
      descriptionEn: 'An in-depth series on real security threats to business web applications — from SQL injection, XSS, CSRF, IDOR, to security audits and secure deployment checklists.',
      category: 'Security',
      badge: 'SECURITY SERIES',
      isPublished: true,
      order: 3,
    },
  });
  console.log(`  ✅ Series: ${seriesSecurity.titleId} (${seriesSecurity.id})`);

  // Get existing Laravel series ID
  const seriesLaravel = await prisma.insightSeries.findUnique({
    where: { slug: 'arsitektur-laravel-skala-bisnis' },
  });
  console.log(`  ✅ Existing Series: ${seriesLaravel.titleId} (${seriesLaravel.id})`);

  // ============================================================
  // PHASE 2: Refactor "Kenapa Laravel" article
  // ============================================================
  console.log('\n✏️  Phase 2: Refactoring "Kenapa Laravel" article...');

  const laravelRefactoredId = readContent('article_laravel_refactored_id.md');

  const laravelRefactoredEn = `Every year, new frameworks emerge claiming to be "faster", "more modern", or "the future of web development." But when we look at projects that actually run in production for years—handling thousands of transactions, hundreds of thousands of users, and rotating developer teams—Laravel remains one of the most chosen PHP frameworks.

As an agency handling projects of various scales, our clients frequently ask: "Why still use Laravel?" This article is the complete answer.

> **Note:** This article is the prologue to the *Enterprise Laravel Architecture at Scale* series. For deep technical analysis of architectural mistakes and solutions, continue to [Part 1: 5 Architectural Pitfalls in Laravel Applications](/insights/kesalahan-arsitektur-laravel-developer).

---

## 1. Development Speed That Directly Impacts Cost

Laravel is built with a *developer happiness* philosophy. Tasks that take days in other frameworks can be completed in hours with Laravel. A complete authentication system (login, register, password reset, email verification) can be set up in minutes with Laravel Breeze.

## 2. An Extremely Mature Ecosystem

Laravel is not just a framework—it's a complete, integrated ecosystem: Forge, Vapor, Nova, Horizon, Cashier, Sanctum, and Scout. As business needs evolve, new capabilities can be added as official packages without switching technology stacks.

## 3. Scalability: Myth vs Reality

Scalability is determined by **architecture**, not programming language alone. The keys to Laravel scalability include Eager Loading, Redis caching, Queue Workers, and Database Indexing.

> **Deep technical analysis** of each point above—including anti-pattern vs best practice code examples—is available in [Part 1: 5 Architectural Pitfalls in Laravel](/insights/kesalahan-arsitektur-laravel-developer).

## 4. Built-in Security That Reduces Human Error

Laravel handles many security aspects by default: CSRF protection, SQL injection prevention, bcrypt/Argon2 password hashing, and structured authorization with Policies.

## 5. Long-Term Maintenance

Laravel's consistent structure (MVC, naming conventions, standard folder structure) helps new developers understand a codebase in days, not weeks. Built-in testing support (PestPHP/PHPUnit) enables automated regression testing.

## Conclusion

Laravel may not be the most "hyped" topic in developer circles, but that's exactly what makes it strong: stable, mature, battle-tested, and backed by a continuously growing ecosystem.`;

  await prisma.insight.update({
    where: { slug: 'kenapa-laravel-masih-jadi-pilihan-terbaik-untuk-aplikasi-bisnis-di-2026' },
    data: {
      contentId: laravelRefactoredId,
      contentEn: laravelRefactoredEn,
      seriesId: seriesLaravel.id,
      seriesPart: 0,
      featured: false,
      excerptId: 'Di tengah banyaknya framework baru yang datang dan pergi, Laravel tetap bertahan sebagai pilihan solid untuk membangun aplikasi bisnis. Artikel ini membahas kekuatan ekosistem, keamanan bawaan, dan kemudahan maintenance jangka panjang yang membuat Laravel masih relevan hingga sekarang.',
      excerptEn: 'Amid the constant churn of new frameworks, Laravel remains a solid choice for building business applications. This article explores the ecosystem strength, built-in security, and long-term maintainability that keep Laravel relevant.',
      readTimeMinutes: 6,
      tags: ['Laravel', 'PHP', 'Ecosystem', 'Business'],
    },
  });
  console.log('  ✅ Refactored: Kenapa Laravel (linked to series as Part 0)');

  // ============================================================
  // PHASE 3: Set "5 Kesalahan" as featured
  // ============================================================
  console.log('\n⭐ Phase 3: Setting featured article...');

  // Reset all featured flags first
  await prisma.insight.updateMany({ data: { featured: false } });

  await prisma.insight.update({
    where: { slug: 'kesalahan-arsitektur-laravel-developer' },
    data: { featured: true },
  });
  console.log('  ✅ Featured: 5 Kesalahan Arsitektur Laravel Developer');

  // ============================================================
  // PHASE 4: Publish & enrich "Next.js" article
  // ============================================================
  console.log('\n📝 Phase 4: Publishing & enriching Next.js article...');

  const nextjsContentId = readContent('article_nextjs_id.md');

  const nextjsContentEn = `In modern web development, choosing a tech stack isn't about chasing buzzwords—it is about three business imperatives: blazing load times, long-term maintainability, and resilient type safety.

This is why **Next.js App Router** and **TypeScript** form the core foundation of SejatiDimedia's web platforms.

---

## 1. React Server Components: A Rendering Revolution

With Next.js App Router (v13.4+), components render on the server by default via React Server Components (RSC). This isn't traditional SSR—server components never ship JavaScript to the browser, resulting in dramatically smaller bundles.

## 2. End-to-End Type-Safety with TypeScript Strict

Developing medium-to-large business systems with vanilla JavaScript is a recipe for disaster. TypeScript strict mode locks all data contracts—from database schemas to API payloads to UI component props—ensuring errors are caught at compile time, not in production.

## 3. File-Based Routing & Nested Layouts

App Router uses an intuitive folder-based routing system. Every folder in \`app/\` becomes a route, and \`layout.tsx\` files wrap persistent UI (sidebar, header) without re-rendering during navigation.

## 4. Server Actions: Data Mutations Without API Routes

Server Actions allow server-side functions to be called directly from client components without manual API endpoints—with full TypeScript type safety.

## 5. Performance: Naturally Optimal Core Web Vitals

Next.js App Router architecture naturally optimizes LCP, INP, and CLS—the three Core Web Vitals that Google uses as SEO ranking factors.

## Conclusion

Next.js App Router with TypeScript is the architectural foundation designed for building enterprise web applications that are fast, secure, maintainable, and SEO-friendly by default.`;

  await prisma.insight.update({
    where: { slug: 'mengapa-kami-memilih-nextjs-app-router-typescript' },
    data: {
      isPublished: true,
      contentId: nextjsContentId,
      contentEn: nextjsContentEn,
      seriesId: seriesNextjs.id,
      seriesPart: 1,
      readTimeMinutes: 8,
      tags: ['Next.js', 'React', 'TypeScript', 'RSC', 'Web Performance'],
      excerptId: 'Evolusi teknologi frontend bergerak cepat. Inilah alasan mengapa arsitektur React Server Components dan TypeScript menjadi standar emas SejatiDimedia dalam membangun platform web enterprise.',
      excerptEn: 'Frontend tech evolves rapidly. Here is why React Server Components and strict TypeScript are SejatiDimedia\'s gold standard for building modern enterprise web apps.',
      publishedAt: new Date('2026-09-10'),
    },
  });
  console.log('  ✅ Published & enriched: Next.js App Router & TypeScript');

  // ============================================================
  // PHASE 5: Publish & enrich "Client Portal" article
  // ============================================================
  console.log('\n📝 Phase 5: Publishing & enriching Client Portal article...');

  const clientPortalContentId = `Keluhan nomor satu di industri pembuatan software bukanlah mahalnya biaya, melainkan: **"Developer-nya susah dihubungi setelah terima DP, dan progres tidak jelas sudah sampai mana."**

Fenomena *developer ghosting* ini merusak kepercayaan pemilik bisnis terhadap industri teknologi. Di **SejatiDimedia**, kami percaya bahwa kepercayaan dibangun bukan lewat janji manis, melainkan lewat **sistem kerja yang transparan**.

Oleh karena itu, kami membangun **Client Portal SejatiDimedia** sebagai pilar operasional kami.

---

## Mengapa Developer Ghosting Terjadi?

Berdasarkan pengalaman kami menangani puluhan klien dari berbagai sektor, ada 3 penyebab utama komunikasi terhenti antara vendor dan klien:

1. **Tidak ada sistem pelacakan progres.** Developer melaporkan secara lisan atau via chat yang mudah tenggelam. Klien tidak tahu posisi pekerjaan saat ini.
2. **Invoice dan pembayaran tidak terdokumentasi.** Klien merasa tidak aman karena tidak ada rekam jejak resmi kapan mereka membayar dan berapa sisa termin.
3. **Deliverables tersebar di mana-mana.** Link Figma, credential staging, dan file hasil pekerjaan dikirim via WhatsApp atau email yang sulit dicari kembali.

Masalah-masalah ini bukan masalah teknologi semata—ini masalah **operasional** dan **kepercayaan**.

---

## 3 Pilar Utama Client Portal Kami

### Pilar 1: Real-Time Milestone Kanban Board

Setiap proyek dipecah menjadi *milestone* (tahapan besar) dan *task* (tugas detail). Klien dapat memantau status setiap modul pekerjaan secara real-time di portal:

| Status | Deskripsi |
|--------|-----------|
| **To Do** | Milestone sudah dirancang, menunggu eksekusi |
| **In Progress** | Tim sedang mengerjakan—progress terlihat di task list |
| **Done** | Selesai, deliverable sudah diunggah dan siap diunduh |

Klien tidak perlu bertanya "sudah sampai mana?" lewat WhatsApp—cukup buka portal dan semuanya terlihat.

### Pilar 2: Transparent Billing & Invoicing

Setiap invoice tercatat resmi di portal lengkap dengan:
- Nomor invoice unik (INV-202608-001)
- Rincian item pekerjaan dan harga satuan
- Status pembayaran (Draft → Sent → Paid)
- Bukti transfer yang diunggah langsung oleh klien
- Tanggal jatuh tempo dan riwayat pembayaran

Tidak ada biaya tersembunyi. Klien dan kami punya *single source of truth* yang sama tentang finansial proyek.

### Pilar 3: Dokumentasi & Deliverables Terpusat

Semua hasil pekerjaan—desain UI, source code repository, credential staging, dokumen teknis—tersimpan aman dalam satu dashboard terlindungi dengan autentikasi per-klien.

Saat proyek selesai atau handover ke tim internal klien, semua aset sudah terdokumentasi rapi dan bisa diakses kapan saja tanpa harus menghubungi kami terlebih dahulu.

---

## Bagaimana Portal Membangun Kepercayaan

Transparansi bukan sekadar fitur tambahan—bagi kami, transparansi adalah **produk inti**. Berikut dampak nyata yang kami rasakan sejak menerapkan Client Portal:

| Aspek | Sebelum Portal | Setelah Portal |
|-------|---------------|----------------|
| **Laporan Progres** | Klien bertanya via WA, jawaban tertunda | Klien cek sendiri kapan saja |
| **Dispute Pembayaran** | "Saya sudah bayar termin 2" — tidak ada bukti terpusat | Riwayat invoice dan bukti transfer tercatat resmi |
| **Handover Proyek** | File tersebar di Drive, email, WA | Semua terpusat di portal, siap diunduh |
| **Tingkat Kepuasan Klien** | Bervariasi | Meningkat signifikan — repeat order naik |
| **Waktu Komunikasi Admin** | 2–3 jam/hari per proyek | < 30 menit/hari per proyek |

---

## Stack Teknologi di Balik Portal

Client Portal SejatiDimedia dibangun di atas fondasi teknologi yang sama dengan yang kami gunakan untuk proyek klien enterprise:

- **Next.js App Router** — React Server Components untuk rendering cepat
- **TypeScript** — Type-safety end-to-end
- **Prisma + PostgreSQL (Neon)** — Database relasional dengan schema yang ketat
- **AWS S3** — Penyimpanan file deliverable yang aman dan scalable
- **Pusher** — Real-time notification ketika ada update dari tim
- **Resend** — Email notification untuk invoice dan aktivasi akun

Ini bukan portal "demo" atau template WordPress—ini sistem production yang kami gunakan sendiri setiap hari untuk mengelola proyek klien nyata.

---

## Kesimpulan

Membangun software bukan hanya soal menulis kode yang berjalan. Ini soal **membangun kepercayaan** antara vendor dan klien melalui sistem yang transparan, terdokumentasi, dan profesional.

Jika Anda pernah mengalami vendor yang menghilang setelah menerima pembayaran, atau proyek yang tidak jelas progresnya, kami memahami frustrasi tersebut. Client Portal SejatiDimedia adalah jawaban konkret kami terhadap masalah tersebut.

> *Transparansi bukan sekadar nilai perusahaan yang dituliskan di website—ini adalah sistem kerja yang kami bangun, gunakan, dan buktikan setiap hari.*`;

  const clientPortalContentEn = `The number one complaint in custom software development isn't pricing—it's communication breakdown: "The developer vanished after the deposit, and we have no idea what's being built."

At **SejatiDimedia**, we engineered our dedicated **Client Portal** to eliminate guesswork and foster total transparency.

---

## Why Developer Ghosting Happens

Three root causes: no progress tracking system, undocumented invoices and payments, and deliverables scattered across WhatsApp and email.

## 3 Core Pillars of Our Client Portal

### Pillar 1: Real-Time Milestone Kanban Board
Every project is broken into milestones and tasks. Clients can monitor the status of every work module in real-time—no need to ask "how far along are we?"

### Pillar 2: Transparent Billing & Invoicing
Every invoice is formally recorded with unique invoice numbers, itemized pricing, payment status tracking, and uploaded payment proofs. No hidden costs.

### Pillar 3: Centralized Documentation & Deliverables
All work outputs—UI designs, source code repositories, staging credentials, technical documents—are stored securely in one authenticated dashboard.

---

## How the Portal Builds Trust

Transparency isn't a bonus feature—it's our **core product**. Since implementing the Client Portal, client satisfaction has increased significantly, payment disputes have virtually disappeared, and project handovers are seamless.

## Conclusion

Building software isn't just about writing working code. It's about building **trust** between vendor and client through a system that is transparent, documented, and professional.`;

  await prisma.insight.update({
    where: { slug: 'mendesain-client-portal-transparan-mencegah-ghosting' },
    data: {
      isPublished: true,
      contentId: clientPortalContentId,
      contentEn: clientPortalContentEn,
      readTimeMinutes: 6,
      tags: ['Client Portal', 'Transparency', 'Project Management', 'Agency', 'UX'],
      excerptId: 'Kekhawatiran terbesar pemilik bisnis saat menyewa vendor software adalah hilangnya komunikasi. Simak bagaimana SejatiDimedia membangun Client Portal untuk menghadirkan transparansi total.',
      excerptEn: 'The biggest fear when hiring software agencies is radio silence. Discover how SejatiDimedia engineered a Client Portal for radical transparency.',
      publishedAt: new Date('2026-09-05'),
    },
  });
  console.log('  ✅ Published & enriched: Client Portal Transparan');

  // ============================================================
  // PHASE 6: Create new "SaaS Multi-Tenant" article
  // ============================================================
  console.log('\n🆕 Phase 6: Creating SaaS Multi-Tenant article...');

  const saasContentId = readContent('article_saas_id.md');
  const saasContentEn = readContent('article_saas_en.md');

  await prisma.insight.upsert({
    where: { slug: 'dari-ide-ke-mvp-arsitektur-saas-multi-tenant' },
    update: {
      contentId: saasContentId,
      contentEn: saasContentEn,
    },
    create: {
      slug: 'dari-ide-ke-mvp-arsitektur-saas-multi-tenant',
      titleId: 'Dari Ide ke MVP: Merancang Arsitektur SaaS Multi-Tenant yang Siap Scale',
      titleEn: 'From Idea to MVP: Designing a Scalable Multi-Tenant SaaS Architecture',
      excerptId: 'Membangun SaaS bukan sekadar deploy aplikasi lalu menambahkan login. Artikel ini membahas 3 pendekatan arsitektur multi-tenant, isolasi data, billing, dan strategi MVP untuk founder & engineer.',
      excerptEn: 'Building SaaS is more than deploying an app with login. This article covers 3 multi-tenant architecture approaches, data isolation, billing, and MVP strategy for founders & engineers.',
      contentId: saasContentId,
      contentEn: saasContentEn,
      category: 'Best Practices',
      tags: ['SaaS', 'Multi-Tenant', 'Architecture', 'MVP', 'Billing'],
      coverImage: '/images/insights/laravel_architecture_cover.jpg',
      readTimeMinutes: 9,
      authorName: 'Timur Dian Radha Sejati',
      authorRole: 'Lead Software Engineer · SejatiDimedia',
      authorAvatar: '/images/author_timur_dian.jpg',
      isPublished: true,
      featured: false,
      seriesId: seriesSaas.id,
      seriesPart: 1,
      publishedAt: new Date('2026-09-12'),
    },
  });
  console.log('  ✅ Created: SaaS Multi-Tenant (Part 1 of SaaS series)');

  // ============================================================
  // PHASE 7: Create new "Security" article
  // ============================================================
  console.log('\n🆕 Phase 7: Creating Security article...');

  const securityContentId = readContent('article_security_id.md');
  const securityContentEn = readContent('article_security_en.md');

  await prisma.insight.upsert({
    where: { slug: 'anatomi-serangan-celah-keamanan-aplikasi-web-bisnis' },
    update: {
      contentId: securityContentId,
      contentEn: securityContentEn,
    },
    create: {
      slug: 'anatomi-serangan-celah-keamanan-aplikasi-web-bisnis',
      titleId: 'Anatomi Serangan: 5 Celah Keamanan Kritis yang Sering Diabaikan di Aplikasi Web Bisnis',
      titleEn: 'Anatomy of an Attack: 5 Critical Security Vulnerabilities Often Overlooked in Business Web Apps',
      excerptId: 'Aplikasi web bisnis yang menangani pembayaran dan data pelanggan sering kali memiliki celah keamanan mendasar yang diabaikan. Artikel ini membedah 5 kerentanan kritis beserta pencegahannya.',
      excerptEn: 'Business web apps handling payments and customer data often harbor fundamental security vulnerabilities. This article dissects 5 critical weaknesses with prevention strategies.',
      contentId: securityContentId,
      contentEn: securityContentEn,
      category: 'Security',
      tags: ['Security', 'SQL Injection', 'XSS', 'IDOR', 'Authentication'],
      coverImage: '/images/insights/laravel_architecture_cover.jpg',
      readTimeMinutes: 8,
      authorName: 'Timur Dian Radha Sejati',
      authorRole: 'Lead Software Engineer · SejatiDimedia',
      authorAvatar: '/images/author_timur_dian.jpg',
      isPublished: true,
      featured: false,
      seriesId: seriesSecurity.id,
      seriesPart: 1,
      publishedAt: new Date('2026-09-08'),
    },
  });
  console.log('  ✅ Created: Security article (Part 1 of Security series)');

  // ============================================================
  // FINAL: Summary
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 Final Verification\n');

  const allSeries = await prisma.insightSeries.findMany({
    where: { isPublished: true },
    include: { insights: { where: { isPublished: true }, select: { slug: true, seriesPart: true } } },
    orderBy: { order: 'asc' },
  });

  const allArticles = await prisma.insight.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, titleId: true, category: true, featured: true, seriesPart: true, seriesId: true },
  });

  console.log(`Total Published Series: ${allSeries.length}`);
  allSeries.forEach((s, i) => {
    console.log(`  ${i + 1}. [${s.category}] ${s.titleId} (${s.insights.length} articles)`);
    s.insights.forEach((a) => console.log(`     - Part ${a.seriesPart}: ${a.slug}`));
  });

  console.log(`\nTotal Published Articles: ${allArticles.length}`);
  allArticles.forEach((a, i) => {
    const star = a.featured ? ' ⭐ FEATURED' : '';
    console.log(`  ${i + 1}. [${a.category}] ${a.titleId}${star}`);
  });

  const categories = [...new Set(allArticles.map((a) => a.category))];
  console.log(`\nCategory Diversity: ${categories.join(', ')}`);

  console.log('\n✅ Insights restructuring complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
