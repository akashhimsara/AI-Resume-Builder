import { requireAdmin } from "@/server/auth/session.service";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Management | Admin",
  description: "Manage users and subscriptions.",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  await requireAdmin({ redirectTo: "/dashboard" });

  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || "";

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { fullName: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { resumes: true },
      },
      subscription: {
        select: { plan: true },
      },
    },
  });

  return (
    <PageContainer
      title="User Management"
      description="View and manage all registered users on the platform."
    >
      
      <div className="mb-6 flex justify-between items-end">
        <form className="flex w-full max-w-sm items-center gap-2">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Search by email or name..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                <th scope="col" className="px-6 py-4 font-semibold">Plan</th>
                <th scope="col" className="px-6 py-4 font-semibold">Resumes</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex flex-col">
                      <span>{user.email}</span>
                      <span className="text-xs text-slate-400 font-normal">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.subscription?.plan === "PRO"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {user.subscription?.plan || "FREE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{user._count.resumes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(user.createdAt))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Basic detail view button, currently just links to a theoretical detail page */}
                    <Link
                      href={`/dashboard/admin/users/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-xs hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
