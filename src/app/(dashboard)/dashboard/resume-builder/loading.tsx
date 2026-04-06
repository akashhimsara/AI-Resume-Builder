import { PageContainer } from "@/components/layout/page-container";
import { FadeInUp } from "@/components/layout/fade-in-up";

export default function ResumeBuilderLoadingState() {
  return (
    <PageContainer
      title="My Resumes"
      description="Manage your resume collection, pick templates, and keep every version up to date."
    >
      <FadeInUp>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col h-[200px] animate-pulse">
              <div className="flex-1">
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-slate-100 rounded-full"></div>
                  <div className="h-5 w-24 bg-slate-100 rounded-full"></div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                <div className="flex-1 h-10 bg-slate-100 rounded-xl"></div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeInUp>
    </PageContainer>
  );
}
