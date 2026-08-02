# 🗺️ Panduan Eksekusi Roadmap PRD
## Mapping Fase → Skills → Agents → Perintah

> Dokumen ini adalah **cheatsheet** untuk mengerjakan PRD `prd-contact-lead-portal.md` per fase.
> Cukup copy-paste perintah di bawah ke chat AI, sesuaikan jika perlu.

---

## Fase 1 — Contact Form + Anti-Spam + Lead Dashboard Admin
**Estimasi:** 1-2 minggu

### 📌 Scope
| ID | Task | Prioritas |
|---|---|---|
| FR-1.1 | Form tangkap: nama, email, jenis layanan, skala proyek, detail kebutuhan | Must |
| FR-1.2 | Validasi email & panjang minimum (client + server side, Zod) | Must |
| FR-1.3 | Honeypot field tersembunyi untuk deteksi bot | Must |
| FR-1.4 | Rate limiting submit per IP (maks 3x/jam) | Must |
| FR-1.5 | Filter domain email disposable | Should |
| FR-1.6 | Submission otomatis buat record Lead (status `new` / `spam`) | Must |
| FR-2.1 | Admin: list leads dengan filter status | Must |
| FR-2.2 | Admin: ubah status lead manual | Must |
| FR-2.3 | Admin: tambah internal notes pada lead | Should |
| FR-2.5 | Lead `spam`/`lost` tidak muncul di dashboard project | Must |

### 🧠 Skills yang dipakai
```
@gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md
```

### 🤖 Agent yang relevan
```
@gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md
```

### 📝 Perintah (copy-paste)
```
Kerjakan Fase 1 dari PRD @docs/prd-contact-lead-portal.md

Ikuti konvensi dari:
- @gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md

Referensi agent pattern:
- @gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md

Scope Fase 1:
1. Setup Prisma ORM + koneksi ke PostgreSQL (Neon)
2. Buat schema/model Lead sesuai skill lead-management
3. Update contact form yang sudah ada di landing page agar submit ke POST /api/leads
4. Implementasi anti-spam: honeypot, rate limiting, filter email disposable, validasi Zod
5. Buat halaman admin /dashboard/leads — list leads dengan filter status + ubah status + internal notes
6. Pastikan lead spam/lost tidak muncul di dashboard utama
```

### ✅ Cara verifikasi setelah selesai
- [ ] Form submit berhasil → lead muncul di database
- [ ] Honeypot terisi → lead ditandai SPAM
- [ ] Submit >3x/jam dari IP sama → ditolak (rate limit)
- [ ] Email disposable → ditolak
- [ ] Admin bisa lihat, filter, dan ubah status lead
- [ ] `npm run build` sukses tanpa error

---

## Fase 2 — Trigger Otomatis (WON) + Auth Magic Link + Email Onboarding
**Estimasi:** 1 minggu

### 📌 Scope
| ID | Task | Prioritas |
|---|---|---|
| FR-2.4 | Trigger saat status `WON`: create user + create project + kirim email | Must |
| FR-3.1 | Generate token aktivasi (hashed, expiry 48 jam) | Must |
| FR-3.2 | Email onboarding otomatis berisi magic link | Must |
| FR-3.3 | Validasi magic link → create session → redirect portal | Must |
| FR-3.4 | Form opsional "Buat password" setelah login pertama | Should |
| FR-3.5 | Login email + password (jika sudah set password) | Should |
| FR-3.6 | Magic link sebagai fallback login permanen | Must |
| FR-3.7 | Halaman login: 2 opsi (password + magic link) | Must |
| FR-3.8 | Token one-time use (tidak bisa dipakai ulang) | Must |
| FR-3.9 | Rate limiting di semua auth endpoint | Must |
| FR-3.10 | Email sudah terdaftar → tautkan ke akun existing | Must |

### 🧠 Skills yang dipakai
```
@gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md
@gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md
```

### 🤖 Agent yang relevan
```
@gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md
```

### 📝 Perintah (copy-paste)
```
Kerjakan Fase 2 dari PRD @docs/prd-contact-lead-portal.md

Ikuti konvensi dari:
- @gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md
- @gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md

Referensi agent pattern:
- @gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md

Scope Fase 2:
1. Buat schema/model User + MagicToken di Prisma sesuai skill client-portal-auth
2. Buat schema/model Project di Prisma
3. Implementasi trigger otomatis saat admin ubah lead status ke WON:
   - Cek apakah user dengan email sudah ada → jika ya, tautkan project ke akun existing
   - Jika belum, create User baru
   - Create Project baru
   - Generate magic token (hash SHA-256), simpan ke MagicToken table
   - Kirim email onboarding via Resend/Postmark
4. Buat halaman /auth/login dengan 2 opsi: password login + magic link
5. Buat endpoint validasi magic link (GET /api/auth/activate)
6. Buat endpoint set password opsional (POST /api/auth/set-password)
7. Setup Auth.js (NextAuth) dengan custom provider
8. Rate limiting di semua auth endpoint
```

### ✅ Cara verifikasi setelah selesai
- [ ] Admin ubah lead ke WON → user + project terbuat otomatis
- [ ] Email onboarding terkirim dengan magic link
- [ ] Klik magic link → session terbuat → redirect ke /portal
- [ ] Magic link expired / sudah dipakai → ditolak
- [ ] Login dengan password berfungsi (setelah set password)
- [ ] Email sudah terdaftar → project baru terkait akun lama
- [ ] `npm run build` sukses tanpa error

---

## Fase 3 — Client Portal + Notifikasi Email + Cron Retensi Data
**Estimasi:** 1-2 minggu

### 📌 Scope
| ID | Task | Prioritas |
|---|---|---|
| FR-4.1 | Klien lihat daftar proyek + status keseluruhan | Must |
| FR-4.2 | Progress bar + daftar milestone (todo/in_progress/done) | Must |
| FR-4.3 | Daftar task per milestone (read-only) | Should |
| FR-4.6 | Data internal tidak terlihat klien | Must |
| FR-5.1 | Admin CRUD project, milestone, task | Must |
| FR-5.2 | Admin kanban/board semua project aktif | Should |
| FR-6.1 | Email otomatis saat milestone → done | Must |
| FR-6.2 | Email otomatis saat milestone → in_progress | Should |
| FR-6.3 | Email berisi: nama milestone, status, link portal | Must |
| FR-6.5 | Frekuensi email terbatas (hanya perubahan milestone) | Must |
| — | Cron job hapus lead spam/lost setelah 7 hari | Must |

### 🧠 Skills yang dipakai
```
@gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md
@gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md
```

### 🤖 Agent yang relevan
```
@gemini-code-skills-agents/.gemini/agents/client-portal-builder.md
@gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md
```

### 📝 Perintah (copy-paste)
```
Kerjakan Fase 3 dari PRD @docs/prd-contact-lead-portal.md

Ikuti konvensi dari:
- @gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md
- @gemini-code-skills-agents/.gemini/skills/lead-management/SKILL.md

Referensi agent pattern:
- @gemini-code-skills-agents/.gemini/agents/client-portal-builder.md
- @gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md

Scope Fase 3:
1. Buat halaman portal klien:
   - /portal — daftar project milik klien + progress %
   - /portal/projects/[id] — detail project + milestone timeline + task list (read-only)
   - /portal/settings — profile + set/change password
2. Pastikan SETIAP query di portal difilter userId dari session (row-level auth)
3. Buat admin CRUD untuk milestone dan task:
   - Milestone: title, status (todo/in_progress/done), due_date
   - Task: title, is_done, assignment
4. Implementasi notifikasi email:
   - Kirim email saat milestone status → done
   - Opsional: kirim email saat milestone → in_progress
   - Email berisi nama milestone, status baru, link ke portal
5. Buat scheduled job/cron harian: hapus lead dengan status SPAM/LOST yang statusSetAt > 7 hari
6. Data internal (notes, cost, assigned_to) TIDAK BOLEH terexpose ke portal klien
```

### ✅ Cara verifikasi setelah selesai
- [ ] Klien login → lihat project miliknya saja (bukan milik klien lain)
- [ ] Progress bar + milestone timeline tampil dengan benar
- [ ] Task list read-only (klien tidak bisa edit)
- [ ] Admin CRUD milestone/task berfungsi
- [ ] Email terkirim saat milestone berubah status
- [ ] Lead SPAM/LOST > 7 hari terhapus otomatis
- [ ] Data internal tidak bocor ke portal
- [ ] `npm run build` sukses tanpa error

---

## Fase 4 — File Deliverable + Komentar Klien *(Post-MVP)*
**Estimasi:** Iterasi berikutnya

### 📌 Scope
| ID | Task | Prioritas |
|---|---|---|
| FR-4.4 | Klien download file deliverable dari admin | Should |
| FR-4.5 | Klien komentar/feedback pada milestone | Could |
| FR-5.3 | Admin upload file deliverable per milestone | Should |

### 🧠 Skills yang dipakai
```
@gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md
```

### 🤖 Agent yang relevan
```
@gemini-code-skills-agents/.gemini/agents/client-portal-builder.md
@gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md
```

### 📝 Perintah (copy-paste)
```
Kerjakan Fase 4 dari PRD @docs/prd-contact-lead-portal.md

Ikuti konvensi dari:
- @gemini-code-skills-agents/.gemini/skills/client-portal-auth/SKILL.md

Referensi agent pattern:
- @gemini-code-skills-agents/.gemini/agents/client-portal-builder.md
- @gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md

Scope Fase 4:
1. Admin bisa upload file deliverable per milestone (S3/Vercel Blob/Supabase Storage)
2. Klien bisa download file deliverable dari portal (authenticated, ownership check)
3. Klien bisa komentar/feedback pada milestone tertentu
4. File download harus melalui API route yang cek ownership (bukan direct URL)
```

---

## Fase 5 — Analytics + Audit Trail + Multi-Role *(Post-MVP)*
**Estimasi:** Iterasi berikutnya

### 📌 Scope
| ID | Task | Prioritas |
|---|---|---|
| FR-5.4 | Audit trail sederhana | Could |
| — | Analytics: conversion rate leads | Could |
| — | Multi-admin/multi-role | Could |

### 🧠 Skills yang dipakai
```
Semua skills yang ada (lead-management + client-portal-auth)
```

### 🤖 Agent yang relevan
```
@gemini-code-skills-agents/.gemini/agents/admin-dashboard-builder.md
```

### 📝 Perintah (copy-paste)
```
Kerjakan Fase 5 dari PRD @docs/prd-contact-lead-portal.md

Ikuti konvensi dari semua skills yang ada.

Scope Fase 5:
1. Dashboard analytics: conversion rate lead (new → won), jumlah lead per bulan, rata-rata waktu konversi
2. Audit trail: log setiap perubahan status lead, milestone, dan task (siapa, kapan, dari status apa ke apa)
3. Multi-role admin: tambah role MANAGER/DEVELOPER, permission matrix per role
```

---

## 📋 Ringkasan Cepat (Quick Reference)

| Fase | Skills | Agents | Keyword Perintah |
|---|---|---|---|
| **1** | `lead-management` | `admin-dashboard-builder` | "Fase 1: form + anti-spam + admin lead list" |
| **2** | `client-portal-auth` + `lead-management` | `admin-dashboard-builder` | "Fase 2: trigger WON + magic link + auth" |
| **3** | `client-portal-auth` + `lead-management` | `client-portal-builder` + `admin-dashboard-builder` | "Fase 3: portal klien + notifikasi + cron" |
| **4** | `client-portal-auth` | `client-portal-builder` + `admin-dashboard-builder` | "Fase 4: upload/download file + komentar" |
| **5** | Semua | `admin-dashboard-builder` | "Fase 5: analytics + audit trail + multi-role" |

---

> 💡 **Tips:** Gunakan perintah `/goal` untuk task besar agar AI bekerja menyeluruh tanpa berhenti di tengah jalan.
