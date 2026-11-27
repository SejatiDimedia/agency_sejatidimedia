import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const cachedPrisma = globalForPrisma.prisma;
const isStaleClient = cachedPrisma && !('staticWebProject' in cachedPrisma);

export const prisma =
  cachedPrisma && !isStaleClient
    ? cachedPrisma
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
