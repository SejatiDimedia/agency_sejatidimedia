import { Lead, Project } from '../types/portal';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Budi Santoso',
    company: 'Nusantara Logistics',
    email: 'budi@nusantaralogistics.co.id',
    phone: '+62 812-3456-7890',
    serviceType: 'Web Development',
    budgetEstimate: 'Rp 45M - 65M',
    submittedDate: '10 Nov 2024',
    status: 'New',
    notes: 'Klien butuh redesign website perusahaan + integrasi tracking sistem pengiriman barang.',
    source: 'Website Form',
    message: 'Halo SejatiDimedia, kami ingin memperbarui seluruh ekosistem digital logistics kami agar lebih modern dan responsive.',
    timelineHistory: [
      {
        id: 'tl-1',
        status: 'New',
        timestamp: '10 Nov 2024, 09:15 WIB',
        author: 'System (Contact Form)',
        note: 'Lead otomatis masuk dari formulir landing page.'
      }
    ]
  },
  {
    id: 'lead-102',
    name: 'Siti Rahmawati',
    company: 'Awe Design Studio',
    email: 'siti@awedesign.com',
    phone: '+62 819-8765-4321',
    serviceType: 'UI/UX Design',
    budgetEstimate: 'Rp 25M - 35M',
    submittedDate: '08 Nov 2024',
    status: 'Reviewing',
    notes: 'Sudah dilakukan meeting discovery via Google Meet. Klien sangat puas dengan portofolio.',
    source: 'LinkedIn',
    message: 'Membutuhkan design system komprehensif untuk aplikasi mobile fintech kami.',
    timelineHistory: [
      {
        id: 'tl-2',
        status: 'New',
        timestamp: '08 Nov 2024, 14:00 WIB',
        author: 'System (Form)',
      },
      {
        id: 'tl-3',
        status: 'Reviewing',
        timestamp: '09 Nov 2024, 10:30 WIB',
        author: 'Timur (Admin)',
        note: 'Pitch proposal design system terkirim.'
      }
    ]
  },
  {
    id: 'lead-103',
    name: 'Hendrik Wijaya',
    company: 'Kopi Kenangan Rakyat',
    email: 'hendrik@kopirakyat.id',
    phone: '+62 857-1122-3344',
    serviceType: 'Mobile App',
    budgetEstimate: 'Rp 80M - 120M',
    submittedDate: '01 Nov 2024',
    status: 'Won',
    notes: 'DP 50% sudah diterima! Dibuatkan akun Client Portal & Project Active.',
    source: 'Referral',
    message: 'Ingin membuat aplikasi loyalty membership & order online kopi dengan React Native.',
    timelineHistory: [
      {
        id: 'tl-4',
        status: 'Won',
        timestamp: '05 Nov 2024, 16:45 WIB',
        author: 'Timur (Admin)',
        note: 'Deal disepakati, dikonversi menjadi Active Project.'
      }
    ]
  },
  {
    id: 'lead-104',
    name: 'Kevin Pratama',
    company: 'FastCrypto Exchange',
    email: 'kevin@fastcrypto.io',
    phone: '+62 811-9988-7766',
    serviceType: 'Custom Software',
    budgetEstimate: 'Rp 150M+',
    submittedDate: '25 Okt 2024',
    status: 'Lost',
    notes: 'Budget tidak sesuai dengan scope keamanan tingkat tinggi yang diminta.',
    source: 'Direct Email',
    message: 'Minta diprogramkan smart contract & exchange wallet dalam waktu 1 minggu.',
    timelineHistory: [
      {
        id: 'tl-5',
        status: 'Lost',
        timestamp: '27 Okt 2024, 11:00 WIB',
        author: 'Timur (Admin)',
        note: 'Ditolak karena kriteria deadline & scope tidak realistis.'
      }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    projectName: 'Kopi Kenangan Rakyat - Mobile App & Loyalty',
    clientName: 'Hendrik Wijaya',
    clientCompany: 'Kopi Kenangan Rakyat',
    clientEmail: 'hendrik@kopirakyat.id',
    status: 'Active',
    progress: 45,
    startDate: '05 Nov 2024',
    targetCompletion: '20 Des 2024',
    budget: 'Rp 95.000.000',
    lastUpdated: '2 jam yang lalu',
    nextMilestoneTitle: 'Integrasi Payment Gateway & QRIS',
    milestonesCount: { total: 5, completed: 2 },
    assignees: [
      { name: 'Timur Dian', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80', role: 'Fullstack Dev' },
      { name: 'Sarah UI', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', role: 'UI/UX Designer' }
    ],
    milestones: [
      {
        id: 'ms-1',
        title: 'Fase 1: Wireframing & Design System UI/UX',
        description: 'Pengerjaan alur pemesanan produk, halaman keranjang, dan desain kartu loyalty member.',
        dueDate: '15 Nov 2024',
        status: 'Done',
        tasks: [
          { id: 't-1', title: 'Riset Alur User Persona', completed: true },
          { id: 't-2', title: 'High-Fidelity Figma Prototype', completed: true },
          { id: 't-3', title: 'Design System & Component Tokens', completed: true }
        ],
        deliverables: [
          {
            id: 'f-1',
            fileName: 'UI_UX_Design_System_KopiRakyat_v1.pdf',
            fileSize: '14.2 MB',
            fileType: 'PDF Document',
            uploadDate: '14 Nov 2024',
            downloadUrl: '#'
          }
        ],
        comments: [
          {
            id: 'c-1',
            authorName: 'Hendrik Wijaya',
            authorRole: 'Client',
            timestamp: '15 Nov 2024, 10:30 WIB',
            content: 'Desain warnanya bagus sekali mas Timur! Sesuai dengan brand guideline kami.'
          }
        ]
      },
      {
        id: 'ms-2',
        title: 'Fase 2: Slicing React Native & Setup API Node.js',
        description: 'Pengembangan arsitektur antarmuka aplikasi seluler dan backend microservices.',
        dueDate: '30 Nov 2024',
        status: 'In Progress',
        tasks: [
          { id: 't-4', title: 'Setup Repository & Navigation Stack', completed: true },
          { id: 't-5', title: 'Slicing Halaman Dashboard Member', completed: true },
          { id: 't-6', title: 'Setup JWT Auth & Session Management', completed: false }
        ],
        deliverables: [],
        comments: []
      },
      {
        id: 'ms-3',
        title: 'Fase 3: Integrasi Payment Gateway & QRIS',
        description: 'Menghubungkan Midtrans payment gateway untuk kemudahan checkout otomatis.',
        dueDate: '10 Des 2024',
        status: 'To Do',
        tasks: [],
        deliverables: [],
        comments: []
      }
    ]
  }
];
