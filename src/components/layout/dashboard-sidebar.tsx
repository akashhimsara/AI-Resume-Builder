"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type DashboardSidebarProps = {
  role: "USER" | "ADMIN";
};

const baseNavigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/resume-builder", label: "Resume Builder" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/ai-tools", label: "AI Tools" },
];

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation =
    role === "ADMIN"
      ? [
          ...baseNavigation, 
          { href: "/dashboard/admin", label: "Admin Overview" },
          { href: "/dashboard/admin/users", label: "User Management" }
        ]
      : baseNavigation;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full border-b border-slate-200/90 bg-white p-5 lg:w-72 lg:border-r lg:border-b-0 lg:p-6"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Workspace</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">SaaS Modules</h2>
      </div>

      <nav className="space-y-1.5">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
              pathname === item.href
                ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
