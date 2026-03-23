import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { PageContainer } from "@/components/layout/page-container";

export default function AiToolsModulePage() {
  return (
    <PageContainer
      title="AI Tools"
      description="Prompt orchestration, generation policies, and model-powered resume intelligence."
    >
      <ModulePlaceholder
        moduleName="AI Tools Placeholder"
        summary="Integrate prompt templates, quality evaluators, and asynchronous generation jobs."
      />
    </PageContainer>
  );
}
