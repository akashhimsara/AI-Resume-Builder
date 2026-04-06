"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogoutButton } from "@/components/common/logout-button";

export function DashboardNavbar() {
  const pathname = usePathname();
  const title = pathname === "/dashboard" ? "Overview" : pathname.split("/").pop()?.replace("-", " ");

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">AI Resume Builder</p>
          <h1 className="truncate text-xl font-bold capitalize text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Public Site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </motion.header>
  );
}
