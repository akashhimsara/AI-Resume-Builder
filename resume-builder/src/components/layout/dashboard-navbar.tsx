"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/common/logout-button";

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">AI Resume Builder</p>
        <span className="hidden text-sm text-slate-500 md:inline">{pathname}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Public Site
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
