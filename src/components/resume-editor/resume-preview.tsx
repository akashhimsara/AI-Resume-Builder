"use client";

import type { ResumeTemplate } from "@/server/resumes/resume.schemas";
import type { ResumePreviewData } from "@/components/resume-editor/preview-sections";
import { resumeTemplateComponentMap } from "@/components/resume-editor/resume-template-components";

export type ResumeTemplateKey = ResumeTemplate;

type ResumePreviewProps = ResumePreviewData & {
  template?: ResumeTemplate;
};

export function ResumePreview({
  personalInfo,
  headline,
  summary,
  workExperiences,
  educations,
  skills,
  projects,
  certifications,
  template = "professional",
}: ResumePreviewProps) {
  const TemplateComponent = resumeTemplateComponentMap[template] ?? resumeTemplateComponentMap.professional;
  const data: ResumePreviewData = {
    personalInfo,
    headline,
    summary,
    workExperiences,
    educations,
    skills,
    projects,
    certifications,
  };

  return <TemplateComponent data={data} />;
}
