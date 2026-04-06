import { PageContainer } from "@/components/layout/page-container";
import { ResumePreview } from "@/components/resume-editor/resume-preview";
import { requireUser } from "@/server/auth/session.service";
import { getResumeById } from "@/server/resumes/resume.service";
import { notFound } from "next/navigation";
import type { PersonalInfo, ResumeTemplate } from "@/server/resumes/resume.schemas";
import { AppError } from "@/lib/errors";

type PreviewResumePageProps = {
  params: Promise<{ resumeId: string }>;
};

function normalizeTemplate(value: unknown): ResumeTemplate {
  if (value === "modern" || value === "professional" || value === "minimal") {
    return value;
  }
  if (value === "modern-clean") {
    return "modern";
  }
  if (value === "classic-pro") {
    return "professional";
  }
  if (value === "bold-edge") {
    return "minimal";
  }
  return "professional";
}

export default async function PreviewResumePage({ params }: PreviewResumePageProps) {
  const { resumeId } = await params;
  const user = await requireUser({});
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

  const latestVersion = resume.versions?.[0];
  const contentJson = latestVersion?.contentJson as Record<string, unknown> | undefined;
  const savedTemplate = normalizeTemplate(contentJson?.template ?? contentJson?.theme);
  const personalInfo = {
    fullName: "",
    email: user.email,
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    ...(contentJson?.personalInfo as PersonalInfo | undefined),
  };

  return (
    <PageContainer
      title={resume.title}
      description="Preview your resume as others will see it"
    >
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <ResumePreview
          template={savedTemplate}
          personalInfo={personalInfo}
          headline={latestVersion?.headline ?? ""}
          summary={latestVersion?.professionalSummary ?? ""}
          workExperiences={(latestVersion?.workExperiences ?? []).map((exp) => ({
            id: exp.id,
            company: exp.company ?? "",
            role: exp.role ?? "",
            location: exp.location ?? "",
            startDate: exp.startDate ? exp.startDate.toISOString().slice(0, 10) : "",
            endDate: exp.endDate ? exp.endDate.toISOString().slice(0, 10) : "",
            isCurrent: exp.isCurrent,
            description: exp.description ?? "",
            achievements: exp.achievements ?? [],
          }))}
          educations={(latestVersion?.educations ?? []).map((edu) => ({
            id: edu.id,
            institution: edu.institution ?? "",
            degree: edu.degree ?? "",
            fieldOfStudy: edu.fieldOfStudy ?? "",
            location: edu.location ?? "",
            startDate: edu.startDate ? edu.startDate.toISOString().slice(0, 10) : "",
            endDate: edu.endDate ? edu.endDate.toISOString().slice(0, 10) : "",
            grade: edu.grade ?? "",
            description: edu.description ?? "",
          }))}
          skills={(latestVersion?.skills ?? []).map((skill) => ({
            id: skill.id,
            name: skill.name ?? "",
            proficiency:
              skill.proficiency === 1
                ? "Beginner"
                : skill.proficiency === 2
                ? "Intermediate"
                : skill.proficiency === 3
                ? "Advanced"
                : skill.proficiency === 4
                ? "Expert"
                : undefined,
          }))}
          projects={(latestVersion?.projects ?? []).map((project) => ({
            id: project.id,
            name: project.title ?? "",
            description: project.description ?? "",
            technologies: (project.technologies ?? []).join(", "),
            url: project.projectUrl ?? "",
            startDate: project.startDate ? project.startDate.toISOString().slice(0, 10) : "",
            endDate: project.endDate ? project.endDate.toISOString().slice(0, 10) : "",
          }))}
          certifications={(latestVersion?.certifications ?? []).map((cert) => ({
            id: cert.id,
            name: cert.name ?? "",
            issuer: cert.issuer ?? "",
            issueDate: cert.issueDate ? cert.issueDate.toISOString().slice(0, 10) : "",
            expiryDate: cert.expirationDate ? cert.expirationDate.toISOString().slice(0, 10) : "",
            url: cert.credentialUrl ?? "",
          }))}
        />
      </div>
    </PageContainer>
  );
}
