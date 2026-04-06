import { PageContainer } from "@/components/layout/page-container";

export default function AdminLoadingState() {
  return (
    <PageContainer
      title="Admin Dashboard"
      description="Birds-eye view of platform metrics and SaaS KPIs."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-5 w-32 bg-slate-200 rounded mb-4"></div>
          <div className="flex items-baseline space-x-2">
            <div className="h-10 w-16 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-5 w-24 bg-slate-200 rounded mb-4"></div>
          <div className="flex items-baseline space-x-2">
            <div className="h-10 w-16 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
