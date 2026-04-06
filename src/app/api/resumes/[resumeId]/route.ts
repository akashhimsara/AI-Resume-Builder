import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/http";
import { requireUser } from "@/server/auth/session.service";
import { getResumeById, updateResume } from "@/server/resumes/resume.service";
import { updateResumeSchema } from "@/server/resumes/resume.schemas";

/**
 * GET /api/resumes/[resumeId]
 * Fetch a resume for editing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const user = await requireUser({ request });
    const { resumeId } = await params;

    const resume = await getResumeById(user.id, resumeId);
    return ok({ resume });
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PATCH /api/resumes/[resumeId]
 * Update a resume (used for autosave)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const user = await requireUser({ request });
    const { resumeId } = await params;
    const json = await request.json();

    // Validate the update input
    const input = updateResumeSchema.parse(json);

    // Update the resume (ownership check is inside updateResume)
    const resume = await updateResume(user.id, resumeId, input);

    return ok({ resume });
  } catch (error) {
    return handleRouteError(error);
  }
}
