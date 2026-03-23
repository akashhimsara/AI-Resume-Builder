import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { PageContainer } from "@/components/layout/page-container";

export default function AuthenticationModulePage() {
  return (
    <PageContainer
      title="Authentication"
      description="Account, session, authorization, and security controls for your SaaS users."
    >
      <ModulePlaceholder
        moduleName="Authentication Placeholder"
        summary="Build SSO, MFA, account recovery, role policies, and audit trails in this module."
      />
    </PageContainer>
  );
}
