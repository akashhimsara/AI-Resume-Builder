import type { ResumeTemplate } from "@/server/resumes/resume.schemas";
import { ProfessionalResumeTemplate } from "@/components/resume-templates/professional-template";
import { ModernResumeTemplate } from "@/components/resume-templates/modern-template";
import { MinimalResumeTemplate } from "@/components/resume-templates/minimal-template";
import type { ResumePreviewData } from "@/components/resume-editor/preview-sections";

type TemplateProps = {
  data: ResumePreviewData;
};

export const resumeTemplateComponentMap: Record<
  ResumeTemplate,
  (props: TemplateProps) => React.JSX.Element
> = {
  modern: ModernResumeTemplate,
  professional: ProfessionalResumeTemplate,
  minimal: MinimalResumeTemplate,
};
