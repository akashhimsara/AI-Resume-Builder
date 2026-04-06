import { PageContainer } from "@/components/layout/page-container";
import { requireAdmin } from "@/server/auth/session.service";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview | AI Resume Builder",
  description: "Administrative dashboard for key metrics.",
};

export default async function AdminDashboardPage() {
  await requireAdmin({ redirectTo: "/dashboard" });

  const [
    totalUsers,
    totalResumes,
    totalAIGenerations,
    subscriptions,
    payments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.aIGeneration.count(),
    prisma.subscription.groupBy({
      by: ['plan'],
      _count: true,
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCEEDED' },
    }),
  ]);

  const proUsers = subscriptions.find(s => s.plan === "PRO")?._count || 0;
  const freeUsers = subscriptions.find(s => s.plan === "FREE")?._count || totalUsers - proUsers;
  
  // Format revenue (assumes amount is in cents)
  const totalRevenue = (payments._sum.amount || 0) / 100;

  return (
    <PageContainer
      title="Admin Dashboard"
      description="Birds-eye view of platform metrics and SaaS KPIs."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <MetricCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <MetricCard title="Total Users" value={totalUsers.toString()} />
        <MetricCard title="Pro Subscribers" value={proUsers.toString()} />
        <MetricCard title="Free Users" value={freeUsers.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Resume Activity</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-blue-600">{totalResumes}</span>
            <span className="text-sm text-slate-500 font-medium">resumes created</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">AI Usage</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-emerald-600">{totalAIGenerations}</span>
            <span className="text-sm text-slate-500 font-medium">total API requests</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function MetricCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className={`text-3xl font-extrabold text-slate-900`}>{value}</div>
    </div>
  );
}
