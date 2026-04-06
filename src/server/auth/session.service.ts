import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { getUserById, type PublicUser } from "@/server/auth/auth.service";

type AuthOptions = {
  request?: NextRequest;
  redirectTo?: string;
};

function unauthorized() {
  return new AppError("Unauthorized", 401, "UNAUTHORIZED");
}

function forbidden() {
  return new AppError("Forbidden", 403, "FORBIDDEN");
}

async function getTokenFromRequestOrCookies(request?: NextRequest) {
  if (request) {
    return request.cookies.get(AUTH_COOKIE_NAME)?.value;
  }

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

async function resolveUserFromToken(token?: string): Promise<PublicUser | null> {
  if (!token) {
    return null;
  }

  let payload;
  try {
    payload = await verifySessionToken(token);
  } catch {
    return null;
  }

  const user = await getUserById(payload.sub);
  if (!user || user.sessionVersion !== payload.sessionVersion) {
    return null;
  }

  return user;
}

function throwOrRedirectIfUnauthorized(redirectTo?: string): never {
  if (redirectTo) {
    redirect(redirectTo);
  }

  throw unauthorized();
}

function throwOrRedirectIfForbidden(redirectTo?: string): never {
  if (redirectTo) {
    redirect(redirectTo);
  }

  throw forbidden();
}

export async function getCurrentUser(request?: NextRequest): Promise<PublicUser | null> {
  const token = await getTokenFromRequestOrCookies(request);
  return resolveUserFromToken(token);
}

export async function requireUser(options: AuthOptions = {}): Promise<PublicUser> {
  const user = await getCurrentUser(options.request);

  if (!user) {
    throwOrRedirectIfUnauthorized(options.redirectTo);
  }

  return user;
}

export async function requireAdmin(options: AuthOptions = {}): Promise<PublicUser> {
  const user = await requireUser(options);

  if (user.role !== "ADMIN") {
    throwOrRedirectIfForbidden(options.redirectTo);
  }

  return user;
}

export async function requireUserFromRequest(request: NextRequest): Promise<PublicUser> {
  return requireUser({ request });
}

export async function requireUserFromCookies(): Promise<PublicUser> {
  return requireUser();
}
