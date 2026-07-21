import re

# We will just manually construct the replacements since regex might fail on multiline JSX.

def update_dict(filename, is_id):
    with open(filename, 'r') as f:
        content = f.read()

    if 'milestones:' not in content:
        # Add all the remaining structures to the dictionaries!
        
        if is_id:
            new_objects = """
  milestones: [
    {
      step: '01',
      title: 'Discovery',
      tag: 'Fase 1: Analisis & Kebutuhan',
      description: 'Memahami kebutuhan bisnis, target pengguna, dan tujuan proyek Anda secara mendalam sebelum menulis satu baris kode pun.',
      deliverables: ['Dokumen Spesifikasi Teknis', 'Skema Logika Bisnis', 'Estimasi Timeline & Biaya']
    },
    {
      step: '02',
      title: 'Design',
      tag: 'Fase 2: Arsitektur UI/UX',
      description: 'Merancang rancangan UI/UX dan memetakan arsitektur sistem (database & API) agar alur navigasi produk terasa natural dan performa terjamin.',
      deliverables: ['Desain Figma Interaktif', 'Skema Struktur Database', 'Peta Alur Kerja Data']
    },
    {
      step: '03',
      title: 'Development',
      tag: 'Fase 3: Pemrograman Kustom',
      description: 'Membangun produk menggunakan kode yang bersih, terstruktur, aman, dan mudah dikembangkan lebih lanjut. Menghindari template drag-and-drop.',
      deliverables: ['Kode Sumber Terstruktur', 'Sistem Autentikasi Keamanan', 'Integrasi Layanan Pihak Ketiga']
    },
    {
      step: '04',
      title: 'Testing & Iterasi',
      tag: 'Fase 4: Uji Coba & Perbaikan',
      description: 'Melakukan pengujian menyeluruh di berbagai perangkat dan skenario penggunaan sebelum produk dirilis, termasuk revisi berdasarkan feedback Anda.',
      deliverables: ['Laporan Pengujian Bug', 'Optimasi Kecepatan (Lighthouse)', 'Revisi Sesuai Feedback']
    },
    {
      step: '05',
      title: 'Deployment',
      tag: 'Fase 5: Peluncuran Sistem',
      description: 'Meluncurkan produk digital Anda ke server produksi yang aman dan terkonfigurasi dengan baik (seperti Vercel, AWS, atau VPS Cloud).',
      deliverables: ['Aplikasi Live di Produksi', 'Konfigurasi Domain & SSL', 'Backup Database Awal']
    },
    {
      step: '06',
      title: 'Maintenance & Support',
      tag: 'Fase 6: Pendampingan & Pemeliharaan',
      description: 'Memberikan pendampingan berkelanjutan pasca-peluncuran berupa pemeliharaan server, perbaikan bug jika ada, dan pembaruan sistem berkala.',
      deliverables: ['Pemantauan Server Rutin', 'Pembaruan Patch Keamanan', 'Bantuan Teknis Berkala']
    }
  ],
  pricingCards: {
    starterTag: "MVP & Validasi",
    starterTitle: "Starter — Prototype",
    starterDesc: "Sempurna untuk startup yang ingin memvalidasi ide ke pasar dengan cepat namun tetap profesional.",
    starterPrice: "Mulai dari",
    starterIncludes: [
      'Frontend (React/Next.js) Responsif',
      'Backend (Node/Go) & Database Dasar',
      'Desain UI/UX Eksklusif (Tailwind)',
      'Garansi Bug Fixing 30 Hari',
      '100% Hak Cipta & Source Code'
    ],
    growthTag: "Skala Produksi",
    growthTitle: "Growth — Siap Skala",
    growthDesc: "Aplikasi skala penuh dengan arsitektur tangguh dan performa optimal untuk menampung ribuan pengguna aktif.",
    growthIncludes: [
      'Web Application + API Backend',
      'Integrasi Pembayaran & Autentikasi',
      'Dashboard Admin & Manajemen',
      'Pendampingan 30 Hari Pasca-Launch',
      '100% Hak Cipta & Source Code'
    ],
    customTag: "Skala Enterprise",
    customTitle: "Custom — Sistem Kompleks",
    customDesc: "Cocok untuk kebutuhan sistem skala besar, arsitektur rumit, dan terintegrasi dengan banyak proses bisnis operasional.",
    customIncludes: [
      'Arsitektur Multi-Platform',
      'Timeline & Scope Kustom',
      'Dukungan Lanjutan Sesuai Kesepakatan',
      'Dokumentasi API & Arsitektur Lengkap',
      'Pemeliharaan Server Berkala'
    ]
  },
  faq: {
    badge: "FAQ",
    mainHeading: "Pertanyaan Umum",
    askTitle: "Ada Pertanyaan?",
    askDesc: "Tanyakan apa saja terkait kebutuhan pengembangan software, revisi, atau penawaran khusus.",
    askLabel: "Tulis pertanyaan Anda.",
    askPlaceholder: "Tulis di sini...",
    askSuccess: "Konsultasi Berhasil Dikirim!",
    askSuccessDesc: "Saya akan membalas pertanyaan Anda ke email yang Anda daftarkan maksimal dalam 24 jam kerja.",
    items: [
      {
        q: "Berapa lama estimasi pengerjaan sebuah proyek?",
        a: "Bergantung pada kompleksitas. Untuk paket Starter biasanya memakan waktu 3-4 minggu. Untuk paket Growth (aplikasi full-stack) sekitar 1-2 bulan. Proyek Custom menyesuaikan dengan scope pekerjaan yang disepakati di awal."
      },
      {
        q: "Apakah saya mendapatkan akses ke seluruh source code?",
        a: "Ya, 100%. Setelah proyek selesai dan pembayaran dilunasi, seluruh source code, hak cipta, dan aset digital sepenuhnya menjadi milik Anda. Saya juga menyertakan dokumentasi cara menjalankannya."
      },
      {
        q: "Bagaimana sistem pembayarannya?",
        a: "Pembayaran dilakukan secara bertahap (Termin) berdasarkan milestone yang disepakati. Biasanya dibagi menjadi 3 tahap: 30% Down Payment, 40% setelah Beta Release (siap diuji coba), dan 30% pelunasan setelah proyek siap rilis ke publik."
      },
      {
        q: "Bagaimana jika ada bug setelah proyek selesai?",
        a: "Setiap paket sudah termasuk garansi perbaikan bug secara gratis selama 30 hari pasca-peluncuran (Live). Jika lewat dari itu, kita bisa menyepakati kontrak maintenance bulanan jika Anda butuh pendampingan terus-menerus."
      },
      {
        q: "Saya butuh NDA (Non-Disclosure Agreement), apakah bisa?",
        a: "Tentu. Privasi ide dan data perusahaan Anda adalah prioritas. Saya sangat terbuka untuk menandatangani NDA sebelum kita mendiskusikan detail proyek lebih dalam."
      }
    ]
  },
  legal: {
    privacy: "KEBIJAKAN PRIVASI",
    terms: "SYARAT & KETENTUAN"
  },"""
        else:
            new_objects = """
  milestones: [
    {
      step: '01',
      title: 'Discovery',
      tag: 'Phase 1: Analysis & Requirements',
      description: 'Understanding your business needs, target users, and project goals deeply before writing a single line of code.',
      deliverables: ['Technical Specification Doc', 'Business Logic Schema', 'Timeline & Cost Estimation']
    },
    {
      step: '02',
      title: 'Design',
      tag: 'Phase 2: UI/UX Architecture',
      description: 'Designing UI/UX and mapping system architecture (database & API) so navigation feels natural and performance is guaranteed.',
      deliverables: ['Interactive Figma Design', 'Database Structure Schema', 'Data Workflow Map']
    },
    {
      step: '03',
      title: 'Development',
      tag: 'Phase 3: Custom Programming',
      description: 'Building products using clean, structured, secure, and maintainable code. Avoiding drag-and-drop templates.',
      deliverables: ['Structured Source Code', 'Security Authentication System', 'Third-party API Integrations']
    },
    {
      step: '04',
      title: 'Testing & Iteration',
      tag: 'Phase 4: Testing & Refinement',
      description: 'Conducting comprehensive testing across devices and scenarios before launch, including revisions based on your feedback.',
      deliverables: ['Bug Testing Report', 'Speed Optimization (Lighthouse)', 'Feedback-based Revisions']
    },
    {
      step: '05',
      title: 'Deployment',
      tag: 'Phase 5: System Launch',
      description: 'Deploying your digital product to a secure and well-configured production server (like Vercel, AWS, or Cloud VPS).',
      deliverables: ['Live Production App', 'Domain & SSL Configuration', 'Initial Database Backup']
    },
    {
      step: '06',
      title: 'Maintenance & Support',
      tag: 'Phase 6: Support & Maintenance',
      description: 'Providing ongoing post-launch support including server maintenance, bug fixes if any, and regular system updates.',
      deliverables: ['Routine Server Monitoring', 'Security Patch Updates', 'Periodic Technical Support']
    }
  ],
  pricingCards: {
    starterTag: "MVP & Validation",
    starterTitle: "Starter — Prototype",
    starterDesc: "Perfect for startups wanting to validate ideas to the market quickly while staying professional.",
    starterPrice: "Starting from",
    starterIncludes: [
      'Responsive Frontend (React/Next.js)',
      'Basic Backend (Node/Go) & Database',
      'Exclusive UI/UX Design (Tailwind)',
      '30-Day Bug Fixing Guarantee',
      '100% Copyright & Source Code'
    ],
    growthTag: "Production Scale",
    growthTitle: "Growth — Ready to Scale",
    growthDesc: "Full-scale application with robust architecture and optimal performance to handle thousands of active users.",
    growthIncludes: [
      'Web Application + API Backend',
      'Payment & Authentication Integration',
      'Admin & Management Dashboard',
      '30-Day Post-Launch Support',
      '100% Copyright & Source Code'
    ],
    customTag: "Enterprise Scale",
    customTitle: "Custom — Complex Systems",
    customDesc: "Suitable for large-scale systems, complex architectures, and integrations with numerous operational business processes.",
    customIncludes: [
      'Multi-Platform Architecture',
      'Custom Timeline & Scope',
      'Advanced Support as Agreed',
      'Complete API & Architecture Docs',
      'Periodic Server Maintenance'
    ]
  },
  faq: {
    badge: "FAQ",
    mainHeading: "Common Questions",
    askTitle: "Have a Question?",
    askDesc: "Ask anything regarding software development needs, revisions, or special offers.",
    askLabel: "Write your question.",
    askPlaceholder: "Type here...",
    askSuccess: "Consultation Sent Successfully!",
    askSuccessDesc: "I will reply to your question to the email you registered within a maximum of 24 working hours.",
    items: [
      {
        q: "What is the estimated timeline for a project?",
        a: "It depends on complexity. The Starter package usually takes 3-4 weeks. The Growth package (full-stack app) takes about 1-2 months. Custom projects adapt to the agreed scope of work."
      },
      {
        q: "Do I get access to the full source code?",
        a: "Yes, 100%. After the project is completed and paid in full, all source code, copyrights, and digital assets become entirely yours. I also provide documentation on how to run it."
      },
      {
        q: "How does the payment system work?",
        a: "Payments are made in stages (Milestones). Usually divided into 3 stages: 30% Down Payment, 40% after Beta Release, and 30% final payment after the project is ready for public release."
      },
      {
        q: "What if there are bugs after the project is finished?",
        a: "Every package includes a free 30-day bug fixing guarantee post-launch (Live). After that, we can agree on a monthly maintenance contract if you need ongoing support."
      },
      {
        q: "I need an NDA (Non-Disclosure Agreement), is that possible?",
        a: "Absolutely. The privacy of your ideas and company data is a priority. I am very open to signing an NDA before we discuss the project details further."
      }
    ]
  },
  legal: {
    privacy: "PRIVACY POLICY",
    terms: "TERMS & CONDITIONS"
  },"""
        
        content = content.replace('footer: {', new_objects + '\n  footer: {')

        with open(filename, 'w') as f:
            f.write(content)

update_dict('src/lib/i18n/id.ts', True)
update_dict('src/lib/i18n/en.ts', False)
