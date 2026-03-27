import type { PublicUser } from "@/server/auth/auth.service";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { generateResumeDraft } from "@/server/ai/ai.service";
import type {
  CreateResumeInput,
  GenerateResumeInput,
  UpdateResumeInput,
} from "@/server/resumes/resume.schemas";

const resumeListSelect = {
  id: true,
  title: true,
  slug: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
  versions: {
    orderBy: { versionNumber: "desc" as const },
    take: 1,
    select: {
      id: true,
      versionNumber: true,
      headline: true,
      professionalSummary: true,
      updatedAt: true,
    },
  },
};

const resumeDetailSelect = {
  id: true,
  userId: true,
  title: true,
  slug: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
  versions: {
    orderBy: { versionNumber: "desc" as const },
    take: 1,
    select: {
      id: true,
      versionNumber: true,
      headline: true,
      professionalSummary: true,
      contentJson: true,
      notes: true,
      updatedAt: true,
      workExperiences: {
        orderBy: { sortOrder: "asc" as const },
      },
      educations: {
        orderBy: { sortOrder: "asc" as const },
      },
      skills: {
        orderBy: { sortOrder: "asc" as const },
      },
      projects: {
        orderBy: { sortOrder: "asc" as const },
      },
      certifications: {
        orderBy: { sortOrder: "asc" as const },
      },
    },
  },
};

export type ResumeListItem = Awaited<ReturnType<typeof getUserResumes>>[number];
export type ResumeDetail = Awaited<ReturnType<typeof getResumeById>>;

function buildCopyTitle(title: string) {
  return title.endsWith("(Copy)") ? title : `${title} (Copy)`;
}

function mapOptionalString(value: string | null | undefined) {
  return value === undefined ? undefined : value;
}

function toJsonInput(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

async function assertResumeOwnership(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!resume) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  return resume;
}

export async function getUserResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: resumeListSelect,
  });
}

export async function getResumeById(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    select: resumeDetailSelect,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  return resume;
}

export async function createResume(userId: string, input: CreateResumeInput) {
  const initialContentJson =
    input.contentJson ??
    ({
      theme: input.template ?? "modern-clean",
      language: "en",
    } as const);

  const created = await prisma.$transaction(async (tx) => {
    const resume = await tx.resume.create({
      data: {
        userId,
        title: input.title,
        slug: input.slug ?? null,
      },
      select: { id: true },
    });

    await tx.resumeVersion.create({
      data: {
        resumeId: resume.id,
        versionNumber: 1,
        headline: input.headline ?? null,
        professionalSummary: input.professionalSummary ?? null,
        contentJson: toJsonInput(initialContentJson),
        notes: input.notes ?? null,
      },
    });

    return resume;
  });

  return getResumeById(userId, created.id);
}

export async function updateResume(userId: string, resumeId: string, input: UpdateResumeInput) {
  await assertResumeOwnership(userId, resumeId);

  const hasResumeUpdate =
    input.title !== undefined || input.slug !== undefined || input.isArchived !== undefined;
  const hasVersionUpdate =
    input.headline !== undefined ||
    input.professionalSummary !== undefined ||
    input.contentJson !== undefined ||
    input.notes !== undefined;

  await prisma.$transaction(async (tx) => {
    if (hasResumeUpdate) {
      await tx.resume.update({
        where: { id: resumeId },
        data: {
          title: input.title,
          slug: input.slug === undefined ? undefined : input.slug,
          isArchived: input.isArchived,
        },
      });
    }

    if (hasVersionUpdate) {
      const latestVersion = await tx.resumeVersion.findFirst({
        where: { resumeId },
        orderBy: { versionNumber: "desc" },
        select: {
          id: true,
        },
      });

      if (latestVersion) {
        await tx.resumeVersion.update({
          where: { id: latestVersion.id },
          data: {
            headline: mapOptionalString(input.headline),
            professionalSummary: mapOptionalString(input.professionalSummary),
            contentJson: toJsonInput(input.contentJson),
            notes: mapOptionalString(input.notes),
          },
        });
      } else {
        await tx.resumeVersion.create({
          data: {
            resumeId,
            versionNumber: 1,
            headline: input.headline ?? null,
            professionalSummary: input.professionalSummary ?? null,
            contentJson: toJsonInput(input.contentJson),
            notes: input.notes ?? null,
          },
        });
      }
    }
  });

  return getResumeById(userId, resumeId);
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

export async function duplicateResume(userId: string, resumeId: string) {
  const source = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    select: {
      id: true,
      title: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
        select: {
          headline: true,
          professionalSummary: true,
          contentJson: true,
          notes: true,
          workExperiences: true,
          educations: true,
          skills: true,
          projects: true,
          certifications: true,
        },
      },
    },
  });

  if (!source) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  const sourceVersion = source.versions[0] ?? null;

  const duplicated = await prisma.$transaction(async (tx) => {
    const createdResume = await tx.resume.create({
      data: {
        userId,
        title: buildCopyTitle(source.title),
        slug: null,
      },
      select: { id: true },
    });

    if (sourceVersion) {
      await tx.resumeVersion.create({
        data: {
          resumeId: createdResume.id,
          versionNumber: 1,
          headline: sourceVersion.headline,
          professionalSummary: sourceVersion.professionalSummary,
          contentJson: toJsonInput(sourceVersion.contentJson),
          notes: sourceVersion.notes,
          workExperiences: {
            create: sourceVersion.workExperiences.map((item) => ({
              company: item.company,
              role: item.role,
              location: item.location,
              employmentType: item.employmentType,
              startDate: item.startDate,
              endDate: item.endDate,
              isCurrent: item.isCurrent,
              description: item.description,
              achievements: item.achievements,
              sortOrder: item.sortOrder,
            })),
          },
          educations: {
            create: sourceVersion.educations.map((item) => ({
              institution: item.institution,
              degree: item.degree,
              fieldOfStudy: item.fieldOfStudy,
              location: item.location,
              startDate: item.startDate,
              endDate: item.endDate,
              grade: item.grade,
              description: item.description,
              sortOrder: item.sortOrder,
            })),
          },
          skills: {
            create: sourceVersion.skills.map((item) => ({
              name: item.name,
              category: item.category,
              proficiency: item.proficiency,
              yearsOfExperience: item.yearsOfExperience,
              sortOrder: item.sortOrder,
            })),
          },
          projects: {
            create: sourceVersion.projects.map((item) => ({
              title: item.title,
              role: item.role,
              description: item.description,
              technologies: item.technologies,
              projectUrl: item.projectUrl,
              repositoryUrl: item.repositoryUrl,
              startDate: item.startDate,
              endDate: item.endDate,
              sortOrder: item.sortOrder,
            })),
          },
          certifications: {
            create: sourceVersion.certifications.map((item) => ({
              name: item.name,
              issuer: item.issuer,
              credentialId: item.credentialId,
              credentialUrl: item.credentialUrl,
              issueDate: item.issueDate,
              expirationDate: item.expirationDate,
              doesNotExpire: item.doesNotExpire,
              sortOrder: item.sortOrder,
            })),
          },
        },
      });
    }

    return createdResume;
  });

  return getResumeById(userId, duplicated.id);
}

export async function generateAndCreateResume(user: PublicUser, input: GenerateResumeInput) {
  const draft = await generateResumeDraft({
    fullName: user.fullName,
    targetRole: input.targetRole,
    yearsOfExperience: input.yearsOfExperience,
    keySkills: input.keySkills,
    careerHighlights: input.careerHighlights,
    jobDescription: input.jobDescription,
  });

  return createResume(user.id, {
    title: draft.title,
    headline: input.targetRole,
    professionalSummary: draft.summary,
    contentJson: {
      sections: draft.sections,
    },
    notes: "Generated using AI draft flow",
  });
}

export const listResumes = getUserResumes;
