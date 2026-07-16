# SejatiDimedia Console & Agency Landing Page

[![Framework](https://img.shields.io/badge/Framework-React%2019-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**SejatiDimedia Console** adalah sebuah landing page premium dan pusat komando media (media command center) dengan gaya desain *Linear/Modern*. Proyek ini dirancang menggunakan sistem dual-theme (Dark/Light mode) yang memukau secara visual, responsif, dan interaktif dengan performa optimal.

---

## ✨ Fitur Utama

- 🌗 **Premium Dual-Theme:** Mode gelap (Dark Mode) dan terang (Light Mode) yang dikurasi secara harmonis menggunakan sistem token HSL modern.
- 🎨 **Estetika Linear/Modern:** Menggunakan grid overlay tipis, efek glassmorphism, micro SVG noise untuk kedalaman taktil, dan ambient glow animasi (accent pools).
- 🎬 **Animasi Halus & Interaktif:** Didukung oleh `motion` (Framer Motion) untuk transisi halaman yang luwes dan mikro-animasi pada hover elemen.
- 📊 **Interactive Tech Showcase:** Menampilkan spektrum teknologi modern dengan tata letak yang estetik.
- 📱 **Fully Responsive:** Layout fleksibel yang dioptimalkan untuk desktop, tablet, dan perangkat mobile.
- 🚀 **Desain Kelas Dunia:** Menghindari warna dasar mentah (*generic colors*) dan mengutamakan kombinasi kontras profesional yang memanjakan mata.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (menggunakan `@tailwindcss/vite` compiler plugin)
- **Animasi:** [Motion](https://motion.dev/) (Framer Motion)
- **Ikon:** [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Direktori

```text
agency_sejatidimedia/
├── public/                  # Aset statis public
├── src/
│   ├── components/
│   │   ├── AgencyLanding.tsx # Komponen utama landing page
│   │   └── ThemeToggle.tsx   # Komponen tombol switcher tema (dark/light)
│   ├── App.tsx              # Entry component utama, setup background & noise
│   ├── index.css            # Custom CSS, Tailwind imports & base design system
│   ├── main.tsx             # React DOM bootstrapping
│   └── types.ts             # Definisi TypeScript global/tipe tema
├── package.json             # Konfigurasi npm scripts & dependencies
├── tsconfig.json            # Konfigurasi TypeScript compiler
└── vite.config.ts           # Konfigurasi Vite & Tailwind plugin
```

---

## 🚀 Memulai (Lokal)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) versi terbaru (direkomendasikan Node.js 18+).

### 2. Kloning Repositori
```bash
git clone https://github.com/SejatiDimedia/agency_sejatidimedia.git
cd agency_sejatidimedia
```

### 3. Instal Dependencies
Gunakan manajer paket npm untuk menginstal semua pustaka yang diperlukan:
```bash
npm install
```

### 4. Jalankan Server Pengembangan (Dev Mode)
Jalankan server lokal dengan hot reload aktif:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

### 5. Build untuk Produksi
Guna membuat versi produksi yang dioptimalkan secara penuh:
```bash
npm run build
```
Hasil build akan tersimpan di dalam folder `/dist` yang siap di-deploy ke server hosting mana pun.

---

## 🌐 Panduan Deploy ke Vercel

### Metode 1: Integrasi GitHub (Sangat Direkomendasikan)
Metode ini adalah cara paling mudah karena Vercel akan otomatis mendeteksi perubahan saat Anda melakukan push ke GitHub:
1. Buka [Vercel](https://vercel.com) dan masuk ke akun Anda.
2. Klik tombol **Add New...** lalu pilih **Project**.
3. Hubungkan akun GitHub Anda, lalu cari repositori **`agency_sejatidimedia`** dan klik **Import**.
4. Biarkan konfigurasi build apa adanya (Vercel otomatis mendeteksi konfigurasi Vite):
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build` atau `vite build`
   * **Output Directory:** `dist`
5. Klik **Deploy**.

### Metode 2: Deploy Menggunakan Vercel CLI
Jika Anda ingin men-deploy langsung lewat terminal:
```bash
npx vercel
```
Ikuti instruksi interaktif yang muncul di terminal untuk masuk ke akun Anda dan menyelesaikan deployment.
