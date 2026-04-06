import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUser } from "@/server/auth/session.service";
import { createBillingPortal } from "@/server/billing/billing.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser({ request });
    const portal = await createBillingPortal(user.id);

    return ok({
      portalUrl: portal.url,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
