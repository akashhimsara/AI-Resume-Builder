import { NextRequest } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/http";
import { loginSchema } from "@/server/auth/auth.schemas";
import { loginUser } from "@/server/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = loginSchema.parse(json);

    const user = await loginUser(input);
    const token = await createSessionToken({
      sub: user.id,
      role: user.role,
      sessionVersion: user.sessionVersion,
    });

    const response = ok({ user });
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
