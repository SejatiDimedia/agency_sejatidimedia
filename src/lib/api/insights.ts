import { prisma } from "@/lib/prisma";
import { getGlobalAuthorProfile } from "@/lib/server-template";

export interface InsightAuthor {
  name: string;
  role: string;
  avatar: string;
  bioId?: string;
  bioEn?: string;
}

export interface SeriesCurriculumItem {
  part: number;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  readTimeMinutes: number;
  isCurrent: boolean;
}

export interface SeriesAdjacentPart {
  part: number;
  slug: string;
  titleId: string;
  titleEn?: string | null;
}

export interface InsightSeriesInfo {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  badge?: string | null;
  part: number;
  totalParts: number;
  curriculum: SeriesCurriculumItem[];
  prevPart?: SeriesAdjacentPart | null;
  nextPart?: SeriesAdjacentPart | null;
}

export interface InsightSeriesSummary {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  badge?: string | null;
  category: string;
  coverImage?: string | null;
  totalArticles: number;
  totalReadTimeMinutes: number;
  updatedAt: string;
}

export interface InsightSeriesDetail extends InsightSeriesSummary {
  articles: Array<{
    slug: string;
    titleId: string;
    titleEn?: string | null;
    excerptId: string;
    excerptEn?: string | null;
    readTimeMinutes: number;
    seriesPart: number;
    publishedAt: string;
  }>;
}

export interface InsightArticle {
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  category: 'Backend' | 'Frontend' | 'Architecture' | 'Best Practices' | 'Security';
  tags: string[];
  publishedAt: string;
  readTimeMinutes: number;
  author: InsightAuthor;
  coverImage: string;
  featured?: boolean;
  seriesId?: string | null;
  seriesPart?: number | null;
  series?: InsightSeriesInfo | null;
}

const DEFAULT_AUTHOR: InsightAuthor = {
  name: "Timur Dian Radha Sejati",
  role: "Lead Software Engineer · SejatiDimedia",
  avatar: "/images/author_timur_dian.jpg",
  bioId: "Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi, refactoring backend skala enterprise (Laravel / Node.js), hingga pengembangan aplikasi mobile & web modern.",
  bioEn: "Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design, enterprise-scale backend refactoring (Laravel / Node.js), and modern web & mobile engineering.",
};

const DUMMY_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

export const DEFAULT_SERIES_DATA: InsightSeriesSummary[] = [
  {
    id: "series-laravel-architecture",
    slug: "arsitektur-laravel-skala-bisnis",
    titleId: "Arsitektur Laravel Skala Bisnis",
    titleEn: "Enterprise Laravel Architecture at Scale",
    descriptionId: "Panduan rekayasa sistem Laravel komprehensif dari SejatiDimedia untuk menangani beban transaksi tinggi, mencegah bottleneck database, dan membangun arsitektur kode enterprise yang bersih.",
    descriptionEn: "Comprehensive Laravel system engineering playbook from SejatiDimedia for handling high transaction throughput, eliminating database bottlenecks, and building clean enterprise codebases.",
    badge: "ENGINEERING PLAYBOOK",
    category: "Backend",
    coverImage: "/images/insights/laravel_architecture_cover.jpg",
    totalArticles: 1,
    totalReadTimeMinutes: 7,
    updatedAt: "2026-09-14",
  },
];

export const INSIGHTS_DATA: InsightArticle[] = [
  {
    slug: "kesalahan-arsitektur-laravel-developer",
    titleId: "5 Kesalahan Arsitektur yang Sering Dilakukan Laravel Developer (Dan Cara Kami Mencegahnya di Skala Bisnis)",
    titleEn: "5 Architectural Pitfalls in Laravel Applications & How We Prevent Them at Scale",
    excerptId: "Banyak aplikasi Laravel berjalan lancar di tahap awal, namun tiba-tiba lemot dan sering crash saat pengguna bertambah. Mengapa ini terjadi dan bagaimana standar arsitektur SejatiDimedia mengatasinya?",
    excerptEn: "Many Laravel apps run smoothly initially, but become sluggish and prone to crashes as user traffic scales. Why does this happen and how does SejatiDimedia's architecture prevent it?",
    category: "Backend",
    tags: ["Laravel", "PHP", "Database", "Architecture", "Performance"],
    publishedAt: "2026-09-13",
    readTimeMinutes: 7,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/laravel_architecture_cover.jpg",
    featured: true,
    seriesId: "series-laravel-architecture",
    seriesPart: 1,
    series: {
      id: "series-laravel-architecture",
      slug: "arsitektur-laravel-skala-bisnis",
      titleId: "Arsitektur Laravel Skala Bisnis",
      titleEn: "Enterprise Laravel Architecture at Scale",
      descriptionId: "Panduan rekayasa sistem Laravel komprehensif dari SejatiDimedia untuk menangani beban transaksi tinggi, mencegah bottleneck database, dan membangun arsitektur kode enterprise yang bersih.",
      descriptionEn: "Comprehensive Laravel system engineering playbook from SejatiDimedia for handling high transaction throughput, eliminating database bottlenecks, and building clean enterprise codebases.",
      badge: "ENGINEERING PLAYBOOK",
      part: 1,
      totalParts: 1,
      curriculum: [
        {
          part: 1,
          slug: "kesalahan-arsitektur-laravel-developer",
          titleId: "5 Kesalahan Arsitektur yang Sering Dilakukan Laravel Developer (Dan Cara Kami Mencegahnya di Skala Bisnis)",
          titleEn: "5 Architectural Pitfalls in Laravel Applications & How We Prevent Them at Scale",
          readTimeMinutes: 7,
          isCurrent: true,
        },
      ],
      prevPart: null,
      nextPart: null,
    },
    contentId: `Sebagai framework PHP paling populer di dunia, **Laravel** menawarkan kemudahan pengembangan yang luar biasa cepat melalui ekosistemnya yang matang: Eloquent ORM, Blade, routing elegan, hingga built-in auth.

Namun, kemudahan ini ibarat pisau bermata dua. Di **SejatiDimedia**, kami sering kali diajak untuk mengaudit atau me-*refactor* aplikasi Laravel milik klien yang awalnya dibangun oleh freelance dev atau software house lain. Masalah klasiknya hampir selalu sama: **aplikasi mulai lemot, server sering kehabisan memory (OOM), dan setiap penambahan fitur baru malah merusak fitur lama.**

Berikut adalah 5 kesalahan arsitektur yang paling sering kami temukan dan bagaimana cara kami mencegahnya agar sistem stabil di skala bisnis riil.

---

### 1. "Fat Controller" & Penumpukan Business Logic di Controller

Banyak developer menempatkan seluruh query database, logika validasi, pemanggilan API payment gateway, hingga pengiriman email langsung di dalam method Controller.

#### [Anti-Pattern] Contoh Masalah Fat Controller:
\`\`\`php
class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validasi manual
        $request->validate([...]);

        // Kalkulasi diskon & stok
        $voucher = Voucher::where('code', $request->voucher_code)->first();
        // ... 40 baris kalkulasi logika bisnis ...

        // Hitung payment gateway
        $payment = Midtrans::createTransaction([...]);

        // Simpan ke database
        $order = Order::create([...]);
        foreach ($request->items as $item) {
            OrderItem::create([...]);
            Product::find($item['id'])->decrement('stock', $item['qty']);
        }

        // Kirim email notification
        Mail::to($request->user())->send(new OrderCreatedMail($order));

        return response()->json(['status' => 'success', 'data' => $order]);
    }
}
\`\`\`

#### [Best Practice] Standar Rekayasa Kami: Service Layer & Single-Action Classes
Kami memisahkan logika menjadi **Action Classes** atau **Service Layer** mandiri yang terisolasi dan mudah diuji (*unit testable*). Controller hanya bertugas sebagai *traffic controller* (menerima input, meneruskan ke Service, mengembalikan output).

\`\`\`php
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, CreateOrderAction $createOrderAction)
    {
        $order = $createOrderAction->execute(
            user: $request->user(),
            dto: OrderData::fromRequest($request)
        );

        return OrderResource::make($order);
    }
}
\`\`\`

---

### 2. Terjebak Masalah N+1 Query pada Eloquent ORM

Eloquent ORM sangat intuitif, tetapi jika digunakan tanpa kehati-hatian, satu halaman sederhana bisa memicu ratusan hingga ribuan query SQL ke database dalam satu *request*.

#### [Anti-Pattern] Contoh Masalah N+1 Query:
\`\`\`php
// Di Controller:
$orders = Order::where('status', 'PAID')->get(); // 1 Query

// Di Blade View atau Resource Loop:
@foreach ($orders as $order)
    <p>{{ $order->customer->name }}</p>    {{-- Query customer dijalankan N kali! --}}
    <p>{{ $order->items->count() }} items</p> {{-- Query items dijalankan N kali lagi! --}}
@endforeach
\`\`\`
Jika ada 100 order, kode di atas mengeksekusi **201 query SQL** ke database!

#### [Best Practice] Standar Rekayasa Kami: Strict Eager Loading & Query Watchdog
Gunakan metode \`with()\` untuk *Eager Loading*, dan aktifkan larangan *lazy loading* di lingkungan local/staging:

\`\`\`php
// Eager loading relasi secara eksplisit
$orders = Order::with(['customer:id,name,email', 'items'])
    ->where('status', 'PAID')
    ->latest()
    ->paginate(20);
\`\`\`

Di \`AppServiceProvider\`, kami selalu mengaktifkan pencegahan lazy loading:
\`\`\`php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
\`\`\`
Dengan konfigurasi ini, jika ada developer tim yang lupa menuliskan eager loading, aplikasi akan langsung melempar exception saat tahap development sebelum kode sempat masuk ke production.

---

### 3. Mengabaikan Database Indexing pada Kolom Pencarian & Filter

Aplikasi dengan 500 baris data mungkin tidak merasakan perbedaan kecepatan saat menjalankan query filter. Namun ketika tabel transaksi mencapai 100.000 atau 1.000.000 baris, ketiadaan index akan memaksa database melakukan *Full Table Scan*.

#### [Anti-Pattern] Contoh Migration Tanpa Index:
\`\`\`php
Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->string('invoice_number'); // Sering dicari
    $table->foreignId('customer_id'); // Sering di-join
    $table->string('status');         // Sering di-filter
    $table->date('due_date');         // Sering diurutkan
    $table->timestamps();
});
\`\`\`

#### [Best Practice] Standar Rekayasa Kami: Komposit & Single Index Terencana
\`\`\`php
Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->string('invoice_number')->unique();
    $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
    $table->string('status')->index();
    $table->date('due_date');
    $table->timestamps();

    // Composite index untuk query reporting bulanan yang sering diakses
    $table->index(['status', 'due_date']);
});
\`\`\`
Dengan menambahkan index pada kolom yang sering dijadikan kondisi \`WHERE\`, waktu eksekusi query bisa dipangkas dari **850ms menjadi hanya 4ms**.

---

### 4. Eksekusi Proses Berat Secara Synchronous (Tanpa Queue Worker)

Sering kami temukan aplikasi yang memakan waktu loading 5 hingga 10 detik hanya saat menekan tombol "Daftar" atau "Bayar". Setelah kami audit, ternyata di dalam *HTTP request* tersebut aplikasi langsung:
1. Menghubungi SMTP server pihak ketiga untuk kirim email konfirmasi.
2. Melakukan render file PDF invoice 10 halaman.
3. Melakukan push notifikasi ke WhatsApp gateway.

Jika server SMTP sedang lambat, browser pengguna akan berputar tanpa henti atau mengalami *HTTP 504 Gateway Timeout*.

#### [Best Practice] Standar Rekayasa Kami: Event-Driven Architecture & Redis Queues
\`\`\`php
// Di Controller / Action:
$order = $createOrderAction->execute(...);

// Lepaskan event dan langsung respon user dalam < 200ms
OrderCreatedEvent::dispatch($order);

return response()->json(['message' => 'Pesanan berhasil dibuat']);
\`\`\`

Proses kirim email dan cetak PDF ditangani secara paralel oleh background worker menggunakan **Redis / Laravel Horizon** tanpa membebani browser pengguna.

---

### 5. Tidak Menggunakan Database Transaction pada Operasi Multi-Tabel

Bayangkan skenario berikut:
1. Aplikasi membuat data transaksi pesanan (\`Order::create\`).
2. Aplikasi memotong saldo e-wallet pengguna.
3. Tiba-tiba di baris ketiga, server kehabisan memori atau koneksi database terputus saat mencoba mencatat item pesanan.

Hasilnya? **Saldo pengguna terpotong, tapi barang pesanan tidak tercatat!** Ini adalah mimpi buruk operasional yang sering memicu komplain klien.

#### [Best Practice] Standar Rekayasa Kami: Atomic DB Transaction
Setiap operasi yang menyentuh lebih dari satu tabel atau melibatkan transfer nilai **wajib dibungkus dengan transaction**:

\`\`\`php
use Illuminate\\Support\\Facades\\DB;

return DB::transaction(function () use ($data, $user) {
    $order = Order::create([...]);

    $order->items()->createMany($data['items']);

    $user->decrement('wallet_balance', $order->total_amount);

    return $order;
}, 3); // Coba ulang otomatis hingga 3x jika terjadi database deadlock
\`\`\`
Jika terjadi error di tengah jalan, seluruh perubahan akan di-*rollback* secara otomatis, menjaga integritas data tetap 100% konsisten.

---

### 6. Rangkuman Matriks Perbandingan Arsitektur

Berikut adalah perbandingan ringkas antara pendekatan konvensional dengan standar rekayasa yang kami terapkan di SejatiDimedia:

| Aspek Rekayasa | Pendekatan Konvensional (Fat Architecture) | Standar Rekayasa SejatiDimedia | Dampak Bisnis Nyata |
| :--- | :--- | :--- | :--- |
| **Penempatan Logika** | Menumpuk di Controller (Fat Controller) | Action Classes & Service Layer terisolasi | Kode mudah diuji, minim regresi saat update |
| **Query Database** | Eloquent tanpa eager loading (N+1 Query) | Strict Eager Loading & Query Watchdog | Load time 5-10x lebih kencang & hemat RAM |
| **Proses I/O Berat** | Sinkron pada HTTP Request (Rawan timeout) | Asinkron dengan Redis Background Queues | Transaksi instan tanpa pengguna menunggu |
| **Integritas Data** | Eksekusi query terpisah tanpa proteksi ACID | Terproteksi Atomic \`DB::transaction\` | Nol risiko selisih saldo atau transaksi menggantung |
| **Validasi & Kontrak** | Validasi manual di Controller | Dedicated Form Request & DTO strictly typed | Keamanan teruji dan type-safety enterprise |

---

### Kesimpulan

Membangun aplikasi web bukan sekadar membuat fitur yang tampak berjalan di komputer lokal. Di skala bisnis, **fondasi arsitektur menentukan apakah sistem Anda siap bertumbuh atau justru menjadi beban teknis yang mahal untuk diperbaiki**.

Di **SejatiDimedia**, standar-standar di atas sudah menjadi SOP dasar yang diterapkan di setiap proyek sejak hari pertama pengembangan.`,
    contentEn: `As the most popular PHP framework in the world, **Laravel** offers incredible developer velocity through its mature ecosystem: Eloquent ORM, Blade, clean routing, and out-of-the-box authentication.

However, ease of use is a double-edged sword. At **SejatiDimedia**, we are frequently called in to audit or refactor Laravel applications built by previous vendors. The classic symptoms are almost identical: **the app crawls to a halt under real user traffic, memory usage spikes, and adding new features continuously breaks legacy code.**

Here are 5 architectural pitfalls we encounter most often, along with our engineering solutions to keep systems reliable at enterprise scale.

---

### 1. Fat Controllers & Polluting HTTP Layers with Business Logic

A common anti-pattern is writing direct database queries, payment gateway API calls, email dispatches, and intricate business calculations directly inside Controller methods.

#### [Best Practice] Our Standard: Service Layer & Single-Action Classes
Controllers should act strictly as HTTP traffic coordinators. All business logic belongs to dedicated, testable Action or Service classes.

---

### 2. The Dreaded N+1 Query Problem in Eloquent

Iterating over Eloquent models without eager loading triggers hundreds of sequential SQL queries. We enforce \`Model::preventLazyLoading()\` in non-production environments to catch query performance regressions before they ever ship.

---

### 3. Missing Database Indexes on High-Frequency Filters

Without composite and dedicated indexes on frequently filtered columns, databases default to expensive Full Table Scans that collapse production performance as table rows exceed 100,000+.

---

### 4. Synchronous Processing of Heavy I/O Operations

Sending emails, generating PDF invoices, or calling third-party APIs synchronously during an HTTP request causes slow page loads and gateway timeouts. We offload all non-critical I/O to background queue workers powered by Redis.

---

### 5. Omitting Database Transactions on Multi-Table Writes

Failing to wrap multi-step financial or inventory updates inside \`DB::transaction\` leads to partial writes, data corruption, and customer billing discrepancies when runtime exceptions occur.

---

### 6. Architecture Comparison Matrix

Here is a side-by-side summary comparing conventional implementations against SejatiDimedia's enterprise standards:

| Engineering Dimension | Conventional Architecture (Fat Controller) | SejatiDimedia Enterprise Standard | Real Business Impact |
| :--- | :--- | :--- | :--- |
| **Logic Placement** | Tangled inside HTTP Controllers | Isolated Action Classes & Dedicated Services | Easily testable, regression-free deployments |
| **Database Queries** | Lazy Eloquent loops (N+1 Query explosion) | Strict Eager Loading & Query Watchdogs | 5-10x faster response times, reduced RAM |
| **Heavy I/O Work** | Synchronous during HTTP requests | Asynchronous via Redis Background Workers | Instant user feedback without request timeouts |
| **Data Integrity** | Discrete queries without ACID guarantees | Enforced Atomic \`DB::transaction\` blocks | Zero billing discrepancies or orphan records |
| **Input Contracts** | Ad-hoc controller validation | Dedicated Form Requests & Strongly Typed DTOs | Enterprise security and hardened type contracts |

---

### Conclusion

Software engineering is about designing scalable foundations. At **SejatiDimedia**, these best practices are embedded in our standard development workflow from day one.`
  },
  {
    slug: "mengapa-kami-memilih-nextjs-app-router-typescript",
    titleId: "Mengapa Kami Memilih Next.js App Router & TypeScript untuk Sistem Bisnis Modern",
    titleEn: "Why We Choose Next.js App Router & TypeScript for Modern Business Systems",
    excerptId: "Evolusi teknologi frontend bergerak cepat. Inilah alasan mengapa arsitektur React Server Components dan TypeScript menjadi standar emas SejatiDimedia dalam membangun platform web enterprise.",
    excerptEn: "Frontend tech evolves rapidly. Here is why React Server Components and strict TypeScript are SejatiDimedia's gold standard for building modern enterprise web apps.",
    category: "Architecture",
    tags: ["Next.js", "React", "TypeScript", "Frontend", "Web Performance"],
    publishedAt: "2026-09-10",
    readTimeMinutes: 5,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/nextjs_typescript_cover.jpg",
    featured: false,
    contentId: `Dalam dunia pengembangan aplikasi web modern, memilih teknologi fondasi (*tech stack*) bukan soal mengikuti tren sesaat, melainkan tentang **tiga hal krusial bagi bisnis**:
1. Kecepatan waktu muat (*load time*) yang berdampak langsung pada retensi pengguna.
2. Kemudahan pemeliharaan (*maintainability*) agar sistem mudah dikembangkan dalam 3-5 tahun ke depan.
3. Kestabilan kode (*zero runtime errors*) untuk meminimalkan kerugian operasional.

Inilah mengapa di **SejatiDimedia**, kombinasi **Next.js App Router** dan **TypeScript** menjadi pilihan utama untuk pengembangan aplikasi web dan platform SaaS.

---

### 1. Keunggulan React Server Components (RSC)
Dengan Next.js App Router, komponen di-render di sisi server secara default. Ini berarti:
- Ukuran bundel JavaScript yang dikirim ke browser klien jauh lebih kecil.
- Data fetching langsung dilakukan di level komponen tanpa perlu *waterfall useEffect*.
- Skor Core Web Vitals (LCP, INP, CLS) optimal secara alami, memberikan peringkat SEO yang unggul di mesin pencari.

---

### 2. Type-Safety End-to-End dengan TypeScript
Mengembangkan sistem bisnis berskala menengah hingga besar dengan JavaScript murni adalah resep bencana. Salah satu huruf nama properti API bisa membuat aplikasi crash di tangan pengguna.

Dengan TypeScript yang ketat (*strict mode*), seluruh data mulai dari skema database, payload API, hingga komponen UI terkunci dalam kontrak tipe data yang pasti. Kesalahan logika tertangkap saat kompilasi, bukan saat aplikasi sudah digunakan oleh klien.

---

### 3. SEO & Dynamic Social Preview yang Sempurna
Fitur bawaan \`generateMetadata\` di Next.js App Router memungkinkan pembuatan OpenGraph banner dinamis dan metadata teroptimasi untuk setiap halaman, memudahkan produk klien kami viral di media sosial.`,
    contentEn: `In modern web development, choosing a tech stack isn't about chasing buzzwords—it is about three business imperatives:
1. Blazing load times that directly impact user conversion and retention.
2. Long-term code maintainability across multi-year lifecycles.
3. Resilient type safety to eradicate runtime exceptions.

This is why **Next.js App Router** and **TypeScript** form the core foundation of SejatiDimedia's web platforms.`
  },
  {
    slug: "mendesain-client-portal-transparan-mencegah-ghosting",
    titleId: "Mencegah Budaya Developer Ghosting: Bagaimana Kami Mendesain Client Portal Transparan",
    titleEn: "Preventing Developer Ghosting: How We Engineered a Transparent Client Portal",
    excerptId: "Kekhawatiran terbesar pemilik bisnis saat menyewa vendor software adalah hilangnya komunikasi. Simak bagaimana SejatiDimedia membangun Client Portal untuk menghadirkan transparansi total.",
    excerptEn: "The biggest fear of business owners when hiring software agencies is radio silence. Discover how SejatiDimedia engineered a Client Portal for radical transparency.",
    category: "Best Practices",
    tags: ["Client Portal", "Product Management", "Agency", "UX", "Workflow"],
    publishedAt: "2026-09-05",
    readTimeMinutes: 6,
    author: DEFAULT_AUTHOR,
    coverImage: "/images/insights/client_portal_cover.jpg",
    featured: false,
    contentId: `Keluhan nomor satu di industri pembuatan software bukanlah mahalnya biaya, melainkan: **"Developer-nya susah dihubungi setelah terima DP, dan progres tidak jelas sudah sampai mana."**

Fenomena *developer ghosting* ini merusak kepercayaan pemilik bisnis terhadap industri teknologi. Di **SejatiDimedia**, kami percaya bahwa kepercayaan dibangun bukan lewat janji manis, melainkan lewat **sistem kerja yang transparan**.

Oleh karena itu, kami membangun **Client Portal SejatiDimedia** sebagai pilar operasional kami.

---

### 3 Pilar Utama Client Portal Kami:
1. **Real-Time Milestone Kanban Board**: Klien dapat memantau setiap modul pekerjaan (Planning, In Progress, Code Review, Testing, Done) secara real-time.
2. **Transparent Billing & Invoicing**: Riwayat termin pembayaran, bukti transfer, dan status invoice tercatat resmi tanpa ada biaya tersembunyi.
3. **Dokumentasi & Deliverables Terpusat**: Semua link repositori Git, desain Figma, dan credential staging tersimpan aman dalam satu dashboard terlindungi.

Transparansi bukan sekadar fitur tambahan—bagi kami, transparansi adalah produk inti.`,
    contentEn: `The number one complaint in custom software development isn't pricing—it is communication breakdown: *"The developer vanished after the deposit, and we have no idea what is being built."*

At **SejatiDimedia**, we engineered our dedicated **Client Portal** to eliminate guesswork and foster total transparency through real-time milestone tracking and centralized billing.`
  }
];

export function mapDbInsightToArticle(
  item: any,
  globalAuthor?: InsightAuthor,
  seriesInfo?: InsightSeriesInfo | null
): InsightArticle {
  const fallbackAvatar = globalAuthor?.avatar || DEFAULT_AUTHOR.avatar;
  const authorAvatar = (!item.authorAvatar || item.authorAvatar === DUMMY_AVATAR)
    ? fallbackAvatar
    : item.authorAvatar;
  const authorName = item.authorName || globalAuthor?.name || DEFAULT_AUTHOR.name;
  const authorRole = item.authorRole || globalAuthor?.role || DEFAULT_AUTHOR.role;

  let resolvedSeries: InsightSeriesInfo | null = null;
  if (seriesInfo !== undefined) {
    resolvedSeries = seriesInfo;
  } else if (item.series) {
    resolvedSeries = {
      id: item.series.id,
      slug: item.series.slug,
      titleId: item.series.titleId,
      titleEn: item.series.titleEn,
      descriptionId: item.series.descriptionId || '',
      descriptionEn: item.series.descriptionEn || '',
      badge: item.series.badge || 'ENGINEERING SERIES',
      part: item.seriesPart || 1,
      totalParts: 1,
      curriculum: [],
    };
  }

  return {
    slug: item.slug,
    titleId: item.titleId,
    titleEn: item.titleEn || item.titleId,
    excerptId: item.excerptId,
    excerptEn: item.excerptEn || item.excerptId,
    contentId: item.contentId,
    contentEn: item.contentEn || item.contentId,
    category: item.category as any,
    tags: item.tags || [],
    publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    readTimeMinutes: item.readTimeMinutes || 5,
    author: {
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
      bioId: globalAuthor?.bioId || DEFAULT_AUTHOR.bioId,
      bioEn: globalAuthor?.bioEn || DEFAULT_AUTHOR.bioEn,
    },
    coverImage: item.coverImage,
    featured: item.featured || false,
    seriesId: item.seriesId || null,
    seriesPart: item.seriesPart || null,
    series: resolvedSeries,
  };
}

export async function getInsights(): Promise<InsightArticle[]> {
  const globalAuthor = await getGlobalAuthorProfile().catch(() => DEFAULT_AUTHOR);
  try {
    const totalCount = await prisma.insight.count();

    if (totalCount > 0) {
      // Database has records: strictly query ONLY published articles!
      const dbArticles = await prisma.insight.findMany({
        where: { isPublished: true },
        include: {
          series: {
            select: {
              id: true,
              slug: true,
              titleId: true,
              titleEn: true,
              descriptionId: true,
              descriptionEn: true,
              badge: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      });
      return dbArticles.map((item) => mapDbInsightToArticle(item, globalAuthor));
    }

    // Auto-seed default articles to database only if table is completely empty
    try {
      for (const item of INSIGHTS_DATA) {
        await prisma.insight.create({
          data: {
            slug: item.slug,
            titleId: item.titleId,
            titleEn: item.titleEn,
            excerptId: item.excerptId,
            excerptEn: item.excerptEn,
            contentId: item.contentId,
            contentEn: item.contentEn,
            category: item.category,
            tags: item.tags,
            coverImage: item.coverImage,
            readTimeMinutes: item.readTimeMinutes,
            authorName: globalAuthor.name,
            authorRole: globalAuthor.role,
            authorAvatar: globalAuthor.avatar,
            isPublished: true,
            featured: item.featured || false,
            publishedAt: new Date(item.publishedAt),
          },
        });
      }
      const seeded = await prisma.insight.findMany({
        where: { isPublished: true },
        include: {
          series: {
            select: {
              id: true,
              slug: true,
              titleId: true,
              titleEn: true,
              descriptionId: true,
              descriptionEn: true,
              badge: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      });
      return seeded.map((item) => mapDbInsightToArticle(item, globalAuthor));
    } catch (seedErr) {
      console.warn("Auto-seed error in getInsights:", seedErr);
    }
  } catch (error) {
    console.error("Database query failed in getInsights, falling back to local store:", error);
    return [...INSIGHTS_DATA].map((item) => ({
      ...item,
      author: globalAuthor,
    })).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return [];
}

export async function getInsightBySlug(slug: string): Promise<InsightArticle | null> {
  const globalAuthor = await getGlobalAuthorProfile().catch(() => DEFAULT_AUTHOR);
  try {
    const item = await prisma.insight.findUnique({
      where: { slug },
      include: {
        series: true,
      },
    });
    if (item) {
      // Article exists in DB: return only if published, otherwise return null for draft articles!
      if (item.isPublished) {
        let seriesInfo: InsightSeriesInfo | null = null;
        if (item.seriesId && item.series) {
          const siblings = await prisma.insight.findMany({
            where: {
              seriesId: item.seriesId,
              isPublished: true,
            },
            orderBy: [{ seriesPart: 'asc' }, { publishedAt: 'asc' }],
            select: {
              slug: true,
              titleId: true,
              titleEn: true,
              seriesPart: true,
              readTimeMinutes: true,
            },
          });

          const curriculum: SeriesCurriculumItem[] = siblings.map((sib, idx) => ({
            part: sib.seriesPart ?? (idx + 1),
            slug: sib.slug,
            titleId: sib.titleId,
            titleEn: sib.titleEn,
            readTimeMinutes: sib.readTimeMinutes,
            isCurrent: sib.slug === item.slug,
          }));

          const currentIndex = curriculum.findIndex((c) => c.slug === item.slug);
          const prevPart = currentIndex > 0 ? {
            part: curriculum[currentIndex - 1].part,
            slug: curriculum[currentIndex - 1].slug,
            titleId: curriculum[currentIndex - 1].titleId,
            titleEn: curriculum[currentIndex - 1].titleEn,
          } : null;

          const nextPart = currentIndex >= 0 && currentIndex < curriculum.length - 1 ? {
            part: curriculum[currentIndex + 1].part,
            slug: curriculum[currentIndex + 1].slug,
            titleId: curriculum[currentIndex + 1].titleId,
            titleEn: curriculum[currentIndex + 1].titleEn,
          } : null;

          seriesInfo = {
            id: item.series.id,
            slug: item.series.slug,
            titleId: item.series.titleId,
            titleEn: item.series.titleEn,
            descriptionId: item.series.descriptionId,
            descriptionEn: item.series.descriptionEn,
            badge: item.series.badge,
            part: item.seriesPart || (currentIndex >= 0 ? currentIndex + 1 : 1),
            totalParts: curriculum.length,
            curriculum,
            prevPart,
            nextPart,
          };
        }

        return mapDbInsightToArticle(item, globalAuthor, seriesInfo);
      }
      return null;
    }

    // If slug not in DB, check if DB is initialized
    const totalCount = await prisma.insight.count().catch(() => 0);
    if (totalCount > 0) {
      return null;
    }
  } catch (error) {
    console.error("Database query failed in getInsightBySlug, falling back to local store:", error);
    const article = INSIGHTS_DATA.find((item) => item.slug === slug);
    if (article) {
      return {
        ...article,
        author: globalAuthor,
      };
    }
    return null;
  }

  const article = INSIGHTS_DATA.find((item) => item.slug === slug);
  if (article) {
    return {
      ...article,
      author: globalAuthor,
    };
  }
  return null;
}

export async function getInsightSeriesList(): Promise<InsightSeriesSummary[]> {
  try {
    const totalCount = await prisma.insightSeries.count().catch(() => 0);
    if (totalCount > 0) {
      const seriesList = await prisma.insightSeries.findMany({
        where: { isPublished: true },
        include: {
          insights: {
            where: { isPublished: true },
            select: {
              id: true,
              readTimeMinutes: true,
            },
          },
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      return seriesList.map((s) => ({
        id: s.id,
        slug: s.slug,
        titleId: s.titleId,
        titleEn: s.titleEn,
        descriptionId: s.descriptionId,
        descriptionEn: s.descriptionEn,
        badge: s.badge,
        category: s.category,
        coverImage: s.coverImage,
        totalArticles: s.insights.length,
        totalReadTimeMinutes: s.insights.reduce((acc, curr) => acc + (curr.readTimeMinutes || 0), 0),
        updatedAt: s.updatedAt.toISOString().split('T')[0],
      }));
    }
    return DEFAULT_SERIES_DATA;
  } catch (error) {
    console.error("Database query failed in getInsightSeriesList, fallback to local:", error);
    return DEFAULT_SERIES_DATA;
  }
}

export async function getInsightSeriesBySlug(slug: string): Promise<InsightSeriesDetail | null> {
  try {
    const s = await prisma.insightSeries.findUnique({
      where: { slug },
      include: {
        insights: {
          where: { isPublished: true },
          orderBy: [{ seriesPart: 'asc' }, { publishedAt: 'asc' }],
          select: {
            slug: true,
            titleId: true,
            titleEn: true,
            excerptId: true,
            excerptEn: true,
            readTimeMinutes: true,
            seriesPart: true,
            publishedAt: true,
          },
        },
      },
    });

    if (s && s.isPublished) {
      return {
        id: s.id,
        slug: s.slug,
        titleId: s.titleId,
        titleEn: s.titleEn,
        descriptionId: s.descriptionId,
        descriptionEn: s.descriptionEn,
        badge: s.badge,
        category: s.category,
        coverImage: s.coverImage,
        totalArticles: s.insights.length,
        totalReadTimeMinutes: s.insights.reduce((acc, curr) => acc + (curr.readTimeMinutes || 0), 0),
        updatedAt: s.updatedAt.toISOString().split('T')[0],
        articles: s.insights.map((art, idx) => ({
          slug: art.slug,
          titleId: art.titleId,
          titleEn: art.titleEn,
          excerptId: art.excerptId,
          excerptEn: art.excerptEn,
          readTimeMinutes: art.readTimeMinutes,
          seriesPart: art.seriesPart ?? (idx + 1),
          publishedAt: art.publishedAt ? new Date(art.publishedAt).toISOString().split('T')[0] : '',
        })),
      };
    }

    const totalCount = await prisma.insightSeries.count().catch(() => 0);
    if (totalCount > 0) return null;
  } catch (error) {
    console.error("Database query failed in getInsightSeriesBySlug, fallback:", error);
  }

  // Fallback from DEFAULT_SERIES_DATA
  const def = DEFAULT_SERIES_DATA.find((s) => s.slug === slug);
  if (!def) return null;

  const matchingArticles = INSIGHTS_DATA.filter((item) => item.seriesId === def.id).sort((a, b) => (a.seriesPart || 0) - (b.seriesPart || 0));

  return {
    ...def,
    articles: matchingArticles.map((art, idx) => ({
      slug: art.slug,
      titleId: art.titleId,
      titleEn: art.titleEn,
      excerptId: art.excerptId,
      excerptEn: art.excerptEn,
      readTimeMinutes: art.readTimeMinutes,
      seriesPart: art.seriesPart ?? (idx + 1),
      publishedAt: art.publishedAt,
    })),
  };
}

export async function getRelatedInsights(currentSlug: string, limit = 2): Promise<InsightArticle[]> {
  try {
    const articles = await getInsights();
    const current = articles.find((item) => item.slug === currentSlug);
    if (!current) return [];

    return articles
      .filter((item) => item.slug !== currentSlug)
      .sort((a, b) => {
        if (a.category === current.category && b.category !== current.category) return -1;
        if (b.category === current.category && a.category !== current.category) return 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, limit);
  } catch {
    const current = INSIGHTS_DATA.find((item) => item.slug === currentSlug);
    if (!current) return [];

    return INSIGHTS_DATA
      .filter((item) => item.slug !== currentSlug)
      .sort((a, b) => {
        if (a.category === current.category && b.category !== current.category) return -1;
        if (b.category === current.category && a.category !== current.category) return 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, limit);
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const articles = await getInsights();
    const categories = Array.from(new Set(articles.map((item) => item.category)));
    return ["All", ...categories];
  } catch {
    const categories = Array.from(new Set(INSIGHTS_DATA.map((item) => item.category)));
    return ["All", ...categories];
  }
}

export async function getAdjacentInsights(currentSlug: string): Promise<{
  prev: InsightArticle | null;
  next: InsightArticle | null;
}> {
  try {
    const articles = await getInsights();
    const index = articles.findIndex((item) => item.slug === currentSlug);
    if (index === -1) {
      return { prev: null, next: null };
    }
    return {
      prev: index > 0 ? articles[index - 1] : null,
      next: index < articles.length - 1 ? articles[index + 1] : null,
    };
  } catch {
    const index = INSIGHTS_DATA.findIndex((item) => item.slug === currentSlug);
    if (index === -1) {
      return { prev: null, next: null };
    }
    return {
      prev: index > 0 ? INSIGHTS_DATA[index - 1] : null,
      next: index < INSIGHTS_DATA.length - 1 ? INSIGHTS_DATA[index + 1] : null,
    };
  }
}

