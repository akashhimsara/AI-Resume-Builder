import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/common/button";
import { MotionLinkButton } from "@/components/common/motion-link-button";
import { FadeInUp } from "@/components/layout/fade-in-up";
import { PageContainer } from "@/components/layout/page-container";
import { requireUserFromCookies } from "@/server/auth/session.service";
import {
  deleteResume,
  duplicateResume,
  listResumes,
} from "@/server/resumes/resume.service";
import { DeleteResumeDialog } from "@/components/resume-editor/delete-resume-dialog";

const iconClassName = "h-3.5 w-3.5";

function formatUpdatedAt(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

function resolveTemplateName(slug: string | null) {
  if (!slug) {
    return "Classic";
  }

  const [firstSegment] = slug.split("-");
  if (!firstSegment) {
    return "Classic";
  }

  return `${firstSegment.charAt(0).toUpperCase()}${firstSegment.slice(1)} Template`;
}

function EditIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default async function ResumeBuilderModulePage() {
  const user = await requireUserFromCookies();
  const resumes = await listResumes(user.id);

  async function handleDuplicateResume(formData: FormData) {
    "use server";

    const resumeId = formData.get("resumeId");
    if (typeof resumeId !== "string") {
      return;
    }

    const activeUser = await requireUserFromCookies();
    await duplicateResume(activeUser.id, resumeId);
    revalidatePath("/dashboard/resume-builder");
  }

  async function handleDeleteResume(formData: FormData) {
    "use server";

    const resumeId = formData.get("resumeId");
    if (typeof resumeId !== "string") {
      return;
    }

    const activeUser = await requireUserFromCookies();
    await deleteResume(activeUser.id, resumeId);
    revalidatePath("/dashboard/resume-builder");
  }

  return (
    <PageContainer
      title="My Resumes"
      description="Manage your resume collection, pick templates, and keep every version up to date."
      actions={
        <MotionLinkButton
          href="/dashboard/resume-builder/new"
          label="Create New Resume"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        />
      }
    >
      {resumes.length === 0 ? (
        <FadeInUp>
          <div className="rounded-3xl border border-slate-200 glass-panel p-12 text-center shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 leading-none opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-indigo-100/50 flex flex-col items-center justify-center border border-indigo-200">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">No resumes yet</p>
              <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
                Start with your first resume and refine it with AI suggestions, elegant templates, and live preview.
              </p>
              <div className="mt-8 flex justify-center">
                <MotionLinkButton
                  href="/dashboard/resume-builder/new"
                  label="Create Your First Resume"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
                  delay={0.08}
                />
              </div>
            </div>
          </div>
        </FadeInUp>
      ) : (
        <FadeInUp delay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div key={resume.id} className="group relative rounded-2xl glass-panel p-6 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {resume.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 mb-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600 border border-slate-200">
                      {resolveTemplateName(resume.slug)}
                    </span>
                    <span className="inline-flex items-center text-slate-400">
                      • {formatUpdatedAt(resume.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/dashboard/resume-builder/${resume.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-100 active:bg-indigo-200"
                  >
                    <EditIcon /> Edit Resume
                  </Link>
                  <div className="flex gap-2">
                    <form action={handleDuplicateResume}>
                      <input type="hidden" name="resumeId" value={resume.id} />
                      <button
                        title="Duplicate"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 bg-white border border-slate-200 shadow-sm hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
                      >
                        <DuplicateIcon />
                      </button>
                    </form>
                    <DeleteResumeDialog 
                      resumeId={resume.id} 
                      resumeTitle={resume.title} 
                      onConfirm={handleDeleteResume}
                    >
                      <button
                        title="Delete"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 bg-white border border-slate-200 shadow-sm hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
                      >
                        <DeleteIcon />
                      </button>
                    </DeleteResumeDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>
      )}
    </PageContainer>
  );
}
