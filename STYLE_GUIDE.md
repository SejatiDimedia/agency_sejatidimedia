# SejatiDimedia - Design Style Guide & UI Component System

Dokumen ini adalah **panduan desain tunggal (Single Source of Truth)** untuk seluruh antarmuka (UI) admin dashboard dan client portal SejatiDimedia yang terintegrasi di Next.js App Router. Semua halaman baru **WAJIB** menggunakan token warna, tipografi, dan komponen dari `@/components/ui/`.

---

## 🎨 1. Color Palette (Light Mode SaaS Aesthetic)

Aplikasi ini menggunakan **LIGHT MODE SAAS AESTHETIC** dengan latar belakang canvas yang lembut dan kartu mengambang berbayangan halus.

### Base Colors
| Token / Name | Hex Code | Usage | Tailwind Class |
|---|---|---|---|
| **Canvas Background** | `#f0f4f8` | Background utama seluruh halaman | `bg-[#f0f4f8]` / `body` |
| **Card Surface** | `#ffffff` | Background container, card, modal, sidebar | `bg-white` |
| **Muted Surface** | `#f8fafc` / `#f1f5f9` | Background column kanban, secondary block | `bg-slate-50` / `bg-slate-100` |
| **Border Soft** | `rgba(226, 232, 240, 0.8)` | Border default card, input, divider | `border-slate-200/80` |

### Primary Brand & Accent
| Token / Name | Hex Code | Usage | Tailwind Class |
|---|---|---|---|
| **Primary Blue** | `#4A85D9` | Button utama, nav active item, primary glow | `bg-[#4A85D9]` / `text-[#4A85D9]` |
| **Primary Hover** | `#3b74c8` | State hover button utama | `hover:bg-[#3b74c8]` |
| **Primary Soft** | `rgba(74, 133, 217, 0.1)` | Light blue badge, icon container | `bg-blue-50` / `bg-blue-500/10` |

### Neutral Typography
| Token / Name | Hex Code | Usage | Tailwind Class |
|---|---|---|---|
| **Text Main (Slate 900)** | `#0f172a` | Heading (h1-h6), title card, teks utama | `text-slate-900` |
| **Text Secondary (Slate 600)** | `#475569` | Body text, deskripsi, label input | `text-slate-600` |
| **Text Muted (Slate 400)** | `#94a3b8` | Subtitle, date, placeholder, icon text | `text-slate-400` |

### Status Badges (Kanban & Lead Status)
| Status | Badge Background | Text Color | Border Color | Dot Color |
|---|---|---|---|---|
| **New** | `bg-blue-50` (`#eff6ff`) | `text-blue-700` (`#1d4ed8`) | `border-blue-200` | `bg-blue-500` |
| **Reviewing** | `bg-amber-50` (`#fffbeb`) | `text-amber-700` (`#b45309`) | `border-amber-200` | `bg-amber-500` |
| **Won (Converted)** | `bg-emerald-50` (`#ecfdf5`) | `text-emerald-700` (`#047857`) | `border-emerald-200` | `bg-emerald-500` |
| **Lost / Spam** | `bg-rose-50` (`#fff1f2`) | `text-rose-700` (`#be123c`) | `border-rose-200` | `bg-rose-500` |

---

## 🔤 2. Tipografi (Typography)

- **Font Family**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.

### Hierarchy
| Element | Class Specs | Contoh Penggunaan |
|---|---|---|
| **Page Title (H1)** | `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900` | Judul Halaman Utama |
| **Section Heading (H2)** | `text-xl font-extrabold text-slate-900` | Judul Section / Modal Header |
| **Card Title (H3)** | `text-base font-bold text-slate-900` | Judul Lead / Judul Project |
| **Subtitle / Label** | `text-xs font-bold uppercase tracking-wider text-slate-400` | Category Header Sidebar |
| **Body Text** | `text-sm font-medium text-slate-600 leading-relaxed` | Deskripsi / Pesan Lead |
| **Caption / Meta** | `text-xs font-medium text-slate-400` | Tanggal submit, email subtitle |

---

## 📐 3. Spacing & Grid System

- **Page Container Padding**: `p-4 sm:p-6 lg:p-8`
- **Sidebar Width**: Expanded `w-72`, Collapsed `w-20` (smooth transition `duration-300`)
- **Grid Gap**: Standard `gap-4` atau `gap-5` (16px / 20px)
- **Card Internal Padding**: Standard `p-4` atau `p-5`

---

## ⭕ 4. Border Radius Standard

| Category | Radius Class | Target Element |
|---|---|---|
| **Floating Sidebar** | `rounded-[2rem]` (32px) | Sidebar Container |
| **Large Modal** | `rounded-[2.5rem]` (40px) | Pop-up Dialog / Modal Overlay |
| **Kanban Column** | `rounded-[1.8rem]` (28px) | Kanban Column Wrapper |
| **Cards & Containers** | `rounded-2xl` (16px) | Lead Card, Form Card, Section Container |
| **Buttons & Inputs** | `rounded-2xl` / `rounded-xl` (16px / 12px) | Input search, Action Button |
| **Badges & Avatars** | `rounded-full` / `rounded-lg` | Status Pill, User Avatar |

---

## 🌫️ 5. Shadow & Elevation Style

| Elevation | Tailwind Shadow Class | Target Element |
|---|---|---|
| **Soft Card Shadow** | `shadow-[0_4px_15px_-3px_rgba(0,0,0,0.03)]` | Interactive Cards, Lead Cards |
| **Input Shadow** | `shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)]` | Search Bar, Form Input |
| **Primary Button Glow**| `shadow-md shadow-blue-500/25` | Primary Blue Action Buttons |
| **Floating Sidebar** | `shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]` | Left Floating Sidebar |
| **Overlay Modal** | `shadow-2xl` | Floating Modals |

---

## 🧩 6. Reusable Component Library (`@/components/ui/`)

Tersedia komponen modular di `src/components/ui/` untuk digunakan di seluruh halaman:

### 1. `Button` (`@/components/ui/Button`)
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add New Lead</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="dark">Save Changes</Button>
<Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
```

### 2. `Badge` (`@/components/ui/Badge`)
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge status="New" count={5} />
<Badge status="Reviewing" />
<Badge status="Won" />
<Badge status="Lost/Spam" />
<Badge variant="custom" colorClass="bg-slate-100 text-slate-600 border-slate-200">Website</Badge>
```

### 3. `Card` (`@/components/ui/Card`)
```tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@/components/ui/Card';

<Card hoverEffect onClick={handleClick}>
  <CardHeader>
    <CardTitle>Nama Client</CardTitle>
  </CardHeader>
  <CardBody>
    <p>Message detail...</p>
  </CardBody>
</Card>
```

### 4. `Input` (`@/components/ui/Input`)
```tsx
import { Input, SearchInput } from '@/components/ui/Input';

<SearchInput value={searchTerm} onSearchChange={setSearchTerm} placeholder="Search leads..." />
<Input label="Full Name" placeholder="Masukkan nama..." required />
```

### 5. `Avatar` & `AvatarGroup` (`@/components/ui/Avatar`)
```tsx
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';

<Avatar name="Timur Dian" src="/avatar.jpg" size="md" />
<AvatarGroup avatars={teamMembers} maxDisplay={3} />
```

---

## 🌐 7. Next.js App Router Routes

- **Admin Leads Dashboard**: `/admin/dashboard`
- **Client Portal**: `/portal`
