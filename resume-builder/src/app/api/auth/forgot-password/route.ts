import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { forgotPasswordSchema } from "@/server/auth/auth.schemas";
import { requestPasswordReset } from "@/server/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = forgotPasswordSchema.parse(json);

    await requestPasswordReset(input);

    return ok({
      message:
        "If an account exists for that email, we sent a password reset link. Please check your inbox.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
