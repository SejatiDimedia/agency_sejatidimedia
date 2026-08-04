import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock invoices for PRD Section 4.8 Invoice & Billing Project...');

  const projects = await prisma.project.findMany({
    take: 5,
  });

  if (projects.length === 0) {
    console.log('No active projects found to attach invoices to. Skipping seed.');
    return;
  }

  // Clear existing test invoices if needed
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});

  const today = new Date();
  const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

  const getDateOffset = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  const project1 = projects[0];
  const project2 = projects.length > 1 ? projects[1] : projects[0];

  // 1. Invoice 1 (PAID)
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202608-001',
      status: 'PAID',
      issuedDate: getDateOffset(-20),
      dueDate: getDateOffset(-6),
      subtotal: 20000000,
      taxPercent: 11,
      taxAmount: 2200000,
      total: 22200000,
      notes: 'Pembayaran DP 50% untuk Proyek Pengembangan Sistem & Web Agency.',
      bankInfo: 'Bank BCA: 1234-5678-90 a.n. PT SejatiDimedia Technology\nBank Mandiri: 987-00-1234567-8 a.n. Timur Dian Radha Sejati',
      paidAt: new Date(Date.now() - 7 * 86400000),
      projectId: project1.id,
      items: {
        create: [
          {
            description: 'Termin 1 (DP 50%): Desain UI/UX & High Fidelity Wireframes',
            quantity: 1,
            unitPrice: 12000000,
            amount: 12000000,
            order: 0,
          },
          {
            description: 'Setup Environment & Database Schema Deployment',
            quantity: 1,
            unitPrice: 8000000,
            amount: 8000000,
            order: 1,
          },
        ],
      },
    },
  });
  console.log(`✅ Created Invoice 1: ${inv1.invoiceNumber} (PAID)`);

  // 2. Invoice 2 (SENT - Awaiting Payment)
  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202608-002',
      status: 'SENT',
      issuedDate: getDateOffset(-3),
      dueDate: getDateOffset(11),
      subtotal: 15000000,
      taxPercent: 0,
      taxAmount: 0,
      total: 15000000,
      notes: 'Pelunasan Termin 2 (50%) - Penyelesaian Milestone Core Development & R2 Storage.',
      bankInfo: 'Bank BCA: 1234-5678-90 a.n. PT SejatiDimedia Technology',
      projectId: project1.id,
      items: {
        create: [
          {
            description: 'Pelunasan 50%: Core Backend API & Client Portal Integration',
            quantity: 1,
            unitPrice: 15000000,
            amount: 15000000,
            order: 0,
          },
        ],
      },
    },
  });
  console.log(`✅ Created Invoice 2: ${inv2.invoiceNumber} (SENT)`);

  // 3. Invoice 3 (OVERDUE)
  if (project2) {
    const inv3 = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-202608-003',
        status: 'OVERDUE',
        issuedDate: getDateOffset(-25),
        dueDate: getDateOffset(-5),
        subtotal: 8500000,
        taxPercent: 11,
        taxAmount: 935000,
        total: 9435000,
        notes: 'Tagihan Tambahan: Biaya Domain .com (1 thn) & Lisensi VPS Server Prod.',
        bankInfo: 'Bank BCA: 1234-5678-90 a.n. PT SejatiDimedia Technology',
        projectId: project2.id,
        items: {
          create: [
            {
              description: 'Lisensi VPS Production Server (12 Bulan)',
              quantity: 1,
              unitPrice: 7500000,
              amount: 7500000,
              order: 0,
            },
            {
              description: 'Registrasi Domain Enterprise .com',
              quantity: 1,
              unitPrice: 1000000,
              amount: 1000000,
              order: 1,
            },
          ],
        },
      },
    });
    console.log(`✅ Created Invoice 3: ${inv3.invoiceNumber} (OVERDUE)`);
  }

  // Seed Audit Logs for Invoices
  await prisma.auditLog.create({
    data: {
      action: 'INVOICE_STATUS_CHANGE',
      entityId: inv1.id,
      entityName: inv1.invoiceNumber,
      projectName: project1.name,
      oldValue: 'SENT',
      newValue: 'PAID',
      userName: 'Timur Dian Radha Sejati (Admin)',
    },
  });

  console.log('✅ Invoices seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding invoices:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
