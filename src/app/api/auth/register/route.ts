import { NextRequest } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/http";
import { registerSchema } from "@/server/auth/auth.schemas";
import { registerUser } from "@/server/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = registerSchema.parse(json);

    const user = await registerUser(input);
    const token = await createSessionToken({
      sub: user.id,
      role: user.role,
      sessionVersion: user.sessionVersion,
    });

    const response = ok({ user }, 201);
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
