const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projectId = 'cmsboo7dm00039zhfr7xvl1ih';
  console.log(`Checking project with ID: ${projectId}...`);

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    console.error(`Project with ID ${projectId} not found!`);
    process.exit(1);
  }

  console.log(`Found project: "${project.name}". Creating dummy milestones and tasks...`);

  // Clear existing milestones and tasks for clean seed
  await prisma.milestone.deleteMany({
    where: { projectId }
  });

  // Create Milestone 1
  const m1 = await prisma.milestone.create({
    data: {
      projectId,
      title: 'Fase 1: Kickoff & Research',
      description: 'Tahap inisiasi proyek, pengumpulan PRD, dan riset awal.',
      status: 'Done',
      dueDate: '10 Aug 2026',
      tasks: {
        create: [
          { title: 'Rapat inisiasi proyek & persetujuan PRD', isDone: true },
          { title: 'Analisis kompetitor & pembuatan user flow', isDone: true }
        ]
      }
    }
  });
  console.log('Created Milestone 1:', m1.title);

  // Create Milestone 2
  const m2 = await prisma.milestone.create({
    data: {
      projectId,
      title: 'Fase 2: UI/UX Design System',
      description: 'Pembuatan wireframe, desain visual presisi tinggi, dan design system agency.',
      status: 'In Progress',
      dueDate: '25 Aug 2026',
      tasks: {
        create: [
          { title: 'Desain Wireframe Hi-Fi Mobile & Desktop', isDone: true },
          { title: 'Pembuatan Design System & Asset UI', isDone: false },
          { title: 'Review desain UI dengan klien via WA/Email', isDone: false }
        ]
      }
    }
  });
  console.log('Created Milestone 2:', m2.title);

  // Create Milestone 3
  const m3 = await prisma.milestone.create({
    data: {
      projectId,
      title: 'Fase 3: Core Development',
      description: 'Setup framework Next.js, integrasi schema database Neon, dan logic utama.',
      status: 'To Do',
      dueDate: '15 Sep 2026',
      tasks: {
        create: [
          { title: 'Setup environment development & database schema', isDone: false },
          { title: 'Implementasi API endpoints & state management', isDone: false },
          { title: 'Pengujian fungsionalitas unit & integrasi', isDone: false }
        ]
      }
    }
  });
  console.log('Created Milestone 3:', m3.title);

  // Create Milestone 4
  const m4 = await prisma.milestone.create({
    data: {
      projectId,
      title: 'Fase 4: Deployment & Handover',
      description: 'Pemindahan ke VPS produksi / Vercel, pelatihan admin panel, dan serah terima aset.',
      status: 'To Do',
      dueDate: '30 Sep 2026',
      tasks: {
        create: [
          { title: 'Setup VPS / production Vercel deployment', isDone: false },
          { title: 'Pelatihan admin panel & serah terima dokumentasi teknis', isDone: false }
        ]
      }
    }
  });
  console.log('Created Milestone 4:', m4.title);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
