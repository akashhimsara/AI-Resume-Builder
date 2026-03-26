import type { PublicUser } from "@/server/auth/auth.service";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { generateResumeDraft } from "@/server/ai/ai.service";
import type { CreateResumeInput, GenerateResumeInput } from "@/server/resumes/resume.schemas";

const FREE_PLAN_GENERATION_LIMIT = 5;
const AI_FEATURE_NAME = "resume_generation";

export async function listResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createResume(userId: string, input: CreateResumeInput) {
  return prisma.resume.create({
    data: {
      userId,
      title: input.title,
      summary: input.summary,
      contentJson: input.contentJson,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      contentJson: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function duplicateResume(userId: string, resumeId: string) {
  const source = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    select: {
      title: true,
      summary: true,
      contentJson: true,
      slug: true,
    },
  });

  if (!source) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  const duplicateTitle = source.title.endsWith("(Copy)")
    ? source.title
    : `${source.title} (Copy)`;

  return prisma.resume.create({
    data: {
      userId,
      title: duplicateTitle,
      summary: source.summary,
      contentJson: source.contentJson,
      slug: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteResume(userId: string, resumeId: string) {
  const result = await prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }
}

async function assertGenerationAllowance(userId: string) {
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (activeSubscription) {
    return;
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const count = await prisma.usageEvent.count({
    where: {
      userId,
      feature: AI_FEATURE_NAME,
      createdAt: { gte: monthStart },
    },
  });

  if (count >= FREE_PLAN_GENERATION_LIMIT) {
    throw new AppError(
      "Free plan monthly AI generation limit reached. Upgrade to continue.",
      403,
      "PLAN_LIMIT_REACHED",
    );
  }
}

export async function generateAndCreateResume(user: PublicUser, input: GenerateResumeInput) {
  await assertGenerationAllowance(user.id);

  const draft = await generateResumeDraft({
    fullName: user.fullName,
    targetRole: input.targetRole,
    yearsOfExperience: input.yearsOfExperience,
    keySkills: input.keySkills,
    careerHighlights: input.careerHighlights,
    jobDescription: input.jobDescription,
  });

  const [created] = await prisma.$transaction([
    prisma.resume.create({
      data: {
        userId: user.id,
        title: draft.title,
        summary: draft.summary,
        contentJson: draft,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        contentJson: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.usageEvent.create({
      data: {
        userId: user.id,
        feature: AI_FEATURE_NAME,
      },
    }),
  ]);

  return created;
}
