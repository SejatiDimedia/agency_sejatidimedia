import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@sejatidimedia.com';
  const rawPassword = 'Admin123';
  const name = 'Admin SejatiDimedia';

  console.log(`Seeding Admin User in schema 'agency_sejatidimedia'...`);
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: 'ADMIN',
      passwordHash,
      activatedAt: new Date(),
    },
    create: {
      email,
      name,
      role: 'ADMIN',
      passwordHash,
      activatedAt: new Date(),
    },
  });

  console.log(`✅ Admin User seeded successfully!`);
  console.log(`ID: ${adminUser.id}`);
  console.log(`Email: ${adminUser.email}`);
  console.log(`Role: ${adminUser.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
