import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { PageContainer } from "@/components/layout/page-container";

export default function AdminModulePage() {
  return (
    <PageContainer
      title="Admin"
      description="Operational controls, moderation tools, and system-level governance for your product."
    >
      <ModulePlaceholder
        moduleName="Admin Placeholder"
        summary="Add user management, moderation queues, support tooling, and analytics dashboards."
      />
    </PageContainer>
  );
}
