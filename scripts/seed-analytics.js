import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock leads and audit logs for Phase 5 Analytics...');

  // Clean existing leads and audit logs to avoid duplicate key violations or messy states
  await prisma.auditLog.deleteMany({});
  await prisma.lead.deleteMany({
    where: {
      email: {
        contains: 'mock_test_'
      }
    }
  });

  const now = new Date();

  // Helper to create date relative to now
  const getPastDate = (monthsAgo, daysAgo) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  // Create mock leads with various statuses and timestamps
  const leadsData = [
    {
      name: 'Rian Kusuma',
      email: 'mock_test_rian@gmail.com',
      service: 'Web Development',
      scale: 'large',
      message: 'Halo, saya ingin membuat landing page e-commerce berkecepatan tinggi.',
      status: 'WON',
      createdAt: getPastDate(5, 12), // 5 months ago
      statusSetAt: getPastDate(5, 8),  // converted in 4 days
    },
    {
      name: 'Siti Aminah',
      email: 'mock_test_siti@gmail.com',
      service: 'Mobile App',
      scale: 'medium',
      message: 'Saya butuh aplikasi reservasi klinik kecantikan untuk Android dan iOS.',
      status: 'WON',
      createdAt: getPastDate(4, 15), // 4 months ago
      statusSetAt: getPastDate(4, 10), // converted in 5 days
    },
    {
      name: 'Aditya Hermawan',
      email: 'mock_test_adit@gmail.com',
      service: 'UI/UX Design',
      scale: 'small',
      message: 'Redesign UI dashboard internal perusahaan kami.',
      status: 'LOST',
      createdAt: getPastDate(4, 2),
      statusSetAt: getPastDate(4, 1),
    },
    {
      name: 'Dewi Lestari',
      email: 'mock_test_dewi@gmail.com',
      service: 'E-Commerce',
      scale: 'large',
      message: 'Integrasi sistem pembayaran lokal ke web store Shopify kami.',
      status: 'WON',
      createdAt: getPastDate(3, 20),
      statusSetAt: getPastDate(3, 18), // converted in 2 days
    },
    {
      name: 'Rudi Tabuti',
      email: 'mock_test_rudi@gmail.com',
      service: 'Custom Software',
      scale: 'large',
      message: 'Sistem ERP sederhana untuk manajemen inventaris gudang.',
      status: 'NEW',
      createdAt: getPastDate(3, 5),
      statusSetAt: getPastDate(3, 5),
    },
    {
      name: 'Budi Santoso',
      email: 'mock_test_budi@gmail.com',
      service: 'Web Development',
      scale: 'medium',
      message: 'Pembuatan website profil sekolah dasar negeri.',
      status: 'REVIEWING',
      createdAt: getPastDate(2, 25),
      statusSetAt: getPastDate(2, 24),
    },
    {
      name: 'Amalia Putri',
      email: 'mock_test_amalia@gmail.com',
      service: 'UI/UX Design',
      scale: 'small',
      message: 'Desain portfolio pribadi untuk fotografer profesional.',
      status: 'WON',
      createdAt: getPastDate(2, 10),
      statusSetAt: getPastDate(2, 9), // converted in 1 day
    },
    {
      name: 'FX Nugroho',
      email: 'mock_test_nugroho@gmail.com',
      service: 'Web Development',
      scale: 'large',
      message: 'Web portal berita regional dengan ribuan visitor harian.',
      status: 'PROPOSAL',
      createdAt: getPastDate(1, 18),
      statusSetAt: getPastDate(1, 15),
    },
    {
      name: 'Lestari Indah',
      email: 'mock_test_lestari@gmail.com',
      service: 'Mobile App',
      scale: 'medium',
      message: 'Aplikasi pelacakan kurir logistik berbasis lokasi.',
      status: 'WON',
      createdAt: getPastDate(1, 5),
      statusSetAt: getPastDate(1, 2), // converted in 3 days
    },
    {
      name: 'Hendra Wijaya',
      email: 'mock_test_hendra@gmail.com',
      service: 'Custom Software',
      scale: 'large',
      message: 'Aplikasi SaaS manajemen reservasi coworking space.',
      status: 'NEW',
      createdAt: getPastDate(0, 4),
      statusSetAt: getPastDate(0, 4),
    },
    {
      name: 'Diana Sari',
      email: 'mock_test_diana@gmail.com',
      service: 'Web Development',
      scale: 'medium',
      message: 'Website reservasi restoran dengan sistem e-menu.',
      status: 'NEW',
      createdAt: getPastDate(0, 1),
      statusSetAt: getPastDate(0, 1),
    }
  ];

  console.log(`Creating ${leadsData.length} mock leads...`);
  const createdLeads = [];
  for (const item of leadsData) {
    const created = await prisma.lead.create({
      data: item
    });
    createdLeads.push(created);
  }

  // Create mock audit logs reflecting state changes over time
  console.log('Creating mock audit logs...');
  const auditLogsData = [
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[0].id,
      entityName: createdLeads[0].name,
      oldValue: 'NEW',
      newValue: 'REVIEWING',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(5, 11),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[0].id,
      entityName: createdLeads[0].name,
      oldValue: 'REVIEWING',
      newValue: 'WON',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(5, 8),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[1].id,
      entityName: createdLeads[1].name,
      oldValue: 'NEW',
      newValue: 'REVIEWING',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(4, 14),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[1].id,
      entityName: createdLeads[1].name,
      oldValue: 'REVIEWING',
      newValue: 'WON',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(4, 10),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[2].id,
      entityName: createdLeads[2].name,
      oldValue: 'NEW',
      newValue: 'LOST',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(4, 1),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[3].id,
      entityName: createdLeads[3].name,
      oldValue: 'NEW',
      newValue: 'WON',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(3, 18),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[6].id,
      entityName: createdLeads[6].name,
      oldValue: 'NEW',
      newValue: 'WON',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(2, 9),
    },
    {
      action: 'LEAD_STATUS_CHANGE',
      entityId: createdLeads[8].id,
      entityName: createdLeads[8].name,
      oldValue: 'NEW',
      newValue: 'WON',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(1, 2),
    },
    {
      action: 'MILESTONE_STATUS_CHANGE',
      entityId: 'milestone-1',
      entityName: 'Fase 1: Kickoff & Research',
      projectName: 'Aplikasi Reservasi Klinik',
      oldValue: 'To Do',
      newValue: 'In Progress',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(0, 15),
    },
    {
      action: 'TASK_STATUS_CHANGE',
      entityId: 'task-1',
      entityName: 'Setup VPS Deployment',
      projectName: 'E-Commerce Website',
      oldValue: 'To Do',
      newValue: 'Done',
      userName: 'Admin SejatiDimedia',
      createdAt: getPastDate(0, 3),
    }
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({
      data: log
    });
  }

  console.log('✅ Mock data seeded successfully for Phase 5!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding analytics data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
