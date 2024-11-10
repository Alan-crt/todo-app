// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

// Declare PrismaClient in the global scope
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
export type { Prisma };