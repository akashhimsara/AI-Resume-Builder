import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { PageContainer } from "@/components/layout/page-container";

export default function ResumeBuilderModulePage() {
  return (
    <PageContainer
      title="Resume Builder"
      description="Resume templates, editor workflows, autosave, and export capabilities."
    >
      <ModulePlaceholder
        moduleName="Resume Builder Placeholder"
        summary="Add template management, rich text blocks, ATS checks, and PDF export services."
      />
    </PageContainer>
  );
}
