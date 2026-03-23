import { UpgradeButton } from "@/components/common/upgrade-button";
import { PageContainer } from "@/components/layout/page-container";

const modules = [
  "Authentication",
  "Resume Builder",
  "Billing",
  "AI Tools",
  "Admin",
];

export default function DashboardOverviewPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Manage platform modules and accelerate feature delivery across your SaaS product."
      actions={<UpgradeButton />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{item}</p>
            <p className="mt-1 text-xs text-slate-500">Scaffolded and ready for implementation.</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
