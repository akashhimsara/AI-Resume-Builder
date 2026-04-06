import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session.service";
import { tailorResumeToJobDescription } from "@/server/ai/ai.service";
import { tailorResumeSchema } from "@/server/ai/ai.schemas";
import { handleRouteError } from "@/lib/http";
import { enforceAIRateLimit } from "@/server/ai/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const user = await requireUser();

    // 2. Rate Limit Check (Redis Sliding Window)
    const rateLimit = await enforceAIRateLimit(user.id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: { message: "Too many AI requests. Please wait a minute and try again." } },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 3. Parse & Validate input (Zod)
    const json = await req.json();
    const payload = tailorResumeSchema.parse(json);

    // 4. Generate tailor review data
    const analysis = await tailorResumeToJobDescription(payload);

    return NextResponse.json({ data: analysis });
  } catch (error) {
    return handleRouteError(error);
  }
}
