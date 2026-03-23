import { jwtVerify, SignJWT } from "jose";
import { env } from "@/lib/env";

export const AUTH_COOKIE_NAME = "rb_session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const secret = new TextEncoder().encode(env.AUTH_JWT_SECRET);

export type SessionPayload = {
  sub: string;
  role: "USER" | "ADMIN";
  sessionVersion: number;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload as unknown as SessionPayload;
}
