import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUser } from "@/server/auth/session.service";
import { createBillingCheckout } from "@/server/billing/billing.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser({ request });
    const checkout = await createBillingCheckout(user.id);

    return ok({
      url: checkout.url,
      sessionId: checkout.id,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
