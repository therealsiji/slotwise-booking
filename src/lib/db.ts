import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hasDatabaseConfig } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getDb() {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
