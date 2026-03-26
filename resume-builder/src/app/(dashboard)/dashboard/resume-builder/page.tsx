import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/common/button";
import { PageContainer } from "@/components/layout/page-container";
import { requireUserFromCookies } from "@/server/auth/session.service";
import {
  deleteResume,
  duplicateResume,
  listResumes,
} from "@/server/resumes/resume.service";

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
        <Link
          href="/dashboard/resume-builder/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Create New Resume
        </Link>
      }
    >
      {resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">No resumes yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Start with a new resume, then refine it using edit and preview workflows.
          </p>
          <Link
            href="/dashboard/resume-builder/new"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Create Your First Resume
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id} className="border-t border-slate-100 bg-white">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{resume.title}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{resolveTemplateName(resume.slug)}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{formatUpdatedAt(resume.updatedAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/resume-builder/${resume.id}/edit`}
                        className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/resume-builder/${resume.id}/preview`}
                        className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Preview
                      </Link>
                      <form action={handleDuplicateResume}>
                        <input type="hidden" name="resumeId" value={resume.id} />
                        <Button
                          type="submit"
                          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Duplicate
                        </Button>
                      </form>
                      <form action={handleDeleteResume}>
                        <input type="hidden" name="resumeId" value={resume.id} />
                        <Button
                          type="submit"
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
