import Link from "next/link";
import { CreateResumeForm } from "@/components/forms/create-resume-form";
import { PageContainer } from "@/components/layout/page-container";

export default function NewResumePage() {
  return (
    <PageContainer
      title="Create Resume"
      description="Start with a title and template, then continue in the full editor."
      actions={
        <Link
          href="/dashboard/resume-builder"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Resumes
        </Link>
      }
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CreateResumeForm />
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-slate-100 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-200">Quick Tips</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>Use a role-based title so this resume is easy to find later.</li>
            <li>Pick a template that matches your target industry style.</li>
            <li>After creation, refine sections and bullets in the editor.</li>
          </ul>
        </aside>
      </div>
    </PageContainer>
  );
}
