import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUserFromRequest } from "@/server/auth/session.service";
import { createBillingCheckout } from "@/server/billing/billing.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUserFromRequest(request);
    const checkout = await createBillingCheckout(user.id);

    return ok({
      checkoutUrl: checkout.url,
      checkoutSessionId: checkout.id,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
