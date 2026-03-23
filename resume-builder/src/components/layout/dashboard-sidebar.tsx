import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/authentication", label: "Authentication" },
  { href: "/dashboard/resume-builder", label: "Resume Builder" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/ai-tools", label: "AI Tools" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function DashboardSidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-72 lg:border-r lg:border-b-0 lg:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Workspace</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">SaaS Modules</h2>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
