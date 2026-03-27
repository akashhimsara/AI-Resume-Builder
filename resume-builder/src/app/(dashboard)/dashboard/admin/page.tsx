import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { PageContainer } from "@/components/layout/page-container";
import { requireAdmin } from "@/server/auth/session.service";

export default async function AdminModulePage() {
  await requireAdmin({ redirectTo: "/dashboard" });

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
