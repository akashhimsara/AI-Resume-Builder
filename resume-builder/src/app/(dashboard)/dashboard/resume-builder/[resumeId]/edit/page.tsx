import { PageContainer } from "@/components/layout/page-container";
import { EditorClient } from "@/components/resume-editor/editor-client";
import { requireUser } from "@/server/auth/session.service";
import { getResumeById } from "@/server/resumes/resume.service";
import { notFound } from "next/navigation";
import type { PersonalInfo } from "@/server/resumes/resume.schemas";
import { AppError } from "@/lib/errors";

type EditResumePageProps = {
  params: Promise<{ resumeId: string }>;
};

export default async function EditResumePage({ params }: EditResumePageProps) {
  const { resumeId } = await params;

  // Check if user is logged in
  const user = await requireUser({});

  // Fetch the resume - this runs on the server (secure)
  let resume;
  try {
    resume = await getResumeById(user.id, resumeId);

    if (!resume) {
      notFound();
    }
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  // Extract personal info from contentJson
  const contentJson = resume.versions?.[0]?.contentJson as Record<string, any> | undefined;
  const personalInfo = (contentJson?.personalInfo ?? {}) as PersonalInfo;
  const headline = resume.versions?.[0]?.headline ?? undefined;
  const summary = resume.versions?.[0]?.professionalSummary ?? undefined;

  return (
    <PageContainer
      title={resume.title}
      description="Edit your resume information"
    >
      <EditorClient
        resumeId={resumeId}
        initialPersonalInfo={personalInfo}
        headline={headline}
        summary={summary}
      />
    </PageContainer>
  );
}
