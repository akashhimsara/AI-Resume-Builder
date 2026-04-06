import { prisma } from "@/lib/prisma";

// Shared database utility entrypoint. Import from this file in services so
// future cross-cutting DB behaviors (metrics, retries, tracing) stay centralized.
export const db = prisma;

export async function verifyDatabaseConnection() {
  await db.$queryRaw`SELECT 1`;
}
