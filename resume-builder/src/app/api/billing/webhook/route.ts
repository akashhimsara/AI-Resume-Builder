import { NextRequest } from "next/server";
import { AppError } from "@/lib/errors";
import { handleRouteError, ok } from "@/lib/http";
import { handleStripeWebhook } from "@/server/billing/billing.service";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new AppError("Missing Stripe signature", 400, "MISSING_SIGNATURE");
    }

    const body = await request.text();
    await handleStripeWebhook(body, signature);

    return ok({ received: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
