import Link from "next/link";
import { UpgradeButton } from "@/components/common/upgrade-button";
import { FadeInUp } from "@/components/layout/fade-in-up";
import { PageContainer } from "@/components/layout/page-container";
import { requireUserFromCookies } from "@/server/auth/session.service";

const baseStats = [
  { label: "Ready Flows", value: "12", tone: "text-emerald-700" },
  { label: "Pending Setup", value: "2", tone: "text-amber-700" },
];

const baseModules = [
  {
    title: "Resume Builder",
    description: "Create, edit, and preview resumes with templates and AI assistance.",
    href: "/dashboard/resume-builder",
    status: "Live",
  },
  {
    title: "Billing",
    description: "Monitor plan, checkout status, and payment infrastructure health.",
    href: "/dashboard/billing",
    status: "Configured",
  },
  {
    title: "AI Tools",
    description: "Generate smarter resume content using reusable prompt workflows.",
    href: "/dashboard/ai-tools",
    status: "Ready",
  },
];

const adminModule = {
  title: "Admin",
  description: "Review platform controls, moderation actions, and access policies.",
  href: "/dashboard/admin",
  status: "Admin",
};

export default async function DashboardOverviewPage() {
  const user = await requireUserFromCookies();
  const modules = user.role === "ADMIN" ? [...baseModules, adminModule] : baseModules;

  return (
    <PageContainer
      title="Dashboard"
      description="Manage all core modules from one place with clear status, quick actions, and delivery visibility."
      actions={<UpgradeButton />}
    >
      <div className="space-y-6">
        {/* Quick stats removed as requested */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <FadeInUp key={module.title} delay={0.06 * index}>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-semibold text-slate-900">{module.title}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {module.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={module.href}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open Module
                  </Link>
                  <Link
                    href="/dashboard/resume-builder/new"
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Quick Start
                  </Link>
                </div>
              </article>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.18}>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-900">Next recommended step</p>
            <p className="mt-1 text-sm text-blue-800">
              Create your first resume in the Resume Builder module, then use AI Tools to optimize the summary.
            </p>
          </div>
        </FadeInUp>
      </div>
    </PageContainer>
  );
}
