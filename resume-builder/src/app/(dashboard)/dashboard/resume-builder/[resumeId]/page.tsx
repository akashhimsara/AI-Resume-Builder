import { redirect } from "next/navigation";
import { requireUserFromCookies } from "@/server/auth/session.service";
import { getResumeById } from "@/server/resumes/resume.service";
import { EditorClient, type EditorInitialData } from "@/components/resume-editor/editor-client";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/common/button";
import Link from "next/link";
import type { ResumeTemplate } from "@/server/resumes/resume.schemas";

/**
 * =============================================================================
 * RESUME EDITOR PAGE - [resumeId]/page.tsx
 * 
 * This is a SERVER COMPONENT that:
 * 1. Verifies the user is authenticated
 * 2. Fetches the resume from database
 * 3. Ensures user owns this resume
 * 4. Renders the client-side editor
 * =============================================================================
 */

type ResumeEditorPageProps = {
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

export default async function ResumeEditorPage({
  params,
}: ResumeEditorPageProps) {
  const { resumeId } = await params;
  // ─────────────────────────────────────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────
  
  const user = await requireUserFromCookies();
  
  if (!user) {
    redirect("/sign-in");
  }

  // ─────────────────────────────────────────────────────────────────────
  // FETCH RESUME DATA
  // ─────────────────────────────────────────────────────────────────────
  let resume = null;
  try {
    resume = await getResumeById(user.id, resumeId);
  } catch (error: any) {
    if (error?.code !== "RESUME_NOT_FOUND") {
      throw error;
    }
  }

  if (!resume) {
    redirect("/dashboard/resume-builder");
  }

  // Extract data from resume (assume latest version is returned)
  const latestVersion = resume.versions?.[0];
  
  if (!latestVersion) {
    return (
      <PageContainer title="Resume Editor" description="No resume data found">
        <div className="space-y-4 text-center py-12">
          <p className="text-slate-600">No resume data found. Please create a new resume.</p>
          <Link href="/dashboard/resume-builder">
            <Button>Back to Resumes</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // PREPARE DATA FOR CLIENT
  // ─────────────────────────────────────────────────────────────────────
  
  // Parse personal info from contentJson or use defaults
  let personalInfo = {
    fullName: "",
    email: user.email,
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: "",
  };
  let selectedTemplate: ResumeTemplate = "professional";

  if (latestVersion.contentJson && typeof latestVersion.contentJson === "object") {
    const contentData = latestVersion.contentJson as Record<string, unknown>;
    selectedTemplate = normalizeTemplate(contentData.template ?? contentData.theme);
    if (contentData.personalInfo) {
      personalInfo = { ...personalInfo, ...(contentData.personalInfo as Record<string, string>) };
    }
  }

  // Map database entities to component types
  const workExperiences = (latestVersion.workExperiences || []).map((exp) => ({
    id: exp.id,
    company: exp.company || "",
    role: exp.role || "",
    location: exp.location || "",
    startDate: exp.startDate
      ? new Date(exp.startDate).toISOString().split("T")[0]
      : "",
    endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : undefined,
    isCurrent: exp.isCurrent || false,
    description: exp.description || "",
    achievements: exp.achievements || [],
  }));

  const educations = (latestVersion.educations || []).map((edu) => ({
    id: edu.id,
    institution: edu.institution || "",
    degree: edu.degree || "",
    fieldOfStudy: edu.fieldOfStudy || "",
    location: edu.location || "",
    startDate: edu.startDate
      ? new Date(edu.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : undefined,
    grade: edu.grade || "",
    description: edu.description || "",
  }));

  const skills = (latestVersion.skills || []).map((skill) => ({
    id: skill.id,
    name: skill.name || "",
    proficiency: (skill.proficiency === 1
        ? "Beginner"
        : skill.proficiency === 2
          ? "Intermediate"
          : skill.proficiency === 3
            ? "Advanced"
            : skill.proficiency === 4
              ? "Expert"
              : undefined) as "Beginner" | "Intermediate" | "Advanced" | "Expert" | undefined,
  }));

  const projects = (latestVersion.projects || []).map((project) => ({
    id: project.id,
    name: project.title || "",
    description: project.description || "",
    technologies: (project.technologies || []).join(", "),
    url: project.projectUrl || "",
    startDate: project.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: project.endDate
      ? new Date(project.endDate).toISOString().split("T")[0]
      : undefined,
  }));

  const certifications = (latestVersion.certifications || []).map((cert) => ({
    id: cert.id,
    name: cert.name || "",
    issuer: cert.issuer || "",
    issueDate: cert.issueDate
      ? new Date(cert.issueDate).toISOString().split("T")[0]
      : undefined,
    expiryDate: cert.expirationDate
      ? new Date(cert.expirationDate).toISOString().split("T")[0]
      : undefined,
    url: cert.credentialUrl || "",
  }));

  const initialData: EditorInitialData = {
    template: selectedTemplate,
    personalInfo,
    headline: latestVersion.headline || "",
    summary: latestVersion.professionalSummary || "",
    workExperiences,
    educations,
    skills,
    projects,
    certifications,
  };

  return (
    <PageContainer title={resume.title} description={`Last updated: ${new Date(latestVersion.updatedAt).toLocaleDateString()}`}>
      <EditorClient
        resumeId={resumeId}
        initialData={initialData}
      />
    </PageContainer>
  );
}
