# Claude Code Setup — Landing Page + Sanity + Glio Project

Skills dan subagents ini dibuat spesifik untuk project ini: **Next.js + Tailwind landing page**, **Sanity CMS** untuk copywriting, dan **Glio public API** (Prisma/MongoDB) untuk data project showcase.

## Cara Instal

1. Copy folder `.claude/` ini ke root repo landing page kamu (merge kalau sudah ada folder `.claude/` lain).
2. Untuk skill `glio-api-integration` dan agent `glio-api-builder`, kalau kamu simpan kode Glio-nya di repo terpisah, copy juga `.claude/skills/glio-api-integration/` dan `.claude/agents/glio-api-builder.md` ke repo Glio.
3. Restart/reload Claude Code session supaya skill & agent baru terbaca.

## Isi

### Skills (`.claude/skills/`)
- **sanity-schema** — konvensi bikin/edit schema Sanity, GROQ query, singleton documents
- **glio-api-integration** — aturan wajib untuk endpoint publik Glio (field allowlist, `isPublic` + `userId` scoping, API key check)
- **nextjs-content-fetching** — pola fetching Next.js App Router yang gabungin Sanity + Glio API, struktur folder, konvensi Tailwind

### Subagents (`.claude/agents/`)
- **sanity-schema-builder** — khusus schema/GROQ Sanity, tidak pernah nyentuh data project
- **glio-api-builder** — khusus endpoint publik Glio + kode fetch di landing page, selalu enforce security rules
- **content-migrator** — khusus migrasi copywriting existing ke Sanity (via script, bukan manual satu-satu)
- **frontend-page-builder** — khusus bikin halaman/komponen Next.js + Tailwind, tahu persis data mana dari Sanity vs Glio

## Kenapa dipisah begini

Setiap agent punya tanggung jawab sempit dan tahu batasnya sendiri (misal `frontend-page-builder` tidak akan pernah nulis Prisma query, `glio-api-builder` tidak akan pernah nulis komponen React). Ini bikin Claude Code lebih akurat delegasi task dan lebih kecil kemungkinan ngerjain hal di luar scope-nya — terutama penting untuk `glio-api-builder` karena ada aturan security (field allowlist, `userId` scoping) yang harus selalu ditegakkan, tidak boleh "kelewat" walau task-nya kelihatan sepele.

## Update di kemudian hari

Kalau skema Prisma `Project` di Glio berubah (nambah/hapus field), update field allowlist di `glio-api-integration/SKILL.md` dulu — semua agent baca skill file ini sebagai sumber kebenaran, jadi cukup update satu tempat.
