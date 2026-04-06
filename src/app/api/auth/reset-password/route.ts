import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { resetPasswordSchema } from "@/server/auth/auth.schemas";
import { resetPassword, validatePasswordResetToken } from "@/server/auth/auth.service";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
    if (!token) {
      return ok({ valid: false });
    }

    const valid = await validatePasswordResetToken(token);
    return ok({ valid });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = resetPasswordSchema.parse(json);

    await resetPassword(input);

    return ok({
      message: "Your password has been reset successfully. You can now sign in.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
