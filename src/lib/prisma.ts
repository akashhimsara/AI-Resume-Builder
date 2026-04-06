import { PrismaClient } from "@prisma/client";

declare global {
  // Keep one Prisma instance on globalThis during development. App Router hot reloads
  // modules frequently, and without this singleton we would create many connections.
  var prisma: PrismaClient | undefined;
}

// Reuse existing client if available, otherwise create one.
const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// In development, cache the client across module reloads.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

export const prisma = prismaClient;
