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
