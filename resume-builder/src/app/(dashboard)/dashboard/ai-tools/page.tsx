import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { CoverLetterGenerator } from "@/components/ai-tools/cover-letter-generator";
import { requireUserFromCookies } from "@/server/auth/session.service";
import { getUserResumes } from "@/server/resumes/resume.service";

export default async function AiToolsModulePage() {
  const user = await requireUserFromCookies();
  
  if (!user) {
    redirect("/sign-in");
  }

  const resumesFetch = await getUserResumes(user.id);
  const resumes = resumesFetch.map((r) => ({
    id: r.id,
    title: r.title,
  }));

  return (
    <PageContainer
      title="AI Intelligence Hub"
      description="Orchestrate standalone generation jobs, leveraging your resumes as source memory."
    >
      <div className="space-y-12">
        {/* Cover Letter Builder Tool */}
        <section>
          <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cover Letter Generator</h2>
              <p className="mt-1 text-sm text-slate-500">Pick a source resume and a target job. Let AI handle the narrative.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </span>
            </div>
          </div>
          
          <CoverLetterGenerator resumes={resumes} />
        </section>
        
        {/* Future Capabilities Placeholder */}
        <section className="opacity-80 pt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Coming Soon</h2>
            <p className="mt-1 text-sm text-slate-500">Future modules in active development.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 opacity-60 grayscale cursor-not-allowed">
              <h3 className="font-bold text-slate-700 mb-1">Resume Scorer</h3>
              <p className="text-xs text-slate-500">Get an automated ATS compatibility score and feedback loop based on 1M+ successful hires.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 opacity-60 grayscale cursor-not-allowed">
              <h3 className="font-bold text-slate-700 mb-1">Interview Prep Builder</h3>
              <p className="text-xs text-slate-500">Generate a custom Mock Interview plan based on your resume versus target job overlaps.</p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
