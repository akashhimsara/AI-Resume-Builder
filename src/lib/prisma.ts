import { PrismaClient } from "@prisma/client";

function assertPrismaConnectionConfig() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!directUrl) {
    throw new Error("DIRECT_URL is not set");
  }

  let parsedDatabaseUrl: URL;
  let parsedDirectUrl: URL;

  try {
    parsedDatabaseUrl = new URL(databaseUrl);
    parsedDirectUrl = new URL(directUrl);
  } catch {
    throw new Error("DATABASE_URL and DIRECT_URL must be valid URLs");
  }

  if (parsedDatabaseUrl.searchParams.get("sslmode") !== "require") {
    throw new Error("DATABASE_URL must include sslmode=require in production");
  }

  if (parsedDirectUrl.searchParams.get("sslmode") !== "require") {
    throw new Error("DIRECT_URL must include sslmode=require in production");
  }
}

assertPrismaConnectionConfig();

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
