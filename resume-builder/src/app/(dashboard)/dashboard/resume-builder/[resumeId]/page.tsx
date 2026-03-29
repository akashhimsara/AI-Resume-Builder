import { redirect } from "next/navigation";
import { requireUserFromCookies } from "@/server/auth/session.service";
import { getResumeById } from "@/server/resumes/resume.service";
import { EditorClient } from "@/components/resume-editor/editor-client";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/common/button";
import Link from "next/link";

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
  params: { resumeId: string };
};

export default async function ResumeEditorPage({
  params: { resumeId },
}: ResumeEditorPageProps) {
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
  
  const resume = await getResumeById(user.id, resumeId);

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
  let personalInfo: any = {
    fullName: "",
    email: user.email,
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: "",
  };

  if (latestVersion.contentJson && typeof latestVersion.contentJson === "object") {
    const contentData = latestVersion.contentJson as any;
    if (contentData.personalInfo) {
      personalInfo = { ...personalInfo, ...contentData.personalInfo };
    }
  }

  // Map database entities to component types
  const workExperiences = (latestVersion.workExperiences || []).map((exp: any) => ({
    id: exp.id,
    company: exp.company || "",
    role: exp.role || "",
    location: exp.location,
    startDate: exp.startDate
      ? new Date(exp.startDate).toISOString().split("T")[0]
      : "",
    endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : undefined,
    isCurrent: exp.isCurrent || false,
    description: exp.description,
    achievements: exp.achievements || [],
  }));

  const educations = (latestVersion.educations || []).map((edu: any) => ({
    id: edu.id,
    institution: edu.institution || "",
    degree: edu.degree || "",
    fieldOfStudy: edu.fieldOfStudy,
    location: edu.location,
    startDate: edu.startDate
      ? new Date(edu.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : undefined,
    grade: edu.grade,
    description: edu.description,
  }));

  const skills = (latestVersion.skills || []).map((skill: any) => ({
    id: skill.id,
    name: skill.name || "",
    proficiency: skill.proficiency,
  }));

  const projects = (latestVersion.projects || []).map((proj: any) => ({
    id: proj.id,
    name: proj.name || "",
    description: proj.description,
    technologies: proj.technologies,
    url: proj.url,
    startDate: proj.startDate
      ? new Date(proj.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: proj.endDate ? new Date(proj.endDate).toISOString().split("T")[0] : undefined,
  }));

  const certifications = (latestVersion.certifications || []).map((cert: any) => ({
    id: cert.id,
    name: cert.name || "",
    issuer: cert.issuer,
    issueDate: cert.issueDate
      ? new Date(cert.issueDate).toISOString().split("T")[0]
      : undefined,
    expiryDate: cert.expiryDate
      ? new Date(cert.expiryDate).toISOString().split("T")[0]
      : undefined,
    url: cert.url,
  }));

  return (
    <PageContainer title={resume.title} description={`Last updated: ${new Date(latestVersion.updatedAt).toLocaleDateString()}`}>
      <EditorClient
        resumeId={resumeId}
        initialData={{
          personalInfo,
          headline: latestVersion.headline || "",
          summary: latestVersion.professionalSummary || "",
          workExperiences,
          educations,
          skills,
          projects,
          certifications,
        }}
      />
    </PageContainer>
  );
}
