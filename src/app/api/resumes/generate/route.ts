import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUser } from "@/server/auth/session.service";
import { generateResumeSchema } from "@/server/resumes/resume.schemas";
import { generateAndCreateResume } from "@/server/resumes/resume.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser({ request });
    const json = await request.json();
    const input = generateResumeSchema.parse(json);

    const resume = await generateAndCreateResume(user, input);
    return ok({ resume }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
