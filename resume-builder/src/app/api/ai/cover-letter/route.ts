import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session.service";
import { generateCoverLetter } from "@/server/ai/ai.service";
import { coverLetterSchema } from "@/server/ai/ai.schemas";
import { handleRouteError } from "@/lib/http";
import { enforceAIRateLimit } from "@/server/ai/rate-limiter";
import { getResumeById } from "@/server/resumes/resume.service";

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
    const payload = coverLetterSchema.parse(json);

    // 4. Fetch the target resume ensuring security via user.id limits
    const resume = await getResumeById(user.id, payload.resumeId);
    if (!resume || !resume.versions || resume.versions.length === 0) {
      throw new Error("Target resume is empty or invalid.");
    }
    const targetVersion = resume.versions[0];

    // Build safe proxy context to avoid sending extreme nested Prisma meta-objects into OpenAI
    const safeResumeData = {
      headline: targetVersion.headline,
      professionalSummary: targetVersion.professionalSummary,
      workExperiences: targetVersion.workExperiences.map(e => ({
        company: e.company,
        role: e.role,
        description: e.description,
        achievements: e.achievements,
      })),
      educations: targetVersion.educations.map(e => ({
        institution: e.institution,
        degree: e.degree,
      })),
      skills: targetVersion.skills.map(s => s.name),
    };

    // 5. Generate cover letter
    const output = await generateCoverLetter({
      resumeData: safeResumeData,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      jobDescription: payload.jobDescription,
    });

    return NextResponse.json({ coverLetter: output });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'RESUME_NOT_FOUND') {
      return NextResponse.json({ error: { message: "The selected resume could not be found or you don't have access." } }, { status: 404 });
    }
    return handleRouteError(error);
  }
}
