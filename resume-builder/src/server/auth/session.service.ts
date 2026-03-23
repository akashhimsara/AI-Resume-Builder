import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { getUserById, type PublicUser } from "@/server/auth/auth.service";

async function resolveUserFromToken(token?: string): Promise<PublicUser> {
  if (!token) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let payload;
  try {
    payload = await verifySessionToken(token);
  } catch {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const user = await getUserById(payload.sub);
  if (!user || user.sessionVersion !== payload.sessionVersion) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return user;
}

export async function requireUserFromRequest(request: NextRequest): Promise<PublicUser> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return resolveUserFromToken(token);
}

export async function requireUserFromCookies(): Promise<PublicUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return resolveUserFromToken(token);
}
