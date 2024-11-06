import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances of Prisma Client in development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };

// Add type declaration for global prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}