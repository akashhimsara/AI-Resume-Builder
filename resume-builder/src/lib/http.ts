import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function fail(message: string, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json({ error: { message, code } }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return fail(error.message, error.statusCode, error.code);
  }

  if (typeof error === "object" && error !== null) {
    const maybePrismaError = error as { code?: unknown; name?: unknown; message?: unknown };
    const code = maybePrismaError.code;
    const name = maybePrismaError.name;
    const message = typeof maybePrismaError.message === "string" ? maybePrismaError.message : "";

    if (name === "PrismaClientInitializationError") {
      if (message.includes("Can't reach database server")) {
        return fail("Unable to reach the database server", 503, "DATABASE_UNAVAILABLE");
      }

      if (message.includes("Authentication failed") || message.includes("password authentication failed")) {
        return fail("Database authentication failed", 503, "DATABASE_AUTH_FAILED");
      }

      if (message.includes("Environment variable not found")) {
        return fail("Required database environment variable is missing", 500, "ENV_VAR_MISSING");
      }

      if (message.includes("Error validating datasource") || message.includes("the URL must start with")) {
        return fail("Database connection string is invalid", 500, "DATABASE_URL_INVALID");
      }

      return fail("Database initialization failed", 503, "DATABASE_INIT_FAILED");
    }

    if (typeof code === "string") {
      if (code === "P1001") {
        return fail("Unable to reach the database server", 503, "DATABASE_UNAVAILABLE");
      }

      if (code === "P2002") {
        return fail("A record with this value already exists", 409, "UNIQUE_CONSTRAINT_VIOLATION");
      }

      if (code === "P2021") {
        return fail("A required database table is missing", 500, "DATABASE_SCHEMA_MISSING");
      }

      if (code === "P2022") {
        return fail("A required database column is missing", 500, "DATABASE_SCHEMA_MISSING");
      }

      if (code === "P2025") {
        return fail("The requested record was not found", 404, "RECORD_NOT_FOUND");
      }
    }
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const issuePath = firstIssue?.path?.join(".");
    const message = issuePath
      ? `${issuePath}: ${firstIssue.message}`
      : (firstIssue?.message ?? "Validation failed");
    return fail(message, 422, "VALIDATION_ERROR");
  }

  console.error(error);
  return fail("Internal server error", 500, "INTERNAL_SERVER_ERROR");
}
