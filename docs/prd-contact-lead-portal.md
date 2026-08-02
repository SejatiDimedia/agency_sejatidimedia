# Product Requirements Document (PRD)
## Integrasi Contact Form, Lead Management, & Client Portal
**Produk:** SejatiDimedia — Internal Project Management & Client Portal
**Versi:** 1.0 (MVP)
**Tanggal:** 2 Agustus 2026
**Pemilik Produk:** Timur Dian Radha Sejati (Founder & Lead Developer)
**Status:** Draft untuk review internal

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang
Saat ini, alur dari calon klien mengisi form contact di website hingga menjadi klien aktif dilakukan secara manual (komunikasi lewat WhatsApp/email terpisah). Hal ini menimbulkan:
- Tidak ada sistem pencatatan lead yang terpusat.
- Onboarding klien tidak konsisten dan memakan waktu.
- Klien tidak punya visibilitas terhadap progress proyek tanpa harus bertanya langsung.

### 1.2 Tujuan Produk
Membangun sistem terintegrasi yang menghubungkan:
1. **Contact/Inquiry Form** di website publik → masuk sebagai **Lead**.
2. **Internal Lead & Project Management** untuk admin (Founder) mengelola lead hingga proyek aktif.
3. **Client Portal** agar klien dapat memantau progress proyek secara mandiri dan transparan.

### 1.3 Tujuan Bisnis (Business Goals)
- Meningkatkan kredibilitas & profesionalisme agency di mata calon klien enterprise.
- Mengurangi effort komunikasi manual pasca-deal (status update, request dokumen, dsb).
- Membangun data historis leads untuk analisis konversi ke depannya.

### 1.4 Non-Tujuan (Out of Scope untuk MVP)
- Real-time chat antara klien dan admin di dalam portal.
- Sistem invoicing/pembayaran otomatis terintegrasi payment gateway.
- Notifikasi real-time (WebSocket) — cukup polling/refresh manual di MVP.
- Multi-admin/multi-role tim (MVP diasumsikan single admin/founder).
- Mobile app native — cukup responsive web.

---

## 2. User Persona

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Admin (Founder)** | Timur, mengelola seluruh lead & proyek sendirian | Efisiensi triase lead, kontrol penuh atas status proyek, minim noise dari spam |
| **Prospect** | Calon klien yang baru mengisi form, belum deal | Direspons cepat, proses jelas |
| **Klien Aktif** | Klien yang sudah deal & proyek berjalan | Transparansi progress, akses mudah tanpa ribet, komunikasi terstruktur |

---

## 3. User Flow Utama

1. Prospect mengisi form contact di landing page → data tervalidasi & difilter spam otomatis.
2. Lead baru masuk ke dashboard admin dengan status `new`.
3. Admin review lead, komunikasi lanjutan terjadi di luar sistem (WA/email/call) — sistem hanya mencatat status.
4. Ketika deal disepakati (harga/DP dibayar), admin mengubah status lead menjadi `won` melalui dashboard.
5. Sistem otomatis:
   a. Membuat akun user untuk klien.
   b. Membuat entitas project terkait.
   c. Mengirim email onboarding berisi magic link aktivasi.
6. Klien klik magic link → login ke Client Portal.
7. Admin melakukan mapping task/milestone di internal dashboard.
8. Klien memantau progress, milestone, dan status task dari Client Portal secara read-only + bisa memberi komentar/feedback.

---

## 4. Functional Requirements

### 4.1 Public Contact Form
| ID | Requirement | Prioritas |
|---|---|---|
| FR-1.1 | Form menangkap: nama, email, jenis layanan, skala proyek, detail kebutuhan | Must |
| FR-1.2 | Validasi format email & panjang minimum pesan di client & server side | Must |
| FR-1.3 | Honeypot field tersembunyi untuk deteksi bot | Must |
| FR-1.4 | Rate limiting submit per IP (maks. 3x/jam) | Must |
| FR-1.5 | Filter domain email disposable/sekali pakai | Should |
| FR-1.6 | Submission otomatis membuat record `Lead` dengan status `new` atau `spam` | Must |

### 4.2 Lead Management (Admin)
| ID | Requirement | Prioritas |
|---|---|---|
| FR-2.1 | Admin dapat melihat daftar leads dengan filter status (`new`, `reviewing`, `won`, `lost`, `spam`) | Must |
| FR-2.2 | Admin dapat mengubah status lead secara manual | Must |
| FR-2.3 | Admin dapat menambahkan internal notes pada lead (tidak terlihat klien) | Should |
| FR-2.4 | Saat status diubah ke `won`, sistem trigger otomatis: create user + create project + kirim email onboarding | Must |
| FR-2.5 | Lead dengan status `spam`/`lost` tidak muncul di dashboard project utama | Must |

### 4.3 Autentikasi & Onboarding Klien

**Model: Hybrid (Opsi B)** — magic link untuk aktivasi pertama & fallback permanen, password bersifat opsional untuk login rutin berikutnya.

| ID | Requirement | Prioritas |
|---|---|---|
| FR-3.1 | Sistem generate token aktivasi unik (hashed di database), expiry 24-48 jam | Must |
| FR-3.2 | Email onboarding dikirim otomatis berisi magic link aktivasi saat project pertama klien dibuat | Must |
| FR-3.3 | Klik magic link memvalidasi token, membuat sesi login, redirect ke portal | Must |
| FR-3.4 | Setelah login pertama via magic link, portal menawarkan (tidak wajib) form "Buat password" agar login berikutnya lebih cepat | Should |
| FR-3.5 | Jika klien set password, login rutin selanjutnya dapat menggunakan email + password standar | Should |
| FR-3.6 | Magic link tetap tersedia selamanya sebagai alternatif login (bukan hanya untuk aktivasi awal) — berlaku sebagai pengganti flow "lupa password" | Must |
| FR-3.7 | Halaman login menyediakan 2 opsi: "Login dengan password" (jika sudah pernah diset) dan "Kirim link login ke email" (magic link) | Must |
| FR-3.8 | Token magic link (baik aktivasi maupun login ulang) yang sudah dipakai/expired tidak bisa digunakan ulang (one-time use) | Must |
| FR-3.9 | Rate limiting pada endpoint aktivasi, permintaan magic link, dan login password untuk cegah brute force | Must |
| FR-3.10 | Jika klien mengajukan project kedua/berikutnya dengan email yang sudah terdaftar, sistem tidak membuat akun baru — project baru ditautkan ke akun (`user_id`) yang sama sehingga history project sebelumnya tetap dapat diakses | Must |

### 4.4 Client Portal (Sisi Klien)
| ID | Requirement | Prioritas |
|---|---|---|
| FR-4.1 | Klien melihat daftar proyek miliknya beserta status keseluruhan | Must |
| FR-4.2 | Klien melihat progress bar & daftar milestone (dengan status: todo/in progress/done) | Must |
| FR-4.3 | Klien melihat daftar task di tiap milestone (read-only) | Should |
| FR-4.4 | Klien dapat mengunduh file deliverable yang diupload admin | Should |
| FR-4.5 | Klien dapat memberi komentar/feedback pada milestone tertentu | Could (post-MVP) |
| FR-4.6 | Klien tidak dapat melihat data internal (notes, estimasi biaya dev, dsb) | Must |

### 4.5 Project Management (Sisi Admin)
| ID | Requirement | Prioritas |
|---|---|---|
| FR-5.1 | Admin dapat membuat/edit/hapus project, milestone, dan task | Must |
| FR-5.2 | Admin dapat melihat kanban/board semua project aktif | Should |
| FR-5.3 | Admin dapat upload file deliverable terkait milestone | Should |
| FR-5.4 | Admin dapat melihat log aktivitas (audit trail) sederhana | Could (post-MVP) |

### 4.6 Notifikasi Email
| ID | Requirement | Prioritas |
|---|---|---|
| FR-6.1 | Sistem mengirim email otomatis ke klien saat status milestone berubah menjadi "selesai" (done) | Must |
| FR-6.2 | Sistem mengirim email otomatis ke klien saat milestone baru dimulai (status berubah ke "in progress") | Should |
| FR-6.3 | Email notifikasi berisi: nama milestone, status baru, ringkasan singkat, link langsung ke portal | Must |
| FR-6.4 | Admin dapat menonaktifkan notifikasi otomatis per project (opsional, untuk kasus khusus) | Could (post-MVP) |
| FR-6.5 | Frekuensi email dibatasi agar tidak spam ke klien — hanya trigger pada perubahan status milestone, bukan setiap perubahan task kecil | Must |

---

## 5. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Keamanan** | Password/token di-hash (bcrypt/argon2); session via httpOnly cookie; HTTPS wajib; validasi server-side di semua endpoint (Zod); row-level authorization check di setiap query klien |
| **Performa** | Waktu load dashboard/portal < 2 detik pada koneksi standar |
| **Skalabilitas** | Desain database mendukung penambahan multi-admin/role di iterasi berikutnya tanpa migrasi besar |
| **Ketersediaan** | Uptime hosting mengikuti SLA provider (Vercel + Neon/Supabase) |
| **Aksesibilitas** | Portal responsive, dapat diakses dari mobile browser |
| **Compliance** | Data pribadi klien (email, nama) disimpan sesuai praktik dasar perlindungan data |
| **Retensi Data** | Lead dengan status `spam` atau `lost` dihapus otomatis setelah **7 hari** sejak status ditetapkan (scheduled job/cron harian). Lead `won` (menjadi klien) disimpan permanen sebagai bagian dari riwayat proyek |

---

## 6. Arsitektur & Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Konsisten dengan stack website utama, satu codebase untuk landing page + admin + portal |
| Styling | Tailwind CSS | Konsisten dengan desain existing |
| Backend | Next.js Route Handlers | Menghindari overhead maintain server terpisah di tahap MVP |
| ORM & Database | Prisma + PostgreSQL | Query ter-parameterisasi otomatis (aman dari SQL injection), migration terkelola |
| Autentikasi | Auth.js (NextAuth) custom provider (magic link) | Flow onboarding smooth, minim friksi untuk klien awam |
| Validasi | Zod | Validasi input konsisten client & server |
| Email Transactional | Resend / Postmark | Deliverability tinggi untuk email onboarding & notifikasi |
| Hosting | Vercel | HTTPS otomatis, env variable terenkripsi, cocok untuk stack Next.js |
| Database Hosting | Neon / Supabase (managed Postgres) | Backup otomatis, connection pooling, tanpa perlu maintain server sendiri |

### 6.1 Entity Relationship (ringkas)

```
LEADS ||--o| USERS      : "converts_to (saat deal)"
USERS ||--o{ PROJECTS   : owns
PROJECTS ||--o{ MILESTONES : has
MILESTONES ||--o{ TASKS : contains

LEADS       (id, name, email, message, status, created_at)
USERS       (id, lead_id FK, email, password_hash, activation_token, activated_at)
PROJECTS    (id, user_id FK, name, status, start_date, end_date)
MILESTONES  (id, project_id FK, title, status, due_date)
TASKS       (id, milestone_id FK, title, is_done, assigned_to)
```

**Catatan implementasi:**
- `LEADS.status`: enum `new` → `spam` / `reviewing` → `won` / `lost`
- `PROJECTS.status`: siklus terpisah — `active` → `in_progress` → `completed` → `maintenance`
- `USERS.lead_id` nullable (mendukung pembuatan user manual di luar form, misal klien lama)
- `USERS.email` diberi **unique constraint** — mencegah akun ganda saat klien lama mengajukan project baru (lihat FR-3.10). Satu `user` bisa memiliki banyak `PROJECTS`, sehingga history project sebelumnya tetap utuh
- `USERS.password_hash` nullable — klien belum tentu set password (login hybrid, lihat bagian 4.3), tetap bisa login via magic link selamanya

---

## 7. Metrik Keberhasilan (Success Metrics)

| Metrik | Target Awal |
|---|---|
| Waktu rata-rata dari lead `won` hingga klien aktivasi portal | < 24 jam |
| Persentase lead spam yang berhasil difilter otomatis | > 90% dari total spam |
| Jumlah komunikasi manual (WA/email) terkait "cek progress" turun | Penurunan signifikan (dibandingkan sebelum ada portal) |
| Tingkat aktivasi klien (klik magic link → login sukses) | > 80% dari email terkirim |

---

## 8. Roadmap Implementasi (MVP-first)

| Fase | Scope | Estimasi |
|---|---|---|
| **Fase 1** | Contact form + anti-spam layer + tabel `leads` + dashboard admin sederhana (list & ubah status) | 1-2 minggu |
| **Fase 2** | Trigger otomatis: create user + project saat status `won` + email onboarding + magic link auth | 1 minggu |
| **Fase 3** | Client portal read-only: daftar project, progress milestone, status task + notifikasi email saat milestone berubah status + scheduled job hapus lead spam/lost setelah 7 hari | 1-2 minggu |
| **Fase 4** | Fitur tambahan: upload/download file deliverable, komentar klien | Iterasi berikutnya |
| **Fase 5** | Analytics dasar (conversion rate leads), audit trail, multi-role admin | Iterasi berikutnya |

---

## 9. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Filter spam tidak efektif, dashboard tetap penuh noise | Medium | Kombinasi honeypot + rate limit + validasi email; monitor & tuning berkala |
| Magic link disalahgunakan (token bocor) | High | Expiry pendek, token hashed di DB, one-time use, rate limiting endpoint aktivasi |
| Scope creep — fitur portal terus bertambah sebelum MVP selesai | Medium | Roadmap fase ketat, fitur "Could have" ditunda ke iterasi berikutnya |
| Overhead maintenance portal mengganggu waktu development proyek klien | Medium | Batasi fitur MVP seminim mungkin, review beban kerja tiap fase |

---

## 10. Lampiran

### 10.1 Referensi Diagram
- Pipeline status lead → active project (lihat diagram alur pada dokumentasi teknis terpisah)
- ERD lengkap (lihat bagian 6.1)

### 10.2 Keputusan Terhadap Open Questions (Resolved — 2 Agustus 2026)

| Pertanyaan | Keputusan |
|---|---|
| Notifikasi email tambahan saat milestone selesai/berubah status? | **Ya, diperlukan.** Lihat FR-6.1 s/d FR-6.5. Trigger utama: milestone menjadi "selesai"; opsional saat "in progress" dimulai |
| Apakah komentar klien perlu SLA respons? | **Tidak ada SLA formal di MVP.** Cukup set ekspektasi umum di email onboarding (misal "respons 1-2 hari kerja"), tanpa sistem SLA tracking otomatis. Dipertimbangkan ulang jika volume komentar meningkat |
| Kebijakan retensi data lead `spam`/`lost`? | **Dihapus otomatis setelah 7 hari** sejak status ditetapkan, via scheduled job harian. Lead `won` disimpan permanen |

---

*Dokumen ini adalah draft awal (v1.0) dan dapat berkembang seiring proses development dan feedback lebih lanjut.*
