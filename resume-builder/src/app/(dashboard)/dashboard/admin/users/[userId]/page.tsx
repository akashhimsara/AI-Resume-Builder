import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/auth/session.service";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import Link from "next/link";

interface UserDetailsPageProps {
  params: Promise<{ userId?: string }>;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  await requireAdmin({ redirectTo: "/dashboard" });
  const { userId } = await params;
  if (!userId) return notFound();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      resumes: { select: { id: true, title: true, createdAt: true } },
    },
  });
  if (!user) return notFound();

  return (
    <PageContainer title="User Details" description={`Details for ${user.email}`}
      actions={<Link href="/dashboard/admin/users" className="text-sm text-blue-600 hover:underline">Back to Users</Link>}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">{user.fullName}</h2>
          <div className="text-sm text-slate-700 mb-1"><span className="font-semibold">Email:</span> {user.email}</div>
          <div className="text-sm text-slate-700 mb-1"><span className="font-semibold">Role:</span> {user.role}</div>
          <div className="text-sm text-slate-700 mb-1"><span className="font-semibold">Plan:</span> {user.subscription?.plan || "FREE"}</div>
          <div className="text-sm text-slate-700 mb-1"><span className="font-semibold">Joined:</span> {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(user.createdAt))}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-2">Resumes</h3>
          {user.resumes.length === 0 ? (
            <div className="text-slate-500 text-sm">No resumes found.</div>
          ) : (
            <ul className="space-y-2">
              {user.resumes.map((resume) => (
                <li key={resume.id} className="flex justify-between items-center">
                  <span>{resume.title || "Untitled Resume"}</span>
                  <span className="text-xs text-slate-400">{new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(resume.createdAt))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
