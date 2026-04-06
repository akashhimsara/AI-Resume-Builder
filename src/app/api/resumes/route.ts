import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUser } from "@/server/auth/session.service";
import { createResume, listResumes } from "@/server/resumes/resume.service";
import { createResumeSchema } from "@/server/resumes/resume.schemas";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser({ request });
    const resumes = await listResumes(user.id);
    return ok({ resumes });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser({ request });
    const json = await request.json();
    const input = createResumeSchema.parse(json);

    const resume = await createResume(user.id, input);
    return ok({ resume }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
