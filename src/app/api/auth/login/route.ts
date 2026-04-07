import { NextRequest } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/http";
import { loginSchema } from "@/server/auth/auth.schemas";
import { loginUser } from "@/server/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    console.info("Login route received request");
    const json = await request.json();
    const input = loginSchema.parse(json);

    const user = await loginUser(input);
    console.info("Login route creating session token", { userId: user.id, email: user.email });

    let token: string;
    try {
      token = await createSessionToken({
        sub: user.id,
        role: user.role,
        sessionVersion: user.sessionVersion,
      });
    } catch (error) {
      console.error("Login route failed to create session token", {
        userId: user.id,
        email: user.email,
        error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
      });
      throw error;
    }

    const response = ok({ user });
    setSessionCookie(response, token);

    console.info("Login route completed successfully", { userId: user.id, email: user.email });
    return response;
  } catch (error) {
    console.error("Login route failed", {
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    });
    return handleRouteError(error);
  }
}
